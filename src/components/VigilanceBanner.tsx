import { Button } from "@/components/ui/button";
import { CloudLightningIcon } from "@/components/ui/cloud-lightning";
import { CloudRainWindIcon } from "@/components/ui/cloud-rain-wind";
import { DropletIcon } from "@/components/ui/droplet";
import { ThermometerIcon } from "@/components/ui/thermometer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { WavesIcon } from "@/components/ui/waves";
import { WindIcon } from "@/components/ui/wind";
import type { VigilanceItem } from "@/types";
import { ExternalLink, TriangleAlert } from "lucide-react";
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import { useEffect, useRef } from "react";

// Interface commune à tous les handles lucide-animated
interface AnimHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type AnimIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & { size?: number } & RefAttributes<AnimHandle>
>;

// --- Constants ---

const COLOR_PRIORITY: Record<string, number> = {
  rouge: 3,
  orange: 2,
  jaune: 1,
};

const ICON_COLOR: Record<string, string> = {
  rouge: "text-red-500",
  orange: "text-orange-500",
  jaune: "text-yellow-500",
  vert: "text-green-500 opacity-60",
};

const TRIANGLE_COLOR: Record<string, string> = {
  rouge: "text-red-500",
  orange: "text-orange-500",
  jaune: "text-yellow-500",
};

const DOT_BG: Record<string, string> = {
  rouge: "bg-red-500",
  orange: "bg-orange-500",
  jaune: "bg-yellow-500",
  vert: "bg-green-400",
};

const COLOR_LABEL: Record<string, string> = {
  rouge: "Rouge",
  orange: "Orange",
  jaune: "Jaune",
  vert: "Vert",
};

const PHENOMENON_ICON: Record<string, AnimIcon> = {
  canicule: ThermometerIcon as unknown as AnimIcon,
  orages: CloudLightningIcon as unknown as AnimIcon,
  "vent violent": WindIcon as unknown as AnimIcon,
  "pluie-inondation": CloudRainWindIcon as unknown as AnimIcon,
  inondations: DropletIcon as unknown as AnimIcon,
  "vagues-submersion": WavesIcon as unknown as AnimIcon,
};

const PHENOMENON_LABEL: Record<string, string> = {
  canicule: "Canicule",
  orages: "Orages",
  "vent violent": "Vent",
  "pluie-inondation": "Pluie",
  inondations: "Inondations",
  "vagues-submersion": "Submersion",
};

// --- Helpers ---

const getHighestColor = (items: VigilanceItem[]): string =>
  items.reduce(
    (acc, v) =>
      (COLOR_PRIORITY[v.color] ?? 0) > (COLOR_PRIORITY[acc] ?? 0)
        ? v.color
        : acc,
    "jaune",
  );

const getActiveColor = (today: VigilanceItem[]): string => {
  if (today.length === 0) return "vert";
  const now = new Date();
  const active = today.find(
    (item) => new Date(item.begin_time) <= now && now < new Date(item.end_time),
  );
  if (active) return active.color;
  const upcoming = today.find((item) => new Date(item.begin_time) > now);
  // ponytail: if all windows passed, keep highest color seen today - icon stays colored
  return upcoming?.color ?? getHighestColor(today);
};

type PhenomenonGroup = { j: VigilanceItem[]; j1: VigilanceItem[] };

const getPhenomenaGroups = (
  items: VigilanceItem[],
): Map<string, PhenomenonGroup> => {
  const map = new Map<string, PhenomenonGroup>();
  for (const item of items) {
    const group = map.get(item.phenomenon) ?? { j: [], j1: [] };
    if (item.echeance === "J") group.j.push(item);
    else group.j1.push(item);
    map.set(item.phenomenon, group);
  }
  for (const group of map.values()) {
    const byTime = (a: VigilanceItem, b: VigilanceItem) =>
      new Date(a.begin_time).getTime() - new Date(b.begin_time).getTime();
    group.j.sort(byTime);
    group.j1.sort(byTime);
  }
  return map;
};

