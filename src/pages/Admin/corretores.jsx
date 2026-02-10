import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
  EyeSlashIcon,
  EyeIcon,
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  AcademicCapIcon,
  XCircleIcon,
  CheckCircleIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  LockClosedIcon,
  XMarkIcon,
  ChartBarIcon,
  TrophyIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  HomeIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
} from "@heroicons/react/24/solid";
import Button from "../../componentes/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

// COMPONENTE MODAL DE AGENDAMENTO
const ModalAgendamentoEntrevista = ({
  isOpen,
  onClose,
  candidato,
  formAgendamento,
  setFormAgendamento,
  errosForm,
  handleSalvarAgendamento,
  isDark,
}) => {
  if (!isOpen || !candidato) return null;

  const horarioInputRef = useRef(null);
  const dataInputRef = useRef(null);
  const [horarioFocado, setHorarioFocado] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  // Calcular data mínima (hoje)
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  const dataMinima = `${ano}-${mes}-${dia}`;

  // FIX: Gerenciar overflow do body
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        document.body.style.overflow = originalOverflow;
        // Limpar timeout ao desmontar
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [isOpen, timeoutId]);

  // Handler específico para input de horário
  const handleHorarioChange = (e) => {
    const novoHorario = e.target.value;
    setFormAgendamento((prev) => ({
      ...prev,
      horarioEntrevista: novoHorario,
    }));
  };

  // Handler para focus no input de horário
  const handleHorarioFocus = () => {
    setHorarioFocado(true);
  };

  // Handler para blur no input de horário
  const handleHorarioBlur = () => {
    setHorarioFocado(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content */}
        <div
          className={`
            relative w-full max-w-md rounded-xl shadow-2xl transform transition-all z-[10000]
            ${
              isDark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`
              px-6 py-4 border-b
              ${isDark ? "border-gray-700" : "border-gray-200"}
            `}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`
                  text-lg font-semibold
                  ${isDark ? "text-gray-200" : "text-gray-900"}
                `}
              >
                Agendar Entrevista
              </h3>
              <button
                onClick={onClose}
                className={`
                    p-1.5 rounded-lg transition-all duration-200
                    ${
                      isDark
                        ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }
                  `}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            {/* Identificação do Candidato */}
            <div className="mb-4">
              <div
                className={`
                  p-3 rounded-lg border
                  ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border border-gray-200"}
                `}
              >
                <div className="space-y-1">
                  <div
                    className={`
                      text-sm font-medium
                      ${isDark ? "text-gray-300" : "text-gray-700"}
                    `}
                  >
                    {candidato.nome}
                  </div>
                  <div
                    className={`
                      text-xs
                      ${isDark ? "text-gray-500" : "text-gray-600"}
                    `}
                  >
                    CRECI: {candidato.creci}
                  </div>
                </div>
              </div>
            </div>

            {/* Formulário */}
            <div className="space-y-3">
              {/* Data da Entrevista */}
              <div>
                <input
                  ref={dataInputRef}
                  type="date"
                  value={formAgendamento.dataEntrevista}
                  onChange={(e) =>
                    setFormAgendamento((prev) => ({
                      ...prev,
                      dataEntrevista: e.target.value,
                    }))
                  }
                  min={dataMinima}
                  className={`
                      w-full px-3 py-2.5 rounded-lg border text-sm
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      }
                      ${
                        errosForm.dataEntrevista
                          ? isDark
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                            : "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                          : ""
                      }
                      focus:outline-none focus:ring-2 transition-colors duration-200
                    `}
                  style={{
                    colorScheme: isDark ? "dark" : "light",
                  }}
                />
                {errosForm.dataEntrevista && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {errosForm.dataEntrevista}
                  </p>
                )}
              </div>

              {/* Horário da Entrevista */}
              <div>
                <div className="relative">
                  <input
                    ref={horarioInputRef}
                    type="time"
                    value={formAgendamento.horarioEntrevista}
                    onChange={handleHorarioChange}
                    onFocus={handleHorarioFocus}
                    onBlur={handleHorarioBlur}
                    className={`
                      w-full px-3 py-2.5 rounded-lg border text-sm
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      }
                      ${
                        errosForm.horarioEntrevista
                          ? isDark
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                            : "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                          : ""
                      }
                      focus:outline-none focus:ring-2 transition-colors duration-200
                    `}
                    style={{
                      colorScheme: isDark ? "dark" : "light",
                    }}
                  />
                </div>

                {errosForm.horarioEntrevista && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {errosForm.horarioEntrevista}
                  </p>
                )}

                <div
                  className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Clique no campo para selecionar hora e minutos
                </div>
              </div>

              {/* Entrevistador */}
              <div>
                <input
                  type="text"
                  value={formAgendamento.entrevistador}
                  onChange={(e) =>
                    setFormAgendamento((prev) => ({
                      ...prev,
                      entrevistador: e.target.value,
                    }))
                  }
                  placeholder="Com: CEO, Gerente, RH"
                  className={`
                      w-full px-3 py-2.5 rounded-lg border text-sm
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      }
                      ${
                        errosForm.entrevistador
                          ? isDark
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                            : "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                          : ""
                      }
                      focus:outline-none focus:ring-2 transition-colors duration-200
                    `}
                />
                {errosForm.entrevistador && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {errosForm.entrevistador}
                  </p>
                )}
              </div>

              {/* Observações */}
              <div>
                <textarea
                  value={formAgendamento.observacoes}
                  onChange={(e) =>
                    setFormAgendamento((prev) => ({
                      ...prev,
                      observacoes: e.target.value,
                    }))
                  }
                  placeholder="Observações adicionais sobre a entrevista"
                  rows="2"
                  className={`
                      w-full px-3 py-2.5 rounded-lg border text-sm resize-none
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      }
                      focus:outline-none focus:ring-2 transition-colors duration-200
                    `}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`
              px-6 py-3 border-t
              ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}
            `}
          >
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isDark
                        ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                    }
                  `}
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarAgendamento}
                className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isDark
                        ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                        : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
                    }
                  `}
              >
                Agendar Entrevista
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPONENTES AUXILIARES DO MODAL DE PERFIL
const StatusBadge = ({ status, isDark }) => {
  const config = {
    Ativo: {
      bgColor: isDark ? "bg-green-900/30" : "bg-green-100",
      textColor: isDark ? "text-green-300" : "text-green-800",
      borderColor: isDark ? "border-green-800" : "border-green-300",
      icon: CheckCircleIconSolid,
      iconColor: isDark ? "text-green-400" : "text-green-600",
    },
    Inativo: {
      bgColor: isDark ? "bg-red-900/30" : "bg-red-100",
      textColor: isDark ? "text-red-300" : "text-red-800",
      borderColor: isDark ? "border-red-800" : "border-red-300",
      icon: XCircleIcon,
      iconColor: isDark ? "text-red-400" : "text-red-600",
    },
    Férias: {
      bgColor: isDark ? "bg-amber-900/30" : "bg-amber-100",
      textColor: isDark ? "text-amber-300" : "text-amber-800",
      borderColor: isDark ? "border-amber-800" : "border-amber-300",
      icon: ClockIcon,
      iconColor: isDark ? "text-amber-400" : "text-amber-600",
    },
  };

  const {
    bgColor,
    textColor,
    borderColor,
    icon: Icon,
    iconColor,
  } = config[status] || config.Ativo;

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full border ${bgColor} ${borderColor}`}
    >
      <Icon className={`w-4 h-4 mr-2 ${iconColor}`} />
      <span className={`text-sm font-medium ${textColor}`}>{status}</span>
    </div>
  );
};

