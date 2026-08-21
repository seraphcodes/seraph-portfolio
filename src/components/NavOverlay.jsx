import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

export default function NavOverlay({ isOpen, onClose }) {
  const overlayRef = useRef(null)
  const firstLinkRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('nav-open')
      firstLinkRef.current?.focus()
    } else {
      document.body.classList.remove('nav-open')
    }
  }, [isOpen])

  useEffect(() => {
    function onKeyDown(e) {
      if (!isOpen) return

      if (e.key === 'Escape') {
        onClose()
        document.getElementById('nav-toggle')?.focus()
        return
      }

      if (e.key === 'Tab') {
        const focusable = overlayRef.current?.querySelectorAll('a, button')
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  return (
    <div
      className={`nav-overlay${isOpen ? ' is-open' : ''}`}
      id="nav-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      ref={overlayRef}
      inert={isOpen ? undefined : ''}
    >
      <nav className="nav-overlay__nav" aria-label="Site navigation">
        <Link to="/" className="nav-link" data-index="01" data-cursor onClick={onClose} ref={firstLinkRef}>
          Home
        </Link>
        <Link to="/about" className="nav-link" data-index="02" data-cursor onClick={onClose}>
          About
        </Link>
        <Link to="/contact" className="nav-link" data-index="03" data-cursor onClick={onClose}>
          Contact
        </Link>
      </nav>
      <footer className="nav-overlay__footer">
        <div className="nav-overlay__social">
          <a href="https://www.instagram.com/seraph.ig/" target="_blank" rel="noopener noreferrer" data-cursor data-cursor-label="Visit">
            Instagram ↗
          </a>
          <a href="mailto:hasimi.sayedmahdi100@gmail.com" data-cursor data-cursor-label="Contact">
            Email ↗
          </a>
        </div>
        <p>Building digital things from Germany.</p>
      </footer>
    </div>
  )
}
