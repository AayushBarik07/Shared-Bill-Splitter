
CREATE TABLE homes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    CONSTRAINT ck_homes_name CHECK (length(trim(name)) > 0)
);

CREATE TABLE members (
    id TEXT PRIMARY KEY,
    home_id TEXT NOT NULL,
    name TEXT NOT NULL,
    CONSTRAINT fk_members_home
        FOREIGN KEY (home_id) REFERENCES homes(id),
    CONSTRAINT ck_members_name CHECK (length(trim(name)) > 0)
);

CREATE TABLE bills (
    id TEXT PRIMARY KEY,
    home_id TEXT NOT NULL,
    title TEXT NOT NULL,
    total_cents INTEGER NOT NULL,
    CONSTRAINT fk_bills_home
        FOREIGN KEY (home_id) REFERENCES homes(id),
    CONSTRAINT ck_bills_total
        CHECK (total_cents > 0 AND typeof(total_cents) = 'integer')
);

CREATE TABLE shares (
    id TEXT PRIMARY KEY,
    bill_id TEXT NOT NULL,
    member_id TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    paid_at TEXT,
    idempotency_key TEXT,
    CONSTRAINT fk_shares_bill
        FOREIGN KEY (bill_id) REFERENCES bills(id),
    CONSTRAINT fk_shares_member
        FOREIGN KEY (member_id) REFERENCES members(id),
    CONSTRAINT uq_bill_member UNIQUE (bill_id, member_id),
    CONSTRAINT ck_shares_amount CHECK (amount_cents > 0)
);
