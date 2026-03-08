import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import Button from "../../componentes/ui/Button";

// Ícones
import {
  UserIcon,
  EnvelopeIcon,
  BriefcaseIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const AdminUsuarios = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const { error } = await supabase.from("usuarios").delete().eq("id", id);

      if (error) throw error;
      await carregarUsuarios();
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir usuário");
    }
  };

  const getPerfilBadge = (perfil) => {
    const cores = {
      master: isDark
        ? "bg-purple-900/30 text-purple-300"
        : "bg-purple-100 text-purple-800",
      gerente: isDark
        ? "bg-blue-900/30 text-blue-300"
        : "bg-blue-100 text-blue-800",
      rh: isDark
        ? "bg-green-900/30 text-green-300"
        : "bg-green-100 text-green-800",
      marketing: isDark
        ? "bg-amber-900/30 text-amber-300"
        : "bg-amber-100 text-amber-800",
      financeiro: isDark
        ? "bg-emerald-900/30 text-emerald-300"
        : "bg-emerald-100 text-emerald-800",
    };
    return (
      cores[perfil] ||
      (isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800")
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A24D]"></div>
          <p className="mt-4 text-gray-600">Carregando usuários...</p>
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
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Usuários do Sistema
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Gerencie funcionários da imobiliária (RH, marketing, financeiro,
              etc)
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/admin")} variant="outline">
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => navigate("/admin/usuarios/novo")}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        </div>

        {/* Grid de usuários */}
        {usuarios.length === 0 ? (
          <div
            className={`text-center py-12 rounded-xl border ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <UserIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3
              className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
            >
              Nenhum usuário cadastrado
            </h3>
            <p className={`${isDark ? "text-gray-500" : "text-gray-600"} mb-4`}>
              Clique em "Novo Usuário" para começar
            </p>
            <Button onClick={() => navigate("/admin/usuarios/novo")}>
              <PlusIcon className="w-4 h-4 mr-2" />
              Novo Usuário
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usuarios.map((usuario) => (
              <div
                key={usuario.id}
                className={`rounded-xl border overflow-hidden ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                } transition-all duration-200`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3
                      className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                    >
                      {usuario.nome}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPerfilBadge(
                        usuario.perfil,
                      )}`}
                    >
                      {usuario.perfil}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div
                      className={`flex items-center text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      <EnvelopeIcon className="w-4 h-4 mr-2" />
                      {usuario.email}
                    </div>
                    {usuario.cargo && (
                      <div
                        className={`flex items-center text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}
                      >
                        <BriefcaseIcon className="w-4 h-4 mr-2" />
                        {usuario.cargo}
                      </div>
                    )}
                  </div>

                  <div
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Cadastrado em:{" "}
                    {new Date(usuario.created_at).toLocaleDateString("pt-BR")}
                  </div>
                </div>

                <div
                  className={`px-6 py-3 border-t flex justify-end gap-2 ${
                    isDark
                      ? "border-gray-700 bg-gray-800/70"
                      : "border-gray-200 bg-gray-50/80"
                  }`}
                >
                  <button
                    onClick={() =>
                      navigate(`/admin/usuarios/editar/${usuario.id}`)
                    }
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/40"
                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                    }`}
                    title="Editar"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className={`p-2 rounded-lg ${
                      isDark
                        ? "bg-red-900/30 text-red-300 hover:bg-red-800/40"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                    }`}
                    title="Excluir"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsuarios;
