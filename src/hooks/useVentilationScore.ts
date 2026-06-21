import { useMemo } from "react";
import type { WeatherData, HourlyScore } from "@/types";

// Parse l'heure locale directement depuis la string ISO sans passer par Date
// (évite le décalage UTC/CEST de new Date().getHours() sur strings sans offset)
const parseDateHour = (isoTime: string): { date: string; hour: number } => {
  const [datePart, timePart] = isoTime.split("T");
  const hour = parseInt(timePart?.split(":")[0] ?? "0", 10);
  return { date: datePart ?? "", hour };
};

// Malus UV : réduit le score si le soleil entre par les vitres pendant l'aération
const computeUvPenalty = (uvIndex: number): number => {
  if (uvIndex >= 6) return 1.5;
  if (uvIndex >= 3) return 1;
  if (uvIndex >= 1) return 0.5;
  return 0;
};

const localDateString = (): string => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const useVentilationScore = (
  weather: WeatherData | null,
  indoorTemp: number,
  comfortBias: number = 0,
) => {
  return useMemo((): HourlyScore[] => {
    if (!weather) return [];

    const nowHour = new Date().getHours();
    const nowDate = localDateString();

    return weather.hours.flatMap((h) => {
      const { date, hour: hourNum } = parseDateHour(h.time);
      const keep =
        (date === nowDate && hourNum >= nowHour) ||
        // J+1 : garder uniquement les heures qui restent dans la fenêtre 24h
        (date > nowDate && 24 - nowHour + hourNum < 24);
      if (!keep) return [];

      const feltIndoor = indoorTemp + comfortBias;
      const deltaT = feltIndoor - h.apparentTemperature;
      const uvPenalty = computeUvPenalty(h.uvIndex);
      const score = deltaT - uvPenalty;

      return [
        {
          hour: hourNum,
          time: h.time,
          temperature: h.temperature,
          humidity: h.humidity,
          apparentTemperature: h.apparentTemperature,
          windspeed: h.windspeed,
          uvIndex: h.uvIndex,
          score,
          deltaT,
          uvPenalty,
          isFavorable: score > 2,
        },
      ];
    });
  }, [weather, indoorTemp, comfortBias]);
};

export const getBestVentilationHour = (
  scores: HourlyScore[],
): HourlyScore | null => {
  const nowHour = new Date().getHours();
  const nowDate = localDateString();

  const upcoming = scores.filter((s) => {
    if (!s.isFavorable) return false;
    const { date, hour } = parseDateHour(s.time);
    if (date === nowDate) return hour >= nowHour;
    return date > nowDate;
  });

  if (upcoming.length === 0) return null;
  return upcoming.reduce((best, current) =>
    current.score > best.score ? current : best,
  );
};
