import type { Metadata } from "next";
import { services } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Train } from "@/components/ui/train";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard } from "@/components/services/service-card";
import { Process } from "@/components/home/process";
import { ContactCta } from "@/components/home/contact-cta";

export const metadata: Metadata = { title: "Services" };

export default function ServicesPage() {
  return (
    <main className="inner-page">
      <section className="inner-hero container">
        <span className="eyebrow">Our services</span>
        <h1>Technology built<br /><em>around your business.</em></h1>
        <p className="section-lead">Practical engineering capabilities for ideas, operations and products at every stage.</p>
        <div className="inner-hero-actions"><Button href="/contact">Discuss a project</Button></div>
      </section>
      <section className="section section-soft train-section">
        <Reveal className="container train-intro">
          <h2>{services.length} ways we can <em>help.</em></h2>
          <p className="section-lead">Pick one, or combine several. Each service can stand alone or slot into a larger product.</p>
        </Reveal>
        <Train label="All services" speed={32}>
          {services.map((service) => (
            <ServiceCard key={service.number} {...service} />
          ))}
        </Train>
      </section>
      <Process />
      <ContactCta />
    </main>
  );
}
