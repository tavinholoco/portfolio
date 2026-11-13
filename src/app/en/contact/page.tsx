import type { Metadata } from "next";

import { Contact } from "@/components/contact";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("contact", "en");

export default function EnglishContact() {
  return <Contact lang="en" />;
}
