/**
 * A moldura: 4 linhas de 1px recuadas em `var(--pad)`, alinhadas com a borda do
 * canvas.
 *
 * O container inteiro fica em `mix-blend-difference`, e é por isso que uma
 * moldura branca só funciona nos dois temas e sobre os dois tipos de seção
 * (F13): branco em difference sobre `#0b0b0c` dá `#f4f4f3`, uma linha clara
 * visível, e sobre `#f0f0f0` dá `#0f0f0f`, uma linha escura visível. Nenhum
 * tratamento condicional é necessário.
 *
 * `fixed` em z-40, entre a máscara (30) e o header (50), conforme a tabela de
 * camadas de F1. Como é irmão do `<main>` e não ancestral dele, o blend daqui
 * não interfere no blend das seções.
 */
export function Frame() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 mix-blend-difference"
    >
      <div className="absolute top-[var(--pad)] right-[var(--pad)] left-[var(--pad)] h-px bg-white opacity-50" />
      <div className="absolute right-[var(--pad)] bottom-[var(--pad)] left-[var(--pad)] h-px bg-white opacity-50" />
      <div className="absolute top-[var(--pad)] bottom-[var(--pad)] left-[var(--pad)] w-px bg-white opacity-50" />
      <div className="absolute top-[var(--pad)] right-[var(--pad)] bottom-[var(--pad)] w-px bg-white opacity-50" />
    </div>
  );
}
