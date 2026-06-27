export interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string;
  department?: string;
  departmentCode?: string;
  source?: "gps" | "search";
}

export interface VigilanceItem {
  phenomenon: string;
  color: "jaune" | "orange" | "rouge" | "vert";
  echeance: "J" | "J1";
  begin_time: string;
  end_time: string;
}

export interface CommuneResult {
  name: string;
  city: string;
  department: string;
  departmentCode: string;
  latitude: number;
  longitude: number;
}

export interface WeatherHour {
  time: string;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  windspeed: number;
  uvIndex: number;
  weatherCode: number;
}

export interface WeatherData {
  hours: WeatherHour[];
  sunrise: string;
  sunset: string;
  sunrise2: string;
  sunset2: string;
}

export interface HourlyScore {
  hour: number;
  time: string;
  temperature: number;
  humidity: number;
  apparentTemperature: number;
  windspeed: number;
  uvIndex: number;
  weatherCode: number;
  score: number;
  deltaT: number;
  uvPenalty: number;
  isFavorable: boolean;
}

export type ComfortLevel = "hot" | "neutral" | "cool";

export const COMFORT_LEVELS: Record<
  ComfortLevel,
  { label: string; bias: number }
> = {
  cool: { label: "Il fait frais", bias: -2 },
  neutral: { label: "Ça va", bias: 0 },
  hot: { label: "Il fait chaud", bias: 2 },
};
