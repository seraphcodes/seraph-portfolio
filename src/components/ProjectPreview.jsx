import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'

/**
 * Hover preview for the Selected Work list.
 *
 * While the pointer is over a project row, a small "screen" of that
 * project floats beside the cursor and trails it with a little inertia
 * (it eases toward the pointer instead of being glued to it, and tilts
 * slightly in the direction it is catching up from). Moving to another
 * row cross-fades to that project's screen; leaving the list lets it
 * settle away. The hovered row is emphasised by dimming the others.
 *
 * - Desktop only: needs a fine pointer that can hover. Touch devices
 *   never see it (rows stay plain, tappable links).
 * - prefers-reduced-motion: the preview still appears next to the
 *   cursor, but without trailing, tilt or scale animation.
 * - Decorative: pointer-events none and aria-hidden, rows keep their
 *   own accessible names and links.
 *
 * Each screen uses a real image when `project.image` loads; otherwise it
 * falls back to a drawn mock screen so nothing ever looks broken. To use
 * real screenshots, put them in public/previews/ and set `image`.
 */

const OFFSET_X = 30 // gap between cursor and card
const LERP = 0.13 // follow smoothing per 60fps frame (lower = more inertia)
const TILT = 0.045 // degrees of tilt per px of lag
const MAX_TILT = 7

