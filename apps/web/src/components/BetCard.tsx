import { Bet } from "../types/bet";
import { format } from "date-fns";
import OddsList from "./OddsList";
import { useState, useEffect, useCallback } from "react";
import betService from "../services/betService";
import categoryService from "../services/categoryService";

interface BetCardProps {
  bet: Bet;
  onVoteCreated?: () => void;
}

const BetCard = ({ bet, onVoteCreated }: BetCardProps) => {
  const [oddsData, setOddsData] = useState(bet.odds);
  const [categoryData, setCategoryData] = useState<{
    id: number;
    title: string;
  } | null>(null);

  const formattedDate = format(bet.createdAt, "dd/MM/yyyy");

  useEffect(() => {
    setOddsData(bet.odds);
  }, [bet.odds]);



  const fetchUpdatedOdds = async () => {
    try {
      const response = await betService.getById(bet.id);
      setOddsData(response.odds);
      onVoteCreated?.();
    } catch (error) {
      console.error("Error updating odds:", error);
    }
  };

  const fetchCategory = useCallback(async () => {
    try {
      const category = await categoryService.getById(bet.categoryId);
      setCategoryData(category.data);
    } catch (error) {
      console.error("Error getting category:", error);
      setCategoryData(null);
    }
  }, [bet.categoryId]);

  useEffect(() => {
    if (bet.categoryId) {
      fetchCategory();
    }
  }, [bet.categoryId, fetchCategory]);

  return (
    <div className="w-full bg-gray-900 rounded-lg p-6 border border-purple-500/30 hover:border-yellow-400/50 transition-colors">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold pr-2">{bet.title}</h3>
        {categoryData && (
          <span className="bg-purple-900/40 text-yellow-400 px-3 py-1 rounded-full text-sm shrink-0">
            {categoryData.title}
          </span>
        )}
      </div>

      {bet.description && (
        <div className="mb-4">
          <p className="text-gray-400 text-sm">{bet.description}</p>
        </div>
      )}

      <div className="mb-4">
        <OddsList odds={oddsData} onVoteCreated={fetchUpdatedOdds} />
      </div>

      <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
        <div className="flex items-center gap-3">
          <span className="text-gray-400 text-sm">
            🗳️ {bet.totalVotes ?? 0} votos
          </span>
          <span className="text-gray-400 text-sm">
            📅 {formattedDate}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BetCard;
