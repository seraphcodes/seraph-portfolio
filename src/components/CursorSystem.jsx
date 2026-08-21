import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'

/**
 * Premium cursor system (Priority 4).
 *
 * Architecture: two small followers layered ON TOP OF the native OS
 * pointer - the native pointer is never hidden. This is deliberate:
 * the brief asked for the pointer and the circle to "feel connected,"
 * not for one to replace the other.
 *
 * - .cursor-dot   - tracks the raw pointer position almost immediately
 *                   (fast GSAP quickTo, minimal lag). This is the
 *                   precision element sitting essentially on the pointer.
 * - .cursor-ring  - tracks the same position with more inertia (slower
 *                   quickTo). Because it settles a beat after the dot,
 *                   the LAG ITSELF reads as a soft motion trail - no
 *                   particles, no extra DOM, no glow smear. Just two
 *                   circles moving at two speeds.
 *
 * Magnetic hover: elements tagged with [data-cursor] are watched via
 * mouseenter/mousemove/mouseleave. While hovered, the ring (not the
 * dot - the dot stays a precise pointer-companion) is nudged toward
 * the cursor's position *relative to the element's own center*, capped
 * to a small maximum offset so it never feels like the element is
 * chasing the cursor across the screen - just a small, felt-more-than-
 * seen pull.
 *
 * Context label: elements with [data-cursor-label="View"] (etc.) cause
 * the ring to grow slightly and reveal that word, centered inside it.
 * Only used where it's explicitly opted into via the data attribute -
 * never everywhere.
 *
 * Skipped entirely for touch devices and prefers-reduced-motion, same
 * convention as the existing CursorSpotlight.
 */
export default function CursorSystem() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isTouch = window.matchMedia('(hover: none)').matches
    if (reduced || isTouch) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!dot || !ring) return undefined

    // Two independent quickTo trackers per axis, deliberately different
    // speeds - this gap in responsiveness is the entire "trail" effect.
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.42, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.42, ease: 'power3.out' })

    let pointerX = window.innerWidth / 2
    let pointerY = window.innerHeight / 2
    let activeMagnetTarget = null
    const MAGNET_MAX = 10 // px - deliberately small; "felt, not seen"

    function onMove(e) {
      pointerX = e.clientX
      pointerY = e.clientY
      dotX(pointerX)
      dotY(pointerY)

      // If not currently magnetised to an element, the ring simply
      // follows the pointer too (with its own slower easing).
      if (!activeMagnetTarget) {
        ringX(pointerX)
        ringY(pointerY)
      }
    }

    function onMagnetEnter(el) {
      activeMagnetTarget = el
      ring.classList.add('cursor-ring--magnet')
      document.body.classList.add('cursor-hovering')

      const labelText = el.getAttribute('data-cursor-label')
      if (labelText && label) {
        label.textContent = labelText
        ring.classList.add('cursor-ring--label')
      }
    }

    function onMagnetMove(e, el) {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      // Pull the ring toward the pointer's offset from the element's
      // center, but hard-capped to MAGNET_MAX so it's a small nudge,
      // never a chase.
      const offsetX = gsap.utils.clamp(-MAGNET_MAX, MAGNET_MAX, (e.clientX - cx) * 0.25)
      const offsetY = gsap.utils.clamp(-MAGNET_MAX, MAGNET_MAX, (e.clientY - cy) * 0.25)
      ringX(cx + offsetX)
      ringY(cy + offsetY)
    }

    function onMagnetLeave() {
      activeMagnetTarget = null
      ring.classList.remove('cursor-ring--magnet', 'cursor-ring--label')
      document.body.classList.remove('cursor-hovering')
      ringX(pointerX)
      ringY(pointerY)
    }

    // Delegate hover detection to the magnetic targets present right now.
    // Re-scanned on every mouseover via closest() rather than attaching
    // a fixed listener list, so it keeps working across route changes
    // (Home/About/Contact) without needing to know about them here.
    function onMouseOver(e) {
      const el = e.target.closest('[data-cursor]')
      if (!el || el === activeMagnetTarget) return
      onMagnetEnter(el)
    }
    function onMouseOut(e) {
      const el = e.target.closest('[data-cursor]')
      if (!el) return
      const toEl = e.relatedTarget?.closest?.('[data-cursor]')
      if (toEl === el) return
      onMagnetLeave()
    }
    function onMouseMoveMagnet(e) {
      if (activeMagnetTarget) onMagnetMove(e, activeMagnetTarget)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mousemove', onMouseMoveMagnet)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mousemove', onMouseMoveMagnet)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span className="cursor-ring__label" ref={labelRef} aria-hidden="true"></span>
      </div>
    </>
  )
}
