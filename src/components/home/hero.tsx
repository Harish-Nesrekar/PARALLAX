import { ArrowDownRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ParallaxGeometry } from "@/components/visuals/parallax-geometry";

const ticker = ["Strategy", "Design", "Engineering", "Web apps", "Mobile apps", "AI automation", "SaaS products", "APIs"];

export function Hero() {
  return (
    <section className="hero-section">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="hero-kicker"><span className="status-dot" /> Independent software engineering</div>
          <h1>
            Complex<br />
            problems.<br />
            <em>Different</em><br />
            perspectives.
          </h1>
          <p className="hero-lead">
            We engineer digital solutions that help businesses operate smarter,
            scale faster and create meaningful impact.
          </p>
          <div className="hero-actions">
            <Button href="/contact">Start a project</Button>
            <Button href="/work" variant="secondary">Explore our work</Button>
          </div>
          <a href="#capabilities" className="scroll-cue"><ArrowDownRight size={16} /> Scroll to explore</a>
        </div>
        <div className="hero-art-wrap">
          <ParallaxGeometry />
        </div>
      </div>
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <div className="marquee-set" key={k}>
              {ticker.map((t) => (<span key={t + k}>{t}</span>))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
