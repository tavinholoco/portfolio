import { cn } from "@/lib/utils";

/**
 * Mockup de janela de browser em CSS puro, usado quando um item do showcase
 * ainda não tem screenshot.
 *
 * Generalizado a partir do que existia em `featured-project.tsx`. A alternativa
 * avaliada e descartada foi gerar cards por `next/og` (seção 4.4 do plano):
 * seria um route handler dinâmico em runtime, contradizendo a premissa de que
 * todas as rotas são estáticas, e acrescentaria um passo de build para nada.
 * Este mockup custa zero dependência, zero rota e zero build, e combina mais
 * com o minimalismo do que um screenshot genérico combinaria.
 *
 * Trocar por captura real depois não toca neste componente: basta preencher
 * `image` no item. É isso que destrava os itens sem deploy público.
 *
 * O título do item saiu do corpo do mockup na v3.5: era o único texto de
 * conteúdo desenhado dentro do quadro. O host fica, porque é parte do mock da
 * janela, não conteúdo. O componente inteiro é `aria-hidden`, então nada disso
 * era anunciado a leitor de tela de qualquer jeito.
 */
export function WindowMockup({
  host,
  className,
}: {
  host?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "flex h-full w-full flex-col overflow-hidden rounded-md border border-current/25 bg-current/[0.05]",
        className
      )}
    >
      <div className="flex items-center gap-1.5 border-b border-current/25 px-3 py-2">
        <span className="size-2 rounded-full bg-current/30" />
        <span className="size-2 rounded-full bg-current/30" />
        <span className="size-2 rounded-full bg-current/30" />
        {host && (
          <span className="ml-2 truncate rounded-sm border border-current/25 px-2 py-0.5 font-mono text-[10px] opacity-50">
            {host}
          </span>
        )}
      </div>

      {/*
        Os blocos crescem por proporção (flex), não por altura fixa. Sem isso o
        mockup deixa metade da caixa 16:10 vazia e parece inacabado em vez de
        minimalista.
      */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex-[3] rounded-sm border border-current/20 bg-current/[0.07]" />
        <div className="h-1.5 w-3/5 rounded-full bg-current/20" />
        <div className="h-1.5 w-2/5 rounded-full bg-current/15" />
        <div className="grid flex-[2] grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-sm border border-current/20 bg-current/[0.05]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
