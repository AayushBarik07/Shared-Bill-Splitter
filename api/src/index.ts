import { Hono } from 'hono'

const app = new Hono<{ Bindings: Env }>()

// Enable foreign key enforcement
app.use('*', async (c, next) => {
  await c.env.DB.prepare('PRAGMA foreign_keys = ON;')
    .run()
    .catch(() => null)
  await next()
})

// Health check
app.get('/api/health', (c) => {
  return c.json({ status: 'ok' })
})

// List homes (for frontend selection)
app.get('/api/homes', async (c) => {
  const result = await c.env.DB.prepare('SELECT id, name FROM homes ORDER BY rowid ASC').all<{
    id: string
    name: string
  }>()

  return c.json({ homes: result.results })
})

// Create a home
app.post('/api/homes', async (c) => {
  const body = await c.req.json<{ name?: unknown }>().catch(() => null)

  if (typeof body?.name !== 'string' || !body.name.trim()) {
    return c.json({ error: 'A valid home name is required' }, 422)
  }

  const id = crypto.randomUUID()
  const name = body.name.trim()

  await c.env.DB.prepare('INSERT INTO homes (id, name) VALUES (?, ?)').bind(id, name).run()

  return c.json({ id, name }, 201)
})

// Get a home and its members
app.get('/api/homes/:homeId', async (c) => {
  const { homeId } = c.req.param()

  const home = await c.env.DB.prepare('SELECT id, name FROM homes WHERE id = ?')
    .bind(homeId)
    .first<{ id: string; name: string }>()

  if (!home) {
    return c.json({ error: 'Home not found' }, 404)
  }

  const membersResult = await c.env.DB.prepare(
    'SELECT id, home_id, name FROM members WHERE home_id = ? ORDER BY rowid ASC',
  )
    .bind(homeId)
    .all<{ id: string; home_id: string; name: string }>()

  return c.json({
    id: home.id,
    name: home.name,
    members: membersResult.results.map((m) => ({
      id: m.id,
      homeId: m.home_id,
      name: m.name,
    })),
  })
})

// Add a member to a home
app.post('/api/homes/:homeId/members', async (c) => {
  const { homeId } = c.req.param()

  const body = await c.req.json<{ name?: unknown }>().catch(() => null)

  if (typeof body?.name !== 'string' || !body.name.trim()) {
    return c.json({ error: 'A valid member name is required' }, 422)
  }

  const home = await c.env.DB.prepare('SELECT id FROM homes WHERE id = ?').bind(homeId).first()

  if (!home) {
    return c.json({ error: 'Home not found' }, 404)
  }

  const id = crypto.randomUUID()
  const name = body.name.trim()

  await c.env.DB.prepare('INSERT INTO members (id, home_id, name) VALUES (?, ?, ?)')
    .bind(id, homeId, name)
    .run()

  return c.json({ id, homeId, name }, 201)
})

// Create and split a bill
app.post('/api/homes/:homeId/bills', async (c) => {
  const { homeId } = c.req.param()

  const home = await c.env.DB.prepare('SELECT id FROM homes WHERE id = ?').bind(homeId).first()

  if (!home) {
    return c.json({ error: 'Home not found' }, 404)
  }

  const body = await c.req.json<{ title?: unknown; totalCents?: unknown }>().catch(() => null)

  const title = body?.title
  const totalCents = body?.totalCents

  if (typeof totalCents !== 'number' || !Number.isInteger(totalCents) || totalCents <= 0) {
    return c.json({ error: 'Total amount must be a positive integer in cents' }, 422)
  }

  if (typeof title !== 'string' || !title.trim()) {
    return c.json({ error: 'A valid bill title is required' }, 422)
  }

  const membersResult = await c.env.DB.prepare(
    'SELECT id, name FROM members WHERE home_id = ? ORDER BY rowid ASC',
  )
    .bind(homeId)
    .all<{ id: string; name: string }>()

  const members = membersResult.results

  if (members.length === 0) {
    return c.json({ error: 'Cannot split a bill for a home with no members' }, 422)
  }

  const billId = crypto.randomUUID()
  const baseShare = Math.floor(totalCents / members.length)
  const remainder = totalCents % members.length

  const shares = members.map((member, index) => {
    const amountCents = baseShare + (index < remainder ? 1 : 0)
    return {
      id: crypto.randomUUID(),
      memberId: member.id,
      amountCents,
      paidAt: null as string | null,
    }
  })

  const statements = [
    c.env.DB.prepare(
      'INSERT INTO bills (id, home_id, title, total_cents) VALUES (?, ?, ?, ?)',
    ).bind(billId, homeId, title.trim(), totalCents),
    ...shares.map((share) =>
      c.env.DB.prepare(
        'INSERT INTO shares (id, bill_id, member_id, amount_cents, paid_at, idempotency_key) VALUES (?, ?, ?, ?, NULL, NULL)',
      ).bind(share.id, billId, share.memberId, share.amountCents),
    ),
  ]

  await c.env.DB.batch(statements)

  return c.json(
    {
      id: billId,
      homeId,
      title: title.trim(),
      totalCents,
      shares,
    },
    201,
  )
})

