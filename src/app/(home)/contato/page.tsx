import type { Metadata } from "next";

import { Contact } from "@/components/contact";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("contact", "pt");

export default function Contato() {
  return <Contact lang="pt" />;
}
