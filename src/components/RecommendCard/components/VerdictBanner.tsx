import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";
import { AnimatePresence, m } from "framer-motion";
import { Ban, CheckCircle, Clock, Wind } from "lucide-react";
import analytics from "@/lib/analytics";
import { useEffect, useRef } from "react";

interface VerdictBannerProps {
  currentScore: HourlyScore;
}

type VerdictKey = "good" | "wait" | "bad" | "neutral";

interface Verdict {
  key: VerdictKey;
  Icon: React.ElementType;
  title: string;
  message: string;
}

const getVerdict = (hourlyScore: HourlyScore): Verdict => {
  const s = hourlyScore.score;
  const delta = hourlyScore.deltaT;

  if (s >= 4) {
    return {
      key: "good",
      Icon: CheckCircle,
      title: "Aérez maintenant",
      message: `L'extérieur est ${delta.toFixed(1)}°C plus frais - excellent moment pour ventiler.`,
    };
  }
  if (s > 2) {
    return {
      key: "good",
      Icon: Wind,
      title: "Bon moment pour aérer",
      message:
        hourlyScore.uvPenalty > 0
          ? `Écart de ${delta.toFixed(1)}°C  favorable malgré l'ensoleillement.`
          : `Écart de ${delta.toFixed(1)}°C  bon moment pour ventiler.`,
    };
  }
  if (s > 0) {
    return {
      key: "neutral",
      Icon: Wind,
      title: "Légèrement bénéfique",
      message: `Écart de ${delta.toFixed(1)}°C - aérer renouvelle l'air sans refroidir vraiment.`,
    };
  }
  if (s < -2) {
    return {
      key: "bad",
      Icon: Ban,
      title: "Ne pas aérer",
      message: `L'extérieur est ${Math.abs(delta).toFixed(1)}°C plus chaud. Ouvrir les fenêtres réchaufferait votre intérieur.`,
    };
  }
  if (s <= 0) {
    return {
      key: "wait",
      Icon: Clock,
      title: "Patientez",
      message: `Extérieur légèrement plus chaud (${Math.abs(delta).toFixed(1)}°C) - attendez ce soir.`,
    };
  }
  return {
    key: "neutral",
    Icon: Wind,
    title: "Températures égales",
    message:
      "Pas d'avantage thermique. Aérez quelques minutes pour renouveler l'air.",
  };
};

const verdictConfig: Record<
  VerdictKey,
  {
    dot: string;
    border: string;
    bg: string;
    iconColor: string;
    titleColor: string;
    textColor: string;
  }
> = {
  good: {
    dot: "bg-verdict-good",
    border: "border-green-200",
    bg: "bg-green-50",
    iconColor: "text-verdict-good",
    titleColor: "text-green-800",
    textColor: "text-green-700",
  },
  neutral: {
    dot: "bg-ember",
    border: "border-orange-200",
    bg: "bg-orange-50",
    iconColor: "text-ember",
    titleColor: "text-orange-800",
    textColor: "text-orange-700",
  },
  wait: {
    dot: "bg-verdict-wait",
    border: "border-amber-200",
    bg: "bg-amber-50",
    iconColor: "text-verdict-wait",
    titleColor: "text-amber-800",
    textColor: "text-amber-700",
  },
  bad: {
    dot: "bg-verdict-bad",
    border: "border-red-200",
    bg: "bg-red-50",
    iconColor: "text-verdict-bad",
    titleColor: "text-red-800",
    textColor: "text-red-700",
  },
};

const VerdictBanner = ({ currentScore }: VerdictBannerProps) => {
  const verdict = getVerdict(currentScore);
  const config = verdictConfig[verdict.key];
  const { Icon } = verdict;
  const isFirstRender = useRef(true);

  useEffect(() => {
    const payload = {
      verdict: verdict.key,
      score: currentScore.score,
      delta_t: currentScore.deltaT,
    };
    if (isFirstRender.current) {
      analytics.verdictSeen(payload);
      isFirstRender.current = false;
    } else {
      analytics.verdictUpdated(payload);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verdict.key]);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={verdict.title}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={cn(
          "min-h-[6.5rem] rounded-2xl border p-4",
          config.border,
          config.bg,
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn("mt-0.5 size-4 shrink-0", config.iconColor)} />
          <div className="flex-1">
            <p className={cn("text-sm font-bold", config.titleColor)}>
              {verdict.title}
            </p>
            <p
              className={cn("mt-0.5 text-sm leading-relaxed", config.textColor)}
            >
              {verdict.message}
            </p>
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
};

export default VerdictBanner;
