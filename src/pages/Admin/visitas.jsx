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
  PhoneIcon,
  EnvelopeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpDownIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  UserGroupIcon,
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

// =========== COMPONENTES AUXILIARES PREMIUM ===========

// Badge de status premium
const StatusBadge = ({ status }) => {
  const statusConfig = {
    solicitada: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: <ExclamationCircleIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Solicitada",
    },
    agendada: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <ClockIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Agendada",
    },
    confirmada: {
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircleIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Confirmada",
    },
    realizada: {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: <CheckCircleIconSolid className="w-3 h-3 mr-1.5" />,
      label: "Realizada",
    },
    cancelada: {
      color: "bg-rose-50 text-rose-700 border-rose-200",
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

// Card de Visita Premium
const VisitaCard = ({ visita, onAction }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case "solicitada":
        return <ExclamationCircleIcon className="w-5 h-5 text-blue-500" />;
      case "agendada":
        return <CalendarIcon className="w-5 h-5 text-amber-500" />;
      case "confirmada":
        return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
      case "realizada":
        return <CheckCircleIcon className="w-5 h-5 text-purple-500" />;
      case "cancelada":
        return <XCircleIcon className="w-5 h-5 text-rose-500" />;
      default:
        return <CalendarIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getActionButtons = () => {
    const baseBtnClass =
      "px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2";

    switch (visita.status) {
      case "solicitada":
        return (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onAction(visita.id, "agendar")}
              className={`${baseBtnClass} bg-[#31353E] text-white hover:bg-[#3a3f4a] shadow-sm hover:shadow`}
            >
              <CalendarIcon className="w-4 h-4" />
              Agendar visita
            </button>
            <button
              onClick={() => onAction(visita.id, "cancelar")}
              className={`${baseBtnClass} border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400`}
            >
              <XCircleIcon className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        );

      case "agendada":
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onAction(visita.id, "confirmar")}
              className={`${baseBtnClass} bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow`}
            >
              <CheckCircleIcon className="w-4 h-4" />
              Confirmar
            </button>
            <button
              onClick={() => onAction(visita.id, "reagendar")}
              className={`${baseBtnClass} bg-[#D4A24D] text-white hover:bg-[#e0b157] shadow-sm hover:shadow`}
            >
              <ArrowPathIcon className="w-4 h-4" />
              Reagendar
            </button>
            <button
              onClick={() => onAction(visita.id, "cancelar")}
              className={`${baseBtnClass} border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400`}
            >
              <XCircleIcon className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        );

      case "confirmada":
        return (
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => onAction(visita.id, "realizada")}
              className={`${baseBtnClass} bg-purple-600 text-white hover:bg-purple-700 shadow-sm hover:shadow`}
            >
              <CheckBadgeIcon className="w-4 h-4" />
              Realizada
            </button>
            <button
              onClick={() => onAction(visita.id, "nao_compareceu")}
              className={`${baseBtnClass} border border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400`}
            >
              <UserIcon className="w-4 h-4" />
              Não compareceu
            </button>
            <button
              onClick={() => onAction(visita.id, "cancelar")}
              className={`${baseBtnClass} border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400`}
            >
              <XCircleIcon className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        );

      case "realizada":
        return (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onAction(visita.id, "negociar")}
              className={`${baseBtnClass} bg-[#31353E] text-white hover:bg-[#3a3f4a] shadow-sm hover:shadow`}
            >
              <ChatBubbleLeftRightIcon className="w-4 h-4" />
              Iniciar negociação
            </button>
            <button
              onClick={() => onAction(visita.id, "sem_interesse")}
              className={`${baseBtnClass} border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400`}
            >
              <XCircleIcon className="w-4 h-4" />
              Sem interesse
            </button>
          </div>
        );

      case "cancelada":
        return (
          <div className="mt-4 p-3 bg-rose-50 rounded-lg border border-rose-200">
            <div className="flex items-center gap-2 text-rose-800">
              <ExclamationCircleIcon className="w-4 h-4" />
              <p className="text-sm font-medium">
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
        bg-white rounded-xl border border-gray-200 p-6 
        transition-all duration-500 ease-out
        hover:shadow-lg hover:border-gray-300
        ${visita.status === "cancelada" ? "opacity-90" : ""}
        ${isHovering ? "transform -translate-y-1" : ""}
      `}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Cabeçalho do card */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-lg ${visita.status === "cancelada" ? "bg-gray-100" : "bg-gradient-to-br from-gray-50 to-gray-100"}`}
          >
            {getStatusIcon(visita.status)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900">
                {visita.lead.nome}
              </h3>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <PhoneIcon className="w-3 h-3" />
                {visita.lead.telefone}
              </span>
            </div>
            <p className="text-sm text-gray-600">{visita.lead.email}</p>
          </div>
        </div>

        <StatusBadge status={visita.status} />
      </div>

      {/* Corpo do card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-4">
        {/* Seção do Imóvel */}
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="p-1.5 bg-amber-50 rounded-lg mt-0.5">
              <HomeIcon className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {visita.imovel.codigo}
                </span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {visita.imovel.tipo}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-1">
                {visita.imovel.endereco}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <MapPinIcon className="w-3 h-3" />
                {visita.imovel.bairro}
                <span className="text-gray-400">•</span>
                {visita.imovel.quartos} quartos
              </div>
            </div>
          </div>
        </div>

        {/* Seção da Visita */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-700">
            <div className="p-1.5 bg-blue-50 rounded-lg">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <span className="font-medium">{visita.dataFormatada}</span>
              <span className="text-gray-400 mx-2">•</span>
              <span>{visita.horario}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <div className="p-1.5 bg-emerald-50 rounded-lg">
              <UserIcon className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-sm">
              Corretor:{" "}
              <strong className="font-medium">{visita.corretor}</strong>
            </span>
          </div>

          {visita.imovel.valor && (
            <div className="flex items-center gap-2 text-gray-700 mt-2 pt-2 border-t border-gray-100">
              <div className="p-1.5 bg-gray-50 rounded-lg">
                <BuildingOfficeIcon className="w-4 h-4 text-gray-600" />
              </div>
              <span className="text-sm font-medium">{visita.imovel.valor}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ações */}
      {getActionButtons()}

      {/* Expansão de detalhes */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-[#31353E] transition-colors duration-300 group"
        >
          <ChevronRightIcon
            className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-90" : ""} group-hover:translate-x-1`}
          />
          <span className="text-sm font-medium">
            {expanded ? "Ocultar detalhes" : "Ver detalhes completos"}
          </span>
        </button>

        {expanded && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fadeIn">
            <div className="flex items-start gap-3">
              <EyeIcon className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">
                  Observações
                </h4>
                <p className="text-sm text-gray-700 mb-4">
                  {visita.observacoes ||
                    "Nenhuma observação registrada para esta visita."}
                </p>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:text-[#31353E] hover:bg-white rounded-lg border border-gray-300 transition-colors duration-300">
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-gray-300 transition-colors duration-300">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Componente de Aba Premium
const StatusTab = ({ status, label, count, isActive, onClick, color }) => {
  const colorConfig = {
    solicitada: {
      bg: "bg-blue-500",
      hover: "hover:bg-blue-600",
      light: "bg-blue-50",
      border: "border-blue-300",
    },
    agendada: {
      bg: "bg-amber-500",
      hover: "hover:bg-amber-600",
      light: "bg-amber-50",
      border: "border-amber-300",
    },
    confirmada: {
      bg: "bg-emerald-500",
      hover: "hover:bg-emerald-600",
      light: "bg-emerald-50",
      border: "border-emerald-300",
    },
    realizada: {
      bg: "bg-purple-500",
      hover: "hover:bg-purple-600",
      light: "bg-purple-50",
      border: "border-purple-300",
    },
    cancelada: {
      bg: "bg-rose-500",
      hover: "hover:bg-rose-600",
      light: "bg-rose-50",
      border: "border-rose-300",
    },
  };

  const config = colorConfig[status] || colorConfig.solicitada;

  return (
    <button
      onClick={() => onClick(status)}
      className={`
        flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-300
        ${
          isActive
            ? `${config.light} text-gray-900 border ${config.border} shadow-sm`
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }
        font-medium text-sm
      `}
    >
      <div
        className={`w-2 h-2 rounded-full ${isActive ? config.bg : "bg-gray-300"}`}
      />
      <span>{label}</span>
      {count > 0 && (
        <span
          className={`
          px-2 py-0.5 rounded-full text-xs font-bold
          ${isActive ? config.bg + " text-white" : "bg-gray-100 text-gray-600"}
        `}
        >
          {count}
        </span>
      )}
    </button>
  );
};

// =========== DADOS MOCKADOS ===========
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
    status: "agendada",
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
    status: "confirmada",
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
    status: "realizada",
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
    status: "cancelada",
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
];

// =========== PÁGINA PRINCIPAL PREMIUM ===========
const Visitas = () => {
  const [abaAtiva, setAbaAtiva] = useState("solicitada");
  const [visitas, setVisitas] = useState(mockVisitas);
  const [searchTerm, setSearchTerm] = useState("");

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
        v.imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase())),
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

      // Feedback visual (em um ambiente real, seria uma notificação toast)
      console.log(`Ação ${action} na visita ${visitaId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      {/* Header Premium */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#31353E] mb-2">Visitas</h1>
            <p className="text-gray-600">
              Gerencie o ciclo completo de visitas aos imóveis
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300 flex items-center gap-2">
              <FunnelIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Filtrar</span>
            </button>
            <button className="px-4 py-2 bg-[#31353E] text-white rounded-lg hover:bg-[#3a3f4a] transition-colors duration-300 flex items-center gap-2 shadow-sm">
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm font-medium">Nova Visita</span>
            </button>
          </div>
        </div>

        {/* Barra de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Visitas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalVisitas}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <CalendarDaysIcon className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pendentes Hoje</p>
                <p className="text-2xl font-bold text-amber-600">
                  {pendentesHoje}
                </p>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <ClockIcon className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Confirmadas</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {confirmadasHoje}
                </p>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircleIcon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Realizadas</p>
                <p className="text-2xl font-bold text-purple-600">
                  {realizadasHoje}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Barra de busca e filtros */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome, telefone ou código do imóvel..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-transparent transition-all duration-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D] focus:border-transparent transition-all duration-300">
                <option>Todos corretores</option>
                <option>Carlos Santos</option>
                <option>Ana Paula</option>
              </select>
              <select className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D] focus:border-transparent transition-all duration-300">
                <option>Todas as datas</option>
                <option>Hoje</option>
                <option>Amanhã</option>
                <option>Esta semana</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Abas de Status Premium */}
      <div className="mb-8">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Fluxo de Visitas
          </h2>
          <p className="text-sm text-gray-600">
            As visitas solicitadas pelo site começam aqui. Acompanhe cada etapa
            do processo.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {abas.map((aba) => (
            <StatusTab
              key={aba.id}
              status={aba.id}
              label={aba.label}
              count={aba.count}
              isActive={abaAtiva === aba.id}
              onClick={setAbaAtiva}
            />
          ))}
        </div>

        {/* Indicador de Progresso Visual */}
        <div className="flex items-center justify-between mb-6 px-4">
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
                    ${isActive || isPast ? "bg-[#D4A24D] text-white" : "bg-gray-200 text-gray-400"}
                    transition-all duration-300
                  `}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs text-gray-600 capitalize">
                      {status}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className="flex-1 h-0.5 bg-gray-200 relative">
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

      {/* Área de Conteúdo */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 min-h-[600px]">
        {visitasFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {visitasFiltradas.map((visita) => (
              <VisitaCard
                key={visita.id}
                visita={visita}
                onAction={handleAction}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <CalendarIcon className="w-20 h-20 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm
                ? "Nenhuma visita encontrada"
                : `Nenhuma visita ${abaAtiva}`}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {searchTerm
                ? "Tente ajustar os termos da busca ou remover filtros."
                : "Todas as visitas deste status foram processadas. Excelente trabalho!"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="px-4 py-2 text-[#31353E] border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300"
              >
                Limpar busca
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer Informativo */}
      <div className="mt-8 bg-[#31353E] text-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#D4A24D] rounded-lg flex items-center justify-center">
                <BuildingOfficeIcon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold">Ciclo de Visitas Adventus</h3>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              Otimize o processo de vendas acompanhando cada visita do início ao
              fechamento. Visitas solicitadas pelo site aparecem automaticamente
              como "Solicitadas".
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {abas[0].count}
                </div>
                <div className="text-xs text-gray-400">Solicitadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400 mb-1">
                  {abas[1].count}
                </div>
                <div className="text-xs text-gray-400">Agendadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400 mb-1">
                  {abas[2].count}
                </div>
                <div className="text-xs text-gray-400">Confirmadas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400 mb-1">
                  {abas[3].count}
                </div>
                <div className="text-xs text-gray-400">Realizadas</div>
              </div>
            </div>
          </div>

          <div className="lg:w-96">
            <div className="bg-white/10 rounded-lg p-4">
              <h4 className="font-medium mb-3">Dicas Rápidas</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>
                    Agende visitas no mesmo dia para aumentar conversão
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Envie lembrete 2h antes de visitas confirmadas</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>Visitas realizadas devem gerar proposta em 24h</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Estilos de animação */}
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
      `}</style>
    </div>
  );
};

export default Visitas;
