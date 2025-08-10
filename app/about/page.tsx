import Link from "next/link";

import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineItem,
  TimelineLink,
  TimelineTime,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  Section,
  SectionSubtitle,
  SectionTitle,
} from "@/components/shared/section";

import ABOUT from "@/content/about";
import { NextBadge } from "@/components/badges/next";
import { ReactBadge } from "@/components/badges/react";
import { TypeScriptBadge } from "@/components/badges/typescript";
import { TailwindCssBadge } from "@/components/badges/tailwindcss";

// --------- PAGE LAYOUT ---------
export default function AboutPage() {
  return (
    <Section>
      <SectionTitle text="About me" />
      <div className="grid grid-cols-1 gap-4">
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          I’m Arman Radmanesh — a full‑stack software engineer and data analyst, currently pursuing
          an M.S. in Data Science and Analytics at the University of Oklahoma. I split my time between
          research and product, focusing on tools that make data collection, analysis, and insight generation
          simpler and more trustworthy.
        </p>
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          I build dependable web apps end‑to‑end—fast, accessible, and maintainable. Day‑to‑day I work with
          <ReactBadge />, <NextBadge />, <TypeScriptBadge />, and <TailwindCssBadge /> to deliver responsive,
          scalable interfaces backed by clean APIs and data workflows.
        </p>
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          Recently, I’ve been developing two research platforms:
          {" "}
          <Link
            href="https://jamasp.app"
            className="underline decoration-dotted decoration-1 underline-offset-4 text-muted-foreground/90"
          >
            Jamasp
          </Link>
          {" "}
          (wearables data to analysis) and
          {" "}
          <Link
            href="https://cut.social"
            className="underline decoration-dotted decoration-1 underline-offset-4 text-muted-foreground/90"
          >
            Cut (Lens)
          </Link>
          {" "}
          (build and run behavioral studies). Beyond code, I enjoy sci‑fi and fantasy, and I recharge
          outdoors—camping and chasing big skies. Always open to interesting collaborations.
        </p>
      </div>
      <SectionSubtitle text="Education" />
      <div className="grid grid-cols-1 gap-4 px-2">
        <Timeline>
          {ABOUT.education.map((item) => (
            <TimelineItem key={item.id}>
              <TimelineConnector />
              <TimelineTime>
                {`${item.period.from} - ${item.period.to}`}
              </TimelineTime>
              <TimelineContent>
                <TimelineTitle>{item.institute}</TimelineTitle>
                <TimelineDescription>{item.degree}</TimelineDescription>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
      <SectionSubtitle text="Experience" />
      <div className="grid grid-cols-1 gap-4 px-2">
        <Timeline>
          {ABOUT.experience.map((item) => (
            <TimelineItem key={item.id}>
              <TimelineConnector />
              <TimelineTime>
                {`${item.period.from} - ${item.period.to}`}
              </TimelineTime>
              <TimelineContent>
                <TimelineTitle>{item.role.title}</TimelineTitle>
                <TimelineLink
                  target="_blank"
                  href={item.company.url}
                  referrerPolicy="no-referrer"
                >
                  {item.company.name}
                </TimelineLink>
              </TimelineContent>
              <TimelineDescription>{item.role.description}</TimelineDescription>
            </TimelineItem>
          ))}
        </Timeline>
      </div>
    </Section>
  );
}
