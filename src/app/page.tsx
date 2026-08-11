import { About } from "@/components/about";
import { Career } from "@/components/career";
import { ClientProjectsSection } from "@/components/client-projects";
import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Skills } from "@/components/skills";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <About />
        <ProjectsSection />
        <ClientProjectsSection />
        <Career />
        <Skills />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
