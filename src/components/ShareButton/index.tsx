import useAnalytics from "@/hooks/useAnalytics";
import type { HourlyScore } from "@/types";
import { Share2 } from "lucide-react";
import { useState } from "react";

interface ShareButtonProps {
  currentScore?: HourlyScore | null;
}

const SHARE_TEXT =
  "Ifecho m'a conseillé d'aérer mon logement aujourd'hui 🌡️ Et toi, tu sais quand ouvrir tes fenêtres ?";

const getVerdictKey = (score: number): "good" | "neutral" | "wait" | "bad" => {
  if (score > 2) return "good";
  if (score > 0) return "neutral";
  if (score >= -2) return "wait";
  return "bad";
};

const buildShareUrl = (method: "native" | "clipboard"): string => {
  const url = new URL(window.location.origin);
  url.searchParams.set("utm_source", "share");
  url.searchParams.set("utm_medium", method);
  url.searchParams.set("utm_campaign", "share_button");
  return url.toString();
};

const ShareButton = ({ currentScore }: ShareButtonProps) => {
  const analytics = useAnalytics();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const isNative = Boolean(navigator.share);
    const url = buildShareUrl(isNative ? "native" : "clipboard");
    const verdict = currentScore ? getVerdictKey(currentScore.score) : null;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Ifecho — Bien vivre la chaleur",
          text: SHARE_TEXT,
          url,
        });
        analytics.appShared({ verdict, method: "native" });
      } else {
        await navigator.clipboard.writeText(`${SHARE_TEXT}\n${url}`);
        analytics.appShared({ verdict, method: "clipboard" });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // share annulé ou refusé
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label="Partager l'application Ifecho"
      className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-stone-600 shadow-sm transition-all hover:border-ember hover:text-ember active:scale-95"
    >
      <Share2 className="size-3.5" />
      <span>{copied ? "Copié !" : "Partager"}</span>
    </button>
  );
};

export default ShareButton;
