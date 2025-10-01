import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

interface LoginForm {
  username: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const [formData, setFormData] = useState<LoginForm>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3001/api/v1/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const raw = await response.json();

      if (!response.ok) {
        throw new Error(raw.message || "Erro ao fazer login");
      }

      // Normalize possible API shapes
      const payload =
        raw && raw.data && raw.data.data
          ? raw.data.data
          : raw && raw.data
            ? raw.data
            : raw;

      const tokenValue = payload?.token?.token || payload?.token;
      if (typeof tokenValue !== "string") {
        throw new Error("Token inválido na resposta da API");
      }

      localStorage.setItem("adminToken", tokenValue);
      localStorage.setItem(
        "adminInfo",
        JSON.stringify({
          id: payload.id,
          username: payload.username,
          email: payload.email,
        }),
      );

      navigate("/admin/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <svg
              className="h-8 w-8 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold text-white">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Acesse o painel administrativo do SarradaBet
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Usuário ou Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                placeholder="Digite seu usuário ou email"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                placeholder="Digite sua senha"
                disabled={loading}
              />
            </div>
          </div>

          {error && <ErrorMessage error={error} title="Erro no Login" />}

          <div>
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-300 hover:to-orange-400 py-3 text-lg font-semibold"
            >
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Voltar para o site
            </button>
          </div>
        </form>

        <div className="mt-8 p-4 bg-gray-800 rounded-xl border border-gray-700">
          <h3 className="text-sm font-medium text-gray-300 mb-2">
            Credenciais de Teste:
          </h3>
          <div className="text-xs text-gray-400 space-y-1">
            <div>
              <strong>Usuário:</strong> admin
            </div>
            <div>
              <strong>Senha:</strong> admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
