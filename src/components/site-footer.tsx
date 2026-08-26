import { profile } from "@/data/profile";

/**
 * O footer da v3: fixo, e só o copyright.
 *
 * Os quatro links sociais saíram (E13). Um footer fixo alinhado a `var(--pad)`
 * não comporta quatro alvos de clique sem virar uma barra, e a informação já
 * existe em `contact.cards`, na rota de Contato, com mais contexto. Nada se
 * perdeu, mudou de lugar.
 *
 * Em `mix-blend-difference` pelo mesmo motivo do header: inverte contra o que
 * estiver embaixo e fica legível sobre o canvas e sobre os dois tipos de seção.
 * Fica acima da máscara de viewport, em z-50 contra os 30 dela.
 *
 * Sem texto traduzível: nome, ano e cidade são iguais nos dois idiomas, então
 * não há chave de dicionário aqui.
 */
export function SiteFooter() {
  return (
    <footer className="pointer-events-none fixed inset-x-0 bottom-0 z-50 mix-blend-difference text-white">
      <div className="flex items-center justify-between gap-4 font-mono text-xs [padding-block:var(--pad)] [padding-inline:calc(var(--pad)*2)]">
        <span className="opacity-60">
          © {new Date().getFullYear()} {profile.name}
        </span>
        <span className="opacity-60">{profile.location}</span>
      </div>
    </footer>
  );
}
