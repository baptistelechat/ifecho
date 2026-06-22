import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Download, Share, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const InstallButton = () => {
  const { canInstall, isIos, isStandalone, install } = useInstallPrompt();
  const [showHint, setShowHint] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showHint) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowHint(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showHint]);

  if (isStandalone || (!canInstall && !isIos)) return null;

  const handleClick = async () => {
    if (isIos) {
      setShowHint((prev) => !prev);
      return;
    }
    await install();
  };

  return (
    <div className="absolute right-4 top-4" ref={containerRef}>
      <button
        type="button"
        onClick={handleClick}
        aria-label="Installer l'application sur votre écran d'accueil"
        aria-expanded={isIos ? showHint : undefined}
        className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-sm transition-all hover:border-ember hover:text-ember active:scale-95"
      >
        {isIos ? (
          <Share className="size-3.5" />
        ) : (
          <Download className="size-3.5" />
        )}
        <span>Installer</span>
      </button>

      {isIos && showHint && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-card p-3 shadow-lg">
          <button
            type="button"
            onClick={() => setShowHint(false)}
            aria-label="Fermer"
            className="absolute right-2 top-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3.5" />
          </button>
          <p className="pr-4 text-xs leading-relaxed text-foreground">
            Dans Safari, appuyez sur{" "}
            <Share className="mx-0.5 inline size-3.5 align-text-bottom text-[#007AFF]" />{" "}
            puis <strong>«&nbsp;Sur l'écran d'accueil&nbsp;»</strong>.
          </p>
        </div>
      )}
    </div>
  );
};

export default InstallButton;
