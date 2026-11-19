import Link from "next/link";
import { ArrowUpRight, Bot, Code, Globe, Layers, PenTool, Plug, Smartphone, Workflow, type LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "01": Code,
  "02": Globe,
  "03": Smartphone,
  "04": Bot,
  "05": Layers,
  "06": Plug,
  "07": PenTool,
  "08": Workflow
};

type Props = { number: string; title: string; description: string; outcome: string };

export function ServiceCard({ number, title, description, outcome }: Props) {
  const Icon = icons[number] ?? Code;
  return (
    <article className="service-card glow">
      <div className="service-card-top">
        <span className="service-icon"><Icon size={22} strokeWidth={1.6} /></span>
        <span className="service-number">{number}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="service-outcome"><span>Outcome</span>{outcome}</div>
      <Link href="/contact" aria-label={`Enquire about ${title}`} draggable={false}>
        Discuss this service <ArrowUpRight size={15} />
      </Link>
    </article>
  );
}
