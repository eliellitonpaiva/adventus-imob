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
import Input from "../../componentes/ui/Input";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");

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

  const statusColors = {
    Novo: "bg-blue-50 text-blue-700 border border-blue-200",
    "Em contato": "bg-yellow-50 text-yellow-700 border border-yellow-200",
    Convertido: "bg-green-50 text-green-700 border border-green-200",
    Perdido: "bg-red-50 text-red-700 border border-red-200",
  };

  const prioridadeColors = {
    Alta: "bg-red-50 text-red-700 border border-red-200",
    Média: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    Baixa: "bg-green-50 text-green-700 border border-green-200",
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
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-sm text-gray-600 mt-1">
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

      {/* Stats - REDESENHADAS (mais compactas) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center hover:shadow-sm transition-shadow">
          <div className="text-xl font-bold text-gray-900">
            {statusStats.total}
          </div>
          <div className="text-xs text-gray-600 mt-1">Total</div>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-3 text-center hover:shadow-sm transition-shadow">
          <div className="text-xl font-bold text-blue-700">
            {statusStats.novo}
          </div>
          <div className="text-xs text-blue-800 mt-1">Novos</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-3 text-center hover:shadow-sm transition-shadow">
          <div className="text-xl font-bold text-yellow-700">
            {statusStats.contato}
          </div>
          <div className="text-xs text-yellow-800 mt-1">Em Contato</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-3 text-center hover:shadow-sm transition-shadow">
          <div className="text-xl font-bold text-green-700">
            {statusStats.convertido}
          </div>
          <div className="text-xs text-green-800 mt-1">Convertidos</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-3 text-center hover:shadow-sm transition-shadow">
          <div className="text-xl font-bold text-red-700">
            {statusStats.perdido}
          </div>
          <div className="text-xs text-red-800 mt-1">Perdidos</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-sm"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button variant="outline" size="sm">
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Leads List - TABELA OTIMIZADA */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interesse
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origem
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium text-gray-900 text-sm truncate max-w-[120px]">
                        {lead.nome}
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{lead.data}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-700 truncate">
                        <EnvelopeIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                        <span className="truncate">{lead.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <PhoneIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                        {lead.telefone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <button
                        onClick={() =>
                          (window.location.href = `/admin/imoveis/${lead.imovelCodigo}`)
                        }
                        className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm flex items-center"
                        title="Ver detalhes do imóvel"
                      >
                        <EyeIcon className="w-3 h-3 mr-1" />
                        {lead.imovelCodigo}
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 truncate max-w-[150px]">
                      {lead.imovelInteresse}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      {lead.origem}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${prioridadeColors[lead.prioridade]}`}
                    >
                      {lead.prioridade}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                          (window.location.href = `/admin/leads/${lead.id}`)
                        }
                      >
                        Detalhes
                      </Button>
                      {lead.status === "Novo" && (
                        <>
                          <button
                            onClick={() =>
                              console.log("Marcar como convertido:", lead.id)
                            }
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Marcar como convertido"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              console.log("Marcar como perdido:", lead.id)
                            }
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Marcar como perdido"
                          >
                            <XCircleIcon className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversion Tips - MAIS COMPACTO */}
      <div className="mt-6 bg-[#31353E] text-white rounded-lg shadow-sm p-4">
        <h2 className="text-lg font-semibold mb-3">
          Dicas para Conversão de Leads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-white/10 rounded">
            <h3 className="font-medium text-[#D4A24D] mb-1 text-sm">
              📞 Contato Rápido
            </h3>
            <p className="text-xs opacity-90">
              Leads respondidos em até 5 minutos têm 21x mais chances de
              conversão.
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded">
            <h3 className="font-medium text-[#D4A24D] mb-1 text-sm">
              🎯 Segmentação
            </h3>
            <p className="text-xs opacity-90">
              Classifique os leads por interesse e prioridade para abordagens
              personalizadas.
            </p>
          </div>
          <div className="p-3 bg-white/10 rounded">
            <h3 className="font-medium text-[#D4A24D] mb-1 text-sm">
              📊 Acompanhamento
            </h3>
            <p className="text-xs opacity-90">
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
