import { AlarmClock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";

interface TimeSlot {
  start: number;
  end: number;
  label: string;
  isNow: boolean;
}

const getSlotLabel = (start: number): string => {
  if (start >= 5 && start < 11) return "Matin frais";
  if (start >= 11 && start < 14) return "Midi";
  if (start >= 14 && start < 18) return "Après-midi";
  if (start >= 18 && start < 22) return "Soirée";
  return "Nuit";
};

const formatH = (h: number): string =>
  `${(h % 24).toString().padStart(2, "0")}h`;

const getIdealSlots = (
  scores: HourlyScore[],
  currentHour: number,
): TimeSlot[] => {
  const groups: number[][] = [];
  let current: number[] = [];

  for (const score of scores) {
    if (score.isFavorable) {
      const last = current[current.length - 1];
      if (current.length === 0 || score.hour === last! + 1) {
        current.push(score.hour);
      } else {
        groups.push([...current]);
        current = [score.hour];
      }
    } else {
      if (current.length > 0) {
        groups.push([...current]);
        current = [];
      }
    }
  }
  if (current.length > 0) groups.push([...current]);

  return groups.map((group) => {
    const start = group[0]!;
    const end = group[group.length - 1]! + 1;
    const isNow = currentHour >= start && currentHour < end;
    const base = getSlotLabel(start);
    return {
      start,
      end,
      label: isNow ? `${base} — maintenant` : base,
      isNow,
    };
  });
};

interface IdealSlotsProps {
  scores: HourlyScore[];
}

const IdealSlots = ({ scores }: IdealSlotsProps) => {
  const currentHour = new Date().getHours();
  const slots = getIdealSlots(scores, currentHour).filter(
    (slot) => slot.end > currentHour,
  );

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
            Aucun créneau favorable à venir aujourd'hui. Gardez les fenêtres fermées.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {slots.map((slot) => {
            return (
              <div
                key={`${slot.start}-${slot.end}`}
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
                  {formatH(slot.start)} – {formatH(slot.end)}
                </span>
                <span
                  className={cn(
                    "text-xs",
                    slot.isNow
                      ? "font-medium text-ember"
                      : "text-muted-foreground",
                  )}
                >
                  {slot.label}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default IdealSlots;
