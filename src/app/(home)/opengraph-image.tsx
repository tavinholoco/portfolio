import { ImageResponse } from "next/og";

import { profile } from "@/data/profile";
import { dictionaries } from "@/i18n";

export const alt = "Pedro Levi | Desenvolvedor Full Stack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  const d = dictionaries.pt;

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
          background: "#0a0a0b",
          color: "#fafafa",
          fontFamily: "sans-serif",
          padding: 72,
        }}
      >
        {/* Brilhos decorativos (identidade visual do site) */}
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -90,
            width: 440,
            height: 440,
            borderRadius: 9999,
            background: "#2dd4bf",
            opacity: 0.12,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -170,
            left: -70,
            width: 380,
            height: 380,
            borderRadius: 9999,
            background: "#0ea5e9",
            opacity: 0.1,
          }}
        />

        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontFamily: "monospace",
            color: "#2dd4bf",
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
            color: "#a1a1aa",
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
            background: "#2dd4bf",
          }}
        />
      </div>
    ),
    size
  );
}
