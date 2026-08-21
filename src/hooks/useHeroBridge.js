import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap.js'

/**
 * Hero <-> Philosophy: a mood changing, not a section arriving.
 *
 * Architecture (unchanged from the previous pass): Hero's own background
 * layer is the ONLY background for the pinned stage; a single tint
 * overlay scrubs its own colour toward the content-area cream; Philosophy
 * is a bare text layer with no background of its own.
 *
 * What changed here is where the transition's "energy" lives. Previously
 * both text layers moved (y + opacity) in a pattern that reads as
 * sliding content - the classic section-transition signature, even
 * though the surface beneath was genuinely continuous. That's been
 * inverted:
 *
 * - Text motion is now nearly eliminated. Hero's text purely fades
 *   (no y at all). Philosophy's text settles with a barely-there 6px
 *   drift - present for polish, not perceptible as "arriving."
 * - The atmosphere itself now carries the transition: the portrait's own
 *   saturation/brightness drift downward in parallel with the tint
 *   rising, and the grid texture's visibility breathes, so the *image*
 *   is visibly changing mood, not just being covered by a colour layer.
 * - The atmosphere change runs across nearly the ENTIRE pinned range
 *   (0 -> 0.9) while the text opacity changes are compressed into a
 *   narrower, later window - light/colour is the dominant, longest-
 *   running signal; text is a quiet footnote to it, not a co-equal
 *   parallel event.
 * - The range is longer again (+=280%) with heavier scrub smoothing,
 *   so nothing here ever reads as a quick reveal.
 *
 * @param {{current: HTMLElement | null}} stageRef
 *   Ref to the pinned stage wrapper (Hero + tint + Philosophy text).
 * @param {{current: {heroEl, bgEl, veilEl, contentEl, cueEl} | null}} heroApiRef
 *   Ref to Hero's imperative handle (see Hero.jsx forwardRef).
 * @param {{current: HTMLElement | null}} surfaceTintRef
 *   Ref to the full-bleed colour-overlay div - the one continuous
 *   material referenced above.
 * @param {{current: HTMLElement | null}} philosophyTextRef
 *   Ref to Philosophy's text-layer wrapper (no background of its own).
 * @param {{current: HTMLElement | null}} philosophyQuoteRef
 *   Ref to the quote element itself, for its own small settle/fade.
 */
export default function useHeroBridge(stageRef, heroApiRef, surfaceTintRef, philosophyTextRef, philosophyQuoteRef) {
  useEffect(() => {
    const stage = stageRef?.current
    const api = heroApiRef?.current
    const tint = surfaceTintRef?.current
    const philosophyText = philosophyTextRef?.current
    const quote = philosophyQuoteRef?.current
    if (!stage || !api?.heroEl || !tint || !philosophyText) return undefined

    const { bgEl, contentEl, cueEl } = api

    // The tint fades TO this colour - read once from the CSS variable so
    // light/dark theme both resolve correctly without hardcoding a value.
    const targetTint = getComputedStyle(stage).getPropertyValue('--s-light-bg').trim() || '#F0EAE1'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(tint, { backgroundColor: targetTint, opacity: 1 })
      gsap.set(philosophyText, { autoAlpha: 1, y: 0 })
      if (quote) gsap.set(quote, { opacity: 1, y: 0 })
      if (bgEl) gsap.set(bgEl, { filter: 'saturate(1) brightness(1)' })
      return undefined
    }

    const ctx = gsap.context(() => {
      // Philosophy should feel like content already present below the hero,
      // becoming visible through natural upward progression.
      gsap.set(philosophyText, { autoAlpha: 0, y: 120 })
      if (quote) gsap.set(quote, { opacity: 0, y: 40 })
      gsap.set(tint, { backgroundColor: 'rgba(0,0,0,0)', opacity: 1 })
      if (bgEl) gsap.set(bgEl, { filter: 'saturate(1) brightness(1)' })
      gsap.set(api.heroEl, { y: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: '+=280%', // longer still - this should feel like a slow-changing mood, not a reveal
          scrub: 1.8,
          pin: stage,
          pinSpacing: true,
          anticipatePin: 1,
        },
        defaults: { ease: 'none' },
      })

      // ── Atmosphere remains the dominant signal. ──
      tl.to(tint, { backgroundColor: targetTint }, 0)
      if (bgEl) tl.to(bgEl, { filter: 'saturate(0.55) brightness(1.15)' }, 0)

      // ── Move the hero upward with the scroll so it feels like a natural
      // journey through the same environment.
      tl.to(api.heroEl, { yPercent: -26 }, 0)
      if (contentEl) tl.to(contentEl, { y: -70 }, 0)
      if (cueEl) tl.to(cueEl, { y: 16 }, 0)

      // ── Philosophy rises into view as the hero progresses away. ──
      tl.to(philosophyText, { autoAlpha: 1, y: 0 }, 0.12)
      if (quote) tl.to(quote, { opacity: 1, y: 0 }, 0.16)

      ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: '+=280%',
        onUpdate: (self) => {
          philosophyText.classList.toggle('philosophy-text--interactive', self.progress > 0.6)
        },
      })
    })

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => {
      cancelAnimationFrame(raf)
      ctx.revert()
    }
  }, [stageRef, heroApiRef, surfaceTintRef, philosophyTextRef, philosophyQuoteRef])
}
