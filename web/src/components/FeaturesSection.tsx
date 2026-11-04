import { CalculatorIcon, GroupUsersIcon, LightningIcon, ReceiptIcon } from './Icons'

export function FeaturesSection() {
  const features = [
    {
      title: 'Create your Flat',
      description: 'Set up your flat and add your flatmates.',
      icon: <GroupUsersIcon size={22} color="#079B6B" />,
      iconClass: 'feature-icon-green',
    },
    {
      title: 'Add Expenses',
      description: 'Record shared expenses in seconds.',
      icon: <ReceiptIcon size={22} color="#7C3AED" />,
      iconClass: 'feature-icon-purple',
    },
    {
      title: 'Track Balances',
      description: 'Know exactly who owes whom.',
      icon: <CalculatorIcon size={22} color="#D97706" />,
      iconClass: 'feature-icon-yellow',
    },
    {
      title: 'Settle Up',
      description: 'Record payments and keep everything updated.',
      icon: <LightningIcon size={22} color="#16A34A" />,
      iconClass: 'feature-icon-emerald',
    },
  ]

  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="features-bar">
          {features.map((item) => (
            <div key={item.title} className="feature-col">
              <div className={`feature-icon-wrapper ${item.iconClass}`}>{item.icon}</div>
              <div>
                <h3 className="feature-title">{item.title}</h3>
                <p className="feature-desc">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
