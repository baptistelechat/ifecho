import { useMemo } from "react";
import type { WeatherData, HourlyScore } from "@/types";
import {
  isoLocalToMs,
  parseDateHour,
  todayDateString,
  offsetDateString,
} from "@/lib/utils";

// Malus UV : réduit le score si le soleil entre par les vitres pendant l'aération
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
    const dayAfterDate = offsetDateString(2);

    return weather.hours.flatMap((h) => {
      const { date, hour: hourNum } = parseDateHour(h.time);
      const keep =
        (date === nowDate && hourNum >= nowHour) || // J depuis now
        date === tomorrowDate || // tout J+1
        date === dayAfterDate; // tout J+2 (créneau peut dépasser 24h)
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

// Nombre de scores à passer à la timeline :
// 24h minimum + extension jusqu'à la fin du dernier créneau idéal + 1h buffer.
export const getTimelineLength = (scores: HourlyScore[]): number => {
  const MIN = 25;
  const nowMs = Date.now();
  const WINDOW_24H_MS = 24 * 3_600_000;

  let inSlot = false;
  let slotStartMs = 0;
  let lastRelevantIdx = MIN - 1;

  for (let i = 0; i < scores.length; i++) {
    const s = scores[i]!;
    if (s.isFavorable && !inSlot) {
      inSlot = true;
      slotStartMs = isoLocalToMs(s.time);
    } else if (!s.isFavorable) {
      inSlot = false;
    }
    // Inclure ce score si le créneau courant démarre dans la fenêtre 24h
    if (inSlot && slotStartMs < nowMs + WINDOW_24H_MS) {
      lastRelevantIdx = i + 1; // +1 : inclure la première barre non-favorable après le créneau
    }
  }

  return Math.max(MIN, lastRelevantIdx + 1); // +1 : 1h de buffer visuel
};
