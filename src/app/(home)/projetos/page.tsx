import type { Metadata } from "next";

import { ProjectsPage } from "@/components/pages/projects-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("projects", "pt");

export default function Projetos() {
  return <ProjectsPage lang="pt" />;
}
