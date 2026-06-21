import { useMemo } from "react";
import type { WeatherData, HourlyScore } from "@/types";

// Parse l'heure locale directement depuis la string ISO sans passer par Date
// (évite le décalage UTC/CEST de new Date().getHours() sur strings sans offset)
const parseDateHour = (isoTime: string): { date: string; hour: number } => {
  const [datePart, timePart] = isoTime.split("T");
  const hour = parseInt(timePart?.split(":")[0] ?? "0", 10);
  return { date: datePart ?? "", hour };
};

const isNightHour = (
  time: string,
  sunrise: string,
  sunset: string,
  sunrise2: string,
  sunset2: string,
): boolean => {
  const { date: timeDate, hour: timeHour } = parseDateHour(time);
  const { date: srDate, hour: sunriseHour } = parseDateHour(sunrise);

  if (timeDate === srDate) {
    const sunsetHour = parseDateHour(sunset).hour;
    return timeHour >= sunsetHour || timeHour < sunriseHour;
  }

  const sunriseHour2 = parseDateHour(sunrise2).hour;
  const sunsetHour2 = parseDateHour(sunset2).hour;
  return timeHour >= sunsetHour2 || timeHour < sunriseHour2;
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

    return weather.hours
      .filter((h) => {
        const { date, hour } = parseDateHour(h.time);
        if (date === nowDate) return hour >= nowHour;
        if (date > nowDate) {
          // J+1 : garder uniquement les heures qui restent dans la fenêtre 24h
          return 24 - nowHour + hour < 24;
        }
        return false;
      })
      .map((hour) => {
        const feltIndoor = indoorTemp + comfortBias;
        const deltaT = feltIndoor - hour.apparentTemperature;
        const bonusNight = isNightHour(
          hour.time,
          weather.sunrise,
          weather.sunset,
          weather.sunrise2,
          weather.sunset2,
        )
          ? 1
          : 0;
        const score = deltaT + bonusNight;

        return {
          hour: parseDateHour(hour.time).hour,
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
