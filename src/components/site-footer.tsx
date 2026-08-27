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
 * Fica acima da `<ViewportMask>` (z-50 contra 30 dela), então é a máscara que
 * serve de fundo para ele, e não o canvas cru.
 *
 * Em `mix-blend-difference` pelo mesmo motivo do header: inverte contra o que
 * estiver embaixo e fica legível nos dois temas sem tratamento condicional.
 *
 * Sem texto traduzível: nome e ano são iguais nos dois idiomas. A cidade saiu
 * do site na v3.5, a pedido do Pedro.
 */
export function SiteFooter() {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mix-blend-difference text-white">
      <div className="flex h-[var(--pad)] items-center font-mono text-[10px] [padding-inline:var(--pad)]">
        <span className="opacity-70">
          © {new Date().getFullYear()} {profile.name}
        </span>
      </div>
    </footer>
  );
}
