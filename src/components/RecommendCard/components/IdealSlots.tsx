import {
  cn,
  offsetDateString,
  parseDateHour,
  SPRING_EASING,
  todayDateString,
} from "@/lib/utils";
import type { HourlyScore } from "@/types";
import { AnimatePresence, m } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AlarmClock, ArrowDown, ArrowUp, Moon, Sun } from "lucide-react";

interface TimeSlot {
  startHour: number;
  endHour: number;
  startMs: number;
  endMs: number;
  startDate: string;
  baseLabel: string;
  isNow: boolean;
  crossesMidnight: boolean;
}

const TIME_OF_DAY_META: Record<
  string,
  { icon: LucideIcon; chevron?: "up" | "down"; color: string }
> = {
  "Matin frais": { icon: Sun, chevron: "up", color: "text-amber-400" },
  Midi: { icon: Sun, color: "text-yellow-500" },
  "Après-midi": { icon: Sun, color: "text-orange-400" },
  Soirée: { icon: Sun, chevron: "down", color: "text-orange-500" },
  Nuit: { icon: Moon, color: "text-indigo-400" },
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

const WINDOW_MS = 24 * 3_600_000;

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

  return groups.flatMap((group) => {
    const first = group[0]!;
    const last = group[group.length - 1]!;
    const startMs = localIsoToMs(first.time);
    const endMs = localIsoToMs(last.time) + 3_600_000;
    if (endMs <= now) return [];
    // Ne montrer que les créneaux qui démarrent dans la fenêtre 24h
    if (startMs >= now + WINDOW_MS) return [];
    const startHour = parseDateHour(first.time).hour;
    const endHour = new Date(endMs).getHours();
    const isNow = now >= startMs && now < endMs;
    const crossesMidnight =
      parseDateHour(first.time).date !== parseDateHour(last.time).date ||
      endHour === 0;
    return [
      {
        startHour,
        endHour,
        startMs,
        endMs,
        startDate: parseDateHour(first.time).date,
        baseLabel: getSlotLabel(startHour),
        isNow,
        crossesMidnight,
      },
    ];
  });
};

interface IdealSlotsProps {
  scores: HourlyScore[];
}

const IdealSlots = ({ scores }: IdealSlotsProps) => {
  const slots = getIdealSlots(scores);
  const todayStr = todayDateString();
  const tomorrowStr = offsetDateString(1);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-center gap-2 px-4 pb-3 pt-4">
        <AlarmClock className="size-3.5 text-muted-foreground" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Créneaux idéaux à venir
        </p>
      </div>

      {/*
        Structure plate : empty et slots partagent le même AnimatePresence.
        Chaque élément anime height 0→auto + opacity pour éviter le flash
        et le snap brutal du conteneur parent.
      */}
      <AnimatePresence initial={false}>
        {slots.length === 0 ? (
          <m.div
            key="empty"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: SPRING_EASING }}
            className="overflow-hidden"
          >
            <p className="px-4 pb-4 text-sm text-muted-foreground">
              Aucun créneau favorable dans les 24 prochaines heures. Gardez les
              fenêtres fermées.
            </p>
          </m.div>
        ) : (
          slots.map((slot, index) => {
            const meta = TIME_OF_DAY_META[slot.baseLabel] ?? {
              icon: Sun,
              color: "text-muted-foreground",
            };
            const Icon = meta.icon;
            const hasMultipleDays = slots.some((s) => s.startDate !== todayStr);
            const dayLabel = hasMultipleDays
              ? slot.startDate === todayStr
                ? " • Aujourd'hui"
                : slot.startDate === tomorrowStr
                  ? " • Demain"
                  : " • Après-demain"
              : "";
            const displayLabel = slot.isNow
              ? `${slot.baseLabel} • Maintenant`
              : `${slot.baseLabel}${dayLabel}`;

            return (
              <m.div
                key={slot.startMs}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: 0.28,
                  delay: index * 0.06,
                  ease: SPRING_EASING,
                }}
                className="overflow-hidden"
              >
                <div
                  className={cn(
                    "flex items-end justify-between px-4 py-3",
                    index > 0 && "border-t border-border",
                    slot.isNow && "bg-ember/5",
                  )}
                >
                  <p
                    className={cn(
                      "tabular-nums text-4xl font-black leading-none",
                      slot.isNow ? "text-ember" : "text-foreground",
                    )}
                  >
                    {formatH(slot.startHour)} – {formatH(slot.endHour)}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="flex items-center">
                      {meta.chevron === "up" && (
                        <ArrowUp
                          className={cn(
                            "mr-0.5 size-2.5",
                            slot.isNow ? "text-ember" : meta.color,
                          )}
                        />
                      )}
                      {meta.chevron === "down" && (
                        <ArrowDown
                          className={cn(
                            "mr-0.5 size-2.5",
                            slot.isNow ? "text-ember" : meta.color,
                          )}
                        />
                      )}
                      <Icon
                        className={cn(
                          "size-3",
                          slot.isNow ? "text-ember" : meta.color,
                        )}
                      />
                    </span>
                    <span
                      className={cn(
                        "text-xs",
                        slot.isNow ? "font-medium text-ember" : meta.color,
                      )}
                    >
                      {displayLabel}
                    </span>
                  </div>
                </div>
              </m.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
};

export default IdealSlots;
