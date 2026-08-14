import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetailPage } from "@/components/project-detail";
import { projectMetas } from "@/data/projects";
import { buildProjectMetadata } from "@/lib/metadata";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projectMetas.map((meta) => ({ slug: meta.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (!projectMetas.some((meta) => meta.slug === slug)) return {};
  return buildProjectMetadata(slug, "en");
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  if (!projectMetas.some((meta) => meta.slug === slug)) notFound();
  return <ProjectDetailPage slug={slug} lang="en" />;
}
