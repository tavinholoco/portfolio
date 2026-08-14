"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/**
 * Barra fina de progresso de leitura no topo da página.
 * Desativada quando o usuário prefere menos movimento.
 */
export function ScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-primary"
    />
  );
}
