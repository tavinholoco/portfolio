import type { Metadata } from "next";

import { PortfolioPage } from "../portfolio-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata("en");

export default function EnglishHome() {
  return <PortfolioPage lang="en" />;
}
