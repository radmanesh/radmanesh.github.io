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
          Currently, I'm working as a GRA at the University of Oklahoma, and as a Research Developer on at{" "}
          <Link
            href="https://jamasp.app"
            className="underline decoration-dotted decoration-1 underline-offset-4 text-muted-foreground/90"
          >
            Jamasp
          </Link>
          , is set to transform wearable device research by providing seamless integration from data collection to
          advanced analysis. Together, our tools embody our commitment to fostering innovation, improving accessibility,
          and supporting meaningful research that drives societal progress. Whether it’s academic exploration, health
          sciences, or organizational studies, CutSocial is here to make impactful research more efficient and achievable.
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
          Outside of coding, I find solace in reading, particularly history and
          technology-related topics. I also enjoy writing and experimenting with
          new technologies. I'm a lifelong learner, always excited to dive into
          new programming paradigms or the latest UX/UI design trends.
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
