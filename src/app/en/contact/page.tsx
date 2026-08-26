import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/contact-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("contact", "en");

export default function EnglishContact() {
  return <ContactPage lang="en" />;
}
