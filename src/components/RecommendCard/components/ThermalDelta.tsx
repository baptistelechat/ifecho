import analytics from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";
import { Ban, CheckCircle, Clock, Wind } from "lucide-react";
import { useEffect, useRef } from "react";

interface ThermalDeltaProps {
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

  if (s >= 4)
    return {
      key: "good",
      Icon: CheckCircle,
      title: "Aérez maintenant",
      message:
        "Extérieur nettement plus frais - excellent moment pour ventiler.",
    };
  if (s > 2)
    return {
      key: "good",
      Icon: Wind,
      title: "Bon moment pour aérer",
      message:
        hourlyScore.uvPenalty > 0
          ? "Écart favorable malgré l'ensoleillement."
          : "Bon moment pour ventiler.",
    };
  if (s > 0)
    return {
      key: "neutral",
      Icon: Wind,
      title: "Légèrement bénéfique",
      message: "Aérer renouvelle l'air sans vraiment refroidir.",
    };
  if (s < -2)
    return {
      key: "bad",
      Icon: Ban,
      title: "Ne pas aérer",
      message:
        "L'extérieur est plus chaud - ouvrir les fenêtres réchaufferait votre intérieur.",
    };
  if (s <= 0)
    return {
      key: "wait",
      Icon: Clock,
      title: "Patientez",
      message: "Extérieur légèrement plus chaud - attendez ce soir.",
    };
  return {
    key: "neutral",
    Icon: Wind,
    title: "Températures égales",
    message:
      "Pas d'avantage thermique - aérez quelques minutes pour renouveler l'air.",
  };
};

const verdictStyles: Record<
  VerdictKey,
  { bar: string; iconColor: string; titleColor: string; textColor: string }
> = {
  good: {
    bar: "bg-verdict-good",
    iconColor: "text-verdict-good",
    titleColor: "text-green-800",
    textColor: "text-green-700",
  },
  neutral: {
    bar: "bg-verdict-wait",
    iconColor: "text-verdict-wait",
    titleColor: "text-amber-800",
    textColor: "text-amber-700",
  },
  wait: {
    bar: "bg-verdict-wait",
    iconColor: "text-verdict-wait",
    titleColor: "text-amber-800",
    textColor: "text-amber-700",
  },
  bad: {
    bar: "bg-verdict-bad",
    iconColor: "text-verdict-bad",
    titleColor: "text-red-800",
    textColor: "text-red-700",
  },
};

const MAX_DELTA = 15;

const ThermalDelta = ({ currentScore }: ThermalDeltaProps) => {
  const verdict = getVerdict(currentScore);
  const styles = verdictStyles[verdict.key];
  const { Icon } = verdict;
  const delta = currentScore.deltaT;
  const absD = Math.abs(delta);
  const barWidth = Math.min((absD / MAX_DELTA) * 100, 100);
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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon className={cn("size-3.5 shrink-0", styles.iconColor)} />
          <p className={cn("text-sm font-bold", styles.titleColor)}>
            {verdict.title}
          </p>
        </div>
        <span
          className={cn("tabular-nums text-sm font-bold", styles.iconColor)}
        >
          {delta > 0 ? "↓" : "↑"} {absD.toFixed(1)}°C
        </span>
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full", styles.bar)}
          style={{
            width: `${barWidth}%`,
            transition:
              "width 300ms cubic-bezier(0.23, 1, 0.32, 1), background-color 200ms ease-out",
          }}
        />
      </div>

      <p className={cn("mt-2 text-xs leading-relaxed", styles.textColor)}>
        {verdict.message}
      </p>
    </div>
  );
};

export default ThermalDelta;
