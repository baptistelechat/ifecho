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
import useAnalytics from "@/hooks/useAnalytics";
import { AlertCircle, Heart, ThermometerSun, Wind } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY_TEMP = "ifecho_indoor_temp";
const STORAGE_KEY_COMFORT = "ifecho_comfort_level";
const DEFAULT_INDOOR_TEMP = 26;

const CONTENT_EASING: [number, number, number, number] = [0.23, 1, 0.32, 1];

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

const App = () => {
  const analytics = useAnalytics();
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

  const handleTempChange = (value: number) => {
    setIndoorTemp(value);
    analytics.indoorTempChanged({ temp: value });
    try {
      localStorage.setItem(STORAGE_KEY_TEMP, value.toString());
    } catch {
      // localStorage unavailable
    }
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

  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <div className="flex min-h-dvh flex-col">
          {/* Header */}
          <header className="relative pb-4 pt-10 text-center">
            <InstallButton />
            <div className="mb-2 flex items-center justify-center gap-1.5 text-ember">
              <ThermometerSun className="size-6" />
              <span className="text-2xl font-bold tracking-wide">Ifecho</span>
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
                      <CalendarLink bestHour={bestHour} city={location.city} />
                    )}

                    <TipsSection />
                  </m.div>
                )}
              </AnimatePresence>
            </div>
          </main>

          {/* Footer */}
          <footer className="py-4 text-center text-xs text-muted-foreground">
            <p className="mt-1 flex items-center justify-center gap-1">
              <ThermometerSun className="size-3 text-ember" />
              Ifecho • Made by{" "}
              <a
                href="https://baptistelechat.vercel.app/"
                className="inline-block py-1 underline transition-colors hover:text-ember"
                target="_blank"
                rel="noopener noreferrer"
              >
                @baptistelechat
              </a>{" "}
              with <Heart className="size-3 fill-ember text-ember" />
            </p>
            <p>
              Données :{" "}
              <a
                href="https://open-meteo.com"
                className="underline transition-colors hover:text-ember"
                target="_blank"
                rel="noopener noreferrer"
              >
                Open-Meteo
              </a>
              {" • "}
              <a
                href="https://adresse.data.gouv.fr"
                className="underline transition-colors hover:text-ember"
                target="_blank"
                rel="noopener noreferrer"
              >
                API Adresse
              </a>
            </p>
          </footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
};

export default App;
