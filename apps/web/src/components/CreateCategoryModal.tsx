import React, { useState, useEffect } from "react";
import { useCreateCategory } from "../hooks/useCategories";
import { CreateCategoryDto, Category } from "../types/category";
import Modal from "./ui/Modal";
import { Button } from "./ui/Button";
import { ErrorMessage } from "./ui/ErrorMessage";

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated?: (category: Category) => void;
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpen,
  onClose,
  onCategoryCreated,
}) => {
  const [formData, setFormData] = useState<CreateCategoryDto>({
    title: "",
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const createCategoryMutation = useCreateCategory();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({ title: "" });
      setValidationErrors([]);
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push("Título é obrigatório");
    }

    if (formData.title.length < 2) {
      errors.push("Título deve ter pelo menos 2 caracteres");
    }

    if (formData.title.length > 50) {
      errors.push("Título deve ter menos de 50 caracteres");
    }

    // Check for invalid characters (only letters, numbers, spaces, hyphens, underscores)
    const invalidCharRegex = /[^a-zA-Z0-9\s\-_]/;
    if (invalidCharRegex.test(formData.title)) {
      errors.push(
        "Título contém caracteres inválidos. Use apenas letras, números, espaços, hífens e underscores",
      );
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await createCategoryMutation.mutateAsync(formData);

      if (result) {
        onCategoryCreated?.(result);
        onClose();
      }
    } catch (error) {
      // Error is handled by the mutation hook
      console.error("Falha ao criar categoria:", error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Criar Nova Categoria"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Título *
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            placeholder="Digite o título da categoria"
            maxLength={50}
          />
          <p className="text-xs text-gray-400 mt-1">
            Use apenas letras, números, espaços, hífens e underscores
          </p>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <ErrorMessage error={validationErrors} title="Erros de Validação" />
        )}

        {/* API Error */}
        {createCategoryMutation.error && (
          <ErrorMessage
            error={createCategoryMutation.error}
            title="Falha ao criar categoria"
          />
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={createCategoryMutation.loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={createCategoryMutation.loading}
            disabled={createCategoryMutation.loading}
          >
            Criar Categoria
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateCategoryModal;
