// pages/Admin/visitas.jsx
import React, { useState } from "react";
import {
  CalendarIcon,
  ClockIcon,
  HomeIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  MapPinIcon,
  ChevronRightIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  CalendarIcon as CalendarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
  ClockIcon as ClockIconSolid,
  ExclamationCircleIcon as ExclamationCircleIconSolid,
  XCircleIcon as XCircleIconSolid,
} from "@heroicons/react/24/solid";
import { useTheme } from "../../contexts/ThemeContext";

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

// =========== COMPONENTES AUXILIARES PREMIUM ===========

// Badge de status premium
const StatusBadge = ({ status, isDark }) => {
  const statusConfig = {
    solicitada: {
      color: isDark
        ? "bg-amber-900/20 text-amber-300 border-amber-800"
        : "bg-amber-50 text-amber-700 border-amber-200",
      icon: <ExclamationCircleIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Solicitada",
    },
    agendada: {
      color: isDark
        ? "bg-amber-900/20 text-amber-300 border-amber-800"
        : "bg-amber-50 text-amber-700 border-amber-200",
      icon: <ClockIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Agendada",
    },
    confirmada: {
      color: isDark
        ? "bg-emerald-900/20 text-emerald-300 border-emerald-800"
        : "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircleIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Confirmada",
    },
    realizada: {
      color: isDark
        ? "bg-purple-900/20 text-purple-300 border-purple-800"
        : "bg-purple-50 text-purple-700 border-purple-200",
      icon: <CheckCircleIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Realizada",
    },
    cancelada: {
      color: isDark
        ? "bg-rose-900/20 text-rose-300 border-rose-800"
        : "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircleIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Cancelada",
    },
  };

  const config = statusConfig[status] || statusConfig.solicitada;

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}
    >
      {config.icon}
      {config.label}
    </span>
  );
};

// Ícone de WhatsApp
const WhatsAppIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
  </svg>
);

