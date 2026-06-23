import CalendarLink from "@/components/CalendarLink";
import InstallButton from "@/components/InstallButton";
import LocationSearch from "@/components/LocationSearch";
import RecommendCard from "@/components/RecommendCard";
import TipsSection from "@/components/TipsSection";
import VentilationTimeline from "@/components/VentilationTimeline";
import { useLocation } from "@/hooks/useLocation";
import {
  getBestVentilationHour,
  useVentilationScore,
} from "@/hooks/useVentilationScore";
import { useWeatherForecast } from "@/hooks/useWeatherForecast";
import { COMFORT_LEVELS, type ComfortLevel } from "@/types";
import {
  AnimatePresence,
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
} from "framer-motion";
import AppFooter from "@/components/AppFooter";
import useAnalytics from "@/hooks/useAnalytics";
import PrivacyPage from "@/pages/PrivacyPage";
import { AlertCircle, ThermometerSun, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const STORAGE_KEY_TEMP = "ifecho_indoor_temp";
const STORAGE_KEY_COMFORT = "ifecho_comfort_level";
const DEFAULT_INDOOR_TEMP = 26;

const CONTENT_EASING: [number, number, number, number] = [0.23, 1, 0.32, 1];
const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.2, ease: "easeOut" },
} as const;

const loadIndoorTemp = (): number => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_TEMP);
    if (stored) {
      const parsed = parseFloat(stored);
      if (!isNaN(parsed) && parsed >= 10 && parsed <= 50) return parsed;
    }
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_INDOOR_TEMP;
};

const loadComfortLevel = (): ComfortLevel => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_COMFORT);
    if (stored && stored in COMFORT_LEVELS) return stored as ComfortLevel;
  } catch {
    // localStorage unavailable
  }
  return "neutral";
};

const formatTime = (date: Date): string =>
  `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

const formatDate = (date: Date): string =>
  date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const isFirstVisit = (): boolean => {
  try {
    const key = "ifecho_visited";
    if (localStorage.getItem(key)) return false;
    localStorage.setItem(key, "1");
    return true;
  } catch {
    return false;
  }
};

const App = () => {
  const analytics = useAnalytics();
  const [currentPage, setCurrentPage] = useState<"main" | "privacy">(() =>
    window.location.hash === "#confidentialite" ? "privacy" : "main",
  );
  const [indoorTemp, setIndoorTemp] = useState<number>(loadIndoorTemp);
  const [comfortLevel, setComfortLevel] =
    useState<ComfortLevel>(loadComfortLevel);
  const [now] = useState(() => new Date());
  const {
    location,
    isLoading: isDetecting,
    error: locationError,
    detectLocation,
    setFromCommune,
  } = useLocation();
  const {
    data: weather,
    isLoading: isLoadingWeather,
    error: weatherError,
  } = useWeatherForecast(location);

  const comfortBias = COMFORT_LEVELS[comfortLevel].bias;
  const scores = useVentilationScore(weather, indoorTemp, comfortBias);
  const bestHour = getBestVentilationHour(scores);

  const currentHour = now.getHours();
  const currentScore = scores.find((s) => s.hour === currentHour) ?? null;

  useEffect(() => {
    const isPwa =
      window.matchMedia("(display-mode: standalone)").matches ||
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone);
    analytics.appOpened({
      is_pwa: isPwa,
      is_first_visit: isFirstVisit(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => {
      const page =
        window.location.hash === "#confidentialite" ? "privacy" : "main";
      setCurrentPage(page);
      if (page === "privacy") analytics.privacyPageViewed();
    };
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  useEffect(() => {
    if (!weather || !location) return;
    analytics.weatherLoaded({
      city: location.city,
      bestHour: bestHour?.hour ?? null,
      topScore: bestHour?.score ?? 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weather]);

  useEffect(() => {
    if (!weatherError) return;
    analytics.weatherError({ message: weatherError });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weatherError]);

  const tempDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTempChange = (value: number) => {
    setIndoorTemp(value);
    try {
      localStorage.setItem(STORAGE_KEY_TEMP, value.toString());
    } catch {
      // localStorage unavailable
    }
    if (tempDebounceRef.current) clearTimeout(tempDebounceRef.current);
    tempDebounceRef.current = setTimeout(() => {
      analytics.indoorTempChanged({ temp: value });
    }, 800);
  };

  const handleComfortChange = (level: ComfortLevel) => {
    setComfortLevel(level);
    analytics.comfortChanged({ level });
    try {
      localStorage.setItem(STORAGE_KEY_COMFORT, level);
    } catch {
      // localStorage unavailable
    }
  };

  const hasContent = weather && !isLoadingWeather && location;

  const handleBack = () => {
    setCurrentPage("main");
    window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          {currentPage === "privacy" ? (
            <m.div key="privacy" {...PAGE_TRANSITION}>
              <PrivacyPage onBack={handleBack} />
            </m.div>
          ) : (
            <m.div
              key="main"
              {...PAGE_TRANSITION}
              className="flex min-h-dvh flex-col"
            >
              {/* Header */}
              <header className="relative pb-4 pt-10 text-center">
                <InstallButton />
                <div className="mb-2 flex items-center justify-center gap-1.5 text-ember">
                  <ThermometerSun className="size-6" />
                  <span className="text-2xl font-bold tracking-wide">
                    Ifecho
                  </span>
                </div>
                <h1 className="flex items-center justify-center gap-2 text-2xl font-black text-foreground">
                  Quand aérer&nbsp;?
                  <Wind className="size-5 text-ember" />
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {formatDate(now)} • {formatTime(now)}
                </p>
              </header>

              {/* Content */}
              <main className="flex flex-1 flex-col px-4 pb-4">
                <div className="mx-auto flex w-full max-w-sm flex-col gap-3">
                  {/* Recherche de commune */}
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <LocationSearch
                      location={location}
                      isDetecting={isDetecting}
                      error={locationError}
                      onDetect={detectLocation}
                      onSelect={setFromCommune}
                    />
                  </div>

                  {/* Erreur meteo */}
                  <AnimatePresence>
                    {weatherError && (
                      <m.div
                        key="error"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                      >
                        <AlertCircle className="size-4 shrink-0 text-verdict-bad" />
                        <p className="text-sm text-red-700">{weatherError}</p>
                      </m.div>
                    )}
                  </AnimatePresence>

                  {/* Contenu principal */}
                  <AnimatePresence>
                    {hasContent && (
                      <m.div
                        key="content"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4, ease: CONTENT_EASING }}
                        className="flex flex-col gap-3"
                      >
                        <RecommendCard
                          currentScore={currentScore}
                          indoorTemp={indoorTemp}
                          onTempChange={handleTempChange}
                          comfortLevel={comfortLevel}
                          onComfortChange={handleComfortChange}
                          scores={scores}
                          cityName={location.city}
                        />

                        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                          <VentilationTimeline
                            scores={scores}
                            bestHour={bestHour}
                          />
                        </div>

                        {bestHour && (
                          <CalendarLink
                            bestHour={bestHour}
                            city={location.city}
                          />
                        )}

                        <TipsSection />
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </main>

              <AppFooter />
            </m.div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </LazyMotion>
  );
};

export default App;
