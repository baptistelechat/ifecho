import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, Navigation, Locate } from "lucide-react";
import { searchCommunes } from "@/hooks/useLocation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHaptics } from "@/hooks/useHaptics";
import analytics from "@/hooks/useAnalytics";
import type { CommuneResult, GeoLocation } from "@/types";

interface LocationSearchProps {
  location: GeoLocation | null;
  isDetecting: boolean;
  error: string | null;
  onDetect: () => void;
  onSelect: (commune: CommuneResult) => void;
}

const getLocationLabel = (location: GeoLocation | null): string => {
  if (!location) return "Entrez votre ville";
  if (location.source === "gps") {
    const hasCity = location.city && location.city !== "Votre position";
    return hasCity ? `Votre position (${location.city})` : "Votre position";
  }
  const dept =
    location.department && location.department !== location.city
      ? `, ${location.department}`
      : "";
  return `${location.city}${dept}`;
};

const LocationSearch = ({
  location,
  isDetecting,
  error,
  onDetect,
  onSelect,
}: LocationSearchProps) => {
  const haptics = useHaptics();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CommuneResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevErrorRef = useRef<string | null>(null);
  const hapticsErrorRef = useRef(haptics.error);
  hapticsErrorRef.current = haptics.error;
  const queryRef = useRef(query);
  queryRef.current = query;

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const communes = await searchCommunes(query);
        setResults(communes);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (error && !prevErrorRef.current) hapticsErrorRef.current();
    prevErrorRef.current = error;
  }, [error]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        if (queryRef.current.length >= 2) {
          analytics.locationSearchAbandoned({
            query_length: queryRef.current.length,
          });
        }
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDetect = () => {
    haptics.nudge();
    onDetect();
  };

  const handleSelect = (commune: CommuneResult) => {
    haptics.success();
    onSelect(commune);
    setQuery("");
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5 text-ember" />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-600">
            {getLocationLabel(location)}
          </p>
        </div>
        {!isDetecting && location?.source !== "gps" && (
          <Button
            type="button"
            variant="link"
            onClick={handleDetect}
            className="h-auto p-0 text-[10px] font-semibold uppercase tracking-widest text-heat-700"
          >
            <Locate className="!size-3" />
            Me localiser
          </Button>
        )}
      </div>

      <div ref={containerRef} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              aria-label="Rechercher une ville"
              placeholder="Paris, Lyon, Bordeaux…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pr-8"
            />
            {isSearching && (
              <Loader2 className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          <Button
            type="button"
            size="icon"
            onClick={handleDetect}
            disabled={isDetecting}
            aria-label="Détecter ma position GPS"
            className="shrink-0"
          >
            {isDetecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Navigation className="size-4" />
            )}
          </Button>
        </div>

        {showResults && results.length > 0 && (
          <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg shadow-slate-900/10">
            {results.map((commune) => (
              <li key={`${commune.city}-${commune.departmentCode}`}>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-auto w-full justify-start rounded-none px-3 py-2.5 text-sm hover:bg-secondary"
                  onClick={() => handleSelect(commune)}
                >
                  <MapPin className="size-3 shrink-0 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {commune.city}
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {commune.departmentCode}
                  </span>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-xs text-verdict-bad">{error}</p>}
    </div>
  );
};

export default LocationSearch;
