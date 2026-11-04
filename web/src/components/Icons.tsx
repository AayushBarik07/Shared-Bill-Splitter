export function LogoIcon({ className = '', size = 32 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Bill Splitter Logo"
    >
      <title>Bill Splitter Logo</title>
      <path
        d="M6 8C6 5.79086 7.79086 4 10 4H20C24.4183 4 28 7.58172 28 12C28 15.1217 26.2104 17.8258 23.6 19.1415C26.7904 20.3548 29 23.4183 29 27C29 31.4183 25.4183 35 21 35H10C7.79086 35 6 33.2091 6 31V8Z"
        fill="#079B6B"
      />
      <path
        d="M10 4H19C23.4183 4 27 7.58172 27 12C27 16.4183 23.4183 20 19 20H10V4Z"
        fill="#087F5B"
      />
      <path
        d="M10 18H20C24.4183 18 28 21.5817 28 26C28 30.4183 24.4183 34 20 34H10V18Z"
        fill="#079B6B"
      />
      <circle cx="16" cy="11.5" r="3.5" fill="#FFFFFF" />
      <circle cx="16.5" cy="25.5" r="4" fill="#FFFFFF" />
      <path d="M9 6C7.5 7.5 7 10 7 12" stroke="#A7F3D0" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function FlatBuildingIcon({
  size = 20,
  color = '#079B6B',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
      <path d="M9 9h1" />
      <path d="M9 13h1" />
      <path d="M9 17h1" />
      <path d="M14 9h1" />
      <path d="M14 13h1" />
      <path d="M14 17h1" />
    </svg>
  )
}

export function GroupUsersIcon({
  size = 20,
  color = '#079B6B',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function ReceiptIcon({ size = 20, color = '#7C3AED' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M8 7h8" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  )
}

export function CalculatorIcon({
  size = 20,
  color = '#D97706',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="2" width="16" height="20" rx="3" />
      <line x1="8" y1="6" x2="16" y2="6" />
      <circle cx="8" cy="11" r="1" fill={color} />
      <circle cx="12" cy="11" r="1" fill={color} />
      <circle cx="16" cy="11" r="1" fill={color} />
      <circle cx="8" cy="16" r="1" fill={color} />
      <circle cx="12" cy="16" r="1" fill={color} />
      <circle cx="16" cy="16" r="1" fill={color} />
    </svg>
  )
}

export function LightningIcon({ size = 20, color = '#16A34A' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

export function CartIcon({ size = 16, color = '#9333EA' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  )
}

export function UtensilsIcon({ size = 16, color = '#EA580C' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2" />
      <path d="M15 11v11" />
      <path d="M5 2v8a3 3 0 0 0 6 0V2" />
      <path d="M8 10v12" />
    </svg>
  )
}

export function WifiIcon({ size = 16, color = '#0284C7' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill={color} />
    </svg>
  )
}

export function CheckCircleIcon({
  size = 20,
  color = '#16A34A',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 11 12 14 16 9" />
    </svg>
  )
}

export function AddUserIcon({ size = 20, color = '#079B6B' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  )
}

export function RightArrowIcon({
  size = 16,
  color = 'currentColor',
}: {
  size?: number
  color?: string
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export function ConfettiIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 2L13 6L17 5L14 8L18 10L14 12L16 16L12 13L9 16L10 12L6 10L10 8L7 5L11 6L12 2Z"
        fill="#F59E0B"
        opacity="0.85"
      />
      <circle cx="4" cy="5" r="1.5" fill="#EF4444" />
      <circle cx="20" cy="4" r="1.5" fill="#3B82F6" />
      <circle cx="19" cy="18" r="1.5" fill="#10B981" />
    </svg>
  )
}

export function ChevronDownIcon({
  size = 18,
  color = 'currentColor',
  rotated = false,
}: {
  size?: number
  color?: string
  rotated?: boolean
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{
        transform: rotated ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}
