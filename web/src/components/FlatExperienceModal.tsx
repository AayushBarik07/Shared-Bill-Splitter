import { useEffect, useState } from 'react'
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

export interface FlatGroup {
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

// The 3 dedicated flats with exact dedicated members and authentic expenses
const DEFAULT_FLATS: FlatGroup[] = [
  {
    id: 'flat-4b',
    name: 'Flat 4B',
    members: ['Asha', 'Ben', 'Chitra'],
    bills: [
      {
        id: 'bill-4b-1',
        title: 'Rent',
        totalRupees: 2000,
        icon: 'other',
        paidBy: 'Asha',
        shares: calculateCandidateShares(['Asha', 'Ben', 'Chitra'], 2000, ['Asha', 'Ben']),
      },
      {
        id: 'bill-4b-2',
        title: 'Electricity Bill',
        totalRupees: 2150,
        icon: 'internet',
        paidBy: 'Ben',
        shares: calculateCandidateShares(['Asha', 'Ben', 'Chitra'], 2150, ['Ben', 'Chitra']),
      },
      {
        id: 'bill-4b-3',
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
    id: 'flat-302',
    name: 'Flat 302',
    members: ['Rahul', 'Priya', 'Kabir', 'Sneha'],
    bills: [
      {
        id: 'bill-302-1',
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
        id: 'bill-302-2',
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
      {
        id: 'bill-302-3',
        title: 'Maintenance & Water',
        totalRupees: 1400,
        icon: 'other',
        paidBy: 'Kabir',
        shares: calculateCandidateShares(['Rahul', 'Priya', 'Kabir', 'Sneha'], 1400, [
          'Kabir',
          'Sneha',
        ]),
      },
    ],
  },
  {
    id: 'flat-2a',
    name: 'Flat 2A',
    members: ['Dev', 'Arjun'],
    bills: [
      {
        id: 'bill-2a-1',
        title: 'Water Can & Cleaning Supplies',
        totalRupees: 650,
        icon: 'other',
        paidBy: 'Dev',
        shares: calculateCandidateShares(['Dev', 'Arjun'], 650, ['Dev']),
      },
      {
        id: 'bill-2a-2',
        title: 'Gas Cylinder & Utilities',
        totalRupees: 950,
        icon: 'other',
        paidBy: 'Arjun',
        shares: calculateCandidateShares(['Dev', 'Arjun'], 950, ['Arjun', 'Dev']),
      },
    ],
  },
]

function getInitialFlats(): FlatGroup[] {
  try {
    const saved = localStorage.getItem('bill_splitter_flats_v2')
    if (saved) {
      const parsed = JSON.parse(saved) as FlatGroup[]
      if (Array.isArray(parsed) && parsed.length >= 3) {
        return parsed
      }
    }
  } catch {
    // Fallback to defaults
  }
  return DEFAULT_FLATS
}

export function FlatExperienceModal({
  isOpen,
  onClose,
  initialMode = 'select',
}: FlatExperienceModalProps) {
  const [view, setView] = useState<'list' | 'detail' | 'create'>(
    initialMode === 'create' ? 'create' : 'list',
  )
  const [flats, setFlats] = useState<FlatGroup[]>(getInitialFlats)
  const [selectedFlatId, setSelectedFlatId] = useState<string>('flat-4b')

  // Save to localStorage when flats change
  useEffect(() => {
    try {
      localStorage.setItem('bill_splitter_flats_v2', JSON.stringify(flats))
    } catch {
      // Ignore storage error
    }
  }, [flats])

  // Track expanded accordion expense IDs
  const [expandedExpenseIds, setExpandedExpenseIds] = useState<Set<string>>(
    new Set(['bill-4b-1', 'bill-302-1', 'bill-2a-1']),
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

  if (!isOpen) return null

  // Active flat object - strictly derived from currently selected flat ID
  const fallbackFlat: FlatGroup = DEFAULT_FLATS[0] ?? {
    id: 'flat-4b',
    name: 'Flat 4B',
    members: ['Asha', 'Ben', 'Chitra'],
    bills: [],
  }
  const currentFlat: FlatGroup =
    flats.find((f) => f.id === selectedFlatId) ?? flats[0] ?? fallbackFlat

  // Total balance calculation for this specific flat
  const totalRupees = currentFlat.bills.reduce((sum, b) => sum + b.totalRupees, 0)

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
    setFlats((prevFlats) =>
      prevFlats.map((flat) => {
        if (flat.id !== currentFlat.id) return flat
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

    // Update popup expense state if open
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
    setFlats((prevFlats) =>
      prevFlats.map((flat) => {
        if (flat.id !== currentFlat.id) return flat
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

  // Create a new flat
  const handleCreateFlatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)

    const name = newFlatName.trim()
    if (!name) {
      setCreateError('Please enter a flat name (e.g., Flat 5C, Flat 101)')
      return
    }

    const members = newMembersList
      .split(',')
      .map((m) => m.trim())
      .filter((m) => m.length > 0)

    const initialMembers = members.length > 0 ? members : ['Asha', 'Ben']

    const newId = `flat-${Date.now()}`
    const createdFlat: FlatGroup = {
      id: newId,
      name,
      members: initialMembers,
      bills: [],
    }

    setFlats((prev) => [createdFlat, ...prev])
    setSelectedFlatId(newId)
    setView('detail')
    setNewFlatName('')
    setNewMembersList('')
  }

  // Add a new shared expense to the currently active flat
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setNewExpenseError(null)

    const title = newExpenseTitle.trim()
    const parsedAmount = Number.parseFloat(newExpenseAmount)

    if (!title) {
      setNewExpenseError('Please enter an expense title (e.g. Electricity, Groceries)')
      return
    }
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setNewExpenseError('Please enter a valid amount in ₹ (e.g. 1500)')
      return
    }

    const payer = newExpensePayer.trim() || currentFlat.members[0] || 'Flatmate'
    const roundedAmount = Math.round(parsedAmount)
    const newExpenseId = `bill-${Date.now()}`

    // Calculate fair candidate shares for every member in this flat
    const newShares = calculateCandidateShares(currentFlat.members, roundedAmount, [payer])

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

    // Immediately update the flat's bills array
    setFlats((prevFlats) =>
      prevFlats.map((flat) => {
        if (flat.id !== currentFlat.id) return flat
        return {
          ...flat,
          bills: [newBill, ...flat.bills],
        }
      }),
    )

    // Expand the new expense immediately so candidate breakdown is in full view
    setExpandedExpenseIds((prev) => new Set([newExpenseId, ...prev]))

    // Reset inputs
    setNewExpenseTitle('')
    setNewExpenseAmount('')
    setNewExpensePayer('')
  }

  // Add a new flatmate to the currently active flat
  const handleAddFlatmateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = newFlatmateName.trim()
    if (!name) return

    if (currentFlat.members.includes(name)) return

    const updatedMembers = [...currentFlat.members, name]

    setFlats((prevFlats) =>
      prevFlats.map((flat) => {
        if (flat.id !== currentFlat.id) return flat

        // Re-calculate candidate shares for existing bills with the new flatmate
        const updatedBills = flat.bills.map((bill) => {
          const alreadyPaid = bill.shares.filter((s) => s.isPaid).map((s) => s.name)
          return {
            ...bill,
            shares: calculateCandidateShares(updatedMembers, bill.totalRupees, alreadyPaid),
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
              {currentFlat.name}
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
                {flats.map((flat) => {
                  const isSelected = selectedFlatId === flat.id
                  return (
                    <button
                      type="button"
                      key={flat.id}
                      onClick={() => {
                        setSelectedFlatId(flat.id)
                        setView('detail')
                        setNewExpenseError(null)
                        setNewExpenseTitle('')
                        setNewExpenseAmount('')
                        setNewExpensePayer('')
                      }}
                      style={{
                        border: isSelected ? '2px solid #079B6B' : '1px solid #E4E9ED',
                        backgroundColor: isSelected ? '#EFF9F4' : '#FFFFFF',
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
                  )
                })}
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
                  placeholder="e.g. Flat 5C, Flat 101, Green Ridge 2A"
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
                      <span>{currentFlat.members.length} flatmates sharing</span>
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
                    {Math.round(totalRupees / (currentFlat.members.length || 1)).toLocaleString(
                      'en-IN',
                    )}
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

                {/* Flatmates Roster - Dedicated strictly to this flat */}
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
                    Flatmates ({currentFlat.members.length})
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '6px',
                      marginBottom: '10px',
                    }}
                  >
                    {currentFlat.members.map((m) => (
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
                  + Record a New Shared Bill for {currentFlat.name}
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
                    <option value="">Paid by: {currentFlat.members[0] || 'You'}</option>
                    {currentFlat.members.map((m) => (
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
                      Expenses in {currentFlat.name}
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
                        if (expandedExpenseIds.size === currentFlat.bills.length) {
                          setExpandedExpenseIds(new Set())
                        } else {
                          setExpandedExpenseIds(new Set(currentFlat.bills.map((b) => b.id)))
                        }
                      }}
                    >
                      {expandedExpenseIds.size === currentFlat.bills.length
                        ? 'Collapse All'
                        : 'Expand All'}
                    </button>
                  </div>
                </div>

                {currentFlat.bills.length === 0 ? (
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '36px 20px',
                      backgroundColor: '#FAFCFB',
                      borderRadius: '14px',
                      border: '1.5px dashed #CBD5E1',
                      color: '#64748B',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#101D2B',
                        marginBottom: '4px',
                      }}
                    >
                      No expenses recorded yet in {currentFlat.name}
                    </div>
                    <div style={{ fontSize: '13px' }}>
                      Add your first shared expense using the form above.
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {currentFlat.bills.map((bill) => {
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
                                  Paid by{' '}
                                  <strong style={{ color: '#101D2B' }}>{bill.paidBy}</strong> •
                                  Split among {totalCandidates} candidates
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
                                  ₹{Math.round(bill.totalRupees / (totalCandidates || 1))} /
                                  candidate
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
                                    onClick={() =>
                                      handleSetAllCandidatesPaid(bill.id, !isAllSettled)
                                    }
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
                                        <div
                                          className={`candidate-avatar ${isPayer ? 'payer' : ''}`}
                                        >
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DEDICATED CANDIDATE BREAKDOWN POP-UP MODAL */}
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
