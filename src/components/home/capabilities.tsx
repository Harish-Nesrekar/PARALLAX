import { Reveal } from "@/components/ui/reveal";

export const principles = [
  ["01", "Scalable architecture", "Systems designed around clear foundations, with room to evolve."],
  ["02", "User-centred design", "Interfaces shaped around the people who depend on them."],
  ["03", "Transparent communication", "Clear scope, thoughtful decisions and visible progress."],
  ["04", "Long-term thinking", "Reliable releases and support beyond the first launch."]
] as const;

export function Capabilities() {
  return (
    <section id="capabilities" className="section">
      <div className="container capability-grid">
        <Reveal>
          <span className="eyebrow">Our approach</span>
          <h2>Business-first<br /><em>engineering.</em></h2>
          <p className="section-lead">
            Every project starts with the problem your business needs solved.
            Technology choices follow from that — not the other way around.
          </p>
        </Reveal>
        <div className="principle-list">
          {principles.map(([number, title, description], i) => (
            <Reveal key={number} delay={i * 90}>
              <article className="principle glow">
                <span className="principle-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
