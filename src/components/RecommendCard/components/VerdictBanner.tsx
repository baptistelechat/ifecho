import { cn } from "@/lib/utils";
import type { HourlyScore } from "@/types";
import { Ban, CheckCircle, Clock, Wind } from "lucide-react";

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

const getVerdict = (score: HourlyScore): Verdict => {
  const delta = score.deltaT;

  if (delta >= 4) {
    return {
      key: "good",
      Icon: CheckCircle,
      title: "Aérez maintenant",
      message: `L'extérieur est ${delta.toFixed(1)}°C plus frais - excellent moment pour ventiler.`,
    };
  }
  if (delta >= 1) {
    return {
      key: "neutral",
      Icon: Wind,
      title: "Légèrement bénéfique",
      message: `Écart de ${delta.toFixed(1)}°C - aérer renouvelle l'air sans refroidir vraiment.`,
    };
  }
  if (delta < -3) {
    return {
      key: "bad",
      Icon: Ban,
      title: "Ne pas aérer",
      message: `L'extérieur est ${Math.abs(delta).toFixed(1)}°C plus chaud. Ouvrir les fenêtres réchaufferait votre intérieur.`,
    };
  }
  if (delta < 0) {
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

  return (
    <div className={cn("rounded-2xl border p-4", config.border, config.bg)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 size-4 shrink-0", config.iconColor)} />
        <div className="flex-1">
          <p className={cn("text-sm font-bold", config.titleColor)}>
            {verdict.title}
          </p>
          <p className={cn("mt-0.5 text-sm leading-relaxed", config.textColor)}>
            {verdict.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerdictBanner;
