import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
} from "@heroicons/react/24/outline";

const EditarUsuario = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erros, setErros] = useState({});

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "rh",
    cargo: "",
    ativo: true,
  });

  useEffect(() => {
    carregarUsuario();
  }, [id]);

  const carregarUsuario = async () => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          nome: data.nome || "",
          email: data.email || "",
          senha: "",
          perfil: data.perfil || "rh",
          cargo: data.cargo || "",
          ativo: data.ativo !== false,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
      alert("Erro ao carregar dados");
      navigate("/admin/usuarios");
    } finally {
      setLoading(false);
    }
  };

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

    setSaving(true);
    try {
      const dadosAtualizar = {
        nome: formData.nome,
        email: formData.email,
        perfil: formData.perfil,
        cargo: formData.cargo,
        ativo: formData.ativo,
        updated_at: new Date().toISOString(),
      };

      // Se preencheu nova senha, criptografa
      if (formData.senha && formData.senha.trim() !== "") {
        dadosAtualizar.senha = await bcrypt.hash(formData.senha, 10);
      }

      const { error } = await supabase
        .from("usuarios")
        .update(dadosAtualizar)
        .eq("id", id);

      if (error) throw error;

      alert("✅ Usuário atualizado com sucesso!");
      navigate("/admin/usuarios");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar usuário");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A24D]"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"
      }
    >
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Editar Usuário
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {formData.nome}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/usuarios")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  } ${erros.nome ? "border-red-500" : ""} focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
                />
                {erros.nome && (
                  <p className="mt-1 text-xs text-red-500">{erros.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  } ${erros.email ? "border-red-500" : ""} focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
                />
                {erros.email && (
                  <p className="mt-1 text-xs text-red-500">{erros.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Nova senha
                </label>
                <input
                  type="text"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  placeholder="Deixe em branco para manter"
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
                />
                <p className="text-xs mt-1 opacity-60">
                  Só preencha se quiser alterar a senha
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Perfil <span className="text-red-500">*</span>
                </label>
                <select
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
                >
                  <option value="master">Master (acesso total)</option>
                  <option value="gerente">Gerente</option>
                  <option value="rh">RH</option>
                  <option value="marketing">Marketing</option>
                  <option value="financeiro">Financeiro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Cargo</label>
                <input
                  type="text"
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-amber-500/30`}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={handleChange}
                  className="w-4 h-4 accent-[#D4A24D]"
                />
                <label className="text-sm font-medium">Usuário ativo</label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/usuarios")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarUsuario;