// List bills and shares for a home (read-only endpoint for frontend)
app.get('/api/homes/:homeId/bills', async (c) => {
  const { homeId } = c.req.param()

  const home = await c.env.DB.prepare('SELECT id FROM homes WHERE id = ?').bind(homeId).first()

  if (!home) {
    return c.json({ error: 'Home not found' }, 404)
  }

  const billsResult = await c.env.DB.prepare(
    'SELECT id, home_id, title, total_cents FROM bills WHERE home_id = ? ORDER BY rowid DESC',
  )
    .bind(homeId)
    .all<{ id: string; home_id: string; title: string; total_cents: number }>()

  const bills = billsResult.results

  if (bills.length === 0) {
    return c.json({ bills: [] })
  }

  const billIds = bills.map((b) => b.id)
  const placeholders = billIds.map(() => '?').join(',')

  const sharesResult = await c.env.DB.prepare(`
    SELECT s.id, s.bill_id, s.member_id, s.amount_cents, s.paid_at, m.name AS member_name
    FROM shares s
    JOIN members m ON m.id = s.member_id
    WHERE s.bill_id IN (${placeholders})
    ORDER BY m.rowid ASC
  `)
    .bind(...billIds)
    .all<{
      id: string
      bill_id: string
      member_id: string
      amount_cents: number
      paid_at: string | null
      member_name: string
    }>()

  const sharesByBill = new Map<
    string,
    Array<{
      id: string
      memberId: string
      memberName: string
      amountCents: number
      paidAt: string | null
    }>
  >()

  for (const s of sharesResult.results) {
    let list = sharesByBill.get(s.bill_id)
    if (!list) {
      list = []
      sharesByBill.set(s.bill_id, list)
    }
    list.push({
      id: s.id,
      memberId: s.member_id,
      memberName: s.member_name,
      amountCents: s.amount_cents,
      paidAt: s.paid_at,
    })
  }

  const formattedBills = bills.map((b) => ({
    id: b.id,
    homeId: b.home_id,
    title: b.title,
    totalCents: b.total_cents,
    shares: sharesByBill.get(b.id) ?? [],
  }))

  return c.json({ bills: formattedBills })
})

// Pay an individual share
app.post('/api/bills/:billId/shares/:shareId/pay', async (c) => {
  const { billId, shareId } = c.req.param()
  const rawKey = c.req.header('Idempotency-Key')

  if (!rawKey?.trim()) {
    return c.json({ error: 'Idempotency-Key header is required' }, 400)
  }

  const idempotencyKey = rawKey.trim()

  const bill = await c.env.DB.prepare('SELECT id FROM bills WHERE id = ?').bind(billId).first()

  if (!bill) {
    return c.json({ error: 'Bill not found' }, 404)
  }

  const share = await c.env.DB.prepare(
    'SELECT id, member_id, amount_cents, paid_at, idempotency_key FROM shares WHERE id = ? AND bill_id = ?',
  )
    .bind(shareId, billId)
    .first<{
      id: string
      member_id: string
      amount_cents: number
      paid_at: string | null
      idempotency_key: string | null
    }>()

  if (!share) {
    return c.json({ error: 'Share not found' }, 404)
  }

  if (share.paid_at !== null) {
    if (share.idempotency_key === idempotencyKey) {
      return c.json(
        {
          id: share.id,
          memberId: share.member_id,
          amountCents: share.amount_cents,
          paidAt: share.paid_at,
        },
        200,
      )
    }
    return c.json({ error: 'Share already paid with a different idempotency key' }, 409)
  }

  const now = new Date().toISOString()

  const updateResult = await c.env.DB.prepare(
    'UPDATE shares SET paid_at = ?, idempotency_key = ? WHERE id = ? AND bill_id = ? AND paid_at IS NULL',
  )
    .bind(now, idempotencyKey, shareId, billId)
    .run()

  if (updateResult.meta.changes > 0) {
    return c.json(
      {
        id: share.id,
        memberId: share.member_id,
        amountCents: share.amount_cents,
        paidAt: now,
      },
      200,
    )
  }

  // If changes is 0, a concurrent request completed the update first
  const latestShare = await c.env.DB.prepare(
    'SELECT id, member_id, amount_cents, paid_at, idempotency_key FROM shares WHERE id = ? AND bill_id = ?',
  )
    .bind(shareId, billId)
    .first<{
      id: string
      member_id: string
      amount_cents: number
      paid_at: string | null
      idempotency_key: string | null
    }>()

  if (latestShare && latestShare.idempotency_key === idempotencyKey) {
    return c.json(
      {
        id: latestShare.id,
        memberId: latestShare.member_id,
        amountCents: latestShare.amount_cents,
        paidAt: latestShare.paid_at,
      },
      200,
    )
  }

  return c.json({ error: 'Share already paid with a different idempotency key' }, 409)
})

// Get home balances
app.get('/api/homes/:homeId/balances', async (c) => {
  const { homeId } = c.req.param()

  const home = await c.env.DB.prepare('SELECT id FROM homes WHERE id = ?').bind(homeId).first()

  if (!home) {
    return c.json({ error: 'Home not found' }, 404)
  }

  const balancesResult = await c.env.DB.prepare(`
    SELECT
      m.id AS memberId,
      m.name AS name,
      COALESCE(
        (
          SELECT SUM(s.amount_cents)
          FROM shares s
          JOIN bills b ON b.id = s.bill_id
          WHERE s.member_id = m.id
            AND b.home_id = m.home_id
            AND s.paid_at IS NULL
        ),
        0
      ) AS outstandingCents
    FROM members m
    WHERE m.home_id = ?
    ORDER BY m.rowid ASC
  `)
    .bind(homeId)
    .all<{ memberId: string; name: string; outstandingCents: number }>()

  return c.json({ balances: balancesResult.results })
})

export default app
