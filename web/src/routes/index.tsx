import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AboutSection } from '../components/AboutSection'
import { FeaturesSection } from '../components/FeaturesSection'
import { FlatExperienceModal } from '../components/FlatExperienceModal'
import { Footer } from '../components/Footer'
import { HeroSection } from '../components/HeroSection'
import { HowItWorksSection } from '../components/HowItWorksSection'
import { Navbar } from '../components/Navbar'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalInitialMode, setModalInitialMode] = useState<'select' | 'create'>('select')
  const [activeSection, setActiveSection] = useState<string>('home')

  // Scroll spy to update active section in navbar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 120
      const featuresEl = document.getElementById('features')
      const howItWorksEl = document.getElementById('how-it-works')
      const aboutEl = document.getElementById('about')

      if (aboutEl && scrollPos >= aboutEl.offsetTop) {
        setActiveSection('about')
      } else if (howItWorksEl && scrollPos >= howItWorksEl.offsetTop) {
        setActiveSection('how-it-works')
      } else if (featuresEl && scrollPos >= featuresEl.offsetTop) {
        setActiveSection('features')
      } else {
        setActiveSection('home')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigateSection = (sectionId: string) => {
    setActiveSection(sectionId)
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleOpenFlatExperience = (mode: 'select' | 'create' = 'select') => {
    setModalInitialMode(mode)
    setIsModalOpen(true)
  }

  return (
    <div className="landing-page-wrapper">
      {/* SECTION 1: Navigation Bar */}
      <Navbar
        onOpenFlatExperience={() => handleOpenFlatExperience('select')}
        activeSection={activeSection}
        onNavigateSection={handleNavigateSection}
      />

      <main>
        {/* SECTION 2: Hero Section */}
        <HeroSection
          onGetStarted={() => handleOpenFlatExperience('create')}
          onSeeHowItWorks={() => handleNavigateSection('how-it-works')}
        />

        {/* SECTION 3: Feature Highlights */}
        <FeaturesSection />

        {/* SECTION 4: How It Works */}
        <HowItWorksSection />

        {/* SECTION 5: About / Closing CTA */}
        <AboutSection onCreateFlat={() => handleOpenFlatExperience('create')} />
      </main>

      {/* SECTION 6: Footer */}
      <Footer onNavigateSection={handleNavigateSection} />

      {/* Interactive Flat Creation & Selection Modal (NO AUTH REQUIRED) */}
      <FlatExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialMode={modalInitialMode}
      />
    </div>
  )
}
