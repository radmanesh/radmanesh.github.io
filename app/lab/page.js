// filepath: /workspaces/portfolio/app/lab/page.tsx
import { Section, SectionTitle } from "@/components/shared/section";

// --------- PAGE LAYOUT ---------
export default function LabPage() {
  return (
    <Section>
      <SectionTitle text="Lab" />
      <div className="grid grid-cols-1 gap-4">
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          A space for experiments, prototypes, and utilities I’m exploring. This is where ideas
          take shape before graduating into full projects or posts.
        </p>
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          I’ll publish small interactive demos, performance benchmarks, and research notes here.
          Check back soon for updates.
        </p>
      </div>
    </Section>
  );
}