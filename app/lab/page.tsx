import LABS from "@/content/labs";
import { ExperimentCard } from "@/components/shared/experiment-card";
import { Section, SectionTitle } from "@/components/shared/section";

// --------- PAGE LAYOUT ---------
export default function LabPage() {
  return (
    <Section>
      <SectionTitle text="Lab" />
      <div className="grid grid-cols-1 gap-4">
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          A space for experiments, prototypes, and utilities I’m exploring. This is
          where ideas take shape before graduating into full projects or posts.
        </p>
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          Some experiments open as full pages, while others may launch in a modal
          from here. Results are generally stored locally for quick iteration.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LABS.map((exp) => (
          <ExperimentCard key={exp.id} experiment={exp} />
        ))}
      </div>
    </Section>
  );
}
