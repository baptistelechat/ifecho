import { CalendarPlus } from "lucide-react";
import type { HourlyScore } from "@/types";

interface CalendarLinkProps {
  bestHour: HourlyScore;
  city: string;
}

const generateIcs = (targetHour: HourlyScore, city: string): string => {
  const date = new Date(targetHour.time);
  const pad = (n: number) => n.toString().padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const start = fmt(date);
  const end = fmt(new Date(date.getTime() + 60 * 60 * 1000));
  const now = fmt(new Date());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ifecho//FR",
    "BEGIN:VEVENT",
    `UID:ifecho-${start}@ifecho.app`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Ouvrir les fenêtres — ifecho`,
    `DESCRIPTION:ifecho recommande d'ouvrir maintenant pour refroidir votre logement à ${city}.\\nTempérature extérieure : ${targetHour.temperature.toFixed(1)}°C`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Rappel ifecho — ouvrir les fenêtres",
    "TRIGGER:-PT15M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

const CalendarLink = ({ bestHour, city }: CalendarLinkProps) => {
  const handleDownload = () => {
    const ics = generateIcs(bestHour, city);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ifecho-ventilation.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:border-ember/40 hover:text-ember"
    >
      <CalendarPlus className="size-4" />
      Ajouter au calendrier
    </button>
  );
};

export default CalendarLink;
