import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap.js'

/**
 * Scroll reveal using GSAP + ScrollTrigger.
 *
 * With Lenis now handling scroll physics, the "continuous journey" feeling
 * comes from scroll inertia, not from exit animations. Removing onLeave /
 * onLeaveBack eliminates the double-motion problem: previously, as a section
 * scrolled away, its elements visibly faded/moved upward while new elements
 * were simultaneously animating in below - two competing motions on a sharp
 * native scroll. Lenis deceleration already makes exits feel gradual and
 * natural. The reveal system only needs to handle arrival.
 *
 * Elements arrive with a gentle settle (opacity + small y).
 * Elements leave by simply scrolling out of the viewport naturally.
 * That asymmetry is intentional and matches how premium editorial sites work.
 */
export default function useScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const items = gsap.utils.toArray(container.querySelectorAll('.js-reveal'))
    if (!items.length) return undefined

    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 })
      return undefined
    }

    const ctx = gsap.context(() => {
      items.forEach((el) => {
        const y = Number(el.dataset.revealY) || 22
        gsap.set(el, { opacity: 0, y })
      })

      items.forEach((el) => {
        const siblings = Array.from(el.parentElement.querySelectorAll(':scope > .js-reveal'))
        const idx = siblings.indexOf(el)
        const delay = idx * 0.06
        const y = Number(el.dataset.revealY) || 22

        ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          // Enter from below — elements settle into place
          onEnter: () =>
            gsap.to(el, {
              opacity: 1, y: 0,
              duration: 1.0, delay,
              ease: 'power2.out',
              overwrite: true,
            }),
          // Re-enter from above when scrolling back up
          onEnterBack: () =>
            gsap.to(el, {
              opacity: 1, y: 0,
              duration: 0.8,
              ease: 'power2.out',
              overwrite: true,
            }),
          // No onLeave / onLeaveBack:
          // Lenis inertia handles the feeling of content departing.
          // Adding exit animations here creates visible double-motion.
        })
      })
    }, container)

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
