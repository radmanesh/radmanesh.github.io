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
        <p className="font-semibold md:text-lg">Hello, Ahmed Ismail here!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            An ambitious frontend software engineer from Egypt with 5 years of
            experience in building single page apps with <ReactBadge />.
          </p>
          <p>
            I am passionate about the intersection between design and
            programming aspiring to become a design engineer.
          </p>
          <p>
            With a keen eye for the little details, I aim to create beautiful
            and functional software that is both intuitive and enjoyable for
            users.
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
