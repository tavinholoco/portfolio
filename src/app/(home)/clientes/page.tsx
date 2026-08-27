import type { Metadata } from "next";

import { ClientsPage } from "@/components/pages/clients-page";
import { buildRouteMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildRouteMetadata("clients", "pt");

export default function Clientes() {
  return <ClientsPage lang="pt" />;
}
