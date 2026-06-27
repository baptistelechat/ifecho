import { useMemo } from "react";
import type { WeatherData, HourlyScore } from "@/types";
import { offsetDateString, parseDateHour, todayDateString } from "@/lib/utils";

// Seuil RE2020 / Plan Canicule France : au-dessus de 26°C l'intérieur est en inconfort thermique
const COMFORT_THRESHOLD_CELSIUS = 26;
// Plancher extérieur empirique : sous 16°C l'aération est hors-saison (trop froid)
const OUTDOOR_MIN_CELSIUS = 16;

const computeUvPenalty = (uvIndex: number): number => {
  if (uvIndex >= 6) return 1.5;
  if (uvIndex >= 3) return 1;
  if (uvIndex >= 1) return 0.5;
  return 0;
};

export const useVentilationScore = (
  weather: WeatherData | null,
  indoorTemp: number,
  comfortBias: number = 0,
) => {
  return useMemo((): HourlyScore[] => {
    if (!weather) return [];

    const nowHour = new Date().getHours();
    const nowDate = todayDateString();
    const tomorrowDate = offsetDateString(1);

    return weather.hours.flatMap((h) => {
      const { date, hour: hourNum } = parseDateHour(h.time);
      // Filtre strict J+J+1 : aujourd'hui dès l'heure actuelle, demain entier
      if (!((date === nowDate && hourNum >= nowHour) || date === tomorrowDate))
        return [];

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
          weatherCode: h.weatherCode,
          score,
          deltaT,
          uvPenalty,
          isFavorable:
            indoorTemp > COMFORT_THRESHOLD_CELSIUS &&
            h.apparentTemperature >= OUTDOOR_MIN_CELSIUS &&
            score > 2,
        },
      ];
    });
  }, [weather, indoorTemp, comfortBias]);
};

export const getTimelineLength = (scores: HourlyScore[]): number =>
  Math.min(24, scores.length);

export const getBestVentilationHour = (
  scores: HourlyScore[],
): HourlyScore | null => {
  const nowHour = new Date().getHours();
  const nowDate = todayDateString();

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
