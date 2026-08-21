import { useEffect, useRef } from 'react'

/**
 * Two small ambient effects preserved from the original build:
 * a cursor-follow glow, and a scroll-progress bar at the top of the page.
 * Both are cheap (no layout thrash) and skipped for touch devices /
 * reduced-motion users.
 *
 * Priority 4 note: the glow's sizing/opacity were refined in style.css
 * (smaller, softer - see .cursor-spotlight) to sit quietly behind the
 * new CursorSystem (dot + ring) rather than competing with it. The
 * mousemove handler below - including its Hero cursor-reveal-mask
 * logic - is unchanged.
 */
export default function CursorSpotlight() {
  const spotlightRef = useRef(null)
  const progressRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none)').matches
    const spotlight = spotlightRef.current

    let onMove
    if (!reduced && !isTouch && spotlight) {
      onMove = (e) => {
        spotlight.style.left = `${e.clientX}px`
        spotlight.style.top = `${e.clientY}px`

        const mask = document.getElementById('hero-reveal-mask')
        const hero = document.getElementById('hero')
        if (!mask || !hero) return
        const r = hero.getBoundingClientRect()
        if (e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom) {
          mask.style.setProperty('--mx', `${e.clientX - r.left}px`)
          mask.style.setProperty('--my', `${e.clientY - r.top}px`)
          mask.style.opacity = '1'
        } else {
          mask.style.opacity = '0'
        }
      }
      document.addEventListener('mousemove', onMove)
    }

    const bar = progressRef.current
    const onScroll = () => {
      if (!bar) return
      const pct =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      bar.style.width = `${Math.min(pct || 0, 100)}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      if (onMove) document.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      <div className="cursor-spotlight" ref={spotlightRef} aria-hidden="true"></div>
      <div className="scroll-progress" ref={progressRef} aria-hidden="true"></div>
    </>
  )
}
