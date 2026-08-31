import { ImageResponse } from "next/og";

import { profile } from "@/data/profile";
import { dictionaries, type Locale } from "@/i18n";

/**
 * A imagem de link, compartilhada pelos dois idiomas.
 *
 * Os dois `opengraph-image.tsx` eram cópias que diferiam em quatro linhas:
 * o `alt`, o nome da função e o idioma do dicionário. São 109 linhas cada,
 * e mexer numa e esquecer a outra não gera erro nenhum, que é exatamente o
 * risco que a regra 4 do `CLAUDE.md` descreve.
 *
 * O desenho vive aqui; lá ficam só os metadados de rota, que o Next exige
 * no módulo do segmento.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function ogImage(lang: Locale): ImageResponse {
  const d = dictionaries[lang];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          position: "relative",
          background: "#0b0b0c",
          color: "#fafafa",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        {/*
          Duas cristas no rodapé, ecoando o campo de ondas do site. Substituíram
          os dois blobs borrados da v2, que a seção 8 do plano tirou do site e
          que sobreviveram aqui porque ninguém olha imagem de link.

          São divs com raio elíptico no topo, e não `<path>`: o satori renderiza
          um subconjunto de CSS, e curva por border-radius é o caminho seguro.
          Mais largas que a tela para a curva chegar suave nas bordas.
        */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: "-20%",
            width: "140%",
            height: 260,
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
            background: "#232838",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -80,
            left: "-10%",
            width: "120%",
            height: 190,
            borderTopLeftRadius: "50%",
            borderTopRightRadius: "50%",
            background: "#454f6b",
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontFamily: "monospace",
            color: "#fafafa",
            opacity: 0.7,
            marginBottom: 18,
          }}
        >
          {d.hero.role}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 92,
            fontWeight: 700,
            letterSpacing: -2,
          }}
        >
          {d.meta.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 27,
            color: "#9a9a9e",
          }}
        >
          {profile.stack.join(" · ")}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 44,
            width: 72,
            height: 5,
            borderRadius: 3,
            background: "#fafafa",
          }}
        />
      </div>
    ),
    size
  );
}
