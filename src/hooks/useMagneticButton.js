import { useEffect } from 'react'
import { gsap } from '../lib/gsap.js'

export default function useMagneticButton(buttonRef) {
  useEffect(() => {
    const button = buttonRef.current
    if (!button) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const touch = window.matchMedia('(hover: none)').matches
    if (reduced || touch) return undefined

    const moveX = gsap.quickTo(button, 'x', { duration: 0.42, ease: 'power3.out' })
    const moveY = gsap.quickTo(button, 'y', { duration: 0.42, ease: 'power3.out' })
    const maxOffset = 18

    function handleMove(event) {
      const bounds = button.getBoundingClientRect()
      const offsetX = gsap.utils.clamp(-maxOffset, maxOffset, (event.clientX - (bounds.left + bounds.width / 2)) * 0.22)
      const offsetY = gsap.utils.clamp(-maxOffset, maxOffset, (event.clientY - (bounds.top + bounds.height / 2)) * 0.22)
      moveX(offsetX)
      moveY(offsetY)
    }

    function reset() {
      moveX(0)
      moveY(0)
    }

    button.addEventListener('pointermove', handleMove)
    button.addEventListener('pointerleave', reset)

    return () => {
      button.removeEventListener('pointermove', handleMove)
      button.removeEventListener('pointerleave', reset)
      moveX(0)
      moveY(0)
    }
  }, [buttonRef])
}