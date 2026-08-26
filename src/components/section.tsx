"use client";

import { createContext, useContext, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

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
 * dentro do grupo que será misturado, e isso não quebra nada.
 */

export type SectionVariant = "blend" | "solid";

/**
 * A variante desce por contexto em vez de prop.
 *
 * O motivo é E5: dentro de `blend` a entrada precisa animar só opacity, então
 * `SectionHeading` e `FadeIn` precisam saber onde estão. Passando por prop,
 * esquecer uma delas produziria um bug visual silencioso; por contexto, a regra
 * se aplica sozinha.
 */
const SectionVariantContext = createContext<SectionVariant>("solid");

export function useSectionVariant(): SectionVariant {
  return useContext(SectionVariantContext);
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const viewport = { once: true, margin: "-80px" } as const;

type SectionProps = {
  id: string;
  variant?: SectionVariant;
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
  className,
  children,
}: SectionProps) {
  return (
    <SectionVariantContext.Provider value={variant}>
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
        <div className="mx-auto w-full max-w-5xl [padding-inline:calc(var(--pad)*2)]">
          {children}
        </div>
      </section>
    </SectionVariantContext.Provider>
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
 */
export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const variant = useSectionVariant();
  const reduceMotion = useReducedMotion();

  const wrapperClass = cn(
    "max-w-2xl",
    align === "center" && "mx-auto text-center",
    className
  );

  const content = (
    <>
      <p className="font-mono text-sm opacity-60">&gt;_ {label}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="font-body mt-4 text-base leading-relaxed opacity-70 text-pretty">
          {description}
        </p>
      )}
    </>
  );

  /* Em blend, só opacity: qualquer transform aqui viraria um grupo isolado no
     meio da mistura, e o resultado do difference mudaria durante a entrada. */
  if (variant === "blend") {
    return (
      <div
        className={cn(wrapperClass, "animate-fade-in motion-reduce:animate-none")}
      >
        {content}
      </div>
    );
  }

  return (
    <motion.div
      {...(reduceMotion === true
        ? {}
        : { initial: "hidden", whileInView: "visible" })}
      variants={fadeUp}
      viewport={viewport}
      className={wrapperClass}
    >
      {content}
    </motion.div>
  );
}

/**
 * Entrada reutilizável para blocos dentro das seções.
 *
 * Em `solid` continua sendo o fade-up do Framer. Em `blend` degrada para a
 * animação CSS de opacity (E5), porque translateY dentro de uma subárvore
 * misturada altera o próprio resultado da mistura enquanto anima.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const variant = useSectionVariant();
  const reduceMotion = useReducedMotion();

  if (variant === "blend") {
    return (
      <div
        className={cn(className, "animate-fade-in motion-reduce:animate-none")}
        style={delay ? { animationDelay: `${delay}s` } : undefined}
      >
        {children}
      </div>
    );
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      {...(reduceMotion === true
        ? {}
        : { initial: "hidden", whileInView: "visible" })}
      variants={variants}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}
