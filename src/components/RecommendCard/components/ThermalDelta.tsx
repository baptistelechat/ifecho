import { ArrowUpDown, Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";

interface ThermalDeltaProps {
  currentScore: HourlyScore;
}

const MAX_DELTA = 15;

type ScoreLevel = "good" | "neutral" | "bad";

const getLevel = (score: number): ScoreLevel => {
  if (score > 2) return "good";
  if (score > -2) return "neutral";
  return "bad";
};

const LEVEL_STYLES: Record<
  ScoreLevel,
  { value: string; bar: string; icon: string }
> = {
  good: {
    value: "text-verdict-good",
    bar: "bg-verdict-good",
    icon: "text-verdict-good",
  },
  neutral: {
    value: "text-amber-500",
    bar: "bg-amber-400",
    icon: "text-amber-500",
  },
  bad: {
    value: "text-verdict-bad",
    bar: "bg-verdict-bad",
    icon: "text-verdict-bad",
  },
};

const ThermalDelta = ({ currentScore }: ThermalDeltaProps) => {
  const delta = currentScore.deltaT;
  const absD = Math.abs(delta);
  const barWidth = Math.min((absD / MAX_DELTA) * 100, 100);
  const level = getLevel(currentScore.score);
  const styles = LEVEL_STYLES[level];

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="size-3.5 text-muted-foreground" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Écart thermique
          </p>
        </div>
        <span className={cn("text-sm font-bold", styles.value)}>
          {delta > 0 ? "↓" : "↑"} {absD.toFixed(1)}°C
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full transition-all", styles.bar)}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        {level === "good" ? (
          <Check className={cn("size-3 shrink-0", styles.icon)} />
        ) : level === "neutral" ? (
          <Minus className={cn("size-3 shrink-0", styles.icon)} />
        ) : (
          <X className={cn("size-3 shrink-0", styles.icon)} />
        )}
        <p className="text-xs text-muted-foreground">
          {delta > 0
            ? "Extérieur plus frais — aérer refroidira l'intérieur"
            : "Extérieur plus chaud — aérer réchaufferait l'intérieur"}
        </p>
      </div>
    </div>
  );
};

export default ThermalDelta;
