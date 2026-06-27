import { CloudLightningIcon } from "@/components/ui/cloud-lightning";
import { CloudRainIcon } from "@/components/ui/cloud-rain";
import { CloudSnowIcon } from "@/components/ui/cloud-snow";
import { CloudSunIcon } from "@/components/ui/cloud-sun";
import { SunIcon } from "@/components/ui/sun";
import { cn } from "@/lib/utils";
import { Cloud, CloudDrizzle, CloudFog } from "lucide-react";
import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  RefAttributes,
} from "react";
import { useEffect, useRef } from "react";

interface AnimHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

type AnimIcon = ForwardRefExoticComponent<
  HTMLAttributes<HTMLDivElement> & { size?: number } & RefAttributes<AnimHandle>
>;

const ANIM_PLAY_MS = 1600;
const ANIM_PAUSE_MS = 2500;

const LoopIcon = ({
  Icon,
  size,
  className,
}: {
  Icon: AnimIcon;
  size: number;
  className?: string;
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

interface WeatherIconProps {
  code: number;
  size?: number;
  className?: string;
}

export const WeatherIcon = ({
  code,
  size = 36,
  className,
}: WeatherIconProps) => {
  if (code === 0) {
    return (
      <LoopIcon
        Icon={SunIcon as unknown as AnimIcon}
        size={size}
        className={cn("text-amber-400", className)}
      />
    );
  }

  if (code === 1 || code === 2) {
    return (
      <LoopIcon
        Icon={CloudSunIcon as unknown as AnimIcon}
        size={size}
        className={cn(
          code === 1 ? "text-amber-300" : "text-slate-400",
          className,
        )}
      />
    );
  }

  if (code === 3) {
    return (
      <Cloud
        size={size}
        className={cn("text-slate-400", className)}
        aria-label="Couvert"
      />
    );
  }

  if (code === 45 || code === 48) {
    return (
      <CloudFog
        size={size}
        className={cn("text-slate-300", className)}
        aria-label="Brouillard"
      />
    );
  }

  if (code >= 51 && code <= 57) {
    return (
      <CloudDrizzle
        size={size}
        className={cn("text-sky-400", className)}
        aria-label="Bruine"
      />
    );
  }

  if (code >= 61 && code <= 67) {
    return (
      <LoopIcon
        Icon={CloudRainIcon as unknown as AnimIcon}
        size={size}
        className={cn("text-sky-500", className)}
      />
    );
  }

  if (code >= 71 && code <= 77) {
    return (
      <LoopIcon
        Icon={CloudSnowIcon as unknown as AnimIcon}
        size={size}
        className={cn("text-sky-200", className)}
      />
    );
  }

  if (code >= 80 && code <= 82) {
    return (
      <LoopIcon
        Icon={CloudRainIcon as unknown as AnimIcon}
        size={size}
        className={cn("text-sky-600", className)}
      />
    );
  }

  if (code === 85 || code === 86) {
    return (
      <LoopIcon
        Icon={CloudSnowIcon as unknown as AnimIcon}
        size={size}
        className={cn("text-sky-200", className)}
      />
    );
  }

  if (code >= 95) {
    return (
      <LoopIcon
        Icon={CloudLightningIcon as unknown as AnimIcon}
        size={size}
        className={cn("text-yellow-400", className)}
      />
    );
  }

  return (
    <Cloud
      size={size}
      className={cn("text-slate-400", className)}
      aria-label="Météo"
    />
  );
};
