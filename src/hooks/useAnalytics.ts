import posthog from "posthog-js";

const isEnabled = () => !!import.meta.env.VITE_POSTHOG_KEY;

const useAnalytics = () => ({
  locationDetected: (props: {
    source: "gps" | "search";
    department?: string;
  }) => {
    if (!isEnabled()) return;
    posthog.capture("location_detected", props);
  },

  weatherLoaded: (props: {
    city: string;
    bestHour: number | null;
    topScore: number;
  }) => {
    if (!isEnabled()) return;
    posthog.capture("weather_loaded", {
      city: props.city,
      best_hour: props.bestHour,
      top_score: props.topScore,
    });
  },

  indoorTempChanged: (props: { temp: number }) => {
    if (!isEnabled()) return;
    posthog.capture("indoor_temp_changed", { temp: Math.round(props.temp) });
  },

  comfortChanged: (props: { level: "hot" | "neutral" | "cool" }) => {
    if (!isEnabled()) return;
    posthog.capture("comfort_changed", props);
  },

  calendarDownloaded: (props: { bestHour: number; city: string }) => {
    if (!isEnabled()) return;
    posthog.capture("calendar_downloaded", {
      best_hour: props.bestHour,
      city: props.city,
    });
  },

  tipNavigated: (props: {
    tipId: string;
    direction: "swipe-left" | "swipe-right" | "dot" | "auto";
  }) => {
    if (!isEnabled()) return;
    posthog.capture("tip_navigated", {
      tip_id: props.tipId,
      direction: props.direction,
    });
  },

  pwaInstallBannerShown: () => {
    if (!isEnabled()) return;
    posthog.capture("pwa_install_banner_shown");
  },

  pwaInstallClicked: (props: { outcome: "accepted" | "dismissed" }) => {
    if (!isEnabled()) return;
    posthog.capture("pwa_install_clicked", props);
  },

  pwaInstalled: () => {
    if (!isEnabled()) return;
    posthog.capture("pwa_installed");
  },
});

export default useAnalytics;
