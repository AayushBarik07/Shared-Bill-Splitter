import { describe, expect, it } from 'vitest'
import { type Balance, call, createBill, createHome, type Share } from './helpers'

describe('additional edge cases', () => {
  it('handles two simultaneous payment requests safely (race condition)', async () => {
    const { homeId } = await createHome(['Asha', 'Ben'])
    const bill = await createBill(homeId, 1000)
    const firstShare = bill.body.shares[0]
    if (!firstShare) throw new Error('bill has no shares')

    const key1 = crypto.randomUUID()
    const key2 = crypto.randomUUID()

    // Send two simultaneous payment requests with different keys
    const [res1, res2] = await Promise.all([
      call<Share>('POST', `/api/bills/${bill.body.id}/shares/${firstShare.id}/pay`, {
        headers: { 'Idempotency-Key': key1 },
      }),
      call<Share>('POST', `/api/bills/${bill.body.id}/shares/${firstShare.id}/pay`, {
        headers: { 'Idempotency-Key': key2 },
      }),
    ])

    const statuses = [res1.status, res2.status].sort()
    // Exactly one should succeed with 200, the other should be rejected with 409
    expect(statuses).toEqual([200, 409])

    const successfulRes = res1.status === 200 ? res1 : res2
    expect(successfulRes.body.paidAt).toBeTruthy()

    // Ensure the share is only paid once in balances
    const balancesRes = await call<{ balances: Balance[] }>('GET', `/api/homes/${homeId}/balances`)
    expect(balancesRes.body.balances.map((b) => b.outstandingCents)).toEqual([0, 500])
  })

  it('handles two simultaneous payment requests with the same idempotency key', async () => {
    const { homeId } = await createHome(['Asha', 'Ben'])
    const bill = await createBill(homeId, 1000)
    const firstShare = bill.body.shares[0]
    if (!firstShare) throw new Error('bill has no shares')

    const key = crypto.randomUUID()

    const [res1, res2] = await Promise.all([
      call<Share>('POST', `/api/bills/${bill.body.id}/shares/${firstShare.id}/pay`, {
        headers: { 'Idempotency-Key': key },
      }),
      call<Share>('POST', `/api/bills/${bill.body.id}/shares/${firstShare.id}/pay`, {
        headers: { 'Idempotency-Key': key },
      }),
    ])

    expect(res1.status).toBe(200)
    expect(res2.status).toBe(200)
    expect(res1.body.paidAt).toBe(res2.body.paidAt)
  })

  it('rejects empty title or title with only whitespace when creating a bill', async () => {
    const { homeId } = await createHome(['Asha'])
    const emptyTitle = await call('POST', `/api/homes/${homeId}/bills`, {
      body: { title: '   ', totalCents: 100 },
    })
    expect(emptyTitle.status).toBe(422)
  })

  it('verifies GET /api/homes and GET /api/homes/:homeId/bills', async () => {
    const { homeId } = await createHome(['Asha', 'Ben'])
    await createBill(homeId, 1500)

    const homesRes = await call<{ homes: Array<{ id: string; name: string }> }>('GET', '/api/homes')
    expect(homesRes.status).toBe(200)
    expect(homesRes.body.homes.some((h) => h.id === homeId)).toBe(true)

    const billsRes = await call<{
      bills: Array<{ id: string; title: string; totalCents: number; shares: Share[] }>
    }>('GET', `/api/homes/${homeId}/bills`)
    expect(billsRes.status).toBe(200)
    expect(billsRes.body.bills).toHaveLength(1)
    expect(billsRes.body.bills[0]?.totalCents).toBe(1500)
    expect(billsRes.body.bills[0]?.shares).toHaveLength(2)
  })
})
