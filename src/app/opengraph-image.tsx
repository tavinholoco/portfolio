import { ImageResponse } from "next/og";

export const alt = "Pedro Levi | Desenvolvedor Fullstack";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "#0a0a0b",
          fontFamily: "sans-serif",
          color: "#fafafa",
          textAlign: "center",
          padding: 64,
        }}
      >
        <div style={{ display: "flex", fontSize: 96, fontWeight: 700, letterSpacing: -2 }}>
          Pedro Levi
        </div>
        <div style={{ display: "flex", fontSize: 56, fontWeight: 600, color: "#71717a" }}>
          Dias Rosa Paula
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 32,
            color: "#2dd4bf",
            fontFamily: "monospace",
          }}
        >
          &gt;_ desenvolvedor fullstack
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 24, color: "#a1a1aa" }}>
          React · React Native · Next.js · TypeScript · Node.js · Fastify
        </div>
      </div>
    ),
    size
  );
}
