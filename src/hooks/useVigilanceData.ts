import type { VigilanceItem } from "@/types";
import { useEffect, useRef, useState } from "react";

const EXCLUDED = new Set(["neige / verglas", "grand froid", "avalanches"]);
const VALID_COLORS = new Set(["jaune", "orange", "rouge"]);
const CACHE_MS = 30 * 60 * 1000;

interface OdsRecord {
  phenomenon: string;
  color: string;
  echeance: string;
  begin_time: string;
  end_time: string;
}

export const useVigilanceData = (
  departmentCode: string | undefined,
): VigilanceItem[] => {
  const [vigilances, setVigilances] = useState<VigilanceItem[]>([]);
  const cacheRef = useRef<{
    data: VigilanceItem[];
    ts: number;
    code: string;
  } | null>(null);

  useEffect(() => {
    if (!departmentCode) return;

    if (
      cacheRef.current?.code === departmentCode &&
      Date.now() - cacheRef.current.ts < CACHE_MS
    ) {
      setVigilances(cacheRef.current.data);
      return;
    }

    const url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/weatherref-france-vigilance-meteo-departement/records?where=domain_id%3D"${departmentCode}"&limit=30`;

    fetch(url)
      .then((r) => r.json() as Promise<{ results: OdsRecord[] }>)
      .then(({ results }) => {
        // Phenomena that have at least one colored (non-vert) J alert today
        const alertPhenom = new Set(
          results
            .filter(
              (r) =>
                !EXCLUDED.has(r.phenomenon) &&
                r.echeance === "J" &&
                VALID_COLORS.has(r.color),
            )
            .map((r) => r.phenomenon),
        );
        const filtered = results
          .filter(
            // ponytail: vert J kept for phenomena that already have a colored J alert —
            // shows the alert-end transition (e.g. orages jaune→vert at 16h).
            // vert J1 kept — means "bulletin published, no alert tomorrow".
            (r) =>
              !EXCLUDED.has(r.phenomenon) &&
              (VALID_COLORS.has(r.color) ||
                r.echeance !== "J" ||
                alertPhenom.has(r.phenomenon)),
          )
          .map((r) => ({
            phenomenon: r.phenomenon,
            color: r.color as VigilanceItem["color"],
            echeance: r.echeance as VigilanceItem["echeance"],
            begin_time: r.begin_time,
            end_time: r.end_time,
          }));
        cacheRef.current = {
          data: filtered,
          ts: Date.now(),
          code: departmentCode,
        };
        setVigilances(filtered);
      })
      .catch(() => {
        // Silent fail - vigilance is informational, not critical
      });
  }, [departmentCode]);

  return vigilances;
};
