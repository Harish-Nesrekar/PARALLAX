import { services } from "@/data/services";
import { Train } from "@/components/ui/train";
import { Reveal } from "@/components/ui/reveal";
import { ServiceCard } from "@/components/services/service-card";

export function Services() {
  return (
    <section id="services" className="section section-soft">
      <div className="container">
        <Reveal className="section-heading-row">
          <div>
            <span className="eyebrow">What we do</span>
            <h2>Thoughtful technology.<br /><em>Purposeful outcomes.</em></h2>
          </div>
          <p className="section-lead">From the first product idea to the systems that help a business grow.</p>
        </Reveal>
      </div>
      <Train label="Our services">
        {services.map((service) => (
          <ServiceCard key={service.number} {...service} />
        ))}
      </Train>
    </section>
  );
}
