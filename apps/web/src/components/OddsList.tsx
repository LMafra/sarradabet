import { Odd } from "../types/odd";
import voteService from "../services/voteService";

interface OddsListProps {
  odds: Odd[];
  onVoteCreated?: () => void;
}

const OddsList = ({ odds, onVoteCreated }: OddsListProps) => {
  const handleCreateVote = async (oddId: number) => {
    try {
      await voteService.create({ oddId });
      onVoteCreated?.();
    } catch (error) {
      console.error("Erro ao criar voto:", error);
    }
  };

  return (
    <div className="mb-4">
      <p className="text-gray-300 font-medium mb-2">Opções:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {odds.map((odd) => (
          <button
            key={odd.id}
            onClick={() => handleCreateVote(odd.id)}
            className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg hover:bg-gray-800 transition-colors group"
          >
            <div className="flex-1 text-left">
              <span className="text-yellow-300 group-hover:text-yellow-400 transition-colors">
                {odd.title}
              </span>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <span className="bg-purple-900/40 text-yellow-400 px-2 py-1 rounded text-sm min-w-[70px]">
                {odd.totalVotes}
              </span>
              <span className="bg-green-900/40 text-green-400 px-2 py-1 rounded text-sm min-w-[60px]">
                {odd.value}x
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OddsList;
