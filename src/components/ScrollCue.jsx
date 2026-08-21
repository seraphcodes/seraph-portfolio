import { forwardRef, useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'

/**
 * Premium chevron scroll cue.
 *
 * Two thin strokes forming a downward-pointing chevron. No glow, no
 * accent colour, no bounce. A soft fill-light travels downward through
 * the interior of the shape, fades out, and repeats - the same direction
 * as the scroll, so the eye reads it as "more below" without any
 * explicit UI affordance.
 *
 * Purely decorative: aria-hidden, pointer-events: none.
 */
const ScrollCue = forwardRef(function ScrollCue(_props, ref) {
  const svgRef = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const svg = svgRef.current
    const fill = fillRef.current
    if (!svg || !fill) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    // The fill-light travels from above the chevron apex down through
    // the arms and out the bottom. clipPath constrains it to the stroke
    // shape so it appears to travel *inside* the lines rather than
    // floating over them.
    const tl = gsap.timeline({ repeat: -1, defaults: { ease: 'none' } })

    tl.fromTo(
      fill,
      { y: -28, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.55, ease: 'power2.in' }
    )
    .to(fill, { y: 28, opacity: 0, duration: 1.05, ease: 'power2.out' })
    .set(fill, { y: -28, opacity: 0 })
    .to({}, { duration: 0.7 }) // pause before next loop

    return () => tl.kill()
  }, [])

  return (
    <div className="scroll-cue" ref={ref} aria-hidden="true">
      <svg
        ref={svgRef}
        className="scroll-cue__chevron"
        viewBox="0 0 40 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* clipPath constrains the fill-light to the chevron strokes */}
          <clipPath id="chevron-clip">
            <polyline points="2,2 20,18 38,2" strokeWidth="6" />
          </clipPath>
        </defs>

        {/* Outer chevron - structural stroke, low opacity */}
        <polyline
          className="scroll-cue__stroke scroll-cue__stroke--outer"
          points="2,2 20,18 38,2"
        />

        {/* Inner chevron - very slightly inset, even lower opacity */}
        <polyline
          className="scroll-cue__stroke scroll-cue__stroke--inner"
          points="5,2 20,14 35,2"
        />

        {/* Fill-light: a soft rectangle that GSAP animates downward,
            clipped to the outer chevron shape so it reads as internal
            illumination traveling through the stroke. */}
        <rect
          ref={fillRef}
          className="scroll-cue__fill"
          x="-2"
          y="-8"
          width="44"
          height="14"
          clipPath="url(#chevron-clip)"
        />
      </svg>
    </div>
  )
})

export default ScrollCue
