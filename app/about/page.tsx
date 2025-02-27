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
          Hello world! I'm Arman Radmanesh, a Full-Stack Software Engineer and Data Analyst currently studying
          Master of Data Science at The Oklahoma University.
          Currently, I'm working as a GRA at the University of Oklahoma, and as a Research Developer on{" "}
          <Link
            href="https://jamasp.app"
            className="underline decoration-dotted decoration-1 underline-offset-4 text-muted-foreground/90"
          >
            Jamasp
          </Link>
          , which is a tool that is set to transform wearable device research by providing seamless integration from data collection to
          advanced analysis. I'm also working on{" "}
          <Link
            href="https://cut.social"
            className="underline decoration-dotted decoration-1 underline-offset-4 text-muted-foreground/90"
          >
            Cut (Lens)
          </Link>
          , a platform that enables researchers to build and run psychological and behavioral studies.
        </p>
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          I specialize in building high-quality web applications that are both
          performant and user-friendly.
          My tools of choice are <ReactBadge />, <NextBadge />,{" "}
          <TypeScriptBadge />, and <TailwindCssBadge />
          —technologies that empower me to build fast, responsive, and scalable
          apps. I'm passionate about creating software that solves real-world
          problems and delivers value to users.
        </p>
        <p className="text-base text-justify text-muted-foreground tracking-tight font-normal">
          Outside of coding, I love reading fiction, especially sci-fi and
          fantasy novels. I'm also a big fan of camping and nature sightseeing.
          I'm always looking for new opportunities to learn and grow, so feel
          free to reach out if you'd like to connect!
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
