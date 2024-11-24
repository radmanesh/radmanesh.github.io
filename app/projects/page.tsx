import PROJECTS from "@/content/projects";
import { SectionTitle } from "@/components/shared/section";
import { ProjectCard } from "@/components/shared/project-card";
import { PaginationButton } from "@/components/shared/pagination-button";

// --------- PAGE PROPS---------
interface ProjectsPageProps {
  searchParams: Promise<{ page?: string }>;
}

// --------- PAGE ---------
export default async function ProjectsPage({
  searchParams,
}: ProjectsPageProps) {
  const { page } = await searchParams;
  const start = 0;
  const ITEMS_PER_PAGE = 6;
  const currentPage = Number(page) || 1;
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
