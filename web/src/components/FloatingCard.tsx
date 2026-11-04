import {
  CartIcon,
  CheckCircleIcon,
  ConfettiIcon,
  FlatBuildingIcon,
  UtensilsIcon,
  WifiIcon,
} from './Icons'

interface FloatingCardProps {
  onCardClick?: () => void
}

export function FloatingCard({ onCardClick }: FloatingCardProps) {
  return (
    <button
      type="button"
      className="floating-dashboard-card"
      onClick={onCardClick}
      aria-label="View Flat 4B shared dashboard"
      style={{
        cursor: onCardClick ? 'pointer' : 'default',
        border: '1px solid rgba(228, 233, 237, 0.85)',
        textAlign: 'left',
        fontFamily: 'inherit',
      }}
    >
      {/* Top Header */}
      <div className="card-header-row">
        <div className="card-flat-info">
          <div className="flat-icon-badge">
            <FlatBuildingIcon size={22} color="#079B6B" />
          </div>
          <div>
            <div className="flat-title-text">Flat 4B</div>
            <div className="flat-members-sub">3 members</div>
          </div>
        </div>
        <div className="card-chevron" aria-hidden="true">
          ›
        </div>
      </div>

      {/* Mint Total Balance Box */}
      <div className="card-balance-box">
        <div className="balance-top-row">
          <span className="balance-label">Total balance</span>
          <span className="balance-sparkle-icon">
            <ConfettiIcon size={18} />
          </span>
        </div>
        <div className="balance-amount">₹2,340</div>
        <div className="settled-badge">
          <CheckCircleIcon size={14} color="#079B6B" />
          <span>You're all settled up!</span>
        </div>
      </div>

      {/* Recent Expenses List */}
      <div className="card-expenses-title">Recent expenses</div>
      <div className="expense-list">
        {/* Groceries */}
        <div className="expense-item">
          <div className="expense-left">
            <div className="expense-icon-box icon-purple">
              <CartIcon size={16} color="#9333EA" />
            </div>
            <div>
              <div className="expense-name">Groceries</div>
              <div className="expense-meta">Paid by Asha • May 12</div>
            </div>
          </div>
          <div className="expense-amount">₹1,200</div>
        </div>

        {/* Dinner */}
        <div className="expense-item">
          <div className="expense-left">
            <div className="expense-icon-box icon-orange">
              <UtensilsIcon size={16} color="#EA580C" />
            </div>
            <div>
              <div className="expense-name">Dinner</div>
              <div className="expense-meta">Paid by Ben • May 8</div>
            </div>
          </div>
          <div className="expense-amount">₹1,350</div>
        </div>

        {/* Internet */}
        <div className="expense-item">
          <div className="expense-left">
            <div className="expense-icon-box icon-blue">
              <WifiIcon size={16} color="#0284C7" />
            </div>
            <div>
              <div className="expense-name">Internet</div>
              <div className="expense-meta">Paid by Chitra • May 5</div>
            </div>
          </div>
          <div className="expense-amount">₹799</div>
        </div>
      </div>
    </button>
  )
}
