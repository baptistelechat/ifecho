import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import posthog from "posthog-js";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./index.css";
import App from "./App.tsx";

const isLocalhost =
  window.location.hostname === "localhost" ||
  /^\d{1,3}(\.\d{1,3}){3}$/.test(window.location.hostname);

const posthogEnabled =
  !!import.meta.env.VITE_POSTHOG_KEY &&
  !isLocalhost &&
  (import.meta.env.PROD || import.meta.env.VITE_POSTHOG_DEBUG === "true");

if (posthogEnabled) {
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_POSTHOG_HOST ?? "https://eu.i.posthog.com",
    persistence: "memory",
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
  });
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <StrictMode>
    <TooltipProvider delayDuration={0}>
      <App />
    </TooltipProvider>
  </StrictMode>,
);
