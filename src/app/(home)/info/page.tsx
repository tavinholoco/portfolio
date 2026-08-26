import type { Metadata } from "next";

import { InfoPage } from "@/components/pages/info-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("info", "pt");

export default function Info() {
  return <InfoPage lang="pt" />;
}
