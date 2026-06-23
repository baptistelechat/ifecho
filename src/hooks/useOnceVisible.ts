import { useEffect, useRef } from "react";

const useOnceVisible = <T extends HTMLElement = HTMLElement>(
  callback: () => void,
  threshold = 0.5,
) => {
  const ref = useRef<T | null>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || firedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          callback();
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // callback est stable par convention (défini inline dans les composants)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threshold]);

  return ref;
};

export default useOnceVisible;
