import React, { useState } from "react";
import {
  PlusIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const { isDark } = useTheme();

  const leads = [
    {
      id: 1,
      nome: "Carlos Mendes",
      email: "carlos@email.com",
      telefone: "(11) 99999-9999",
      imovelInteresse: "APT-001 - Apartamento 3 quartos",
      imovelCodigo: "APT-001",
      origem: "Site",
      status: "Novo",
      data: "2024-01-15 14:30",
      prioridade: "Alta",
    },
    {
      id: 2,
      nome: "Ana Paula Silva",
      email: "ana@email.com",
      telefone: "(11) 98888-8888",
      imovelInteresse: "CS-002 - Casa Jardins",
      imovelCodigo: "CS-002",
      origem: "WhatsApp",
      status: "Em contato",
      data: "2024-01-14 10:15",
      prioridade: "Média",
    },
    {
      id: 3,
      nome: "Roberto Almeida",
      email: "roberto@email.com",
      telefone: "(11) 97777-7777",
      imovelInteresse: "TER-004 - Terreno Itaim",
      imovelCodigo: "TER-004",
      origem: "Telefone",
      status: "Convertido",
      data: "2024-01-13 16:45",
      prioridade: "Baixa",
    },
    {
      id: 4,
      nome: "Fernanda Costa",
      email: "fernanda@email.com",
      telefone: "(11) 96666-6666",
      imovelInteresse: "APT-003 - Apartamento Centro",
      imovelCodigo: "APT-003",
      origem: "Site",
      status: "Perdido",
      data: "2024-01-12 09:20",
      prioridade: "Média",
    },
    {
      id: 5,
      nome: "Miguel Santos",
      email: "miguel@email.com",
      telefone: "(11) 95555-5555",
      imovelInteresse: "Vários imóveis",
      imovelCodigo: "MÚLTIPLOS",
      origem: "Indicação",
      status: "Novo",
      data: "2024-01-11 11:10",
      prioridade: "Alta",
    },
  ];

  const statusOptions = [
    { value: "todos", label: "Todos", color: "gray" },
    { value: "novo", label: "Novo", color: "blue" },
    { value: "em-contato", label: "Em contato", color: "yellow" },
    { value: "convertido", label: "Convertido", color: "green" },
    { value: "perdido", label: "Perdido", color: "red" },
  ];

  // Cores condicionais para dark mode - SEM BACKGROUNDS DESNECESSÁRIOS
  const statusColors = {
    Novo: isDark ? "text-blue-300" : "text-blue-600",
    "Em contato": isDark ? "text-yellow-300" : "text-yellow-600",
    Convertido: isDark ? "text-green-300" : "text-green-600",
    Perdido: isDark ? "text-red-300" : "text-red-600",
  };

  const prioridadeColors = {
    Alta: isDark ? "text-red-300" : "text-red-600",
    Média: isDark ? "text-yellow-300" : "text-yellow-600",
    Baixa: isDark ? "text-green-300" : "text-green-600",
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone.includes(searchTerm);

    const matchesStatus =
      selectedStatus === "todos" ||
      lead.status.toLowerCase() === selectedStatus.replace("-", " ");

    return matchesSearch && matchesStatus;
  });

  const statusStats = {
    total: leads.length,
    novo: leads.filter((l) => l.status === "Novo").length,
    contato: leads.filter((l) => l.status === "Em contato").length,
    convertido: leads.filter((l) => l.status === "Convertido").length,
    perdido: leads.filter((l) => l.status === "Perdido").length,
  };

  return (
    <div
      className={`p-6 ${isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Leads
          </h1>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
          >
            Gerencie e acompanhe todos os leads
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 sm:mt-0"
          onClick={() => (window.location.href = "/admin/leads/novo")}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Stats - COM BORDAS E BACKGROUNDS RESTAURADOS (CORRIGIDO) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {/* Total */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-200 text-gray-900"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {statusStats.total}
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
          >
            Total
          </div>
        </div>

        {/* Novo */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-blue-900/20 border-blue-800 text-blue-300"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-blue-300" : "text-blue-700"}`}
          >
            {statusStats.novo}
          </div>
          <div
            className={`text-xs ${isDark ? "text-blue-400" : "text-blue-800"} mt-1`}
          >
            Novos
          </div>
        </div>

        {/* Em Contato */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-yellow-900/20 border-yellow-800 text-yellow-300"
              : "bg-yellow-50 border-yellow-200 text-yellow-700"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-yellow-300" : "text-yellow-700"}`}
          >
            {statusStats.contato}
          </div>
          <div
            className={`text-xs ${isDark ? "text-yellow-400" : "text-yellow-800"} mt-1`}
          >
            Em Contato
          </div>
        </div>

        {/* Convertidos */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-green-900/20 border-green-800 text-green-300"
              : "bg-green-50 border-green-200 text-green-700"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-green-300" : "text-green-700"}`}
          >
            {statusStats.convertido}
          </div>
          <div
            className={`text-xs ${isDark ? "text-green-400" : "text-green-800"} mt-1`}
          >
            Convertidos
          </div>
        </div>

        {/* Perdidos */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-red-900/20 border-red-800 text-red-300"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-red-300" : "text-red-700"}`}
          >
            {statusStats.perdido}
          </div>
          <div
            className={`text-xs ${isDark ? "text-red-400" : "text-red-800"} mt-1`}
          >
            Perdidos
          </div>
        </div>
      </div>

      {/* Filters - CORREÇÃO: Botão Filtros com classes explícitas */}
      <div
        className={`rounded-lg p-4 mb-4 ${
          isDark ? "border-gray-700" : "border-gray-300"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nome, email ou telefone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`
                  w-full px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-sm
                  ${
                    isDark
                      ? "bg-gray-800 text-gray-200 placeholder-gray-400"
                      : "bg-white text-gray-900 placeholder-gray-500"
                  }
                `}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className={`
                px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-sm
                ${
                  isDark
                    ? "bg-gray-800 text-gray-200"
                    : "bg-white text-gray-900"
                }
              `}
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {/* CORREÇÃO: Botão Filtros com classes explícitas para modo claro */}
            <button
              className={`
                px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-sm flex items-center
                appearance-none border
                ${
                  isDark
                    ? "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700"
                    : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"
                }
              `}
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Leads List - TABELA COM LINHAS VERTICAIS E MELHORIAS */}
      <div
        className={`rounded-lg overflow-hidden border ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
              <tr>
                {/* COLUNAS COM BORDAS VERTICAIS E TÍTULOS CENTRALIZADOS */}
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${
                    isDark
                      ? "text-gray-300 border-gray-700"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  Lead
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${
                    isDark
                      ? "text-gray-300 border-gray-700"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  Contato
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${
                    isDark
                      ? "text-gray-300 border-gray-700"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  Interesse
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${
                    isDark
                      ? "text-gray-300 border-gray-700"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  Origem
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${
                    isDark
                      ? "text-gray-300 border-gray-700"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  Status
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${
                    isDark
                      ? "text-gray-300 border-gray-700"
                      : "text-gray-600 border-gray-300"
                  }`}
                >
                  Prioridade
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead, index) => (
                <tr
                  key={lead.id}
                  className={`
                    ${isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"} 
                    transition-colors
                    ${index !== filteredLeads.length - 1 ? (isDark ? "border-b border-gray-700" : "border-b border-gray-200") : ""}
                  `}
                >
                  {/* CÉLULAS COM BORDAS VERTICAIS E ALINHAMENTO */}
                  <td
                    className={`px-4 py-3 text-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      <div
                        className={`font-medium text-sm ${
                          isDark ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {lead.nome}
                      </div>
                      <div
                        className={`flex items-center text-xs mt-1 ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{lead.data}</span>
                      </div>
                    </div>
                  </td>

                  <td
                    className={`px-4 py-3 text-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    <div className="space-y-1">
                      <div
                        className={`flex items-center justify-center text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <EnvelopeIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div
                        className={`flex items-center justify-center text-sm ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <PhoneIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                        {lead.telefone}
                      </div>
                    </div>
                  </td>

                  <td
                    className={`px-4 py-3 text-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    <div className="flex flex-col items-center justify-center">
                      {/* CORREÇÃO CRÍTICA: Botão link do imóvel com classes explícitas */}
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/imoveis/${lead.imovelCodigo}`)
                        }
                        className={`
                          font-medium text-sm flex items-center hover:underline mb-1
                          appearance-none bg-transparent border-none
                          ${
                            isDark
                              ? "text-blue-400 hover:text-blue-300"
                              : "text-blue-600 hover:text-blue-800"
                          }
                        `}
                        title="Ver detalhes do imóvel"
                      >
                        <EyeIcon
                          className={`w-3 h-3 mr-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}
                        />
                        {lead.imovelCodigo}
                      </button>
                      <div
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {lead.imovelInteresse}
                      </div>
                    </div>
                  </td>

                  <td
                    className={`px-4 py-3 text-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {lead.origem}
                    </span>
                  </td>

                  <td
                    className={`px-4 py-3 text-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${statusColors[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </td>

                  <td
                    className={`px-4 py-3 text-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    <span
                      className={`text-xs font-medium ${prioridadeColors[lead.prioridade]}`}
                    >
                      {lead.prioridade}
                    </span>
                  </td>

                  {/* AÇÕES - CORRIGIDO: Todos os botões "Detalhes" perfeitamente alinhados */}
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1 min-h-[2rem]">
                      {/* Botão Detalhes - SEMPRE NA MESMA POSIÇÃO */}
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/leads/${lead.id}`)
                        }
                        className={`
                          px-2 py-1 text-xs rounded transition-colors font-medium
                          ${
                            isDark
                              ? "text-gray-300 hover:text-gray-100"
                              : "bg-[#D4A24D] text-white hover:bg-[#C19137]"
                          }
                        `}
                      >
                        Detalhes
                      </button>

                      {/* Botões Convertido/Perdido - APENAS para "Novo" e "Em contato" */}
                      {lead.status === "Novo" ||
                      lead.status === "Em contato" ? (
                        <>
                          {/* Botão Convertido */}
                          <button
                            onClick={() =>
                              console.log("Marcar como convertido:", lead.id)
                            }
                            className={`
                              p-1 rounded transition-colors flex items-center justify-center
                              appearance-none bg-transparent border-none
                              ${
                                isDark
                                  ? "text-green-400 hover:text-green-300"
                                  : "text-green-600 hover:text-green-700"
                              }
                            `}
                            title="Marcar como convertido"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>

                          {/* Botão Perdido */}
                          <button
                            onClick={() =>
                              console.log("Marcar como perdido:", lead.id)
                            }
                            className={`
                              p-1 rounded transition-colors flex items-center justify-center
                              appearance-none bg-transparent border-none
                              ${
                                isDark
                                  ? "text-red-400 hover:text-red-300"
                                  : "text-red-600 hover:text-red-700"
                              }
                            `}
                            title="Marcar como perdido"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        /* ESPAÇO RESERVADO - Mantém o alinhamento mesmo sem botões */
                        <div className="flex gap-1">
                          {/* Ícone invisível para ocupar espaço */}
                          <div className="w-6 h-6 opacity-0">
                            <CheckCircleIcon className="w-4 h-4" />
                          </div>
                          <div className="w-6 h-6 opacity-0">
                            <XCircleIcon className="w-4 h-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Tips - com dark mode */}
      <div
        className={`mt-6 rounded-lg shadow-sm p-4 ${
          isDark ? "bg-gray-800 text-gray-100" : "bg-[#31353E] text-white"
        }`}
      >
        <h2 className="text-lg font-semibold mb-3">
          Dicas para Conversão de Leads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-3 rounded ${
              isDark ? "bg-gray-700/50" : "bg-white/10"
            }`}
          >
            <h3
              className={`font-medium mb-1 text-sm ${
                isDark ? "text-[#F3D9A4]" : "text-[#D4A24D]"
              }`}
            >
              📞 Contato Rápido
            </h3>
            <p className={`text-xs ${isDark ? "text-gray-300" : "opacity-90"}`}>
              Leads respondidos em até 5 minutos têm 21x mais chances de
              conversão.
            </p>
          </div>
          <div
            className={`p-3 rounded ${
              isDark ? "bg-gray-700/50" : "bg-white/10"
            }`}
          >
            <h3
              className={`font-medium mb-1 text-sm ${
                isDark ? "text-[#F3D9A4]" : "text-[#D4A24D]"
              }`}
            >
              🎯 Segmentação
            </h3>
            <p className={`text-xs ${isDark ? "text-gray-300" : "opacity-90"}`}>
              Classifique os leads por interesse e prioridade para abordagens
              personalizadas.
            </p>
          </div>
          <div
            className={`p-3 rounded ${
              isDark ? "bg-gray-700/50" : "bg-white/10"
            }`}
          >
            <h3
              className={`font-medium mb-1 text-sm ${
                isDark ? "text-[#F3D9A4]" : "text-[#D4A24D]"
              }`}
            >
              📊 Acompanhamento
            </h3>
            <p className={`text-xs ${isDark ? "text-gray-300" : "opacity-90"}`}>
              Mantenha histórico de contatos e seguimentos para aumentar a
              conversão.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leads;
