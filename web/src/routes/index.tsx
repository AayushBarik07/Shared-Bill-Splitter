import { createFileRoute } from '@tanstack/react-router'
import { useCallback, useEffect, useState } from 'react'
import type { Balance, Bill, Home, HomeDetail, Member } from '../types'

export const Route = createFileRoute('/')({
  component: BillSplitterApp,
})

function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString)
    return d.toLocaleString()
  } catch {
    return isoString
  }
}

export function BillSplitterApp() {
  const [homes, setHomes] = useState<Home[]>([])
  const [selectedHomeId, setSelectedHomeId] = useState<string>('')
  const [homeDetail, setHomeDetail] = useState<HomeDetail | null>(null)
  const [bills, setBills] = useState<Bill[]>([])
  const [balances, setBalances] = useState<Balance[]>([])

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Paying state: shareId -> boolean
  const [payingShareId, setPayingShareId] = useState<string | null>(null)
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({})

  // New bill form state
  const [billTitle, setBillTitle] = useState<string>('')
  const [billAmountCents, setBillAmountCents] = useState<string>('')
  const [isSubmittingBill, setIsSubmittingBill] = useState<boolean>(false)
  const [billFormError, setBillFormError] = useState<string | null>(null)

  // Fetch homes list
  const fetchHomes = useCallback(async () => {
    try {
      const res = await fetch('/api/homes')
      if (!res.ok) {
        throw new Error(`Failed to load homes (${res.status})`)
      }
      const data = (await res.json()) as { homes: Home[] }
      setHomes(data.homes)
      if (data.homes.length > 0 && !selectedHomeId) {
        // Prefer 'Flat 4B' if available, otherwise first
        const flat4B = data.homes.find((h) => h.name === 'Flat 4B')
        setSelectedHomeId(flat4B ? flat4B.id : (data.homes[0]?.id ?? ''))
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error fetching homes'
      setError(msg)
    }
  }, [selectedHomeId])

  // Fetch home details, bills, and balances
  const loadHomeData = useCallback(async (homeId: string) => {
    if (!homeId) return
    setIsLoading(true)
    setError(null)
    setPaymentErrors({})

    try {
      const [homeRes, billsRes, balancesRes] = await Promise.all([
        fetch(`/api/homes/${homeId}`),
        fetch(`/api/homes/${homeId}/bills`),
        fetch(`/api/homes/${homeId}/balances`),
      ])

      if (!homeRes.ok) {
        throw new Error(`Failed to fetch home details (HTTP ${homeRes.status})`)
      }
      if (!billsRes.ok) {
        throw new Error(`Failed to fetch bills (HTTP ${billsRes.status})`)
      }
      if (!balancesRes.ok) {
        throw new Error(`Failed to fetch balances (HTTP ${balancesRes.status})`)
      }

      const homeData = (await homeRes.json()) as HomeDetail
      const billsData = (await billsRes.json()) as { bills: Bill[] }
      const balancesData = (await balancesRes.json()) as { balances: Balance[] }

      setHomeDetail(homeData)
      setBills(billsData.bills)
      setBalances(balancesData.balances)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to communicate with API server'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchHomes()
  }, [fetchHomes])

  useEffect(() => {
    if (selectedHomeId) {
      loadHomeData(selectedHomeId)
    }
  }, [selectedHomeId, loadHomeData])

  // Pay share handler
  const handlePayShare = async (billId: string, shareId: string) => {
    setPayingShareId(shareId)
    // Clear previous error for this share
    setPaymentErrors((prev) => {
      const updated = { ...prev }
      delete updated[shareId]
      return updated
    })

    const idempotencyKey = crypto.randomUUID()

    try {
      const res = await fetch(`/api/bills/${billId}/shares/${shareId}/pay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
      })

      const data = (await res.json().catch(() => null)) as {
        id?: string
        paidAt?: string
        error?: string
      } | null

      if (!res.ok || !data?.paidAt) {
        const errorMsg = data?.error || `Payment failed (HTTP ${res.status})`
        setPaymentErrors((prev) => ({ ...prev, [shareId]: errorMsg }))
        return
      }

      // Optimistically / locally update the share as paid
      setBills((prevBills) =>
        prevBills.map((b) => {
          if (b.id !== billId) return b
          return {
            ...b,
            shares: b.shares.map((s) =>
              s.id === shareId ? { ...s, paidAt: data.paidAt ?? null } : s,
            ),
          }
        }),
      )

      // Refresh balances in the background
      if (selectedHomeId) {
        const balRes = await fetch(`/api/homes/${selectedHomeId}/balances`)
        if (balRes.ok) {
          const balData = (await balRes.json()) as { balances: Balance[] }
          setBalances(balData.balances)
        }
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Network error occurred. The share remains unpaid.'
      setPaymentErrors((prev) => ({ ...prev, [shareId]: msg }))
    } finally {
      setPayingShareId(null)
    }
  }

  // Create Bill handler
  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault()
    setBillFormError(null)

    if (!billTitle.trim()) {
      setBillFormError('Please enter a bill title')
      return
    }

    const totalCents = Number.parseInt(billAmountCents, 10)
    if (Number.isNaN(totalCents) || totalCents <= 0) {
      setBillFormError('Amount must be a whole positive number in cents (e.g. 1000 for $10.00)')
      return
    }

    if (!selectedHomeId) {
      setBillFormError('No home selected')
      return
    }

    setIsSubmittingBill(true)

    try {
      const res = await fetch(`/api/homes/${selectedHomeId}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: billTitle.trim(),
          totalCents,
        }),
      })

      const data = (await res.json().catch(() => null)) as (Bill & { error?: string }) | null

      if (!res.ok) {
        setBillFormError(data?.error || `Failed to create bill (HTTP ${res.status})`)
        return
      }

      // Reset form
      setBillTitle('')
      setBillAmountCents('')

      // Reload home data
      await loadHomeData(selectedHomeId)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error creating bill'
      setBillFormError(msg)
    } finally {
      setIsSubmittingBill(false)
    }
  }

  // Split calculation preview
  const members = homeDetail?.members ?? []
  const previewCents = Number.parseInt(billAmountCents, 10)
  const isPreviewValid = !Number.isNaN(previewCents) && previewCents > 0 && members.length > 0

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        padding: '32px 16px',
      }}
    >
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 32,
            paddingBottom: 20,
            borderBottom: '1px solid #334155',
            gap: 16,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                fontWeight: 700,
                color: '#38bdf8',
                letterSpacing: '-0.02em',
              }}
            >
              Shared Bill Splitter
            </h1>
            <p style={{ margin: '4px 0 0 0', color: '#94a3b8', fontSize: 14 }}>
              Equitable expense sharing and idempotent member settlement
            </p>
          </div>

          {/* Home selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label
              htmlFor="home-select"
              style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500 }}
            >
              Select Home:
            </label>
            <select
              id="home-select"
              value={selectedHomeId}
              onChange={(e) => setSelectedHomeId(e.target.value)}
              style={{
                backgroundColor: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #475569',
                borderRadius: 6,
                padding: '8px 14px',
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              {homes.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.id.slice(0, 8)}...)
                </option>
              ))}
            </select>
          </div>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div
            style={{
              backgroundColor: '#450a0a',
              border: '1px solid #991b1b',
              color: '#fca5a5',
              padding: '16px 20px',
              borderRadius: 8,
              marginBottom: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong style={{ display: 'block', marginBottom: 4 }}>Request Failed</strong>
              <span style={{ fontSize: 14 }}>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => selectedHomeId && loadHomeData(selectedHomeId)}
              style={{
                backgroundColor: '#991b1b',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                padding: '6px 14px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Main Content */}
        {isLoading ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#94a3b8',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: 36,
                height: 36,
                border: '3px solid #334155',
                borderTopColor: '#38bdf8',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: 16,
              }}
            />
            <div style={{ fontSize: 16 }}>Loading home details and bills...</div>
            <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Home Info & Balances Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 20,
              }}
            >
              {/* Home & Members Card */}
              <div
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: 10,
                  padding: 20,
                  border: '1px solid #334155',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 12,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 600,
                      color: '#f1f5f9',
                    }}
                  >
                    Home: {homeDetail?.name ?? 'Flat 4B'}
                  </h2>
                  <span
                    style={{
                      fontSize: 12,
                      color: '#64748b',
                      fontFamily: 'monospace',
                    }}
                  >
                    {homeDetail?.id ? `${homeDetail.id.slice(0, 13)}...` : ''}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12 }}>
                  Members ({members.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {members.map((m: Member, idx: number) => (
                    <span
                      key={m.id}
                      style={{
                        backgroundColor: '#0f172a',
                        border: '1px solid #334155',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontSize: 13,
                        color: '#e2e8f0',
                      }}
                    >
                      <span style={{ color: '#38bdf8', marginRight: 4 }}>#{idx + 1}</span>
                      {m.name}
                    </span>
                  ))}
                  {members.length === 0 && (
                    <span style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
                      No members registered
                    </span>
                  )}
                </div>
              </div>

              {/* Outstanding Balances Card */}
              <div
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: 10,
                  padding: 20,
                  border: '1px solid #334155',
                }}
              >
                <h2
                  style={{
                    margin: '0 0 12px 0',
                    fontSize: 18,
                    fontWeight: 600,
                    color: '#f1f5f9',
                  }}
                >
                  Outstanding Balances
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {balances.map((b) => (
                    <div
                      key={b.memberId}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: '#0f172a',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #334155',
                      }}
                    >
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{b.name}</span>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: 14,
                          color: b.outstandingCents > 0 ? '#f59e0b' : '#10b981',
                        }}
                      >
                        {formatCurrency(b.outstandingCents)}
                        <span
                          style={{
                            fontSize: 11,
                            color: '#64748b',
                            marginLeft: 6,
                            fontWeight: 400,
                          }}
                        >
                          ({b.outstandingCents}¢)
                        </span>
                      </span>
                    </div>
                  ))}
                  {balances.length === 0 && (
                    <div style={{ color: '#64748b', fontSize: 13, fontStyle: 'italic' }}>
                      No balance records
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Create & Split Bill Card */}
            <div
              style={{
                backgroundColor: '#1e293b',
                borderRadius: 10,
                padding: 20,
                border: '1px solid #334155',
              }}
            >
              <h2
                style={{
                  margin: '0 0 16px 0',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#f1f5f9',
                }}
              >
                Create & Split a New Bill
              </h2>

              <form onSubmit={handleCreateBill}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: 16,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label
                      htmlFor="bill-title"
                      style={{
                        display: 'block',
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#cbd5e1',
                        marginBottom: 6,
                      }}
                    >
                      Bill Title
                    </label>
                    <input
                      id="bill-title"
                      type="text"
                      placeholder="e.g. Electricity, Groceries, Internet"
                      value={billTitle}
                      onChange={(e) => setBillTitle(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: '#0f172a',
                        border: '1px solid #475569',
                        borderRadius: 6,
                        padding: '10px 12px',
                        color: '#f8fafc',
                        fontSize: 14,
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="bill-cents"
                      style={{
                        display: 'block',
                        fontSize: 13,
                        fontWeight: 500,
                        color: '#cbd5e1',
                        marginBottom: 6,
                      }}
                    >
                      Total Amount (in whole cents)
                    </label>
                    <input
                      id="bill-cents"
                      type="number"
                      step="1"
                      min="1"
                      placeholder="e.g. 1000 for $10.00"
                      value={billAmountCents}
                      onChange={(e) => setBillAmountCents(e.target.value)}
                      style={{
                        width: '100%',
                        boxSizing: 'border-box',
                        backgroundColor: '#0f172a',
                        border: '1px solid #475569',
                        borderRadius: 6,
                        padding: '10px 12px',
                        color: '#f8fafc',
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>

                {/* Split preview */}
                {isPreviewValid && (
                  <div
                    style={{
                      backgroundColor: '#0f172a',
                      padding: '10px 14px',
                      borderRadius: 6,
                      border: '1px solid #334155',
                      marginBottom: 16,
                      fontSize: 13,
                      color: '#cbd5e1',
                    }}
                  >
                    <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                      Split Preview ({formatCurrency(previewCents)} total):
                    </span>
                    <span style={{ marginLeft: 8 }}>
                      {members.map((m, idx) => {
                        const baseShare = Math.floor(previewCents / members.length)
                        const remainder = previewCents % members.length
                        const share = baseShare + (idx < remainder ? 1 : 0)
                        return (
                          <span key={m.id} style={{ marginRight: 12 }}>
                            {m.name}: <strong>{formatCurrency(share)}</strong> ({share}¢)
                          </span>
                        )
                      })}
                    </span>
                  </div>
                )}

                {billFormError && (
                  <div
                    style={{
                      color: '#f87171',
                      fontSize: 13,
                      marginBottom: 14,
                      padding: '8px 12px',
                      backgroundColor: '#450a0a',
                      borderRadius: 6,
                      border: '1px solid #7f1d1d',
                    }}
                  >
                    {billFormError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingBill || members.length === 0}
                  style={{
                    backgroundColor: isSubmittingBill ? '#475569' : '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 6,
                    padding: '10px 20px',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: isSubmittingBill ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSubmittingBill ? 'Splitting Bill...' : 'Split & Save Bill'}
                </button>
              </form>
            </div>

            {/* Bills Section */}
            <div>
              <h2
                style={{
                  margin: '0 0 16px 0',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#f1f5f9',
                }}
              >
                Bills & Shares
              </h2>

              {bills.length === 0 ? (
                /* Empty state */
                <div
                  style={{
                    backgroundColor: '#1e293b',
                    borderRadius: 10,
                    padding: '48px 24px',
                    textAlign: 'center',
                    border: '1px dashed #475569',
                  }}
                >
                  <p
                    style={{
                      margin: '0 0 8px 0',
                      fontSize: 16,
                      fontWeight: 500,
                      color: '#cbd5e1',
                    }}
                  >
                    No bills recorded for this home yet
                  </p>
                  <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>
                    Use the form above to add a bill and split expenses equally among members.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {bills.map((bill) => {
                    const paidSharesCount = bill.shares.filter((s) => s.paidAt !== null).length
                    const totalSharesCount = bill.shares.length
                    const isAllPaid = totalSharesCount > 0 && paidSharesCount === totalSharesCount

                    return (
                      <div
                        key={bill.id}
                        style={{
                          backgroundColor: '#1e293b',
                          borderRadius: 10,
                          padding: 20,
                          border: '1px solid #334155',
                        }}
                      >
                        {/* Bill Header */}
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 16,
                            paddingBottom: 12,
                            borderBottom: '1px solid #334155',
                            gap: 8,
                          }}
                        >
                          <div>
                            <h3
                              style={{
                                margin: 0,
                                fontSize: 17,
                                fontWeight: 600,
                                color: '#f8fafc',
                              }}
                            >
                              {bill.title}
                            </h3>
                            <span
                              style={{
                                fontSize: 12,
                                color: '#64748b',
                                fontFamily: 'monospace',
                              }}
                            >
                              ID: {bill.id}
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span
                              style={{
                                fontSize: 16,
                                fontWeight: 700,
                                color: '#38bdf8',
                              }}
                            >
                              {formatCurrency(bill.totalCents)}
                              <span
                                style={{
                                  fontSize: 12,
                                  color: '#64748b',
                                  marginLeft: 4,
                                  fontWeight: 400,
                                }}
                              >
                                ({bill.totalCents}¢)
                              </span>
                            </span>

                            <span
                              style={{
                                backgroundColor: isAllPaid ? '#064e3b' : '#334155',
                                color: isAllPaid ? '#34d399' : '#94a3b8',
                                fontSize: 12,
                                fontWeight: 600,
                                padding: '4px 8px',
                                borderRadius: 4,
                              }}
                            >
                              {paidSharesCount} / {totalSharesCount} Paid
                            </span>
                          </div>
                        </div>

                        {/* Shares Table / List */}
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 10,
                          }}
                        >
                          {bill.shares.map((share) => {
                            const isPaid = share.paidAt !== null
                            const isPaying = payingShareId === share.id
                            const shareError = paymentErrors[share.id]

                            return (
                              <div
                                key={share.id}
                                style={{
                                  backgroundColor: '#0f172a',
                                  padding: '12px 16px',
                                  borderRadius: 8,
                                  border: '1px solid #1e293b',
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  gap: 12,
                                }}
                              >
                                <div>
                                  <div
                                    style={{
                                      fontSize: 14,
                                      fontWeight: 600,
                                      color: '#f1f5f9',
                                    }}
                                  >
                                    {share.memberName ??
                                      members.find((m) => m.id === share.memberId)?.name ??
                                      `Member (${share.memberId.slice(0, 8)})`}
                                  </div>
                                  <div style={{ fontSize: 12, color: '#64748b' }}>
                                    Share amount:{' '}
                                    <strong>{formatCurrency(share.amountCents)}</strong> (
                                    {share.amountCents}¢)
                                  </div>
                                </div>

                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    flexWrap: 'wrap',
                                  }}
                                >
                                  {isPaid ? (
                                    <div style={{ textAlign: 'right' }}>
                                      <span
                                        style={{
                                          backgroundColor: '#064e3b',
                                          color: '#34d399',
                                          fontSize: 12,
                                          fontWeight: 600,
                                          padding: '4px 10px',
                                          borderRadius: 4,
                                          display: 'inline-block',
                                        }}
                                      >
                                        ✓ Paid
                                      </span>
                                      {share.paidAt && (
                                        <div
                                          style={{
                                            fontSize: 11,
                                            color: '#64748b',
                                            marginTop: 3,
                                          }}
                                        >
                                          {formatDate(share.paidAt)}
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                      }}
                                    >
                                      <span
                                        style={{
                                          backgroundColor: '#451a03',
                                          color: '#fbbf24',
                                          fontSize: 12,
                                          fontWeight: 600,
                                          padding: '4px 8px',
                                          borderRadius: 4,
                                        }}
                                      >
                                        Unpaid
                                      </span>

                                      <button
                                        type="button"
                                        onClick={() => handlePayShare(bill.id, share.id)}
                                        disabled={isPaying}
                                        style={{
                                          backgroundColor: isPaying ? '#475569' : '#059669',
                                          color: '#ffffff',
                                          border: 'none',
                                          borderRadius: 6,
                                          padding: '6px 14px',
                                          fontSize: 13,
                                          fontWeight: 600,
                                          cursor: isPaying ? 'not-allowed' : 'pointer',
                                          display: 'flex',
                                          alignItems: 'center',
                                          gap: 6,
                                        }}
                                      >
                                        {isPaying ? 'Paying...' : 'Pay Share'}
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Inline payment error if any */}
                                {shareError && (
                                  <div
                                    style={{
                                      width: '100%',
                                      color: '#f87171',
                                      fontSize: 12,
                                      backgroundColor: '#450a0a',
                                      padding: '6px 10px',
                                      borderRadius: 4,
                                      border: '1px solid #7f1d1d',
                                    }}
                                  >
                                    Payment error: {shareError} (Share remains unpaid)
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
