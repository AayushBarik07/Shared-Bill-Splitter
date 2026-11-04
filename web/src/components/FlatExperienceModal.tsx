import { useEffect, useState } from 'react'
import type { Balance, Bill, Home, HomeDetail } from '../types'
import {
  CartIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  FlatBuildingIcon,
  RightArrowIcon,
  UtensilsIcon,
  WifiIcon,
} from './Icons'

interface FlatExperienceModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'select' | 'create'
}

export interface CandidateShare {
  candidateId: string
  name: string
  amountRupees: number
  isPaid: boolean
  paidAt?: string | null
}

export interface FlatExpense {
  id: string
  title: string
  totalRupees: number
  icon: 'groceries' | 'dinner' | 'internet' | 'other'
  paidBy: string
  shares: CandidateShare[]
}

interface DemoFlat {
  id: string
  name: string
  members: string[]
  bills: FlatExpense[]
}

// Helper to create fairly split candidate shares with integer remainder distribution
function calculateCandidateShares(
  members: string[],
  totalRupees: number,
  paidMembers: string[] = [],
): CandidateShare[] {
  const count = members.length || 1
  const baseShare = Math.floor(totalRupees / count)
  const remainder = totalRupees % count

  return members.map((name, index) => {
    const candidateShareAmount = baseShare + (index < remainder ? 1 : 0)
    const isPaid = paidMembers.includes(name)

    return {
      candidateId: `cand-${name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      name,
      amountRupees: candidateShareAmount,
      isPaid,
      paidAt: isPaid ? new Date().toISOString() : null,
    }
  })
}

// Initial demo flats pre-seeded with rich individual candidate shares
const INITIAL_DEMO_FLATS: DemoFlat[] = [
  {
    id: 'demo-flat-4b',
    name: 'Flat 4B',
    members: ['Asha', 'Ben', 'Chitra'],
    bills: [
      {
        id: 'b-1',
        title: 'Rent',
        totalRupees: 2000,
        icon: 'other',
        paidBy: 'Asha',
        shares: calculateCandidateShares(['Asha', 'Ben', 'Chitra'], 2000, ['Asha', 'Ben']),
      },
      {
        id: 'b-2',
        title: 'Electricity Bill',
        totalRupees: 2150,
        icon: 'internet',
        paidBy: 'Ben',
        shares: calculateCandidateShares(['Asha', 'Ben', 'Chitra'], 2150, ['Ben', 'Chitra']),
      },
      {
        id: 'b-3',
        title: 'Weekend Groceries',
        totalRupees: 1840,
        icon: 'groceries',
        paidBy: 'Chitra',
        shares: calculateCandidateShares(['Asha', 'Ben', 'Chitra'], 1840, [
          'Asha',
          'Ben',
          'Chitra',
        ]),
      },
    ],
  },
  {
    id: 'demo-flat-302',
    name: 'Flat 302',
    members: ['Rahul', 'Priya', 'Kabir', 'Sneha'],
    bills: [
      {
        id: 'b-4',
        title: 'High Speed WiFi & OTT',
        totalRupees: 1999,
        icon: 'internet',
        paidBy: 'Rahul',
        shares: calculateCandidateShares(['Rahul', 'Priya', 'Kabir', 'Sneha'], 1999, [
          'Rahul',
          'Priya',
        ]),
      },
      {
        id: 'b-5',
        title: 'Monthly Groceries & Dairy',
        totalRupees: 3600,
        icon: 'groceries',
        paidBy: 'Priya',
        shares: calculateCandidateShares(['Rahul', 'Priya', 'Kabir', 'Sneha'], 3600, [
          'Rahul',
          'Priya',
          'Kabir',
        ]),
      },
    ],
  },
  {
    id: 'demo-flat-2a',
    name: 'Flat 2A',
    members: ['Dev', 'Arjun'],
    bills: [
      {
        id: 'b-6',
        title: 'Water Can & Cleaning Supplies',
        totalRupees: 650,
        icon: 'other',
        paidBy: 'Dev',
        shares: calculateCandidateShares(['Dev', 'Arjun'], 650, ['Dev']),
      },
    ],
  },
]

export function FlatExperienceModal({
  isOpen,
  onClose,
  initialMode = 'select',
}: FlatExperienceModalProps) {
  const [view, setView] = useState<'list' | 'detail' | 'create'>(
    initialMode === 'create' ? 'create' : 'list',
  )
  const [_flats, setFlats] = useState<Home[]>([])
  const [selectedFlatId, setSelectedFlatId] = useState<string>('demo-flat-4b')
  const [localFlats, setLocalFlats] = useState<DemoFlat[]>(INITIAL_DEMO_FLATS)

  // Track expanded accordion expense IDs
  const [expandedExpenseIds, setExpandedExpenseIds] = useState<Set<string>>(
    new Set(['b-1']), // default first expense expanded for instant preview
  )

  // Dedicated Candidate Breakdown Pop-up modal state
  const [popupExpense, setPopupExpense] = useState<FlatExpense | null>(null)

  // Flat creation state
  const [newFlatName, setNewFlatName] = useState('')
  const [newMembersList, setNewMembersList] = useState<string>('')
  const [createError, setCreateError] = useState<string | null>(null)

  // New expense state
  const [newExpenseTitle, setNewExpenseTitle] = useState('')
  const [newExpenseAmount, setNewExpenseAmount] = useState('')
  const [newExpensePayer, setNewExpensePayer] = useState('')
  const [newExpenseError, setNewExpenseError] = useState<string | null>(null)

  // Add flatmate state
  const [newFlatmateName, setNewFlatmateName] = useState('')

  // Backend API states
  const [apiFlatDetail, setApiFlatDetail] = useState<HomeDetail | null>(null)
  const [_apiBills, setApiBills] = useState<Bill[]>([])
  const [_apiBalances, setApiBalances] = useState<Balance[]>([])
  const [useBackend, setUseBackend] = useState<boolean>(false)

  // Fetch homes from API if available
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    const checkApi = async () => {
      try {
        const res = await fetch('/api/homes')
        if (res.ok) {
          const data = (await res.json()) as { homes: Home[] }
          if (isMounted && data.homes && data.homes.length > 0 && data.homes[0]) {
            setFlats(data.homes)
            setUseBackend(true)
            setSelectedFlatId(data.homes[0].id)
            return
          }
        }
      } catch {
        // Fallback to local demo flats
      }
      if (isMounted) {
        setUseBackend(false)
        setSelectedFlatId('demo-flat-4b')
      }
    }

    checkApi()
    return () => {
      isMounted = false
    }
  }, [isOpen])

  // Fetch detail if backend is enabled
  useEffect(() => {
    if (!useBackend || !selectedFlatId || selectedFlatId.startsWith('demo-')) return

    const loadBackendData = async () => {
      try {
        const [homeRes, billsRes, balancesRes] = await Promise.all([
          fetch(`/api/homes/${selectedFlatId}`),
          fetch(`/api/homes/${selectedFlatId}/bills`),
          fetch(`/api/homes/${selectedFlatId}/balances`),
        ])
        if (homeRes.ok && billsRes.ok && balancesRes.ok) {
          const homeData = (await homeRes.json()) as HomeDetail
          const billsData = (await billsRes.json()) as { bills: Bill[] }
          const balancesData = (await balancesRes.json()) as { balances: Balance[] }
          setApiFlatDetail(homeData)
          setApiBills(billsData.bills)
          setApiBalances(balancesData.balances)
        }
      } catch {
        // Keep current state
      }
    }
    loadBackendData()
  }, [selectedFlatId, useBackend])

  if (!isOpen) return null

  // Active flat object
  const activeLocalFlat = localFlats.find((f) => f.id === selectedFlatId) || localFlats[0]
  const currentFlatName =
    useBackend && apiFlatDetail ? apiFlatDetail.name : activeLocalFlat?.name || 'Flat 4B'
  const currentMembers =
    useBackend && apiFlatDetail
      ? apiFlatDetail.members.map((m) => m.name)
      : activeLocalFlat?.members || []

  // Total balance calculation
  const totalRupees = activeLocalFlat?.bills.reduce((sum, b) => sum + b.totalRupees, 0) || 0

  // Toggle accordion expansion for an expense
  const toggleExpenseAccordion = (expenseId: string) => {
    setExpandedExpenseIds((prev) => {
      const next = new Set(prev)
      if (next.has(expenseId)) {
        next.delete(expenseId)
      } else {
        next.add(expenseId)
      }
      return next
    })
  }

  // Toggle payment status for an individual candidate within an expense
  const handleToggleCandidatePayment = (expenseId: string, candidateName: string) => {
    setLocalFlats((prev) =>
      prev.map((flat) => {
        if (flat.id !== selectedFlatId) return flat
        const updatedBills = flat.bills.map((bill) => {
          if (bill.id !== expenseId) return bill
          const updatedShares = bill.shares.map((share) => {
            if (share.name !== candidateName) return share
            const newPaid = !share.isPaid
            return {
              ...share,
              isPaid: newPaid,
              paidAt: newPaid ? new Date().toISOString() : null,
            }
          })
          return { ...bill, shares: updatedShares }
        })
        return { ...flat, bills: updatedBills }
      }),
    )

    // Also update popup expense state if open
    if (popupExpense && popupExpense.id === expenseId) {
      setPopupExpense((prev) => {
        if (!prev) return null
        const updatedShares = prev.shares.map((share) => {
          if (share.name !== candidateName) return share
          const newPaid = !share.isPaid
          return {
            ...share,
            isPaid: newPaid,
            paidAt: newPaid ? new Date().toISOString() : null,
          }
        })
        return { ...prev, shares: updatedShares }
      })
    }
  }

  // Settle all or Reset all candidates for an expense
  const handleSetAllCandidatesPaid = (expenseId: string, markPaid: boolean) => {
    setLocalFlats((prev) =>
      prev.map((flat) => {
        if (flat.id !== selectedFlatId) return flat
        const updatedBills = flat.bills.map((bill) => {
          if (bill.id !== expenseId) return bill
          const updatedShares = bill.shares.map((share) => ({
            ...share,
            isPaid: markPaid,
            paidAt: markPaid ? new Date().toISOString() : null,
          }))
          return { ...bill, shares: updatedShares }
        })
        return { ...flat, bills: updatedBills }
      }),
    )

    if (popupExpense && popupExpense.id === expenseId) {
      setPopupExpense((prev) => {
        if (!prev) return null
        return {
          ...prev,
          shares: prev.shares.map((share) => ({
            ...share,
            isPaid: markPaid,
            paidAt: markPaid ? new Date().toISOString() : null,
          })),
        }
      })
    }
  }

  const handleCreateFlatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)

    const name = newFlatName.trim()
    if (!name) {
      setCreateError('Please enter a flat name (e.g., Flat 4B)')
      return
    }

    const members = newMembersList
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)

    const initialMembers = members.length > 0 ? members : ['Asha', 'Ben', 'Chitra']

    if (useBackend) {
      try {
        const res = await fetch('/api/homes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        })
        if (res.ok) {
          const newHome = (await res.json()) as Home
          for (const memberName of initialMembers) {
            await fetch(`/api/homes/${newHome.id}/members`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: memberName }),
            })
          }
          setFlats((prev) => [newHome, ...prev])
          setSelectedFlatId(newHome.id)
          setView('detail')
          setNewFlatName('')
          setNewMembersList('')
          return
        }
      } catch {
        // Fallback to local
      }
    }

    // Local creation
    const newId = `flat-${Date.now()}`
    const createdFlat: DemoFlat = {
      id: newId,
      name,
      members: initialMembers,
      bills: [],
    }
    setLocalFlats((prev) => [createdFlat, ...prev])
    setSelectedFlatId(newId)
    setView('detail')
    setNewFlatName('')
    setNewMembersList('')
  }

  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewExpenseError(null)

    const title = newExpenseTitle.trim()
    const amount = Number.parseFloat(newExpenseAmount)

    if (!title) {
      setNewExpenseError('Please enter an expense title')
      return
    }
    if (Number.isNaN(amount) || amount <= 0) {
      setNewExpenseError('Please enter a valid amount in ₹')
      return
    }

    const payer = newExpensePayer.trim() || currentMembers[0] || 'Flatmate'
    const newExpenseId = `bill-${Date.now()}`
    const roundedAmount = Math.round(amount)

    // Calculate individual candidate shares for all current members
    const newShares = calculateCandidateShares(currentMembers, roundedAmount, [payer])

    const iconType =
      title.toLowerCase().includes('food') || title.toLowerCase().includes('dinner')
        ? 'dinner'
        : title.toLowerCase().includes('wifi') ||
            title.toLowerCase().includes('electricity') ||
            title.toLowerCase().includes('internet')
          ? 'internet'
          : 'groceries'

    const newBill: FlatExpense = {
      id: newExpenseId,
      title,
      totalRupees: roundedAmount,
      icon: iconType,
      paidBy: payer,
      shares: newShares,
    }

    setLocalFlats((prev) =>
      prev.map((flat) => {
        if (flat.id !== selectedFlatId) return flat
        return {
          ...flat,
          bills: [newBill, ...flat.bills],
        }
      }),
    )

    // Automatically expand the newly created expense so candidates are visible immediately
    setExpandedExpenseIds((prev) => new Set([newExpenseId, ...prev]))

    setNewExpenseTitle('')
    setNewExpenseAmount('')
    setNewExpensePayer('')
  }

  const handleAddFlatmateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newFlatmateName.trim()
    if (!name) return

    setLocalFlats((prev) =>
      prev.map((flat) => {
        if (flat.id !== selectedFlatId) return flat
        if (flat.members.includes(name)) return flat
        const updatedMembers = [...flat.members, name]

        // Re-split existing bills to include the new flatmate
        const updatedBills = flat.bills.map((bill) => {
          const alreadyPaidCandidates = bill.shares.filter((s) => s.isPaid).map((s) => s.name)
          return {
            ...bill,
            shares: calculateCandidateShares(
              updatedMembers,
              bill.totalRupees,
              alreadyPaidCandidates,
            ),
          }
        })

        return {
          ...flat,
          members: updatedMembers,
          bills: updatedBills,
        }
      }),
    )
    setNewFlatmateName('')
  }

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="flat-modal-title"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          if (popupExpense) {
            setPopupExpense(null)
          } else {
            onClose()
          }
        }
      }}
    >
      <button
        type="button"
        className="modal-backdrop-btn"
        onClick={() => {
          if (popupExpense) setPopupExpense(null)
          else onClose()
        }}
        aria-label="Close dialog background"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'default',
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      <div className="modal-container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <FlatBuildingIcon size={24} color="#079B6B" />
            <h2 id="flat-modal-title" className="modal-title">
              {currentFlatName}
            </h2>
            <span className="modal-badge">No Sign-up Required</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {view === 'detail' && (
              <button
                type="button"
                className="btn-secondary"
                style={{ fontSize: '13px', padding: '6px 14px' }}
                onClick={() => setView('list')}
              >
                Switch Flat
              </button>
            )}
            {view !== 'create' && (
              <button
                type="button"
                className="btn-primary"
                style={{ fontSize: '13px', padding: '6px 14px' }}
                onClick={() => setView('create')}
              >
                + New Flat
              </button>
            )}
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* VIEW 1: SELECT FLAT */}
          {view === 'list' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0' }}>
                  Select or Switch Your Flat
                </h3>
                <p style={{ fontSize: '14px', color: '#526174', margin: 0 }}>
                  Jump right into your flat's expense dashboard without logging in.
                </p>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                {localFlats.map((flat) => (
                  <button
                    type="button"
                    key={flat.id}
                    onClick={() => {
                      setSelectedFlatId(flat.id)
                      setView('detail')
                    }}
                    style={{
                      border:
                        selectedFlatId === flat.id ? '2px solid #079B6B' : '1px solid #E4E9ED',
                      backgroundColor: selectedFlatId === flat.id ? '#EFF9F4' : '#FFFFFF',
                      borderRadius: '16px',
                      padding: '18px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: '#DDF8EC',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <FlatBuildingIcon size={20} color="#079B6B" />
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: '16px',
                            color: '#101D2B',
                          }}
                        >
                          {flat.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                          {flat.members.length} members
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#526174',
                        marginTop: '10px',
                      }}
                    >
                      Members: <span style={{ fontWeight: 600 }}>{flat.members.join(', ')}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div
                style={{
                  textAlign: 'center',
                  paddingTop: '12px',
                  borderTop: '1px solid #E4E9ED',
                }}
              >
                <button type="button" className="btn-primary" onClick={() => setView('create')}>
                  <span>+ Create Another Flat</span>
                  <RightArrowIcon size={14} />
                </button>
              </div>
            </div>
          )}

          {/* VIEW 2: CREATE NEW FLAT */}
          {view === 'create' && (
            <form onSubmit={handleCreateFlatSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px 0' }}>
                  Create a New Flat
                </h3>
                <p style={{ fontSize: '14px', color: '#526174', margin: 0 }}>
                  Give your flat a name and add flatmates who share expenses with you.
                </p>
              </div>

              {createError && (
                <div
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#FEE2E2',
                    color: '#DC2626',
                    borderRadius: '8px',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}
                >
                  {createError}
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label
                  htmlFor="flat-name-input"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#101D2B',
                    marginBottom: '6px',
                  }}
                >
                  Flat Name <span style={{ color: '#079B6B' }}>*</span>
                </label>
                <input
                  id="flat-name-input"
                  type="text"
                  placeholder="e.g. Flat 4B, Flat 302, Green Ridge 2A"
                  value={newFlatName}
                  onChange={(e) => setNewFlatName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label
                  htmlFor="flatmates-input"
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 700,
                    color: '#101D2B',
                    marginBottom: '6px',
                  }}
                >
                  Flatmate Names (comma separated)
                </label>
                <input
                  id="flatmates-input"
                  type="text"
                  placeholder="e.g. Asha, Ben, Chitra"
                  value={newMembersList}
                  onChange={(e) => setNewMembersList(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '15px',
                    outline: 'none',
                    fontFamily: 'inherit',
                  }}
                />
                <span
                  style={{
                    fontSize: '12px',
                    color: '#64748B',
                    marginTop: '4px',
                    display: 'block',
                  }}
                >
                  You can also invite or add more flatmates later.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button type="button" className="btn-secondary" onClick={() => setView('detail')}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Flat Now →
                </button>
              </div>
            </form>
          )}

          {/* VIEW 3: FLAT DASHBOARD WITH CANDIDATE EXPANSION */}
          {view === 'detail' && (
            <div>
              {/* Flat summary banner */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                  marginBottom: '24px',
                }}
              >
                {/* Total Expenses Card */}
                <div
                  style={{
                    backgroundColor: '#EDFAF3',
                    borderRadius: '16px',
                    padding: '18px',
                    border: '1px solid rgba(7, 155, 107, 0.15)',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#526174',
                      fontWeight: 600,
                    }}
                  >
                    Total Shared Expenses
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: 800,
                      color: '#101D2B',
                      marginTop: '4px',
                    }}
                  >
                    ₹{totalRupees.toLocaleString('en-IN')}
                  </div>
                  <div style={{ marginTop: '8px' }}>
                    <span className="settled-badge">
                      <CheckCircleIcon size={13} color="#079B6B" />
                      <span>{currentMembers.length} flatmates sharing</span>
                    </span>
                  </div>
                </div>

                {/* Per Person Share */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '18px',
                    border: '1px solid #E4E9ED',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#526174',
                      fontWeight: 600,
                    }}
                  >
                    Equal Share per Member
                  </div>
                  <div
                    style={{
                      fontSize: '28px',
                      fontWeight: 800,
                      color: '#079B6B',
                      marginTop: '4px',
                    }}
                  >
                    ₹
                    {Math.round(totalRupees / (currentMembers.length || 1)).toLocaleString('en-IN')}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#64748B',
                      marginTop: '8px',
                    }}
                  >
                    Divided equally among flatmates
                  </div>
                </div>

                {/* Flatmates Roster */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '18px',
                    border: '1px solid #E4E9ED',
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      color: '#526174',
                      fontWeight: 600,
                      marginBottom: '8px',
                    }}
                  >
                    Flatmates ({currentMembers.length})
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '10px',
                    }}
                  >
                    {currentMembers.map((m) => (
                      <span
                        key={m}
                        style={{
                          backgroundColor: '#F1F5F9',
                          color: '#101D2B',
                          fontWeight: 600,
                          fontSize: '12px',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                  <form onSubmit={handleAddFlatmateSubmit} style={{ display: 'flex', gap: '6px' }}>
                    <input
                      type="text"
                      placeholder="+ Add flatmate"
                      value={newFlatmateName}
                      onChange={(e) => setNewFlatmateName(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        fontSize: '12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        flex: 1,
                        outline: 'none',
                      }}
                    />
                    <button
                      type="submit"
                      className="btn-primary"
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        borderRadius: '6px',
                      }}
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>

              {/* Add Expense Form Section */}
              <div
                style={{
                  backgroundColor: '#FAFCFB',
                  borderRadius: '16px',
                  padding: '18px',
                  border: '1px solid #E4E9ED',
                  marginBottom: '24px',
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: '15px',
                    color: '#101D2B',
                    marginBottom: '12px',
                  }}
                >
                  + Record a New Shared Bill for {currentFlatName}
                </div>

                {newExpenseError && (
                  <div
                    style={{
                      padding: '8px 12px',
                      backgroundColor: '#FEE2E2',
                      color: '#DC2626',
                      borderRadius: '6px',
                      fontSize: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    {newExpenseError}
                  </div>
                )}

                <form
                  onSubmit={handleAddExpenseSubmit}
                  style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}
                >
                  <input
                    type="text"
                    placeholder="Expense name (e.g. Rent, Electricity, Groceries)"
                    value={newExpenseTitle}
                    onChange={(e) => setNewExpenseTitle(e.target.value)}
                    style={{
                      flex: 2,
                      minWidth: '200px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Amount in ₹ (e.g. 2000)"
                    value={newExpenseAmount}
                    onChange={(e) => setNewExpenseAmount(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '130px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                    }}
                  />
                  <select
                    value={newExpensePayer}
                    onChange={(e) => setNewExpensePayer(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '140px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      fontFamily: 'inherit',
                    }}
                  >
                    <option value="">Paid by: {currentMembers[0] || 'You'}</option>
                    {currentMembers.map((m) => (
                      <option key={m} value={m}>
                        Paid by: {m}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{ padding: '10px 22px', fontSize: '14px' }}
                  >
                    Add Expense
                  </button>
                </form>
              </div>

              {/* EXPENSES LIST WITH EXPANSION & INDIVIDUAL CANDIDATE DROPDOWNS */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '14px',
                    flexWrap: 'wrap',
                    gap: '8px',
                  }}
                >
                  <div>
                    <h4
                      style={{
                        fontSize: '16px',
                        fontWeight: 800,
                        color: '#101D2B',
                        margin: 0,
                      }}
                    >
                      Expenses in {currentFlatName}
                    </h4>
                    <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
                      Click any expense to expand/collapse candidate payment details
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ fontSize: '12px', padding: '5px 12px' }}
                      onClick={() => {
                        if (expandedExpenseIds.size === activeLocalFlat?.bills.length) {
                          setExpandedExpenseIds(new Set())
                        } else {
                          setExpandedExpenseIds(
                            new Set(activeLocalFlat?.bills.map((b) => b.id) || []),
                          )
                        }
                      }}
                    >
                      {expandedExpenseIds.size === activeLocalFlat?.bills.length
                        ? 'Collapse All'
                        : 'Expand All'}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {activeLocalFlat?.bills.map((bill) => {
                    const isExpanded = expandedExpenseIds.has(bill.id)
                    const totalCandidates = bill.shares.length
                    const paidCandidatesCount = bill.shares.filter((s) => s.isPaid).length
                    const isAllSettled =
                      totalCandidates > 0 && paidCandidatesCount === totalCandidates
                    const unpaidAmount = bill.shares
                      .filter((s) => !s.isPaid)
                      .reduce((sum, s) => sum + s.amountRupees, 0)

                    return (
                      <div
                        key={bill.id}
                        className={`expense-accordion ${isExpanded ? 'expanded' : ''}`}
                      >
                        {/* EXPENSE MAIN ROW (CLICKABLE TO EXPAND) */}
                        <button
                          type="button"
                          className="expense-main-row"
                          onClick={() => toggleExpenseAccordion(bill.id)}
                          style={{
                            width: '100%',
                            border: 'none',
                            textAlign: 'left',
                            fontFamily: 'inherit',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            <div
                              className={`expense-icon-box ${
                                bill.icon === 'groceries'
                                  ? 'icon-purple'
                                  : bill.icon === 'dinner'
                                    ? 'icon-orange'
                                    : 'icon-blue'
                              }`}
                            >
                              {bill.icon === 'groceries' ? (
                                <CartIcon size={16} />
                              ) : bill.icon === 'dinner' ? (
                                <UtensilsIcon size={16} />
                              ) : (
                                <WifiIcon size={16} />
                              )}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: '15px',
                                  color: '#101D2B',
                                }}
                              >
                                {bill.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: '#64748B',
                                  marginTop: '2px',
                                }}
                              >
                                Paid by <strong style={{ color: '#101D2B' }}>{bill.paidBy}</strong>{' '}
                                • Split among {totalCandidates} candidates
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                            }}
                          >
                            <div style={{ textAlign: 'right' }}>
                              <div
                                style={{
                                  fontWeight: 800,
                                  fontSize: '16px',
                                  color: '#101D2B',
                                }}
                              >
                                ₹{bill.totalRupees.toLocaleString('en-IN')}
                              </div>
                              <div
                                style={{
                                  fontSize: '11px',
                                  color: '#64748B',
                                  marginTop: '1px',
                                }}
                              >
                                ₹{Math.round(bill.totalRupees / (totalCandidates || 1))} / candidate
                              </div>
                            </div>

                            {/* Status Summary Pill */}
                            <div>
                              {isAllSettled ? (
                                <span className="status-badge-paid">
                                  <CheckCircleIcon size={13} color="#079B6B" />
                                  <span>
                                    Settled ({paidCandidatesCount}/{totalCandidates})
                                  </span>
                                </span>
                              ) : (
                                <span className="status-badge-pending">
                                  <span>
                                    {paidCandidatesCount}/{totalCandidates} Paid
                                  </span>
                                </span>
                              )}
                            </div>

                            {/* Chevron Toggle Indicator */}
                            <span
                              aria-hidden="true"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '4px',
                                color: isExpanded ? '#079B6B' : '#64748B',
                              }}
                            >
                              <ChevronDownIcon
                                size={18}
                                rotated={isExpanded}
                                color={isExpanded ? '#079B6B' : '#64748B'}
                              />
                            </span>
                          </div>
                        </button>

                        {/* SLIDE DOWN / DROPDOWN FOR INDIVIDUAL CANDIDATES */}
                        {isExpanded && (
                          <div className="expense-breakdown-panel">
                            {/* Breakdown Header Bar */}
                            <div className="breakdown-header-bar">
                              <div className="breakdown-title-wrap">
                                <span className="breakdown-title">Candidate Share Breakdown</span>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: isAllSettled ? '#079B6B' : '#B45309',
                                    fontWeight: 600,
                                  }}
                                >
                                  {isAllSettled
                                    ? '• Everyone has settled their share!'
                                    : `• ₹${unpaidAmount.toLocaleString('en-IN')} still pending`}
                                </span>
                              </div>

                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  style={{
                                    fontSize: '11px',
                                    padding: '3px 10px',
                                    borderRadius: '6px',
                                  }}
                                  onClick={() => handleSetAllCandidatesPaid(bill.id, !isAllSettled)}
                                >
                                  {isAllSettled ? 'Mark All Unpaid' : 'Settle All'}
                                </button>
                                <button
                                  type="button"
                                  className="btn-secondary"
                                  style={{
                                    fontSize: '11px',
                                    padding: '3px 10px',
                                    borderRadius: '6px',
                                  }}
                                  onClick={() => setPopupExpense(bill)}
                                >
                                  Pop-up View ↗
                                </button>
                              </div>
                            </div>

                            {/* Candidate List Cards */}
                            <div className="candidate-grid">
                              {bill.shares.map((share) => {
                                const isPayer = share.name === bill.paidBy
                                return (
                                  <div
                                    key={share.candidateId}
                                    className={`candidate-row-card ${
                                      share.isPaid ? 'paid' : 'unpaid'
                                    }`}
                                  >
                                    <div className="candidate-info-left">
                                      <div className={`candidate-avatar ${isPayer ? 'payer' : ''}`}>
                                        {share.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <div className="candidate-name">
                                          {share.name}
                                          {isPayer && (
                                            <span className="candidate-payer-tag">Payer</span>
                                          )}
                                        </div>
                                        <div className="candidate-share-val">
                                          Share: <strong>₹{share.amountRupees}</strong>
                                        </div>
                                      </div>
                                    </div>

                                    <div>
                                      {share.isPaid ? (
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                          }}
                                        >
                                          <span className="status-badge-paid">✓ Paid</span>
                                          <button
                                            type="button"
                                            className="btn-candidate-unsettle"
                                            title="Mark as unpaid"
                                            onClick={() =>
                                              handleToggleCandidatePayment(bill.id, share.name)
                                            }
                                          >
                                            Undo
                                          </button>
                                        </div>
                                      ) : (
                                        <div
                                          style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                          }}
                                        >
                                          <span className="status-badge-pending">Unpaid</span>
                                          <button
                                            type="button"
                                            className="btn-candidate-settle"
                                            onClick={() =>
                                              handleToggleCandidatePayment(bill.id, share.name)
                                            }
                                          >
                                            Settle ₹{share.amountRupees}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DEDICATED CANDIDATE BREAKDOWN POP-UP MODAL (IF USER CLICKS POP-UP VIEW) */}
      {popupExpense && (
        <div
          className="modal-overlay"
          style={{ zIndex: 110, backgroundColor: 'rgba(16, 29, 43, 0.7)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="candidate-popup-title"
        >
          <button
            type="button"
            className="modal-backdrop-btn"
            onClick={() => setPopupExpense(null)}
            aria-label="Close candidate pop-up background"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'default',
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          />
          <div
            className="modal-container"
            style={{ maxWidth: '560px', padding: 0, position: 'relative', zIndex: 2 }}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="flat-icon-badge" style={{ width: '36px', height: '36px' }}>
                  <CheckCircleIcon size={20} color="#079B6B" />
                </div>
                <div>
                  <h3
                    id="candidate-popup-title"
                    style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}
                  >
                    {popupExpense.title} — Candidate Breakdown
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Total: ₹{popupExpense.totalRupees} • Paid by {popupExpense.paidBy}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setPopupExpense(null)}
                aria-label="Close pop-up"
              >
                ✕
              </button>
            </div>

            <div className="modal-body" style={{ padding: '24px' }}>
              <p style={{ fontSize: '14px', color: '#526174', margin: '0 0 16px 0' }}>
                Individual candidate payment status for this expense:
              </p>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  marginBottom: '24px',
                }}
              >
                {popupExpense.shares.map((share) => {
                  const isPayer = share.name === popupExpense.paidBy
                  return (
                    <div
                      key={share.candidateId}
                      className={`candidate-row-card ${share.isPaid ? 'paid' : 'unpaid'}`}
                      style={{ padding: '14px 16px' }}
                    >
                      <div className="candidate-info-left">
                        <div className={`candidate-avatar ${isPayer ? 'payer' : ''}`}>
                          {share.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: '14px',
                              color: '#101D2B',
                            }}
                          >
                            {share.name}
                            {isPayer && <span className="candidate-payer-tag">Payer</span>}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            Individual Share: <strong>₹{share.amountRupees}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {share.isPaid ? (
                          <>
                            <span className="status-badge-paid">✓ Paid</span>
                            <button
                              type="button"
                              className="btn-candidate-unsettle"
                              onClick={() =>
                                handleToggleCandidatePayment(popupExpense.id, share.name)
                              }
                            >
                              Mark Unpaid
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="status-badge-pending">Unpaid</span>
                            <button
                              type="button"
                              className="btn-candidate-settle"
                              onClick={() =>
                                handleToggleCandidatePayment(popupExpense.id, share.name)
                              }
                            >
                              Settle ₹{share.amountRupees}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderTop: '1px solid #E4E9ED',
                  paddingTop: '16px',
                }}
              >
                <div style={{ fontSize: '13px', color: '#64748B' }}>
                  {popupExpense.shares.filter((s) => s.isPaid).length} of{' '}
                  {popupExpense.shares.length} candidates paid
                </div>
                <button type="button" className="btn-primary" onClick={() => setPopupExpense(null)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
