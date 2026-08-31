import type { ReactNode } from "react";

import {
  RootDocument,
  metadata,
  viewport,
} from "@/components/shell/root-document";

/* O documento vive em `<RootDocument>`, compartilhado com o outro idioma.
   `metadata` e `viewport` são reexportados porque o Next os lê no módulo
   do segmento, e não no componente. */
export { metadata, viewport };

/** Root layout do português (rota /): cada idioma tem o próprio <html lang>. */
export default function HomeLayout({ children }: { children: ReactNode }) {
  return <RootDocument lang="pt">{children}</RootDocument>;
}
