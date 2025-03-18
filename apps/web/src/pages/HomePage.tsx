// apps/web/src/pages/HomePage.tsx
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import betService from "../services/betService";
import { Bet } from "../types/bet";

const HomePage = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        const betData = await betService.getAll();
        setBets(betData.data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBets();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navegação */}
      <nav className="bg-purple-900/20 border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-yellow-400">
            SarradaBet
          </Link>
          <div className="hidden md:flex space-x-6">
            <Link
              to="/create-bet"
              className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Nova Aposta
            </Link>
          </div>
        </div>
      </nav>

      {/* Seção Hero */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-900/40 to-yellow-900/20 rounded-xl p-8 border border-purple-500/30">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Faça Suas Apostas
            <br />
            <span className="text-yellow-400">Seja o Maior Sarrador</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Preveja, vote e ganhe nos maiores eventos do mundo
          </p>
          <div className="flex gap-4">
            <Link
              to="/create-bet"
              className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
            >
              Criar Aposta
            </Link>
            <Link
              to="/bets"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-purple-500 transition-colors"
            >
              Ver Todas
            </Link>
          </div>
        </div>
      </div>

      {/* Listagem de Apostas */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">
          Apostas Recentes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="bg-gray-900 rounded-lg p-6 border border-purple-500/30 hover:border-yellow-400/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{bet.title}</h3>
                {bet.category && (
                  <span className="bg-purple-900/40 text-yellow-400 px-3 py-1 rounded-full text-sm">
                    {bet.category}
                  </span>
                )}
              </div>

              <div className="mb-4">
                <p className="text-gray-400">{bet.description}</p>
              </div>

              {/* Lista de Odds */}
              <div className="mb-4 space-y-3">
                <p className="text-gray-300 font-medium">Opções:</p>
                <div className="space-y-2">
                  {bet.odds?.map((odd) => (
                    <div
                      key={odd.id}
                      className="flex justify-between items-center bg-gray-800/50 p-3 rounded-lg"
                    >
                      <span className="text-yellow-300">{odd.title}</span>
                      <span className="bg-purple-900/40 text-yellow-400 px-2 py-1 rounded text-sm">
                        {odd.value}x
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <div>
                  <p className="text-gray-400 text-sm">
                    Total de votos: {bet.totalVotes ?? 0}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Criado em: {new Date(bet.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to={`/bets/${bet.id}`}
                  className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                >
                  Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>

        {bets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Nenhuma aposta encontrada</p>
            <Link
              to="/create-bet"
              className="mt-4 inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
            >
              Seja o primeiro a criar uma aposta!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
