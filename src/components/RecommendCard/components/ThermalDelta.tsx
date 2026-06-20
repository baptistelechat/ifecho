import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";

interface ThermalDeltaProps {
  currentScore: HourlyScore;
  indoorTemp: number;
}

const MAX_DELTA = 15;

const ThermalDelta = ({ currentScore, indoorTemp }: ThermalDeltaProps) => {
  const delta = indoorTemp - currentScore.temperature;
  const absD = Math.abs(delta);
  const barWidth = Math.min((absD / MAX_DELTA) * 100, 100);
  const isGood = delta > 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Écart thermique
        </p>
        <span
          className={cn(
            "text-sm font-bold",
            isGood ? "text-verdict-good" : "text-verdict-bad",
          )}
        >
          {delta > 0 ? "↓" : "↑"} {absD.toFixed(1)}°C
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            isGood ? "bg-verdict-good" : "bg-verdict-bad",
          )}
          style={{ width: `${barWidth}%` }}
        />
      </div>

      <div className="mt-2 flex items-center gap-1.5">
        {isGood ? (
          <Check className="size-3 shrink-0 text-verdict-good" />
        ) : (
          <X className="size-3 shrink-0 text-verdict-bad" />
        )}
        <p className="text-xs text-muted-foreground">
          {isGood
            ? "Extérieur plus frais — aérer refroidira l'intérieur"
            : "Extérieur plus chaud — aérer réchaufferait l'intérieur"}
        </p>
      </div>
    </div>
  );
};

export default ThermalDelta;
