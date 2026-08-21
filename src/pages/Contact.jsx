import { useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal.js'

export default function Contact() {
  const pageRef = useRef(null)
  useScrollReveal(pageRef)

  return (
    <div ref={pageRef}>
      <section className="contact contact--page" id="contact" data-section="dark" aria-label="Contact Seraph Hashimi">
        <div className="container">
          <div className="contact__intro contact__intro--centered">
            <p className="contact__eye js-reveal">Ready to connect?</p>
            <h1 className="contact__title js-reveal">
              Let&apos;s build something
              <br />
              <em>meaningful.</em>
            </h1>
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
