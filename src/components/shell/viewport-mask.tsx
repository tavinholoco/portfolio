/**
 * As duas barras que cobrem as faixas de `var(--pad)` no topo e na base.
 *
 * O canvas é recuado em `var(--pad)`, e o conteúdo do `<main>` rola por baixo
 * dessas faixas. Sem a máscara, o texto entraria e sairia da tela cruzando as
 * linhas da moldura. Com ela, o conteúdo desaparece antes de tocar a moldura.
 *
 * `opacity: .9` em vez de opaco é intencional: deixa o canvas transparecer de
 * leve na borda e evita uma faixa morta de cor chapada. A consequência é que a
 * máscara não esconde o header, e por isso o header fica acima dela na tabela
 * de camadas, em z-50 contra os 30 daqui (E15).
 *
 * A transição própria existe pelo mesmo motivo de F5 nas seções `solid`: a
 * transição declarada no `:root` anima só o fundo do root, então quem tem cor
 * própria precisa da sua, senão salta durante o crossfade de tema.
 */
export function ViewportMask() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      <div className="absolute inset-x-0 top-0 h-[var(--pad)] bg-[var(--c-bg)] opacity-90 [transition:background-color_var(--shell-fade)_var(--shell-ease)]" />
      <div className="absolute inset-x-0 bottom-0 h-[var(--pad)] bg-[var(--c-bg)] opacity-90 [transition:background-color_var(--shell-fade)_var(--shell-ease)]" />
    </div>
  );
}
