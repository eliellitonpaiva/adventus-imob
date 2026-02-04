import React, { useState } from "react";
import {
  PlusIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
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
    Novo: "bg-blue-100 text-blue-800",
    "Em contato": "bg-yellow-100 text-yellow-800",
    Convertido: "bg-green-100 text-green-800",
    Perdido: "bg-red-100 text-red-800",
  };

  const prioridadeColors = {
    Alta: "bg-red-100 text-red-800 border border-red-200",
    Média: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    Baixa: "bg-green-100 text-green-800 border border-green-200",
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
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600 mt-2">
            Gerencie e acompanhe todos os leads
          </p>
        </div>
        <Button
          variant="primary"
          className="mt-4 sm:mt-0"
          onClick={() => (window.location.href = "/admin/leads/novo")}
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {statusStats.total}
          </div>
          <div className="text-sm text-gray-600 mt-1">Total</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-blue-200 p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {statusStats.novo}
          </div>
          <div className="text-sm text-blue-800 mt-1">Novos</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {statusStats.contato}
          </div>
          <div className="text-sm text-yellow-800 mt-1">Em Contato</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-green-200 p-4 text-center">
          <div className="text-2xl font-bold text-green-600">
            {statusStats.convertido}
          </div>
          <div className="text-sm text-green-800 mt-1">Convertidos</div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-4 text-center">
          <div className="text-2xl font-bold text-red-600">
            {statusStats.perdido}
          </div>
          <div className="text-sm text-red-800 mt-1">Perdidos</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Button variant="outline">
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interesse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {lead.nome}
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {lead.data}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-700">
                        <EnvelopeIcon className="w-4 h-4 mr-2" />
                        {lead.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <PhoneIcon className="w-4 h-4 mr-2" />
                        {lead.telefone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {lead.imovelInteresse}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                      {lead.origem}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${prioridadeColors[lead.prioridade]}`}
                    >
                      {lead.prioridade}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
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
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Marcar como convertido"
                          >
                            <CheckCircleIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              console.log("Marcar como perdido:", lead.id)
                            }
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Marcar como perdido"
                          >
                            <XCircleIcon className="w-5 h-5" />
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

      {/* Conversion Tips */}
      <div className="mt-8 bg-[#31353E] text-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">
          Dicas para Conversão de Leads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white/10 rounded-lg">
            <h3 className="font-semibold text-[#D4A24D] mb-2">
              📞 Contato Rápido
            </h3>
            <p className="text-sm opacity-90">
              Leads respondidos em até 5 minutos têm 21x mais chances de
              conversão.
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            <h3 className="font-semibold text-[#D4A24D] mb-2">
              🎯 Segmentação
            </h3>
            <p className="text-sm opacity-90">
              Classifique os leads por interesse e prioridade para abordagens
              personalizadas.
            </p>
          </div>
          <div className="p-4 bg-white/10 rounded-lg">
            <h3 className="font-semibold text-[#D4A24D] mb-2">
              📊 Acompanhamento
            </h3>
            <p className="text-sm opacity-90">
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
