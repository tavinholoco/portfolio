import type { Metadata } from "next";

import { ClientsPage } from "@/components/pages/clients-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("clients", "en");

export default function EnglishClients() {
  return <ClientsPage lang="en" />;
}
