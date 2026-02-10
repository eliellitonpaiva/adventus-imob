import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BuildingOfficeIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";
import Button from "../componentes/ui/Button";

const Login = () => {
  const navigate = useNavigate();
  const { login, loading: authLoading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpar erro quando o usuário começar a digitar
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Redirecionar após login bem-sucedido
        navigate("/admin", { replace: true });
      } else {
        setError(result.error || "Erro ao fazer login");
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isSubmitting || authLoading;

  const handleForgotPassword = (e) => {
    e.preventDefault();
    alert("Funcionalidade de recuperação de senha será implementada em breve.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[#D4A24D] to-[#31353E]">
      <div className="w-full max-w-xs">
        {/* Logo e nome */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center w-14 h-14 bg-[#31353E] rounded-2xl mb-3">
            <div className="w-9 h-9 bg-[#D4A24D] rounded-lg flex items-center justify-center">
              <BuildingOfficeIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Imobi Admin</h1>
          <p className="text-gray-200 mt-0.5 text-center text-xs">
            Área administrativa da imobiliária
          </p>
        </div>

        {/* Card de login */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-white/30 shadow-lg p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-gray-900 pr-12 disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 rounded p-1 disabled:opacity-50"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar-me e Esqueceu senha - CORRIGIDO */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 text-[#D4A24D] focus:ring-[#D4A24D] border-gray-300 rounded disabled:opacity-50"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm text-gray-700"
                >
                  Lembrar-me
                </label>
              </div>
              <a
                href="#"
                onClick={handleForgotPassword}
                className="text-sm text-[#D4A24D] hover:text-[#c1923e] font-medium disabled:opacity-50"
                style={{ pointerEvents: isLoading ? "none" : "auto" }}
              >
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão de Login */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Autenticando...
                </span>
              ) : (
                "Entrar"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-5 text-center text-xs text-gray-300">
          <p>© {new Date().getFullYear()} Imobi Admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
