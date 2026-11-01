import { useRef } from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import useScrollReveal from '../hooks/useScrollReveal.js'
import useHeroBridge from '../hooks/useHeroBridge.js'
import useMagneticButton from '../hooks/useMagneticButton.js'
import ProjectPreview from '../components/ProjectPreview.jsx'

const skills = [
  { name: 'HTML', cat: 'markup' },
  { name: 'CSS', cat: 'style' },
  { name: 'JavaScript', cat: 'script' },
  { name: 'React', cat: 'script' },
  { name: 'Python', cat: 'script' },
  { name: 'Canva', cat: 'design' },
  { name: 'Responsive Design', cat: 'design' },
  { name: 'UI Design', cat: 'design' },
]

const projects = [
  {
    num: '01',
    slug: 'fitness-os',
    image: '/previews/fitness-os.jpg',
    name: 'Fitness OS',
    type: 'Fitness tracker · Training, nutrition & progress · Installable web app',
    status: 'Live',
    href: 'https://seraphcodes.github.io/fitness-os/',
  },
  {
    num: '02',
    slug: 'business-lab',
    image: '/previews/business-lab.jpg',
    name: 'Business Performance & Decision Lab',
    type: 'Retail analytics dashboard · Python · SQL · Power BI',
    status: 'Live',
    href: 'https://seraphcodes.github.io/business-performance-decision-lab/#overview',
  },
  {
    num: '03',
    slug: 'portfolio',
    image: '/previews/portfolio.jpg',
    name: 'Personal Portfolio',
    type: 'React · GSAP · Vite',
    status: 'Live',
  },
  {
    num: '04',
    slug: 'verdict-ai',
    image: '/previews/verdict-ai.jpg',
    name: 'Verdict AI',
    type: 'AI-Powered SaaS for analysing customer reviews, uncovering sentiment, and product insights, and supporting data-driven decisions.',
    status: 'In progress',
  },
]

export default function Home() {
  const pageRef = useRef(null)
  const stageRef = useRef(null)
  const heroApiRef = useRef(null)
  const surfaceTintRef = useRef(null)
  const philosophyTextRef = useRef(null)
  const philosophyQuoteRef = useRef(null)
  const contactButtonRef = useRef(null)
  const projectListRef = useRef(null)
  useScrollReveal(pageRef)
  useHeroBridge(stageRef, heroApiRef, surfaceTintRef, philosophyTextRef, philosophyQuoteRef)
  useMagneticButton(contactButtonRef)

  return (
    <div ref={pageRef}>
      <div className="hero-philosophy-stage" ref={stageRef}>
        <Hero skipIntro ref={heroApiRef} />

        {/* One continuous material: a full-bleed colour layer that sits
            above Hero's own portrait/veil/grid and scrubs from
            transparent to the same warm cream tone used by About/Skills/
            Projects. This is not a second background replacing the
            first - it's the same surface's own paint gradually shifting,
            which is what makes the transition read as the environment
            evolving rather than one section handing off to another. */}
        <div className="stage-surface-tint" ref={surfaceTintRef} aria-hidden="true" />

        {/* Philosophy is now a plain text layer, not an independent
            section with its own background - it shares the surface
            above rather than bringing its own. */}
        <div
          className="philosophy-text"
          id="philosophy"
          data-section="bridge"
          aria-label="Design philosophy"
          ref={philosophyTextRef}
        >
          <div className="philosophy__inner container">
            <blockquote className="philosophy__quote" ref={philosophyQuoteRef}>
              Great digital experiences are built around <em>people</em>, not technology — intuitive,
              meaningful, and designed to solve real problems.
            </blockquote>
          </div>
        </div>
      </div>

      <section className="about" id="about" data-section="light" aria-label="About Seraph Hashimi">
        <div className="container">
          <header className="section-head">
            <p className="section-tag js-reveal" aria-hidden="true">A little about me.</p>
            <div className="section-rule" aria-hidden="true"></div>
          </header>

          <div className="about__grid">
            <div className="about__left">
              <h2 className="about__heading js-reveal" data-reveal-y="14">
                Hi, I&apos;m
                <br />
                Seraph.
              </h2>
              <Link ref={contactButtonRef} to="/contact" className="pill-btn js-reveal" data-cursor>
                Get In Touch
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
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

      <section className="skills" id="skills" data-section="light-alt" aria-label="Skills and tools">
        <div className="container">
          <header className="section-head">
            <p className="section-tag js-reveal" aria-hidden="true">Skills &amp; Tools</p>
            <div className="section-rule" aria-hidden="true"></div>
          </header>
          <div className="skills__grid">
            <p className="skills__intro js-reveal">
              Technologies I use
              <br />
              to bring ideas to life.
            </p>
            <ul className="skills__pills" role="list" aria-label="Technologies">
              {skills.map((skill) => (
                <li key={skill.name} className="skill-pill js-reveal" data-reveal-y="30" data-cat={skill.cat}>
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="projects" id="projects" data-section="light" aria-label="Selected projects">
        <div className="container">
          <header className="section-head js-reveal">
            <p className="section-tag" aria-hidden="true">Selected Work</p>
            <div className="section-rule" aria-hidden="true"></div>
          </header>
          <ol className="project-list" role="list" ref={projectListRef}>
            {projects.map((project) =>
              project.href ? (
                <li key={project.num} className="project-row project-row--live js-reveal" data-reveal-y="30" data-project={project.slug}>
                  <a
                    className="project-row__link"
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor
                    data-cursor-label="View"
                    aria-label={`${project.name} — open live project in a new tab`}
                  >
                    <span className="project-row__num" aria-hidden="true">
                      {project.num}
                    </span>
                    <div className="project-row__body">
                      <h3 className="project-row__name">{project.name}</h3>
                      <p className="project-row__type">{project.type}</p>
                    </div>
                    <span className="project-row__status">
                      {project.status} <span aria-hidden="true">↗</span>
                    </span>
                  </a>
                </li>
              ) : (
                <li
                  key={project.num}
                  className={`project-row project-row--pending js-reveal${project.status === 'Live' ? ' project-row--live project-row--featured' : ''}`}
                  data-reveal-y="30"
                  data-project={project.slug}
                >
                  <span className="project-row__num" aria-hidden="true">
                    {project.num}
                  </span>
                  <div className="project-row__body">
                    <h3 className="project-row__name">{project.name}</h3>
                    <p className="project-row__type">{project.type}</p>
                  </div>
                  <span className="project-row__status">{project.status}</span>
                </li>
              )
            )}
          </ol>
          <ProjectPreview listRef={projectListRef} projects={projects} />
        </div>
      </section>

      <section className="contact contact--home" id="contact" data-section="dark" aria-label="Contact Seraph Hashimi">
        <div className="container">
          <div className="contact__intro contact__intro--centered">
            <p className="contact__eye js-reveal">Ready to connect?</p>
            <h2 className="contact__title js-reveal" data-reveal-y="14">
              Let&apos;s build something
              <br />
              <em>meaningful.</em>
            </h2>
            <p className="contact__body js-reveal">
              Whether it&apos;s a project, a collaboration, or simply a conversation about technology —
              I&apos;d love to hear from you.
            </p>

            <div className="contact__links contact__links--centered js-reveal">
              <a href="mailto:hasimi.sayedmahdi100@gmail.com" className="contact-link" data-cursor data-cursor-label="Contact">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 7L2 7" />
                </svg>
                Email
              </a>
              <a href="https://wa.me/+4915209407692" target="_blank" rel="noopener noreferrer" className="contact-link" data-cursor data-cursor-label="Visit">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
