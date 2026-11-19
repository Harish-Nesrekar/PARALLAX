import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Capabilities } from "@/components/home/capabilities";
import { Process } from "@/components/home/process";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <main className="inner-page">
      <section className="inner-hero container">
        <span className="eyebrow">About PARALLAX</span>
        <h1>See the problem<br /><em>from another angle.</em></h1>
        <p className="section-lead">Technology is not just about writing code. It is about understanding what needs to change and building a thoughtful way forward.</p>
      </section>
      <section className="section section-soft">
        <Reveal className="container about-grid">
          <h2>Our philosophy</h2>
          <div>
            <p className="about-statement">Engineering should make complexity feel clear.</p>
            <p className="section-lead">PARALLAX is being built around business-first thinking, considered design and practical software engineering.</p>
            <p className="placeholder-note">Founder profile, company history, mission and vision should be completed with confirmed information before launch.</p>
          </div>
        </Reveal>
      </section>
      <Capabilities />
      <Process />
      <section className="section container about-cta"><Button href="/contact">Start a conversation</Button></section>
    </main>
  );
}
