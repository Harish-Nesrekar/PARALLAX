import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Link href="/" className="wordmark footer-wordmark">PARALLAX<span>.</span></Link>
            <p className="footer-description">
              Software engineering and digital solutions.<br />
              Engineering a different perspective.
            </p>
          </div>
          <div className="footer-column">
            <span className="eyebrow">Explore</span>
            <Link href="/services">Services</Link>
            <Link href="/work">Our work</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
          <div className="footer-column">
            <span className="eyebrow">Get in touch</span>
            <Link href="/contact">Start a project <ArrowUpRight size={14} /></Link>
            <span className="footer-note">Business enquiries through our contact form.</span>
          </div>
        </div>
        <div className="footer-giant" aria-hidden="true">PARALLAX</div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} PARALLAX. All rights reserved.</span>
          <div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div>
          <span className="footer-location">Independent software engineering</span>
        </div>
      </div>
    </footer>
  );
}
