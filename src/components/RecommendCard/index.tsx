import type { ComfortLevel, HourlyScore } from "@/types";
import ThermalComparison from "./components/ThermalComparison";
import ThermalDelta from "./components/ThermalDelta";
import IdealSlots from "./components/IdealSlots";

interface RecommendCardProps {
  currentScore: HourlyScore | null;
  indoorTemp: number;
  onTempChange: (value: number) => void;
  comfortLevel: ComfortLevel;
  onComfortChange: (level: ComfortLevel) => void;
  scores: HourlyScore[];
  cityName: string;
}

const RecommendCard = ({
  currentScore,
  indoorTemp,
  onTempChange,
  comfortLevel,
  onComfortChange,
  scores,
  cityName,
}: RecommendCardProps) => {
  if (!currentScore) return null;

  return (
    <div className="flex flex-col gap-3">
      <ThermalComparison
        currentScore={currentScore}
        indoorTemp={indoorTemp}
        onTempChange={onTempChange}
        comfortLevel={comfortLevel}
        onComfortChange={onComfortChange}
        cityName={cityName}
      />
      <ThermalDelta currentScore={currentScore} />
      <IdealSlots scores={scores} indoorTemp={indoorTemp} />
    </div>
  );
};

export default RecommendCard;
