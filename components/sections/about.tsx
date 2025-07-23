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
        <p className="font-semibold md:text-lg">Hello, Arman Radmanesh here!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
          <p>
            An ambitious full-stack software engineer from Iran with 15 years of
            experience in building web applications, recently, using <ReactBadge />.
          </p>
          <p>
            I am passionate about data analysis and visualization especially coming up with new ways
            to automatically generate insights from different kind of data.
          </p>
          <p>
            With a background in software engineering and data science, I have
            worked on a wide range of projects, from building web applications to
            analyzing data and creating data driven visualizations.
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
