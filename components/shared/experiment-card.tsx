import { Experiment } from "portfolioManager";
import { ComponentProps } from "react";

// --------- COMPONENT PROPS ---------
interface ExperimentCardProps extends ComponentProps<"a"> {
  experiment: Experiment;
}

// --------- COMPONENT LAYOUT ---------
export function ExperimentCard({ experiment, ...props }: Readonly<ExperimentCardProps>) {
  return (
    <a href={`/lab/${experiment.slug}`} {...props}>
      <div className="rounded-lg border text-card-foreground relative overflow-hidden transition-all duration-300 bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-500 dark:hover:border-zinc-400">
        <div className="flex items-center p-4">
          <div className="shrink-0 mr-4">{experiment.logo}</div>
          <div className="grow min-w-0 tracking-tight font-normal">
            <h2 className="font-semibold truncate">{experiment.title}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {experiment.description}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}
