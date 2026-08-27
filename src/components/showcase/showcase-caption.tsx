import type { ShowcaseItem } from "./types";

/**
 * O texto do item ativo, abaixo do showcase inteiro.
 *
 * Na v3 estes dois parágrafos viviam dentro do wrapper `sticky` do
 * `<ShowcasePreview>`, logo abaixo da moldura. Tecnicamente estavam fora do
 * quadro, mas grudados nele e acompanhando a rolagem, então liam como se
 * fossem parte do preview. Na v3.5 saíram para fora do grid: a moldura fica
 * sticky sozinha e o texto desce para a largura cheia do conteúdo.
 *
 * Continua trocando junto com o hover, porque o `activeIndex` sempre viveu no
 * pai (regra 3 da seção 3.1) e não foi preciso estado novo para mover isto.
 */
export function ShowcaseCaption({
  item,
  problemLabel,
  rolesLabel,
}: {
  item: ShowcaseItem;
  /**
   * Rótulo antes do problema. Opcional: em `/clientes/` ele dizia
   * "Projeto profissional" numa rota chamada Clientes, e era redundante.
   */
  problemLabel?: string;
  /** Rótulo do que foi feito. Só as rotas com itens de cliente passam. */
  rolesLabel?: string;
}) {
  return (
    <div className="mt-10 border-t border-current/15 pt-6">
      {/*
        O problema é o que liga o componente à tese da v2: a lista deixa de ser
        catálogo e passa a argumentar (seção 3.2).
      */}
      <p
        data-testid="showcase-problem"
        className="font-body max-w-3xl text-sm leading-relaxed opacity-70"
      >
        {problemLabel ? (
          <span className="font-mono text-xs tracking-wide uppercase">
            {problemLabel}{" "}
          </span>
        ) : null}
        {item.problem}
      </p>

      {/*
        O que foi feito, quando o item traz. É a pergunta que trabalho de
        cliente levanta e a stack não responde: se o envolvimento foi só a tela
        ou foi até o deploy.
      */}
      {rolesLabel && item.responsibilities?.length ? (
        <p className="mt-2 font-mono text-xs opacity-70">
          <span className="tracking-wide uppercase">{rolesLabel} </span>
          {item.responsibilities.join("  ·  ")}
        </p>
      ) : null}
    </div>
  );
}
