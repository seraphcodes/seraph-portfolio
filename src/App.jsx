import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import NavOverlay from './components/NavOverlay.jsx'
import Footer from './components/Footer.jsx'
import CursorSpotlight from './components/CursorSpotlight.jsx'
import CursorSystem from './components/CursorSystem.jsx'
import PremiumIntro from './components/PremiumIntro.jsx'
import useLenis from './hooks/useLenis.js'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'

export default function App() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [introActive, setIntroActive] = useState(true)
  const location = useLocation()

  // Lenis smooth scroll - wired to GSAP ticker, affects entire site.
  // All existing ScrollTrigger scrubs (hero bridge, reveals) automatically
  // read the smoothed position with no changes needed in those hooks.
  useLenis()

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <CursorSpotlight />
      <CursorSystem />

      <Header
        onOpenNav={() => setIsNavOpen((open) => !open)}
        isNavOpen={isNavOpen}
      />

      <NavOverlay isOpen={isNavOpen} onClose={() => setIsNavOpen(false)} />

      <main id="main-content" key={location.pathname}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />

      {/* The page underneath is already fully mounted and settled - the
          intro is a curtain in front of it, not a screen that gets
          swapped out for the page once it finishes. That's what makes
          the reveal feel continuous instead of "overlay disappears,
          page appears." */}
      {introActive && <PremiumIntro onComplete={() => setIntroActive(false)} />}
    </>
  )
}
