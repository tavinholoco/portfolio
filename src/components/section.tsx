"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

type SectionProps = {
  id: string;
  className?: string;
  children: ReactNode;
};

/** Wrapper padrão de seção: padding vertical, container e compensação da nav sticky. */
export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-16 py-24 sm:py-28", className)}>
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">{children}</div>
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

/** Cabeçalho padrão de seção: label mono + título + descrição, com fade-up ao entrar na viewport. */
export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const reduceMotion = useReducedMotion();
  const anim =
    reduceMotion === true ? {} : { initial: "hidden", whileInView: "visible" };
  const viewport = { once: true, margin: "-80px" } as const;

  return (
    <motion.div
      {...anim}
      variants={fadeUp}
      viewport={viewport}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="font-mono text-sm text-primary">&gt;_ {label}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="font-body mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
          {description}
        </p>
      )}
    </motion.div>
  );
}

/** Fade-up reutilizável para blocos de conteúdo dentro das seções. */
export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const anim =
    reduceMotion === true
      ? {}
      : { initial: "hidden", whileInView: "visible" };
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
      {...anim}
      variants={variants}
      viewport={{ once: true, margin: "-80px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
