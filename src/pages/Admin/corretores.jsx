import React, { useState } from "react";
import {
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import Input from "../../componentes/ui/Input";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const Corretores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const corretores = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao@imob.com",
      telefone: "(11) 99999-9999",
      status: "Ativo",
      imoveis: 12,
      rating: 4.8,
      creci: "123456-MA",
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@imob.com",
      telefone: "(11) 98888-8888",
      status: "Ativo",
      imoveis: 8,
      rating: 4.9,
      creci: "654321-MA",
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      email: "carlos@imob.com",
      telefone: "(11) 97777-7777",
      status: "Férias",
      imoveis: 5,
      rating: 4.5,
      creci: "789012-MA",
    },
    {
      id: 4,
      nome: "Ana Pereira",
      email: "ana@imob.com",
      telefone: "(11) 96666-6666",
      status: "Ativo",
      imoveis: 15,
      rating: 4.7,
      creci: "345678-MA",
    },
    {
      id: 5,
      nome: "Pedro Costa",
      email: "pedro@imob.com",
      telefone: "(11) 95555-5555",
      status: "Inativo",
      imoveis: 0,
      rating: 4.2,
      creci: "901234-MA",
    },
  ];

  // Cores condicionais para dark mode
  const statusColors = {
    Ativo: isDark
      ? "bg-green-900/30 text-green-300 border border-green-800"
      : "bg-green-100 text-green-800",
    Inativo: isDark
      ? "bg-red-900/30 text-red-300 border border-red-800"
      : "bg-red-100 text-red-800",
    Férias: isDark
      ? "bg-yellow-900/30 text-yellow-300 border border-yellow-800"
      : "bg-yellow-100 text-yellow-800",
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este corretor?")) {
      console.log("Excluir corretor:", id);
    }
  };

  return (
    <div
      className={
        isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"
      }
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 p-6">
        <div>
          <h1
            className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Corretores
          </h1>
          <p className={`mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Gerencie a equipe de corretores
          </p>
        </div>

        {/* BOTÕES LADO A LADO */}
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {/* BOTÃO "VER CANDIDATOS" */}
          <Button
            variant="primary"
            onClick={() => navigate("/admin/candidatos")}
          >
            <UserIcon className="w-5 h-5 mr-2" />
            Ver Candidatos
          </Button>

          {/* BOTÃO "NOVO CORRETOR" */}
          <Button
            variant="outline"
            onClick={() => navigate("/admin/corretores/novo")}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Corretor
          </Button>
        </div>
      </div>

      {/* Search and Filters - CORRIGIDO O INPUT */}
      <div
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border p-6 mb-6 mx-6`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            {/* CORREÇÃO AQUI: Input com estilo condicional direto */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nome, email ou CRECI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full pl-4 pr-10 py-2.5 rounded-lg border 
                  ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                  }
                  focus:outline-none focus:ring-2 transition-colors duration-200
                `}
              />
              {/* Ícone de busca (opcional) */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg
                  className={`w-5 h-5 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select
              className={`px-4 py-2.5 ${isDark ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200`}
            >
              <option value="">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="ferias">Férias</option>
            </select>
            <Button variant="outline">Exportar Lista</Button>
          </div>
        </div>
      </div>

      {/* Corretores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        {corretores.map((corretor) => (
          <div
            key={corretor.id}
            className={`${isDark ? "bg-gray-800 border-gray-700 hover:bg-gray-750" : "bg-white border-gray-200 hover:bg-gray-50"} rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200`}
          >
            {/* Header */}
            <div
              className={`p-6 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3
                    className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                  >
                    {corretor.nome}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium mt-2 inline-block ${statusColors[corretor.status]}`}
                  >
                    {corretor.status}
                  </span>
                </div>
                <div
                  className={`flex items-center ${isDark ? "bg-[#D4A24D]/20 text-[#F3D9A4]" : "bg-[#D4A24D]/10 text-[#D4A24D]"} px-3 py-1 rounded-lg`}
                >
                  <StarIcon className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{corretor.rating}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <div className="space-y-4">
                <div
                  className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <EnvelopeIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{corretor.email}</span>
                </div>
                <div
                  className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  <PhoneIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{corretor.telefone}</span>
                </div>
                <div
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  CRECI: {corretor.creci}
                </div>
              </div>

              {/* Stats com Divisória */}
              <div
                className={`mt-6 pt-6 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
              >
                <div className="flex items-center justify-between">
                  {/* IMÓVEIS */}
                  <div className="text-center">
                    <div
                      className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      {corretor.imoveis}
                    </div>
                    <div
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Imóveis
                    </div>
                  </div>

                  {/* DIVISÓRIA VERTICAL */}
                  <div
                    className={`h-12 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                  ></div>

                  {/* VENDAS */}
                  <div className="text-center">
                    <div
                      className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      R$ 2.5M
                    </div>
                    <div
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Vendas (mês)
                    </div>
                  </div>

                  {/* DIVISÓRIA VERTICAL */}
                  <div
                    className={`h-12 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                  ></div>

                  {/* LEADS */}
                  <div className="text-center">
                    <div
                      className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      15
                    </div>
                    <div
                      className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Leads
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions - MODIFICADO COM NOVAS CORES */}
            <div
              className={`px-6 py-4 ${isDark ? "bg-gray-800/70 border-gray-700" : "bg-gray-50/80 border-gray-200"} border-t flex justify-end space-x-3`}
            >
              {/* Botão Editar - COR AZUL */}
              <button
                onClick={() =>
                  navigate(`/admin/corretores/editar/${corretor.id}`)
                }
                className={`
                  p-2 rounded-lg transition-all duration-200 
                  ${
                    isDark
                      ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 hover:text-blue-200 border border-blue-800/50"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 border border-blue-200"
                  }
                  flex items-center justify-center shadow-sm hover:shadow
                `}
                title="Editar"
              >
                <PencilIcon className="w-5 h-5" />
              </button>

              {/* Botão Excluir - VERMELHO com ícone branco */}
              <button
                onClick={() => handleDelete(corretor.id)}
                className={`
                  p-2 rounded-lg transition-all duration-200 
                  ${
                    isDark
                      ? "bg-red-900/40 text-white hover:bg-red-800/60 hover:text-red-100 border border-red-800/50"
                      : "bg-red-600 text-white hover:bg-red-700 hover:text-white border border-red-600"
                  }
                  flex items-center justify-center shadow-sm hover:shadow
                `}
                title="Excluir"
              >
                <TrashIcon className="w-5 h-5" />
              </button>

              {/* Botão Ver Perfil - AMARELO da paleta */}
              <button
                onClick={() => navigate(`/admin/corretores/${corretor.id}`)}
                className={`
                  px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium
                  ${
                    isDark
                      ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 hover:text-amber-100 border border-amber-800/50"
                      : "bg-[#D4A24D] text-white hover:bg-[#C19137] hover:text-white border border-[#D4A24D]"
                  }
                  flex items-center justify-center shadow-sm hover:shadow whitespace-nowrap
                `}
              >
                Ver Perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div
        className={`mt-8 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border p-6 mx-6 mb-6`}
      >
        <h2
          className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}
        >
          Desempenho da Equipe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Corretores Ativos */}
          <div
            className={`text-center p-4 ${isDark ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50"} rounded-lg`}
          >
            <div
              className={`text-3xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
            >
              3
            </div>
            <div
              className={`text-sm ${isDark ? "text-blue-300" : "text-blue-800"} mt-1`}
            >
              Corretores Ativos
            </div>
          </div>

          {/* Imóveis Ativos */}
          <div
            className={`text-center p-4 ${isDark ? "bg-green-900/30 border border-green-800" : "bg-green-50"} rounded-lg`}
          >
            <div
              className={`text-3xl font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
            >
              156
            </div>
            <div
              className={`text-sm ${isDark ? "text-green-300" : "text-green-800"} mt-1`}
            >
              Imóveis Ativos
            </div>
          </div>

          {/* Leads/Mês */}
          <div
            className={`text-center p-4 ${isDark ? "bg-purple-900/30 border border-purple-800" : "bg-purple-50"} rounded-lg`}
          >
            <div
              className={`text-3xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}
            >
              89
            </div>
            <div
              className={`text-sm ${isDark ? "text-purple-300" : "text-purple-800"} mt-1`}
            >
              Leads/Mês
            </div>
          </div>

          {/* Vendas (mês) */}
          <div
            className={`text-center p-4 ${isDark ? "bg-[#D4A24D]/20 border border-amber-800" : "bg-[#D4A24D]/10"} rounded-lg`}
          >
            <div
              className={`text-3xl font-bold ${isDark ? "text-amber-300" : "text-[#D4A24D]"}`}
            >
              R$ 5.2M
            </div>
            <div
              className={`text-sm ${isDark ? "text-amber-300" : "text-[#c1923e]"} mt-1`}
            >
              Vendas (mês)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corretores;
