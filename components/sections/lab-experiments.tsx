import LABS from "@/content/labs";
import { ExperimentCard } from "@/components/shared/experiment-card";
import { AnimatedLink } from "@/components/shared/animated-link";
import { Section, SectionTitle } from "@/components/shared/section";

// --------- COMPONENT ---------
export function LabExperiments() {
  // Show the first available experiment
  const featuredExperiment = LABS[0];

  if (!featuredExperiment) return null;

  return (
    <Section>
      <SectionTitle text="Lab experiments" />
      <div className="grid grid-cols-1 gap-4">
        <ExperimentCard experiment={featuredExperiment} />
      </div>
      <div className="flex justify-end">
        <AnimatedLink href="/lab">View all experiments</AnimatedLink>
      </div>
    </Section>
  );
}
