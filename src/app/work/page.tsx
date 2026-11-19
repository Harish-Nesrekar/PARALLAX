import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/reveal";
import { ContactCta } from "@/components/home/contact-cta";

export const metadata: Metadata = { title: "Our Work" };

const themes = ["project-art-one", "project-art-two", "project-art-three"];

export default function WorkPage() {
  return (
    <main className="inner-page">
      <section className="inner-hero container">
        <span className="eyebrow">Selected work</span>
        <h1>Ideas made <em>tangible.</em></h1>
        <p className="section-lead">A selection of demonstration projects and product explorations.</p>
      </section>
      <section className="section section-work">
        <div className="container project-grid">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 100}>
              <Link className="project-card glow" href={`/work/${project.slug}`}>
                <div className={`project-art ${themes[index % themes.length]}`}>
                  <span className="project-art-label">{project.number}</span>
                  <div className="project-art-shape"><span /></div>
                  <span className="project-open"><ArrowUpRight size={18} /></span>
                </div>
                <div className="project-body">
                  <div className="project-meta"><span>{project.category}</span><span className="project-live"><i />{project.status}</span></div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <ContactCta />
    </main>
  );
}
