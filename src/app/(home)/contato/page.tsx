import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/contact-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("contact", "pt");

export default function Contato() {
  return <ContactPage lang="pt" />;
}
