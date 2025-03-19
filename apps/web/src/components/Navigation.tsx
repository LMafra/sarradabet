import { Link } from "react-router-dom";

interface NavigationProps {
  onOpenCreateModal: () => void;
}

const Navigation = ({ onOpenCreateModal }: NavigationProps) => (
  <nav className="bg-purple-900/20 border-b border-purple-500/30">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-yellow-400">
        SarradaBet
      </Link>
      <div className="hidden md:flex space-x-6">
        <button
          onClick={onOpenCreateModal}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-300 transition-colors"
        >
          Nova Aposta
        </button>
      </div>
    </div>
  </nav>
);

export default Navigation;
