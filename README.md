# SDE Intern Assignment: Shared Bill Splitter

Welcome. In this assignment you build a small bill splitter for a shared home. It has two parts:

1. **Homes and members:** create a home and add members to it.
2. **Bill splitting:** split a bill between the members. Each member pays their own share.

The assignment is small on purpose. We want correct, safe, and clear code. We do not want many features.

## Project Overview

Shared Bill Splitter is a full-stack web application designed for shared apartments and households to split group expenses fairly and track individual balances.

Key capabilities:
- Create homes and register members.
- Create bills in integer cents and divide them equally across all members, distributing any remainder cents in member-creation order.
- Track individual member shares and payment timestamps.
- Idempotent and concurrency-safe payment processing using `Idempotency-Key` headers.
- Real-time balance calculations across all household bills.
- A responsive React dashboard displaying home members, outstanding debts, bill breakdowns, and real-time payment interactions.

## Technology Stack

- **API:** Hono v4 on Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite) with strict SQL schema constraints
- **Frontend:** React 19, TypeScript, Vite 8, TanStack Router
- **Testing:** Vitest running directly inside Cloudflare Workers runtime (`@cloudflare/vitest-plugin`)
- **Code Quality:** Biome (formatter and linter), TypeScript `strict` mode with zero `any`
- **Package Manager:** pnpm (monorepo workspace)

## Database Structure

The database consists of four relational tables defined in `api/migrations/0001_init.sql`:

1. `homes`:
   - `id` (TEXT PRIMARY KEY): Unique UUID identifier.
   - `name` (TEXT NOT NULL): Non-empty household name.
   - `CONSTRAINT ck_homes_name`: Enforces `length(trim(name)) > 0`.

2. `members`:
   - `id` (TEXT PRIMARY KEY): Unique UUID identifier.
   - `home_id` (TEXT NOT NULL): Foreign key referencing `homes(id)`.
   - `name` (TEXT NOT NULL): Member name.
   - `CONSTRAINT fk_members_home`: Enforces referential integrity with `homes`.
   - `CONSTRAINT ck_members_name`: Enforces `length(trim(name)) > 0`.
   - Physical insertion ordering is preserved via SQLite's native `rowid`.

3. `bills`:
   - `id` (TEXT PRIMARY KEY): Unique UUID identifier.
   - `home_id` (TEXT NOT NULL): Foreign key referencing `homes(id)`.
   - `title` (TEXT NOT NULL): Bill description/title.
   - `total_cents` (INTEGER NOT NULL): Total bill cost in integer cents.
   - `CONSTRAINT fk_bills_home`: Enforces referential integrity with `homes`.
   - `CONSTRAINT ck_bills_total`: Enforces `total_cents > 0 AND typeof(total_cents) = 'integer'`.

4. `shares`:
   - `id` (TEXT PRIMARY KEY): Unique UUID identifier.
   - `bill_id` (TEXT NOT NULL): Foreign key referencing `bills(id)`.
   - `member_id` (TEXT NOT NULL): Foreign key referencing `members(id)`.
   - `amount_cents` (INTEGER NOT NULL): Member's portion in cents.
   - `paid_at` (TEXT): ISO 8601 payment timestamp, initially `NULL`.
   - `idempotency_key` (TEXT): Recorded client key for idempotent replay verification.
   - `CONSTRAINT fk_shares_bill`: References `bills(id)`.
   - `CONSTRAINT fk_shares_member`: References `members(id)`.
   - `CONSTRAINT uq_bill_member`: UNIQUE constraint preventing duplicate member shares per bill.
   - `CONSTRAINT ck_shares_amount`: Enforces `amount_cents > 0`.

## API Endpoints

Every error response returns JSON formatted as `{ "error": "message" }`.

| Method | Endpoint                                 | Description                                                  | Status Codes       |
| ------ | ---------------------------------------- | ------------------------------------------------------------ | ------------------ |
| `GET`  | `/api/health`                            | Health check                                                 | 200                |
| `GET`  | `/api/homes`                             | List registered homes                                        | 200                |
| `POST` | `/api/homes`                             | Create a new home (`{ "name": string }`)                     | 201, 422           |
| `GET`  | `/api/homes/:homeId`                     | Get home details and member roster                           | 200, 404           |
| `POST` | `/api/homes/:homeId/members`             | Add a member to a home (`{ "name": string }`)                | 201, 404, 422      |
| `GET`  | `/api/homes/:homeId/bills`               | Read-only listing of all bills and shares for a home         | 200, 404           |
| `POST` | `/api/homes/:homeId/bills`               | Create and split a bill among home members                   | 201, 404, 422      |
| `POST` | `/api/bills/:billId/shares/:shareId/pay` | Pay a share idempotently (requires `Idempotency-Key` header) | 200, 400, 404, 409 |
| `GET`  | `/api/homes/:homeId/balances`            | Get outstanding unpaid balances for all home members         | 200, 404           |

