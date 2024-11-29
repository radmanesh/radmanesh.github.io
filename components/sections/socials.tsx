import Link from "next/link";

import SOCIALS from "@/content/socials";
import { Section, SectionTitle } from "@/components/shared/section";

export function Socials() {
  return (
    <Section>
      <SectionTitle text="Connect with me" />
      <div className="flex items-center gap-2">
        {SOCIALS.map(({ href, title }) => (
          <Link key={title} href={href} className="flex items-center flex-wrap gap-2">
            <span className="text-muted-foreground hover:text-primary font-mono text-sm leading-relaxed tracking-wide font-normal">{title}</span>
          </Link>
        ))}
      </div>
    </Section>
  );
}
