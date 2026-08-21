import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'

/**
 * Curtain-opening intro. The seam (divider) is a solid, physical line
 * from the first frame - it is the hinge the two panels hang from, not
 * something that animates into existence. The panels are curtains: they
 * hold for a quiet beat with the wordmark settled either side of the
 * seam, then part outward from the centre in one continuous, heavy
 * gesture, revealing the page that is already mounted and waiting
 * underneath.
 */
export default function PremiumIntro({ onComplete }) {
  const introRef = useRef(null)
  const dividerRef = useRef(null)
  const leftRef = useRef(null)
  const rightRef = useRef(null)

  useEffect(() => {
    const intro = introRef.current
    const divider = dividerRef.current
    const left = leftRef.current
    const right = rightRef.current
    if (!intro || !divider || !left || !right) return undefined

    const leftText = left.querySelector('.premium-intro__letters')
    const rightText = right.querySelector('.premium-intro__letters')

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const finish = () => {
      document.body.style.overflow = previousOverflow || ''
      if (typeof onComplete === 'function') onComplete()
    }

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(intro, { autoAlpha: 0 })
      finish()
      return undefined
    }

    // The seam is present and solid immediately - not an element that
    // grows into being, but the fixed architecture the curtains open
    // from. Panels sit fully closed, wordmark not yet visible.
    gsap.set(divider, { scaleY: 1, autoAlpha: 1 })
    gsap.set([left, right], { x: 0 })
    gsap.set([leftText, rightText], { autoAlpha: 0, y: 4 })

    const tl = gsap.timeline({ onComplete: finish })

    // Beat 1 — quiet arrival. The wordmark settles either side of the
    // seam with barely any motion; nothing else happens yet.
    tl.to([leftText, rightText], {
      autoAlpha: 1,
      y: 0,
      duration: 0.75,
      ease: 'power2.out',
    }, 0.15)

    // A held breath with the curtains still fully closed - this is what
    // reads as "looking at a closed curtain," not a logo card.
    tl.addLabel('open', '+=0.4')

    // Beat 2 — the curtains part from the seam: one continuous, weighted
    // gesture, not a quick wipe. Letters ride with their own panel
    // rather than drifting separately, so the motion stays singular.
    tl.to(left, { x: '-100%', duration: 1.4, ease: 'expo.inOut' }, 'open')
      .to(right, { x: '100%', duration: 1.4, ease: 'expo.inOut' }, 'open')
      // Left text (SER) moves up and fades
      .to(leftText, { y: '-10mm', autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 'open')
      // Right text (APH) moves down and fades
      .to(rightText, { y: '10mm', autoAlpha: 0, duration: 0.5, ease: 'power1.in' }, 'open')
      // The seam only lets go once the gap is already visibly open, so
      // it reads as the hinge the panels moved away from.
      .to(divider, { autoAlpha: 0, duration: 0.4, ease: 'power1.in' }, 'open+=0.55')
      // Explicitly anchored to when the curtain pans actually finish
      // (open + their own 1.4s duration) - not left implicit, since
      // GSAP would otherwise anchor it to the divider tween above and
      // hide the overlay before the panels are done sliding away.
      .set(intro, { autoAlpha: 0 }, 'open+=1.4')

    return () => {
      document.body.style.overflow = previousOverflow || ''
      tl.kill()
    }
  }, [onComplete])

  return (
    <div className="premium-intro" ref={introRef} aria-hidden="true">
      <div className="premium-intro__content">
        <div className="premium-intro__panel premium-intro__panel--left" ref={leftRef}>
          <div className="premium-intro__letters">
            <span>SER</span>
          </div>
        </div>
        <div className="premium-intro__divider" ref={dividerRef} />
        <div className="premium-intro__panel premium-intro__panel--right" ref={rightRef}>
          <div className="premium-intro__letters">
            <span>APH</span>
          </div>
        </div>
      </div>
    </div>
  )
}
