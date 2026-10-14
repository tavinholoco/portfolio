import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/metadata";

/* O export estático (`output: "export"`) exige que rota de metadado declare
   que é estática; sem isto o build para. */
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
