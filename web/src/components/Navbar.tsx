import { useState } from 'react'
import { LogoIcon } from './Icons'

interface NavbarProps {
  onOpenFlatExperience: () => void
  activeSection: string
  onNavigateSection: (sectionId: string) => void
}

export function Navbar({ onOpenFlatExperience, activeSection, onNavigateSection }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLinkClick = (sectionId: string) => {
    setMobileMenuOpen(false)
    onNavigateSection(sectionId)
  }

  return (
    <header className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand Logo & Name */}
          <button
            type="button"
            className="brand-logo-link"
            onClick={() => handleLinkClick('home')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <LogoIcon size={34} />
            <span className="brand-name">Bill Splitter</span>
          </button>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main Navigation">
            <ul className="nav-links">
              <li>
                <button
                  type="button"
                  className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                  onClick={() => handleLinkClick('home')}
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-link ${activeSection === 'features' ? 'active' : ''}`}
                  onClick={() => handleLinkClick('features')}
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-link ${activeSection === 'how-it-works' ? 'active' : ''}`}
                  onClick={() => handleLinkClick('how-it-works')}
                >
                  How it works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
                  onClick={() => handleLinkClick('about')}
                >
                  About
                </button>
              </li>
            </ul>
          </nav>

          {/* Desktop Primary CTA (NO AUTHENTICATION: Get Started directly opens Flat flow) */}
          <div className="nav-actions">
            <button type="button" className="btn-primary" onClick={onOpenFlatExperience}>
              Get started
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            className="mobile-nav-toggle"
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <button type="button" className="mobile-nav-link" onClick={() => handleLinkClick('home')}>
            Home
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleLinkClick('features')}
          >
            Features
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleLinkClick('how-it-works')}
          >
            How it works
          </button>
          <button
            type="button"
            className="mobile-nav-link"
            onClick={() => handleLinkClick('about')}
          >
            About
          </button>
          <div style={{ marginTop: '12px' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ width: '100%', padding: '12px 0' }}
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenFlatExperience()
              }}
            >
              Get started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
