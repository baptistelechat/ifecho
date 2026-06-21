import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { COMFORT_LEVELS, type ComfortLevel, type HourlyScore } from "@/types";
import { Cloud, Droplets, Home, Sun, Thermometer, Wind } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ThermalComparisonProps {
  currentScore: HourlyScore;
  indoorTemp: number;
  onTempChange: (value: number) => void;
  comfortLevel: ComfortLevel;
  onComfortChange: (level: ComfortLevel) => void;
}

const comfortEntries = Object.entries(COMFORT_LEVELS) as Array<
  [ComfortLevel, { emoji: string; label: string; bias: number }]
>;

const ThermalComparison = ({
  currentScore,
  indoorTemp,
  onTempChange,
  comfortLevel,
  onComfortChange,
}: ThermalComparisonProps) => {
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
      </div>

      {/* Intérieur */}
      <div className="p-4">
        <div className="mb-3 flex items-center gap-1.5">
          <Home className="size-3.5 text-ember" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Intérieur
          </p>
        </div>
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
              onClick={startEditing}
              className="cursor-text p-0 transition-opacity hover:opacity-70"
              aria-label={`Température intérieure ${indoorTemp}°. Cliquer pour modifier.`}
            >
              {indoorTemp}°
            </button>
          )}
        </div>
        <div className="mt-3 space-y-1">
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Thermometer className="size-3 shrink-0 text-ember/70" />
            Ressenti ~{feltIndoorTemp}°
          </p>
        </div>
        <div className="mt-2">
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
          {/* Ressenti intérieur */}
          <div className="mt-2 flex justify-center gap-2">
            {comfortEntries.map(([key, level]) => (
              <Button
                key={key}
                variant={comfortLevel === key ? "default" : "outline"}
                size="icon"
                onClick={() => onComfortChange(key)}
                aria-pressed={comfortLevel === key}
                aria-label={level.label}
              >
                <span className="text-lg">{level.emoji}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThermalComparison;