## Decisions

### 1. Atomic Conditional Updates for Idempotent Concurrency Control

Payment processing for individual shares (`POST /api/bills/:billId/shares/:shareId/pay`) requires handling duplicate retries and simultaneous concurrent requests without double-paying. Instead of relying on application-level locks, we execute an atomic SQL update:
```sql
UPDATE shares
SET paid_at = ?, idempotency_key = ?
WHERE id = ? AND bill_id = ? AND paid_at IS NULL
```

- If `result.meta.changes > 0`, the current request won the race, settled the share, and returns `200`.
- If `result.meta.changes === 0`, another process has already updated the record. We immediately inspect the stored `idempotency_key`: if it matches the incoming key, the identical original `200` success payload is returned; if it differs, an HTTP `409 Conflict` is returned.
  This guarantees zero double-payments and safe idempotency even under high concurrent load.

### 2. Exact Integer Cent Splitting with Deterministic Remainder Distribution

To prevent floating-point rounding errors and preserve conservation of funds ($\sum \text{shares} = \text{totalCents}$), monetary amounts are strictly validated as positive integers (`Number.isInteger(totalCents) && totalCents > 0`). When splitting a bill of $T$ cents across $N$ members:
- Base share: $\lfloor T / N \rfloor$
- Remainder cents: $R = T \pmod N$
- The extra $R$ cents are assigned one-by-one to the first $R$ members ordered by their initial creation order (`ORDER BY rowid ASC`).
  This ensures an exact cent sum without losing or fabricating fractions of a cent.

### 3. All-or-Nothing Batch Transactions for Bill Creation

A bill split must never produce an orphaned bill record without shares, or a partial share list if an error occurs mid-execution. We use Cloudflare D1's native transaction batching API (`await c.env.DB.batch([...])`) to execute the bill insertion and all member share insertions within a single atomic database transaction. If any constraint fails, the entire batch rolls back cleanly.

## Setup Instructions

### Prerequisites

- Node.js v20+
- pnpm v9+

### Installation

Clone the repository and install workspace dependencies:
```bash
pnpm install
```

## Running the Application

Start both the backend API (port 8787) and frontend web application (port 5173) concurrently:
```bash
pnpm dev
```

- API health check: `http://localhost:8787/api/health`
- Frontend dashboard: `http://localhost:5173`

Migrations are automatically applied to the local D1 database on startup.

## Testing Instructions

Run the complete Vitest test suite inside the Cloudflare Workers test environment:
```bash
pnpm test
```

Run code formatting and lint verification:
```bash
pnpm check
```

Run TypeScript compilation verification across both packages:
```bash
pnpm typecheck
```

Build the production web bundle:
```bash
pnpm build
```

## Cases Handled

1. **Home with no members:** `POST /api/homes/:homeId/bills` rejects bill creation with HTTP 422.
2. **Invalid bill amounts:** Rejects amounts that are 0, negative, decimal floats, stringified numbers, or non-numeric types with HTTP 422.
3. **Uneven bill splitting:** Remainder cents are allocated one by one according to member-creation sequence; total shares always sum exactly to `totalCents`.
4. **Repeated payment with same idempotency key:** Returns original HTTP 200 payload with the identical timestamp.
5. **Two members paying simultaneously / Race condition:** Database conditional update ensures exactly one payment succeeds (HTTP 200) while the other receives HTTP 409 Conflict.
6. **Missing resources:** Returns HTTP 404 if a home, bill, or share does not exist.
7. **Resilient UI:** Gracefully handles slow network requests, displays empty/loading/error states, and ensures failed payments leave the share unpaid without crashing.

## Submission Information

To complete your submission:
1. Push your work to a **public GitHub repository**.
2. Record a walkthrough video (3 minutes or less, unlisted YouTube or Loom) explaining:
   - System architecture (Workers + D1 + React frontend).
   - Data flow (bill creation -> share allocation -> idempotent payment -> balance recalculation).
   - One technical trade-off (e.g. SQLite conditional update vs distributed locking).
3. Submit the GitHub repository link and video link in the intern application form.
