import { useState } from "react";
import { cn } from "@/lib/utils";
import { INDOOR_TEMP_PRESETS, type IndoorTempPreset } from "@/types";

interface TempSelectorProps {
  value: number;
  onChange: (value: number) => void;
}

const TempSelector = ({ value, onChange }: TempSelectorProps) => {
  const [mode, setMode] = useState<"buttons" | "manual">("buttons");
  const [manualInput, setManualInput] = useState(() => value.toString());

  const activePreset = Object.entries(INDOOR_TEMP_PRESETS).find(
    ([, preset]) => preset.value === value,
  )?.[0] as IndoorTempPreset | undefined;

  const handlePreset = (preset: IndoorTempPreset) => {
    onChange(INDOOR_TEMP_PRESETS[preset].value);
    setManualInput(INDOOR_TEMP_PRESETS[preset].value.toString());
    setMode("buttons");
  };

  const handleManualChange = (raw: string) => {
    setManualInput(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed) && parsed >= 10 && parsed <= 50) {
      onChange(parsed);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
          🏠 Température intérieure
        </p>
        <button
          type="button"
          className="text-[11px] text-muted-foreground hover:text-sky transition-colors"
          onClick={() => {
            const next = mode === "buttons" ? "manual" : "buttons";
            setMode(next);
            if (next === "manual") setManualInput(value.toString());
          }}
        >
          {mode === "buttons" ? "Saisir °C" : "Boutons"}
        </button>
      </div>

      {mode === "buttons" ? (
        <div className="grid grid-cols-3 gap-2">
          {(
            Object.entries(INDOOR_TEMP_PRESETS) as [
              IndoorTempPreset,
              (typeof INDOOR_TEMP_PRESETS)[IndoorTempPreset],
            ][]
          ).map(([key, preset]) => (
            <button
              type="button"
              key={key}
              onClick={() => handlePreset(key)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl border py-3 transition-all",
                activePreset === key
                  ? "border-ember/50 bg-ember/10 text-ember"
                  : "border-border bg-secondary text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <span className="text-xl">{preset.emoji}</span>
              <span className="text-[11px] font-semibold">{preset.label}</span>
              <span className="text-[10px] opacity-60">{preset.value}°C</span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={10}
            max={50}
            step={0.5}
            value={manualInput}
            onChange={(e) => handleManualChange(e.target.value)}
            aria-label="Température intérieure en degrés Celsius"
            className="w-28 rounded-xl bg-secondary border border-border px-3 py-2.5 text-center text-lg font-bold text-foreground focus:outline-none focus:border-sky/50 focus:ring-1 focus:ring-sky/30 transition-colors"
          />
          <span className="text-lg font-semibold text-muted-foreground">
            °C
          </span>
        </div>
      )}
    </div>
  );
};

export default TempSelector;
