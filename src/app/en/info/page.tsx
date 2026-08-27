import type { Metadata } from "next";

import { InfoPage } from "@/components/pages/info-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("info", "en");

export default function EnglishInfo() {
  return <InfoPage lang="en" />;
}
