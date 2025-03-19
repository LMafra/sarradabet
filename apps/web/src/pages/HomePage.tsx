import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import betService from "../services/betService";
import categoryService from "../services/categoryService";
import { Bet } from "../types/bet";
import { Category } from "../types/category";
import { useAsync } from "../hooks/useAsync";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import Navigation from "../components/Navigation";
import BetCard from "../components/BetCard";
import CreateBetModal from "../components/CreateBetModal";

const HomePage = () => {
  const {
    data: betsResponse,
    loading: betsLoading,
    error: betsError,
    execute: fetchBets,
  } = useAsync<{ data: Bet[] }>(betService.getAll);

  const { data: categoriesResponse, execute: fetchCategories } = useAsync<{
    data: Category[];
  }>(categoryService.getAll);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    fetchBets();
    fetchCategories();
  }, [fetchBets, fetchCategories]);

  const handleBetCreated = () => {
    fetchBets();
    setShowCreateModal(false);
  };

  const handleVoteCreated = () => {
    fetchBets();
  };

  const groupedBets = useMemo(() => {
    if (!betsResponse?.data || !categoriesResponse?.data) return [];

    const groups = new Map<
      number | "uncategorized",
      {
        category?: Category;
        bets: Bet[];
      }
    >();

    groups.set("uncategorized", { bets: [] });

    categoriesResponse.data.forEach((category) => {
      groups.set(category.id, { category, bets: [] });
    });

    betsResponse.data.forEach((bet) => {
      if (bet.categoryId && groups.has(bet.categoryId)) {
        groups.get(bet.categoryId)!.bets.push(bet);
      } else {
        groups.get("uncategorized")!.bets.push(bet);
      }
    });

    return Array.from(groups.entries())
      .filter(([group]) => group.bets.length > 0)
      .map(([id, group]) => ({
        id,
        name: group.category?.title || "Sem Categoria",
        bets: group.bets,
      }));
  }, [betsResponse, categoriesResponse]);

  const filteredBets = useMemo(() => {
    if (!selectedCategory) return groupedBets;
    return groupedBets.filter((group) => group.id === selectedCategory);
  }, [groupedBets, selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation onOpenCreateModal={() => setShowCreateModal(true)} />

      <CreateBetModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onBetCreated={handleBetCreated}
      />

      <HeroSection onOpenCreateModal={() => setShowCreateModal(true)} />

      <CategoryFilter
        categories={categoriesResponse?.data || []}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <BetsList
        groupedBets={filteredBets}
        loading={betsLoading}
        error={betsError}
        onRetry={fetchBets}
        onVoteCreated={handleVoteCreated}
      />
    </div>
  );
};

interface HeroProps {
  onOpenCreateModal: () => void;
}

const HeroSection = ({ onOpenCreateModal }: HeroProps) => (
  <div className="container mx-auto px-4 py-16">
    <div className="bg-gradient-to-r from-purple-900/40 to-yellow-900/20 rounded-xl p-8 border border-purple-500/30">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Aposte na resenha
        <br />
        <span className="text-yellow-400">Seja o Maior Sarrador</span>
      </h1>
      <p className="text-gray-300 text-lg mb-8">
        A emoção da Copa Sarrada agora vale mais!
      </p>
      <div className="flex gap-4">
        <button
          onClick={onOpenCreateModal}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Nova Aposta
        </button>
      </div>
    </div>
  </div>
);

const BetsList = ({
  groupedBets,
  loading,
  error,
  onRetry,
  onVoteCreated,
}: {
  groupedBets: Array<{
    id: number | "uncategorized";
    name: string;
    bets: Bet[];
  }>;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onVoteCreated: () => void;
}) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={onRetry} />;

  return (
    <div className="container mx-auto px-4 py-12">
      {groupedBets.map((group) => (
        <div key={group.id} className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">
            {group.name}
          </h2>
          <div className="grid gap-6">
            {group.bets.map((bet) => (
              <BetCard key={bet.id} bet={bet} onVoteCreated={onVoteCreated} />
            ))}
          </div>
        </div>
      ))}

      {groupedBets.length === 0 && <EmptyBetsState />}
    </div>
  );
};

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
}) => (
  <div className="container mx-auto px-4 py-6">
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 rounded-lg ${
          !selectedCategory
            ? "bg-yellow-400 text-black"
            : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        Todas
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 rounded-lg ${
            selectedCategory === category.id
              ? "bg-purple-600 text-white"
              : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          {category.title}
        </button>
      ))}
    </div>
  </div>
);

const EmptyBetsState = () => (
  <div className="text-center py-12">
    <p className="text-gray-400 text-lg">Nenhuma aposta encontrada</p>
    <Link
      to="/create-bet"
      className="mt-4 inline-block bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
    >
      Seja o primeiro a criar uma aposta!
    </Link>
  </div>
);

export default HomePage;
