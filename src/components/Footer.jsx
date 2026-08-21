export default function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="site-footer__inner">
          <span className="footer-logo">SH</span>
          <span className="footer-name">Seraph Hashimi</span>
          <div className="footer-rule" aria-hidden="true"></div>
          <p className="footer-copy">&copy; {new Date().getFullYear()} Seraph Hashimi. All rights reserved.</p>
          <p className="footer-built">Built with React &amp; Vite.</p>
        </div>
      </div>
    </footer>
  )
}
