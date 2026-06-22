import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useHaptics } from "@/hooks/useHaptics";
import { COMFORT_LEVELS, type ComfortLevel, type HourlyScore } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  ChevronUp,
  Cloud,
  Droplets,
  Flame,
  Home,
  Smile,
  Snowflake,
  Sun,
  Thermometer,
  Wind,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ThermalComparisonProps {
  currentScore: HourlyScore;
  indoorTemp: number;
  onTempChange: (value: number) => void;
  comfortLevel: ComfortLevel;
  onComfortChange: (level: ComfortLevel) => void;
  cityName: string;
}

const COMFORT_ICONS: Record<ComfortLevel, LucideIcon> = {
  cool: Snowflake,
  neutral: Smile,
  hot: Flame,
};

const comfortLevels = Object.keys(COMFORT_LEVELS) as ComfortLevel[];

const ThermalComparison = ({
  currentScore,
  indoorTemp,
  onTempChange,
  comfortLevel,
  onComfortChange,
  cityName,
}: ThermalComparisonProps) => {
  const haptics = useHaptics();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const startEditing = () => {
    setInputValue(indoorTemp.toString());
    setIsEditing(true);
  };

  const commitEdit = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed) && parsed >= 14 && parsed <= 35) {
      haptics.success();
      onTempChange(parsed);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setIsEditing(false);
  };

  const comfortBias = COMFORT_LEVELS[comfortLevel].bias;
  const feltIndoorTemp = indoorTemp + comfortBias;

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
            <Thermometer className="size-3 shrink-0 text-ember/70" />
            Ressenti {currentScore.apparentTemperature.toFixed(1)}°
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Droplets className="size-3 shrink-0 text-sky/70" />
            {currentScore.humidity}%
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Wind className="size-3 shrink-0 text-muted-foreground/60" />
            {currentScore.windspeed.toFixed(0)} km/h
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sun className="size-3 shrink-0 text-amber-400" />
            UV {Math.round(currentScore.uvIndex)}
          </p>
        </div>
        <p className="mt-2 truncate text-[10px] font-medium text-muted-foreground/60">
          {cityName}
        </p>
      </div>

      {/* Intérieur */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Home className="size-3.5 text-ember" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Intérieur
          </p>
        </div>

        {/* Température + boutons +/- */}
        <div className="flex items-center justify-between">
          <div className="flex h-[1em] items-center tabular-nums text-5xl font-black leading-none text-foreground">
            {isEditing ? (
              <>
                <input
                  ref={inputRef}
                  type="number"
                  min={14}
                  max={35}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={handleKeyDown}
                  className="h-full w-14 border-0 bg-transparent p-0 tabular-nums text-5xl font-black leading-none text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  aria-label="Saisir la température intérieure"
                />
                °
              </>
            ) : (
              <button
                type="button"
                onClick={startEditing}
                className="cursor-text p-0 transition-opacity hover:opacity-70"
                aria-label={`${indoorTemp}° — modifier la température intérieure`}
              >
                {indoorTemp}°
              </button>
            )}
          </div>
          <div className="flex flex-col gap-0.5">
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                haptics.nudge();
                onTempChange(Math.min(35, indoorTemp + 1));
              }}
              disabled={indoorTemp >= 35}
              aria-label="Augmenter la température"
            >
              <ChevronUp className="size-3" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-6 w-6"
              onClick={() => {
                haptics.nudge();
                onTempChange(Math.max(14, indoorTemp - 1));
              }}
              disabled={indoorTemp <= 14}
              aria-label="Diminuer la température"
            >
              <ChevronDown className="size-3" />
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <Slider
            value={[indoorTemp]}
            onValueChange={(values) => {
              haptics.nudge();
              onTempChange(values[0]!);
            }}
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

        {/* Ressenti + boutons */}
        <div className="mt-3 space-y-2">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Thermometer className="size-3 shrink-0 text-ember/70" />
            Ressenti ~{feltIndoorTemp}°
          </p>
          <div className="flex justify-center gap-2">
            {comfortLevels.map((key) => {
              const Icon = COMFORT_ICONS[key];
              return (
                <Button
                  key={key}
                  variant={comfortLevel === key ? "default" : "outline"}
                  size="icon"
                  onClick={() => {
                    haptics.success();
                    onComfortChange(key);
                  }}
                  aria-pressed={comfortLevel === key}
                  aria-label={COMFORT_LEVELS[key].label}
                >
                  <Icon className="size-4" />
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalComparison;
