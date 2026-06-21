import type { ComfortLevel, HourlyScore } from "@/types";
import VerdictBanner from "./components/VerdictBanner";
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
}

const RecommendCard = ({
  currentScore,
  indoorTemp,
  onTempChange,
  comfortLevel,
  onComfortChange,
  scores,
}: RecommendCardProps) => {
  if (!currentScore) return null;

  return (
    <div className="flex flex-col gap-3">
      <VerdictBanner currentScore={currentScore} indoorTemp={indoorTemp} />
      <ThermalComparison
        currentScore={currentScore}
        indoorTemp={indoorTemp}
        onTempChange={onTempChange}
        comfortLevel={comfortLevel}
        onComfortChange={onComfortChange}
      />
      <ThermalDelta currentScore={currentScore} indoorTemp={indoorTemp} />
      <IdealSlots scores={scores} />
    </div>
  );
};

export default RecommendCard;
