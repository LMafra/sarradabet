import { Odd } from "../types/odd";
import { voteService } from "../services/VoteService";

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
    <div>
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-4 h-4 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
        <span className="text-sm font-semibold text-gray-300">
          Opções de Aposta
        </span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {odds.map((odd) => (
          <button
            key={odd.id}
            onClick={() => handleCreateVote(odd.id)}
            className="group flex justify-between items-center bg-gradient-to-r from-gray-700 to-gray-800 p-4 rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 border border-gray-600 hover:border-yellow-400/50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            <div className="flex-1 text-left">
              <span className="text-white font-medium group-hover:text-yellow-400 transition-colors">
                {odd.title}
              </span>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold min-w-[60px] text-center">
                  {odd.totalVotes}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span className="bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-lg text-sm font-bold min-w-[70px] text-center shadow-md">
                  {odd.value}x
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OddsList;
