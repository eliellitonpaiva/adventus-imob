import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import bcrypt from "bcryptjs";
import Button from "../../componentes/ui/Button";

// Ícones
import {
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  ChevronLeftIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const NovoUsuario = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: Math.random().toString(36).slice(-8),
    perfil: "rh",
    cargo: "",
    ativo: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: null }));
  };

  const validarFormulario = () => {
    const novosErros = {};
    if (!formData.nome) novosErros.nome = "Nome é obrigatório";
    if (!formData.email) novosErros.email = "Email é obrigatório";
    if (!formData.perfil) novosErros.perfil = "Perfil é obrigatório";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = "Email inválido";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const senhaHash = await bcrypt.hash(formData.senha, 10);

      const { error } = await supabase.from("usuarios").insert([
        {
          nome: formData.nome,
          email: formData.email,
          senha: senhaHash,
          perfil: formData.perfil,
          cargo: formData.cargo,
          ativo: formData.ativo,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;

      alert("✅ Usuário cadastrado com sucesso!");
      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar usuário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={
        isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header com botão Voltar no estilo "Cadastrar Imóvel" */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/usuarios")}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
              }
            `}
            title="Voltar"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Novo Usuário
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Cadastre um funcionário da imobiliária (RH, marketing, financeiro,
              etc)
            </p>
          </div>
        </div>

        {/* Formulário expandido */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`p-8 rounded-xl border ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nome */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border text-base
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    ${erros.nome ? "border-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                  placeholder="Digite o nome completo"
                />
                {erros.nome && (
                  <p className="mt-1 text-xs text-red-500">{erros.nome}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border text-base
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    ${erros.email ? "border-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                  placeholder="email@exemplo.com"
                />
                {erros.email && (
                  <p className="mt-1 text-xs text-red-500">{erros.email}</p>
                )}
              </div>

              {/* Senha */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Senha inicial
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="senha"
                    value={formData.senha}
                    onChange={handleChange}
                    className={`
                      flex-1 px-4 py-3 rounded-lg border text-base
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        senha: Math.random().toString(36).slice(-8),
                      }))
                    }
                    className={`
                      px-4 py-3 rounded-lg text-sm font-medium whitespace-nowrap
                      ${
                        isDark
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300 border border-gray-200"
                      }
                    `}
                  >
                    Gerar nova
                  </button>
                </div>
                <p className="text-xs mt-1 opacity-60">
                  O usuário poderá alterar a senha depois do primeiro acesso
                </p>
              </div>

              {/* Perfil */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Perfil de acesso <span className="text-red-500">*</span>
                </label>
                <select
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border text-base
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                >
                  <option value="master">Master (acesso total)</option>
                  <option value="gerente">Gerente</option>
                  <option value="rh">RH (Recursos Humanos)</option>
                  <option value="marketing">Marketing</option>
                  <option value="financeiro">Financeiro</option>
                </select>
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Cargo / Função
                </label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  className={`
                    w-full px-4 py-3 rounded-lg border text-base
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                  placeholder="Ex: Analista de RH, Gerente de Marketing"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-3 mt-2">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                  className="w-5 h-5 accent-[#D4A24D]"
                />
                <label className="text-sm font-medium">Usuário ativo</label>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/usuarios")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Usuário"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoUsuario;
