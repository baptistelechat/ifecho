import { useCallback, useEffect, useState } from "react";
import analytics from "@/lib/analytics";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface UseInstallPromptReturn {
  canInstall: boolean;
  isIos: boolean;
  isStandalone: boolean;
  install: () => Promise<boolean>;
}

export const useInstallPrompt = (): UseInstallPromptReturn => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    setIsStandalone(
      window.matchMedia("(display-mode: standalone)").matches ||
        Boolean((navigator as Navigator & { standalone?: boolean }).standalone),
    );
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setCanInstall(true);
      analytics.pwaInstallBannerShown();
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    const handler = () => {
      analytics.pwaInstalled();
      setCanInstall(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handler);
    return () => window.removeEventListener("appinstalled", handler);
  }, []);

  const install = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    analytics.pwaInstallClicked({ outcome });
    setDeferredPrompt(null);
    setCanInstall(false);
    return outcome === "accepted";
  }, [deferredPrompt]);

  return { canInstall, isIos, isStandalone, install };
};
