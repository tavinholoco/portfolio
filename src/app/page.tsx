import type { Metadata } from "next";

import { PortfolioPage } from "./portfolio-page";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata("pt");

export default function Home() {
  return <PortfolioPage lang="pt" />;
}
