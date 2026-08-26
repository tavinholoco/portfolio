import type { Metadata } from "next";

import { ProjectsPage } from "@/components/pages/projects-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("projects", "en");

export default function EnglishProjects() {
  return <ProjectsPage lang="en" />;
}
