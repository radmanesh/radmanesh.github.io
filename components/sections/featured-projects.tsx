import PROJECTS from "@/content/projects";
import { ProjectCard } from "@/components/shared/project-card";
import { AnimatedLink } from "@/components/shared/animated-link";
import { Section, SectionTitle } from "@/components/shared/section";

// --------- COMPONENT ---------
export function FeaturedProjects() {
  return (
    <Section>
      <SectionTitle text="Featured projects" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PROJECTS.filter((p) => p.featured).map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className="flex justify-end">
        <AnimatedLink href="/projects">View all projects</AnimatedLink>
      </div>
    </Section>
  );
}
