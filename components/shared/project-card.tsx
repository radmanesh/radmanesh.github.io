import { Project } from "portfolioManager";
import { ComponentProps } from "react";

// --------- COMPONENT PROPS ---------
interface ProjectCardProps extends ComponentProps<"a"> {
  project: Project;
}

// --------- COMPONENT LAYOUT ---------
export function ProjectCard({ project, ...props }: Readonly<ProjectCardProps>) {
  return (
    <a href={project.url} {...props}>
      <div className="rounded-lg border text-card-foreground relative overflow-hidden transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-400">
        <div className="flex items-center p-4">
          <div className="shrink-0 mr-4">{project.logo}</div>
          <div className="grow min-w-0 tracking-tight font-normal">
            <h2 className="font-semibold truncate">{project.title}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {project.description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
