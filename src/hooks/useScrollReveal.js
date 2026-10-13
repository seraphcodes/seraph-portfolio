import { useEffect } from 'react'
import { gsap } from '../lib/gsap.js'

/**
 * Scroll reveal: content eases in as it enters the viewport, eases out
 * gently as it leaves through the top, and comes back naturally when the
 * visitor scrolls back up.
 *
 * Why IntersectionObserver instead of ScrollTrigger here:
 * the Home page pins the Hero/Philosophy stage (useHeroBridge), which adds
 * roughly 2.8 viewports of scroll height. Reveal triggers measured against
 * layout positions fired ~2500px too early, so content was already
 * "revealed" long before it reached the screen and nothing visibly
 * animated. IntersectionObserver reports where an element actually is in
 * the viewport right now, so it is immune to pin spacing and needs no
 * refresh ordering.
 *
 * Only `.js-reveal` elements inside the page container are touched. The
 * global Footer lives outside every page container and is never hidden.
 *
 * Pacing (tuned to the reference): entrance 0.85s, exit 0.6s, a light
 * stagger between items that appear together.
 */

const DUR_IN = 2.0
const DUR_OUT = 0.6
const EASE_IN = 'power3.out'
const EASE_OUT = 'power2.inOut'
const STAGGER = 0.1
const MAX_STAGGER = 0.35
// Entrance begins when an element's top is 10% above the viewport bottom;
// exit begins once it has climbed into the top 18% of the viewport.
const ENTER_MARGIN = '0px 0px -10% 0px'
const EXIT_MARGIN = '-18% 0px 0px 0px'

export default function useScrollReveal(containerRef, deps = []) {
  useEffect(() => {
    const container = containerRef.current
    if (!container) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const items = Array.from(container.querySelectorAll('.js-reveal'))
    if (!items.length) return undefined

    if (reduced) {
      gsap.set(items, { opacity: 1, y: 0 })
      return undefined
    }

    const offset = (el) => Number(el.dataset.revealY) || 22
    const shown = new WeakMap() // currently revealed?
    const inEnterZone = new WeakMap() // inside viewport minus bottom margin
    const aboveExit = new WeakMap() // climbed past the exit line (top)
    const pending = new Set()
    let rafId = 0
    let disposed = false

    items.forEach((el) => {
      gsap.set(el, { opacity: 0, y: offset(el) })
      shown.set(el, false)
      inEnterZone.set(el, false)
      aboveExit.set(el, false)
    })

    const atBottom = () =>
      window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 4

    const onScreen = (el) => {
      const r = el.getBoundingClientRect()
      return r.bottom > 0 && r.top < window.innerHeight
    }

    const show = (el, delay) => {
      if (shown.get(el)) return
      shown.set(el, true)
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: DUR_IN,
        delay,
        ease: EASE_IN,
        overwrite: true,
      })
    }

    const hide = (el) => {
      if (!shown.get(el)) return
      shown.set(el, false)
      gsap.to(el, {
        opacity: 0,
        // Leaving upward drifts a little further up; leaving downward
        // (scrolling back) sinks back to its resting offset below.
        y: aboveExit.get(el) ? -offset(el) * 0.5 : offset(el),
        duration: DUR_OUT,
        ease: EASE_OUT,
        overwrite: true,
      })
    }

    // Decide every touched element once per frame, so items that appear
    // together are staggered in DOM order.
    const flush = () => {
      rafId = 0
      if (disposed) return
      const bottom = atBottom()
      const list = Array.from(pending).sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
      pending.clear()
      let rank = 0
      list.forEach((el) => {
        // At the very end of the page nothing visible may stay faded.
        const want = (inEnterZone.get(el) && !aboveExit.get(el)) || (bottom && onScreen(el))
        if (want) {
          if (!shown.get(el)) {
            show(el, Math.min(rank * STAGGER, MAX_STAGGER))
            rank += 1
          }
        } else if (!(bottom && onScreen(el))) {
          hide(el)
        }
      })
    }

    const queue = (el) => {
      pending.add(el)
      if (!rafId) rafId = requestAnimationFrame(flush)
    }

    const vh = () => window.innerHeight
    const seenByExit = new WeakSet()

    const enterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          inEnterZone.set(entry.target, entry.isIntersecting)
          queue(entry.target)
        })
      },
      { rootMargin: ENTER_MARGIN, threshold: 0 }
    )

    const exitObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target
          if (entry.isIntersecting) {
            aboveExit.set(el, false)
          } else if (seenByExit.has(el) && entry.boundingClientRect.bottom < vh() * 0.5) {
            // Genuinely climbed out through the top (not just initial layout).
            aboveExit.set(el, true)
          } else {
            aboveExit.set(el, false)
          }
          seenByExit.add(el)
          queue(el)
        })
      },
      { rootMargin: EXIT_MARGIN, threshold: 0 }
    )

    items.forEach((el) => {
      enterObserver.observe(el)
      exitObserver.observe(el)
    })

    // Arriving at the bottom of the page: reveal anything visible that the
    // exit rule would otherwise leave faded.
    let wasBottom = false
    let scrollTicking = false
    const onScroll = () => {
      if (scrollTicking) return
      scrollTicking = true
      requestAnimationFrame(() => {
        scrollTicking = false
        const now = atBottom()
        if (now && !wasBottom) items.forEach((el) => pending.add(el))
        if (now && !wasBottom && !rafId) rafId = requestAnimationFrame(flush)
        wasBottom = now
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      disposed = true
      if (rafId) cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', onScroll)
      enterObserver.disconnect()
      exitObserver.disconnect()
      gsap.killTweensOf(items)
      gsap.set(items, { clearProps: 'opacity,transform' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
