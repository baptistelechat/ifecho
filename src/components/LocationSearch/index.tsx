import { useState, useEffect, useRef } from "react";
import { MapPin, Loader2, Navigation } from "lucide-react";
import { searchCommunes } from "@/hooks/useLocation";
import type { CommuneResult, GeoLocation } from "@/types";

interface LocationSearchProps {
  location: GeoLocation | null;
  isDetecting: boolean;
  error: string | null;
  onDetect: () => void;
  onSelect: (commune: CommuneResult) => void;
}

const LocationSearch = ({
  location,
  isDetecting,
  error,
  onDetect,
  onSelect,
}: LocationSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CommuneResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (commune: CommuneResult) => {
    onSelect(commune);
    setQuery("");
    setShowResults(false);
    setResults([]);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-1.5">
        <MapPin className="size-3.5 text-ember" />
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          {location
            ? `${location.city}${location.department && location.department !== location.city ? `, ${location.department}` : ""}`
            : "Entrez votre ville"}
        </p>
      </div>

      <div ref={containerRef} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              aria-label="Rechercher une ville"
              placeholder="Paris, Lyon, Bordeaux…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-input px-3 py-2.5 pr-8 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus:border-ember/50 focus:outline-none focus:ring-1 focus:ring-ember/30"
            />
            {isSearching && (
              <Loader2 className="absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>

          <button
            type="button"
            onClick={onDetect}
            disabled={isDetecting}
            aria-label="Détecter ma position GPS"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-ember text-white transition-colors hover:bg-ember/90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDetecting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Navigation className="size-4" />
            )}
          </button>
        </div>

        {showResults && results.length > 0 && (
          <ul className="absolute z-10 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg shadow-slate-900/10">
            {results.map((commune) => (
              <li key={`${commune.city}-${commune.departmentCode}`}>
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary"
                  onClick={() => handleSelect(commune)}
                >
                  <MapPin className="size-3 shrink-0 text-muted-foreground" />
                  <span className="font-medium text-foreground">
                    {commune.city}
                  </span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {commune.departmentCode}
                  </span>
                </button>
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
