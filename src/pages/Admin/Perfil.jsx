// src/pages/Admin/Perfil.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import Button from "../../componentes/ui/Button";
import AvatarUpload from "../../componentes/AvatarUpload/AvatarUpload";

// Ícones
import {
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  KeyIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const Perfil = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { user, logout } = useAuth();

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [avatar, setAvatar] = useState(user?.avatar || null);

  const [formData, setFormData] = useState({
    senha_atual: "",
    nova_senha: "",
    confirmar_senha: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMensagem({ tipo: "", texto: "" });
  };

  const validarFormulario = () => {
    if (!formData.senha_atual) {
      setMensagem({ tipo: "erro", texto: "Digite sua senha atual" });
      return false;
    }

    if (!formData.nova_senha) {
      setMensagem({ tipo: "erro", texto: "Digite a nova senha" });
      return false;
    }

    if (formData.nova_senha.length < 6) {
      setMensagem({
        tipo: "erro",
        texto: "A nova senha deve ter no mínimo 6 caracteres",
      });
      return false;
    }

    if (formData.nova_senha !== formData.confirmar_senha) {
      setMensagem({ tipo: "erro", texto: "As senhas não conferem" });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setLoading(true);

    try {
      // ✅ 1. PRIMEIRO: verifica a senha atual (sem usar bcrypt, pois o Auth já faz isso)
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.senha_atual,
      });

      if (signInError) {
        setMensagem({ tipo: "erro", texto: "Senha atual incorreta" });
        setLoading(false);
        return;
      }

      // ✅ 2. DEPOIS: atualiza a senha no Auth (jeito correto)
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.nova_senha,
      });

      if (updateError) throw updateError;

      // ✅ 3. NÃO PRECISA mais atualizar nas tabelas (a senha fica no Auth)

      setMensagem({
        tipo: "sucesso",
        texto: "✅ Senha alterada com sucesso! Faça login novamente.",
      });

      // Limpa o formulário
      setFormData({
        senha_atual: "",
        nova_senha: "",
        confirmar_senha: "",
      });

      // Faz logout após 3 segundos
      setTimeout(() => {
        logout();
      }, 3000);
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      setMensagem({
        tipo: "erro",
        texto: "Erro ao alterar senha. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div
      className={
        isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header com botão Voltar */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin")}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
              }
            `}
            title="Voltar ao Dashboard"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Meu Perfil
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Gerencie suas informações e altere sua senha
            </p>
          </div>
        </div>

        {/* Card de informações do usuário com AVATAR UPLOAD */}
        <div
          className={`mb-6 p-8 rounded-xl border ${
            isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Componente de Upload de Avatar */}
            <AvatarUpload
              userId={user.id}
              tipo={user?.tipo === "corretor" ? "corretores" : "usuarios"}
              currentAvatar={avatar}
              onUpload={(url) => {
                setAvatar(url);
                // Atualiza o user no contexto se necessário
                if (user) user.avatar = url;
              }}
            />

            {/* Informações do usuário */}
            <div className="flex-1">
              <h2
                className={`text-2xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
              >
                {user.name}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-3">
                <div className="flex items-center gap-2">
                  <EnvelopeIcon className="w-5 h-5 text-gray-500" />
                  <span
                    className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="w-5 h-5 text-gray-500" />
                  <span
                    className={`text-base ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    {user.role === "master"
                      ? "Administrador Master"
                      : user.role === "gerente"
                        ? "Gerente"
                        : user.role === "rh"
                          ? "RH"
                          : user.role === "marketing"
                            ? "Marketing"
                            : user.role === "financeiro"
                              ? "Financeiro"
                              : user.role === "corretor"
                                ? "Corretor"
                                : user.role}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de alteração de senha */}
        <div
          className={`p-8 rounded-xl border ${
            isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"
          }`}
        >
          <h3
            className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            <KeyIcon className="w-6 h-6" />
            Alterar Senha
          </h3>

          {mensagem.texto && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                mensagem.tipo === "sucesso"
                  ? isDark
                    ? "bg-green-900/30 text-green-300 border border-green-800"
                    : "bg-green-100 text-green-800 border border-green-300"
                  : isDark
                    ? "bg-red-900/30 text-red-300 border border-red-800"
                    : "bg-red-100 text-red-800 border border-red-300"
              }`}
            >
              {mensagem.texto}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2">
                Senha atual <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="senha_atual"
                value={formData.senha_atual}
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
                placeholder="Digite sua senha atual"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Nova senha <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="nova_senha"
                value={formData.nova_senha}
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
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmar nova senha <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmar_senha"
                value={formData.confirmar_senha}
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
                placeholder="Digite a nova senha novamente"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={loading}
                className="px-8 py-3 text-base"
              >
                {loading ? "Alterando..." : "Alterar Senha"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
