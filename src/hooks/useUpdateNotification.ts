import { useEffect } from "react";

export const useUpdateNotification = () => {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Premier install (pas encore de SW actif) → pas de reload
    const hadController = !!navigator.serviceWorker.controller;

    const handleControllerChange = () => {
      if (!hadController) return;
      window.location.reload();
    };

    navigator.serviceWorker.addEventListener(
      "controllerchange",
      handleControllerChange,
    );
    return () =>
      navigator.serviceWorker.removeEventListener(
        "controllerchange",
        handleControllerChange,
      );
  }, []);
};
