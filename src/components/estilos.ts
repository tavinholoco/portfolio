/**
 * As duas classes que o site repetia à mão (F6.3 do plano V4).
 *
 * O link de ação estava copiado em sete lugares e a linha de lista em cinco,
 * e uma cópia que divergisse só apareceria a olho. Ficam como texto, e não
 * como componente, porque cada consumidor é um elemento diferente (`<a>`,
 * `<Link>`, `<a download>`, `<li>`), e um componente teria de reproduzir as
 * props de todos.
 *
 * As duas valem dentro de seção `blend` (lei 5): borda e cor saem de
 * `currentColor`, então herdam a cor da seção e invertem junto com o texto.
 * Os literais ficam inteiros aqui, sem montar classe por concatenação, porque
 * o Tailwind só gera o que encontra escrito por extenso no código.
 */

/** O botão de borda fina: CV, WhatsApp, demo, GitHub, contato, volta da 404. */
export const actionLinkClass =
  "focus-ring inline-flex items-center gap-2 rounded-sm border border-current/40 px-5 py-2.5 text-sm transition-opacity hover:opacity-70";

/**
 * A linha de lista com título à esquerda e texto à direita, separada por uma
 * linha de 1px. `numerada` tem uma coluna a mais na frente, para o "01".
 */
export const listRowClass = {
  simples:
    "grid gap-2 border-b border-current/15 py-7 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8",
  numerada:
    "grid gap-2 border-b border-current/15 py-7 sm:grid-cols-[auto_minmax(0,14rem)_minmax(0,1fr)] sm:items-baseline sm:gap-8",
} as const;
