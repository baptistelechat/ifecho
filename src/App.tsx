import CalendarLink from "@/components/CalendarLink";
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
import { AlertCircle, Heart, Loader2, Wind } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY_TEMP = "ifecho_indoor_temp";
const STORAGE_KEY_COMFORT = "ifecho_comfort_level";
const DEFAULT_INDOOR_TEMP = 26;

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

  const handleTempChange = (value: number) => {
    setIndoorTemp(value);
    try {
      localStorage.setItem(STORAGE_KEY_TEMP, value.toString());
    } catch {
      // localStorage unavailable
    }
  };

  const handleComfortChange = (level: ComfortLevel) => {
    setComfortLevel(level);
    try {
      localStorage.setItem(STORAGE_KEY_COMFORT, level);
    } catch {
      // localStorage unavailable
    }
  };

  const hasContent = weather && !isLoadingWeather && location;

  return (
    <div className="flex min-h-dvh flex-col">
      {/* Header */}
      <header className="pb-4 pt-10 text-center">
        <h1 className="flex items-center justify-center gap-2 text-2xl font-black text-foreground">
          Quand aérer&nbsp;?
          <Wind className="size-5 text-ember" />
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {formatDate(now)} · {formatTime(now)}
        </p>
      </header>

      {/* Content */}
      <main className="flex flex-1 flex-col px-4 pb-4">
        <div
          className={`mx-auto flex w-full max-w-sm flex-col gap-3${!hasContent ? " my-auto" : ""}`}
        >
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

          {/* Chargement meteo */}
          {isLoadingWeather && (
            <div className="flex items-center justify-center gap-3 rounded-2xl border border-border bg-card p-8 shadow-sm">
              <Loader2 className="size-4 animate-spin text-ember" />
              <p className="text-sm text-muted-foreground">
                Récupération de la météo…
              </p>
            </div>
          )}

          {/* Erreur meteo */}
          {weatherError && (
            <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
              <AlertCircle className="size-4 shrink-0 text-verdict-bad" />
              <p className="text-sm text-red-700">{weatherError}</p>
            </div>
          )}

          {/* Contenu principal */}
          {hasContent && (
            <>
              <RecommendCard
                currentScore={currentScore}
                indoorTemp={indoorTemp}
                onTempChange={handleTempChange}
                comfortLevel={comfortLevel}
                onComfortChange={handleComfortChange}
                scores={scores}
              />

              <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <VentilationTimeline scores={scores} bestHour={bestHour} />
              </div>

              {bestHour && (
                <CalendarLink bestHour={bestHour} city={location.city} />
              )}

              <TipsSection />
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-muted-foreground">
        <p className="mt-1 flex items-center justify-center gap-1">
          Ifecho • Made by{" "}
          <a
            href="https://baptistelechat.vercel.app/"
            className="underline transition-colors hover:text-ember"
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
          {" · "}
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
  );
};

export default App;
