import Link from "next/link";

import { ReactBadge } from "@/components/badges/react";
import { AnimatedLink } from "@/components/shared/animated-link";
import { Section, SectionTitle } from "@/components/shared/section";

// --------- COMPONENT LAYOUT ---------
export function About() {
  return (
    <Section>
      <SectionTitle text="Meet me" />
      <div className="grid grid-cols-1 gap-4 leading-relaxed md:leading-normal tracking-tight text-muted-foreground selection:text-muted-foreground/80">
        <p className="font-semibold md:text-lg">Hi, I’m Arman Radmanesh.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
          <p>
            I’m a full‑stack software engineer and data analyst with 15+ years of experience
            building web applications—lately with <ReactBadge /> and friends. I care about clear UX,
            reliable systems, and shipping features that matter.
          </p>
          <p>
            I love turning messy data into useful stories: from clean pipelines to concise
            visualizations and insight generation. My work spans research tooling and
            production products.
          </p>
          <p>
            Trained in software engineering and data science, I’ve delivered platforms end‑to‑end—
            designing APIs, crafting front‑ends, and building data‑driven experiences. Curious by
            default, pragmatic when it counts.
          </p>
        </div>
        <div className="flex justify-end">
          <Link
            href="/about"
            className="group flex items-center relative w-fit font-semibold after:absolute after:bottom-0 after:right-0 after:h-[1px] after:w-0 after:bg-current hover:after:w-full after:transition-all after:duration-300 hover:after:left-0 hover:after:right-auto"
          >
            <AnimatedLink href="/about">Find out more</AnimatedLink>
          </Link>
        </div>
      </div>
    </Section>
  );
}
