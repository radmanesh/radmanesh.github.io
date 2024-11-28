import Link from "next/link";

import ABOUT from "@/content/about";
import {
  Section,
  SectionSubtitle,
  SectionTitle,
} from "@/components/shared/section";
import { NextBadge } from "@/components/badges/next";
import { ReactBadge } from "@/components/badges/react";
import { SectionCard } from "@/components/shared/section-card";
import { TypeScriptBadge } from "@/components/badges/typescript";
import { TailwindCssBadge } from "@/components/badges/tailwindcss";

export default function AboutPage() {
  return (
    <Section>
      <SectionTitle text="About me" />
      <div className="grid grid-cols-1 gap-4">
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          Hello world! I'm Ahmed Ismail, a Full-Stack Software Engineer based in
          Tanta, Egypt, with a deep passion for front-end development.
          Currently, I'm working as a founding engineer at{" "}
          <Link
            href="https://reconciled.io"
            className="underline decoration-dotted decoration-1 underline-offset-4 text-muted-foreground/90"
          >
            Reconciled
          </Link>
          , where I get to blend creativity with technical skills to craft
          beautiful, functional, and intuitive user experiences.
        </p>
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          I'm all about creating software that not only works but feels right.
          My tools of choice are <ReactBadge />, <NextBadge />,{" "}
          <TypeScriptBadge />, and <TailwindCssBadge />
          —technologies that empower me to build fast, responsive, and scalable
          apps. But it doesn't stop there. I'm also passionate about design
          engineering—the intersection of clean, elegant code and user-centric
          design. I believe the best apps are those that blend great usability
          with a thoughtful aesthetic.
        </p>
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          When I'm not coding, you'll likely find me reading, writing, or
          experimenting with new technologies. I'm always hungry to learn and
          grow, whether it's through diving into new programming paradigms or
          exploring the latest trends in UX/UI design.
        </p>
      </div>
      <SectionSubtitle text="Education" />
      <div className="grid grid-cols-1 gap-4">
        {ABOUT.education.map((item) => (
          <SectionCard key={item.entity} item={item} />
        ))}
      </div>
      <SectionSubtitle text="Experience" />
      <div className="grid grid-cols-1 gap-4">
        {ABOUT.experience.map((item) => (
          <SectionCard key={item.entity} item={item} />
        ))}
      </div>
    </Section>
  );
}
