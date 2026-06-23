import { useState, useCallback, useRef } from "react";
import type { CommuneResult, GeoLocation } from "@/types";
import useAnalytics from "@/hooks/useAnalytics";

interface ApiAddressFeature {
  properties: {
    label: string;
    city: string;
    context: string;
    citycode: string;
  };
  geometry: {
    coordinates: [number, number];
  };
}

const parseContext = (
  context: string,
): { department: string; departmentCode: string } => {
  const parts = context.split(", ");
  return {
    departmentCode: parts[0] ?? "",
    department: parts[1] ?? "",
  };
};

export const searchCommunes = async (
  query: string,
): Promise<CommuneResult[]> => {
  if (query.length < 2) return [];

  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&type=municipality&limit=5`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Erreur API Adresse");

  const data = (await response.json()) as { features: ApiAddressFeature[] };

  return data.features.map((feature) => {
    const { department, departmentCode } = parseContext(
      feature.properties.context,
    );
    return {
      name: feature.properties.label,
      city: feature.properties.city,
      department,
      departmentCode,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    };
  });
};

export const useLocation = () => {
  const analytics = useAnalytics();
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);

  const detectLocation = useCallback(() => {
    if (loadingRef.current) return;
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas supportée par votre navigateur.");
      analytics.locationGpsNotSupported();
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${longitude}&lat=${latitude}`;
          const response = await fetch(url);
          const data = (await response.json()) as {
            features: ApiAddressFeature[];
          };
          const feature = data.features[0];
          const city = feature?.properties.city ?? "Votre position";
          const { department } = parseContext(
            feature?.properties.context ?? "",
          );
          setLocation({ latitude, longitude, city, department, source: "gps" });
          analytics.locationDetected({ source: "gps", department });
        } catch {
          setLocation({
            latitude,
            longitude,
            city: "Votre position",
            source: "gps",
          });
          analytics.locationDetected({ source: "gps" });
        } finally {
          loadingRef.current = false;
          setIsLoading(false);
        }
      },
      () => {
        setError(
          "Impossible d'obtenir votre position. Saisissez votre commune.",
        );
        analytics.locationGpsDenied();
        loadingRef.current = false;
        setIsLoading(false);
      },
      { timeout: 10000 },
    );
  }, []);

  const setFromCommune = useCallback((commune: CommuneResult) => {
    setLocation({
      latitude: commune.latitude,
      longitude: commune.longitude,
      city: commune.city,
      department: commune.department,
      source: "search",
    });
    analytics.locationDetected({
      source: "search",
      department: commune.department,
    });
    setError(null);
  }, []);

  return { location, isLoading, error, detectLocation, setFromCommune };
};
