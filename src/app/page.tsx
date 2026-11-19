import { Hero } from "@/components/home/hero";
import { Capabilities } from "@/components/home/capabilities";
import { Services } from "@/components/home/services";
import { FeaturedWork } from "@/components/home/featured-work";
import { Process } from "@/components/home/process";
import { About } from "@/components/home/about";
import { ContactCta } from "@/components/home/contact-cta";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Capabilities />
      <Services />
      <FeaturedWork />
      <Process />
      <About />
      <ContactCta />
    </main>
  );
}
