import type { Metadata } from "next";

import { WebsitesPage } from "@/components/pages/websites-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("websites", "en");

export default function EnglishWebsites() {
  return <WebsitesPage lang="en" />;
}
