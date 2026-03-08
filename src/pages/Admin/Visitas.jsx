// pages/Admin/visitas.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  CalendarIcon,
  ClockIcon,
  HomeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  MapPinIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  PlusIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";
import {
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
} from "@heroicons/react/24/solid";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import { visitasService } from "../../lib/visitasService";
import { supabase } from "../../lib/supabase";

// ============================================
// FUNÇÕES DE FORMATAÇÃO (TODAS AQUI - FORA DO COMPONENTE)
// ============================================

// Função para formatar moeda no padrão brasileiro
const formatarMoeda = (valor) => {
  if (!valor || isNaN(valor) || typeof valor !== "number") {
    return "R$ 0,00";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

// Função para formatar telefone para link do WhatsApp
const formatarTelefoneParaWhatsApp = (telefone) => {
  const numeros = telefone.replace(/\D/g, "");
  const numerosLimpos = numeros.startsWith("0")
    ? numeros.substring(1)
    : numeros;
  const telefoneInternacional = numerosLimpos.startsWith("55")
    ? numerosLimpos
    : `55${numerosLimpos}`;
  return telefoneInternacional;
};

// Função para criar link do WhatsApp
const criarLinkWhatsApp = (telefone, nomeLead, nomeCorretor = "corretor") => {
  const telefoneFormatado = formatarTelefoneParaWhatsApp(telefone);
  const mensagem = encodeURIComponent(
    `Olá ${nomeLead}! Tudo bem? Sou o ${nomeCorretor} da Adventus Imóveis. Gostaria de conversar sobre a visita agendada.`,
  );
  return `https://wa.me/${telefoneFormatado}?text=${mensagem}`;
};

// Função para formatar preço no padrão brasileiro
const formatarPreco = (preco) => {
  if (!preco) return null;
  const valor = typeof preco === "string" ? parseFloat(preco) : preco;
  if (isNaN(valor)) return null;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor);
};

// Função para formatar data (apenas data)
const formatarData = (dataString) => {
  if (!dataString) return "Data não disponível";
  try {
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "Data inválida";
    return data.toLocaleDateString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });
  } catch {
    return "Data inválida";
  }
};

// ✅ NOVA FUNÇÃO: Formatar data COMPLETA com hora
const formatarDataCompleta = (dataString) => {
  if (!dataString) return "Data não disponível";

  try {
    // Garantir que a string tem Z no final
    const dataStr = dataString.includes("Z") ? dataString : dataString + "Z";
    const data = new Date(dataStr);

    if (isNaN(data.getTime())) return "Data inválida";

    return data
      .toLocaleString("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(", ", " às ");
  } catch {
    return "Data inválida";
  }
};

// Função para formatar hora LOCAL
const formatarHora = (dataString) => {
  if (!dataString) return "";
  try {
    const dataStr = dataString.includes("Z") ? dataString : dataString + "Z";
    const data = new Date(dataStr);
    if (isNaN(data.getTime())) return "";
    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
      hour12: false,
    });
  } catch {
    return "";
  }
};

// ============================================
// ÍCONE DE WHATSAPP
// ============================================
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
  </svg>
);

// ============================================
// COMPONENTE STATUS ETIQUETA
// ============================================
const StatusEtiqueta = ({ status, reagendado, isDark }) => {
  if (reagendado && (status === "agendada" || status === "confirmada")) {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
          isDark
            ? "bg-purple-900/30 text-purple-300 border border-purple-700"
            : "bg-purple-100 text-purple-700 border border-purple-200"
        }`}
      >
        <ArrowPathIcon className="w-3 h-3 mr-1" />
        REAGENDADA
      </span>
    );
  }

  const config = {
    solicitada: {
      label: "NOVA",
      bg: isDark
        ? "bg-amber-900/30 text-amber-300 border-amber-700"
        : "bg-amber-100 text-amber-700 border-amber-200",
      icon: <ExclamationCircleIconSolid className="w-3 h-3 mr-1" />,
    },
    agendada: {
      label: "AGENDADA",
      bg: isDark
        ? "bg-blue-900/30 text-blue-300 border-blue-700"
        : "bg-blue-100 text-blue-700 border-blue-200",
      icon: <CalendarIcon className="w-3 h-3 mr-1" />,
    },
    confirmada: {
      label: "CONFIRMADA",
      bg: isDark
        ? "bg-emerald-900/30 text-emerald-300 border-emerald-700"
        : "bg-emerald-100 text-emerald-700 border-emerald-200",
      icon: <CheckCircleIconSolid className="w-3 h-3 mr-1" />,
    },
    realizada: {
      label: "REALIZADA",
      bg: isDark
        ? "bg-gray-700 text-gray-300 border-gray-600"
        : "bg-gray-200 text-gray-700 border-gray-300",
      icon: <CheckBadgeIcon className="w-3 h-3 mr-1" />,
    },
    cancelada: {
      label: "CANCELADA",
      bg: isDark
        ? "bg-rose-900/30 text-rose-300 border-rose-700"
        : "bg-rose-100 text-rose-700 border-rose-200",
      icon: <XCircleIconSolid className="w-3 h-3 mr-1" />,
    },
  };

  const current = config[status] || config.solicitada;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg}`}
    >
      {current.icon}
      {current.label}
    </span>
  );
};

