import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import type { ShowcaseItem } from "./types";

/**
 * Uma linha da lista: número, título, stack, ano.
 *
 * Sem card, sem borda em volta, sem sombra. O único separador é a linha de 1px
 * embaixo, e a hierarquia é feita por tamanho e opacidade (seção 8 do plano).
 *
 * O `onPointerEnter` e o `onFocus` chamam o mesmo handler (regra 3): é o que
 * faz o teclado funcionar de graça, sem código de acessibilidade em separado.
 * O foco avisa que é imediato, porque esperar os 80ms de intenção do mouse dá
 * sensação de travamento a quem navega por Tab.
 */
export function ShowcaseRow({
  item,
  index,
  active,
  onActivate,
  onCancel,
}: {
  item: ShowcaseItem;
  index: number;
  active: boolean;
  onActivate: (index: number, immediate: boolean) => void;
  onCancel: () => void;
}) {
  const external = item.external === true;

  const content = (
    <>
      <span className="font-mono text-xs opacity-40 tabular-nums">
        {String(index + 1).padStart(2, "0")}
      </span>

      <span className="min-w-0 text-lg font-medium tracking-tight text-balance sm:text-xl">
        {item.title}
        {external && (
          <ArrowUpRight
            className="ml-1.5 inline size-4 opacity-50"
            aria-hidden
          />
        )}
      </span>

      {/*
        Três tecnologias, não a stack inteira: a linha é resumo, e a lista
        completa vive na página do case. É o que o diagrama da seção 3 mostra,
        e é o que impede a coluna de empurrar o título para duas linhas.
      */}
      <span className="hidden gap-x-3 font-mono text-xs whitespace-nowrap opacity-50 lg:flex">
        {item.stack.slice(0, 3).map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </span>

      <span className="font-mono text-xs opacity-40 tabular-nums">
        {item.year}
      </span>
    </>
  );

  const className = cn(
    "focus-ring grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-baseline gap-4 border-b border-current/15 py-5 transition-opacity sm:gap-6 lg:grid-cols-[auto_minmax(0,1fr)_auto_auto]",
    active ? "opacity-100" : "opacity-60 hover:opacity-100"
  );

  const handlers = {
    onPointerEnter: () => onActivate(index, false),
    onFocus: () => onActivate(index, true),
    onPointerLeave: onCancel,
  };

  return (
    <li>
      {external ? (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          {...handlers}
        >
          {content}
        </a>
      ) : (
        <Link href={item.href} className={className} {...handlers}>
          {content}
        </Link>
      )}
    </li>
  );
}
