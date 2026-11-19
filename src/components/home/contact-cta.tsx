import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function ContactCta() {
  return (
    <section className="closing-cta">
      <div className="container">
        <div className="closing-cta-inner">
          <span className="cta-orbit" aria-hidden="true" />
          <span className="eyebrow">The next step</span>
          <h2>Have a challenge<br />worth <em>solving?</em></h2>
          <p>Let&apos;s explore how the right technology can move your business forward.</p>
          <Link href="/contact" className="cta-link">Start a conversation <ArrowUpRight size={20} /></Link>
        </div>
      </div>
    </section>
  );
}
