import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/ui/reveal";

const projectThemes = ["project-art-one", "project-art-two", "project-art-three"];

export function FeaturedWork() {
  return (
    <section id="work" className="section section-work">
      <div className="container">
        <Reveal className="section-heading-row">
          <div><span className="eyebrow">Selected explorations</span><h2>Ideas made <em>tangible.</em></h2></div>
          <p className="section-lead">Selected products and digital work.</p>
        </Reveal>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 100}>
              <a className="project-card glow" href={project.externalUrl ?? `/work/${project.slug}`} target={project.externalUrl ? "_blank" : undefined} rel={project.externalUrl ? "noopener noreferrer" : undefined}>
                <div className={`project-art ${projectThemes[index % projectThemes.length]}`}>
                  <span className="project-art-label">{project.number}</span>
                  <div className="project-art-shape"><span /></div>
                  <span className="project-open"><ArrowUpRight size={18} /></span>
                </div>
                <div className="project-body">
                  <div className="project-meta"><span>{project.category}</span><span className="project-live"><i />{project.status}</span></div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
