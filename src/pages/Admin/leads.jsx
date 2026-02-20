// src/pages/Admin/Leads.jsx
import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  FunnelIcon,
  EnvelopeIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  XMarkIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("todos");
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isDark } = useTheme();

  // =============== STATE PARA O MODAL ===============
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [observacoes, setObservacoes] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horaAgendamento, setHoraAgendamento] = useState("");
  const [localReuniao, setLocalReuniao] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusSelecionado, setStatusSelecionado] = useState(null);
  // Removido tipoAgendamentoSelecionado pois não precisamos mais

  // =============== BUSCAR LEADS DO SUPABASE ===============
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);

      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (leadsError) throw leadsError;
      setLeads(leadsData || []);
    } catch (err) {
      console.error("Erro ao buscar leads:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // =============== ATUALIZAR STATUS DO LEAD ===============
  const atualizarStatus = async (id, novoStatus) => {
    try {
      setUpdatingStatus(true);

      const updates = {
        status: novoStatus,
        updated_at: new Date().toISOString(),
      };

      if (observacoes.trim()) {
        updates.ultima_observacao = observacoes;
        updates.ultimo_contato = new Date().toISOString();
      }

      const { error } = await supabase
        .from("leads")
        .update(updates)
        .eq("id", id);

      if (error) throw error;

      const leadsAtualizados = leads.map((lead) =>
        lead.id === id ? { ...lead, ...updates } : lead,
      );
      setLeads(leadsAtualizados);

      const leadAtualizado = leadsAtualizados.find((lead) => lead.id === id);
      setSelectedLead(leadAtualizado);
      setStatusSelecionado(novoStatus);
      setObservacoes("");
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status. Tente novamente.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =============== LIMPAR CAMPOS DO MODAL ===============
  const limparCamposModal = () => {
    setObservacoes("");
    setStatusSelecionado(null);
    setSelectedLead(null);
  };

  // =============== ABRIR MODAL DE DETALHES ===============
  const abrirModalDetalhes = (lead) => {
    setSelectedLead(lead);
    setStatusSelecionado(lead.status);
    setModalOpen(true);
  };

  // =============== FECHAR MODAL ===============
  const fecharModal = () => {
    setModalOpen(false);
    limparCamposModal();
  };

  // =============== EXCLUIR LEAD ===============
  const excluirLead = async (id, nome) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o lead "${nome}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      try {
        const { error } = await supabase.from("leads").delete().eq("id", id);
        if (error) throw error;
        setLeads(leads.filter((lead) => lead.id !== id));
      } catch (err) {
        console.error("Erro ao excluir lead:", err);
        alert("Erro ao excluir lead. Tente novamente.");
      }
    }
  };

  // =============== FORMATAR TELEFONE PARA WHATSAPP ===============
  const formatarTelefoneWhatsApp = (telefone) => {
    const numeros = telefone.replace(/\D/g, "");
    return `55${numeros}`;
  };

  // =============== GERAR LINK DO WHATSAPP ===============
  const gerarLinkWhatsApp = (telefone, nome, imovelCodigo) => {
    const numeroFormatado = formatarTelefoneWhatsApp(telefone);
    const mensagem = encodeURIComponent(
      `Olá ${nome}! Tudo bem? Vi que você tem interesse no imóvel ${imovelCodigo || "nosso imóvel"}. Como posso ajudar?`,
    );
    return `https://wa.me/${numeroFormatado}?text=${mensagem}`;
  };

  // =============== OPÇÕES DE STATUS ATUALIZADAS ===============
  const statusOptions = [
    { value: "todos", label: "Todos", color: "gray" },
    { value: "novo", label: "Novo", color: "blue" },
    { value: "em contato", label: "Em Contato", color: "yellow" },
    { value: "qualificado", label: "Qualificado", color: "purple" },
    { value: "proposta", label: "Proposta", color: "indigo" },
    { value: "fechado", label: "Fechado", color: "green" },
    { value: "perdido", label: "Perdido", color: "red" },
  ];

  // Cores condicionais para dark mode
  const statusColors = {
    novo: isDark ? "text-blue-300" : "text-blue-600",
    "em contato": isDark ? "text-yellow-300" : "text-yellow-600",
    qualificado: isDark ? "text-purple-300" : "text-purple-600",
    proposta: isDark ? "text-indigo-300" : "text-indigo-600",
    fechado: isDark ? "text-green-300" : "text-green-600",
    perdido: isDark ? "text-red-300" : "text-red-600",
  };

  const prioridadeColors = {
    alta: isDark ? "text-red-300" : "text-red-600",
    media: isDark ? "text-yellow-300" : "text-yellow-600",
    baixa: isDark ? "text-green-300" : "text-green-600",
  };

  // Filtrar leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone?.includes(searchTerm);

    const matchesStatus =
      selectedStatus === "todos" || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Estatísticas atualizadas
  const statusStats = {
    total: leads.length,
    novo: leads.filter((l) => l.status === "novo").length,
    contato: leads.filter((l) => l.status === "em contato").length,
    qualificado: leads.filter((l) => l.status === "qualificado").length,
    proposta: leads.filter((l) => l.status === "proposta").length,
    fechado: leads.filter((l) => l.status === "fechado").length,
    perdido: leads.filter((l) => l.status === "perdido").length,
  };

  // Formatar data
  const formatarData = (dataISO) => {
    if (!dataISO) return "";
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarDataCompleta = (dataISO) => {
    if (!dataISO) return "";
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div
        className={`p-6 ${isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"} flex items-center justify-center`}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4A24D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={isDark ? "text-gray-300" : "text-gray-600"}>
            Carregando leads...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`p-6 ${isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"} flex items-center justify-center`}
      >
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2
            className={`text-xl font-bold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Erro ao carregar leads
          </h2>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{error}</p>
          <button
            onClick={fetchLeads}
            className="mt-4 px-4 py-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#C19137]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
            Gerencie e acompanhe todos os leads capturados
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

      {/* Stats - ATUALIZADO */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
        {/* Total */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            {statusStats.total}
          </div>
          <div
            className={`flex items-center justify-center gap-1 text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Total</span>
          </div>
        </div>

        {/* Novo */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-blue-900/20 border-blue-800"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-blue-300" : "text-blue-700"}`}
          >
            {statusStats.novo}
          </div>
          <div
            className={`flex items-center justify-center gap-1 text-xs ${isDark ? "text-blue-400" : "text-blue-800"} mt-1`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span>Novos</span>
          </div>
        </div>

        {/* Em Contato */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-yellow-900/20 border-yellow-800"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-yellow-300" : "text-yellow-700"}`}
          >
            {statusStats.contato}
          </div>
          <div
            className={`flex items-center justify-center gap-1 text-xs ${isDark ? "text-yellow-400" : "text-yellow-800"} mt-1`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Contato</span>
          </div>
        </div>

        {/* Qualificado */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-purple-900/20 border-purple-800"
              : "bg-purple-50 border-purple-200"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-purple-300" : "text-purple-700"}`}
          >
            {statusStats.qualificado}
          </div>
          <div
            className={`flex items-center justify-center gap-1 text-xs ${isDark ? "text-purple-400" : "text-purple-800"} mt-1`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
            <span>Qualificado</span>
          </div>
        </div>

        {/* Proposta */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-indigo-900/20 border-indigo-800"
              : "bg-indigo-50 border-indigo-200"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-indigo-300" : "text-indigo-700"}`}
          >
            {statusStats.proposta}
          </div>
          <div
            className={`flex items-center justify-center gap-1 text-xs ${isDark ? "text-indigo-400" : "text-indigo-800"} mt-1`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Proposta</span>
          </div>
        </div>

        {/* Fechados */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-green-900/20 border-green-800"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-green-300" : "text-green-700"}`}
          >
            {statusStats.fechado}
          </div>
          <div
            className={`flex items-center justify-center gap-1 text-xs ${isDark ? "text-green-400" : "text-green-800"} mt-1`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Fechados</span>
          </div>
        </div>

        {/* Perdidos */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-red-300" : "text-red-700"}`}
          >
            {statusStats.perdido}
          </div>
          <div
            className={`flex items-center justify-center gap-1 text-xs ${isDark ? "text-red-400" : "text-red-800"} mt-1`}
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Perdidos</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div
        className={`rounded-lg p-4 mb-4 ${isDark ? "border-gray-700" : "border-gray-300"}`}
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
                  ${isDark ? "bg-gray-800 text-gray-200 placeholder-gray-400 border border-gray-700" : "bg-white text-gray-900 placeholder-gray-500 border border-gray-300"}
                `}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className={`
                px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-sm border
                ${isDark ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-gray-900 border-gray-300"}
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
            <button
              className={`
                px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-sm flex items-center appearance-none border
                ${isDark ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700" : "bg-transparent border-gray-300 text-gray-700 hover:bg-gray-50"}
              `}
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div
        className={`rounded-lg overflow-hidden border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
              <tr>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${isDark ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-300"}`}
                >
                  Lead
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${isDark ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-300"}`}
                >
                  Contato
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${isDark ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-300"}`}
                >
                  Interesse
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${isDark ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-300"}`}
                >
                  Origem
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${isDark ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-300"}`}
                >
                  Status
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider border-r ${isDark ? "text-gray-300 border-gray-700" : "text-gray-600 border-gray-300"}`}
                >
                  Prioridade
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${isDark ? "text-gray-300" : "text-gray-600"}`}
                >
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                      Nenhum lead encontrado
                    </p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead, index) => (
                  <tr
                    key={lead.id}
                    className={`
                      ${isDark ? "hover:bg-gray-750" : "hover:bg-gray-50"} 
                      transition-colors
                      ${index !== filteredLeads.length - 1 ? (isDark ? "border-b border-gray-700" : "border-b border-gray-200") : ""}
                    `}
                  >
                    {/* Lead */}
                    <td
                      className={`px-4 py-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <div
                          className={`font-medium text-sm ${isDark ? "text-gray-100" : "text-gray-900"}`}
                        >
                          {lead.nome}
                        </div>
                        <div
                          className={`flex items-center text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          <ClockIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span>{formatarData(lead.created_at)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contato */}
                    <td
                      className={`px-4 py-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <div className="space-y-1">
                        <div
                          className={`flex items-center justify-center text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <EnvelopeIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate">{lead.email || "-"}</span>
                        </div>
                        <div
                          className={`flex items-center justify-center text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <PhoneIcon className="w-3 h-3 mr-2 flex-shrink-0 text-green-600 dark:text-green-400" />
                          <a
                            href={gerarLinkWhatsApp(
                              lead.telefone,
                              lead.nome,
                              lead.imovel_codigo,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`hover:underline ${isDark ? "text-green-400 hover:text-green-300" : "text-green-600 hover:text-green-800"}`}
                            title="Abrir conversa no WhatsApp"
                          >
                            {lead.telefone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* Interesse */}
                    <td
                      className={`px-4 py-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <div className="flex flex-col items-center justify-center">
                        <button
                          onClick={async () => {
                            if (lead.imovel_codigo) {
                              try {
                                const { data } = await supabase
                                  .from("imoveis")
                                  .select("slug")
                                  .ilike("codigo", lead.imovel_codigo)
                                  .maybeSingle();
                                if (data?.slug)
                                  window.open(`/imovel/${data.slug}`, "_blank");
                              } catch (error) {
                                console.error("Erro ao buscar imóvel:", error);
                              }
                            }
                          }}
                          className={`
                            font-medium text-sm flex items-center hover:underline mb-1 appearance-none bg-transparent border-none
                            ${lead.imovel_codigo ? (isDark ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-800") : "text-gray-500 cursor-default"}
                          `}
                          title={
                            lead.imovel_codigo
                              ? "Ver imóvel no site"
                              : "Sem imóvel específico"
                          }
                          disabled={!lead.imovel_codigo}
                        >
                          <EyeIcon
                            className={`w-3 h-3 mr-1 ${lead.imovel_codigo ? (isDark ? "text-blue-400" : "text-blue-600") : "text-gray-400"}`}
                          />
                          {lead.imovel_codigo || "—"}
                        </button>
                        <div
                          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        >
                          {lead.imovel_codigo
                            ? lead.imovel_codigo
                            : "Interesse geral"}
                        </div>
                      </div>
                    </td>

                    {/* Origem */}
                    <td
                      className={`px-4 py-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <span
                        className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {lead.origem || "Site"}
                      </span>
                    </td>

                    {/* Status - ATUALIZADO */}
                    <td
                      className={`px-4 py-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <div className="flex items-center justify-center gap-1.5">
                        {lead.status === "novo" && (
                          <svg
                            className={`w-4 h-4 ${statusColors[lead.status]}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        )}
                        {lead.status === "em contato" && (
                          <svg
                            className={`w-4 h-4 ${statusColors[lead.status]}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        )}
                        {lead.status === "qualificado" && (
                          <svg
                            className={`w-4 h-4 ${statusColors[lead.status]}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                        )}
                        {lead.status === "proposta" && (
                          <svg
                            className={`w-4 h-4 ${statusColors[lead.status]}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                        {lead.status === "fechado" && (
                          <svg
                            className={`w-4 h-4 ${statusColors[lead.status]}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {lead.status === "perdido" && (
                          <svg
                            className={`w-4 h-4 ${statusColors[lead.status]}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        <span
                          className={`text-xs font-medium ${statusColors[lead.status]}`}
                        >
                          {lead.status === "novo"
                            ? "Novo"
                            : lead.status === "em contato"
                              ? "Em Contato"
                              : lead.status === "qualificado"
                                ? "Qualificado"
                                : lead.status === "proposta"
                                  ? "Proposta"
                                  : lead.status === "fechado"
                                    ? "Fechado"
                                    : "Perdido"}
                        </span>
                      </div>
                    </td>

                    {/* Prioridade */}
                    <td
                      className={`px-4 py-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <span
                        className={`text-xs font-medium ${prioridadeColors[lead.prioridade] || (isDark ? "text-gray-300" : "text-gray-700")}`}
                      >
                        {lead.prioridade?.charAt(0).toUpperCase() +
                          lead.prioridade?.slice(1) || "Alta"}
                      </span>
                    </td>

                    {/* Ações - SIMPLIFICADO */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => abrirModalDetalhes(lead)}
                          className={`
                            px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5
                            ${
                              isDark
                                ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                                : "bg-[#D4A24D] text-white hover:bg-[#C19137] shadow-sm"
                            }
                          `}
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <span>Detalhes</span>
                        </button>

                        <button
                          onClick={() => excluirLead(lead.id, lead.nome)}
                          className={`
                            p-1.5 rounded-lg transition-all
                            ${
                              isDark
                                ? "text-gray-400 hover:text-red-400 hover:bg-gray-700"
                                : "text-gray-500 hover:text-red-600 hover:bg-gray-100"
                            }
                          `}
                          title="Excluir lead"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DE DETALHES - ATUALIZADO */}
      {modalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
            onClick={fecharModal}
          />
          <div className="flex min-h-full items-center justify-center p-4">
            <div
              className={`relative w-full max-w-2xl rounded-xl shadow-2xl transform transition-all ${isDark ? "bg-gray-800" : "bg-white"}`}
            >
              {/* Header */}
              <div
                className={`flex items-center justify-between p-5 rounded-t-xl ${isDark ? "bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700" : "bg-gradient-to-r from-[#D4A24D]/10 to-[#F3D9A4]/5 border-b border-gray-200"}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${isDark ? "bg-[#D4A24D]/20" : "bg-[#D4A24D]/10"}`}
                  >
                    <UserGroupIcon
                      className={`w-6 h-6 ${isDark ? "text-[#D4A24D]" : "text-[#D4A24D]"}`}
                    />
                  </div>
                  <div>
                    <h2
                      className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                    >
                      {selectedLead.nome}
                    </h2>
                    <p
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Lead #{selectedLead.id.slice(0, 8)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={fecharModal}
                  className={`p-2 rounded-lg transition-all hover:scale-110 ${isDark ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto custom-scrollbar">
                {/* INFORMAÇÕES DE CONTATO */}
                <div
                  className={`rounded-xl overflow-hidden border-2 ${isDark ? "bg-gray-700/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                >
                  <div
                    className={`px-4 py-2 flex items-center gap-2 border-b ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-100 border-gray-200"}`}
                  >
                    <div className="p-1 rounded-md bg-[#D4A24D]/20">
                      <UserGroupIcon className="w-4 h-4 text-[#D4A24D]" />
                    </div>
                    <span
                      className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      INFORMAÇÕES DE CONTATO
                    </span>
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                        <EnvelopeIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p
                          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          E-mail
                        </p>
                        <p
                          className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
                        >
                          {selectedLead.email || "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                        <PhoneIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p
                          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          WhatsApp
                        </p>
                        <a
                          href={gerarLinkWhatsApp(
                            selectedLead.telefone,
                            selectedLead.nome,
                            selectedLead.imovel_codigo,
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`text-sm font-medium hover:underline ${isDark ? "text-green-400" : "text-green-600"}`}
                        >
                          {selectedLead.telefone || "—"}
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 col-span-2">
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                        <CalendarIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p
                          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          Cadastrado em
                        </p>
                        <p
                          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {formatarDataCompleta(selectedLead.created_at)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* IMÓVEL DE INTERESSE */}
                {selectedLead.imovel_codigo && (
                  <div
                    className={`rounded-xl overflow-hidden border-2 ${isDark ? "bg-gray-700/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                  >
                    <div
                      className={`px-4 py-2 flex items-center gap-2 border-b ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-100 border-gray-200"}`}
                    >
                      <div className="p-1 rounded-md bg-[#D4A24D]/20">
                        <HomeIcon className="w-4 h-4 text-[#D4A24D]" />
                      </div>
                      <span
                        className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        IMÓVEL DE INTERESSE
                      </span>
                    </div>
                    <div className="p-4">
                      <button
                        onClick={async () => {
                          try {
                            const { data } = await supabase
                              .from("imoveis")
                              .select("slug")
                              .ilike("codigo", selectedLead.imovel_codigo)
                              .maybeSingle();
                            if (data?.slug)
                              window.open(`/imovel/${data.slug}`, "_blank");
                          } catch (error) {
                            console.error("Erro ao buscar imóvel:", error);
                          }
                        }}
                        className="flex items-center gap-3 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-600 p-2 rounded-lg transition-all"
                      >
                        <div className="p-2 rounded-lg bg-[#D4A24D]/20">
                          <HomeIcon className="w-5 h-5 text-[#D4A24D]" />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
                          >
                            {selectedLead.imovel_codigo}
                          </p>
                          <p
                            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            Clique para ver detalhes do imóvel
                          </p>
                        </div>
                        <EyeIcon className="w-5 h-5 ml-auto text-[#D4A24D]" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STATUS ATUAL - ATUALIZADO */}
                <div
                  className={`rounded-xl overflow-hidden border-2 relative ${isDark ? "bg-gray-700/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#D4A24D]/5 rounded-bl-full"></div>
                  <div
                    className={`px-4 py-2 flex items-center gap-2 border-b relative z-10 ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-100 border-gray-200"}`}
                  >
                    <div className="p-1 rounded-md bg-[#D4A24D]/20">
                      <CheckCircleIcon className="w-4 h-4 text-[#D4A24D]" />
                    </div>
                    <span
                      className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      STATUS ATUAL
                    </span>
                  </div>
                  <div className="p-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-xl ${selectedLead.status === "novo" ? "bg-blue-500/15" : ""} ${selectedLead.status === "em contato" ? "bg-yellow-500/15" : ""} ${selectedLead.status === "qualificado" ? "bg-purple-500/15" : ""} ${selectedLead.status === "proposta" ? "bg-indigo-500/15" : ""} ${selectedLead.status === "fechado" ? "bg-green-500/15" : ""} ${selectedLead.status === "perdido" ? "bg-red-500/15" : ""}`}
                      >
                        {selectedLead.status === "novo" && (
                          <svg
                            className="w-8 h-8 text-blue-600 dark:text-blue-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        )}
                        {selectedLead.status === "em contato" && (
                          <svg
                            className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        )}
                        {selectedLead.status === "qualificado" && (
                          <svg
                            className="w-8 h-8 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                            />
                          </svg>
                        )}
                        {selectedLead.status === "proposta" && (
                          <svg
                            className="w-8 h-8 text-indigo-600 dark:text-indigo-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        )}
                        {selectedLead.status === "fechado" && (
                          <svg
                            className="w-8 h-8 text-green-600 dark:text-green-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                        {selectedLead.status === "perdido" && (
                          <svg
                            className="w-8 h-8 text-red-600 dark:text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p
                          className={`text-lg font-semibold ${selectedLead.status === "novo" ? "text-blue-600 dark:text-blue-400" : ""} ${selectedLead.status === "em contato" ? "text-yellow-600 dark:text-yellow-400" : ""} ${selectedLead.status === "qualificado" ? "text-purple-600 dark:text-purple-400" : ""} ${selectedLead.status === "proposta" ? "text-indigo-600 dark:text-indigo-400" : ""} ${selectedLead.status === "fechado" ? "text-green-600 dark:text-green-400" : ""} ${selectedLead.status === "perdido" ? "text-red-600 dark:text-red-400" : ""}`}
                        >
                          {selectedLead.status === "novo"
                            ? "Lead Novo"
                            : selectedLead.status === "em contato"
                              ? "Em Contato"
                              : selectedLead.status === "qualificado"
                                ? "Qualificado"
                                : selectedLead.status === "proposta"
                                  ? "Proposta Enviada"
                                  : selectedLead.status === "fechado"
                                    ? "Negócio Fechado"
                                    : "Lead Perdido"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTÕES DE STATUS - ATUALIZADO */}
                <div
                  className={`rounded-xl overflow-hidden border-2 ${isDark ? "bg-gray-700/30 border-gray-700" : "bg-gray-50 border-gray-200"}`}
                >
                  <div
                    className={`px-4 py-2 flex items-center gap-2 border-b ${isDark ? "bg-gray-700/50 border-gray-700" : "bg-gray-100 border-gray-200"}`}
                  >
                    <div className="p-1 rounded-md bg-[#D4A24D]/20">
                      <svg
                        className="w-4 h-4 text-[#D4A24D]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </div>
                    <span
                      className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      ATUALIZAR STATUS
                    </span>
                  </div>

                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2">
                      {/* Novo */}
                      <button
                        onClick={() => {
                          setStatusSelecionado("novo");
                          atualizarStatus(selectedLead.id, "novo");
                        }}
                        disabled={updatingStatus}
                        className={`relative py-3 px-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1.5 font-medium text-xs ${statusSelecionado === "novo" ? "bg-blue-500 text-white shadow-sm" : isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"} ${updatingStatus ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span>Novo</span>
                        {statusSelecionado === "novo" && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-300 rounded-full"></span>
                        )}
                      </button>

                      {/* Em Contato */}
                      <button
                        onClick={() => {
                          setStatusSelecionado("em contato");
                          atualizarStatus(selectedLead.id, "em contato");
                        }}
                        disabled={updatingStatus}
                        className={`relative py-3 px-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1.5 font-medium text-xs ${statusSelecionado === "em contato" ? "bg-yellow-500 text-white shadow-sm" : isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"} ${updatingStatus ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                        <span>Contato</span>
                        {statusSelecionado === "em contato" && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full"></span>
                        )}
                      </button>

                      {/* Qualificado */}
                      <button
                        onClick={() => {
                          setStatusSelecionado("qualificado");
                          atualizarStatus(selectedLead.id, "qualificado");
                        }}
                        disabled={updatingStatus}
                        className={`relative py-3 px-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1.5 font-medium text-xs ${statusSelecionado === "qualificado" ? "bg-purple-500 text-white shadow-sm" : isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"} ${updatingStatus ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                        <span>Qualificado</span>
                        {statusSelecionado === "qualificado" && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-300 rounded-full"></span>
                        )}
                      </button>

                      {/* Proposta */}
                      <button
                        onClick={() => {
                          setStatusSelecionado("proposta");
                          atualizarStatus(selectedLead.id, "proposta");
                        }}
                        disabled={updatingStatus}
                        className={`relative py-3 px-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1.5 font-medium text-xs ${statusSelecionado === "proposta" ? "bg-indigo-500 text-white shadow-sm" : isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"} ${updatingStatus ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        <span>Proposta</span>
                        {statusSelecionado === "proposta" && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-300 rounded-full"></span>
                        )}
                      </button>

                      {/* Fechado */}
                      <button
                        onClick={() => {
                          setStatusSelecionado("fechado");
                          atualizarStatus(selectedLead.id, "fechado");
                        }}
                        disabled={updatingStatus}
                        className={`relative py-3 px-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1.5 font-medium text-xs ${statusSelecionado === "fechado" ? "bg-green-500 text-white shadow-sm" : isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"} ${updatingStatus ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Fechado</span>
                        {statusSelecionado === "fechado" && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-300 rounded-full"></span>
                        )}
                      </button>

                      {/* Perdido */}
                      <button
                        onClick={() => {
                          setStatusSelecionado("perdido");
                          atualizarStatus(selectedLead.id, "perdido");
                        }}
                        disabled={updatingStatus}
                        className={`relative py-3 px-2 rounded-lg transition-all duration-200 flex flex-col items-center gap-1.5 font-medium text-xs ${statusSelecionado === "perdido" ? "bg-red-500 text-white shadow-sm" : isDark ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700" : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"} ${updatingStatus ? "opacity-50 cursor-not-allowed" : "hover:scale-[1.02]"}`}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Perdido</span>
                        {statusSelecionado === "perdido" && (
                          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-300 rounded-full"></span>
                        )}
                      </button>
                    </div>

                    {/* Observações */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-4 h-4 text-[#D4A24D]" />
                        Observações
                      </label>
                      <textarea
                        value={observacoes}
                        onChange={(e) => setObservacoes(e.target.value)}
                        rows="3"
                        className={`w-full px-3 py-2 text-sm rounded-lg border-2 transition-all focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] ${isDark ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"}`}
                        placeholder="Digite observações sobre este contato..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t rounded-b-xl flex justify-end gap-3 ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
              >
                <button
                  onClick={fecharModal}
                  disabled={updatingStatus}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${isDark ? "bg-gray-700 text-gray-300 hover:bg-gray-600" : "bg-gray-100 text-gray-700 hover:bg-gray-200"} ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Cancelar
                </button>
                <button
                  onClick={fecharModal}
                  disabled={updatingStatus}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all bg-[#D4A24D] text-white hover:bg-[#C19137] shadow-lg shadow-[#D4A24D]/30 ${updatingStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {updatingStatus ? "Processando..." : "Concluído"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Tips */}
      <div
        className={`mt-6 rounded-lg shadow-sm p-4 ${isDark ? "bg-gray-800 text-gray-100" : "bg-[#31353E] text-white"}`}
      >
        <h2 className="text-lg font-semibold mb-3">
          Dicas para Conversão de Leads
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`p-3 rounded ${isDark ? "bg-gray-700/50" : "bg-white/10"}`}
          >
            <h3
              className={`font-medium mb-1 text-sm ${isDark ? "text-[#F3D9A4]" : "text-[#D4A24D]"}`}
            >
              📞 Contato Rápido
            </h3>
            <p className={`text-xs ${isDark ? "text-gray-300" : "opacity-90"}`}>
              Leads respondidos em até 5 minutos têm 21x mais chances de
              conversão.
            </p>
          </div>
          <div
            className={`p-3 rounded ${isDark ? "bg-gray-700/50" : "bg-white/10"}`}
          >
            <h3
              className={`font-medium mb-1 text-sm ${isDark ? "text-[#F3D9A4]" : "text-[#D4A24D]"}`}
            >
              🎯 Segmentação
            </h3>
            <p className={`text-xs ${isDark ? "text-gray-300" : "opacity-90"}`}>
              Classifique os leads por interesse e prioridade para abordagens
              personalizadas.
            </p>
          </div>
          <div
            className={`p-3 rounded ${isDark ? "bg-gray-700/50" : "bg-white/10"}`}
          >
            <h3
              className={`font-medium mb-1 text-sm ${isDark ? "text-[#F3D9A4]" : "text-[#D4A24D]"}`}
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
