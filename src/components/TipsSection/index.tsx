import { Sun, Clock, Layers, Moon, Droplets, Lightbulb } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TIPS } from "@/data/tips";

const TIP_ICONS: Record<string, LucideIcon> = {
  "rule-500w": Sun,
  "volets-avant-10h": Clock,
  "store-interieur-inutile": Layers,
  "ventilation-nocturne": Moon,
  "bouteille-fraiche": Droplets,
};

const TipsSection = () => {
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <Lightbulb className="size-3.5" />
        Conseils canicule
      </p>

      <div className="space-y-2">
        {TIPS.map((tip) => {
          const Icon = TIP_ICONS[tip.id] ?? Lightbulb;
          return (
            <div
              key={tip.id}
              className={cn(
                "flex gap-3 rounded-xl border p-3.5",
                tip.urgent
                  ? "border-ember/30 bg-ember/8"
                  : "border-border bg-card",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  tip.urgent ? "text-ember" : "text-muted-foreground",
                )}
              />
              <div>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    tip.urgent ? "text-ember" : "text-foreground",
                  )}
                >
                  {tip.title}
                </p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {tip.body}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TipsSection;
