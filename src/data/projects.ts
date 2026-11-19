import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "urbansaathi",
    number: "01",
    name: "UrbanSaathi",
    category: "Civic technology",
    description: "A digital platform for civic complaints and municipal service workflows.",
    overview:
      "A platform that helps residents submit civic complaints and enables municipal teams to review and manage requests.",
    status: "Live project",
    stack: ["Next.js", "React", "Node.js", "MySQL"],
    externalUrl: "https://urban-saathi.vercel.app"
  },
  {
    slug: "pulsewatch",
    number: "02",
    name: "PulseWatch",
    category: "Monitoring platform",
    description: "A monitoring and notification platform for service health and events.",
    overview:
      "A monitoring platform designed to help users track service health, review events and receive notifications.",
    status: "Live project",
    stack: ["Next.js", "Node.js", "SQLite"],
    externalUrl: "https://pulsewatchweb.vercel.app"
  },
  {
    slug: "portfolio",
    number: "03",
    name: "Portfolio",
    category: "Personal portfolio",
    description: "A portfolio showcasing software projects, engineering and creative work.",
    overview:
      "A personal portfolio presenting selected projects, technical skills and professional work.",
    status: "Live project",
    stack: ["Web development", "Frontend", "Portfolio"],
    externalUrl: "https://harish-nesrekar.github.io/portfolio/"
  }
];