function MockFitness() {
  return (
    <div className="pv pv--fitness">
      <div className="pv__row pv__row--between">
        <span className="pv__title">Today</span>
        <span className="pv__chip pv__chip--lime">Week 3</span>
      </div>
      <div className="pv__fit-main">
        <div className="pv__ring">
          <span>68%</span>
        </div>
        <div className="pv__stack">
          <div className="pv__card pv__card--dark">Push · Session 4</div>
          <div className="pv__card">2 180 kcal · 148 g protein</div>
        </div>
      </div>
      <div className="pv__bars">
        {[40, 64, 52, 78, 60, 88, 70].map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function MockLab() {
  return (
    <div className="pv pv--lab">
      <div className="pv__row pv__row--between">
        <span className="pv__title">Overview</span>
        <span className="pv__chip">2010 – 2011</span>
      </div>
      <div className="pv__kpis">
        <div><b>£9.7M</b><small>Revenue</small></div>
        <div><b>36.6k</b><small>Orders</small></div>
        <div><b>5.9k</b><small>Customers</small></div>
      </div>
      <svg className="pv__line" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 48 L25 40 L50 44 L75 28 L100 32 L125 18 L150 24 L175 10 L200 14" />
      </svg>
      <div className="pv__bars pv__bars--thin">
        {[30, 44, 38, 56, 48, 70, 62, 82, 66].map((h, i) => (
          <i key={i} style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

function MockPortfolio() {
  return (
    <div className="pv pv--portfolio">
      <span className="pv__eyebrow">Portfolio</span>
      <span className="pv__serif">Seraph<br />Hashimi</span>
      <span className="pv__rule" />
      <span className="pv__small">React · GSAP · Vite</span>
    </div>
  )
}

function MockVerdict() {
  return (
    <div className="pv pv--verdict">
      <div className="pv__row pv__row--between">
        <span className="pv__title">Verdict AI</span>
        <span className="pv__chip pv__chip--pink">Insights</span>
      </div>
      <div className="pv__sent">
        <div><i style={{ width: '72%' }} /><small>Positive</small></div>
        <div><i style={{ width: '18%' }} className="pv__neg" /><small>Negative</small></div>
        <div><i style={{ width: '10%' }} className="pv__neu" /><small>Neutral</small></div>
      </div>
      <div className="pv__card pv__card--glow">“Sizing runs small” is the top theme this week.</div>
    </div>
  )
}

const MOCKS = {
  'fitness-os': MockFitness,
  'business-lab': MockLab,
  'portfolio': MockPortfolio,
  'verdict-ai': MockVerdict,
}

const URLS = {
  'fitness-os': 'seraphcodes.github.io/fitness-os',
  'business-lab': 'seraphcodes.github.io/business-performance-decision-lab',
  'portfolio': 'seraph-portfolio.vercel.app',
  'verdict-ai': 'verdict-ai-gilt-sigma.vercel.app',
}

function Screen({ project, on }) {
  const Mock = MOCKS[project.slug]
  const imgRef = useRef(null)
  return (
    <div className="pp-screen" data-slug={project.slug} data-on={on ? 'true' : 'false'}>
      <div className="pp-screen__bar" aria-hidden="true">
        <i /><i /><i />
        <span>{URLS[project.slug]}</span>
      </div>
      <div className="pp-screen__body">
        {Mock ? <Mock /> : null}
        {project.image ? (
          <img
            ref={imgRef}
            className="pp-screen__img"
            src={project.image}
            alt=""
            draggable="false"
            onLoad={() => imgRef.current?.setAttribute('data-ok', 'true')}
            onError={() => imgRef.current?.remove()}
          />
        ) : null}
      </div>
    </div>
  )
}

export default function ProjectPreview({ listRef, projects }) {
  const wrapRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    const list = listRef.current
    const wrap = wrapRef.current
    const card = cardRef.current
    if (!list || !wrap || !card) return undefined

    const fine = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 900px)').matches
    if (!fine) return undefined
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const rows = Array.from(list.querySelectorAll('[data-project]'))
    const screens = Array.from(wrap.querySelectorAll('.pp-screen'))
    const slugs = projects.map((p) => p.slug)

    let visible = false
    let activeSlug = null
    let mx = 0
    let my = 0
    let x = 0
    let y = 0
    let rot = 0

    const size = () => ({ w: card.offsetWidth, h: card.offsetHeight })

    // Where the card wants to be for the current pointer position:
    // to the right of the cursor, flipping to the left near the right edge,
    // clamped inside the viewport and vertically centred on the pointer.
    const target = () => {
      const { w, h } = size()
      const vw = window.innerWidth
      const vh = window.innerHeight
      const flip = mx + OFFSET_X + w > vw - 20
      let tx = flip ? mx - OFFSET_X - w : mx + OFFSET_X
      let ty = my - h / 2
      tx = Math.max(16, Math.min(vw - w - 16, tx))
      ty = Math.max(16, Math.min(vh - h - 16, ty))
      return { tx, ty }
    }

    const render = () => {
      wrap.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg)`
    }

    // gsap.ticker passes (timeInSeconds, deltaTimeInMs, frame).
    const tick = (_time, deltaTime) => {
      const dt = Math.min(deltaTime || 16.7, 64)
      const { tx, ty } = target()
      if (reduced) {
        x = tx
        y = ty
        rot = 0
      } else {
        // Frame-rate independent exponential smoothing.
        const k = 1 - Math.pow(1 - LERP, dt / 16.7)
        const lagX = tx - x
        x += lagX * k
        y += (ty - y) * k
        const wantRot = Math.max(-MAX_TILT, Math.min(MAX_TILT, lagX * TILT))
        rot += (wantRot - rot) * Math.min(1, k * 1.4)
      }
      render()
    }

    const setActive = (slug) => {
      activeSlug = slug
      screens.forEach((s) => s.setAttribute('data-on', s.dataset.slug === slug ? 'true' : 'false'))
      rows.forEach((r) => r.classList.toggle('is-active', r.dataset.project === slug))
      list.classList.toggle('has-active', Boolean(slug))
    }

    const show = () => {
      if (visible) return
      visible = true
      // Start from the right place so the card never flies in from afar.
      const { tx, ty } = target()
      x = tx
      y = ty
      rot = 0
      render()
      gsap.ticker.add(tick)
      gsap.killTweensOf(card)
      if (reduced) {
        gsap.set(card, { opacity: 1, scale: 1 })
      } else {
        gsap.fromTo(
          card,
          { opacity: 0, scale: 0.86 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
        )
      }
    }

    const hide = () => {
      if (!visible) return
      visible = false
      setActive(null)
      gsap.killTweensOf(card)
      if (reduced) {
        gsap.set(card, { opacity: 0 })
        gsap.ticker.remove(tick)
      } else {
        gsap.to(card, {
          opacity: 0,
          scale: 0.92,
          duration: 0.35,
          ease: 'power2.inOut',
          onComplete: () => {
            if (!visible) gsap.ticker.remove(tick)
          },
        })
      }
    }

    const rowAt = (el) => (el && el.closest ? el.closest('[data-project]') : null)

    const sync = (el) => {
      const row = rowAt(el)
      if (!row || !list.contains(row)) {
        hide()
        return
      }
      const slug = row.dataset.project
      if (!slugs.includes(slug)) return
      show()
      if (slug !== activeSlug) setActive(slug)
    }

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      sync(e.target)
    }
    const onLeave = () => hide()

    // Smooth scrolling moves rows under a still pointer without any
    // pointer event, so re-check what is under the cursor after scrolling.
    let scrollRaf = 0
    const onScroll = () => {
      if (!visible || scrollRaf) return
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0
        sync(document.elementFromPoint(mx, my))
      })
    }

    list.addEventListener('pointermove', onMove)
    list.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    gsap.set(card, { opacity: 0 })

    return () => {
      list.removeEventListener('pointermove', onMove)
      list.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('scroll', onScroll)
      if (scrollRaf) cancelAnimationFrame(scrollRaf)
      gsap.ticker.remove(tick)
      gsap.killTweensOf(card)
      list.classList.remove('has-active')
      rows.forEach((r) => r.classList.remove('is-active'))
    }
  }, [listRef, projects])

  return (
    <div className="project-preview" ref={wrapRef} aria-hidden="true">
      <div className="project-preview__card" ref={cardRef}>
        {projects.map((p) => (
          <Screen key={p.slug} project={p} on={false} />
        ))}
      </div>
    </div>
  )
}
