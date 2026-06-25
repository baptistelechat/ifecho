import { useState, useEffect } from "react";
import type { WeatherData, GeoLocation } from "@/types";

interface OpenMeteoResponse {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relativehumidity_2m: number[];
    apparent_temperature: number[];
    windspeed_10m: number[];
    uv_index: number[];
  };
  daily: {
    sunrise: string[];
    sunset: string[];
  };
}

export const useWeatherForecast = (location: GeoLocation | null) => {
  const lat = location?.latitude ?? null;
  const lon = location?.longitude ?? null;

  const [prevLat, setPrevLat] = useState<number | null>(lat);
  const [prevLon, setPrevLon] = useState<number | null>(lon);
  const [data, setData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(lat != null && lon != null);
  const [error, setError] = useState<string | null>(null);

  if (lat !== prevLat || lon !== prevLon) {
    setPrevLat(lat);
    setPrevLon(lon);
    setIsLoading(lat != null && lon != null);
    setError(null);
  }

  useEffect(() => {
    if (lat == null || lon == null) return;

    let cancelled = false;

    const fetchWeather = async () => {
      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", lat.toString());
        url.searchParams.set("longitude", lon.toString());
        url.searchParams.set(
          "hourly",
          "temperature_2m,relativehumidity_2m,apparent_temperature,windspeed_10m,uv_index",
        );
        url.searchParams.set("daily", "sunrise,sunset");
        url.searchParams.set("forecast_days", "3");
        url.searchParams.set("timezone", "Europe/Paris");

        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Erreur API météo");

        const json = (await response.json()) as OpenMeteoResponse;

        if (cancelled) return;

        const hours = json.hourly.time.map((time, index) => ({
          time,
          temperature: json.hourly.temperature_2m[index] ?? 0,
          humidity: json.hourly.relativehumidity_2m[index] ?? 0,
          apparentTemperature: json.hourly.apparent_temperature[index] ?? 0,
          windspeed: json.hourly.windspeed_10m[index] ?? 0,
          uvIndex: json.hourly.uv_index[index] ?? 0,
        }));

        setData({
          hours,
          sunrise: json.daily.sunrise[0] ?? "",
          sunset: json.daily.sunset[0] ?? "",
          sunrise2: json.daily.sunrise[1] ?? json.daily.sunrise[0] ?? "",
          sunset2: json.daily.sunset[1] ?? json.daily.sunset[0] ?? "",
        });
        setIsLoading(false);
      } catch {
        if (!cancelled) {
          setError(
            "Impossible de récupérer les données météo. Vérifier votre connexion internet.",
          );
          setIsLoading(false);
        }
      }
    };

    void fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  return { data, isLoading, error };
};
