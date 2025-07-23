import PROJECTS from "@/content/projects";
import { SectionTitle } from "@/components/shared/section";
import { ProjectCard } from "@/components/shared/project-card";
import { PaginationButton } from "@/components/shared/pagination-button";

export const dynamic = "force-static";

// --------- PAGE ---------
export default function ProjectsPage() {
  const start = 0;
  const ITEMS_PER_PAGE = 6;
  const currentPage = 1; // Static page shows first page only
  const end = ITEMS_PER_PAGE * currentPage;

  const visibleProjects = PROJECTS.slice(start, end);
  const hasMore = end < PROJECTS.length;

  return (
    <div className="space-y-12">
      <SectionTitle text="Projects" />
      <div className="grid grid-cols-1 gap-4">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      <div className="flex justify-center">
        <PaginationButton
          hasMore={hasMore}
          baseHref="/projects"
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
