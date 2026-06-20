export interface GeoLocation {
  latitude: number;
  longitude: number;
  city: string;
  department?: string;
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
}

export interface WeatherData {
  hours: WeatherHour[];
  sunrise: string;
  sunset: string;
}

export interface HourlyScore {
  hour: number;
  time: string;
  temperature: number;
  humidity: number;
  score: number;
  deltaT: number;
  malusHumidity: number;
  bonusNight: number;
  isFavorable: boolean;
}

export type IndoorTempMode = "buttons" | "manual";

export type IndoorTempPreset = "hot" | "mild" | "cool";

export const INDOOR_TEMP_PRESETS: Record<
  IndoorTempPreset,
  { label: string; emoji: string; value: number }
> = {
  hot: { label: "Chaud", emoji: "🥵", value: 30 },
  mild: { label: "Tiède", emoji: "😐", value: 26 },
  cool: { label: "Frais", emoji: "🌬️", value: 22 },
};
