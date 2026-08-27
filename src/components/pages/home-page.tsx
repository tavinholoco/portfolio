import { JsonLd } from "@/components/json-ld";
import { dictionaries, type Locale } from "@/i18n";
import { personJsonLd, webSiteJsonLd } from "@/lib/json-ld";

/**
 * A home: só o fundo.
 *
 * Não há conteúdo visível nesta rota. A identidade (nome, cargo e nav) é fixa
 * no `<SiteHeader>` e aparece em todas as rotas, o copyright é fixo no rodapé,
 * e a home é o lugar onde o campo de ondas fica inteiro à vista, sem texto por
 * cima. Quem quiser ler alguma coisa tem cinco portas no canto esquerdo.
 *
 * Isso foi decisão do Pedro depois de ver o site rodando, e revoga a §2.3 do
 * plano, que exigia a tese como corpo da home. Ela sobrevive em `/info/`, na
 * seção de processo.
 *
 * **O `h1` continua existindo, invisível.** Uma rota sem `h1` é falha de
 * acessibilidade e de SEO, e a home é a raiz do site: é a página que mais
 * precisa dizer do que se trata. `hero.thesis` faz esse papel sem pintar um
 * pixel.
 */
export function HomePage({ lang }: { lang: Locale }) {
  const d = dictionaries[lang];

  return (
    <>
      <JsonLd data={[personJsonLd(lang), webSiteJsonLd(lang)]} />
      <h1 className="sr-only">{d.hero.thesis}</h1>
    </>
  );
}
