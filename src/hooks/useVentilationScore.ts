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
  comfortBias: number = 0,
) => {
  return useMemo((): HourlyScore[] => {
    if (!weather) return [];

    return weather.hours.map((hour) => {
      const deltaT = indoorTemp - hour.apparentTemperature;
      const bonusNight = isNightHour(hour.time, weather.sunrise, weather.sunset)
        ? 1
        : 0;
      const score = deltaT + bonusNight + comfortBias;

      return {
        hour: parseHour(hour.time),
        time: hour.time,
        temperature: hour.temperature,
        humidity: hour.humidity,
        apparentTemperature: hour.apparentTemperature,
        windspeed: hour.windspeed,
        uvIndex: hour.uvIndex,
        score,
        deltaT,
        bonusNight,
        isFavorable: score > 2,
      };
    });
  }, [weather, indoorTemp, comfortBias]);
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
