import { useEffect, useRef } from "react";
import { ArrowDown, ArrowUp, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";

interface VentilationTimelineProps {
  scores: HourlyScore[];
  bestHour: HourlyScore | null;
}

const formatHour = (hour: number) => `${hour.toString().padStart(2, "0")}h`;

const ZONE_POSITIVE = 44;
const ZONE_NEGATIVE = 28;
const MIN_BAR = 4;
const GAP_BASELINE = 10;
const ARROW_SIZE = 12;
const ARROW_TOP_Y = ZONE_POSITIVE - GAP_BASELINE - ARROW_SIZE;
const ARROW_BOTTOM_Y = ZONE_POSITIVE + 1 + GAP_BASELINE;

const getBarColor = (score: number, isBest: boolean): string => {
  if (isBest || score > 2) return "bg-verdict-good";
  return "bg-amber-400/70";
};

const parseDateHour = (isoTime: string): { date: string; hour: number } => {
  const [datePart, timePart] = isoTime.split("T");
  const hour = parseInt(timePart?.split(":")[0] ?? "0", 10);
  return { date: datePart ?? "", hour };
};

const VentilationTimeline = ({
  scores,
  bestHour,
}: VentilationTimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentHourRef = useRef<HTMLDivElement>(null);

  const currentHour = new Date().getHours();
  const nowDate = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const maxAbsScore = Math.max(...scores.map((s) => Math.abs(s.score)), 0.1);

  useEffect(() => {
    currentHourRef.current?.scrollIntoView({
      inline: "center",
      block: "nearest",
    });
  }, []);

  if (scores.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <BarChart2 className="size-3.5" />
        Prochaines 24h
      </p>

      <div ref={scrollRef} className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-px">
          {scores.map((score, index) => {
            const isBest = bestHour?.time === score.time;
            const { date: scoreDate, hour: scoreHour } = parseDateHour(
              score.time,
            );
            const isNow = scoreHour === currentHour && scoreDate === nowDate;
            const s = score.score;

            const prevScore = scores[index - 1];
            const showDayMarker =
              index > 0 &&
              prevScore &&
              parseDateHour(prevScore.time).date !== scoreDate;

            const positiveHeight =
              s > 0
                ? Math.max((s / maxAbsScore) * ZONE_POSITIVE, MIN_BAR)
                : s === 0
                  ? MIN_BAR
                  : 0;
            const negativeHeight =
              s < 0
                ? Math.max((Math.abs(s) / maxAbsScore) * ZONE_NEGATIVE, MIN_BAR)
                : 0;

            const showTopArrow = isNow && s <= 2;
            const showBottomArrow = isNow && s > 2;

            return (
              <div key={score.time} className="flex gap-px">
                {showDayMarker && (
                  <div className="flex w-6 flex-col items-center">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        height: `${ZONE_POSITIVE + 1 + ZONE_NEGATIVE}px`,
                      }}
                    >
                      <div className="h-full w-0 border-l-2 border-dashed border-primary" />
                    </div>
                    <span className="mt-1 text-[9px] leading-none tabular-nums text-muted-foreground">
                      {scoreDate.split("-").slice(1).reverse().join("/")}
                    </span>
                  </div>
                )}

                <div
                  ref={isNow ? currentHourRef : undefined}
                  className="flex w-8 flex-col items-center gap-1"
                >
                  <div
                    className="relative flex flex-col items-center"
                    style={{ height: `${ZONE_POSITIVE + 1 + ZONE_NEGATIVE}px` }}
                  >
                    {showTopArrow && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ top: `${ARROW_TOP_Y}px` }}
                      >
                        <ArrowDown
                          className={cn(
                            "size-3 animate-bounce",
                            s <= -2 ? "text-red-500" : "text-amber-400",
                          )}
                        />
                      </div>
                    )}

                    {showBottomArrow && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ top: `${ARROW_BOTTOM_Y}px` }}
                      >
                        <ArrowUp className="size-3 animate-bounce text-verdict-good" />
                      </div>
                    )}

                    <div
                      className="flex items-end justify-center"
                      style={{ height: `${ZONE_POSITIVE}px` }}
                    >
                      {positiveHeight > 0 && (
                        <div
                          className={cn(
                            "w-5 rounded-t transition-all",
                            getBarColor(s, isBest),
                          )}
                          style={{ height: `${positiveHeight}px` }}
                          title={`${formatHour(scoreHour)} — ${score.temperature.toFixed(1)}°C — score: ${s.toFixed(1)}`}
                        />
                      )}
                    </div>

                    <div
                      className="flex items-start justify-center"
                      style={{ height: `${ZONE_NEGATIVE}px` }}
                    >
                      {negativeHeight > 0 && (
                        <div
                          className={cn(
                            "w-5 rounded-b transition-all",
                            s <= -2 ? "bg-red-500/70" : "bg-amber-400/70",
                          )}
                          style={{ height: `${negativeHeight}px` }}
                          title={`${formatHour(scoreHour)} — ${score.temperature.toFixed(1)}°C — score: ${s.toFixed(1)}`}
                        />
                      )}
                    </div>
                  </div>

                  <span
                    className={cn(
                      "text-[9px] leading-none tabular-nums",
                      isBest
                        ? "font-bold text-verdict-good"
                        : isNow
                          ? "font-semibold text-ember"
                          : "text-muted-foreground",
                    )}
                  >
                    {scoreHour % 3 === 0 ? formatHour(scoreHour) : ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-sm bg-verdict-good" />
          <span>Favorable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-sm bg-amber-400/70" />
          <span>Neutre</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-sm bg-red-500/70" />
          <span>Défavorable</span>
        </div>
      </div>
    </div>
  );
};

export default VentilationTimeline;
