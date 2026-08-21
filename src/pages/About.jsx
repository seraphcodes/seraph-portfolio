import { useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal.js'

export default function About() {
  const pageRef = useRef(null)
  useScrollReveal(pageRef)

  return (
    <div ref={pageRef}>
      <section className="about about--page" id="about" data-section="light" aria-label="About Seraph Hashimi">
        <div className="container">
          <header className="section-head">
            <p className="section-tag js-reveal" aria-hidden="true">A little about me.</p>
            <div className="section-rule" aria-hidden="true"></div>
          </header>

          <div className="about__grid">
            <div className="about__left">
              <h1 className="about__heading js-reveal">
                Hi, I&apos;m
                <br />
                Seraph.
              </h1>
            </div>

            <div className="about__right">
              <div className="about__bio">
                <p className="js-reveal">
                  I&apos;m a Digital Business &amp; Data Science student based in Germany with a deep
                  passion for web development, design, and technology. I transform ideas into clean,
                  modern, and human-friendly digital experiences that balance creativity with function.
                </p>
                <p className="js-reveal">
                  Every project is an opportunity to learn, grow, and build something that delivers real
                  value to real people. My core skills span HTML, CSS, JavaScript, React, and Python,
                  alongside UI design and responsive layout work.
                </p>
              </div>

              <dl className="about__stats js-reveal" aria-label="Quick facts">
                <div className="about__stat">
                  <dt className="stat-l">Years learning</dt>
                  <dd className="stat-n">2+</dd>
                </div>
                <div className="about__stat">
                  <dt className="stat-l">Projects built</dt>
                  <dd className="stat-n">3+</dd>
                </div>
                <div className="about__stat">
                  <dt className="stat-l">Based in</dt>
                  <dd className="stat-n">DE</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
