import { Button } from "@/components/ui/button";
import type { HourlyScore } from "@/types";
import analytics from "@/lib/analytics";
import { useHaptics } from "@/hooks/useHaptics";
import { CalendarPlus } from "lucide-react";

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
    "PRODID:-//Ifecho//FR",
    "BEGIN:VEVENT",
    `UID:Ifecho-${start}@Ifecho.app`,
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:Ouvrir les fenêtres - Ifecho`,
    `DESCRIPTION:Ifecho recommande d'ouvrir maintenant pour refroidir votre logement à ${city}.\\nTempérature extérieure : ${targetHour.temperature.toFixed(1)}°C`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Rappel Ifecho - ouvrir les fenêtres",
    "TRIGGER:-PT15M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
};

const CalendarLink = ({ bestHour, city }: CalendarLinkProps) => {
  const haptics = useHaptics();

  const handleDownload = () => {
    haptics.success();
    analytics.calendarDownloaded({ bestHour: bestHour.hour, city });
    const ics = generateIcs(bestHour, city);
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Ifecho-ventilation.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Button type="button" variant="surface" size="cta" onClick={handleDownload}>
      <CalendarPlus className="size-4" />
      Ajouter au calendrier
    </Button>
  );
};

export default CalendarLink;
