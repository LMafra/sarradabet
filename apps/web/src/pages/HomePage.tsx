// apps/web/src/pages/HomePage.tsx
import { Link } from 'react-router-dom';

const HomePage = () => {
  const featuredBets = [
    {
      id: 1,
      title: "O Time A vencerá o campeonato?",
      odds: 2.5,
      votes: 142
    },
    {
      id: 2,
      title: "Vencedor das Próximas Eleições Presidenciais",
      odds: 1.8,
      votes: 89
    },
  ];

  const remainBets = [
    {
      id: 1,
      title: "Quem levará cartão primeiro?",
      odds: 2.5,
      votes: 142
    },
    {
      id: 2,
      title: "Vencedor das Próximas Eleições Presidenciais",
      category: "Política",
      odds: 1.8,
      votes: 89
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navegação */}
      <nav className="bg-purple-900/20 border-b border-purple-500/30">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-yellow-400">SarradaBet</Link>
          <div className="hidden md:flex space-x-6">
          </div>
        </div>
      </nav>

      {/* Seção Hero */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-purple-900/40 to-yellow-900/20 rounded-xl p-8 border border-purple-500/30">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Faça Suas Apostas<br />
            <span className="text-yellow-400">Seja o Maior Sarrador</span>
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Preveja, vote e ganhe nos maiores eventos do mundo
          </p>
          <button className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors">
            Criar Aposta
          </button>
        </div>
      </div>

      {/* Apostas em Destaque */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Apostas em Destaque</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredBets.map((bet) => (
            <div
              key={bet.id}
              className="bg-gray-900 rounded-lg p-6 border border-purple-500/30 hover:border-yellow-400/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{bet.title}</h3>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-yellow-400">{bet.odds}x</p>
                  <p className="text-gray-400">{bet.votes} votos</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors">
                  Votar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categorias */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Outras Apostas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {remainBets.map((bet) => (
            <div
              key={bet.id}
              className="bg-gray-900 rounded-lg p-6 border border-purple-500/30 hover:border-yellow-400/50 transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{bet.title}</h3>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-3xl font-bold text-yellow-400">{bet.odds}x</p>
                  <p className="text-gray-400">{bet.votes} votos</p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg transition-colors">
                  Votar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
