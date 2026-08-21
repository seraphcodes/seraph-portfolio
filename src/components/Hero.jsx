import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import ScrollCue from './ScrollCue.jsx'

/**
 * Hero intro + name reveal. Animation timing/behaviour preserved exactly
 * from the original build.
 *
 * The Hero <-> Philosophy cinematic bridge (useHeroBridge) pins Hero in
 * the viewport and cross-fades it against Philosophy, which requires refs
 * to elements in both components at once. That hook is therefore called
 * from Home.jsx (the shared parent), and Hero exposes its internal nodes
 * here via useImperativeHandle so Home can wire them up without Hero
 * needing to know anything about Philosophy.
 */
const Hero = forwardRef(function Hero({ skipIntro }, ref) {
  const heroRef = useRef(null)
  const stageRef = useRef(null)
  const contentRef = useRef(null)
  const bgRef = useRef(null)
  const veilRef = useRef(null)
  const cueRef = useRef(null)
  const [revealDone, setRevealDone] = useState(false)

  useImperativeHandle(ref, () => ({
    heroEl: heroRef.current,
    bgEl: bgRef.current,
    veilEl: veilRef.current,
    contentEl: contentRef.current,
    cueEl: cueRef.current,
  }))

  useEffect(() => {
    const stage = stageRef.current
    const content = contentRef.current
    if (!stage || !content) return undefined

    content.classList.remove('content-visible')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      stage.classList.add('name-done')
      content.classList.add('content-visible')
      setRevealDone(true)
      return undefined
    }

    if (skipIntro) {
      stage.classList.add('name-done')
      const timer = setTimeout(() => {
        content.classList.add('content-visible')
        setRevealDone(true)
      }, 2800)
      return () => clearTimeout(timer)
    }

    const t1 = setTimeout(() => stage.classList.add('name-active'), 200)
    const t2 = setTimeout(() => stage.classList.add('name-split'), 1100)
    const t3 = setTimeout(() => {
      stage.classList.add('name-done')
    }, 2000)
    const t4 = setTimeout(() => {
      content.classList.add('content-visible')
      setRevealDone(true)
    }, 2800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [skipIntro])

  return (
    <section
      className={`hero${revealDone ? ' reveal-done' : ''}`}
      id="hero"
      data-section="dark"
      aria-label="Introduction"
      ref={heroRef}
    >
      <div className="hero__bg" ref={bgRef}>
        <img className="hero__portrait" src="/profile.png" alt="Portrait of Seraph Hashimi" loading="eager" />
        <div className="hero__veil" ref={veilRef} aria-hidden="true"></div>
        <div className="hero__grid" aria-hidden="true"></div>
        <div className="hero__reveal-mask" id="hero-reveal-mask" aria-hidden="true">
          <img className="hero__portrait hero__portrait--clear" src="/profile.png" alt="" aria-hidden="true" />
        </div>
      </div>

      <div className="hero__name-stage" id="hero-name-stage" ref={stageRef} aria-hidden="true">
        <div className="name-split">
          <div className="name-rule name-rule--top"></div>
          <div className="name-letters">
            <span className="name-left">SER</span>
            <span className="name-divider" aria-hidden="true"></span>
            <span className="name-right">APH</span>
          </div>
          <div className="name-rule name-rule--bottom"></div>
        </div>
      </div>

      <div className="hero__content" id="hero-content" ref={contentRef}>
        <h1 className="hero__title">
          <span className="hero__line">Turning ideas into</span>
          <span className="hero__line">
            <em className="gradient-word">digital</em>
          </span>
          <span className="hero__line">experiences.</span>
        </h1>
        <p className="hero__sub">
          Based in Germany. Building modern,
          <br />
          human-centred web experiences.
        </p>
        <ScrollCue ref={cueRef} />
      </div>
    </section>
  )
})

export default Hero
