import { RightArrowIcon } from './Icons'

interface AboutSectionProps {
  onCreateFlat: () => void
}

export function AboutSection({ onCreateFlat }: AboutSectionProps) {
  return (
    <section id="about" className="about-section">
      <div className="container">
        <div className="about-card">
          <div className="about-eyebrow">
            <span>✨ No Sign-up or Login Required</span>
          </div>

          <h2 className="about-heading">Shared expenses. Zero confusion.</h2>

          <p className="about-description">
            Everything your flat needs to manage shared expenses, without the awkward money
            conversations.
          </p>

          <button
            type="button"
            className="btn-primary"
            style={{ fontSize: '16px', padding: '14px 34px' }}
            onClick={onCreateFlat}
          >
            <span>Create Your Flat</span>
            <RightArrowIcon size={16} />
          </button>

          <div className="trust-badges">
            <div className="trust-badge-item">
              <span className="badge-check">✓</span>
              <span>100% Free Forever</span>
            </div>
            <div className="trust-badge-item">
              <span className="badge-check">✓</span>
              <span>No Password or Account Setup</span>
            </div>
            <div className="trust-badge-item">
              <span className="badge-check">✓</span>
              <span>Instant Indian Rupee (₹) Calculations</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
