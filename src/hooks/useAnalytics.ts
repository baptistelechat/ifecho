import posthog from "posthog-js";

const isEnabled = () => !!import.meta.env.VITE_POSTHOG_KEY;

const useAnalytics = () => ({
  appOpened: (props: { is_pwa: boolean; is_first_visit: boolean }) => {
    if (!isEnabled()) return;
    posthog.capture("app_opened", props);
  },

  locationDetected: (props: {
    source: "gps" | "search";
    department?: string;
  }) => {
    if (!isEnabled()) return;
    posthog.capture("location_detected", props);
  },

  locationGpsDenied: () => {
    if (!isEnabled()) return;
    posthog.capture("location_gps_denied");
  },

  locationGpsNotSupported: () => {
    if (!isEnabled()) return;
    posthog.capture("location_gps_not_supported");
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

  weatherError: (props: { message: string }) => {
    if (!isEnabled()) return;
    posthog.capture("weather_error", { message: props.message });
  },

  verdictSeen: (props: {
    verdict: "good" | "neutral" | "wait" | "bad";
    score: number;
    delta_t: number;
  }) => {
    if (!isEnabled()) return;
    posthog.capture("verdict_seen", props);
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

  tipsCarouselToggled: (props: { state: "paused" | "playing" }) => {
    if (!isEnabled()) return;
    posthog.capture("tips_carousel_toggled", props);
  },

  iosInstallHintShown: () => {
    if (!isEnabled()) return;
    posthog.capture("ios_install_hint_shown");
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

  privacyPageViewed: () => {
    if (!isEnabled()) return;
    posthog.capture("privacy_page_viewed");
  },

  appShared: (props: {
    verdict: "good" | "neutral" | "wait" | "bad" | null;
    method: "native" | "clipboard";
  }) => {
    if (!isEnabled()) return;
    posthog.capture("app_shared", props);
  },
});

export default useAnalytics;
