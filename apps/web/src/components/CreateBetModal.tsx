import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Bet, CreateBetDto } from "../types/bet";
import betService from "../services/betService";
import categoryService from "../services/categoryService";

interface CreateBetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBetCreated: (newBet: Bet) => void;
}

const CreateBetModal = ({
  isOpen,
  onClose,
  onBetCreated,
}: CreateBetModalProps) => {
  const [formData, setFormData] = useState<CreateBetDto>({
    title: "",
    description: "",
    categoryId: "",
    odds: [{ title: "", value: 1 }],
  });
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (err) {
      console.error("Erro ao buscar categorias:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (
      !formData.title.trim() ||
      formData.odds.some((odd) => !odd.title.trim())
    ) {
      setError("É necessário criar apostas com valores");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await betService.create({
        ...formData,
        categoryId: Number(formData.categoryId),
      });

      const newBet = response.data;
      onBetCreated(newBet);
      onClose();

      setFormData({
        title: "",
        description: "",
        categoryId: "",
        odds: [{ title: "", value: 1 }],
      });
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Ocorreu um erro inesperado.");
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOdd = () => {
    setFormData((prev) => ({
      ...prev,
      odds: [...prev.odds, { title: "", value: 1 }],
    }));
  };

  const updateOdd = (
    index: number,
    field: "title" | "value",
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      odds: prev.odds.map((odd, i) =>
        i === index ? { ...odd, [field]: value } : odd,
      ),
    }));
  };

  const removeOdd = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      odds: prev.odds.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen bg-black/50">
        <DialogPanel className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl mx-4 border border-purple-500/30">
          <DialogTitle className="text-2xl font-bold text-yellow-400 mb-4">
            Nova Aposta
          </DialogTitle>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Título</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full bg-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Descrição (opcional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                className="w-full bg-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Categoria (opcional)
              </label>
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
                className="w-full bg-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-400"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-300">Opções</h3>
                <button
                  type="button"
                  onClick={addOdd}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-500 transition-colors"
                >
                  Adicionar Opção
                </button>
              </div>

              {formData.odds.map((odd, index) => (
                <div key={index} className="flex gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Título da opção"
                    value={odd.title}
                    onChange={(e) => updateOdd(index, "title", e.target.value)}
                    className="flex-1 bg-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-400"
                  />
                  <input
                    type="number"
                    placeholder="Odd"
                    value={odd.value}
                    onChange={(e) =>
                      updateOdd(index, "value", Number(e.target.value))
                    }
                    min="1"
                    step="0.1"
                    className="w-24 bg-gray-800 rounded-lg p-3 text-white focus:ring-2 focus:ring-yellow-400"
                  />
                  {formData.odds.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeOdd(index)}
                      className="text-red-500 hover:text-red-400"
                    >
                      Remover
                    </button>
                  )}
                </div>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Criando..." : "Criar Aposta"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default CreateBetModal;
