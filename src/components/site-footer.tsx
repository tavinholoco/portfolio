import { profile } from "@/data/profile";

/**
 * O copyright, na faixa de baixo, fora da moldura.
 *
 * Na v3 ele vivia com `padding-block: var(--pad)`, o que o colocava logo acima
 * da linha inferior da moldura, ou seja, **dentro** do quadro central. Na v3.5
 * desceu para a faixa de `var(--pad)` que sobra abaixo da linha, que é onde a
 * referência põe o dela. O alinhamento horizontal também mudou de
 * `calc(var(--pad)*2)` para `var(--pad)`, para o texto começar exatamente na
 * quina da moldura em vez de flutuar solto.
 *
 * A altura é a da faixa inteira, com o texto centrado nela. Como `--pad` é
 * `max(20px, 4vmin)`, o piso é 20px e o texto vai a 10px para caber com folga
 * no pior caso.
 *
 * Com a cidade, são 49 caracteres, e em 320px os 10px pedem mais que os 280px da
 * faixa: quebrar em duas linhas jogaria o texto para cima da moldura. Por isso o
 * `whitespace-nowrap`, e 9px só abaixo de 360px, em vez de cortar o nome ou a
 * cidade. `e2e/responsivo.spec.ts` mede.
 *
 * Fica acima da `<ViewportMask>` (z-50 contra 30 dela), então é a máscara que
 * serve de fundo para ele, e não o canvas cru.
 *
 * Em `mix-blend-difference` pelo mesmo motivo do header: inverte contra o que
 * estiver embaixo e fica legível nos dois temas sem tratamento condicional.
 *
 * Sem texto traduzível: nome, ano e cidade são iguais nos dois idiomas. A cidade
 * saiu na v3.5 e voltou em 06/11/2026, a pedido do Pedro, porque ele quer
 * aparecer nas buscas da região. Revoga a §12.4 do plano.
 */
export function SiteFooter() {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mix-blend-difference text-white">
      <div className="flex h-[var(--pad)] items-center font-mono text-[9px] whitespace-nowrap min-[360px]:text-[10px] [padding-inline:var(--pad)]">
        <span className="opacity-70">
          © {new Date().getFullYear()} {profile.name} · {profile.location.city},{" "}
          {profile.location.region}
        </span>
      </div>
    </footer>
  );
}
