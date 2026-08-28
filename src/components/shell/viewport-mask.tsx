/**
 * As duas barras que cobrem as faixas de `var(--pad)` no topo e na base.
 *
 * O canvas é recuado em `var(--pad)`, e o conteúdo do `<main>` rola por baixo
 * dessas faixas. Sem a máscara, o texto entraria e sairia da tela cruzando as
 * linhas da moldura. Com ela, o conteúdo desaparece antes de tocar a moldura.
 *
 * **As barras são opacas, e isso é de graça.** Elas eram `opacity: .9`, com a
 * justificativa de deixar o canvas transparecer de leve na borda. Medindo a
 * geometria, o canvas é recuado em `var(--pad)` e **termina exatamente onde a
 * barra começa**: não há canvas nenhum ali para transparecer. O que estava
 * atrás era o fundo do `:root`, que é a mesma cor da barra, e compor uma cor
 * sobre ela mesma a 90% devolve a mesma cor.
 *
 * Ou seja, a translucidez não produzia efeito visual nenhum e só deixava
 * passar o conteúdo que rola por baixo, que aparecia como um fantasma atrás
 * do copyright. Opaco, a cor da faixa é idêntica e o fantasma some.
 *
 * A máscara continua não escondendo o header, que fica acima dela na tabela
 * de camadas, em z-50 contra os 30 daqui (E15).
 *
 * A transição própria existe pelo mesmo motivo de F5 nas seções `solid`: a
 * transição declarada no `:root` anima só o fundo do root, então quem tem cor
 * própria precisa da sua, senão salta durante o crossfade de tema.
 */
export function ViewportMask() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-30">
      <div className="absolute inset-x-0 top-0 h-[var(--pad)] bg-[var(--c-bg)] [transition:background-color_var(--shell-fade)_var(--shell-ease)]" />
      <div className="absolute inset-x-0 bottom-0 h-[var(--pad)] bg-[var(--c-bg)] [transition:background-color_var(--shell-fade)_var(--shell-ease)]" />
    </div>
  );
}
