import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * ============================================================================
 * LEI DE CAMADAS (F1, seção 6.1 do PLANO-V3-PORTFOLIO.md). LEIA ANTES DE MEXER.
 * ============================================================================
 *
 * `mix-blend-mode` mistura o elemento com o backdrop dele, e backdrop é tudo
 * que foi pintado abaixo **dentro do mesmo contexto de empilhamento**. O canvas
 * do fundo é um irmão do `<main>` com `z-index: -1`, fora dele.
 *
 * Portanto: NENHUM ancestral de uma seção `blend` pode criar contexto de
 * empilhamento. Na prática, nem `<body>`, nem `<main>`, nem qualquer wrapper
 * entre eles pode ter `z-index`, `position` com z, `transform`, `opacity < 1`,
 * `filter`, `isolation` ou `contain: paint`.
 *
 * Se isso for violado, a mistura fica confinada no ancestral e passa a
 * acontecer contra o fundo dele (transparente), nunca contra o canvas. O
 * sintoma é texto branco invisível sobre fundo claro, e **não há erro nenhum no
 * console**. É o erro mais caro possível neste projeto.
 *
 * Filhos de uma seção `blend` podem criar contexto à vontade: eles são pintados
 * dentro do grupo que será misturado, e isso não quebra nada. A exceção
 * descoberta na Fase 4 é `position: sticky` com fundo opaco, que vaza para o
 * composite de uma seção `blend` vizinha mesmo estando em outra seção.
 *
 * ----------------------------------------------------------------------------
 *
 * SEGUNDA LEI, descoberta no portão da Fase 2: **uma seção `blend` exige
 * conteúdo que herde a cor.** O `color: #fff` da seção só alcança texto que
 * herda. Classes como `text-muted-foreground`, `bg-card` e `bg-primary`
 * mantêm a própria cor e cada uma inverte para um lado diferente, produzindo um
 * resultado sujo. Uma seção só deve virar `blend` no mesmo passo em que perde
 * as cores e caixas explícitas.
 *
 * Este arquivo é server component de propósito: depois que o Framer Motion saiu
 * (F10), não sobrou nada aqui que precise rodar no cliente.
 */

export type SectionVariant = "blend" | "solid";

type SectionProps = {
  id: string;
  variant?: SectionVariant;
  /**
   * Container mais largo, para conteúdo em duas colunas.
   *
   * O showcase põe preview e lista lado a lado, e na largura padrão a coluna do
   * título fica estreita a ponto de quebrar "Repertório Progressivo" em duas
   * linhas. O padding continua o mesmo, então o alinhamento com a moldura não
   * muda.
   */
  wide?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Wrapper padrão de seção, em duas variantes.
 *
 * `blend`: sem fundo, texto branco e `mix-blend-difference`. Mistura contra o
 * canvas e o contraste sai de graça, porque o resultado do difference com
 * branco é a inversão do que estiver embaixo.
 *
 * `solid`: fundo opaco em `--c-bg`, que cobre o canvas. É a variante para
 * qualquer seção com imagem ou avatar, que em `difference` apareceria em
 * negativo. Carrega a própria transição de cor porque a transição do `:root`
 * não cascateia para o fundo de outro elemento (F5): sem ela, a seção saltaria
 * enquanto o resto da página faz crossfade de 900ms.
 *
 * O padding do container é `calc(var(--pad) * 2)` como piso (E9), para o texto
 * nunca passar por baixo das linhas da moldura, que ficam em `var(--pad)`.
 */
export function Section({
  id,
  variant = "solid",
  wide = false,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      data-variant={variant}
      className={cn(
        "scroll-mt-24 py-24 sm:py-28",
        variant === "blend"
          ? "mix-blend-difference text-white"
          : "bg-[var(--c-bg)] [transition:background-color_var(--shell-fade)_var(--shell-ease)]",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full [padding-inline:calc(var(--pad)*2)]",
          wide ? "max-w-7xl" : "max-w-5xl"
        )}
      >
        {children}
      </div>
    </section>
  );
}

type SectionHeadingProps = {
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Cabeçalho padrão de seção.
 *
 * Sem `text-primary` (E4): a cor do site vive no shader, e a hierarquia aqui é
 * feita por tamanho e opacidade. O `>_` fica, monocromático, porque é a
 * identidade construída na v2 e é o que impede a v3 de virar cópia.
 *
 * A entrada anima só opacity, nas duas variantes. Isso era a regra E5, que
 * valia só para `blend` e dependia de o componente saber onde estava; com uma
 * implementação só, ela deixa de ser regra a lembrar e passa a ser verdade por
 * construção. Foi o que permitiu remover o contexto de variante e, com ele, a
 * necessidade de este arquivo rodar no cliente.
 */
export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-2xl animate-fade-in motion-reduce:animate-none",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="font-mono text-sm opacity-70">&gt;_ {label}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="font-body mt-4 text-base leading-relaxed opacity-70 text-pretty">
          {description}
        </p>
      )}
    </div>
  );
}
