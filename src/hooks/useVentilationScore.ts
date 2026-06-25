import { useMemo } from "react";
import type { WeatherData, HourlyScore } from "@/types";
import { parseDateHour, todayDateString, offsetDateString } from "@/lib/utils";

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
        (date === dayAfterDate && hourNum < nowHour); // J+2 jusqu'à nowHour (fenêtre 48h)
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
