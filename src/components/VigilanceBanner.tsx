import { TriangleAlert } from "lucide-react";
import type { VigilanceItem } from "@/types";

const COLOR_PRIORITY: Record<string, number> = {
  rouge: 3,
  orange: 2,
  jaune: 1,
};

const BANNER_STYLE: Record<string, string> = {
  rouge: "bg-red-50 border-red-300 text-red-900",
  orange: "bg-orange-50 border-orange-300 text-orange-900",
  jaune: "bg-yellow-50 border-yellow-300 text-yellow-900",
};

const BADGE_STYLE: Record<string, string> = {
  rouge: "bg-red-200 text-red-900",
  orange: "bg-orange-200 text-orange-900",
  jaune: "bg-yellow-200 text-yellow-900",
};

const getHighestColor = (items: VigilanceItem[]): string =>
  items.reduce(
    (acc, v) =>
      (COLOR_PRIORITY[v.color] ?? 0) > (COLOR_PRIORITY[acc] ?? 0)
        ? v.color
        : acc,
    "jaune",
  );

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface VigilanceBannerProps {
  vigilances: VigilanceItem[];
}

const VigilanceBanner = ({ vigilances }: VigilanceBannerProps) => {
  if (vigilances.length === 0) return null;

  const today = vigilances.filter((v) => v.echeance === "J");
  const tomorrow = vigilances.filter((v) => v.echeance === "J1");
  const topColor = getHighestColor(vigilances);

  return (
    <div
      className={`rounded-2xl border p-3 shadow-sm ${BANNER_STYLE[topColor]}`}
    >
      <div className="flex items-start gap-2">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" />
        <div className="flex flex-col gap-1.5 text-xs">
          <span className="font-semibold text-sm">Vigilances météo</span>
          {today.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium">Aujourd'hui :</span>
              {today.map((v) => (
                <span
                  key={v.phenomenon}
                  className={`rounded px-1.5 py-0.5 font-medium ${BADGE_STYLE[v.color]}`}
                >
                  {capitalize(v.phenomenon)}
                </span>
              ))}
            </div>
          )}
          {tomorrow.length > 0 && (
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium">Demain :</span>
              {tomorrow.map((v) => (
                <span
                  key={v.phenomenon}
                  className={`rounded px-1.5 py-0.5 font-medium ${BADGE_STYLE[v.color]}`}
                >
                  {capitalize(v.phenomenon)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VigilanceBanner;
