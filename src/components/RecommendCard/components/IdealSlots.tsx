import { AlarmClock, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";

interface TimeSlot {
  startHour: number;
  endHour: number;
  startMs: number;
  endMs: number;
  label: string;
  isNow: boolean;
  crossesMidnight: boolean;
  isNight: boolean;
}

const parseDateHour = (isoTime: string): { date: string; hour: number } => {
  const [datePart, timePart] = isoTime.split("T");
  const hour = parseInt(timePart?.split(":")[0] ?? "0", 10);
  return { date: datePart ?? "", hour };
};

// Convertit une string ISO locale (sans offset) en timestamp comparable
// en supposant que la string est en heure locale du navigateur
const localIsoToMs = (isoLocal: string): number => {
  const { date, hour } = parseDateHour(isoLocal);
  const [y, m, d] = date.split("-").map(Number);
  return new Date(y!, (m ?? 1) - 1, d!, hour!, 0, 0, 0).getTime();
};

const getSlotLabel = (startHour: number): string => {
  if (startHour >= 5 && startHour < 11) return "Matin frais";
  if (startHour >= 11 && startHour < 14) return "Midi";
  if (startHour >= 14 && startHour < 18) return "Après-midi";
  if (startHour >= 18 && startHour < 22) return "Soirée";
  return "Nuit";
};

const formatH = (h: number): string =>
  `${(h % 24).toString().padStart(2, "0")}h`;

const getIdealSlots = (scores: HourlyScore[]): TimeSlot[] => {
  const groups: HourlyScore[][] = [];
  let current: HourlyScore[] = [];

  for (const score of scores) {
    if (score.isFavorable) {
      const last = current[current.length - 1];
      const isConsecutive =
        !last ||
        localIsoToMs(score.time) - localIsoToMs(last.time) <= 3_601_000;
      if (isConsecutive) {
        current.push(score);
      } else {
        groups.push([...current]);
        current = [score];
      }
    } else if (current.length > 0) {
      groups.push([...current]);
      current = [];
    }
  }
  if (current.length > 0) groups.push([...current]);

  const now = Date.now();

  return groups
    .map((group) => {
      const first = group[0]!;
      const last = group[group.length - 1]!;
      const startMs = localIsoToMs(first.time);
      const endMs = localIsoToMs(last.time) + 3_600_000;
      const startHour = parseDateHour(first.time).hour;
      const endHour = (parseDateHour(last.time).hour + 1) % 24;
      const isNow = now >= startMs && now < endMs;
      const crossesMidnight =
        parseDateHour(first.time).date !== parseDateHour(last.time).date ||
        endHour === 0;

      const base = getSlotLabel(startHour);
      return {
        startHour,
        endHour,
        startMs,
        endMs,
        label: isNow ? `${base} — maintenant` : base,
        isNow,
        crossesMidnight,
        isNight: base === "Nuit",
      };
    })
    .filter((slot) => slot.endMs > now);
};

interface IdealSlotsProps {
  scores: HourlyScore[];
}

const IdealSlots = ({ scores }: IdealSlotsProps) => {
  const slots = getIdealSlots(scores);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 px-4 pb-3 pt-4">
        <AlarmClock className="size-3.5 text-muted-foreground" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Créneaux idéaux à venir
        </p>
      </div>

      {slots.length === 0 ? (
        <div className="px-4 pb-4">
          <p className="text-sm text-muted-foreground">
            Aucun créneau favorable dans les 24 prochaines heures. Gardez les
            fenêtres fermées.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {slots.map((slot) => (
            <div
              key={`${slot.startMs}-${slot.endMs}`}
              className={cn(
                "flex items-center justify-between px-4 py-3",
                slot.isNow && "bg-ember/5",
              )}
            >
              <span
                className={cn(
                  "tabular-nums text-sm font-semibold",
                  slot.isNow ? "text-ember" : "text-foreground",
                )}
              >
                {formatH(slot.startHour)} – {formatH(slot.endHour)}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs",
                  slot.isNow
                    ? "font-medium text-ember"
                    : "text-muted-foreground",
                )}
              >
                {slot.isNight && <Moon className="size-3" />}
                {slot.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default IdealSlots;
