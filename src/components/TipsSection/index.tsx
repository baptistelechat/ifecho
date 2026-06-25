import { useState, useEffect, useRef } from "react";
import analytics from "@/hooks/useAnalytics";
import useOnceVisible from "@/hooks/useOnceVisible";
import { useHaptics } from "@/hooks/useHaptics";
import {
  Sun,
  Clock,
  Layers,
  Moon,
  Droplets,
  Lightbulb,
  Wind,
  Zap,
  Compass,
  Footprints,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { m } from "framer-motion";
import { cn } from "@/lib/utils";
import { TIPS } from "@/data/tips";

const TIP_ICONS: Record<string, LucideIcon> = {
  "rule-500w": Sun,
  "volets-avant-10h": Clock,
  "store-interieur-inutile": Layers,
  "ventilation-nocturne": Moon,
  "bouteille-fraiche": Droplets,
  "ventilateur-eau": Wind,
  "appareils-electriques": Zap,
  "pieces-fraiches": Compass,
  "sol-frais": Footprints,
  "draps-humides": BedDouble,
};

const AUTO_DELAY = 4000;
const RESUME_DELAY = 6000;
const SWIPE_THRESHOLD = 50;

const TipsSection = () => {
  const haptics = useHaptics();
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dragStartX = useRef(0);
  const sectionRef = useOnceVisible<HTMLDivElement>(() => {
    analytics.sectionViewed({ section_id: "tips_section" });
  });

  const pauseTemporarily = () => {
    setIsPaused(true);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setIsPaused(false), RESUME_DELAY);
  };

  const togglePause = () => {
    if (resumeRef.current) clearTimeout(resumeRef.current);
    setIsPaused((prev) => {
      analytics.tipsCarouselToggled({ state: prev ? "playing" : "paused" });
      return !prev;
    });
  };

  const prev = () => {
    haptics.nudge();
    pauseTemporarily();
    const nextIndex = (index - 1 + TIPS.length) % TIPS.length;
    analytics.tipNavigated({
      tipId: TIPS[nextIndex].id,
      direction: "swipe-left",
    });
    setIndex(nextIndex);
  };

  const next = () => {
    haptics.nudge();
    pauseTemporarily();
    const nextIndex = (index + 1) % TIPS.length;
    analytics.tipNavigated({
      tipId: TIPS[nextIndex].id,
      direction: "swipe-right",
    });
    setIndex(nextIndex);
  };

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setIndex((p) => (p + 1) % TIPS.length);
    }, AUTO_DELAY);
    return () => clearInterval(timer);
  }, [isPaused]);

  useEffect(() => {
    return () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
    pauseTemporarily();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const delta = e.clientX - dragStartX.current;
    if (delta < -SWIPE_THRESHOLD) next();
    else if (delta > SWIPE_THRESHOLD) prev();
  };

  return (
    <div ref={sectionRef} className="space-y-3">
      <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        <Lightbulb className="size-3.5" />
        Conseils canicule
      </p>

      <div
        className="overflow-hidden rounded-xl select-none cursor-grab active:cursor-grabbing [touch-action:pan-y]"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <m.div
          className="flex"
          animate={{ x: `-${index * 100}%` }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {TIPS.map((tip) => {
            const Icon = TIP_ICONS[tip.id] ?? Lightbulb;
            return (
              <div
                key={tip.id}
                className="min-w-full flex gap-3 rounded-xl border p-3.5 border-border bg-card"
              >
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {tip.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {tip.body}
                  </p>
                </div>
              </div>
            );
          })}
        </m.div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          aria-label="Conseil précédent"
          onClick={prev}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {TIPS.map((t, i) => (
            <button
              type="button"
              key={t.id}
              aria-label={`Conseil ${i + 1} : ${t.title}`}
              onClick={() => {
                haptics.nudge();
                pauseTemporarily();
                analytics.tipNavigated({ tipId: t.id, direction: "dot" });
                setIndex(i);
              }}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-4 bg-ember" : "w-1.5 bg-muted-foreground/30",
              )}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Conseil suivant"
          onClick={next}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>

        <div className="w-px h-3 bg-border mx-1" />

        <button
          type="button"
          aria-label={isPaused ? "Reprendre le défilement" : "Mettre en pause"}
          onClick={togglePause}
          className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          {isPaused ? (
            <Pause className="size-3" />
          ) : (
            <Play className="size-3" />
          )}
        </button>
      </div>
    </div>
  );
};

export default TipsSection;
