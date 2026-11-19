import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";

export function About() {
  return (
    <section id="about" className="section">
      <Reveal className="container about-grid">
        <div><span className="eyebrow">A different perspective</span><h2>Technology is not just about writing code.</h2></div>
        <div>
          <p className="about-statement">It&apos;s about seeing possibilities differently.</p>
          <p className="section-lead">
            PARALLAX approaches each challenge from more than one angle before
            building. The aim is software that is useful, considered and ready to evolve.
          </p>
          <p className="placeholder-note">Founder introduction and company story can be added here when confirmed.</p>
          <Button href="/about" variant="secondary">Discover PARALLAX</Button>
        </div>
      </Reveal>
    </section>
  );
}
