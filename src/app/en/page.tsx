import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("home", "en");

export default function EnglishHome() {
  return <HomePage lang="en" />;
}