// ============================================
// COMPONENTE MODAL DE AGENDAMENTO
// ============================================
const ModalAgendar = ({ isOpen, onClose, visita, onConfirm, isDark }) => {
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!data || !horario) {
      alert("Selecione data e horário para a visita");
      return;
    }

    setLoading(true);
    try {
      const dataAgendamento = new Date(`${data}T${horario}:00`);
      await onConfirm(visita.id, dataAgendamento.toISOString());
      onClose();
    } catch (error) {
      console.error("Erro ao agendar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div
        className={`rounded-xl p-6 max-w-md w-full ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <h3
          className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Agendar visita
        </h3>

        <div className="mb-4">
          <p
            className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            {visita?.nome_cliente}
          </p>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            {visita?.imovel?.codigo} - {visita?.imovel?.bairro}
          </p>
        </div>

        <div
          className={`mb-4 p-3 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
        >
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Solicitada: {formatarDataCompleta(visita?.created_at)}
          </p>
          <p
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Prefere: {visita?.dia_preferencia} (
            {visita?.horario_preferencia === "manha" ? "manhã" : "tarde"})
          </p>
        </div>

        <div className="space-y-4 mb-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Data da visita
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Horário
            </label>
            <input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!data || !horario || loading}
            className="flex-1 bg-[#D4A24D] text-white py-3 rounded-lg hover:bg-[#C19137] disabled:opacity-50 transition-colors"
          >
            {loading ? "Agendando..." : "Confirmar agendamento"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE MODAL DE CANCELAMENTO
// ============================================
const ModalCancelar = ({ isOpen, onClose, visita, onConfirm, isDark }) => {
  const [motivo, setMotivo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!motivo.trim()) {
      alert("Por favor, informe o motivo do cancelamento");
      return;
    }

    setLoading(true);
    try {
      await onConfirm(visita.id, motivo);
      onClose();
    } catch (error) {
      console.error("Erro ao cancelar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div
        className={`rounded-xl p-6 max-w-md w-full ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <h3
          className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Cancelar visita
        </h3>
        <p
          className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          {visita?.nome_cliente} - {visita?.imovel?.codigo}
        </p>

        <textarea
          value={motivo}
          onChange={(e) => setMotivo(e.target.value)}
          placeholder="Motivo do cancelamento (obrigatório)..."
          className={`w-full p-3 rounded-lg border mb-4 min-h-[100px] ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          }`}
          autoFocus
        />

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!motivo.trim() || loading}
            className="flex-1 bg-rose-600 text-white py-3 rounded-lg hover:bg-rose-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Cancelando..." : "Confirmar cancelamento"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE MODAL DE TRANSFERÊNCIA
// ============================================
const ModalTransferir = ({ isOpen, onClose, visita, onConfirm, isDark }) => {
  const [corretores, setCorretores] = useState([]);
  const [selectedCorretor, setSelectedCorretor] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferindo, setTransferindo] = useState(false);

  useEffect(() => {
    if (isOpen && visita) {
      carregarCorretores();
    }
  }, [isOpen, visita]);

  const carregarCorretores = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("corretores")
        .select("id, nome, email, status")
        .neq("id", visita?.corretor_id)
        .in("status", ["Ativo", "Período de Experiência"])
        .order("nome");

      if (error) throw error;
      setCorretores(data || []);
    } catch (error) {
      console.error("Erro ao carregar corretores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedCorretor) {
      alert("Selecione um corretor para transferir");
      return;
    }

    const corretorDestino = corretores.find((c) => c.id === selectedCorretor);
    const confirmacao = window.confirm(
      `Tem certeza que deseja transferir a visita de ${visita?.nome_cliente}?\n\n` +
        `De: ${visita?.corretor_nome || "Corretor atual"}\n` +
        `Para: ${corretorDestino?.nome || "Novo corretor"}\n\n` +
        `Esta ação não pode ser desfeita.`,
    );

    if (confirmacao) {
      setTransferindo(true);
      onConfirm(visita.id, selectedCorretor);
      setTransferindo(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div
        className={`rounded-xl p-6 max-w-md w-full ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <h3
          className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Transferir visita
        </h3>
        <p
          className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          Visita de <strong>{visita?.nome_cliente}</strong> -{" "}
          {visita?.imovel?.codigo}
        </p>

        {visita?.corretor_nome && (
          <div
            className={`mb-4 p-3 rounded-lg border ${
              isDark
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <p
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Corretor atual
            </p>
            <p
              className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
            >
              {visita.corretor_nome}
            </p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4 text-gray-500">
            Carregando corretores...
          </div>
        ) : corretores.length === 0 ? (
          <div
            className={`text-center py-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Nenhum outro corretor ativo disponível
          </div>
        ) : (
          <select
            value={selectedCorretor}
            onChange={(e) => setSelectedCorretor(e.target.value)}
            className={`w-full p-3 rounded-lg border mb-4 ${
              isDark
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <option value="">Selecione o novo corretor</option>
            {corretores.map((corretor) => (
              <option key={corretor.id} value={corretor.id}>
                {corretor.nome}{" "}
                {corretor.status === "Período de Experiência"
                  ? "(em experiência)"
                  : ""}
              </option>
            ))}
          </select>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!selectedCorretor || loading || transferindo}
            className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {transferindo ? "Transferindo..." : "Transferir"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE MODAL DE REAGENDAMENTO
// ============================================
const ModalReagendar = ({ isOpen, onClose, visita, onConfirm, isDark }) => {
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visita && visita.data_visita) {
      const dataAtual = new Date(visita.data_visita);
      setData(dataAtual.toISOString().split("T")[0]);
      setHorario(dataAtual.toTimeString().slice(0, 5));
    }
  }, [visita]);

  const handleConfirm = async () => {
    if (!data || !horario) return;

    setLoading(true);
    try {
      const novaData = new Date(`${data}T${horario}:00`);
      await onConfirm(visita.id, novaData.toISOString());
      onClose();
    } catch (error) {
      console.error("Erro ao reagendar:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div
        className={`rounded-xl p-6 max-w-md w-full ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <h3
          className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Reagendar visita
        </h3>
        <p
          className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          {visita?.nome_cliente} - {visita?.imovel?.codigo}
        </p>

        <div className="space-y-4 mb-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Nova data
            </label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className={`w-full p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Novo horário
            </label>
            <input
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!data || !horario || loading}
            className="flex-1 bg-[#D4A24D] text-white py-3 rounded-lg hover:bg-[#C19137] disabled:opacity-50 transition-colors"
          >
            {loading ? "Reagendando..." : "Confirmar reagendamento"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE MODAL DE PROPOSTA (VERSÃO CORRIGIDA)
// ============================================
const ModalProposta = ({ isOpen, onClose, visita, onConfirm, isDark }) => {
  // LOG PARA VER O QUE ESTÁ CHEGANDO
  console.log("📦 MODAL PROPOSTA - visita recebida:", visita);
  console.log("🏠 imovel dentro da visita:", visita?.imovel);
  console.log("💰 preco do imovel:", visita?.imovel?.preco);

  // 🔥 PEGA O VALOR DO IMÓVEL AUTOMATICAMENTE
  const [valor, setValor] = useState("");
  const [condicoes, setCondicoes] = useState("");
  const [loading, setLoading] = useState(false);

  // QUANDO O MODAL ABRIR, ATUALIZA O VALOR COM O PREÇO DO IMÓVEL
  useEffect(() => {
    if (isOpen && visita) {
      // Pega o preço do imóvel (pode estar em imovel ou imoveis)
      const precoImovel = visita?.imovel?.preco || visita?.imoveis?.preco;

      if (precoImovel) {
        console.log("🎯 Atualizando valor para:", precoImovel);
        // Converte para centavos (350000.00 → 35000000)
        const valorEmCentavos = Math.round(precoImovel * 100);
        setValor(valorEmCentavos.toString());
      } else {
        console.log("⚠️ Preço do imóvel não encontrado");
        setValor("");
      }
    }
  }, [isOpen, visita]);

  // Função para formatar o valor para exibição (R$ 100.000,00)
  const formatarValorExibicao = (valorCentavos) => {
    if (!valorCentavos) return "";

    // Converte centavos para reais (35000000 → 350000.00)
    const valorReais = parseFloat(valorCentavos) / 100;

    if (isNaN(valorReais)) return "";

    return valorReais.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Função para lidar com a mudança no input
  const handleValorChange = (e) => {
    // Pega o valor digitado e remove tudo que não é número
    const valorDigitado = e.target.value.replace(/\D/g, "");
    setValor(valorDigitado);
  };

  const handleConfirm = async () => {
    if (!valor) {
      alert("Informe o valor da proposta");
      return;
    }

    setLoading(true);
    try {
      // Converte de centavos para número real (35000000 → 350000.00)
      const valorNumerico = parseFloat(valor) / 100;
      console.log("💰 Enviando valor:", valorNumerico);
      await onConfirm(visita.id, valorNumerico, condicoes);
      onClose();
    } catch (error) {
      console.error("Erro ao criar proposta:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
      <div
        className={`rounded-xl p-6 max-w-md w-full ${isDark ? "bg-gray-800" : "bg-white"}`}
      >
        <h3
          className={`text-lg font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
        >
          Nova Proposta
        </h3>

        {/* ✅ CORRIGIDO: Mostra o código do imóvel junto com o nome do lead */}
        <p
          className={`text-sm mb-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}
        >
          {visita?.nome_cliente} -{" "}
          {visita?.imovel?.codigo || visita?.imoveis?.codigo || "SEM CÓDIGO"}
        </p>

        <div className="space-y-4 mb-4">
          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Valor da proposta
            </label>
            <input
              type="text"
              value={formatarValorExibicao(valor)}
              onChange={handleValorChange}
              className={`w-full p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="R$ 0,00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Valor do imóvel:{" "}
              {visita?.imovel?.preco || visita?.imoveis?.preco
                ? formatarMoeda(visita?.imovel?.preco || visita?.imoveis?.preco)
                : "Não disponível"}
            </p>
          </div>

          <div>
            <label
              className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              Condições (opcional)
            </label>
            <textarea
              value={condicoes}
              onChange={(e) => setCondicoes(e.target.value)}
              rows="3"
              className={`w-full p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
              placeholder="Ex: entrada de 50%, financiamento..."
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={!valor || loading}
            className="flex-1 bg-[#D4A24D] text-white py-3 rounded-lg hover:bg-[#C19137] disabled:opacity-50 transition-colors"
          >
            {loading ? "Salvando..." : "Salvar proposta"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE STATUS TAB
// ============================================
const StatusTab = ({ status, label, count, isActive, onClick, isDark }) => {
  const colorConfig = {
    solicitada: {
      bg: isDark ? "bg-[#D4A24D]" : "bg-[#D4A24D]",
      hover: isDark ? "hover:bg-[#E0B157]" : "hover:bg-[#C19137]",
      light: isDark ? "bg-amber-900/20" : "bg-amber-50",
      border: isDark ? "border-amber-800" : "border-amber-200",
      text: isDark ? "text-amber-300" : "text-amber-700",
    },
    agendada: {
      bg: isDark ? "bg-amber-500" : "bg-amber-500",
      hover: isDark ? "hover:bg-amber-600" : "hover:bg-amber-600",
      light: isDark ? "bg-amber-900/20" : "bg-amber-50",
      border: isDark ? "border-amber-800" : "border-amber-200",
      text: isDark ? "text-amber-300" : "text-amber-700",
    },
    confirmada: {
      bg: isDark ? "bg-emerald-500" : "bg-emerald-500",
      hover: isDark ? "hover:bg-emerald-600" : "hover:bg-emerald-600",
      light: isDark ? "bg-emerald-900/20" : "bg-emerald-50",
      border: isDark ? "border-emerald-800" : "border-emerald-200",
      text: isDark ? "text-emerald-300" : "text-emerald-700",
    },
    realizada: {
      bg: isDark ? "bg-purple-500" : "bg-purple-500",
      hover: isDark ? "hover:bg-purple-600" : "hover:bg-purple-600",
      light: isDark ? "bg-purple-900/20" : "bg-purple-50",
      border: isDark ? "border-purple-800" : "border-purple-200",
      text: isDark ? "text-purple-300" : "text-purple-700",
    },
    cancelada: {
      bg: isDark ? "bg-rose-500" : "bg-rose-500",
      hover: isDark ? "hover:bg-rose-600" : "hover:bg-rose-600",
      light: isDark ? "bg-rose-900/20" : "bg-rose-50",
      border: isDark ? "border-rose-800" : "border-rose-200",
      text: isDark ? "text-rose-300" : "text-rose-700",
    },
  };

  const config = colorConfig[status] || colorConfig.solicitada;

  return (
    <button
      onClick={() => onClick(status)}
      className={`
        flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg transition-all duration-300 whitespace-nowrap
        ${
          isActive
            ? `${config.light} ${isDark ? "text-gray-100" : config.text} border ${config.border} shadow-sm`
            : `${
                isDark
                  ? "text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                  : "bg-gray-50 text-gray-700 hover:bg-amber-50/50 hover:text-amber-800"
              }`
        }
        font-medium text-sm flex-shrink-0
      `}
    >
      <div
        className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? config.bg : isDark ? "bg-gray-600" : "bg-gray-400"}`}
      />
      <span>{label}</span>
      {count > 0 && (
        <span
          className={`
          px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0
          ${isActive ? config.bg + " text-white" : isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}
        `}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// ============================================
// COMPONENTE MÉTRICAS CARD
// ============================================
const MetricasCard = ({ stats, isDark }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div
        className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Realizadas
            </p>
            <p
              className={`text-2xl font-bold ${isDark ? "text-purple-400" : "text-purple-600"}`}
            >
              {stats.porStatus?.realizada || 0}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${isDark ? "bg-purple-900/20" : "bg-purple-50"}`}
          >
            <CheckCircleIcon
              className={`w-6 h-6 ${isDark ? "text-purple-400" : "text-purple-600"}`}
            />
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Canceladas
            </p>
            <p
              className={`text-2xl font-bold ${isDark ? "text-rose-400" : "text-rose-600"}`}
            >
              {stats.porStatus?.cancelada || 0}
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${isDark ? "bg-rose-900/20" : "bg-rose-50"}`}
          >
            <XCircleIcon
              className={`w-6 h-6 ${isDark ? "text-rose-400" : "text-rose-600"}`}
            />
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Conversão
            </p>
            <p
              className={`text-2xl font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
            >
              {stats.taxas?.conversao || 0}%
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${isDark ? "bg-emerald-900/20" : "bg-emerald-50"}`}
          >
            <ChartBarIcon
              className={`w-6 h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
            />
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl p-4 border ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              No-show
            </p>
            <p
              className={`text-2xl font-bold ${isDark ? "text-amber-400" : "text-amber-600"}`}
            >
              {stats.taxas?.noShow || 0}%
            </p>
          </div>
          <div
            className={`p-3 rounded-lg ${isDark ? "bg-amber-900/20" : "bg-amber-50"}`}
          >
            <UserIcon
              className={`w-6 h-6 ${isDark ? "text-amber-400" : "text-amber-600"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE CARD DE VISITA (O MAIS IMPORTANTE!)
// ============================================
const VisitaCard = ({ visita, onAction, isDark, usuarioLogado }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [resultadoTemp, setResultadoTemp] = useState(visita.resultado || "");
  const [motivoCancelamentoTemp, setMotivoCancelamentoTemp] = useState(
    visita.motivo_cancelamento || "",
  );
  const [updating, setUpdating] = useState(false);

  const whatsappLink = criarLinkWhatsApp(
    visita.telefone,
    visita.nome_cliente.split(" ")[0],
    visita.corretor_nome || "corretor",
  );

  const isCorretorDaVisita = usuarioLogado?.id === visita.corretor_id;
  const podeTransferir =
    usuarioLogado?.role === "admin" || usuarioLogado?.role === "master";

  const handleActionWithLoading = async (action, payload = {}) => {
    setUpdating(true);
    await onAction(visita.id, action, payload);
    setUpdating(false);
  };

  const getActionButtons = () => {
    const baseBtnClass = `py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 min-w-0 ${
      updating ? "opacity-50 cursor-not-allowed" : ""
    }`;

    const cancelarBtnClass = `${baseBtnClass} flex-1 bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow`;
    const primaryBtnClass = `${baseBtnClass} flex-1 ${isDark ? "bg-[#31353E] text-white hover:bg-[#3a3f4a]" : "bg-[#D4A24D] text-white hover:bg-[#C19137] shadow-sm hover:shadow"}`;
    const secondaryBtnClass = `${baseBtnClass} flex-1 ${isDark ? "bg-emerald-700 text-white hover:bg-emerald-800" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow"}`;
    const tertiaryBtnClass = `${baseBtnClass} flex-1 ${isDark ? "bg-purple-700 text-white hover:bg-purple-800" : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow"}`;
    const outlineBtnClass = `${baseBtnClass} flex-1 ${isDark ? "border border-amber-600 text-amber-300 hover:bg-amber-900/20 hover:border-amber-500" : "border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"}`;
    const assumirBtnClass = `${baseBtnClass} flex-1 ${isDark ? "bg-blue-700 text-white hover:bg-blue-800" : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"}`;

    if (visita.status === "solicitada" && !visita.corretor_id) {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => handleActionWithLoading("assumir", { visita })}
            disabled={updating}
            className={assumirBtnClass}
          >
            <UserIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Assumir visita</span>
          </button>
          <button
            onClick={() => handleActionWithLoading("cancelar")}
            disabled={updating}
            className={cancelarBtnClass}
          >
            <XCircleIcon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">Cancelar</span>
          </button>
        </div>
      );
    }

    if (podeTransferir && visita.corretor_id) {
      return (
        <div className="flex flex-col gap-2 mt-4">
          <button
            onClick={() => handleActionWithLoading("transferir", { visita })}
            className="flex-1 bg-purple-600 text-white hover:bg-purple-700 rounded-lg py-2.5 text-sm font-medium flex items-center justify-center gap-2"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Transferir
          </button>
        </div>
      );
    }

    if (!isCorretorDaVisita && visita.status !== "solicitada") {
      return null;
    }

    switch (visita.status) {
      case "solicitada":
        return (
          <div className="flex flex-col xs:flex-row gap-2 mt-4">
            <button
              onClick={() => handleActionWithLoading("agendar")}
              disabled={updating}
              className={primaryBtnClass}
            >
              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Agendar visita</span>
            </button>
            <button
              onClick={() => handleActionWithLoading("cancelar")}
              disabled={updating}
              className={cancelarBtnClass}
            >
              <XCircleIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Cancelar</span>
            </button>
          </div>
        );

      case "agendada":
        return (
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleActionWithLoading("confirmar")}
                disabled={updating}
                className={secondaryBtnClass}
              >
                <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Confirmar</span>
              </button>
              <button
                onClick={() => handleActionWithLoading("cancelar", { visita })}
                disabled={updating}
                className={cancelarBtnClass}
              >
                <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Cancelar</span>
              </button>
            </div>
            <button
              onClick={() => handleActionWithLoading("reagendar", { visita })}
              disabled={updating}
              className={primaryBtnClass}
            >
              <ArrowPathIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Reagendar</span>
            </button>
          </div>
        );

      case "confirmada":
        return (
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => handleActionWithLoading("realizada")}
                disabled={updating}
                className={tertiaryBtnClass}
              >
                <CheckBadgeIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Realizada</span>
              </button>
              <button
                onClick={() => handleActionWithLoading("cancelar", { visita })}
                disabled={updating}
                className={cancelarBtnClass}
              >
                <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Cancelar</span>
              </button>
            </div>
            <button
              onClick={() => handleActionWithLoading("nao_compareceu")}
              disabled={updating}
              className={outlineBtnClass}
            >
              <UserIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Não compareceu</span>
            </button>
          </div>
        );

      case "realizada":
        return (
          <div className="flex flex-col gap-2 mt-4">
            <select
              value={resultadoTemp}
              onChange={(valor) => {
                setResultadoTemp(valor.target.value);
                handleActionWithLoading("atualizar_resultado", {
                  resultado: valor.target.value,
                });
              }}
              className={`w-full p-2 rounded-lg border ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-700"
              }`}
            >
              <option value="">Selecionar resultado</option>
              <option value="virou_proposta">Virou proposta</option>
              <option value="interessado">Interessado</option>
              <option value="nao_interessado">Não interessado</option>
              <option value="nao_compareceu">Não compareceu</option>
              <option value="reagendar">Reagendar</option>
              <option value="sem_retorno">Sem retorno</option>
            </select>
            <div className="flex gap-2">
              {(visita.resultado === "virou_proposta" ||
                visita.resultado === "interessado" ||
                visita.resultado === "reagendar") && (
                <button
                  onClick={() => {
                    handleActionWithLoading("negociar", { visita });
                  }}
                  disabled={updating}
                  className={primaryBtnClass}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">Iniciar negociação</span>
                </button>
              )}
            </div>
          </div>
        );

      case "cancelada":
        return null;

      default:
        return null;
    }
  };

  return (
    <div
      className={`
        rounded-xl border p-4 sm:p-5
        transition-all duration-300 ease-out
        hover:shadow-lg hover:border-amber-300
        ${visita.status === "cancelada" ? "opacity-90" : ""}
        ${isHovering ? "transform -translate-y-1" : ""}
        ${
          isDark
            ? "bg-gray-800 border-gray-700 hover:border-amber-600"
            : "bg-white border-gray-200 hover:border-amber-300"
        }
        ${updating ? "pointer-events-none" : ""}
      `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="mb-4">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3
              className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}
              title={visita.nome_cliente}
            >
              {visita.nome_cliente}
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-sm transition-colors hover:underline w-full min-w-0 ${
                  isDark
                    ? "text-emerald-400 hover:text-emerald-300"
                    : "text-emerald-600 hover:text-emerald-700"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(whatsappLink, "_blank", "noopener,noreferrer");
                }}
              >
                <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{visita.telefone}</span>
              </a>
              <div
                className={`flex items-center gap-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"} w-full`}
                title={visita.email}
              >
                <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                <span className="break-all">{visita.email}</span>
              </div>
            </div>
          </div>
          <StatusEtiqueta
            status={visita.status}
            reagendado={visita.reagendado}
            isDark={isDark}
          />
        </div>
      </div>

      <div
        className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} mb-4`}
      />

      {/* Seção do Imóvel */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div
              className={`p-1.5 rounded-lg flex-shrink-0 ${isDark ? "bg-amber-900/20" : "bg-amber-50"}`}
            >
              <HomeIcon
                className={`w-4 h-4 ${isDark ? "text-amber-400" : "text-amber-600"}`}
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <h4
                className={`font-medium truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}
                title={visita.imovel?.tipo || "Imóvel"}
              >
                {visita.imovel?.tipo || "Imóvel"}
              </h4>

              <span
                className={`text-sm ${isDark ? "text-gray-600" : "text-gray-400"} flex-shrink-0 hidden sm:inline`}
              >
                |
              </span>

              {visita.imovel?.preco && (
                <span
                  className={`text-sm font-semibold whitespace-nowrap truncate ${isDark ? "text-amber-300" : "text-amber-600"}`}
                  title={visita.imovel.preco}
                >
                  {formatarPreco(visita.imovel.preco)}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-3">
          <span
            className={`text-xs font-mono px-2 py-1 rounded ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}
          >
            {visita.imovel?.codigo || "SEM CÓDIGO"}
          </span>
        </div>

        {/* ✅ ENDEREÇO CORRIGIDO - USA BAIRRO COMO FALLBACK */}
        <div className="mb-2">
          <p
            className={`text-sm line-clamp-2 min-h-[2.5rem] ${isDark ? "text-gray-300" : "text-gray-700"}`}
            title={
              visita.imovel?.endereco ||
              visita.imovel?.bairro ||
              "Endereço não disponível"
            }
          >
            {visita.imovel?.endereco ||
              visita.imovel?.bairro ||
              "Endereço não disponível"}
          </p>
        </div>

        <div
          className={`flex items-center gap-2 text-xs ${isDark ? "text-gray-500" : "text-gray-500"} flex-wrap`}
        >
          <div className="flex items-center gap-1 whitespace-nowrap">
            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
            <span
              className="truncate max-w-[100px] sm:max-w-[120px]"
              title={visita.imovel?.bairro || "Bairro não informado"}
            >
              {visita.imovel?.bairro || "Bairro não informado"}
            </span>
          </div>

          <span className={isDark ? "text-gray-600" : "text-gray-400"}>•</span>

          <div className="whitespace-nowrap">
            {visita.imovel?.quartos || 0} quarto
            {visita.imovel?.quartos !== 1 ? "s" : ""}
          </div>

          {visita.imovel?.suites > 0 && (
            <>
              <span className={isDark ? "text-gray-600" : "text-gray-400"}>
                •
              </span>
              <div className="whitespace-nowrap">
                {visita.imovel.suites} suíte
                {visita.imovel.suites !== 1 ? "s" : ""}
              </div>
            </>
          )}

          {visita.imovel?.vagas > 0 && (
            <>
              <span className={isDark ? "text-gray-600" : "text-gray-400"}>
                •
              </span>
              <div className="whitespace-nowrap">
                {visita.imovel.vagas} vaga
                {visita.imovel.vagas !== 1 ? "s" : ""}
              </div>
            </>
          )}
        </div>
      </div>

      <div
        className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} mb-4`}
      />

      {/* ============================================
          SEÇÃO DA VISITA - TODAS AS DATAS CORRIGIDAS
      ============================================ */}
      <div className="space-y-2 mb-4">
        {/* Data Agendada/Reagendada */}
        {visita.status !== "solicitada" &&
          visita.status !== "cancelada" &&
          visita.data_visita && (
            <div className="flex items-center gap-2">
              <div
                className={`p-1 rounded-lg flex-shrink-0 ${isDark ? "bg-blue-900/10" : "bg-blue-50/80"}`}
              >
                <CalendarIcon
                  className={`w-3.5 h-3.5 ${isDark ? "text-blue-400/80" : "text-blue-600/80"}`}
                />
              </div>
              <span
                className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                <span className="font-semibold">
                  {visita.reagendado ? "Reagendada:" : "Agendada:"}
                </span>{" "}
                {formatarDataCompleta(visita.data_visita)}
              </span>
            </div>
          )}

        {/* ✅ DATA DA SOLICITAÇÃO CORRIGIDA - USA formatarDataCompleta */}
        <div className="flex items-center gap-2">
          <div
            className={`p-1 rounded-lg flex-shrink-0 ${isDark ? "bg-amber-900/10" : "bg-amber-50/80"}`}
          >
            <ClockIcon
              className={`w-3.5 h-3.5 ${isDark ? "text-amber-400/80" : "text-amber-600/80"}`}
            />
          </div>
          <span
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
          >
            Solicitada: {formatarDataCompleta(visita.created_at)}
          </span>
        </div>

        {/* Preferências do lead */}
        {visita.dia_preferencia && visita.horario_preferencia && (
          <div className="flex items-center gap-2">
            <div
              className={`p-1 rounded-lg flex-shrink-0 ${isDark ? "bg-amber-900/10" : "bg-amber-50/80"}`}
            >
              <UserIcon
                className={`w-3.5 h-3.5 ${isDark ? "text-amber-400/80" : "text-amber-600/80"}`}
              />
            </div>
            <span
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              Prefere: {visita.dia_preferencia} (
              {visita.horario_preferencia === "manha" ? "manhã" : "tarde"})
            </span>
          </div>
        )}

        {/* Corretor responsável */}
        {visita.corretor_id && (
          <div className="flex items-center gap-2">
            <div
              className={`p-1 rounded-lg flex-shrink-0 ${isDark ? "bg-emerald-900/10" : "bg-emerald-50/80"}`}
            >
              <UserIcon
                className={`w-3.5 h-3.5 ${isDark ? "text-emerald-400/80" : "text-emerald-600/80"}`}
              />
            </div>
            <span
              className={`text-xs font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {visita.corretor_nome || "Não atribuído"}
            </span>
          </div>
        )}

        {/* Resultado */}
        {visita.resultado && visita.status !== "cancelada" && (
          <div className="flex items-center gap-2">
            <div
              className={`p-1 rounded-lg flex-shrink-0 ${isDark ? "bg-purple-900/10" : "bg-purple-50/80"}`}
            >
              <ChartBarIcon
                className={`w-3.5 h-3.5 ${isDark ? "text-purple-400/80" : "text-purple-600/80"}`}
              />
            </div>
            <span
              className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              <span className="font-medium">Resultado:</span>{" "}
              {visita.resultado === "virou_proposta" && "Virou proposta"}
              {visita.resultado === "interessado" && "Interessado"}
              {visita.resultado === "nao_interessado" && "Não interessado"}
              {visita.resultado === "nao_compareceu" && "Não compareceu"}
              {visita.resultado === "reagendar" && "Reagendar"}
              {visita.resultado === "sem_retorno" && "Sem retorno"}
            </span>
          </div>
        )}

        {/* Motivo do cancelamento */}
        {visita.status === "cancelada" && (
          <div
            className={`p-3 rounded-lg border ${isDark ? "bg-rose-900/20 border-rose-800" : "bg-rose-50 border-rose-200"}`}
          >
            <div
              className={`flex items-start gap-2 ${isDark ? "text-rose-300" : "text-rose-800"}`}
            >
              <ExclamationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium">
                <strong>Motivo:</strong>{" "}
                {visita.motivo_cancelamento || "Não informado"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Linha divisória */}
      <div
        className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} mb-4`}
      />

      {getActionButtons()}
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL VISITAS
// ============================================
const Visitas = () => {
  const [abaAtiva, setAbaAtiva] = useState("solicitada");
  const [visitas, setVisitas] = useState([]);
  const [stats, setStats] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalAgendar, setModalAgendar] = useState({
    aberto: false,
    visita: null,
  });
  const [modalTransferir, setModalTransferir] = useState({
    aberto: false,
    visita: null,
  });
  const [modalReagendar, setModalReagendar] = useState({
    aberto: false,
    visita: null,
  });
  const [modalCancelar, setModalCancelar] = useState({
    aberto: false,
    visita: null,
  });
  const [modalProposta, setModalProposta] = useState({
    aberto: false,
    visita: null,
  });
  const { isDark } = useTheme();
  const { user } = useAuth();

  // Carregar dados iniciais
  useEffect(() => {
    if (user?.id) {
      carregarDados();
    }
  }, [user?.id]);

  const carregarDados = async () => {
    setLoading(true);
    setError(null);

    try {
      const [visitasRes, statsRes] = await Promise.all([
        visitasService.listarVisitas(),
        visitasService.buscarEstatisticas(),
      ]);

      if (visitasRes.error) throw new Error(visitasRes.error.message);
      if (statsRes.error) throw new Error(statsRes.error.message);

      setVisitas(visitasRes.data || []);
      setStats(statsRes.data);
    } catch (err) {
      if (err.message?.includes("AbortError") || err.name === "AbortError") {
        return;
      }
      console.error("❌ Erro ao carregar dados:", err);
      setError("Erro ao carregar visitas. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const abas = [
    {
      id: "solicitada",
      label: "Solicitadas",
      count: stats?.porStatus?.solicitada || 0,
    },
    {
      id: "agendada",
      label: "Agendadas",
      count: stats?.porStatus?.agendada || 0,
    },
    {
      id: "confirmada",
      label: "Confirmadas",
      count: stats?.porStatus?.confirmada || 0,
    },
    {
      id: "realizada",
      label: "Realizadas",
      count: stats?.porStatus?.realizada || 0,
    },
    {
      id: "cancelada",
      label: "Canceladas",
      count: stats?.porStatus?.cancelada || 0,
    },
  ];

  const visitasFiltradas = visitas.filter(
    (v) =>
      v.status === abaAtiva &&
      (v.nome_cliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.imovel?.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.telefone?.includes(searchTerm)),
  );

  const handleAction = async (visitaId, action, payload = {}) => {
    try {
      let result;

      switch (action) {
        case "assumir":
          setModalAgendar({
            aberto: true,
            visita: payload.visita,
          });
          return;

        case "agendar":
          result = await visitasService.atualizarStatus(visitaId, "agendada", {
            corretor_id: user?.id,
          });
          break;

        case "confirmar":
          result = await visitasService.atualizarStatus(visitaId, "confirmada");
          break;

        case "realizada":
          result = await visitasService.atualizarStatus(visitaId, "realizada");
          break;

        case "nao_compareceu":
          result = await visitasService.atualizarStatus(visitaId, "realizada", {
            resultado: "nao_compareceu",
          });
          break;

        case "cancelar":
          if (!payload.visita) {
            result = await visitasService.atualizarStatus(
              visitaId,
              "cancelada",
              {
                motivo_cancelamento: "Cancelado pelo corretor",
              },
            );
            break;
          }
          setModalCancelar({
            aberto: true,
            visita: payload.visita,
          });
          return;

        case "reagendar":
          setModalReagendar({
            aberto: true,
            visita: payload.visita,
          });
          return;

        case "transferir":
          const podeTransferir =
            user?.role === "admin" || user?.role === "master";
          if (!podeTransferir) {
            alert("Apenas administradores podem transferir visitas");
            return;
          }
          setModalTransferir({ aberto: true, visita: payload.visita });
          return;

        case "negociar":
          if (!payload?.visita) {
            alert("Erro: dados da visita não encontrados");
            return;
          }

          try {
            const { data: visitaCompleta, error } = await supabase
              .from("visitas")
              .select(`*, imoveis (*)`)
              .eq("id", payload.visita.id)
              .single();

            if (error) {
              console.error("❌ Erro ao buscar dados do imóvel:", error);
              alert("Erro ao carregar dados do imóvel");
              return;
            }

            setModalProposta({
              aberto: true,
              visita: visitaCompleta,
            });
          } catch (error) {
            console.error("❌ Erro inesperado:", error);
            alert("Erro ao preparar proposta");
          }
          return;

        case "atualizar_resultado":
          if (payload.resultado) {
            result = await visitasService.atualizarResultado(
              visitaId,
              payload.resultado,
            );
          }
          break;

        case "atualizar_motivo_cancelamento":
          if (payload.motivo_cancelamento) {
            result = await visitasService.atualizarMotivoCancelamento(
              visitaId,
              payload.motivo_cancelamento,
            );
          }
          break;

        default:
          return;
      }

      if (result?.error) throw result.error;

      await carregarDados();
    } catch (err) {
      console.error(`Erro ao executar ação ${action}:`, err);
      alert("Erro ao executar ação. Tente novamente.");
    }
  };

  const handleAgendarConfirm = async (visitaId, dataISO) => {
    try {
      const { error } = await supabase
        .from("visitas")
        .update({
          status: "agendada",
          corretor_id: user?.id,
          data_visita: dataISO,
        })
        .eq("id", visitaId);

      if (error) throw error;

      await carregarDados();
      alert("Visita agendada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao agendar:", error);
      alert("Erro ao agendar visita");
    }
  };

  const handleTransferirConfirm = async (visitaId, novoCorretorId) => {
    try {
      const { error } = await supabase
        .from("visitas")
        .update({ corretor_id: novoCorretorId })
        .eq("id", visitaId);

      if (error) throw error;

      await carregarDados();
      alert("Visita transferida com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao transferir:", error);
      alert("Erro ao transferir visita");
    }
  };

  const handleReagendarConfirm = async (visitaId, novaDataISO) => {
    try {
      const { error } = await supabase
        .from("visitas")
        .update({
          data_visita: novaDataISO,
          reagendado: true,
        })
        .eq("id", visitaId);

      if (error) throw error;

      await carregarDados();
      alert("Visita reagendada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao reagendar:", error);
      alert("Erro ao reagendar visita");
    }
  };

  const handleCancelarConfirm = async (visitaId, motivo) => {
    try {
      const { error } = await supabase
        .from("visitas")
        .update({
          status: "cancelada",
          motivo_cancelamento: motivo,
        })
        .eq("id", visitaId);

      if (error) throw error;

      await carregarDados();
      alert("Visita cancelada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao cancelar:", error);
      alert("Erro ao cancelar visita");
    }
  };

  const handlePropostaConfirm = async (visitaId, valor, condicoes) => {
    try {
      const valorNumerico = valor;

      const { data: visita, error: erroVisita } = await supabase
        .from("visitas")
        .select("imovel_id, lead_id")
        .eq("id", visitaId)
        .single();

      if (erroVisita) throw erroVisita;

      // Data atual no formato UTC para o banco
      const agora = new Date();
      const dataUTC = new Date(
        agora.getTime() + agora.getTimezoneOffset() * 60000,
      ).toISOString();

      const { error: erroProposta } = await supabase.from("propostas").insert([
        {
          visita_id: visitaId,
          valor: valorNumerico,
          condicoes: condicoes || null,
          created_at: dataUTC,
        },
      ]);

      if (erroProposta) throw erroProposta;

      const { error: erroImovel } = await supabase
        .from("imoveis")
        .update({
          status: "Em Negociação",
          updated_at: dataUTC,
        })
        .eq("id", visita.imovel_id);

      if (erroImovel) throw erroImovel;

      const { error: erroLead } = await supabase
        .from("leads")
        .update({
          status: "proposta",
          updated_at: dataUTC,
        })
        .eq("id", visita.lead_id);

      if (erroLead) {
        console.error("⚠️ Erro ao atualizar lead:", erroLead);
      }

      alert(
        "Proposta criada com sucesso! Imóvel atualizado para 'Em Negociação'.",
      );

      await carregarDados();
    } catch (error) {
      console.error("❌ Erro ao criar proposta:", error);
      alert("Erro ao criar proposta. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen p-3 sm:p-4 lg:p-6 ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-gray-100"}`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24D] mx-auto mb-4"></div>
            <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Carregando visitas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-3 sm:p-4 lg:p-6 ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-gray-100"}`}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <ExclamationCircleIcon
              className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-rose-400" : "text-rose-600"}`}
            />
            <h3
              className={`text-lg font-semibold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Ops! Algo deu errado
            </h3>
            <p className={`mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {error}
            </p>
            <button
              onClick={carregarDados}
              className="px-4 py-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#C19137] transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-3 sm:p-4 lg:p-6 ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-gray-100"}`}
    >
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 min-w-0">
            <h1
              className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Visitas
            </h1>
            <p
              className={`text-sm sm:text-base truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Gerencie o ciclo completo de visitas aos imóveis
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <button
              className={`
          px-3 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 border whitespace-nowrap text-sm
          ${
            isDark
              ? "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
              : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
          }
        `}
            >
              <FunnelIcon className="w-4 h-4" />
              <span className="font-medium">Filtrar</span>
            </button>

            <button
              className={`
          px-3 py-2 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-sm whitespace-nowrap text-sm
          ${
            isDark
              ? "bg-[#31353E] text-white hover:bg-[#3a3f4a]"
              : "bg-[#D4A24D] text-white hover:bg-[#C19137]"
          }
        `}
            >
              <PlusIcon className="w-4 h-4" />
              <span className="font-medium">Nova Visita</span>
            </button>
          </div>
        </div>

        <MetricasCard stats={stats} isDark={isDark} />

        <div
          className={`rounded-xl p-3 sm:p-4 border shadow-sm ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <MagnifyingGlassIcon
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                />
                <input
                  type="text"
                  placeholder="Buscar visitas..."
                  className={`w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-transparent transition-all duration-300 text-sm
                ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }
              `}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <select
                className={`
            px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-[#D4A24D] focus:border-transparent transition-all duration-300 truncate min-w-[120px]
            ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-700"
            }
          `}
              >
                <option>Todos corretores</option>
                <option>Carlos Santos</option>
                <option>Ana Paula</option>
              </select>
              <select
                className={`
            px-3 py-2 border rounded-lg text-xs focus:ring-2 focus:ring-[#D4A24D] focus:border-transparent transition-all duration-300 truncate min-w-[120px]
            ${
              isDark
                ? "bg-gray-700 border-gray-600 text-gray-200"
                : "bg-white border-gray-300 text-gray-700"
            }
          `}
              >
                <option>Todas as datas</option>
                <option>Hoje</option>
                <option>Amanhã</option>
                <option>Esta semana</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <div className="overflow-x-auto pb-2 -mx-2 px-2">
          <div className="flex gap-1 sm:gap-2 min-w-max">
            {abas.map((aba) => (
              <StatusTab
                key={aba.id}
                status={aba.id}
                label={aba.label}
                count={aba.count}
                isActive={abaAtiva === aba.id}
                onClick={setAbaAtiva}
                isDark={isDark}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        className={`rounded-xl sm:rounded-2xl border shadow-sm p-3 sm:p-4 lg:p-6 min-h-[500px] ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        {visitasFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {visitasFiltradas.map((visita) => (
              <VisitaCard
                key={visita.id}
                visita={visita}
                onAction={handleAction}
                isDark={isDark}
                usuarioLogado={user}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16">
            <CalendarIcon
              className={`w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mb-3 sm:mb-4 ${isDark ? "text-gray-700" : "text-gray-300"}`}
            />
            <h3
              className={`text-base sm:text-lg lg:text-xl font-semibold mb-2 text-center ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              {searchTerm
                ? "Nenhuma visita encontrada"
                : `Nenhuma visita ${abaAtiva}`}
            </h3>
            <p
              className={`text-center mb-4 sm:mb-6 max-w-md text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {searchTerm
                ? "Tente ajustar os termos da busca ou remover filtros."
                : "Todas as visitas deste status foram processadas. Excelente trabalho!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={`
              px-3 py-2 rounded-lg transition-colors duration-300 border text-sm
              ${
                isDark
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              }
            `}
              >
                Limpar busca
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modais */}
      {modalAgendar.aberto && (
        <ModalAgendar
          isOpen={modalAgendar.aberto}
          onClose={() => setModalAgendar({ aberto: false, visita: null })}
          visita={modalAgendar.visita}
          onConfirm={handleAgendarConfirm}
          isDark={isDark}
        />
      )}

      {modalCancelar.aberto && (
        <ModalCancelar
          isOpen={modalCancelar.aberto}
          onClose={() => setModalCancelar({ aberto: false, visita: null })}
          visita={modalCancelar.visita}
          onConfirm={handleCancelarConfirm}
          isDark={isDark}
        />
      )}

      {modalTransferir.aberto && (
        <ModalTransferir
          isOpen={modalTransferir.aberto}
          onClose={() => setModalTransferir({ aberto: false, visita: null })}
          visita={modalTransferir.visita}
          onConfirm={handleTransferirConfirm}
          isDark={isDark}
        />
      )}

      {modalReagendar.aberto && (
        <ModalReagendar
          isOpen={modalReagendar.aberto}
          onClose={() => setModalReagendar({ aberto: false, visita: null })}
          visita={modalReagendar.visita}
          onConfirm={handleReagendarConfirm}
          isDark={isDark}
        />
      )}

      {modalProposta.aberto && (
        <ModalProposta
          isOpen={modalProposta.aberto}
          onClose={() => setModalProposta({ aberto: false, visita: null })}
          visita={modalProposta.visita}
          onConfirm={handlePropostaConfirm}
          isDark={isDark}
        />
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .min-w-0 { min-width: 0; }
        @media (min-width: 475px) {
          .xs\\:flex-row { flex-direction: row; }
        }
      `}</style>
    </div>
  );
};

export default Visitas;
