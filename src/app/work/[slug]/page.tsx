import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { Button } from "@/components/ui/button";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project?.name ?? "Project" };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main className="inner-page">
      <section className="inner-hero container">
        <Link href="/work" className="back-link"><ArrowLeft size={15} /> All work</Link>
        <span className="eyebrow">{project.category}</span>
        <h1>{project.name}<br /><em>Project overview.</em></h1>
        <p className="section-lead">{project.overview}</p>
        <span className="project-status"><i />{project.status}</span>
      </section>
      <section className="section section-soft">
        <div className="container project-detail-grid">
          <div><span className="eyebrow">Overview</span><h2>A considered approach to a real-world challenge.</h2></div>
          <div className="detail-panel">
            <p>{project.overview}</p>
            <span className="eyebrow">Technology concepts</span>
            <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
            {project.externalUrl && (
              <div className="detail-actions"><Button href={project.externalUrl} target="_blank" rel="noopener noreferrer" variant="secondary">Visit live project</Button></div>
            )}
          </div>
        </div>
      </section>
      <section className="section container">
        <p className="honesty-note">This page describes a demonstration project. Confirm all implementation details and replace concept descriptions with verified project facts before presenting it as completed client work.</p>
        <Button href="/contact">Discuss a similar project</Button>
      </section>
    </main>
  );
}
