import { useMemo } from "react";
import type { WeatherData, HourlyScore } from "@/types";

const parseHour = (isoTime: string): number => {
  const date = new Date(isoTime);
  return date.getHours();
};

const isNightHour = (
  time: string,
  sunrise: string,
  sunset: string,
): boolean => {
  const hour = parseHour(time);
  const sunriseHour = parseHour(sunrise);
  const sunsetHour = parseHour(sunset);
  return hour >= sunsetHour || hour < sunriseHour;
};

export const useVentilationScore = (
  weather: WeatherData | null,
  indoorTemp: number,
) => {
  return useMemo((): HourlyScore[] => {
    if (!weather) return [];

    return weather.hours.map((hour) => {
      const deltaT = indoorTemp - hour.temperature;
      const malusHumidity = hour.humidity > 80 ? -3 : 0;
      const bonusNight = isNightHour(hour.time, weather.sunrise, weather.sunset)
        ? 2
        : 0;
      const score = deltaT + malusHumidity + bonusNight;

      return {
        hour: parseHour(hour.time),
        time: hour.time,
        temperature: hour.temperature,
        humidity: hour.humidity,
        score,
        deltaT,
        malusHumidity,
        bonusNight,
        isFavorable: score > 0,
      };
    });
  }, [weather, indoorTemp]);
};

export const getBestVentilationHour = (
  scores: HourlyScore[],
): HourlyScore | null => {
  const currentHour = new Date().getHours();
  const upcoming = scores.filter((s) => s.isFavorable && s.hour >= currentHour);
  if (upcoming.length === 0) return null;
  return upcoming.reduce((best, current) =>
    current.score > best.score ? current : best,
  );
};
