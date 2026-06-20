import { BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";

interface VentilationTimelineProps {
  scores: HourlyScore[];
  bestHour: HourlyScore | null;
}

const formatHour = (hour: number) => `${hour.toString().padStart(2, "0")}h`;

const VentilationTimeline = ({
  scores,
  bestHour,
}: VentilationTimelineProps) => {
  if (scores.length === 0) return null;

  const maxScore = Math.max(...scores.map((s) => Math.max(s.score, 0)));
  const currentHour = new Date().getHours();

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <BarChart2 className="size-3.5" />
        Timeline 24h
      </p>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-max gap-0.5">
          {scores.map((score) => {
            const isBest = bestHour?.hour === score.hour;
            const isNow = score.hour === currentHour;
            const height =
              score.isFavorable && maxScore > 0
                ? Math.max((score.score / maxScore) * 56, 6)
                : 3;

            return (
              <div
                key={score.hour}
                className="flex w-8 flex-col items-center gap-1"
              >
                <div className="flex h-14 items-end">
                  <div
                    className={cn(
                      "w-5 rounded-t transition-all",
                      isBest
                        ? "bg-verdict-good"
                        : score.isFavorable
                          ? "bg-verdict-good/40"
                          : "bg-secondary",
                      isNow && !isBest && "ring-1 ring-ember/60",
                    )}
                    style={{ height: `${height}px` }}
                    title={`${formatHour(score.hour)} — ${score.temperature.toFixed(1)}°C — score: ${score.score.toFixed(1)}`}
                  />
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
                  {score.hour % 3 === 0 ? formatHour(score.hour) : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-sm bg-verdict-good" />
          <span>Meilleur</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-sm bg-verdict-good/40" />
          <span>Favorable</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="size-2.5 rounded-sm bg-secondary border border-border" />
          <span>Défavorable</span>
        </div>
      </div>
    </div>
  );
};

export default VentilationTimeline;
