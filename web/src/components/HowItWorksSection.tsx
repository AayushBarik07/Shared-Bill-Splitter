import {
  AddUserIcon,
  CalculatorIcon,
  CheckCircleIcon,
  GroupUsersIcon,
  RightArrowIcon,
} from './Icons'

export function HowItWorksSection() {
  const steps = [
    {
      num: '1',
      title: '1. Create a Flat',
      desc: 'Create your flat and give it a name.',
      icon: <GroupUsersIcon size={24} color="#079B6B" />,
    },
    {
      num: '2',
      title: '2. Add Flatmates',
      desc: 'Add the people sharing expenses with you.',
      icon: <AddUserIcon size={24} color="#079B6B" />,
    },
    {
      num: '3',
      title: '3. Add Expenses',
      desc: 'Record bills, select payer, and split amount.',
      icon: <CalculatorIcon size={24} color="#079B6B" />,
    },
    {
      num: '4',
      title: '4. Settle Up',
      desc: 'See outstanding balances and record payments.',
      icon: <CheckCircleIcon size={24} color="#079B6B" />,
    },
  ]

  return (
    <section id="how-it-works" className="how-it-works-section">
      {/* Curved Wave Top Transition */}
      <svg
        className="wave-top-svg"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,0 C320,50 640,65 960,35 C1200,12 1360,30 1440,40 L1440,0 L0,0 Z" />
      </svg>

      <div className="container">
        <div className="section-header-center">
          <h2 className="section-title">How it works</h2>
          <p className="section-subtitle">
            Four simple steps to organize your flat's shared costs without headaches.
          </p>
        </div>

        {/* Steps Card Container */}
        <div className="steps-container-card">
          {steps.map((step, idx) => (
            <div key={step.title} style={{ display: 'contents' }}>
              <div className="step-card">
                <div className="step-icon-circle">{step.icon}</div>
                <h3 className="step-number-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="step-arrow-divider" aria-hidden="true">
                  <RightArrowIcon size={20} color="#34D399" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Curved Wave Bottom Transition */}
      <svg
        className="wave-bottom-svg"
        viewBox="0 0 1440 50"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,40 C360,10 720,50 1080,20 C1260,5 1380,25 1440,35 L1440,50 L0,50 Z" />
      </svg>
    </section>
  )
}
