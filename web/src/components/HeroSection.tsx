import { FlatmatesIllustration } from './FlatmatesIllustration'
import { FloatingCard } from './FloatingCard'
import { RightArrowIcon } from './Icons'

interface HeroSectionProps {
  onGetStarted: () => void
  onSeeHowItWorks: () => void
}

export function HeroSection({ onGetStarted, onSeeHowItWorks }: HeroSectionProps) {
  return (
    <section id="home" className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Headline, Subtext, CTAs */}
          <div className="hero-content">
            <h1 className="hero-headline">
              Split expenses
              <br />
              <span className="mint-highlight">with your flatmates,</span>
              <br />
              without the confusion.
            </h1>

            <p className="hero-subtext">
              Keep track of shared flat expenses, see who owes whom, and settle payments easily —
              all in one place.
            </p>

            <div className="hero-cta-group">
              <button type="button" className="btn-primary btn-hero-primary" onClick={onGetStarted}>
                <span>Get started for free</span>
                <RightArrowIcon size={16} />
              </button>

              <button
                type="button"
                className="btn-secondary btn-hero-secondary"
                onClick={onSeeHowItWorks}
              >
                <span className="play-icon" aria-hidden="true" />
                <span>See how it works</span>
              </button>
            </div>
          </div>

          {/* Right Column: Handcrafted Flatmates Illustration & Floating Dashboard Card */}
          <div className="hero-visual-wrapper">
            <FlatmatesIllustration className="hero-svg-art" />
            <FloatingCard onCardClick={onGetStarted} />
          </div>
        </div>
      </div>
    </section>
  )
}
