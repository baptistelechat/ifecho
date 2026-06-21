import { useWebHaptics } from "web-haptics/react";

export const useHaptics = () => {
  const { trigger } = useWebHaptics();
  return {
    success: () => trigger("success"),
    nudge: () => trigger("nudge"),
    error: () => trigger("error"),
  };
};