const formatHour = (iso: string) => {
  const formatted = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
  const [h, m] = formatted.split(":");
  return m === "00" ? `${h}h` : `${h}h${m}`;
};

const toSlug = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// --- Sub-components ---

// Animation auto en boucle : joue l'animation, pause, recommence
const ANIM_PLAY_MS = 1600;
const ANIM_PAUSE_MS = 2500;

const LoopIcon = ({
  Icon,
  size,
  className,
}: {
  Icon: AnimIcon;
  size: number;
  className: string;
}) => {
  const ref = useRef<AnimHandle>(null);

  useEffect(() => {
    let playTimer: ReturnType<typeof setTimeout>;
    let pauseTimer: ReturnType<typeof setTimeout>;

    const cycle = () => {
      ref.current?.startAnimation();
      playTimer = setTimeout(() => {
        ref.current?.stopAnimation();
        pauseTimer = setTimeout(cycle, ANIM_PAUSE_MS);
      }, ANIM_PLAY_MS);
    };

    cycle();

    return () => {
      clearTimeout(playTimer);
      clearTimeout(pauseTimer);
    };
  }, []);

  return <Icon ref={ref} size={size} className={className} />;
};

const ColorBar = ({
  color,
  className,
}: {
  color: string;
  className: string;
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div className={`${DOT_BG[color]} ${className}`} />
    </TooltipTrigger>
    <TooltipContent>{COLOR_LABEL[color]}</TooltipContent>
  </Tooltip>
);

const AlertLevels = ({
  items,
  isToday,
}: {
  items: VigilanceItem[];
  isToday?: boolean;
}) => {
  if (items.length === 0) {
    return isToday ? (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex w-full px-0.5">
            <div className="h-1.5 w-full rounded-full bg-green-400 opacity-70" />
          </div>
        </TooltipTrigger>
        <TooltipContent>{COLOR_LABEL.vert}</TooltipContent>
      </Tooltip>
    ) : (
      <span className="text-center text-[9px] leading-tight text-muted-foreground opacity-40">
        Indisponible
      </span>
    );
  }

  const first = items[0];
  const last = items[items.length - 1];
  // N'afficher la barre bicolore que si les niveaux sont réellement différents
  const hasTransition = first.color !== last.color;

  if (!hasTransition) {
    return (
      <div className="flex w-full px-0.5">
        <ColorBar color={first.color} className="h-1.5 w-full rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex w-full items-center px-0.5">
      <ColorBar color={first.color} className="h-1.5 flex-1 rounded-l-full" />
      <span className="shrink-0 px-1 text-[10px] leading-none text-muted-foreground">
        {formatHour(last.begin_time)}
      </span>
      <ColorBar color={last.color} className="h-1.5 flex-1 rounded-r-full" />
    </div>
  );
};

const DayCell = ({
  items,
  label,
  isToday,
}: {
  items: VigilanceItem[];
  label: string;
  isToday?: boolean;
}) => (
  <div className="flex flex-1 flex-col items-center gap-1 px-1 py-2">
    <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
      {label}
    </span>
    <AlertLevels items={items} isToday={isToday} />
  </div>
);

// --- Main component ---

interface VigilanceBannerProps {
  vigilances: VigilanceItem[];
  departmentName?: string;
}

const VigilanceBanner = ({
  vigilances,
  departmentName,
}: VigilanceBannerProps) => {
  if (vigilances.length === 0) return null;

  const topColor = getHighestColor(vigilances);
  const groups = getPhenomenaGroups(vigilances);

  const vigilanceUrl = departmentName
    ? `https://vigilance.meteofrance.fr/fr/${toSlug(departmentName)}`
    : "https://vigilance.meteofrance.fr";

  const allJItems = [...groups.values()].flatMap((g) => g.j);
  const bulletinStale =
    allJItems.length > 0 &&
    allJItems.every((item) => new Date(item.end_time) <= new Date());
  const PHENOMENON_ORDER: Record<string, number> = {
    canicule: 0,
    orages: 1,
    "vent violent": 2,
    "pluie-inondation": 3,
    inondations: 4,
    "vagues-submersion": 5,
  };
  const maxColor = (g: PhenomenonGroup) =>
    Math.max(0, ...[...g.j, ...g.j1].map((i) => COLOR_PRIORITY[i.color] ?? 0));
  const entries = [...groups.entries()]
    .filter(([p]) => PHENOMENON_ICON[p])
    .sort(([a, ga], [b, gb]) => {
      const d = maxColor(gb) - maxColor(ga);
      return d !== 0
        ? d
        : (PHENOMENON_ORDER[a] ?? 99) - (PHENOMENON_ORDER[b] ?? 99);
    });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <TriangleAlert
            className={`size-3.5 shrink-0 ${TRIANGLE_COLOR[topColor]}`}
          />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Vigilance météo
          </span>
        </div>
        {departmentName && (
          <span className="ml-2 truncate text-[10px] font-medium text-muted-foreground opacity-60">
            {departmentName}
          </span>
        )}
      </div>

      {/* Body - grille 2 colonnes */}
      <div className="px-3">
        <div className="grid grid-cols-2">
          {entries.map(([phenomenon, { j, j1 }], index) => {
            const Icon = PHENOMENON_ICON[phenomenon];
            const todayItems = bulletinStale ? j1 : j;
            const tomorrowItems = bulletinStale ? [] : j1;
            const iconColor = getActiveColor(todayItems);
            const spanFull =
              entries.length % 2 === 1 && index === entries.length - 1;
            const lastRowStart =
              entries.length % 2 === 0
                ? entries.length - 2
                : entries.length - 1;
            const borderR =
              !spanFull && index % 2 === 0 ? " border-r border-border" : "";
            const borderB =
              index < lastRowStart ? " border-b border-border" : "";
            return (
              <div
                key={phenomenon}
                className={`flex flex-col justify-between pt-2${borderR}${borderB}${spanFull ? " col-span-2" : ""}`}
              >
                <span className="px-2 text-xs font-semibold leading-tight text-foreground">
                  {PHENOMENON_LABEL[phenomenon] ?? phenomenon}
                  {" : "}
                  <span className={ICON_COLOR[iconColor]}>
                    {COLOR_LABEL[iconColor]}
                  </span>
                </span>
                {spanFull ? (
                  /* Lone card : icon gauche | jours droits empilés */
                  <div className="flex">
                    <div className="flex flex-1 items-center justify-center">
                      <LoopIcon
                        Icon={Icon}
                        size={60}
                        className={ICON_COLOR[iconColor]}
                      />
                    </div>
                    <div className="flex flex-1 flex-col">
                      <DayCell items={todayItems} label="Aujourd'hui" isToday />
                      <DayCell items={tomorrowItems} label="Demain" />
                    </div>
                  </div>
                ) : (
                  /* Carte normale : icon centré + jours en bas */
                  <>
                    <div className="flex items-center justify-center py-3">
                      <LoopIcon
                        Icon={Icon}
                        size={60}
                        className={ICON_COLOR[iconColor]}
                      />
                    </div>
                    <div className="flex w-full divide-x divide-border">
                      <DayCell items={todayItems} label="Aujourd'hui" isToday />
                      <DayCell items={tomorrowItems} label="Demain" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer global */}
      <div className="flex justify-end px-4 py-2">
        <Button
          variant="link"
          size="sm"
          className="h-auto gap-1 p-0 text-xs font-semibold opacity-60 hover:opacity-100"
          asChild
        >
          <a href={vigilanceUrl} target="_blank" rel="noopener noreferrer">
            En savoir plus
            <ExternalLink className="size-3" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default VigilanceBanner;
