import {
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: {
      sizes: [512],
      padding: 0.1,
      resizeOptions: { background: "#f97316" },
    },
    apple: {
      sizes: [180],
      padding: 0.3,
      resizeOptions: { background: "#f97316" },
    },
  },
  images: ["public/logo.svg"],
});