const KPICard = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  isDark,
  color = "primary",
}) => {
  const colorClasses = {
    primary: isDark
      ? "bg-blue-900/20 border-blue-800/50 text-blue-300"
      : "bg-blue-50 border-blue-200 text-blue-700",
    green: isDark
      ? "bg-green-900/20 border-green-800/50 text-green-300"
      : "bg-green-50 border-green-200 text-green-700",
    amber: isDark
      ? "bg-amber-900/20 border-amber-800/50 text-amber-300"
      : "bg-amber-50 border-amber-200 text-amber-700",
    purple: isDark
      ? "bg-purple-900/20 border-purple-800/50 text-purple-300"
      : "bg-purple-50 border-purple-200 text-purple-700",
  };

  return (
    <div className={`rounded-xl border p-4 ${colorClasses[color]}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center">
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          <span
            className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
          >
            {title}
          </span>
        </div>
        {trend && (
          <div
            className={`flex items-center text-xs ${trend > 0 ? "text-green-500" : "text-red-500"}`}
          >
            {trend > 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div
        className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
      >
        {value}
      </div>
      {subtitle && (
        <div
          className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {subtitle}
        </div>
      )}
    </div>
  );
};

const ProgressBar = ({ percentage, label, color = "primary", isDark }) => {
  const colorConfig = {
    primary: isDark ? "bg-[#D4A24D]" : "bg-[#D4A24D]",
    green: isDark ? "bg-green-500" : "bg-green-600",
    blue: isDark ? "bg-blue-500" : "bg-blue-600",
    red: isDark ? "bg-red-500" : "bg-red-600",
  };

  const bgColor = isDark ? "bg-gray-700" : "bg-gray-200";

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className={isDark ? "text-gray-300" : "text-gray-700"}>
          {label}
        </span>
        <span className="font-semibold">{percentage}%</span>
      </div>
      <div className={`h-2 rounded-full overflow-hidden ${bgColor}`}>
        <div
          className={`h-full rounded-full ${colorConfig[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const SalesTimeline = ({ sales, isDark }) => (
  <div className="space-y-3">
    {sales.map((sale, index) => (
      <div key={index} className="flex items-start">
        <div className="flex-shrink-0 mt-1">
          <div
            className={`w-2 h-2 rounded-full ${isDark ? "bg-green-500" : "bg-green-600"}`}
          />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between">
            <span
              className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
            >
              {sale.property}
            </span>
            <span
              className={`font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
            >
              R$ {sale.value.toLocaleString("pt-BR")}
            </span>
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {sale.date} • {sale.client}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EligibilityBadge = ({ type, status, isDark }) => {
  const config = {
    Premiação: {
      eligible: {
        icon: TrophyIcon,
        color: isDark ? "text-amber-400" : "text-amber-600",
        bg: isDark ? "bg-amber-900/30" : "bg-amber-100",
        text: isDark ? "text-amber-300" : "text-amber-800",
      },
      attention: {
        icon: ExclamationCircleIcon,
        color: isDark ? "text-red-400" : "text-red-600",
        bg: isDark ? "bg-red-900/30" : "bg-red-100",
        text: isDark ? "text-red-300" : "text-red-800",
      },
    },
    Comissão: {
      eligible: {
        icon: CurrencyDollarIcon,
        color: isDark ? "text-green-400" : "text-green-600",
        bg: isDark ? "bg-green-900/30" : "bg-green-100",
        text: isDark ? "text-green-300" : "text-green-800",
      },
    },
    PL: {
      eligible: {
        icon: ChartBarIcon,
        color: isDark ? "text-purple-400" : "text-purple-600",
        bg: isDark ? "bg-purple-900/30" : "bg-purple-100",
        text: isDark ? "text-purple-300" : "text-purple-800",
      },
    },
  };

  const {
    icon: Icon,
    color,
    bg,
    text,
  } = config[type]?.[status] || config.Premiação.eligible;

  return (
    <div className={`flex items-center px-3 py-2 rounded-lg ${bg}`}>
      <Icon className={`w-5 h-5 mr-2 ${color}`} />
      <div className="flex-1">
        <div className={`text-sm font-medium ${text}`}>{type}</div>
        <div
          className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {status === "eligible" ? "Elegível" : "Atenção necessária"}
        </div>
      </div>
    </div>
  );
};

// MODAL DE PERFIL DO CORRETOR
const ModalPerfilCorretor = ({ isOpen, onClose, corretor, isDark }) => {
  if (!isOpen || !corretor) return null;

  // Dados de exemplo para o corretor
  const corretorData = {
    ...corretor,
    kpis: {
      imoveisResponsabilidade: 12,
      imoveisVendidosMes: 3,
      leadsRecebidos: 24,
      taxaConversao: "8.3%",
      valorTotalVendas: "R$ 2.5M",
      mediaMensal: "R$ 850K",
    },
    metas: {
      atual: "R$ 1.0M",
      atingido: "R$ 850K",
      percentual: 85,
    },
    treinamentos: {
      concluidos: 5,
      pendentes: 2,
      engajamento: "alto",
      ultimoTreinamento: "15/02/2026",
      nivel: "Avançado",
    },
    vendasRecentes: [
      {
        property: "Apartamento Higienópolis",
        value: 1850000,
        date: "10/02/2026",
        client: "Maria Silva",
      },
      {
        property: "Cobertura Moema",
        value: 3200000,
        date: "05/02/2026",
        client: "João Santos",
      },
      {
        property: "Sala Comercial Paulista",
        value: 850000,
        date: "28/01/2026",
        client: "Empresa XYZ",
      },
    ],
    feedbacks: [
      {
        texto: "Excelente atendimento ao cliente Silva",
        autor: "Gerente",
        data: "12/02/2026",
      },
      {
        texto: "Proativo na captação de leads",
        autor: "Líder de Equipe",
        data: "05/02/2026",
      },
    ],
    incentivos: [
      { type: "Premiação", status: "eligible" },
      { type: "Comissão", status: "eligible" },
      { type: "PL", status: "attention" },
    ],
  };

  const [observacoes, setObservacoes] = useState(
    "Corretor dedicado com alto potencial para grandes negócios. Precisa desenvolver habilidades com clientes corporativos.",
  );

  const handleSalvarObservacoes = () => {
    console.log("Observações salvas:", observacoes);
    // Aqui integraria com API
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container - Largura maior para conteúdo rico */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Content - Layout de duas colunas */}
        <div
          className={`
            relative w-full max-w-6xl rounded-2xl shadow-2xl transform transition-all z-[10000]
            ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`
            px-8 py-6 border-b flex items-center justify-between
            ${isDark ? "border-gray-700" : "border-gray-200"}
          `}
          >
            <div className="flex items-center space-x-4">
              <div>
                <h2
                  className={`
                  text-2xl font-bold
                  ${isDark ? "text-gray-100" : "text-gray-900"}
                `}
                >
                  {corretorData.nome}
                </h2>
                <div className="flex items-center mt-2 space-x-3">
                  <StatusBadge status={corretorData.status} isDark={isDark} />
                  <div
                    className={`flex items-center ${isDark ? "text-amber-300" : "text-amber-600"}`}
                  >
                    <StarIconSolid className="w-5 h-5 mr-1" />
                    <span className="font-bold text-lg">
                      {corretorData.rating}
                    </span>
                  </div>
                  <div
                    className={`
                    text-sm ${isDark ? "text-gray-400" : "text-gray-600"}
                  `}
                  >
                    CRECI: {corretorData.creci}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Botões de Ação Rápida */}
              <button
                className={`
                p-2 rounded-lg transition-all duration-200
                ${
                  isDark
                    ? "bg-green-900/30 text-green-300 hover:bg-green-800/50 border border-green-800/50"
                    : "bg-green-100 text-green-600 hover:bg-green-200 border border-green-200"
                }
              `}
              >
                <PhoneIcon className="w-5 h-5" />
              </button>
              <button
                className={`
                p-2 rounded-lg transition-all duration-200
                ${
                  isDark
                    ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 border border-blue-800/50"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200 border border-blue-200"
                }
              `}
              >
                <EnvelopeIcon className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className={`
                  p-2 rounded-lg transition-all duration-200
                  ${
                    isDark
                      ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body - Layout de duas colunas */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna Esquerda: KPIs e Performance */}
              <div className="lg:col-span-2 space-y-6">
                {/* Resumo de Performance */}
                <div>
                  <h3
                    className={`
                    text-lg font-semibold mb-4 flex items-center
                    ${isDark ? "text-gray-200" : "text-gray-900"}
                  `}
                  >
                    <ChartBarIcon className="w-5 h-5 mr-2" />
                    Resumo de Performance
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <KPICard
                      title="Imóveis sob responsabilidade"
                      value={corretorData.kpis.imoveisResponsabilidade}
                      icon={HomeIcon}
                      trend={5}
                      isDark={isDark}
                      color="blue"
                    />
                    <KPICard
                      title="Vendas este mês"
                      value={corretorData.kpis.imoveisVendidosMes}
                      icon={TrophyIcon}
                      trend={12}
                      subtitle={`R$ ${corretorData.kpis.valorTotalVendas}`}
                      isDark={isDark}
                      color="green"
                    />
                    <KPICard
                      title="Leads recebidos"
                      value={corretorData.kpis.leadsRecebidos}
                      icon={UserGroupIcon}
                      trend={8}
                      isDark={isDark}
                      color="purple"
                    />
                    <KPICard
                      title="Taxa de conversão"
                      value={corretorData.kpis.taxaConversao}
                      icon={ArrowTrendingUpIcon}
                      trend={3}
                      subtitle="leads → vendas"
                      isDark={isDark}
                      color="amber"
                    />
                    <KPICard
                      title="Média mensal"
                      value={corretorData.kpis.mediaMensal}
                      icon={CurrencyDollarIcon}
                      trend={15}
                      subtitle="últimos 6 meses"
                      isDark={isDark}
                      color="green"
                    />
                  </div>
                </div>

                {/* Metas e Progresso */}
                <div>
                  <h3
                    className={`
                    text-lg font-semibold mb-4 flex items-center
                    ${isDark ? "text-gray-200" : "text-gray-900"}
                  `}
                  >
                    <TrophyIcon className="w-5 h-5 mr-2" />
                    Metas e Progresso
                  </h3>
                  <div
                    className={`
                    rounded-xl border p-6
                    ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}
                  `}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div
                          className={`
                          text-sm ${isDark ? "text-gray-400" : "text-gray-600"}
                        `}
                        >
                          Meta atual
                        </div>
                        <div
                          className={`
                          text-xl font-bold ${isDark ? "text-white" : "text-gray-900"}
                        `}
                        >
                          {corretorData.metas.atual}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`
                          text-sm ${isDark ? "text-gray-400" : "text-gray-600"}
                        `}
                        >
                          Atingido
                        </div>
                        <div
                          className={`
                          text-xl font-bold ${isDark ? "text-green-400" : "text-green-600"}
                        `}
                        >
                          {corretorData.metas.atingido}
                        </div>
                      </div>
                    </div>
                    <ProgressBar
                      percentage={corretorData.metas.percentual}
                      label="Progresso da meta"
                      color="green"
                      isDark={isDark}
                    />
                  </div>
                </div>

                {/* Histórico Recente de Vendas */}
                <div>
                  <h3
                    className={`
                    text-lg font-semibold mb-4 flex items-center
                    ${isDark ? "text-gray-200" : "text-gray-900"}
                  `}
                  >
                    <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                    Histórico Recente de Vendas
                  </h3>
                  <div
                    className={`
                    rounded-xl border p-6
                    ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}
                  `}
                  >
                    <SalesTimeline
                      sales={corretorData.vendasRecentes}
                      isDark={isDark}
                    />
                  </div>
                </div>
              </div>

              {/* Coluna Direita: Informações Complementares */}
              <div className="space-y-6">
                {/* Engajamento e Treinamentos */}
                <div>
                  <h3
                    className={`
                    text-lg font-semibold mb-4 flex items-center
                    ${isDark ? "text-gray-200" : "text-gray-900"}
                  `}
                  >
                    <AcademicCapIcon className="w-5 h-5 mr-2" />
                    Engajamento e Treinamentos
                  </h3>
                  <div
                    className={`
                    rounded-xl border p-6 space-y-4
                    ${isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}
                  `}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div
                          className={`
                          text-sm ${isDark ? "text-gray-400" : "text-gray-600"}
                        `}
                        >
                          Treinamentos concluídos
                        </div>
                        <div
                          className={`
                          text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}
                        `}
                        >
                          {corretorData.treinamentos.concluidos}
                        </div>
                      </div>
                      <div
                        className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800"}
                      `}
                      >
                        {corretorData.treinamentos.pendentes} pendentes
                      </div>
                    </div>

                    <div>
                      <div
                        className={`
                        text-sm ${isDark ? "text-gray-400" : "text-gray-600"}
                      `}
                      >
                        Nível de engajamento
                      </div>
                      <div className="flex items-center mt-1">
                        <div
                          className={`
                          px-3 py-1 rounded-full text-sm font-medium
                          ${isDark ? "bg-green-900/30 text-green-300" : "bg-green-100 text-green-800"}
                        `}
                        >
                          {corretorData.treinamentos.engajamento}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`
                      text-sm ${isDark ? "text-gray-400" : "text-gray-600"}
                    `}
                    >
                      Último treinamento:{" "}
                      {corretorData.treinamentos.ultimoTreinamento}
                    </div>
                  </div>
                </div>

                {/* Incentivos e Benefícios */}
                <div>
                  <h3
                    className={`
                    text-lg font-semibold mb-4 flex items-center
                    ${isDark ? "text-gray-200" : "text-gray-900"}
                  `}
                  >
                    <TrophyIcon className="w-5 h-5 mr-2" />
                    Incentivos e Benefícios
                  </h3>
                  <div className="space-y-3">
                    {corretorData.incentivos.map((incentivo, index) => (
                      <EligibilityBadge
                        key={index}
                        type={incentivo.type}
                        status={incentivo.status}
                        isDark={isDark}
                      />
                    ))}
                  </div>
                </div>

                {/* Feedbacks */}
                <div>
                  <h3
                    className={`
                    text-lg font-semibold mb-4 flex items-center
                    ${isDark ? "text-gray-200" : "text-gray-900"}
                  `}
                  >
                    <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                    Feedbacks Recentes
                  </h3>
                  <div className="space-y-3">
                    {corretorData.feedbacks.map((feedback, index) => (
                      <div
                        key={index}
                        className={`
                          p-4 rounded-lg border
                          ${isDark ? "bg-gray-800/30 border-gray-700" : "bg-gray-50 border-gray-200"}
                        `}
                      >
                        <div
                          className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                        >
                          {feedback.texto}
                        </div>
                        <div
                          className={`
                          flex justify-between mt-2 text-xs
                          ${isDark ? "text-gray-500" : "text-gray-600"}
                        `}
                        >
                          <span>{feedback.autor}</span>
                          <span>{feedback.data}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Observações Internas */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`
                      text-lg font-semibold flex items-center
                      ${isDark ? "text-gray-200" : "text-gray-900"}
                    `}
                    >
                      <PencilIcon className="w-5 h-5 mr-2" />
                      Observações Internas
                    </h3>
                    <button
                      onClick={handleSalvarObservacoes}
                      className={`
                        text-sm px-3 py-1 rounded-lg transition-all duration-200
                        ${
                          isDark
                            ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30"
                            : "bg-[#D4A24D] text-white hover:bg-[#C19137]"
                        }
                      `}
                    >
                      Salvar
                    </button>
                  </div>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows="4"
                    className={`
                      w-full px-4 py-3 rounded-lg border text-sm resize-none
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      }
                      focus:outline-none focus:ring-2 transition-colors duration-200
                    `}
                    placeholder="Adicione observações sobre o corretor..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`
            px-8 py-4 border-t
            ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}
          `}
          >
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isDark
                      ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                  }
                `}
              >
                Fechar
              </button>
              <button
                onClick={() => console.log("Abrir perfil completo")}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isDark
                      ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 border border-blue-800/50"
                      : "bg-blue-100 text-blue-600 hover:bg-blue-200 border border-blue-300"
                  }
                `}
              >
                Ver Relatório Completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL
const Corretores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("candidatos");
  const [etapaCandidato, setEtapaCandidato] = useState("pendentes");
  const [modalAgendamentoAberto, setModalAgendamentoAberto] = useState(false);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [candidatoParaAgendar, setCandidatoParaAgendar] = useState(null);
  const [corretorSelecionado, setCorretorSelecionado] = useState(null);
  const [formAgendamento, setFormAgendamento] = useState({
    dataEntrevista: "",
    horarioEntrevista: "",
    entrevistador: "",
    observacoes: "",
  });
  const [errosForm, setErrosForm] = useState({});
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // Dados de corretores ativos/férias
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
  ];

  // Dados de corretores inativos
  const corretoresInativos = [
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
    {
      id: 6,
      nome: "Roberto Alves",
      email: "roberto@imob.com",
      telefone: "(11) 94444-4444",
      status: "Inativo",
      imoveis: 3,
      rating: 4.0,
      creci: "567890-MA",
    },
  ];

  // Dados de candidatos por etapa
  const [candidatosPorEtapa, setCandidatosPorEtapa] = useState({
    pendentes: [
      {
        id: 101,
        nome: "Fulano Silva",
        email: "fulano.silva@email.com",
        telefone: "(11) 97777-7777",
        etapa: "pendentes",
        dataCadastro: "Hoje",
        horarioCadastro: "12:22",
        creci: "123456-SP",
        origem: "Site",
      },
      {
        id: 102,
        nome: "Ciclano Santos",
        email: "ciclano@email.com",
        telefone: "(11) 98888-8888",
        etapa: "pendentes",
        dataCadastro: "Hoje",
        horarioCadastro: "10:15",
        creci: "654321-SP",
        origem: "Instagram",
      },
    ],
    entrevista: [
      {
        id: 103,
        nome: "Ricardo Santos",
        email: "ricardo@email.com",
        telefone: "(11) 96666-6666",
        etapa: "entrevista",
        creci: "789012-SP",
        dataEntrevista: "Amanhã",
        horarioEntrevista: "14:00",
        entrevistador: "CEO",
      },
      {
        id: 104,
        nome: "Juliana Oliveira",
        email: "juliana@email.com",
        telefone: "(11) 95555-5555",
        etapa: "entrevista",
        creci: "345678-SP",
        dataEntrevista: "22/03",
        horarioEntrevista: "10:30",
        entrevistador: "Gerente",
      },
    ],
    treinamento: [
      {
        id: 105,
        nome: "Marcos Silva",
        email: "marcos@email.com",
        telefone: "(11) 94444-4444",
        etapa: "treinamento",
        creci: "901234-SP",
        progressoTreinamento: "60%",
      },
      {
        id: 106,
        nome: "Ana Costa",
        email: "ana.costa@email.com",
        telefone: "(11) 93333-3333",
        etapa: "treinamento",
        creci: "567890-SP",
        progressoTreinamento: "85%",
      },
    ],
    reprovados: [
      {
        id: 107,
        nome: "Pedro Almeida",
        email: "pedro.almeida@email.com",
        telefone: "(11) 92222-2222",
        etapa: "reprovados",
        creci: "234567-SP",
        motivoReprovacao: "Documentação incompleta",
        dataReprovacao: "08/02/2026",
      },
      {
        id: 108,
        nome: "Fernanda Lima",
        email: "fernanda@email.com",
        telefone: "(11) 91111-1111",
        etapa: "reprovados",
        creci: "890123-SP",
        motivoReprovacao: "Não compareceu à entrevista",
        dataReprovacao: "07/02/2026",
      },
      {
        id: 109,
        nome: "Rafael Souza",
        email: "rafael.souza@email.com",
        telefone: "(11) 90000-0000",
        etapa: "reprovados",
        creci: "456789-SP",
        motivoReprovacao: "Experiência insuficiente",
        dataReprovacao: "06/02/2026",
      },
    ],
  });

  // Cores dos status para corretores
  const statusCorretoresColors = {
    Ativo: isDark
      ? "bg-green-900/30 text-green-300 border border-green-800"
      : "bg-green-100 text-green-800",
    Inativo: isDark
      ? "bg-red-900/30 text-red-300 border border-red-800"
      : "bg-red-100 text-red-800",
    Férias: isDark
      ? "bg-amber-900/30 text-amber-300 border border-amber-800"
      : "bg-amber-100 text-amber-800",
  };

  // Cores das etapas para candidatos
  const etapaCandidatosColors = {
    pendentes: isDark
      ? "bg-red-900/30 text-red-300 border border-red-800"
      : "bg-red-100 text-red-800",
    entrevista: isDark
      ? "bg-yellow-900/30 text-yellow-300 border border-yellow-800"
      : "bg-yellow-100 text-yellow-800",
    treinamento: isDark
      ? "bg-blue-900/30 text-blue-300 border border-blue-800"
      : "bg-blue-100 text-blue-800",
    reprovados: isDark
      ? "bg-gray-800/50 text-gray-300 border border-gray-700"
      : "bg-gray-100 text-gray-800",
  };

  // Função para formatar número para WhatsApp
  const formatarNumeroWhatsApp = (telefone) => {
    const numeroLimpo = telefone.replace(/\D/g, "");
    return numeroLimpo.startsWith("55") ? numeroLimpo : `55${numeroLimpo}`;
  };

  // Função para criar link do WhatsApp
  const criarLinkWhatsApp = (telefone, nome) => {
    const numero = formatarNumeroWhatsApp(telefone);
    const mensagem = `Olá ${nome}, tudo bem?`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  };

  const handleDelete = (id, tipo) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir este ${tipo === "candidato" ? "candidato" : "corretor"}?`,
      )
    ) {
      console.log(`Excluir ${tipo}:`, id);
    }
  };

  // Função para abrir modal de agendamento
  const handleAbrirModalAgendamento = (candidato) => {
    setCandidatoParaAgendar(candidato);
    setFormAgendamento({
      dataEntrevista: "",
      horarioEntrevista: "",
      entrevistador: "",
      observacoes: "",
    });
    setErrosForm({});
    setModalAgendamentoAberto(true);
  };

  // Função para abrir modal de perfil
  const handleAbrirPerfil = (corretor) => {
    setCorretorSelecionado(corretor);
    setModalPerfilAberto(true);
  };

  // Função para fechar modais
  const handleFecharModal = () => {
    setModalAgendamentoAberto(false);
    setModalPerfilAberto(false);
    setCandidatoParaAgendar(null);
    setCorretorSelecionado(null);
    setFormAgendamento({
      dataEntrevista: "",
      horarioEntrevista: "",
      entrevistador: "",
      observacoes: "",
    });
    setErrosForm({});
  };

  // Função para formatar data para exibição
  const formatarDataParaExibicao = (dataString) => {
    const hoje = new Date();
    const amanha = new Date();
    amanha.setDate(hoje.getDate() + 1);

    const data = new Date(dataString);

    // Formatar para DD/MM
    const dia = data.getDate().toString().padStart(2, "0");
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");

    // Verificar se é hoje, amanhã ou data específica
    if (data.toDateString() === hoje.toDateString()) {
      return "Hoje";
    } else if (data.toDateString() === amanha.toDateString()) {
      return "Amanhã";
    } else {
      return `${dia}/${mes}`;
    }
  };

  // Função para validar formulário
  const validarFormulario = () => {
    const novosErros = {};

    if (!formAgendamento.dataEntrevista) {
      novosErros.dataEntrevista = "Data da entrevista é obrigatória";
    } else {
      const dataSelecionada = new Date(formAgendamento.dataEntrevista);
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (dataSelecionada < hoje) {
        novosErros.dataEntrevista =
          "Não é possível agendar para datas passadas";
      }
    }

    if (!formAgendamento.horarioEntrevista) {
      novosErros.horarioEntrevista = "Horário da entrevista é obrigatório";
    }

    if (!formAgendamento.entrevistador.trim()) {
      novosErros.entrevistador = "Entrevistador é obrigatório";
    }

    setErrosForm(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Função para salvar agendamento
  const handleSalvarAgendamento = () => {
    if (!validarFormulario() || !candidatoParaAgendar) return;

    // Formatar data para exibição
    const dataFormatada = formatarDataParaExibicao(
      formAgendamento.dataEntrevista,
    );

    // Criar novo candidato com status de entrevista
    const candidatoAtualizado = {
      ...candidatoParaAgendar,
      etapa: "entrevista",
      dataEntrevista: dataFormatada,
      horarioEntrevista: formAgendamento.horarioEntrevista,
      entrevistador: formAgendamento.entrevistador,
    };

    // Atualizar estado dos candidatos
    setCandidatosPorEtapa((prev) => {
      // Remover da aba pendentes
      const novosPendentes = prev.pendentes.filter(
        (c) => c.id !== candidatoParaAgendar.id,
      );

      // Adicionar à aba entrevista
      const novasEntrevistas = [candidatoAtualizado, ...prev.entrevista];

      return {
        ...prev,
        pendentes: novosPendentes,
        entrevista: novasEntrevistas,
      };
    });

    // Fechar modal
    handleFecharModal();

    // Mostrar mensagem de sucesso
    alert(
      `Entrevista agendada para ${candidatoParaAgendar.nome} em ${dataFormatada}, ${formAgendamento.horarioEntrevista} com ${formAgendamento.entrevistador}`,
    );
  };

  const handleAprovarEntrevista = (candidato) => {
    if (
      window.confirm(
        `Deseja aprovar ${candidato.nome} para a próxima etapa (Treinamento)?`,
      )
    ) {
      console.log("Aprovar entrevista:", candidato);
      alert(`${candidato.nome} aprovado para treinamento!`);
    }
  };

  const handleReprovarEntrevista = (candidato) => {
    if (window.confirm(`Deseja reprovar ${candidato.nome}?`)) {
      console.log("Reprovar entrevista:", candidato);
      alert(`${candidato.nome} reprovado!`);
    }
  };

  const handleAtivarComoCorretor = (candidato) => {
    if (window.confirm(`Deseja ativar ${candidato.nome} como corretor?`)) {
      console.log("Ativar como corretor:", candidato);
      alert(`${candidato.nome} ativado como corretor!`);
    }
  };

  const handleVerDetalhesReprovado = (candidato) => {
    console.log("Ver detalhes do reprovado:", candidato);
    alert(`Detalhes de ${candidato.nome}: ${candidato.motivoReprovacao}`);
  };

  // Dados atuais baseado na aba ativa
  const dadosAtuais = useMemo(() => {
    if (abaAtiva === "candidatos") {
      return {
        tipo: "candidatos",
        dados: candidatosPorEtapa[etapaCandidato] || [],
        statusColors: etapaCandidatosColors,
      };
    } else if (abaAtiva === "ativos") {
      return {
        tipo: "corretores",
        dados: corretores,
        statusColors: statusCorretoresColors,
      };
    } else {
      return {
        tipo: "corretores",
        dados: corretoresInativos,
        statusColors: statusCorretoresColors,
      };
    }
  }, [abaAtiva, etapaCandidato, candidatosPorEtapa]);

  // Função para renderizar o título da aba atual
  const renderTituloAba = () => {
    if (abaAtiva === "candidatos") {
      switch (etapaCandidato) {
        case "pendentes":
          return (
            <div>
              <div className="flex items-center mb-1">
                <LockClosedIcon className="w-6 h-6 mr-2" />
                <h2
                  className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  Cadastros Pendentes
                </h2>
              </div>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} ml-8`}
              >
                Candidatos que se cadastraram e aguardam análise
              </p>
            </div>
          );
        case "entrevista":
          return (
            <div>
              <div className="flex items-center mb-1">
                <CalendarIcon className="w-6 h-6 mr-2" />
                <h2
                  className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  Em Entrevista
                </h2>
              </div>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} ml-8`}
              >
                Candidatos com entrevista agendada
              </p>
            </div>
          );
        case "treinamento":
          return (
            <div>
              <div className="flex items-center mb-1">
                <AcademicCapIcon className="w-6 h-6 mr-2" />
                <h2
                  className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  Em Treinamento
                </h2>
              </div>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} ml-8`}
              >
                Candidatos em fase de capacitação
              </p>
            </div>
          );
        case "reprovados":
          return (
            <div>
              <div className="flex items-center mb-1">
                <XCircleIcon className="w-6 h-6 mr-2" />
                <h2
                  className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  Histórico de Reprovados
                </h2>
              </div>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} ml-8`}
              >
                Candidatos que não prosseguiram no processo
              </p>
            </div>
          );
        default:
          return (
            <h2
              className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
            >
              Candidatos
            </h2>
          );
      }
    } else if (abaAtiva === "ativos") {
      return (
        <h2
          className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
        >
          Corretores Ativos e em Férias
        </h2>
      );
    } else {
      return (
        <h2
          className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
        >
          Corretores Inativos
        </h2>
      );
    }
  };

  // Calcular total de candidatos
  const getTotalCandidatos = () => {
    return Object.values(candidatosPorEtapa).reduce(
      (total, etapa) => total + etapa.length,
      0,
    );
  };

  const getContador = () => {
    switch (abaAtiva) {
      case "ativos":
        return corretores.length;
      case "inativos":
        return corretoresInativos.length;
      case "candidatos":
        return candidatosPorEtapa[etapaCandidato]?.length || 0;
      default:
        return 0;
    }
  };

  // Função para renderizar as etapas dos candidatos
  const renderEtapasCandidatos = () => {
    if (abaAtiva !== "candidatos") return null;

    const etapas = [
      { id: "pendentes", nome: "Pendentes", icone: ClockIcon, cor: "red" },
      {
        id: "entrevista",
        nome: "Entrevista",
        icone: ChatBubbleLeftRightIcon,
        cor: "yellow",
      },
      {
        id: "treinamento",
        nome: "Treinamento",
        icone: AcademicCapIcon,
        cor: "blue",
      },
      { id: "reprovados", nome: "Reprovados", icone: XCircleIcon, cor: "gray" },
    ];

    return (
      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {etapas.map((etapa) => {
            const EtapaIcon = etapa.icone;
            const isAtiva = etapaCandidato === etapa.id;
            const count = candidatosPorEtapa[etapa.id]?.length || 0;

            return (
              <button
                key={etapa.id}
                onClick={() => setEtapaCandidato(etapa.id)}
                className={`
                  flex items-center px-6 py-4 rounded-xl transition-all duration-200 font-medium
                  ${
                    isDark
                      ? isAtiva
                        ? `bg-${etapa.cor}-800/50 text-${etapa.cor}-200 border-2 border-${etapa.cor}-700`
                        : `bg-${etapa.cor}-900/30 text-${etapa.cor}-300 border border-${etapa.cor}-800 hover:bg-${etapa.cor}-800/40 hover:text-${etapa.cor}-200`
                      : isAtiva
                        ? `bg-${etapa.cor}-200 text-${etapa.cor}-900 border-2 border-${etapa.cor}-300`
                        : `bg-${etapa.cor}-100 text-${etapa.cor}-800 border border-${etapa.cor}-300 hover:bg-${etapa.cor}-200 hover:text-${etapa.cor}-900`
                  }
                  shadow-sm hover:shadow min-h-[68px] w-full
                `}
              >
                <EtapaIcon className="w-6 h-6 mr-3 flex-shrink-0" />
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-semibold">{etapa.nome}</span>
                  {count > 0 && (
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${isDark ? "bg-gray-700/70" : "bg-gray-200"}`}
                    >
                      {count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  // Função para renderizar card de candidato PENDENTE
  const renderCardPendente = (candidato) => (
    <div
      className={`
        rounded-xl shadow-sm border overflow-hidden transition-all duration-200
        ${
          isDark
            ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {candidato.nome}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${etapaCandidatosColors.pendentes}`}
              >
                Pendente
              </span>
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mb-3`}
            >
              CRECI: {candidato.creci}
            </div>
          </div>
        </div>

        {/* Divisória 1 */}
        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        ></div>

        {/* Telefone com WhatsApp */}
        <div className="mb-2">
          <a
            href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center transition-all duration-200 group
              ${
                isDark
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }
            `}
          >
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
            </svg>
            <span className="text-sm font-medium truncate">
              {candidato.telefone}
            </span>
          </a>
        </div>

        {/* Email */}
        <div
          className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}
        >
          <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{candidato.email}</span>
        </div>

        {/* Divisória 2 */}
        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        ></div>

        {/* Data de Cadastro */}
        <div
          className={`flex items-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-xs">
            Cadastrou: {candidato.dataCadastro}, {candidato.horarioCadastro}
          </span>
        </div>

        {/* Origem */}
        {candidato.origem && (
          <div
            className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Origem: {candidato.origem}
          </div>
        )}
      </div>

      {/* Ações */}
      <div
        className={`px-4 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}`}
      >
        <div className="flex space-x-2">
          <button
            onClick={() => handleAbrirModalAgendamento(candidato)}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isDark
                  ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                  : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
              }
            `}
          >
            Agendar Entrevista
          </button>
          <button
            onClick={() => handleDelete(candidato.id, "candidato")}
            className={`
              py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
              ${
                isDark
                  ? "bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-800"
                  : "bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
              }
            `}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );

  // Função para renderizar card de candidato ENTREVISTA
  const renderCardEntrevista = (candidato) => (
    <div
      className={`
        rounded-xl shadow-sm border overflow-hidden transition-all duration-200
        ${
          isDark
            ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {candidato.nome}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${etapaCandidatosColors.entrevista}`}
              >
                Entrevista
              </span>
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mb-3`}
            >
              CRECI: {candidato.creci}
            </div>
          </div>
        </div>

        {/* Divisória 1 */}
        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        ></div>

        {/* Telefone com WhatsApp */}
        <div className="mb-2">
          <a
            href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center transition-all duration-200 group
              ${
                isDark
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }
            `}
          >
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
            </svg>
            <span className="text-sm font-medium truncate">
              {candidato.telefone}
            </span>
          </a>
        </div>

        {/* Email */}
        <div
          className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}
        >
          <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{candidato.email}</span>
        </div>

        {/* Divisória 2 */}
        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        ></div>

        {/* Informações da Entrevista */}
        <div className="space-y-2">
          <div
            className={`flex items-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            <span>
              Entrevista: {candidato.dataEntrevista},{" "}
              {candidato.horarioEntrevista}
            </span>
          </div>
          {candidato.entrevistador && (
            <div
              className={`flex items-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              <UserIcon className="w-4 h-4 mr-2" />
              <span>Com: {candidato.entrevistador}</span>
            </div>
          )}
        </div>
      </div>

      {/* Ações - APROVAR e REPROVAR lado a lado */}
      <div
        className={`px-4 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}`}
      >
        <div className="flex space-x-2">
          {/* Botão APROVAR - LADO ESQUERDO */}
          <button
            onClick={() => handleAprovarEntrevista(candidato)}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
              flex items-center justify-center gap-2
              ${
                isDark
                  ? "bg-green-900/30 text-green-300 hover:bg-green-800/40 border border-green-800"
                  : "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
              }
            `}
          >
            <CheckCircleIcon className="w-4 h-4" />
            Aprovar
          </button>

          {/* Botão REPROVAR - LADO DIREITO */}
          <button
            onClick={() => handleReprovarEntrevista(candidato)}
            className={`
              flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
              flex items-center justify-center gap-2
              ${
                isDark
                  ? "bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-800"
                  : "bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
              }
            `}
          >
            <XCircleIcon className="w-4 h-4" />
            Reprovar
          </button>
        </div>
      </div>
    </div>
  );

  // Função para renderizar card de candidato TREINAMENTO
  const renderCardTreinamento = (candidato) => (
    <div
      className={`
        rounded-xl shadow-sm border overflow-hidden transition-all duration-200
        ${
          isDark
            ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {candidato.nome}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${etapaCandidatosColors.treinamento}`}
              >
                Treinamento
              </span>
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mb-3`}
            >
              CRECI: {candidato.creci}
            </div>
          </div>
        </div>

        {/* Divisória 1 */}
        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        ></div>

        {/* Telefone com WhatsApp */}
        <div className="mb-2">
          <a
            href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center transition-all duration-200 group
              ${
                isDark
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }
            `}
          >
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
            </svg>
            <span className="text-sm font-medium truncate">
              {candidato.telefone}
            </span>
          </a>
        </div>

        {/* Email */}
        <div
          className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}
        >
          <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{candidato.email}</span>
        </div>

        {/* Divisória 2 */}
        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        ></div>

        {/* Barra de Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span
              className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Progresso
            </span>
            <span
              className={`text-xs font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}
            >
              {candidato.progressoTreinamento}
            </span>
          </div>
          <div
            className={`w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full h-2.5`}
          >
            <div
              className={`${isDark ? "bg-green-500" : "bg-green-600"} h-2.5 rounded-full transition-all duration-300`}
              style={{ width: candidato.progressoTreinamento }}
            ></div>
          </div>
        </div>
      </div>

      {/* Ações - ATIVAR COMO CORRETOR */}
      <div
        className={`px-4 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}`}
      >
        <button
          onClick={() => handleAtivarComoCorretor(candidato)}
          className={`
            w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center justify-center gap-2
            ${
              isDark
                ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
            }
          `}
        >
          <CheckCircleIcon className="w-4 h-4" />
          Ativar como Corretor
        </button>
      </div>
    </div>
  );

  // Função para renderizar card de candidato REPROVADO
  const renderCardReprovado = (candidato) => (
    <div
      className={`
        rounded-xl shadow-sm border overflow-hidden transition-all duration-200
        ${
          isDark
            ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
            : "bg-white border-gray-200 hover:bg-gray-50"
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {candidato.nome}
              </h3>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${etapaCandidatosColors.reprovados}`}
              >
                Reprovado
              </span>
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mb-3`}
            >
              CRECI: {candidato.creci}
            </div>
          </div>
        </div>

        {/* Divisória 1 */}
        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        ></div>

        {/* Telefone com WhatsApp */}
        <div className="mb-2">
          <a
            href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center transition-all duration-200 group
              ${
                isDark
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }
            `}
          >
            <svg
              className="w-4 h-4 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411" />
            </svg>
            <span className="text-sm font-medium truncate">
              {candidato.telefone}
            </span>
          </a>
        </div>

        {/* Email */}
        <div
          className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}
        >
          <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{candidato.email}</span>
        </div>

        {/* Divisória 2 */}
        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        ></div>

        {/* Motivo da Reprovacao */}
        <div className="space-y-3">
          <div
            className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Motivo da reprovação:
          </div>

          {/* Box Vermelha com o motivo */}
          <div
            className={`
            px-3 py-2 rounded-lg border text-sm
            ${
              isDark
                ? "bg-red-900/30 text-red-200 border-red-800/50"
                : "bg-red-50 text-red-800 border-red-200"
            }
          `}
          >
            <div className="flex items-start">
              <DocumentTextIcon
                className={`w-4 h-4 mr-2 flex-shrink-0 ${isDark ? "text-red-300" : "text-red-600"}`}
              />
              <span>{candidato.motivoReprovacao}</span>
            </div>
          </div>

          {/* Data da Reprovacao */}
          <div
            className={`flex items-center text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            <CalendarIcon className="w-3.5 h-3.5 mr-2" />
            <span>Data: {candidato.dataReprovacao}</span>
          </div>
        </div>
      </div>

      {/* Ações - VER DETALHES */}
      <div
        className={`px-4 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}`}
      >
        <button
          onClick={() => handleVerDetalhesReprovado(candidato)}
          className={`
            w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
            flex items-center justify-center gap-2
            ${
              isDark
                ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
            }
          `}
        >
          <EyeIcon className="w-4 h-4" />
          Ver Detalhes
        </button>
      </div>
    </div>
  );

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
            Gerencie corretores e candidatos
          </p>
        </div>

        {/* BOTÕES DE ABAS PRINCIPAIS - NA ORDEM SOLICITADA: CANDIDATOS → ATIVOS → INATIVOS */}
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {/* PRIMEIRO: CANDIDATOS */}
          <button
            onClick={() => setAbaAtiva("candidatos")}
            className={`
              flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 font-medium
              ${
                isDark
                  ? abaAtiva === "candidatos"
                    ? "bg-amber-800/50 text-amber-200 border border-amber-700"
                    : "bg-amber-900/30 text-amber-300 border border-amber-800 hover:bg-amber-800/40 hover:text-amber-200"
                  : abaAtiva === "candidatos"
                    ? "bg-amber-200 text-amber-900 border border-amber-300"
                    : "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 hover:text-amber-900"
              }
              flex items-center justify-center shadow-sm hover:shadow
            `}
          >
            <UserGroupIcon className="w-5 h-5 mr-2" />
            Candidatos
          </button>

          {/* SEGUNDO: ATIVOS */}
          <button
            onClick={() => setAbaAtiva("ativos")}
            className={`
              flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 font-medium
              ${
                isDark
                  ? abaAtiva === "ativos"
                    ? "bg-green-800/50 text-green-200 border border-green-700"
                    : "bg-green-900/30 text-green-300 border border-green-800 hover:bg-green-800/40 hover:text-green-200"
                  : abaAtiva === "ativos"
                    ? "bg-green-200 text-green-900 border border-green-300"
                    : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 hover:text-green-900"
              }
              flex items-center justify-center shadow-sm hover:shadow
            `}
          >
            <EyeIcon className="w-5 h-5 mr-2" />
            Ativos
          </button>

          {/* TERCEIRO: INATIVOS */}
          <button
            onClick={() => setAbaAtiva("inativos")}
            className={`
              flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 font-medium
              ${
                isDark
                  ? abaAtiva === "inativos"
                    ? "bg-red-800/50 text-red-200 border border-red-700"
                    : "bg-red-900/30 text-red-300 border border-red-800 hover:bg-red-800/40 hover:text-red-200"
                  : abaAtiva === "inativos"
                    ? "bg-red-200 text-red-900 border border-red-300"
                    : "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 hover:text-red-900"
              }
              flex items-center justify-center shadow-sm hover:shadow
            `}
          >
            <EyeSlashIcon className="w-5 h-5 mr-2" />
            Inativos
          </button>

          <Button
            variant="outline"
            onClick={() => navigate("/admin/corretores/novo")}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Corretor
          </Button>
        </div>
      </div>

      {/* Seção Processo Seletivo (só aparece quando na aba candidatos) */}
      {abaAtiva === "candidatos" && (
        <div
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border p-6 mb-6 mx-6`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <div className="flex-1">
              <h2
                className={`text-xl font-semibold ${isDark ? "text-gray-200" : "text-gray-800"} mb-2`}
              >
                Processo Seletivo
              </h2>
              <p
                className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Gerenciar candidatos do cadastro à contratação
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`text-base font-semibold ${isDark ? "text-gray-300" : "text-gray-800"}`}
              >
                <span className="font-bold">Total: </span>
                <span className="font-normal">
                  {getTotalCandidatos()} candidatos
                </span>
              </div>
              <Button variant="outline">Exportar Lista</Button>
            </div>
          </div>

          {/* ETAPAS DOS CANDIDATOS */}
          {renderEtapasCandidatos()}
        </div>
      )}

      {/* Search and Filters (só aparece quando NÃO está na aba candidatos) */}
      {abaAtiva !== "candidatos" && (
        <div
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border p-6 mb-6 mx-6`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Buscar ${abaAtiva === "candidatos" ? "candidatos" : "corretores"}...`}
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
      )}

      {/* CONTEÚDO DINÂMICO */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-4">
          {renderTituloAba()}
        </div>

        {dadosAtuais.dados.length === 0 ? (
          <div
            className={`text-center py-12 ${isDark ? "bg-gray-800" : "bg-white"} rounded-xl border ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              {abaAtiva === "candidatos" ? (
                etapaCandidato === "pendentes" ? (
                  <ClockIcon className="w-16 h-16" />
                ) : etapaCandidato === "entrevista" ? (
                  <ChatBubbleLeftRightIcon className="w-16 h-16" />
                ) : etapaCandidato === "treinamento" ? (
                  <AcademicCapIcon className="w-16 h-16" />
                ) : etapaCandidato === "reprovados" ? (
                  <XCircleIcon className="w-16 h-16" />
                ) : (
                  <UserGroupIcon className="w-16 h-16" />
                )
              ) : abaAtiva === "inativos" ? (
                <EyeSlashIcon className="w-16 h-16" />
              ) : (
                <UserIcon className="w-16 h-16" />
              )}
            </div>
            <h3
              className={`text-lg font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-2`}
            >
              {abaAtiva === "candidatos"
                ? `Nenhum candidato na etapa ${etapaCandidato}`
                : abaAtiva === "inativos"
                  ? "Nenhum corretor inativo encontrado"
                  : "Nenhum corretor ativo encontrado"}
            </h3>
            <p className={`${isDark ? "text-gray-500" : "text-gray-600"}`}>
              {abaAtiva === "candidatos"
                ? `Não há candidatos na etapa "${etapaCandidato}" no momento.`
                : abaAtiva === "inativos"
                  ? "Todos os corretores estão ativos no momento."
                  : "Não há corretores ativos no momento."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {/* CARDS PENDENTES */}
            {abaAtiva === "candidatos" &&
              etapaCandidato === "pendentes" &&
              candidatosPorEtapa.pendentes.map((candidato) =>
                renderCardPendente(candidato),
              )}

            {/* CARDS ENTREVISTA */}
            {abaAtiva === "candidatos" &&
              etapaCandidato === "entrevista" &&
              candidatosPorEtapa.entrevista.map((candidato) =>
                renderCardEntrevista(candidato),
              )}

            {/* CARDS TREINAMENTO */}
            {abaAtiva === "candidatos" &&
              etapaCandidato === "treinamento" &&
              candidatosPorEtapa.treinamento.map((candidato) =>
                renderCardTreinamento(candidato),
              )}

            {/* CARDS REPROVADOS */}
            {abaAtiva === "candidatos" &&
              etapaCandidato === "reprovados" &&
              candidatosPorEtapa.reprovados.map((candidato) =>
                renderCardReprovado(candidato),
              )}

            {/* CARDS CORRETORES (ATIVOS/INATIVOS) */}
            {abaAtiva !== "candidatos" &&
              dadosAtuais.dados.map((corretor) => (
                <div
                  key={corretor.id}
                  className={`${isDark ? "bg-gray-800 border-gray-700 hover:bg-gray-750" : "bg-white border-gray-200 hover:bg-gray-50"} rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200`}
                >
                  {/* Header do Card Original */}
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
                          className={`px-3 py-1 rounded-full text-xs font-medium mt-2 inline-block ${statusCorretoresColors[corretor.status]}`}
                        >
                          {corretor.status}
                        </span>
                      </div>
                      <div
                        className={`flex items-center ${isDark ? "bg-[#D4A24D]/20 text-amber-200" : "bg-[#D4A24D]/10 text-[#D4A24D]"} px-3 py-1 rounded-lg`}
                      >
                        <StarIcon className="w-4 h-4 mr-1" />
                        <span className="font-semibold">{corretor.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Info Original */}
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

                    {/* Stats Original */}
                    <div
                      className={`mt-6 pt-6 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <div className="flex items-center justify-between">
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
                        <div
                          className={`h-12 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                        ></div>
                        <div className="text-center">
                          <div
                            className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                          >
                            {abaAtiva === "inativos" ? "-" : "R$ 2.5M"}
                          </div>
                          <div
                            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                          >
                            Vendas (mês)
                          </div>
                        </div>
                        <div
                          className={`h-12 w-px ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
                        ></div>
                        <div className="text-center">
                          <div
                            className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                          >
                            {abaAtiva === "inativos" ? "-" : "15"}
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

                  {/* Actions Original */}
                  <div
                    className={`px-6 py-4 ${isDark ? "bg-gray-800/70 border-gray-700" : "bg-gray-50/80 border-gray-200"} border-t flex justify-end space-x-3`}
                  >
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
                    <button
                      onClick={() => handleDelete(corretor.id, "corretor")}
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
                    <button
                      onClick={() => handleAbrirPerfil(corretor)}
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
        )}
      </div>

      {/* Performance Summary - APENAS PARA ATIVOS */}
      {abaAtiva === "ativos" && (
        <div
          className={`mt-8 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border p-6 mx-6 mb-6`}
        >
          <h2
            className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}
          >
            Desempenho da Equipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              className={`text-center p-4 ${isDark ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50"} rounded-lg`}
            >
              <div
                className={`text-3xl font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
              >
                {corretores.length}
              </div>
              <div
                className={`text-sm ${isDark ? "text-blue-300" : "text-blue-800"} mt-1`}
              >
                Corretores Ativos
              </div>
            </div>
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
      )}

      {/* Modal de Agendamento */}
      {modalAgendamentoAberto && (
        <ModalAgendamentoEntrevista
          isOpen={modalAgendamentoAberto}
          onClose={handleFecharModal}
          candidato={candidatoParaAgendar}
          formAgendamento={formAgendamento}
          setFormAgendamento={setFormAgendamento}
          errosForm={errosForm}
          handleSalvarAgendamento={handleSalvarAgendamento}
          isDark={isDark}
        />
      )}

      {/* Modal de Perfil do Corretor */}
      {modalPerfilAberto && (
        <ModalPerfilCorretor
          isOpen={modalPerfilAberto}
          onClose={handleFecharModal}
          corretor={corretorSelecionado}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default Corretores;
