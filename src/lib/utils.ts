import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const parseDateHour = (
  isoTime: string,
): { date: string; hour: number } => {
  const [datePart, timePart] = isoTime.split("T");
  const hour = parseInt(timePart?.split(":")[0] ?? "0", 10);
  return { date: datePart ?? "", hour };
};

export const todayDateString = (): string => offsetDateString(0);

export const offsetDateString = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const SPRING_EASING: [number, number, number, number] = [
  0.23, 1, 0.32, 1,
];

// Interprète une ISO locale (sans offset, retournée par Open-Meteo) comme heure locale
export const isoLocalToMs = (isoLocal: string): number => {
  const { date, hour } = parseDateHour(isoLocal);
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d!, hour!, 0, 0, 0).getTime();
};
