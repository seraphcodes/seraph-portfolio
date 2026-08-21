import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

/**
 * Floating header. On the Home page it stays aware of which section
 * (dark/bridge) is in view so it can adapt, and hides the wordmark
 * once the hero has scrolled past — matching the original site behaviour.
 * On About/Contact it simply renders as a plain floating bar.
 */
export default function Header({ onOpenNav, isNavOpen }) {
  const headerRef = useRef(null)
  const location = useLocation()
  const [over, setOver] = useState('dark')
  const [pastHero, setPastHero] = useState(location.pathname !== '/')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const header = headerRef.current
    if (!header) return undefined

    const sections = Array.from(document.querySelectorAll('[data-section]'))
    const hero = document.getElementById('hero')

    let sectionObserver
    let heroObserver

    if (sections.length) {
      sectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setOver(entry.target.dataset.section)
          })
        },
        { threshold: 0.4 }
      )
      sections.forEach((s) => sectionObserver.observe(s))
    }

    if (hero) {
      heroObserver = new IntersectionObserver(
        ([entry]) => setPastHero(!entry.isIntersecting),
        { threshold: 0.05 }
      )
      heroObserver.observe(hero)
    } else {
      setPastHero(true)
    }

    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      sectionObserver?.disconnect()
      heroObserver?.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [location.pathname])

  return (
    <header
      className={`site-header${pastHero ? ' past-hero' : ''}${scrolled ? ' scrolled' : ''}`}
      data-over={over}
      ref={headerRef}
      role="banner"
    >
      <Link to="/" className="header-logo" aria-label="Seraph Hashimi — back to top" data-cursor>
        SH
      </Link>

      <div className="header-right">
        <button
          type="button"
          id="nav-toggle"
          className="nav-toggle"
          onClick={onOpenNav}
          aria-label={isNavOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isNavOpen}
          aria-controls="nav-overlay"
          data-cursor
        >
          <span className="nav-toggle__label" aria-hidden="true">Menu</span>
          <span className="nav-toggle__bars" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
    </header>
  )
}
