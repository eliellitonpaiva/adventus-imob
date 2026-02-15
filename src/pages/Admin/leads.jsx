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

  // =============== BUSCAR LEADS DO SUPABASE ===============
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setLeads(data || []);
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
      const { error } = await supabase
        .from("leads")
        .update({
          status: novoStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      // Atualizar lista local
      setLeads(
        leads.map((lead) =>
          lead.id === id ? { ...lead, status: novoStatus } : lead,
        ),
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao atualizar status. Tente novamente.");
    }
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

        // Atualizar lista local removendo o lead excluído
        setLeads(leads.filter((lead) => lead.id !== id));
      } catch (err) {
        console.error("Erro ao excluir lead:", err);
        alert("Erro ao excluir lead. Tente novamente.");
      }
    }
  };

  // =============== FORMATAR TELEFONE PARA WHATSAPP ===============
  const formatarTelefoneWhatsApp = (telefone) => {
    // Remove tudo que não é número
    const numeros = telefone.replace(/\D/g, "");

    // Garantir que tenha DDD (11 dígitos com 9 na frente)
    if (numeros.length === 10) {
      // Telefone sem 9 (ex: 1198765432)
      return `55${numeros}`;
    } else if (numeros.length === 11) {
      // Já tem o 9
      return `55${numeros}`;
    } else {
      // Qualquer outro formato, tenta limpar
      return `55${numeros}`;
    }
  };

  // =============== GERAR LINK DO WHATSAPP ===============
  const gerarLinkWhatsApp = (telefone, nome, imovelCodigo) => {
    const numeroFormatado = formatarTelefoneWhatsApp(telefone);
    const mensagem = encodeURIComponent(
      `Olá ${nome}! Tudo bem? Vi que você tem interesse no imóvel ${imovelCodigo || "nosso imóvel"}. Como posso ajudar?`,
    );
    return `https://wa.me/${numeroFormatado}?text=${mensagem}`;
  };

  const statusOptions = [
    { value: "todos", label: "Todos", color: "gray" },
    { value: "novo", label: "Novo", color: "blue" },
    { value: "em contato", label: "Em contato", color: "yellow" },
    { value: "agendado", label: "Agendado", color: "purple" },
    { value: "fechado", label: "Fechado", color: "green" },
    { value: "perdido", label: "Perdido", color: "red" },
  ];

  // Cores condicionais para dark mode
  const statusColors = {
    novo: isDark ? "text-blue-300" : "text-blue-600",
    "em contato": isDark ? "text-yellow-300" : "text-yellow-600",
    agendado: isDark ? "text-purple-300" : "text-purple-600",
    fechado: isDark ? "text-green-300" : "text-green-600",
    perdido: isDark ? "text-red-300" : "text-red-600",
  };

  const prioridadeColors = {
    alta: isDark ? "text-red-300" : "text-red-600",
    media: isDark ? "text-yellow-300" : "text-yellow-600",
    baixa: isDark ? "text-green-300" : "text-green-600",
  };

  // Filtrar leads baseado na busca e status
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.telefone?.includes(searchTerm);

    const matchesStatus =
      selectedStatus === "todos" || lead.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // Estatísticas
  const statusStats = {
    total: leads.length,
    novo: leads.filter((l) => l.status === "novo").length,
    contato: leads.filter((l) => l.status === "em contato").length,
    agendado: leads.filter((l) => l.status === "agendado").length,
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

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
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

        {/* Agendado */}
        <div
          className={`rounded-lg border p-3 text-center hover:shadow-sm transition-shadow ${
            isDark
              ? "bg-purple-900/20 border-purple-800 text-purple-300"
              : "bg-purple-50 border-purple-200 text-purple-700"
          }`}
        >
          <div
            className={`text-xl font-bold ${isDark ? "text-purple-300" : "text-purple-700"}`}
          >
            {statusStats.agendado}
          </div>
          <div
            className={`text-xs ${isDark ? "text-purple-400" : "text-purple-800"} mt-1`}
          >
            Agendado
          </div>
        </div>

        {/* Fechados */}
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
            {statusStats.fechado}
          </div>
          <div
            className={`text-xs ${isDark ? "text-green-400" : "text-green-800"} mt-1`}
          >
            Fechados
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

      {/* Filters */}
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
                      ? "bg-gray-800 text-gray-200 placeholder-gray-400 border border-gray-700"
                      : "bg-white text-gray-900 placeholder-gray-500 border border-gray-300"
                  }
                `}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              className={`
                px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-sm border
                ${
                  isDark
                    ? "bg-gray-800 text-gray-200 border-gray-700"
                    : "bg-white text-gray-900 border-gray-300"
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
            <button
              className={`
                px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] text-sm flex items-center
                appearance-none border
                ${
                  isDark
                    ? "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
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

      {/* Leads List */}
      <div
        className={`rounded-lg overflow-hidden border ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
              <tr>
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
                          <span>{formatarData(lead.created_at)}</span>
                        </div>
                      </div>
                    </td>

                    {/* Contato */}
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
                          <span className="truncate">{lead.email || "-"}</span>
                        </div>
                        {/* WHATSAPP LINKÁVEL */}
                        <div
                          className={`flex items-center justify-center text-sm ${
                            isDark ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <PhoneIcon className="w-3 h-3 mr-2 flex-shrink-0" />
                          <a
                            href={gerarLinkWhatsApp(
                              lead.telefone,
                              lead.nome,
                              lead.imovel_codigo,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`hover:underline ${
                              isDark
                                ? "text-green-400 hover:text-green-300"
                                : "text-green-600 hover:text-green-800"
                            }`}
                            title="Abrir conversa no WhatsApp"
                          >
                            {lead.telefone}
                          </a>
                        </div>
                      </div>
                    </td>

                    {/* 🔥 INTERESSE - VERSÃO DEFINITIVA SEM DEBUG */}
                    <td
                      className={`px-4 py-3 text-center border-r ${
                        isDark ? "border-gray-700" : "border-gray-300"
                      }`}
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

                                if (data?.slug) {
                                  window.open(`/imovel/${data.slug}`, "_blank");
                                } else {
                                  alert(
                                    `Imóvel com código ${lead.imovel_codigo} não encontrado.`,
                                  );
                                }
                              } catch (error) {
                                console.error("Erro ao buscar imóvel:", error);
                                alert("Erro ao buscar informações do imóvel.");
                              }
                            }
                          }}
                          className={`
                            font-medium text-sm flex items-center hover:underline mb-1
                            appearance-none bg-transparent border-none
                            ${
                              lead.imovel_codigo
                                ? isDark
                                  ? "text-blue-400 hover:text-blue-300"
                                  : "text-blue-600 hover:text-blue-800"
                                : "text-gray-500 cursor-default"
                            }
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
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {lead.imovel_codigo
                            ? lead.imovel_codigo
                            : "Interesse geral"}
                        </div>
                      </div>
                    </td>

                    {/* Origem */}
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
                        {lead.origem || "Site"}
                      </span>
                    </td>

                    {/* Status */}
                    <td
                      className={`px-4 py-3 text-center border-r ${
                        isDark ? "border-gray-700" : "border-gray-300"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${statusColors[lead.status] || (isDark ? "text-gray-300" : "text-gray-700")}`}
                      >
                        {lead.status?.charAt(0).toUpperCase() +
                          lead.status?.slice(1) || "Novo"}
                      </span>
                    </td>

                    {/* Prioridade */}
                    <td
                      className={`px-4 py-3 text-center border-r ${
                        isDark ? "border-gray-700" : "border-gray-300"
                      }`}
                    >
                      <span
                        className={`text-xs font-medium ${prioridadeColors[lead.prioridade] || (isDark ? "text-gray-300" : "text-gray-700")}`}
                      >
                        {lead.prioridade?.charAt(0).toUpperCase() +
                          lead.prioridade?.slice(1) || "Alta"}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1 min-h-[2rem]">
                        {/* Botão Detalhes */}
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

                        {/* Botões de ação baseados no status */}
                        {lead.status === "novo" ||
                        lead.status === "em contato" ? (
                          <>
                            <button
                              onClick={() =>
                                atualizarStatus(lead.id, "fechado")
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
                              title="Marcar como fechado"
                            >
                              <CheckCircleIcon className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() =>
                                atualizarStatus(lead.id, "perdido")
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
                          /* Espaço reservado para manter alinhamento */
                          <div className="flex gap-1">
                            <div className="w-6 h-6 opacity-0">
                              <CheckCircleIcon className="w-4 h-4" />
                            </div>
                            <div className="w-6 h-6 opacity-0">
                              <XCircleIcon className="w-4 h-4" />
                            </div>
                          </div>
                        )}

                        {/* BOTÃO EXCLUIR */}
                        <button
                          onClick={() => excluirLead(lead.id, lead.nome)}
                          className={`
                            p-1 rounded transition-colors flex items-center justify-center
                            appearance-none bg-transparent border-none
                            ${
                              isDark
                                ? "text-gray-400 hover:text-red-400"
                                : "text-gray-500 hover:text-red-600"
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

      {/* Conversion Tips */}
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
