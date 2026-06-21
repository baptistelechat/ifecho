import { Cloud, Home, Droplets } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import type { HourlyScore } from "@/types";

interface ThermalComparisonProps {
  currentScore: HourlyScore;
  indoorTemp: number;
  onTempChange: (value: number) => void;
  city: string;
}

const ThermalComparison = ({
  currentScore,
  indoorTemp,
  onTempChange,
  city,
}: ThermalComparisonProps) => {
  return (
    <div className="grid grid-cols-2 divide-x divide-border overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Extérieur */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Cloud className="size-3.5 text-sky" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Extérieur
          </p>
        </div>
        <p className="tabular-nums text-5xl font-black leading-none text-foreground">
          {currentScore.temperature.toFixed(1)}°
        </p>
        <div className="mt-3 space-y-1">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="size-3 shrink-0 text-sky/70" />
            {currentScore.humidity}%
          </p>
          <p className="text-xs text-muted-foreground">{city}</p>
        </div>
      </div>

      {/* Intérieur */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Home className="size-3.5 text-ember" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Intérieur
          </p>
        </div>
        <p className="tabular-nums text-5xl font-black leading-none text-foreground">
          {indoorTemp}°
        </p>
        <div className="mt-3">
          <Slider
            value={[indoorTemp]}
            onValueChange={(values) => onTempChange(values[0]!)}
            min={14}
            max={35}
            step={1}
            aria-label="Température intérieure en degrés Celsius"
          />
          <div className="mt-0.5 flex justify-between">
            <span className="text-[10px] text-muted-foreground">14°</span>
            <span className="text-[10px] text-muted-foreground">35°</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalComparison;