// Card de Visita Premium - RESPONSIVO PARA SIDEBAR EXPANDIDO
const VisitaCard = ({ visita, onAction, isDark }) => {
  const [isHovering, setIsHovering] = useState(false);

  const whatsappLink = criarLinkWhatsApp(
    visita.lead.telefone,
    visita.lead.nome.split(" ")[0],
    visita.corretor || "corretor",
  );

  // Tipo do imóvel formatado
  const tipoImovel =
    visita.imovel.tipo.charAt(0).toUpperCase() +
    visita.imovel.tipo.slice(1).toLowerCase();

  const getActionButtons = () => {
    // Classes responsivas para os botões
    const baseBtnClass =
      "py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2 whitespace-nowrap px-3 min-w-0";

    // Para telas pequenas com sidebar expandido, usamos px-3 e gap menor
    const cancelarBtnClass = `${baseBtnClass} flex-1 bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow`;
    const primaryBtnClass = `${baseBtnClass} flex-1 ${isDark ? "bg-[#31353E] text-white hover:bg-[#3a3f4a]" : "bg-[#D4A24D] text-white hover:bg-[#C19137] shadow-sm hover:shadow"}`;
    const secondaryBtnClass = `${baseBtnClass} flex-1 ${isDark ? "bg-emerald-700 text-white hover:bg-emerald-800" : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow"}`;
    const tertiaryBtnClass = `${baseBtnClass} flex-1 ${isDark ? "bg-purple-700 text-white hover:bg-purple-800" : "bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow"}`;
    const outlineBtnClass = `${baseBtnClass} flex-1 ${isDark ? "border border-amber-600 text-amber-300 hover:bg-amber-900/20 hover:border-amber-500" : "border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400"}`;

    switch (visita.status) {
      case "solicitada":
        return (
          <div className="flex flex-col xs:flex-row gap-2 mt-4">
            <button
              onClick={() => onAction(visita.id, "agendar")}
              className={primaryBtnClass}
            >
              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Agendar visita</span>
            </button>
            <button
              onClick={() => onAction(visita.id, "cancelar")}
              className={cancelarBtnClass}
            >
              <XCircleIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Cancelar</span>
            </button>
          </div>
        );

      case "agendada":
        return (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={() => onAction(visita.id, "confirmar")}
                className={secondaryBtnClass}
              >
                <CheckCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Confirmar</span>
              </button>
              <button
                onClick={() => onAction(visita.id, "cancelar")}
                className={cancelarBtnClass}
              >
                <XCircleIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">Cancelar</span>
              </button>
            </div>
            <button
              onClick={() => onAction(visita.id, "reagendar")}
              className={primaryBtnClass}
            >
              <ArrowPathIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Reagendar</span>
            </button>
          </div>
        );

      case "confirmada":
        return (
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <button
              onClick={() => onAction(visita.id, "realizada")}
              className={tertiaryBtnClass}
            >
              <CheckBadgeIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Realizada</span>
            </button>
            <button
              onClick={() => onAction(visita.id, "nao_compareceu")}
              className={outlineBtnClass}
            >
              <UserIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Não compareceu</span>
            </button>
            <button
              onClick={() => onAction(visita.id, "cancelar")}
              className={cancelarBtnClass}
            >
              <XCircleIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Cancelar</span>
            </button>
          </div>
        );

      case "realizada":
        return (
          <div className="flex flex-col xs:flex-row gap-2 mt-4">
            <button
              onClick={() => onAction(visita.id, "negociar")}
              className={primaryBtnClass}
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Iniciar negociação</span>
            </button>
            <button
              onClick={() => onAction(visita.id, "sem_interesse")}
              className={cancelarBtnClass}
            >
              <XCircleIcon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Sem interesse</span>
            </button>
          </div>
        );

      case "cancelada":
        return (
          <div
            className={`mt-4 p-3 rounded-lg border ${isDark ? "bg-rose-900/20 border-rose-800" : "bg-rose-50 border-rose-200"}`}
          >
            <div
              className={`flex items-start gap-2 ${isDark ? "text-rose-300" : "text-rose-800"}`}
            >
              <ExclamationCircleIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p className="text-sm font-medium truncate">
                <strong>Motivo:</strong>{" "}
                {visita.motivoCancelamento || "Cancelado pelo cliente"}
              </p>
            </div>
          </div>
        );

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
      `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Seção Dados do Lead */}
      <div className="mb-4">
        <div className="flex justify-between items-start gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* Nome do Lead - VISÍVEL COMPLETO */}
            <h3
              className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}
              title={visita.lead.nome}
            >
              {visita.lead.nome}
            </h3>

            {/* WhatsApp e Email VISÍVEIS - UM EMBAIXO DO OUTRO */}
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
                <span className="truncate">{visita.lead.telefone}</span>
              </a>

              <div
                className={`flex items-center gap-2 text-sm truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}
                title={visita.lead.email}
              >
                <EnvelopeIcon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{visita.lead.email}</span>
              </div>
            </div>
          </div>

          <StatusBadge status={visita.status} isDark={isDark} />
        </div>
      </div>

      {/* Linha Divisória entre Lead e Imóvel */}
      <div
        className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} mb-4`}
      />

      {/* Seção Dados do Imóvel - INFORMAÇÕES COMPLETAS VISÍVEIS */}
      <div className="mb-4">
        {/* Tipo do imóvel e valor NA MESMA LINHA */}
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
                title={tipoImovel}
              >
                {tipoImovel}
              </h4>

              <span
                className={`text-sm ${isDark ? "text-gray-600" : "text-gray-400"} flex-shrink-0 hidden sm:inline`}
              >
                |
              </span>

              {visita.imovel.valor && (
                <span
                  className={`text-sm font-semibold whitespace-nowrap truncate ${isDark ? "text-amber-300" : "text-amber-600"}`}
                  title={visita.imovel.valor}
                >
                  {visita.imovel.valor}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Código do imóvel ABAIXO do tipo/valor */}
        <div className="mb-3">
          <span
            className={`text-xs font-mono px-2 py-1 rounded ${isDark ? "bg-gray-700 text-gray-400" : "bg-gray-100 text-gray-500"}`}
          >
            {visita.imovel.codigo}
          </span>
        </div>

        {/* Endereço completo VISÍVEL */}
        <div className="mb-2">
          <p
            className={`text-sm line-clamp-2 min-h-[2.5rem] ${isDark ? "text-gray-300" : "text-gray-700"}`}
            title={visita.imovel.endereco}
          >
            {visita.imovel.endereco}
          </p>
        </div>

        {/* Bairro e quartos - INFORMAÇÕES PRÓXIMAS */}
        <div
          className={`flex items-center gap-2 text-xs ${isDark ? "text-gray-500" : "text-gray-500"} flex-wrap`}
        >
          <div className="flex items-center gap-1 whitespace-nowrap">
            <MapPinIcon className="w-3 h-3 flex-shrink-0" />
            <span
              className="truncate max-w-[100px] sm:max-w-[120px]"
              title={visita.imovel.bairro}
            >
              {visita.imovel.bairro}
            </span>
          </div>
          <span className={isDark ? "text-gray-600" : "text-gray-400"}>•</span>
          <div className="whitespace-nowrap">
            {visita.imovel.quartos} quarto
            {visita.imovel.quartos !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Linha Divisória entre Imóvel e Dados da Visita */}
      <div
        className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} mb-4`}
      />

      {/* Seção Dados da Visita - VISÍVEL */}
      <div className="space-y-2 sm:space-y-3 mb-4">
        {/* Data e Horário */}
        <div
          className={`flex items-center gap-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
        >
          <div
            className={`p-1.5 rounded-lg flex-shrink-0 ${isDark ? "bg-amber-900/20" : "bg-amber-50"}`}
          >
            <CalendarIcon
              className={`w-4 h-4 ${isDark ? "text-amber-400" : "text-amber-600"}`}
            />
          </div>
          <div className="flex items-center gap-1 sm:gap-2 text-sm">
            <span className="font-medium whitespace-nowrap">
              {visita.dataFormatada}
            </span>
            <span className={`${isDark ? "text-gray-600" : "text-gray-400"}`}>
              •
            </span>
            <span className="whitespace-nowrap">{visita.horario}</span>
          </div>
        </div>

        {/* Corretor - VISÍVEL */}
        {visita.status !== "solicitada" && visita.corretor && (
          <div
            className={`flex items-center gap-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            <div
              className={`p-1.5 rounded-lg flex-shrink-0 ${isDark ? "bg-emerald-900/20" : "bg-emerald-50"}`}
            >
              <UserIcon
                className={`w-4 h-4 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
              />
            </div>
            <span
              className="text-sm truncate"
              title={`Corretor: ${visita.corretor}`}
            >
              <strong className="font-medium truncate">
                {visita.corretor}
              </strong>
            </span>
          </div>
        )}
      </div>

      {/* Botões de Ação - RESPONSIVOS PARA SIDEBAR EXPANDIDO */}
      {getActionButtons()}

      {/* NOTA: REMOVIDA A SEÇÃO "VER DETALHES" - Não faz sentido para visitas solicitadas pelo site */}
    </div>
  );
};

// Componente de Aba Premium
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

// =========== DADOS MOCKADOS COM 9 VISITAS (3 LINHAS DE 3) ===========
const mockVisitas = [
  {
    id: 1,
    status: "solicitada",
    lead: {
      nome: "Maria Silva",
      telefone: "(11) 99999-9999",
      email: "maria@email.com",
    },
    imovel: {
      codigo: "APT-2024-001",
      endereco: "Av. Paulista, 1000",
      bairro: "Bela Vista",
      tipo: "Apartamento",
      quartos: 3,
      valor: "R$ 850.000",
    },
    dataFormatada: "15 Dez 2024",
    horario: "14:00",
    corretor: "Carlos Santos",
    observacoes:
      "Cliente interessado em apartamentos com varanda gourmet. Recebeu indicação através do site Adventus.",
    fonte: "Website",
  },
  {
    id: 2,
    status: "solicitada",
    lead: {
      nome: "João Oliveira",
      telefone: "(11) 98888-8888",
      email: "joao@email.com",
    },
    imovel: {
      codigo: "CASA-2024-045",
      endereco: "Rua Augusta, 500",
      bairro: "Consolação",
      tipo: "Casa",
      quartos: 4,
      valor: "R$ 1.200.000",
    },
    dataFormatada: "18 Dez 2024",
    horario: "10:30",
    corretor: "Ana Paula",
    observacoes:
      "Visita com toda a família. Interessados em espaço para home office. Cliente já fez pré-aprovação.",
    fonte: "WhatsApp",
  },
  {
    id: 3,
    status: "solicitada",
    lead: {
      nome: "Roberto Costa",
      telefone: "(11) 97777-7777",
      email: "roberto@email.com",
    },
    imovel: {
      codigo: "APT-2024-078",
      endereco: "Alameda Santos, 2000",
      bairro: "Jardins",
      tipo: "Apartamento",
      quartos: 2,
      valor: "R$ 950.000",
    },
    dataFormatada: "20 Dez 2024",
    horario: "16:00",
    corretor: "Carlos Santos",
    observacoes:
      "Cliente executivo, horário confirmado por e-mail. Prefere visita sem outros clientes.",
    fonte: "E-mail",
  },
  {
    id: 4,
    status: "agendada",
    lead: {
      nome: "Fernanda Lima",
      telefone: "(11) 96666-6666",
      email: "fernanda@email.com",
    },
    imovel: {
      codigo: "APT-2024-033",
      endereco: "Rua Oscar Freire, 800",
      bairro: "Pinheiros",
      tipo: "Apartamento",
      quartos: 3,
      valor: "R$ 1.100.000",
    },
    dataFormatada: "12 Dez 2024",
    horario: "15:00",
    corretor: "Ana Paula",
    observacoes:
      "Visita realizada com sucesso. Cliente demonstrou grande interesse. Agendou segunda visita para sexta-feira.",
    fonte: "Telefone",
  },
  {
    id: 5,
    status: "agendada",
    lead: {
      nome: "Pedro Alves",
      telefone: "(11) 95555-5555",
      email: "pedro@email.com",
    },
    imovel: {
      codigo: "CASA-2024-012",
      endereco: "Rua Haddock Lobo, 400",
      bairro: "Cerqueira César",
      tipo: "Casa",
      quartos: 3,
      valor: "R$ 2.300.000",
    },
    dataFormatada: "14 Dez 2024",
    horario: "11:00",
    corretor: "Carlos Santos",
    observacoes: "Cliente teve imprevisto de viagem.",
    motivoCancelamento: "Cancelado pelo cliente - Viagem de última hora",
    fonte: "Website",
  },
  {
    id: 6,
    status: "agendada",
    lead: {
      nome: "Carla Santos",
      telefone: "(11) 94444-4444",
      email: "carla@email.com",
    },
    imovel: {
      codigo: "TER-2024-005",
      endereco: "Rua Estados Unidos, 1500",
      bairro: "Jardim América",
      tipo: "Terreno",
      quartos: 0,
      valor: "R$ 750.000",
    },
    dataFormatada: "16 Dez 2024",
    horario: "09:00",
    corretor: "Ana Paula",
    observacoes: "Cliente busca terreno para construção própria.",
    fonte: "Site",
  },
  {
    id: 7,
    status: "confirmada",
    lead: {
      nome: "Ricardo Mendes",
      telefone: "(11) 93333-3333",
      email: "ricardo@email.com",
    },
    imovel: {
      codigo: "APT-2024-089",
      endereco: "Rua da Consolação, 2100",
      bairro: "Consolação",
      tipo: "Apartamento",
      quartos: 2,
      valor: "R$ 680.000",
    },
    dataFormatada: "19 Dez 2024",
    horario: "17:30",
    corretor: "Carlos Santos",
    observacoes:
      "Primeira visita. Cliente solteiro, busca apartamento próximo ao trabalho.",
    fonte: "WhatsApp",
  },
  {
    id: 8,
    status: "confirmada",
    lead: {
      nome: "Patrícia Rocha",
      telefone: "(11) 92222-2222",
      email: "patricia@email.com",
    },
    imovel: {
      codigo: "CASA-2024-067",
      endereco: "Alameda Jaú, 850",
      bairro: "Jardim Paulista",
      tipo: "Casa",
      quartos: 4,
      valor: "R$ 1.850.000",
    },
    dataFormatada: "10 Dez 2024",
    horario: "14:00",
    corretor: "Ana Paula",
    observacoes:
      "Visita muito positiva. Cliente solicitou documentação completa para análise familiar.",
    fonte: "Indicação",
  },
  {
    id: 9,
    status: "confirmada",
    lead: {
      nome: "Marcos Souza",
      telefone: "(11) 91111-1111",
      email: "marcos@email.com",
    },
    imovel: {
      codigo: "APTO-2024-099",
      endereco: "Rua Bela Cintra, 1500",
      bairro: "Consolação",
      tipo: "Apartamento",
      quartos: 2,
      valor: "R$ 720.000",
    },
    dataFormatada: "21 Dez 2024",
    horario: "09:30",
    corretor: "Carlos Santos",
    observacoes:
      "Cliente busca apartamento próximo ao metrô. Tem urgência para mudança.",
    fonte: "Site",
  },
];

// =========== PÁGINA PRINCIPAL PREMIUM ===========
const Visitas = () => {
  const [abaAtiva, setAbaAtiva] = useState("solicitada");
  const [visitas, setVisitas] = useState(mockVisitas);
  const [searchTerm, setSearchTerm] = useState("");
  const { isDark } = useTheme();

  const abas = [
    {
      id: "solicitada",
      label: "Solicitadas",
      count: visitas.filter((v) => v.status === "solicitada").length,
    },
    {
      id: "agendada",
      label: "Agendadas",
      count: visitas.filter((v) => v.status === "agendada").length,
    },
    {
      id: "confirmada",
      label: "Confirmadas",
      count: visitas.filter((v) => v.status === "confirmada").length,
    },
    {
      id: "realizada",
      label: "Realizadas",
      count: visitas.filter((v) => v.status === "realizada").length,
    },
    {
      id: "cancelada",
      label: "Canceladas",
      count: visitas.filter((v) => v.status === "cancelada").length,
    },
  ];

  const visitasFiltradas = visitas.filter(
    (v) =>
      v.status === abaAtiva &&
      (v.lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.lead.telefone.includes(searchTerm)),
  );

  // KPIs calculados
  const totalVisitas = visitas.length;
  const pendentesHoje = visitas.filter(
    (v) => v.status === "solicitada" || v.status === "agendada",
  ).length;
  const confirmadasHoje = visitas.filter(
    (v) => v.status === "confirmada",
  ).length;
  const realizadasHoje = visitas.filter((v) => v.status === "realizada").length;

  const handleAction = (visitaId, action) => {
    const novaVisitas = [...visitas];
    const index = novaVisitas.findIndex((v) => v.id === visitaId);

    if (index !== -1) {
      const statusMessages = {
        agendar: {
          status: "agendada",
          message: "Visita agendada com sucesso!",
        },
        confirmar: { status: "confirmada", message: "Visita confirmada!" },
        realizada: {
          status: "realizada",
          message: "Visita marcada como realizada!",
        },
        cancelar: {
          status: "cancelada",
          message: "Visita cancelada.",
          motivo: "Cancelado pelo corretor",
        },
        nao_compareceu: {
          status: "cancelada",
          message: "Registrado como não compareceu.",
          motivo: "Cliente não compareceu",
        },
      };

      if (statusMessages[action]) {
        novaVisitas[index].status = statusMessages[action].status;
        if (statusMessages[action].motivo) {
          novaVisitas[index].motivoCancelamento = statusMessages[action].motivo;
        }
      }

      setVisitas(novaVisitas);

      // Feedback visual
      console.log(`Ação ${action} na visita ${visitaId}`);
    }
  };

  return (
    <div
      className={`min-h-screen p-3 sm:p-4 lg:p-6 ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-gray-50 to-gray-100"}`}
    >
      {/* Header Premium */}
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

        {/* Barra de KPIs - Responsiva */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
          <div
            className={`rounded-xl p-3 border shadow-sm hover:shadow transition-shadow duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p
                  className={`text-xs sm:text-sm mb-1 truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Total de Visitas
                </p>
                <p
                  className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}
                >
                  {totalVisitas}
                </p>
              </div>
              <div
                className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${isDark ? "bg-amber-900/20" : "bg-amber-50"}`}
              >
                <CalendarDaysIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${isDark ? "text-amber-400" : "text-amber-600"}`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl p-3 border shadow-sm hover:shadow transition-shadow duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p
                  className={`text-xs sm:text-sm mb-1 truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Pendentes Hoje
                </p>
                <p
                  className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${isDark ? "text-amber-400" : "text-amber-600"}`}
                >
                  {pendentesHoje}
                </p>
              </div>
              <div
                className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${isDark ? "bg-amber-900/20" : "bg-amber-50"}`}
              >
                <ClockIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${isDark ? "text-amber-400" : "text-amber-600"}`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl p-3 border shadow-sm hover:shadow transition-shadow duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p
                  className={`text-xs sm:text-sm mb-1 truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Confirmadas
                </p>
                <p
                  className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                >
                  {confirmadasHoje}
                </p>
              </div>
              <div
                className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${isDark ? "bg-emerald-900/20" : "bg-emerald-50"}`}
              >
                <CheckCircleIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${isDark ? "text-emerald-400" : "text-emerald-600"}`}
                />
              </div>
            </div>
          </div>

          <div
            className={`rounded-xl p-3 border shadow-sm hover:shadow transition-shadow duration-300 ${
              isDark
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p
                  className={`text-xs sm:text-sm mb-1 truncate ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Realizadas
                </p>
                <p
                  className={`text-lg sm:text-xl lg:text-2xl font-bold truncate ${isDark ? "text-purple-400" : "text-purple-600"}`}
                >
                  {realizadasHoje}
                </p>
              </div>
              <div
                className={`p-1.5 sm:p-2 rounded-lg flex-shrink-0 ${isDark ? "bg-purple-900/20" : "bg-purple-50"}`}
              >
                <ChartBarIcon
                  className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${isDark ? "text-purple-400" : "text-purple-600"}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Barra de busca e filtros - Responsiva */}
        <div
          className={`rounded-xl p-3 sm:p-4 border shadow-sm mb-6 sm:mb-8 ${
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

      {/* Container principal para abas e conteúdo */}
      <div className="mb-6 sm:mb-8">
        {/* Cabeçalho do fluxo */}
        <div className="mb-4 sm:mb-6">
          <h2
            className={`text-base sm:text-lg font-semibold mb-2 sm:mb-3 truncate ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Fluxo de Visitas
          </h2>
          <p
            className={`text-sm mb-4 sm:mb-6 ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            As visitas solicitadas pelo site começam aqui. Acompanhe cada etapa
            do processo.
          </p>

          {/* Abas de Status Premium - SCROLL HORIZONTAL PARA MOBILE */}
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

        {/* Indicador de Progresso Visual - Apenas desktop */}
        <div className="hidden lg:flex items-center justify-between mb-6">
          {["solicitada", "agendada", "confirmada", "realizada"].map(
            (status, index) => {
              const isActive = abaAtiva === status;
              const isPast =
                ["solicitada", "agendada", "confirmada"].indexOf(abaAtiva) >=
                index;

              return (
                <React.Fragment key={status}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                    w-8 h-8 rounded-full flex items-center justify-center mb-2
                    ${isActive || isPast ? "bg-[#D4A24D] text-white" : isDark ? "bg-gray-700 text-gray-400" : "bg-gray-200 text-gray-400"}
                    transition-all duration-300
                  `}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} capitalize`}
                    >
                      {status}
                    </span>
                  </div>
                  {index < 3 && (
                    <div
                      className={`flex-1 h-0.5 relative ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                    >
                      <div
                        className={`
                      absolute top-0 left-0 h-full bg-[#D4A24D] transition-all duration-1000
                      ${["agendada", "confirmada", "realizada"].indexOf(abaAtiva) >= index ? "w-full" : "w-0"}
                    `}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            },
          )}
        </div>
      </div>

      {/* Área de Conteúdo - GRID RESPONSIVA PARA SIDEBAR EXPANDIDO */}
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

      {/* Footer Informativo - Responsivo */}
      <div
        className={`mt-4 sm:mt-6 lg:mt-8 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg ${
          isDark ? "bg-gray-800 text-gray-100" : "bg-[#31353E] text-white"
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#D4A24D] rounded-lg flex items-center justify-center flex-shrink-0">
                <BuildingOfficeIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" />
              </div>
              <h3 className="text-base sm:text-lg font-bold truncate">
                Ciclo de Visitas Adventus
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-300 mb-3 sm:mb-4">
              Otimize o processo de vendas acompanhando cada visita do início ao
              fechamento. Visitas solicitadas pelo site aparecem automaticamente
              como "Solicitadas".
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400 mb-1 truncate">
                  {abas[0].count}
                </div>
                <div className="text-xs text-gray-400">Solicitadas</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-400 mb-1 truncate">
                  {abas[1].count}
                </div>
                <div className="text-xs text-gray-400">Agendadas</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-emerald-400 mb-1 truncate">
                  {abas[2].count}
                </div>
                <div className="text-xs text-gray-400">Confirmadas</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-400 mb-1 truncate">
                  {abas[3].count}
                </div>
                <div className="text-xs text-gray-400">Realizadas</div>
              </div>
            </div>
          </div>

          <div className="lg:w-80 xl:w-96">
            <div
              className={`rounded-lg p-3 sm:p-4 ${isDark ? "bg-gray-700/50" : "bg-white/10"}`}
            >
              <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">
                Dicas Rápidas
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="truncate">
                    Agende visitas no mesmo dia para aumentar conversão
                  </span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="truncate">
                    Envie lembrete 2h antes de visitas confirmadas
                  </span>
                </li>
                <li className="flex items-start gap-1.5 sm:gap-2">
                  <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="truncate">
                    Visitas realizadas devem gerar proposta em 24h
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos globais para responsividade */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .min-w-0 {
          min-width: 0;
        }

        /* Breakpoint extra pequeno para sidebar expandido */
        @media (min-width: 475px) {
          .xs\:flex-row {
            flex-direction: row;
          }
        }
      `}</style>
    </div>
  );
};

export default Visitas;
