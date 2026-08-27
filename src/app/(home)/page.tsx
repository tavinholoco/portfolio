import type { Metadata } from "next";

import { HomePage } from "@/components/pages/home-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("home", "pt");

export default function Home() {
  return <HomePage lang="pt" />;
}
