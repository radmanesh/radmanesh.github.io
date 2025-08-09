import { notFound } from "next/navigation";

import { LAB_REGISTRY } from "@/components/lab/registry";
import { Section, SectionTitle } from "@/components/shared/section";

// --------- PAGE PROPS ---------
interface LabPageProps {
  params: Promise<{ slug: string }>;
}

// --------- STATIC PATHS & METADATA ---------
export async function generateStaticParams() {
  return Object.keys(LAB_REGISTRY).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: LabPageProps) {
  const slug = (await params).slug;
  const entry = LAB_REGISTRY[slug];
  if (!entry) notFound();
  return {
    title: entry.title,
    description: `Lab experiment: ${entry.title}`,
  };
}

// --------- PAGE LAYOUT ---------
export default async function LabExperimentPage({ params }: Readonly<LabPageProps>) {
  const slug = (await params).slug;
  const entry = LAB_REGISTRY[slug];
  if (!entry) notFound();

  const { Component, title } = entry;

  return (
    <Section>
      <SectionTitle text={title} />
      <Component />
    </Section>
  );
}
