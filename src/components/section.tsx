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

export type SectionVariant = "blend" | "plain" | "solid";

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
 * `plain`: sem fundo e sem blend, com a cor de texto normal. É a variante para
 * seção com imagem ou avatar, que em `difference` apareceria em negativo. O
 * canvas continua visível atrás dela, e é isso que a separa da `solid`.
 *
 * O contraste aqui não vem do blend, vem da distância entre `--c-ink` e o
 * campo: a composição do fundo é mantida fora da faixa de 0.35 a 0.65 pelo
 * teste de `background-config`, então no tema escuro ela fica bem abaixo e no
 * claro bem acima, e o texto normal contrasta nos dois casos com folga.
 *
 * `solid`: fundo opaco em `--c-bg`, que **cobre** o canvas. Era a variante das
 * seções com imagem até a V3.5, e o efeito colateral era um retângulo chapado
 * ocupando a página inteira, com emenda dura onde a seção acabava. Hoje não
 * tem consumidor, e existe só para o caso de alguma seção futura precisar
 * mesmo esconder o fundo. Carrega a própria transição de cor porque a do
 * `:root` não cascateia para o fundo de outro elemento (F5).
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
          : variant === "plain"
            ? ""
            : "bg-[var(--c-bg)] [transition:background-color_var(--shell-fade)_var(--shell-ease)]",
        className
      )}
    >
      <div
        className={cn(
          "mx-auto w-full [padding-inline-end:calc(var(--pad)*2)]",
          /* A coluna reservada para a nav vertical do header. O token é
             0px abaixo de lg, onde a nav vira Sheet, então esta linha vale
             nos dois lados sem variante de breakpoint. Padding é seguro
             para a F1: não cria contexto de empilhamento. */
          "[padding-inline-start:calc(var(--pad)*2+var(--nav-col))]",
          /* Ancorado à esquerda a partir de lg, onde a coluna existe. Com
             mx-auto o offset da nav somaria à margem do centramento e o
             conteúdo começaria bem depois da coluna, deixando um vazio que
             parece acidente. Medido em 1440 e 2560. */
          "lg:[margin-inline-start:0]",
          wide ? "max-w-7xl" : "max-w-5xl"
        )}
      >
        {children}
      </div>
    </section>
  );
}
