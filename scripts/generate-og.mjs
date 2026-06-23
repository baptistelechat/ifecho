import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { writeFileSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const fontRegular = readFileSync(
  join(
    root,
    "node_modules/@fontsource/inter/files/inter-latin-400-normal.woff",
  ),
);
const fontBold = readFileSync(
  join(
    root,
    "node_modules/@fontsource/inter/files/inter-latin-700-normal.woff",
  ),
);

const logoSvg = readFileSync(join(root, "public/logo.svg"), "utf-8");
const logoDataUrl = `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString("base64")}`;

const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(160deg, #fff7ed 0%, #fef3e8 55%, #fde8d0 100%)",
        padding: "60px 80px",
        fontFamily: "Inter",
      },
      children: [
        // Badge pill (réduit)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "7px 20px",
              border: "2px solid #f97316",
              borderRadius: "999px",
              marginBottom: "28px",
            },
            children: [
              {
                type: "span",
                props: {
                  style: { fontSize: 20, fontWeight: 400, color: "#f97316" },
                  children: "Bien vivre la chaleur",
                },
              },
            ],
          },
        },
        // Logo + titre (grands)
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "32px",
              marginBottom: "28px",
            },
            children: [
              {
                type: "img",
                props: { src: logoDataUrl, width: 140, height: 140 },
              },
              {
                type: "span",
                props: {
                  style: {
                    fontSize: 140,
                    fontWeight: 700,
                    color: "#c2410c",
                    letterSpacing: "-5px",
                    lineHeight: "1",
                  },
                  children: "Ifecho",
                },
              },
            ],
          },
        },
        // Description
        {
          type: "span",
          props: {
            style: {
              fontSize: 30,
              fontWeight: 400,
              color: "#78350f",
              textAlign: "center",
              maxWidth: "700px",
              lineHeight: "1.5",
            },
            children:
              "Savoir quand ouvrir vos fenêtres pour rafraîchir votre logement.",
          },
        },
        // URL (pleinement visible)
        {
          type: "span",
          props: {
            style: {
              fontSize: 26,
              fontWeight: 400,
              color: "#c2410c",
              marginTop: "28px",
            },
            children: "ifecho.vercel.app",
          },
        },
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
      { name: "Inter", data: fontBold, weight: 700, style: "normal" },
    ],
  },
);

const resvg = new Resvg(svg);
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

const outputPath = join(root, "public/og-image.png");
writeFileSync(outputPath, pngBuffer);
console.log(
  `✅  og-image.png généré (${Math.round(pngBuffer.length / 1024)} Ko) → ${outputPath}`,
);
