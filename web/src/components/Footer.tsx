import { LogoIcon } from './Icons'

interface FooterProps {
  onNavigateSection: (sectionId: string) => void
}

export function Footer({ onNavigateSection }: FooterProps) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand">
            <button
              type="button"
              className="brand-logo-link"
              onClick={() => onNavigateSection('home')}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <LogoIcon size={30} />
              <span className="brand-name">Bill Splitter</span>
            </button>
            <p className="footer-desc">
              The effortless, fair expense management tool designed specifically for flats,
              roommates, and shared living.
            </p>
          </div>

          <ul className="footer-links">
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateSection('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateSection('features')}
              >
                Features
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateSection('how-it-works')}
              >
                How it works
              </button>
            </li>
            <li>
              <button
                type="button"
                className="footer-link"
                onClick={() => onNavigateSection('about')}
              >
                About
              </button>
            </li>
          </ul>
        </div>

        <div className="footer-bottom">
          <div>© 2026 Bill Splitter. Built for stress-free flat living.</div>
          <div>Organized around Flats • Zero Authentication Required</div>
        </div>
      </div>
    </footer>
  )
}
