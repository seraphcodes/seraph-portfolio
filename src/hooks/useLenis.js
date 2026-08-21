import { useEffect } from 'react'
import { ScrollTrigger } from '../lib/gsap.js'
import gsap from 'gsap'

export default function useLenis() {
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return undefined

    let lenis = null
    let cancelled = false

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return

      lenis = new Lenis({
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
      })

      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000)
      })
      gsap.ticker.lagSmoothing(0)
    })

    return () => {
      cancelled = true
      if (lenis) {
        lenis.destroy()
        lenis = null
        gsap.ticker.lagSmoothing(100)
      }
    }
  }, [])
}
