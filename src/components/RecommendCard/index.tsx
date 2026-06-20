import type { HourlyScore } from "@/types";
import VerdictBanner from "./components/VerdictBanner";
import ThermalComparison from "./components/ThermalComparison";
import ThermalDelta from "./components/ThermalDelta";
import IdealSlots from "./components/IdealSlots";

interface RecommendCardProps {
  currentScore: HourlyScore | null;
  indoorTemp: number;
  onTempChange: (value: number) => void;
  city: string;
  scores: HourlyScore[];
}

const RecommendCard = ({
  currentScore,
  indoorTemp,
  onTempChange,
  city,
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
        city={city}
      />
      <ThermalDelta currentScore={currentScore} indoorTemp={indoorTemp} />
      <IdealSlots scores={scores} />
    </div>
  );
};

export default RecommendCard;
