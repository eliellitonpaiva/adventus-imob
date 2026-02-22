import React, { useState, useMemo, useEffect, useRef } from "react";
// Ícones outline (vazados) do Heroicons
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
  ChevronRightIcon,
  ArchiveBoxIcon,
  BriefcaseIcon,
  RocketLaunchIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

// 🟢 Ícones solid (preenchidos) do Heroicons - ADICIONE ISSO!
import {
  StarIcon as StarIconSolid,
  CheckCircleIcon as CheckCircleIconSolid,
} from "@heroicons/react/24/solid";
import Button from "../../componentes/ui/Button";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import { configuracoesService } from "../../lib/configuracoesService"; // ← NOVO IMPORT
// ===========================================
// COMPONENTES MODAIS
// ===========================================

// -------------------------------------------
// MODAL DE AGENDAMENTO
// -------------------------------------------
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

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  const dataMinima = `${ano}-${mes}-${dia}`;

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }
  }, [isOpen, timeoutId]);

  const handleHorarioChange = (e) => {
    const novoHorario = e.target.value;
    setFormAgendamento((prev) => ({
      ...prev,
      horarioEntrevista: novoHorario,
    }));
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
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
          <div
            className={`
              px-6 py-4 border-b
              ${isDark ? "border-gray-700" : "border-gray-200"}
            `}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                Agendar Entrevista
              </h3>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4">
            <div className="mb-4">
              <div
                className={`p-3 rounded-lg border ${isDark ? "bg-gray-700/50 border-gray-600" : "bg-gray-50 border border-gray-200"}`}
              >
                <div className="space-y-1">
                  <div
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {candidato.nome}
                  </div>
                  <div
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    CRECI: {candidato.creci}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
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
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                  } ${
                    errosForm.dataEntrevista
                      ? isDark
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                      : ""
                  } focus:outline-none focus:ring-2 transition-colors duration-200`}
                  style={{ colorScheme: isDark ? "dark" : "light" }}
                />
                {errosForm.dataEntrevista && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {errosForm.dataEntrevista}
                  </p>
                )}
              </div>

              <div>
                <input
                  ref={horarioInputRef}
                  type="time"
                  value={formAgendamento.horarioEntrevista}
                  onChange={handleHorarioChange}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                  } ${
                    errosForm.horarioEntrevista
                      ? isDark
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                      : ""
                  } focus:outline-none focus:ring-2 transition-colors duration-200`}
                  style={{ colorScheme: isDark ? "dark" : "light" }}
                />
                {errosForm.horarioEntrevista && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {errosForm.horarioEntrevista}
                  </p>
                )}
              </div>

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
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                  } ${
                    errosForm.entrevistador
                      ? isDark
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                        : "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                      : ""
                  } focus:outline-none focus:ring-2 transition-colors duration-200`}
                />
                {errosForm.entrevistador && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {errosForm.entrevistador}
                  </p>
                )}
              </div>

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
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                  } focus:outline-none focus:ring-2 transition-colors duration-200`}
                />
              </div>
            </div>
          </div>

          <div
            className={`px-6 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}`}
          >
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvarAgendamento}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                    : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
                }`}
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

// -------------------------------------------
// MODAL DE PROGRESSO
// -------------------------------------------
const ModalProgressoTreinamento = ({
  isOpen,
  onClose,
  candidato,
  onToggleCheckpoint,
  onToggleAtributo,
  isDark,
}) => {
  if (!isOpen || !candidato) return null;

  // CORREÇÃO: Usar os valores do banco, nunca valores padrão diferentes
  const [checkpointsLocais, setCheckpointsLocais] = useState(
    candidato.checkpoints_treinamento || {
      modulo1: false,
      modulo2: false,
      modulo3: false,
      modulo4: false,
      modulo5: false,
    },
  );

  const [atributosLocais, setAtributosLocais] = useState(
    candidato.atributos_treinamento || {
      demonstrouInteresse: false,
      temProposito: false,
      conheceMercado: false,
      disponibilidadeHorario: false,
      veiculoProprio: false,
      experienciaVendas: false,
      comunicacao: false,
      eticaProfissional: false,
      trabalhoEquipe: false,
      metasAmbiciosas: false,
    },
  );

  const progressoLocal = useMemo(() => {
    const total = Object.keys(checkpointsLocais).length;
    const concluidos = Object.values(checkpointsLocais).filter(Boolean).length;
    return Math.round((concluidos / total) * 100);
  }, [checkpointsLocais]);

  const modulosConcluidos =
    Object.values(checkpointsLocais).filter(Boolean).length;
  const atributosConcluidos =
    Object.values(atributosLocais).filter(Boolean).length;

  const handleToggleCheckpointLocal = (modulo) => {
    const novoValor = !checkpointsLocais[modulo];

    setCheckpointsLocais((prev) => ({
      ...prev,
      [modulo]: novoValor,
    }));

    onToggleCheckpoint(candidato.id, modulo);
  };

  const handleToggleAtributoLocal = (atributo) => {
    const novoValor = !atributosLocais[atributo];

    setAtributosLocais((prev) => ({
      ...prev,
      [atributo]: novoValor,
    }));

    onToggleAtributo(candidato.id, atributo);
  };

  const modulosTreinamento = [
    {
      id: "modulo1",
      nome: "Módulo 1: Visão e Propósito",
      descricao: "Entendimento da filosofia da imobiliária",
    },
    {
      id: "modulo2",
      nome: "Módulo 2: Metas e Metodologia",
      descricao: "Como definir e alcançar metas",
    },
    {
      id: "modulo3",
      nome: "Módulo 3: Práticas de Sucesso",
      descricao: "Técnicas dos melhores corretores",
    },
    {
      id: "modulo4",
      nome: "Módulo 4: Atendimento ao Cliente",
      descricao: "Excelência no relacionamento",
    },
    {
      id: "modulo5",
      nome: "Módulo 5: Fechamento de Vendas",
      descricao: "Técnicas de negociação e fechamento",
    },
  ];

  const atributosAvaliacao = [
    {
      id: "demonstrouInteresse",
      nome: "Demonstrou Interesse",
      icone: IoHeartOutline,
      cor: isDark ? "text-rose-400" : "text-rose-500",
    },
    {
      id: "temProposito",
      nome: "Tem Propósito",
      icone: IoNuclearOutline,
      cor: isDark ? "text-purple-400" : "text-purple-500",
    },
    {
      id: "conheceMercado",
      nome: "Conhece o Mercado",
      icone: IoBarChartOutline,
      cor: isDark ? "text-blue-400" : "text-blue-500",
    },
    {
      id: "disponibilidadeHorario",
      nome: "Disponibilidade de Horário",
      icone: IoTimeOutline,
      cor: isDark ? "text-amber-400" : "text-amber-500",
    },
    {
      id: "veiculoProprio",
      nome: "Veículo Próprio",
      icone: IoCarOutline,
      cor: isDark ? "text-cyan-400" : "text-cyan-500",
    },
    {
      id: "experienciaVendas",
      nome: "Experiência em Vendas",
      icone: IoBriefcaseOutline,
      cor: isDark ? "text-indigo-400" : "text-indigo-500",
    },
    {
      id: "comunicacao",
      nome: "Comunicação",
      icone: IoChatbubbleOutline,
      cor: isDark ? "text-emerald-400" : "text-emerald-500",
    },
    {
      id: "eticaProfissional",
      nome: "Ética Profissional",
      icone: IoScaleOutline,
      cor: isDark ? "text-stone-400" : "text-stone-500",
    },
    {
      id: "trabalhoEquipe",
      nome: "Trabalho em Equipe",
      icone: IoPeopleOutline,
      cor: isDark ? "text-violet-400" : "text-violet-500",
    },
    {
      id: "metasAmbiciosas",
      nome: "Metas Ambiciosas",
      icone: IoRocketOutline,
      cor: isDark ? "text-orange-400" : "text-orange-500",
    },
  ];

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full max-w-2xl rounded-xl shadow-2xl transform transition-all z-[10000]
            ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}
                >
                  Progresso do Treinamento
                </h3>
                <p
                  className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  {candidato.nome} • CRECI: {candidato.creci}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Progresso Geral
                </span>
                <span
                  className={`text-sm font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
                >
                  {progressoLocal}%
                </span>
              </div>
              <div
                className={`w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} rounded-full h-3`}
              >
                <div
                  className={`${isDark ? "bg-green-500" : "bg-green-600"} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${progressoLocal}%` }}
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h4
                  className={`text-sm font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  <AcademicCapIcon className="w-4 h-4 mr-2" />
                  Módulos- Treinamento Corretor Adventus do dia"{" "}
                </h4>
                <span
                  className={`text-xs font-bold ${isDark ? "text-blue-400" : "text-blue-600"}`}
                >
                  {modulosConcluidos}/5 concluídos
                </span>
              </div>
              <div className="space-y-2">
                {modulosTreinamento.map((modulo) => (
                  <div
                    key={modulo.id}
                    className={`flex items-center p-3 rounded-lg border ${
                      isDark
                        ? "bg-gray-700/50 border-gray-600"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkpointsLocais[modulo.id] || false}
                      onChange={() => handleToggleCheckpointLocal(modulo.id)}
                      className="w-4 h-4 accent-[#D4A24D] cursor-pointer"
                    />
                    <div className="ml-3 flex-1">
                      <div
                        className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-800"}`}
                      >
                        {modulo.nome}
                      </div>
                      <div
                        className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                      >
                        {modulo.descricao}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h4
                  className={`text-sm font-semibold flex items-center ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  <UserGroupIcon className="w-4 h-4 mr-2" />
                  Atributos Pessoais
                </h4>
                <span
                  className={`text-xs font-bold ${isDark ? "text-green-400" : "text-green-600"}`}
                >
                  {atributosConcluidos}/10 positivos
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {atributosAvaliacao.map((atributo) => {
                  const IconComponent = atributo.icone;
                  return (
                    <div
                      key={atributo.id}
                      className={`flex items-center p-2 rounded-lg border ${
                        isDark
                          ? "bg-gray-700/50 border-gray-600"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={atributosLocais[atributo.id] || false}
                        onChange={() => handleToggleAtributoLocal(atributo.id)}
                        className="w-4 h-4 accent-[#D4A24D] cursor-pointer"
                      />
                      <IconComponent
                        className={`w-4 h-4 ml-2 ${atributo.cor}`}
                      />
                      <span
                        className={`ml-1 text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {atributo.nome}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className={`px-6 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}`}
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                    : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------
// MODAL DE PERFIL ÚNICO - COM OU SEM EXPERIÊNCIA
// -------------------------------------------
const ModalPerfilCorretor = ({
  isOpen,
  onClose,
  corretor,
  isDark,
  onAtivar,
}) => {
  if (!isOpen || !corretor) return null;

  // ===========================================
  // 1. FUNÇÕES AUXILIARES
  // ===========================================

  const calcularTempoConosco = (dataContratacao) => {
    if (!dataContratacao) return "2 meses e 5 dias";
    return "2 meses e 5 dias";
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Não informada";

    if (typeof dataString === "string") {
      const parteData = dataString.split("T")[0];
      if (parteData.includes("-")) {
        const [ano, mes, dia] = parteData.split("-");
        return `${dia}/${mes}/${ano}`;
      }
    }

    try {
      return new Date(dataString).toLocaleDateString("pt-BR");
    } catch {
      return "Não informada";
    }
  };

  // ===========================================
  // 2. CONSTANTES DE CÁLCULO
  // ===========================================

  const emExperiencia = corretor.periodoExperiencia || false;
  const estaAtivo = !emExperiencia;

  const dataInicio = corretor.treinamento_conclusao
    ? new Date(corretor.treinamento_conclusao)
    : null;
  const dataFim = corretor.data_experiencia_fim
    ? new Date(corretor.data_experiencia_fim)
    : null;
  const dataAtivacao = corretor.data_ativacao
    ? new Date(corretor.data_ativacao)
    : null;

  const hoje = new Date();

  const diasPassados = dataInicio
    ? Math.ceil((hoje - dataInicio) / (1000 * 60 * 60 * 24))
    : 0;

  const diasTotais = 90;

  const diasRestantes = Math.max(0, diasTotais - diasPassados);

  const progresso =
    diasTotais > 0
      ? Math.min(100, Math.round((diasPassados / diasTotais) * 100))
      : 0;

  const experienciaConcluida = diasPassados >= diasTotais;
  const ativacaoAntecipada = dataAtivacao && diasPassados < diasTotais;

  const imoveis = corretor.imoveis || 0;
  const vendas = corretor.vendas_mes || 0;
  const leads = corretor.leads || 0;

  const mediaImoveis =
    diasPassados > 0 ? (imoveis / diasPassados).toFixed(2) : 0;
  const mediaVendas = diasPassados > 0 ? (vendas / diasPassados).toFixed(2) : 0;
  const mediaLeads = diasPassados > 0 ? (leads / diasPassados).toFixed(2) : 0;

  const projecaoImoveis = Math.round(mediaImoveis * diasTotais);
  const projecaoVendas = Math.round(mediaVendas * diasTotais);
  const projecaoLeads = Math.round(mediaLeads * diasTotais);

  // ===========================================
  // 3. OBJETO DE DADOS
  // ===========================================

  const corretorData = {
    ...corretor,
    creciDesde: corretor.creci_desde
      ? formatarData(corretor.creci_desde)
      : "15/06/2018",
    naImobiliariaDesde: corretor.treinamento_conclusao
      ? formatarData(corretor.treinamento_conclusao)
      : "10/03/2024",
    tempoConosco: calcularTempoConosco(corretor.treinamento_conclusao),
    kpis: {
      imoveisResponsabilidade: corretor.imoveis || 12,
      imoveisVendidosMes: corretor.vendas_mes || 3,
      leadsRecebidos: corretor.leads || 24,
      taxaConversao: corretor.taxa_conversao || "8.3%",
      valorTotalVendas: corretor.valor_vendas || "R$ 2.5M",
      mediaMensal: corretor.media_mensal || "R$ 850K",
    },
    ranking: {
      posicao: corretor.ranking_posicao || 1,
      total: corretor.ranking_total || 12,
      pontuacao: corretor.pontuacao || 980,
      meta: corretor.meta || 1000,
      percentual: Math.round(
        ((corretor.pontuacao || 980) / (corretor.meta || 1000)) * 100,
      ),
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
    vendasRecentes: corretor.vendas_recentes || [
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
    ],
    feedbacks: corretor.feedbacks || [
      {
        texto: "Excelente atendimento ao cliente Silva",
        autor: "Gerente",
        data: "12/02/2026",
      },
    ],
  };

  // ===========================================
  // 4. STATES E HANDLERS
  // ===========================================

  const [observacoes, setObservacoes] = useState(corretor.observacoes || "");
  const [ativando, setAtivando] = useState(false);

  // 🔥 useEffect para monitorar mudanças no corretor
  useEffect(() => {
    console.log("🔄 Modal recebeu novo corretor:", corretor);
    console.log("   • periodoExperiencia:", corretor.periodoExperiencia);
    console.log("   • data_ativacao:", corretor.data_ativacao);
    console.log("   • estaAtivo:", !corretor.periodoExperiencia);
  }, [corretor]);

  const handleSalvarObservacoes = async () => {
    try {
      await supabase
        .from("corretores")
        .update({ observacoes })
        .eq("id", corretor.id);
      alert("Observações salvas com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar observações:", err);
    }
  };

  // ===========================================
  // 5. HANDLER DE ATIVAÇÃO
  // ===========================================
  const handleAtivarCorretor = async () => {
    if (ativando) return;

    setAtivando(true);
    console.log("🚀 handleAtivarCorretor chamado no MODAL");
    console.log("📦 Corretor atual:", corretor);
    console.log("🆔 ID do corretor:", corretor.id);

    try {
      await onAtivar(corretor.id);
      console.log("✅ onAtivar executado com sucesso");
    } catch (error) {
      console.error("❌ Erro no onAtivar:", error);
    } finally {
      setAtivando(false);
    }
  };

  // ===========================================
  // 6. RENDERIZAÇÃO
  // ===========================================

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl transform transition-all z-[10000]
            ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER - Título dinâmico */}
          <div
            className={`sticky top-0 px-8 py-6 border-b flex items-center justify-between ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-4">
              <div>
                <h2
                  className={`text-2xl font-bold flex items-center gap-2 ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  <UserIcon className="w-6 h-6" />
                  {corretor.nome}
                  {emExperiencia && !experienciaConcluida && !estaAtivo && (
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-amber-900/30 text-amber-300 border border-amber-800"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      em experiência
                    </span>
                  )}
                  {experienciaConcluida && !estaAtivo && (
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-green-900/30 text-green-300 border border-green-800"
                          : "bg-green-100 text-green-800 border border-green-300"
                      }`}
                    >
                      experiência concluída
                    </span>
                  )}
                  {estaAtivo && (
                    <span
                      className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-green-900/30 text-green-300 border border-green-800"
                          : "bg-green-100 text-green-800 border border-green-300"
                      }`}
                    >
                      ativo
                    </span>
                  )}
                </h2>
                <div className="flex items-center mt-2 space-x-3 flex-wrap gap-y-2">
                  <div
                    className={`flex items-center text-sm ${
                      isDark ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    <StarIconSolid className="w-4 h-4 mr-1" />
                    <span>{corretor.rating || 4.8}</span>
                  </div>
                  <div
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    CRECI: {corretor.creci}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <a
                href={`https://wa.me/55${corretor.telefone?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-green-400 hover:text-green-300 hover:bg-gray-700"
                    : "text-green-600 hover:text-green-700 hover:bg-gray-100"
                }`}
              >
                <PhoneIcon className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${corretor.email}`}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-blue-400 hover:text-blue-300 hover:bg-gray-700"
                    : "text-blue-600 hover:text-blue-700 hover:bg-gray-100"
                }`}
              >
                <EnvelopeIcon className="w-5 h-5" />
              </a>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* BADGE DE EXPERIÊNCIA (só aparece se ainda estiver em experiência) */}
          {emExperiencia && !estaAtivo && (
            <div
              className={`px-8 py-4 ${
                isDark
                  ? experienciaConcluida
                    ? "bg-green-900/10 border-b border-green-800"
                    : "bg-amber-900/10 border-b border-amber-800"
                  : experienciaConcluida
                    ? "bg-green-50 border-b border-green-200"
                    : "bg-amber-50 border-b border-amber-200"
              }`}
            >
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  {experienciaConcluida ? (
                    <CheckCircleIcon
                      className={`w-4 h-4 ${
                        isDark ? "text-green-400" : "text-green-600"
                      }`}
                    />
                  ) : (
                    <ClockIcon
                      className={`w-4 h-4 ${
                        isDark ? "text-amber-400" : "text-amber-600"
                      }`}
                    />
                  )}
                  <span
                    className={`${
                      isDark
                        ? experienciaConcluida
                          ? "text-green-300"
                          : "text-amber-300"
                        : experienciaConcluida
                          ? "text-green-700"
                          : "text-amber-700"
                    }`}
                  >
                    {diasPassados} de {diasTotais} dias • {progresso}%
                  </span>
                </div>
                <span
                  className={`${
                    isDark
                      ? experienciaConcluida
                        ? "text-green-400"
                        : "text-amber-400"
                      : experienciaConcluida
                        ? "text-green-600"
                        : "text-amber-600"
                  }`}
                >
                  {diasRestantes} dias restantes
                </span>
              </div>
              <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    experienciaConcluida ? "bg-green-500" : "bg-amber-500"
                  }`}
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>
          )}

          {/* CORPO DO MODAL - 2 COLUNAS */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* COLUNA ESQUERDA - 2/3 */}
              <div className="lg:col-span-2 space-y-6">
                {/* SEÇÃO DE EXPERIÊNCIA - SEMPRE VISÍVEL (HISTÓRICO) */}
                {dataInicio && (
                  <div
                    className={`p-6 rounded-xl border-2 ${
                      isDark
                        ? estaAtivo
                          ? "bg-green-900/10 border-green-700"
                          : experienciaConcluida
                            ? "bg-green-900/20 border-green-700"
                            : "bg-amber-900/20 border-amber-600"
                        : estaAtivo
                          ? "bg-green-50 border-green-300"
                          : experienciaConcluida
                            ? "bg-green-50 border-green-300"
                            : "bg-amber-50 border-amber-300"
                    }`}
                  >
                    <h3
                      className={`text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      <RocketLaunchIcon className="w-4 h-4" />
                      {estaAtivo
                        ? "histórico da experiência"
                        : experienciaConcluida
                          ? "experiência concluída"
                          : "acompanhamento da experiência"}
                    </h3>

                    {/* DATAS */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-xs text-gray-500">início</span>
                        <p className="text-sm font-medium">
                          {formatarData(dataInicio)}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500">
                          término previsto
                        </span>
                        <p className="text-sm font-medium">
                          {formatarData(dataFim)}
                        </p>
                      </div>
                    </div>

                    {/* DATA DE ATIVAÇÃO (se já estiver ativo) */}
                    {estaAtivo && dataAtivacao && (
                      <div className="mb-4 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs text-green-700 dark:text-green-300">
                            {ativacaoAntecipada
                              ? `✅ Ativado antecipadamente em ${formatarData(dataAtivacao)} (${diasPassados}/${diasTotais} dias)`
                              : `✅ Ativado em ${formatarData(dataAtivacao)}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* DIVISÓRIA APÓS DATAS */}
                    <div
                      className={`h-px w-full my-4 ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />

                    {/* INDICADORES */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xl font-semibold">{imoveis}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          IMÓVEIS
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold">{vendas}</div>
                        <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                          VENDAS (MÊS)
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-semibold">{leads}</div>
                        <div className="text-xs text-gray-500 mt-1">LEADS</div>
                      </div>
                    </div>

                    {/* DIVISÓRIA APÓS INDICADORES */}
                    <div
                      className={`h-px w-full my-4 ${
                        isDark ? "bg-gray-700" : "bg-gray-300"
                      }`}
                    />

                    {/* MÉDIA DIÁRIA E PROJEÇÃO */}
                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
                          <ChartBarIcon className="w-3 h-3" />
                          MÉDIA DIÁRIA
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Imóveis</span>
                            <span className="font-medium">
                              {mediaImoveis}/dia
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Vendas</span>
                            <span className="font-medium">
                              {mediaVendas}/dia
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Leads</span>
                            <span className="font-medium">
                              {mediaLeads}/dia
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
                          <ArrowTrendingUpIcon className="w-3 h-3" />
                          PROJEÇÃO 90 DIAS
                        </h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Imóveis</span>
                            <span className="font-medium text-blue-500">
                              {projecaoImoveis}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Vendas</span>
                            <span className="font-medium text-green-500">
                              {projecaoVendas}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Leads</span>
                            <span className="font-medium text-purple-500">
                              {projecaoLeads}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* BOTÃO DE ATIVAÇÃO - SÓ APARECE SE AINDA ESTIVER EM EXPERIÊNCIA */}
                    {emExperiencia && !estaAtivo && (
                      <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
                        <button
                          onClick={handleAtivarCorretor}
                          disabled={ativando}
                          className={`w-full py-2 px-4 rounded-lg text-sm font-bold uppercase transition-all duration-200 ${
                            ativando
                              ? "opacity-50 cursor-not-allowed"
                              : isDark
                                ? "bg-amber-900/30 text-amber-300 hover:bg-amber-800/40"
                                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          }`}
                        >
                          {ativando ? "ATIVANDO..." : "ATIVAR CORRETOR AGORA"}
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-2">
                          Isso vai efetivá-lo com {diasPassados}/{diasTotais}{" "}
                          dias
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* RESUMO DE PERFORMANCE */}
                <div>
                  <h3
                    className={`text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <ChartBarIcon className="w-4 h-4" />
                    RESUMO DE PERFORMANCE
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-semibold text-blue-500">
                        {corretorData.kpis.imoveisResponsabilidade}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">IMÓVEIS</div>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-semibold text-green-500">
                        {corretorData.kpis.imoveisVendidosMes}
                      </div>
                      <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">
                        VENDAS (MÊS)
                      </div>
                    </div>
                    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="text-2xl font-semibold text-purple-500">
                        {corretorData.kpis.leadsRecebidos}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">LEADS</div>
                    </div>
                  </div>
                </div>

                {/* METAS E PROGRESSO */}
                <div>
                  <h3
                    className={`text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <TrophyIcon className="w-4 h-4" />
                    METAS E PROGRESSO
                  </h3>
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-500">Meta mensal</span>
                      <span className="text-sm font-medium">
                        {corretorData.ranking.pontuacao}/{corretorData.meta} pts
                      </span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${corretorData.ranking.percentual}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* HISTÓRICO DE VENDAS */}
                <div>
                  <h3
                    className={`text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <CurrencyDollarIcon className="w-4 h-4" />
                    ÚLTIMAS VENDAS
                  </h3>
                  <div className="space-y-3">
                    {corretorData.vendasRecentes
                      .slice(0, 2)
                      .map((venda, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                          <div>
                            <div className="text-sm font-medium">
                              {venda.property}
                            </div>
                            <div className="text-xs text-gray-500">
                              {venda.date}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            R$ {venda.value.toLocaleString()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* COLUNA DIREITA - 1/3 */}
              <div className="space-y-6">
                {/* TREINAMENTOS */}
                <div>
                  <h3
                    className={`text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <AcademicCapIcon className="w-4 h-4" />
                    TREINAMENTOS
                  </h3>
                  <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-gray-500">Concluídos</span>
                      <span className="text-lg font-semibold">
                        {corretorData.treinamentos.concluidos}/5
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Pendentes</span>
                      <span className="text-sm font-medium text-red-500">
                        {corretorData.treinamentos.pendentes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* FEEDBACKS */}
                <div>
                  <h3
                    className={`text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <ChatBubbleLeftRightIcon className="w-4 h-4" />
                    FEEDBACKS
                  </h3>
                  <div className="space-y-3">
                    {corretorData.feedbacks.map((feedback, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <p className="text-sm mb-2">{feedback.texto}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{feedback.autor}</span>
                          <span>{feedback.data}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ALERTAS - CRECI */}
                <div>
                  <h3
                    className={`text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <ExclamationCircleIcon className="w-4 h-4" />
                    ALERTAS
                  </h3>

                  {corretor.creci_validade ? (
                    (() => {
                      const diasParaVencer = calcularDiasParaVencimento(
                        corretor.creci_validade,
                      );

                      // Se está perto de vencer (30 dias ou menos) OU já venceu
                      if (diasParaVencer !== null && diasParaVencer <= 30) {
                        return (
                          <div
                            className={`p-4 rounded-lg border ${
                              isDark
                                ? diasParaVencer < 0
                                  ? "bg-red-900/30 border-red-800"
                                  : "bg-amber-900/20 border-amber-800"
                                : diasParaVencer < 0
                                  ? "bg-red-50 border-red-200"
                                  : "bg-amber-50 border-amber-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <ExclamationCircleIcon
                                className={`w-5 h-5 flex-shrink-0 ${
                                  isDark
                                    ? diasParaVencer < 0
                                      ? "text-red-400"
                                      : "text-amber-400"
                                    : diasParaVencer < 0
                                      ? "text-red-600"
                                      : "text-amber-600"
                                }`}
                              />
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    isDark
                                      ? diasParaVencer < 0
                                        ? "text-red-300"
                                        : "text-amber-300"
                                      : diasParaVencer < 0
                                        ? "text-red-800"
                                        : "text-amber-800"
                                  }`}
                                >
                                  {diasParaVencer < 0
                                    ? "🚨 CRECI VENCIDO!"
                                    : "⚠️ CRECI próximo do vencimento"}
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isDark
                                      ? diasParaVencer < 0
                                        ? "text-red-400"
                                        : "text-amber-400"
                                      : diasParaVencer < 0
                                        ? "text-red-600"
                                        : "text-amber-600"
                                  }`}
                                >
                                  {diasParaVencer < 0
                                    ? `Vencido há ${Math.abs(diasParaVencer)} ${Math.abs(diasParaVencer) === 1 ? "dia" : "dias"}`
                                    : diasParaVencer === 0
                                      ? "Vence HOJE!"
                                      : `Vence em ${diasParaVencer} ${diasParaVencer === 1 ? "dia" : "dias"}`}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      } else {
                        // Se está regular (mais de 30 dias)
                        return (
                          <div
                            className={`p-4 rounded-lg border ${
                              isDark
                                ? "bg-green-900/10 border-green-800"
                                : "bg-green-50 border-green-200"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <CheckCircleIcon
                                className={`w-5 h-5 flex-shrink-0 ${
                                  isDark ? "text-green-400" : "text-green-600"
                                }`}
                              />
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    isDark ? "text-green-300" : "text-green-800"
                                  }`}
                                >
                                  ✅ CRECI regular
                                </p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isDark ? "text-green-400" : "text-green-600"
                                  }`}
                                >
                                  Válido por mais de 30 dias
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    })()
                  ) : (
                    // Se não tem data de validade cadastrada
                    <div
                      className={`p-4 rounded-lg border ${
                        isDark
                          ? "bg-gray-800 border-gray-700"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <InformationCircleIcon
                          className={`w-5 h-5 flex-shrink-0 ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        />
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Data de validade não cadastrada
                          </p>
                          <p
                            className={`text-xs mt-1 ${
                              isDark ? "text-gray-400" : "text-gray-500"
                            }`}
                          >
                            Adicione a validade do CRECI
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* OBSERVAÇÕES */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className={`text-sm font-medium uppercase tracking-wider flex items-center gap-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      <PencilIcon className="w-4 h-4" />
                      OBSERVAÇÕES
                    </h3>
                    <button
                      onClick={handleSalvarObservacoes}
                      className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400"
                    >
                      SALVAR
                    </button>
                  </div>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent resize-none focus:outline-none focus:ring-1 focus:ring-amber-500"
                    placeholder="Adicione observações..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div
            className={`sticky bottom-0 px-8 py-4 border-t ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                FECHAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------
// MODAL DE REPROVAÇÃO
// -------------------------------------------
const ModalReprovacao = ({
  isOpen,
  onClose,
  candidato,
  onConfirmarReprovacao,
  isDark,
}) => {
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState("");

  if (!isOpen || !candidato) return null;

  const handleConfirmar = () => {
    if (!motivo.trim()) {
      setErro("Motivo da reprovação é obrigatório");
      return;
    }
    onConfirmarReprovacao(candidato.id, motivo);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
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
                Reprovar Candidato
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

          <div className="px-6 py-4">
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

            <div className="space-y-3">
              <div>
                <label
                  className={`
                    block text-sm font-medium mb-1
                    ${isDark ? "text-gray-300" : "text-gray-700"}
                  `}
                >
                  Motivo da Reprovação *
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => {
                    setMotivo(e.target.value);
                    setErro("");
                  }}
                  placeholder="Ex: Documentação incompleta, CRECI atrasado, não compareceu..."
                  rows="4"
                  className={`
                    w-full px-3 py-2.5 rounded-lg border text-sm resize-none
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                    }
                    ${
                      erro
                        ? isDark
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                          : "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                        : ""
                    }
                    focus:outline-none focus:ring-2 transition-colors duration-200
                  `}
                />
                {erro && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {erro}
                  </p>
                )}
              </div>
            </div>
          </div>

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
                onClick={handleConfirmar}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isDark
                      ? "bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-800"
                      : "bg-red-600 text-white hover:bg-red-700 border border-red-600"
                  }
                `}
              >
                Confirmar Reprovação
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------
// MODAL DE ATIVAÇÃO
// -------------------------------------------
const ModalAtivacao = ({
  isOpen,
  onClose,
  candidato,
  onConfirmarAtivacao,
  isDark,
}) => {
  const [dataInicio, setDataInicio] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [erro, setErro] = useState("");

  if (!isOpen || !candidato) return null;

  const handleConfirmar = () => {
    if (!dataInicio) {
      setErro("Data de início é obrigatória");
      return;
    }
    onConfirmarAtivacao(candidato.id, dataInicio);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
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
                Ativar Corretor
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

            <div className="space-y-4">
              <div>
                <label
                  className={`
                    block text-sm font-medium mb-1
                    ${isDark ? "text-gray-300" : "text-gray-700"}
                  `}
                >
                  Data de início no período de experiência *
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => {
                    setDataInicio(e.target.value);
                    setErro("");
                  }}
                  className={`
                    w-full px-3 py-2.5 rounded-lg border text-sm
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                    }
                    ${
                      erro
                        ? isDark
                          ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                          : "border-red-400 focus:border-red-400 focus:ring-red-400/30"
                        : ""
                    }
                    focus:outline-none focus:ring-2 transition-colors duration-200
                  `}
                />
                {erro && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {erro}
                  </p>
                )}
              </div>

              <div
                className={`
                  p-3 rounded-lg text-sm
                  ${isDark ? "bg-blue-900/20 text-blue-200 border border-blue-800" : "bg-blue-50 text-blue-800 border border-blue-200"}
                `}
              >
                <div className="flex items-start gap-2">
                  <ClockIcon
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    }`}
                  />
                  <div>
                    <span className="font-medium block mb-1">
                      Período de experiência: 90 dias
                    </span>
                    <p className="text-xs opacity-80">
                      O corretor ficará em período de experiência até{" "}
                      {new Date(
                        new Date(dataInicio).setDate(
                          new Date(dataInicio).getDate() + 90,
                        ),
                      ).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
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
                onClick={handleConfirmar}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    isDark
                      ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                      : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
                  }
                `}
              >
                Iniciar Período de Experiência
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------
// 🆕 MODAL DE FEEDBACK BÁSICO
// -------------------------------------------
// -------------------------------------------
// MODAL DE FEEDBACK COM SCROLL
// -------------------------------------------
const ModalFeedbackBasico = ({
  isOpen,
  onClose,
  candidato,
  onSalvar,
  isDark,
}) => {
  const [nota, setNota] = useState(3);
  const [status, setStatus] = useState("aprovado");
  const [observacoes, setObservacoes] = useState("");

  // 🆕 NOVOS CAMPOS
  const [creciDesde, setCreciDesde] = useState("");
  const [experienciaAnos, setExperienciaAnos] = useState("");
  const [formacao, setFormacao] = useState("");

  if (!isOpen || !candidato) return null;

  const handleSalvar = () => {
    onSalvar(candidato.id, {
      nota,
      status,
      observacoes,
      creci_desde: creciDesde,
      experiencia_anos: experienciaAnos,
      formacao: formacao,
    });
  };

  // ⭐ Estrelas MENORES (mantendo 5)
  const renderEstrelas = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => setNota(n)}
            type="button"
            className="focus:outline-none"
          >
            <StarIconSolid
              className={`w-5 h-5 ${
                // ← Reduzido de w-8 h-8 para w-5 h-5
                n <= nota
                  ? "text-yellow-500"
                  : isDark
                    ? "text-gray-600"
                    : "text-gray-300"
              } hover:scale-110 transition-transform`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full max-w-md rounded-xl shadow-2xl transform transition-all z-[10000]
            ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header (FIXO) */}
          <div
            className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                📋 Feedback da Entrevista
              </h3>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <p
              className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              {candidato.nome} • CRECI: {candidato.creci}
            </p>
          </div>

          {/* Body com SCROLL */}
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
            {" "}
            {/* ← SCROLL AQUI! */}
            <div className="space-y-4">
              {/* Avaliação (compacta) */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Avaliação
                </label>
                {renderEstrelas()}
              </div>

              {/* Decisão */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Decisão
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300 text-gray-900"
                  } focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30`}
                >
                  <option value="aprovado">
                    ✅ Aprovado - Seguir para treinamento
                  </option>
                  <option value="banco">📦 Banco de Talentos</option>
                  <option value="reprovado">❌ Reprovado</option>
                </select>
              </div>

              {/* INFORMAÇÕES COMPLEMENTARES */}
              <div
                className={`p-4 rounded-lg border ${
                  isDark
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <h4
                  className={`text-sm font-semibold mb-3 flex items-center ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <DocumentTextIcon className="w-4 h-4 mr-2" />
                  Informações Complementares
                </h4>

                <div className="space-y-3">
                  {/* Data do CRECI */}
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Data de obtenção do CRECI
                    </label>
                    <input
                      type="date"
                      value={creciDesde}
                      onChange={(e) => setCreciDesde(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Anos de experiência */}
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Anos de experiência no mercado
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={experienciaAnos}
                      onChange={(e) => setExperienciaAnos(e.target.value)}
                      placeholder="Ex: 5"
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Formação */}
                  <div>
                    <label
                      className={`block text-xs font-medium mb-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Formação acadêmica
                    </label>
                    <select
                      value={formacao}
                      onChange={(e) => setFormacao(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg border text-sm ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="">Selecione</option>
                      <option value="ensino_medio">Ensino Médio</option>
                      <option value="superior_incompleto">
                        Superior Incompleto
                      </option>
                      <option value="superior_completo">
                        Superior Completo
                      </option>
                      <option value="pos_graduacao">Pós-graduação</option>
                      <option value="mestrado">Mestrado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Observações (reduzido) */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Observações (opcional)
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows="2"
                  placeholder="Observações sobre a entrevista..."
                  className={`w-full px-3 py-2.5 rounded-lg border text-sm resize-none ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30`}
                />
              </div>
            </div>
          </div>

          {/* Footer (FIXO) */}
          <div
            className={`px-6 py-4 border-t ${
              isDark
                ? "border-gray-700 bg-gray-800/70"
                : "border-gray-200 bg-gray-50/80"
            }`}
          >
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                    : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
                }`}
              >
                Salvar Feedback
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------
// 🆕 MODAL DE PAUSA DO TREINAMENTO
// -------------------------------------------
const ModalPausaTreinamento = ({
  isOpen,
  onClose,
  candidato,
  onConfirmarPausa,
  isDark,
}) => {
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState("");

  if (!isOpen || !candidato) return null;

  const handleConfirmar = () => {
    if (!motivo.trim()) {
      setErro("Motivo da pausa é obrigatório");
      return;
    }
    onConfirmarPausa(candidato.id, motivo);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full max-w-md rounded-xl shadow-2xl transform transition-all z-[10000]
            ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                ⏸️ Pausar Treinamento
              </h3>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <div
                className={`p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="space-y-1">
                  <div
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {candidato.nome}
                  </div>
                  <div
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    CRECI: {candidato.creci}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Motivo da Pausa *
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => {
                    setMotivo(e.target.value);
                    setErro("");
                  }}
                  placeholder="Ex: Documentação pendente, problemas pessoais, aguardando material..."
                  rows="4"
                  className={`
                    w-full px-3 py-2.5 rounded-lg border text-sm resize-none
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                    }
                    ${erro ? (isDark ? "border-red-500" : "border-red-400") : ""}
                    focus:outline-none focus:ring-2 transition-colors duration-200
                  `}
                />
                {erro && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {erro}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`px-6 py-3 border-t ${
              isDark
                ? "border-gray-700 bg-gray-800/70"
                : "border-gray-200 bg-gray-50/80"
            }`}
          >
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-800/40 border border-yellow-800"
                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border border-yellow-300"
                }`}
              >
                Pausar Treinamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------
// 🆕 MODAL DE CANCELAMENTO DO TREINAMENTO
// -------------------------------------------
const ModalCancelamentoTreinamento = ({
  isOpen,
  onClose,
  candidato,
  onConfirmarCancelamento,
  isDark,
}) => {
  const [motivo, setMotivo] = useState("");
  const [erro, setErro] = useState("");

  if (!isOpen || !candidato) return null;

  const handleConfirmar = () => {
    if (!motivo.trim()) {
      setErro("Motivo do cancelamento é obrigatório");
      return;
    }
    onConfirmarCancelamento(candidato.id, motivo);
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full max-w-md rounded-xl shadow-2xl transform transition-all z-[10000]
            ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`px-6 py-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                ⏹️ Cancelar Treinamento
              </h3>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4">
            <div className="mb-4">
              <div
                className={`p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700/50 border-gray-600"
                    : "bg-gray-50 border border-gray-200"
                }`}
              >
                <div className="space-y-1">
                  <div
                    className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {candidato.nome}
                  </div>
                  <div
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-600"}`}
                  >
                    CRECI: {candidato.creci}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label
                  className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                >
                  Motivo do Cancelamento *
                </label>
                <textarea
                  value={motivo}
                  onChange={(e) => {
                    setMotivo(e.target.value);
                    setErro("");
                  }}
                  placeholder="Ex: Desistência, não comparecimento, problemas pessoais..."
                  rows="4"
                  className={`
                    w-full px-3 py-2.5 rounded-lg border text-sm resize-none
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                    }
                    ${erro ? (isDark ? "border-red-500" : "border-red-400") : ""}
                    focus:outline-none focus:ring-2 transition-colors duration-200
                  `}
                />
                {erro && (
                  <p
                    className={`mt-1 text-xs ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {erro}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            className={`px-6 py-3 border-t ${
              isDark
                ? "border-gray-700 bg-gray-800/70"
                : "border-gray-200 bg-gray-50/80"
            }`}
          >
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "text-gray-300 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-200"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmar}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-800"
                    : "bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
                }`}
              >
                Confirmar Cancelamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// -------------------------------------------
// MODAL DE DETALHES DO ARQUIVADO
// -------------------------------------------
const ModalDetalhesArquivado = ({ isOpen, onClose, candidato, isDark }) => {
  if (!isOpen || !candidato) return null;

  // Dados do candidato
  const checkpoints = candidato.checkpoints_treinamento || {
    modulo1: false,
    modulo2: false,
    modulo3: false,
    modulo4: false,
    modulo5: false,
  };

  const atributos = candidato.atributos_treinamento || {
    demonstrouInteresse: false,
    temProposito: false,
    conheceMercado: false,
    disponibilidadeHorario: false,
    veiculoProprio: false,
    experienciaVendas: false,
    comunicacao: false,
    eticaProfissional: false,
    trabalhoEquipe: false,
    metasAmbiciosas: false,
  };

  const progresso = candidato.progresso_treinamento || 0;

  // Lista de módulos com nomes
  const modulosLista = [
    { id: "modulo1", nome: "Módulo 1: Visão e Propósito" },
    { id: "modulo2", nome: "Módulo 2: Metas e Metodologia" },
    { id: "modulo3", nome: "Módulo 3: Práticas de Sucesso" },
    { id: "modulo4", nome: "Módulo 4: Atendimento ao Cliente" },
    { id: "modulo5", nome: "Módulo 5: Fechamento de Vendas" },
  ];

  // Lista de atributos com nomes amigáveis
  const atributosLista = [
    { id: "demonstrouInteresse", nome: "Demonstrou Interesse" },
    { id: "temProposito", nome: "Tem Propósito" },
    { id: "conheceMercado", nome: "Conhece o Mercado" },
    { id: "disponibilidadeHorario", nome: "Disponibilidade de Horário" },
    { id: "veiculoProprio", nome: "Veículo Próprio" },
    { id: "experienciaVendas", nome: "Experiência em Vendas" },
    { id: "comunicacao", nome: "Comunicação" },
    { id: "eticaProfissional", nome: "Ética Profissional" },
    { id: "trabalhoEquipe", nome: "Trabalho em Equipe" },
    { id: "metasAmbiciosas", nome: "Metas Ambiciosas" },
  ];

  // Calcular dias de treinamento
  const calcularDias = () => {
    if (candidato.treinamento_inicio && candidato.treinamento_conclusao) {
      const inicio = new Date(candidato.treinamento_inicio);
      const fim = new Date(candidato.treinamento_conclusao);
      const diffTime = Math.abs(fim - inicio);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return null;
  };

  const diasTreinamento = calcularDias();

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`
            relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl transform transition-all z-[10000]
            ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className={`sticky top-0 px-6 py-4 border-b ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
          >
            <div className="flex items-center justify-between">
              <h3
                className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                📁 Detalhes do Candidato Arquivado
              </h3>
              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-all duration-200 ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-4 space-y-6">
            {/* Informações básicas */}
            <div>
              <h4
                className={`text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {candidato.nome}
              </h4>
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                CRECI: {candidato.creci} • Arquivado em:{" "}
                {candidato.treinamento_conclusao
                  ? new Date(
                      candidato.treinamento_conclusao,
                    ).toLocaleDateString("pt-BR")
                  : new Date().toLocaleDateString("pt-BR")}{" "}
                {/* ← FALLBACK PARA HOJE */}
              </p>
            </div>

            {/* Motivo */}
            {candidato.treinamento_motivo_pausa && (
              <div
                className={`p-3 rounded-lg border ${
                  isDark
                    ? "bg-red-900/20 border-red-800"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <p
                  className={`text-sm ${isDark ? "text-red-200" : "text-red-700"}`}
                >
                  <span className="font-semibold">Motivo do cancelamento:</span>{" "}
                  {candidato.treinamento_motivo_pausa}
                </p>
              </div>
            )}

            {/* Status do treinamento */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4
                  className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  ⏹️ Cancelado após {diasTreinamento} dias
                </h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Início
                  </span>
                  <p
                    className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {new Date(candidato.treinamento_inicio).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                </div>
                <div>
                  <span
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    Previsão
                  </span>
                  <p
                    className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {new Date(
                      candidato.treinamento_previsao,
                    ).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
            </div>

            {/* Progresso */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  Progresso
                </span>
                <span className="font-semibold">{progresso}%</span>
              </div>
              <div
                className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
              >
                <div
                  className={`h-full rounded-full ${
                    progresso >= 80
                      ? "bg-green-500"
                      : progresso >= 50
                        ? "bg-blue-500"
                        : "bg-yellow-500"
                  }`}
                  style={{ width: `${progresso}%` }}
                />
              </div>
            </div>

            {/* Módulos - COM BOX */}
            <div
              className={`p-4 rounded-lg border ${isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"}`}
            >
              <h4
                className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}
              >
                <AcademicCapIcon className="w-4 h-4" />
                Módulos do Treinamento (
                {Object.values(checkpoints).filter(Boolean).length}/5)
              </h4>
              <div className="space-y-2">
                {modulosLista.map((modulo) => (
                  <div
                    key={modulo.id}
                    className={`flex items-center p-2 rounded-lg border ${
                      checkpoints[modulo.id]
                        ? isDark
                          ? "bg-green-900/20 border-green-800"
                          : "bg-green-50 border-green-200"
                        : "border-transparent"
                    }`}
                  >
                    {checkpoints[modulo.id] ? (
                      <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-4 h-4 mr-2 text-red-500" />
                    )}
                    <span
                      className={`text-sm ${
                        checkpoints[modulo.id]
                          ? isDark
                            ? "text-green-300"
                            : "text-green-700"
                          : isDark
                            ? "text-gray-300"
                            : "text-gray-700"
                      }`}
                    >
                      {modulo.nome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Atributos - COM BOX */}
            <div
              className={`p-4 rounded-lg border ${isDark ? "bg-gray-700/30 border-gray-600" : "bg-gray-50 border-gray-200"}`}
            >
              <h4
                className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}
              >
                <UserIcon className="w-4 h-4" />
                Atributos Pessoais (
                {Object.values(atributos).filter(Boolean).length}/10)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {atributosLista.map((atributo) => (
                  <div
                    key={atributo.id}
                    className={`flex items-center p-2 rounded-lg border ${
                      atributos[atributo.id]
                        ? isDark
                          ? "bg-green-900/20 border-green-800"
                          : "bg-green-50 border-green-200"
                        : "border-transparent"
                    }`}
                  >
                    {atributos[atributo.id] ? (
                      <CheckCircleIcon className="w-3 h-3 mr-1 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-3 h-3 mr-1 text-red-500" />
                    )}
                    <span
                      className={`text-xs ${
                        atributos[atributo.id]
                          ? isDark
                            ? "text-green-300"
                            : "text-green-700"
                          : isDark
                            ? "text-gray-300"
                            : "text-gray-700"
                      }`}
                    >
                      {atributo.nome}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback */}
            {candidato.feedback_nota && (
              <div>
                <h4
                  className={`text-sm font-semibold mb-3 flex items-center gap-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4" />
                  Feedback da Entrevista
                </h4>
                <div
                  className={`p-4 rounded-lg border ${
                    isDark
                      ? "bg-green-900/20 border-green-800"
                      : "bg-green-50 border-green-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      ⭐ {candidato.feedback_nota}.0
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        isDark
                          ? "bg-green-900/30 text-green-300"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      ✅ Aprovado
                    </span>
                  </div>
                  {candidato.entrevistador && (
                    <p
                      className={`text-xs mb-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                    >
                      <span className="font-medium">Entrevistado por:</span>{" "}
                      {candidato.entrevistador}
                    </p>
                  )}
                  {candidato.feedback_observacoes && (
                    <p
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {candidato.feedback_observacoes}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className={`sticky bottom-0 px-6 py-4 border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"}`}
          >
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isDark
                    ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                    : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
                }`}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
// ===========================================
// 🆕 COMPONENTES DE EXIBIÇÃO (COLE AQUI!)
// ===========================================

// Badge de nota (opcional, mas útil)
const BadgeNota = ({ nota, isDark }) => {
  if (!nota) return null;
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
        isDark
          ? "bg-purple-900/30 text-purple-300 border border-purple-800"
          : "bg-purple-100 text-purple-800 border border-purple-300"
      }`}
    >
      <StarIcon className="w-3 h-3" />
      {nota} ★
    </span>
  );
};

// ===========================================
// COMPONENTE DE FEEDBACK COMPACTO (APENAS FEEDBACK)
// ===========================================
const FeedbackCompacto = ({ candidato, isDark }) => {
  const temFeedback = candidato.feedback_nota ? true : false;
  if (!temFeedback) return null;

  const nota = candidato.feedback_nota;
  const status = candidato.feedback_status;
  const observacoes = candidato.feedback_observacoes || "";
  const entrevistador = candidato.entrevistador || "";
  const resumoObs =
    observacoes.length > 60
      ? observacoes.substring(0, 60) + "..."
      : observacoes;

  const statusConfig = {
    aprovado: {
      bg: isDark ? "bg-green-900/20" : "bg-green-50",
      border: isDark ? "border-green-800" : "border-green-200",
      badge: isDark
        ? "bg-green-900/30 text-green-300"
        : "bg-green-100 text-green-800",
      icon: "✅",
    },
    banco: {
      bg: isDark ? "bg-blue-900/20" : "bg-blue-50",
      border: isDark ? "border-blue-800" : "border-blue-200",
      badge: isDark
        ? "bg-blue-900/30 text-blue-300"
        : "bg-blue-100 text-blue-800",
      icon: "📦",
    },
    reprovado: {
      bg: isDark ? "bg-red-900/20" : "bg-red-50",
      border: isDark ? "border-red-800" : "border-red-200",
      badge: isDark ? "bg-red-900/30 text-red-300" : "bg-red-100 text-red-800",
      icon: "❌",
    },
  };

  const config = statusConfig[status] || statusConfig.aprovado;

  const statusTexto = {
    aprovado: "Aprovado",
    banco: "Banco de Talentos",
    reprovado: "Reprovado",
  };

  return (
    <div className={`mt-3 p-3 rounded-lg border ${config.bg} ${config.border}`}>
      {/* Linha superior: nota + status + data */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
          >
            ⭐ {nota}.0
          </span>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badge}`}
          >
            {config.icon} {statusTexto[status]}
          </span>
        </div>
        {candidato.feedback_data && (
          <span
            className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
          >
            {formatarData(candidato.feedback_data)} {/* ← CORRIGIDO! */}
          </span>
        )}
      </div>

      {/* Observações (se houver) */}
      {resumoObs && (
        <div className="flex items-start gap-2 mb-2">
          <ChatBubbleLeftRightIcon
            className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isDark ? "text-gray-400" : "text-gray-500"}`}
          />
          <p
            className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"} leading-relaxed`}
          >
            {resumoObs}
          </p>
        </div>
      )}

      {/* Se não houver observações, mostra mensagem padrão */}
      {!resumoObs && (
        <p
          className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"} italic mb-2`}
        >
          Sem observações adicionais
        </p>
      )}

      {/* Entrevistador */}
      {entrevistador && (
        <>
          <div
            className={`w-full border-t border-dashed ${isDark ? "border-gray-700" : "border-gray-300"} my-2`}
          />
          <div className="flex items-center gap-1">
            <UserIcon
              className={`w-3 h-3 ${isDark ? "text-gray-500" : "text-gray-500"}`}
            />
            <span
              className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              <span className="font-medium">Entrevistado por:</span>{" "}
              {entrevistador}
            </span>
          </div>
        </>
      )}
    </div>
  );
};
// ===========================================
// COMPONENTES AUXILIARES
// ===========================================

const calcularDiasRestantes = (dataFim) => {
  if (!dataFim) return 0;
  const fim = new Date(dataFim);
  const hoje = new Date();
  const diff = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const calcularDiasPassados = (dataInicio) => {
  if (!dataInicio) return 0;
  const inicio = new Date(dataInicio);
  const hoje = new Date();
  const diff = Math.ceil((hoje - inicio) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const calcularProgressoExperiencia = (corretor) => {
  if (!corretor.treinamento_conclusao || !corretor.data_experiencia_fim)
    return 0;
  const inicio = new Date(corretor.treinamento_conclusao);
  const fim = new Date(corretor.data_experiencia_fim);
  const hoje = new Date();
  const total = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
  const passado = Math.ceil((hoje - inicio) / (1000 * 60 * 60 * 24));
  const progresso = Math.min(100, Math.max(0, (passado / total) * 100));
  return Math.round(progresso);
};

const formatarData = (dataString) => {
  if (!dataString) return "";

  // Se for string, extrai apenas a parte da data (YYYY-MM-DD)
  if (typeof dataString === "string") {
    // Pega só a parte antes do T (se houver)
    const parteData = dataString.split("T")[0];
    if (parteData.includes("-")) {
      const [ano, mes, dia] = parteData.split("-");
      return `${dia}/${mes}/${ano}`;
    }
  }

  // Fallback para outros formatos
  return new Date(dataString).toLocaleDateString("pt-BR");
};

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
    "Período de Experiência": {
      bgColor: isDark ? "bg-blue-900/30" : "bg-blue-100",
      textColor: isDark ? "text-blue-300" : "text-blue-800",
      borderColor: isDark ? "border-blue-800" : "border-blue-300",
      icon: ClockIcon,
      iconColor: isDark ? "text-blue-400" : "text-blue-600",
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
// ===========================================
// CRONOGRAMA DO TREINAMENTO - VERSÃO COMPLETA
// ===========================================
const CronogramaTreinamento = ({
  candidato,
  isDark,
  onIniciar,
  onPausar,
  onRetomar,
  onCancelar,
  onConcluir,
  onAtivar,
  onArquivar,
}) => {
  console.log("📊 CronogramaTreinamento - candidato:", candidato.id);
  console.log("📅 treinamento_inicio (raw):", candidato.treinamento_inicio);
  console.log(
    "📅 treinamento_inicio (tipo):",
    typeof candidato.treinamento_inicio,
  );

  if (
    !candidato.treinamento_inicio &&
    candidato.treinamento_status !== "nao_iniciado"
  ) {
    return null;
  }

  const hoje = new Date();
  const inicio = candidato.treinamento_inicio
    ? new Date(candidato.treinamento_inicio)
    : null;
  const previsao = candidato.treinamento_previsao
    ? new Date(candidato.treinamento_previsao)
    : null;
  const status = candidato.treinamento_status || "nao_iniciado";

  const progresso = candidato.progresso_treinamento || 0;

  const checkpoints = candidato.checkpoints_treinamento || {
    modulo1: false,
    modulo2: false,
    modulo3: false,
    modulo4: false,
    modulo5: false,
  };

  const atributos = candidato.atributos_treinamento || {
    demonstrouInteresse: false,
    temProposito: false,
    conheceMercado: false,
    disponibilidadeHorario: false,
    veiculoProprio: false,
    experienciaVendas: false,
    comunicacao: false,
    eticaProfissional: false,
    trabalhoEquipe: false,
    metasAmbiciosas: false,
  };

  const modulosConcluidos = Object.values(checkpoints).filter(Boolean).length;
  const atributosConcluidos = Object.values(atributos).filter(Boolean).length;
  const todosModulosConcluidos = modulosConcluidos === 5;

  let diasRestantes = null;
  let alertaPrazo = false;

  if (inicio && previsao && status === "em_andamento") {
    const diffTime = previsao - hoje;
    diasRestantes = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    alertaPrazo = diasRestantes <= 3 && diasRestantes > 0;
  }

  const getBarraCor = () => {
    if (status === "cancelado") return "bg-red-500";
    if (status === "pausado") return "bg-yellow-500";
    if (status === "concluido") return "bg-green-500";
    if (progresso >= 100) return "bg-purple-500";
    if (progresso >= 80) return "bg-red-500";
    if (progresso >= 60) return "bg-orange-500";
    if (progresso >= 30) return "bg-blue-500";
    return "bg-green-500";
  };

  const statusConfig = {
    nao_iniciado: {
      cor: isDark ? "text-gray-400" : "text-gray-600",
      bg: isDark ? "bg-gray-800/30" : "bg-gray-50",
      border: isDark ? "border-gray-700" : "border-gray-200",
      icone: "○",
      texto: "Não Iniciado",
    },
    em_andamento: {
      cor: isDark ? "text-purple-400" : "text-purple-600",
      bg: isDark ? "bg-purple-900/20" : "bg-purple-50",
      border: isDark ? "border-purple-800" : "border-purple-200",
      icone: "▶️",
      texto: "Em Andamento",
    },
    pausado: {
      cor: isDark ? "text-yellow-400" : "text-yellow-600",
      bg: isDark ? "bg-yellow-900/20" : "bg-yellow-50",
      border: isDark ? "border-yellow-800" : "border-yellow-200",
      icone: "⏸️",
      texto: "Pausado",
    },
    cancelado: {
      cor: isDark ? "text-red-400" : "text-red-600",
      bg: isDark ? "bg-red-900/20" : "bg-red-50",
      border: isDark ? "border-red-800" : "border-red-200",
      icone: "⏹️",
      texto: "Cancelado",
    },
    concluido: {
      cor: isDark ? "text-green-400" : "text-green-600",
      bg: isDark ? "bg-green-900/20" : "bg-green-50",
      border: isDark ? "border-green-800" : "border-green-200",
      icone: "✅",
      texto: "Concluído",
    },
  };

  const config = statusConfig[status] || statusConfig.nao_iniciado;

  // Renderização condicional baseada no status
  if (status === "nao_iniciado") {
    return (
      <div
        className={`mt-4 p-3 rounded-lg border flex items-center justify-between ${config.bg} ${config.border}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icone}</span>
          <span className={`text-sm font-medium ${config.cor}`}>
            {config.texto}
          </span>
        </div>
        <button
          onClick={() => onIniciar?.(candidato.id)}
          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
            isDark
              ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/40"
              : "bg-blue-50 text-blue-600 hover:bg-blue-100"
          }`}
        >
          + Iniciar
        </button>
      </div>
    );
  }

  // ✅ STATUS CONCLUÍDO - CORRIGIDO!
  if (status === "concluido") {
    return (
      <div
        className={`mt-4 p-3 rounded-lg border ${config.bg} ${config.border}`}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{config.icone}</span>
            <span className={`text-sm font-semibold ${config.cor}`}>
              {config.texto}
            </span>
          </div>
          <button
            onClick={() => onAtivar?.(candidato.id)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              isDark
                ? "bg-green-900/30 text-green-300 hover:bg-green-800/40"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            🏆 Ativar Corretor
          </button>
        </div>

        {/* DATA DE CONCLUSÃO CORRIGIDA */}
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Concluído em:{" "}
            {candidato.treinamento_conclusao
              ? (() => {
                  // Formatar YYYY-MM-DD para DD/MM/YYYY
                  if (
                    typeof candidato.treinamento_conclusao === "string" &&
                    candidato.treinamento_conclusao.includes("-")
                  ) {
                    const [ano, mes, dia] =
                      candidato.treinamento_conclusao.split("-");
                    return `${dia}/${mes}/${ano}`;
                  }
                  // Fallback
                  return new Date(
                    candidato.treinamento_conclusao,
                  ).toLocaleDateString("pt-BR");
                })()
              : "Data não disponível"}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isDark
                ? "bg-green-900/30 text-green-300"
                : "bg-green-100 text-green-700"
            }`}
          >
            {modulosConcluidos}/5 módulos
          </span>
        </div>
      </div>
    );
  }

  // ✅ STATUS CANCELADO
  if (status === "cancelado") {
    return (
      <div
        className={`mt-4 p-3 rounded-lg border ${config.bg} ${config.border}`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{config.icone}</span>
          <span className={`text-sm font-semibold ${config.cor}`}>
            {config.texto}
          </span>
        </div>
        {candidato.treinamento_motivo_pausa && (
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-3`}
          >
            Motivo: {candidato.treinamento_motivo_pausa}
          </div>
        )}
        <button
          onClick={() => onArquivar?.(candidato.id)}
          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
            isDark
              ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <ArchiveBoxIcon className="w-4 h-4" />
          Arquivar
        </button>
      </div>
    );
  }

  // Versão COMPLETA para Em Andamento e Pausado
  return (
    <div className={`mt-4 p-4 rounded-lg border ${config.bg} ${config.border}`}>
      {/* Cabeçalho com status */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icone}</span>
          <span className={`text-sm font-semibold ${config.cor}`}>
            {config.texto}
          </span>
        </div>
        {status === "em_andamento" && diasRestantes !== null && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              alertaPrazo
                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                : diasRestantes < 0
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : isDark
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-100 text-gray-600"
            }`}
          >
            {diasRestantes > 0
              ? `${diasRestantes} dias`
              : diasRestantes === 0
                ? "Hoje"
                : `${Math.abs(diasRestantes)} dias atrás`}
          </span>
        )}
      </div>

      {/* Datas */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        {candidato.treinamento_inicio && (
          <div>
            <div
              className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
            >
              Início
            </div>
            <div
              className={`text-sm font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {candidato.treinamento_inicio.split("-").reverse().join("/")}
            </div>
          </div>
        )}
        {candidato.treinamento_previsao && (
          <div>
            <div
              className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
            >
              Previsão
            </div>
            <div
              className={`text-sm font-medium ${
                alertaPrazo || diasRestantes < 0
                  ? "text-red-500"
                  : isDark
                    ? "text-gray-300"
                    : "text-gray-700"
              }`}
            >
              {candidato.treinamento_previsao.split("-").reverse().join("/")}
            </div>
          </div>
        )}
      </div>

      {/* PRIMEIRA LINHA DIVISÓRIA */}
      <div
        className={`w-full h-px my-3 ${isDark ? "bg-gray-700" : "bg-gray-200"}`}
      />

      {/* PROGRESSO DO TREINAMENTO */}
      <div className="space-y-3">
        {/* Barra de progresso */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>
              Progresso do Treinamento
            </span>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>
              {progresso}%
            </span>
          </div>
          <div
            className={`w-full h-2 rounded-full overflow-hidden ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-500 ${getBarraCor()}`}
              style={{ width: `${progresso}%` }}
            />
          </div>
        </div>

        {/* Módulos e Atributos */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <AcademicCapIcon
              className={`w-4 h-4 ${isDark ? "text-blue-400" : "text-blue-600"}`}
            />
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              Módulos:{" "}
              <span className="font-semibold">{modulosConcluidos}/5</span>
            </span>
          </div>
          <div className="flex items-center gap-1">
            <UserIcon
              className={`w-4 h-4 ${isDark ? "text-green-400" : "text-green-600"}`}
            />
            <span className={isDark ? "text-gray-300" : "text-gray-700"}>
              Atributos:{" "}
              <span className="font-semibold">{atributosConcluidos}/10</span>
            </span>
          </div>
        </div>
      </div>

      {/* BOTÕES DE AÇÃO BASEADOS NO STATUS */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {status === "em_andamento" && (
          <>
            <button
              onClick={() => onPausar?.(candidato.id)}
              className={`text-xs py-1.5 px-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-yellow-900/30 text-yellow-300 hover:bg-yellow-800/40"
                  : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
              }`}
            >
              ⏸️ Pausar
            </button>
            {todosModulosConcluidos && (
              <button
                onClick={() => onConcluir?.(candidato.id)}
                className={`text-xs py-1.5 px-2 rounded-lg transition-colors ${
                  isDark
                    ? "bg-green-900/30 text-green-300 hover:bg-green-800/40"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                ✅ Concluir
              </button>
            )}
          </>
        )}

        {status === "pausado" && (
          <>
            <button
              onClick={() => onRetomar?.(candidato.id)}
              className={`text-xs py-1.5 px-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-green-900/30 text-green-300 hover:bg-green-800/40"
                  : "bg-green-100 text-green-700 hover:bg-green-200"
              }`}
            >
              ▶️ Retomar
            </button>
            <button
              onClick={() => onCancelar?.(candidato.id)}
              className={`text-xs py-1.5 px-2 rounded-lg transition-colors ${
                isDark
                  ? "bg-red-900/30 text-red-300 hover:bg-red-800/40"
                  : "bg-red-100 text-red-700 hover:bg-red-200"
              }`}
            >
              ⏹️ Cancelar
            </button>
          </>
        )}
      </div>

      {/* Motivo da pausa (se aplicável) */}
      {status === "pausado" && candidato.treinamento_motivo_pausa && (
        <div
          className={`mt-3 p-2 rounded text-xs ${
            isDark
              ? "bg-gray-700/50 text-gray-300"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <span className="font-medium">Motivo:</span>{" "}
          {candidato.treinamento_motivo_pausa}
        </div>
      )}
    </div>
  );
};
// ===========================================
// COMPONENTE PRINCIPAL - CORRETORES
// ===========================================
const Corretores = () => {
  // -----------------------------------------
  // 1. STATES
  // -----------------------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [abaAtiva, setAbaAtiva] = useState("candidatos");
  const [etapaCandidato, setEtapaCandidato] = useState("pendentes");
  const [modalAgendamentoAberto, setModalAgendamentoAberto] = useState(false);
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);
  const [modalProgressoAberto, setModalProgressoAberto] = useState(false);
  const [modalReprovacaoAberto, setModalReprovacaoAberto] = useState(false);
  const [modalAtivacaoAberto, setModalAtivacaoAberto] = useState(false);
  const [modalFeedbackAberto, setModalFeedbackAberto] = useState(false);
  const [modalPausaAberto, setModalPausaAberto] = useState(false);
  const [candidatoParaPausa, setCandidatoParaPausa] = useState(null);
  const [modalCancelamentoAberto, setModalCancelamentoAberto] = useState(false);
  const [candidatoParaCancelar, setCandidatoParaCancelar] = useState(null);
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [candidatoDetalhes, setCandidatoDetalhes] = useState(null);

  const [candidatoParaAgendar, setCandidatoParaAgendar] = useState(null);
  const [candidatoParaReprovar, setCandidatoParaReprovar] = useState(null);
  const [candidatoParaAtivar, setCandidatoParaAtivar] = useState(null);
  const [candidatoProgresso, setCandidatoProgresso] = useState(null);
  const [candidatoParaFeedback, setCandidatoParaFeedback] = useState(null);
  const [corretorSelecionado, setCorretorSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formAgendamento, setFormAgendamento] = useState({
    dataEntrevista: "",
    horarioEntrevista: "",
    entrevistador: "",
    observacoes: "",
  });

  const [errosForm, setErrosForm] = useState({});

  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [candidatosPorEtapa, setCandidatosPorEtapa] = useState({
    pendentes: [],
    entrevista: [],
    treinamento: [],
    reprovados: [],
    ativos: [],
    inativos: [],
    arquivados: [],
  });

  // -----------------------------------------
  // 2. FUNÇÃO DE ATIVAÇÃO DIRETA COM DEBUG
  // -----------------------------------------
  const handleAtivacaoDireta = async (corretorId) => {
    console.log("🔍 FUNÇÃO DE ATIVAÇÃO DIRETA CHAMADA! ID:", corretorId);
    console.log("📊 Corretor selecionado antes:", corretorSelecionado);

    try {
      // Verifica se o ID é válido
      if (!corretorId) {
        console.error("❌ ID do corretor inválido!");
        alert("ID do corretor inválido!");
        return;
      }

      // Log do que será enviado
      const dataAtualizacao = {
        periodoExperiencia: false,
        data_ativacao: new Date().toISOString().split("T")[0],
      };
      console.log("📤 Dados a serem enviados:", dataAtualizacao);

      // 1️⃣ ATUALIZAR NO BANCO
      const { data, error } = await supabase
        .from("corretores")
        .update(dataAtualizacao)
        .eq("id", corretorId)
        .select();

      if (error) {
        console.error("❌ Erro do Supabase:", error);
        throw error;
      }

      console.log("✅ Resposta do Supabase:", data);

      // 2️⃣ ATUALIZAR O ESTADO LOCAL (lista de ativos)
      setCandidatosPorEtapa((prev) => {
        const novosAtivos = prev.ativos.map((c) =>
          c.id === corretorId
            ? {
                ...c,
                periodoExperiencia: false,
                data_ativacao: dataAtualizacao.data_ativacao,
              }
            : c,
        );

        console.log("🔄 Novos ativos:", novosAtivos);
        return { ...prev, ativos: novosAtivos };
      });

      // 3️⃣ ATUALIZAR O CORRETOR SELECIONADO NO MODAL
      setCorretorSelecionado((prev) => {
        const novo = {
          ...prev,
          periodoExperiencia: false,
          data_ativacao: dataAtualizacao.data_ativacao,
        };
        console.log("🔄 Novo corretor selecionado:", novo);
        return novo;
      });

      alert("✅ Corretor ativado com sucesso!");
    } catch (error) {
      console.error("❌ Erro completo:", error);
      console.error("❌ Mensagem:", error.message);
      console.error("❌ Stack:", error.stack);
      alert(`Erro ao ativar corretor: ${error.message || "Tente novamente."}`);
    }
  };

  // -----------------------------------------
  // 2. CARREGAR DADOS DO SUPABASE
  // -----------------------------------------
  useEffect(() => {
    carregarDados();

    const subscription = supabase
      .channel("corretores_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "corretores" },
        () => {
          carregarDados();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("corretores")
        .select(
          `
    *,
    creci_desde,
    experiencia_anos,
    formacao,
    feedback_data,
    creci_validade
    `, // ← SEM COMENTÁRIO!
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      console.log("🔥 DADOS CARREGADOS:", data);

      const dadosProcessados = data || [];

      const pendentes = dadosProcessados.filter((c) => c.etapa === "pendentes");
      const entrevista = dadosProcessados.filter(
        (c) => c.etapa === "entrevista",
      );
      const treinamento = dadosProcessados.filter(
        (c) =>
          c.etapa === "treinamento" && c.treinamento_status !== "arquivado",
      );
      const reprovados = dadosProcessados.filter(
        (c) => c.etapa === "reprovados",
      );
      const ativos = dadosProcessados.filter((c) => c.etapa === "ativos");
      const inativos = dadosProcessados.filter((c) => c.etapa === "inativos");
      const arquivados = dadosProcessados.filter(
        (c) => c.treinamento_status === "arquivado",
      );

      console.log("🔍 CANDIDATOS EM ENTREVISTA:", entrevista);
      console.log("🔍 PRIMEIRO CANDIDATO EM ENTREVISTA:", entrevista[0]);

      if (entrevista[0]?.feedback_data) {
        console.log(
          "📅 feedback_data do primeiro candidato:",
          entrevista[0].feedback_data,
        );
        console.log(
          "📅 feedback_data formatado:",
          formatarData(entrevista[0].feedback_data),
        );
      }

      setCandidatosPorEtapa({
        pendentes,
        entrevista,
        treinamento,
        reprovados,
        ativos,
        inativos,
        arquivados,
      });

      console.log("🔍 PRIMEIRO CANDIDATO EM TREINAMENTO:", treinamento[0]);
      console.log("🔍 campos novos:", {
        creci_desde: treinamento[0]?.creci_desde,
        experiencia_anos: treinamento[0]?.experiencia_anos,
        formacao: treinamento[0]?.formacao,
      });
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // 3. FUNÇÕES AUXILIARES
  // -----------------------------------------
  const calcularProgresso = (checkpoints) => {
    if (!checkpoints) return 0;
    const totalModulos = Object.keys(checkpoints).length;
    const concluidos = Object.values(checkpoints).filter(Boolean).length;
    return Math.round((concluidos / totalModulos) * 100);
  };

  const calcularDiasRestantes = (dataFim) => {
    if (!dataFim) return 0;
    const fim = new Date(dataFim);
    const hoje = new Date();
    const diff = Math.ceil((fim - hoje) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const calcularDiasPassados = (dataInicio) => {
    if (!dataInicio) return 0;
    const inicio = new Date(dataInicio);
    const hoje = new Date();
    const diff = Math.ceil((hoje - inicio) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const calcularProgressoExperiencia = (corretor) => {
    if (!corretor.treinamento_conclusao || !corretor.data_experiencia_fim)
      return 0;
    const inicio = new Date(corretor.treinamento_conclusao);
    const fim = new Date(corretor.data_experiencia_fim);
    const hoje = new Date();
    const total = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
    const passado = Math.ceil((hoje - inicio) / (1000 * 60 * 60 * 24));
    const progresso = Math.min(100, Math.max(0, (passado / total) * 100));
    return Math.round(progresso);
  };

  const calcularDiasParaVencimento = (dataValidade) => {
    if (!dataValidade) return null;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(dataValidade);
    vencimento.setHours(0, 0, 0, 0);

    const diff = Math.ceil((vencimento - hoje) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const formatarData = (dataString) => {
    if (!dataString) return "Não informada";

    if (typeof dataString === "string") {
      const parteData = dataString.split("T")[0];
      if (parteData.includes("-")) {
        const [ano, mes, dia] = parteData.split("-");
        return `${dia}/${mes}/${ano}`;
      }
    }

    try {
      return new Date(dataString).toLocaleDateString("pt-BR");
    } catch {
      return "Não informada";
    }
  };

  const formatarNumeroWhatsApp = (telefone) => {
    if (!telefone || typeof telefone !== "string") return "";

    const numeroLimpo = telefone.replace(/\D/g, "");
    return numeroLimpo.startsWith("55") ? numeroLimpo : `55${numeroLimpo}`;
  };

  const criarLinkWhatsApp = (telefone, nome) => {
    if (!telefone || !nome) return "#";

    const numero = formatarNumeroWhatsApp(telefone);
    if (!numero) return "#";

    const mensagem = `Olá ${nome}, tudo bem?`;
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
  };

  const formatarDataParaExibicao = (dataString) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const amanha = new Date(hoje);
    amanha.setDate(amanha.getDate() + 1);

    let dataEntrevista;
    let horaOriginal = "";

    if (typeof dataString === "string" && dataString.includes("-")) {
      const [ano, mes, dia] = dataString.split("-").map(Number);
      dataEntrevista = new Date(ano, mes - 1, dia);
    } else {
      const partes = dataString.split(" ");
      if (partes.length > 1) {
        const [ano, mes, dia] = partes[0].split("-").map(Number);
        dataEntrevista = new Date(ano, mes - 1, dia);
        horaOriginal = partes[1];
      } else {
        dataEntrevista = new Date(dataString);
      }
    }
    dataEntrevista.setHours(0, 0, 0, 0);

    const dia = dataEntrevista.getDate().toString().padStart(2, "0");
    const mes = (dataEntrevista.getMonth() + 1).toString().padStart(2, "0");
    const ano = dataEntrevista.getFullYear();

    let textoData;
    if (dataEntrevista.getTime() === hoje.getTime()) {
      textoData = "Hoje";
    } else if (dataEntrevista.getTime() === amanha.getTime()) {
      textoData = "Amanhã";
    } else {
      textoData = `${dia}/${mes}/${ano}`;
    }

    return horaOriginal ? `${textoData}, ${horaOriginal}` : textoData;
  };

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

  // -----------------------------------------
  // 4. FUNÇÕES DE TOGGLE (CHECKBOXES)
  // -----------------------------------------
  const handleToggleCheckpoint = async (candidatoId, modulo) => {
    const candidato = candidatosPorEtapa.treinamento.find(
      (c) => c.id === candidatoId,
    );
    if (!candidato) return;

    const checkpointsAtuais = candidato.checkpoints_treinamento || {
      modulo1: false,
      modulo2: false,
      modulo3: false,
      modulo4: false,
      modulo5: false,
    };

    const novosCheckpoints = {
      ...checkpointsAtuais,
      [modulo]: !checkpointsAtuais[modulo],
    };

    const total = 5;
    const concluidos = Object.values(novosCheckpoints).filter(Boolean).length;
    const novoProgresso = Math.round((concluidos / total) * 100);

    try {
      const { error } = await supabase
        .from("corretores")
        .update({
          checkpoints_treinamento: novosCheckpoints,
          progresso_treinamento: novoProgresso,
        })
        .eq("id", candidatoId);

      if (error) throw error;

      setCandidatosPorEtapa((prev) => {
        const novosTreinamentos = prev.treinamento.map((c) =>
          c.id === candidatoId
            ? {
                ...c,
                checkpoints_treinamento: novosCheckpoints,
                progresso_treinamento: novoProgresso,
              }
            : c,
        );
        return { ...prev, treinamento: novosTreinamentos };
      });
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao salvar progresso. Tente novamente.");
    }
  };

  const handleToggleAtributo = async (candidatoId, atributo) => {
    const candidato = candidatosPorEtapa.treinamento.find(
      (c) => c.id === candidatoId,
    );
    if (!candidato) return;

    const atributosAtuais = candidato.atributos_treinamento || {
      demonstrouInteresse: false,
      temProposito: false,
      conheceMercado: false,
      disponibilidadeHorario: false,
      veiculoProprio: false,
      experienciaVendas: false,
      comunicacao: false,
      eticaProfissional: false,
      trabalhoEquipe: false,
      metasAmbiciosas: false,
    };

    const novosAtributos = {
      ...atributosAtuais,
      [atributo]: !atributosAtuais[atributo],
    };

    try {
      const { error } = await supabase
        .from("corretores")
        .update({
          atributos_treinamento: novosAtributos,
        })
        .eq("id", candidatoId);

      if (error) throw error;

      setCandidatosPorEtapa((prev) => ({
        ...prev,
        treinamento: prev.treinamento.map((c) =>
          c.id === candidatoId
            ? { ...c, atributos_treinamento: novosAtributos }
            : c,
        ),
      }));
    } catch (err) {
      console.error("Erro ao atualizar atributo:", err);
      alert("Erro ao salvar atributo. Tente novamente.");
    }
  };

  // -----------------------------------------
  // 5. CORES DOS STATUS
  // -----------------------------------------
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
    "Período de Experiência": isDark
      ? "bg-blue-900/30 text-blue-300 border border-blue-800"
      : "bg-blue-100 text-blue-800",
  };

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

  // -----------------------------------------
  // 6. FUNÇÕES DE CRUD (COM SUPABASE)
  // -----------------------------------------
  const handleDelete = async (id, tipo) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir este ${tipo === "candidato" ? "candidato" : "corretor"}?`,
      )
    ) {
      try {
        const { error } = await supabase
          .from("corretores")
          .delete()
          .eq("id", id);
        if (error) throw error;
        await carregarDados();
      } catch (err) {
        console.error("Erro ao excluir:", err);
        alert("Erro ao excluir. Tente novamente.");
      }
    }
  };

  const handleSalvarAgendamento = async () => {
    if (!validarFormulario() || !candidatoParaAgendar) return;

    try {
      const horarioLimpo = formAgendamento.horarioEntrevista
        .split(":")
        .slice(0, 2)
        .join(":");
      const isReagendamento = candidatoParaAgendar.etapa === "entrevista";

      let dadosAtualizados = {
        data_entrevista: formAgendamento.dataEntrevista,
        horario_entrevista: horarioLimpo,
        entrevistador: formAgendamento.entrevistador,
        observacoes: formAgendamento.observacoes,
      };

      if (isReagendamento) {
        dadosAtualizados = {
          ...dadosAtualizados,
          reagendado: true,
          numero_reagendamentos:
            (candidatoParaAgendar.numero_reagendamentos || 0) + 1,
          data_original:
            candidatoParaAgendar.data_original ||
            candidatoParaAgendar.data_entrevista,
          horario_original:
            candidatoParaAgendar.horario_original ||
            candidatoParaAgendar.horario_entrevista,
        };
      } else {
        dadosAtualizados = {
          ...dadosAtualizados,
          etapa: "entrevista",
          reagendado: false,
          numero_reagendamentos: 0,
          data_original: null,
          horario_original: null,
        };
      }

      const { error } = await supabase
        .from("corretores")
        .update(dadosAtualizados)
        .eq("id", candidatoParaAgendar.id);

      if (error) throw error;

      await carregarDados();
      handleFecharModal();

      if (isReagendamento) {
        alert(`✅ Entrevista REAGENDADA para ${candidatoParaAgendar.nome}!`);
      } else {
        alert(`✅ Entrevista agendada para ${candidatoParaAgendar.nome}!`);
      }
    } catch (err) {
      console.error("❌ Erro ao agendar:", err);
      alert("Erro ao agendar entrevista. Tente novamente.");
    }
  };

  const handleAprovarEntrevista = async (candidato) => {
    if (
      !window.confirm(
        `Deseja aprovar ${candidato.nome} para a próxima etapa (Treinamento)?`,
      )
    ) {
      return;
    }

    try {
      const { error } = await supabase
        .from("corretores")
        .update({
          etapa: "treinamento",
          progresso_treinamento: 0,
          checkpoints_treinamento: {
            modulo1: false,
            modulo2: false,
            modulo3: false,
            modulo4: false,
            modulo5: false,
          },
          atributos_treinamento: {
            demonstrouInteresse: false,
            temProposito: false,
            conheceMercado: false,
            disponibilidadeHorario: false,
            veiculoProprio: false,
            experienciaVendas: false,
            comunicacao: false,
            eticaProfissional: false,
            trabalhoEquipe: false,
            metasAmbiciosas: false,
          },
        })
        .eq("id", candidato.id);

      if (error) throw error;

      await carregarDados();
      alert(`${candidato.nome} aprovado para treinamento!`);
    } catch (err) {
      console.error("Erro ao aprovar candidato:", err);
      alert("Erro ao aprovar candidato. Tente novamente.");
    }
  };

  const handleConfirmarReprovacao = async (candidatoId, motivo) => {
    try {
      const { error } = await supabase
        .from("corretores")
        .update({
          etapa: "reprovados",
          motivo_reprovacao: motivo,
          data_reprovacao: new Date().toISOString().split("T")[0],
        })
        .eq("id", candidatoId);

      if (error) throw error;

      await carregarDados();
      setModalReprovacaoAberto(false);
      setCandidatoParaReprovar(null);
      alert("Candidato reprovado com sucesso!");
    } catch (err) {
      console.error("Erro ao reprovar candidato:", err);
      alert("Erro ao reprovar candidato. Tente novamente.");
    }
  };

  const handleConfirmarAtivacao = async (candidatoId, dataInicio) => {
    console.log("🔥 ATIVANDO CORRETOR - ID:", candidatoId, "Data:", dataInicio);

    try {
      // 1️⃣ Buscar dias de experiência do banco de configurações
      const diasExperiencia = await configuracoesService.getDiasExperiencia();
      console.log(
        `📅 Período de experiência configurado: ${diasExperiencia} dias`,
      );

      // 2️⃣ Calcular data fim da experiência (USA O VALOR DO BANCO!)
      const dataFimExperiencia = new Date(dataInicio);
      dataFimExperiencia.setDate(
        dataFimExperiencia.getDate() + diasExperiencia,
      );
      const dataFimStr = dataFimExperiencia.toISOString().split("T")[0];

      console.log("📅 Data início:", dataInicio);
      console.log("📅 Data fim:", dataFimStr);

      // 3️⃣ ATUALIZAR com APENAS os campos que EXISTEM
      const { error } = await supabase
        .from("corretores")
        .update({
          etapa: "ativos",
          periodoExperiencia: true,
          treinamento_conclusao: dataInicio,
          data_experiencia_fim: dataFimStr,
          // 👇 NÃO USAR NENHUM DESSES:
          // status ❌
          // updated_at ❌
          // data_ativacao ❌
          // periodo_experiencia ❌
          // dias_experiencia ❌
        })
        .eq("id", candidatoId);

      if (error) {
        console.error("❌ Erro no update:", error);
        throw error;
      }

      console.log("✅ Corretor ativado com sucesso!");

      await carregarDados();
      setModalAtivacaoAberto(false);
      setCandidatoParaAtivar(null);

      alert(`✅ Período de experiência iniciado! (${diasExperiencia} dias)`);
    } catch (err) {
      console.error("❌ Erro ao ativar:", err);
      alert("Erro ao ativar corretor: " + err.message);
    }
  };

  const handleVerDetalhesReprovado = (candidato) => {
    alert(`Detalhes de ${candidato.nome}: ${candidato.motivoReprovacao}`);
  };

  // -----------------------------------------
  // FUNÇÕES DE GESTÃO DO TREINAMENTO
  // -----------------------------------------
  // 🚀 INICIAR TREINAMENTO
  const handleIniciarTreinamento = async (candidatoId) => {
    console.log("🔵 FUNÇÃO INICIAR FOI CHAMADA! ID:", candidatoId);

    try {
      // ✅ DATA CORRETA (DO SEU COMPUTADOR) - SEM FUSO!
      const dataLocal = new Date();
      dataLocal.setHours(0, 0, 0, 0); // Zera a hora
      const hoje = dataLocal.toISOString().split("T")[0];

      // ✅ PREVISÃO BASEADA NA DATA CORRETA
      const previsao = new Date(dataLocal);
      previsao.setDate(previsao.getDate() + 15);
      const previsaoStr = previsao.toISOString().split("T")[0];

      console.log("📅 Data que seria salva:", hoje);
      console.log("📅 Previsão:", previsaoStr);
      console.log("🚀 Enviando para Supabase...");

      const { data, error } = await supabase
        .from("corretores")
        .update({
          treinamento_inicio: hoje,
          treinamento_previsao: previsaoStr,
          treinamento_status: "em_andamento",
        })
        .eq("id", candidatoId)
        .select();

      if (error) {
        console.error("❌ ERRO DO SUPABASE:", error);
        throw error;
      }

      console.log("✅ RESPOSTA DO SUPABASE:", data);
      await carregarDados();
      alert("✅ Treinamento iniciado com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao iniciar treinamento:", err);
      alert("Erro ao iniciar treinamento. Tente novamente.");
    }
  };

  // 🆕 PAUSAR - AGORA USA MODAL
  const handlePausarTreinamento = (candidatoId) => {
    const candidato = candidatosPorEtapa.treinamento.find(
      (c) => c.id === candidatoId,
    );

    setCandidatoParaPausa(candidato);
    setModalPausaAberto(true);
  };

  // ✅ CONFIRMAR PAUSA
  const handleConfirmarPausa = async (candidatoId, motivo) => {
    try {
      const { error } = await supabase
        .from("corretores")
        .update({
          treinamento_status: "pausado",
          treinamento_motivo_pausa: motivo,
        })
        .eq("id", candidatoId);

      if (error) throw error;
      await carregarDados();
      setModalPausaAberto(false);
      setCandidatoParaPausa(null);
      alert("✅ Treinamento pausado com sucesso!");
    } catch (err) {
      console.error("Erro ao pausar:", err);
      alert("Erro ao pausar treinamento.");
    }
  };

  // ▶️ RETOMAR
  const handleRetomarTreinamento = async (candidatoId) => {
    try {
      const { error } = await supabase
        .from("corretores")
        .update({ treinamento_status: "em_andamento" })
        .eq("id", candidatoId);

      if (error) throw error;
      await carregarDados();
      alert("✅ Treinamento retomado com sucesso!");
    } catch (err) {
      console.error("Erro ao retomar:", err);
      alert("Erro ao retomar treinamento.");
    }
  };

  // ⏹️ CANCELAR - AGORA USA MODAL
  const handleCancelarTreinamento = (candidatoId) => {
    console.log("🚀 handleCancelarTreinamento chamado", candidatoId);
    const candidato = candidatosPorEtapa.treinamento.find(
      (c) => c.id === candidatoId,
    );
    setCandidatoParaCancelar(candidato);
    setModalCancelamentoAberto(true);
  };

  // ✅ CONFIRMAR CANCELAMENTO
  const handleConfirmarCancelamento = async (candidatoId, motivo) => {
    console.log("1️⃣ handleConfirmarCancelamento chamado", {
      candidatoId,
      motivo,
    });

    try {
      console.log("2️⃣ Enviando para Supabase...");
      const { data, error } = await supabase
        .from("corretores")
        .update({
          treinamento_status: "cancelado",
          treinamento_motivo_pausa: motivo,
        })
        .eq("id", candidatoId)
        .select();

      console.log("3️⃣ Resposta do Supabase:", { data, error });

      if (error) throw error;

      console.log("4️⃣ Dados atualizados, recarregando...");
      await carregarDados();

      console.log("5️⃣ Fechando modal...");
      setModalCancelamentoAberto(false);
      setCandidatoParaCancelar(null);

      alert("❌ Treinamento cancelado.");
    } catch (err) {
      console.error("❌ Erro ao cancelar:", err);
      alert("Erro ao cancelar treinamento.");
    }
  };

  // ✅ CONCLUIR
  const handleConcluirTreinamento = async (candidatoId) => {
    try {
      // Criar data no formato YYYY-MM-DD (sem timezone)
      const hoje = new Date();
      const ano = hoje.getFullYear();
      const mes = String(hoje.getMonth() + 1).padStart(2, "0");
      const dia = String(hoje.getDate()).padStart(2, "0");
      const dataFormatada = `${ano}-${mes}-${dia}`;

      console.log("📅 Concluindo treinamento em:", dataFormatada);

      const { error } = await supabase
        .from("corretores")
        .update({
          treinamento_status: "concluido",
          treinamento_conclusao: dataFormatada, // ← SÓ A DATA!
        })
        .eq("id", candidatoId);

      if (error) throw error;

      await carregarDados();
      alert("✅ Treinamento concluído com sucesso!");
    } catch (err) {
      console.error("Erro ao concluir:", err);
      alert("Erro ao concluir treinamento.");
    }
  };

  const handleAtivarCorretor = async (candidatoId, dataInicio) => {
    try {
      const diasExperiencia = await configuracoesService.getDiasExperiencia();
      const dataFim = new Date(dataInicio);
      dataFim.setDate(dataFim.getDate() + diasExperiencia);
      const dataFimStr = dataFim.toISOString().split("T")[0];

      const { error } = await supabase
        .from("corretores")
        .update({
          etapa: "ativos",
          periodoExperiencia: true, // ← ISSO É CRÍTICO!
          treinamento_conclusao: dataInicio,
          data_experiencia_fim: dataFimStr,
        })
        .eq("id", candidatoId);

      if (error) throw error;
      await carregarDados();
      alert(`✅ Período de experiência iniciado!`);
    } catch (err) {
      console.error("Erro ao ativar:", err);
    }
  };

  // 📁 ARQUIVAR (FUNÇÃO ATUALIZADA)
  const handleArquivar = async (candidatoId) => {
    try {
      const { error } = await supabase
        .from("corretores")
        .update({
          treinamento_status: "arquivado",
          treinamento_conclusao: new Date().toISOString().split("T")[0], // ← ADICIONADO!
        })
        .eq("id", candidatoId);

      if (error) throw error;
      await carregarDados();
      alert("📁 Treinamento arquivado com sucesso!");
    } catch (err) {
      console.error("Erro ao arquivar:", err);
      alert("Erro ao arquivar treinamento.");
    }
  };
  // -----------------------------------------
  // 7. FUNÇÕES PARA ABRIR MODAIS
  // -----------------------------------------
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

  const handleAbrirPerfil = (corretor) => {
    setCorretorSelecionado(corretor);
    setModalPerfilAberto(true);
  };

  const handleAbrirProgresso = (candidato) => {
    setCandidatoProgresso(candidato);
    setModalProgressoAberto(true);
  };

  const handleReprovarEntrevista = (candidato) => {
    setCandidatoParaReprovar(candidato);
    setModalReprovacaoAberto(true);
  };

  const handleAbrirModalAtivacao = (candidato) => {
    setCandidatoParaAtivar(candidato);
    setModalAtivacaoAberto(true);
  };

  const handleAbrirFeedback = (candidato) => {
    setCandidatoParaFeedback(candidato);
    setModalFeedbackAberto(true);
  };

  const handleSalvarFeedback = async (candidatoId, feedback) => {
    if (!candidatoId || !feedback) return;

    try {
      let novaEtapa = "entrevista";
      if (feedback.status === "aprovado") novaEtapa = "treinamento";
      if (feedback.status === "reprovado") novaEtapa = "reprovados";

      // ✅ DATA CORRETA (DO SEU COMPUTADOR)
      const dataLocal = new Date();
      dataLocal.setHours(0, 0, 0, 0);
      const dataFormatada = dataLocal.toISOString().split("T")[0];

      const { error } = await supabase
        .from("corretores")
        .update({
          feedback_nota: feedback.nota,
          feedback_status: feedback.status,
          feedback_observacoes: feedback.observacoes || "",
          feedback_data: dataFormatada, // ← AGORA SIM! ENVIA A DATA!
          etapa: novaEtapa,
          creci_desde: feedback.creci_desde,
          experiencia_anos: feedback.experiencia_anos,
          formacao: feedback.formacao,
        })
        .eq("id", candidatoId);

      if (error) throw error;

      await carregarDados();
      setModalFeedbackAberto(false);
      setCandidatoParaFeedback(null);
      alert("✅ Feedback salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar feedback:", err);
    }
  };
  // 🆕 ABRIR DETALHES DO ARQUIVADO
  const handleAbrirDetalhesArquivado = (candidato) => {
    setCandidatoDetalhes(candidato);
    setModalDetalhesAberto(true);
  };

  const handleFecharModal = () => {
    setModalAgendamentoAberto(false);
    setModalPerfilAberto(false);
    setModalProgressoAberto(false);
    setModalReprovacaoAberto(false);
    setModalAtivacaoAberto(false);
    setModalFeedbackAberto(false);
    setModalPausaAberto(false);
    setModalCancelamentoAberto(false);
    setModalDetalhesAberto(false); // ← ADICIONADO!

    setCandidatoParaAgendar(null);
    setCandidatoParaReprovar(null);
    setCandidatoParaAtivar(null);
    setCandidatoParaFeedback(null);
    setCandidatoParaPausa(null);
    setCandidatoParaCancelar(null);
    setCandidatoDetalhes(null); // ← ADICIONADO!
    setCandidatoProgresso(null);
    setCorretorSelecionado(null);

    setFormAgendamento({
      dataEntrevista: "",
      horarioEntrevista: "",
      entrevistador: "",
      observacoes: "",
    });
    setErrosForm({});
  };
  // -----------------------------------------
  // 8. MEMOIZED DATA
  // -----------------------------------------
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
        dados: candidatosPorEtapa.ativos || [],
        statusColors: statusCorretoresColors,
      };
    } else {
      return {
        tipo: "corretores",
        dados: candidatosPorEtapa.inativos || [],
        statusColors: statusCorretoresColors,
      };
    }
  }, [abaAtiva, etapaCandidato, candidatosPorEtapa]);

  // -----------------------------------------
  // 9. LOADING E ERROR
  // -----------------------------------------
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A24D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Carregando dados...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationCircleIcon
            className={`w-16 h-16 mx-auto mb-4 ${isDark ? "text-red-400" : "text-red-600"}`}
          />
          <h3
            className={`text-lg font-medium ${isDark ? "text-gray-200" : "text-gray-900"} mb-2`}
          >
            Erro ao carregar dados
          </h3>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#C19137]"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // -----------------------------------------
  // 10. FUNÇÕES DE UI
  // -----------------------------------------
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

  const getTotalCandidatos = () => {
    return (
      candidatosPorEtapa.pendentes.length +
      candidatosPorEtapa.entrevista.length +
      candidatosPorEtapa.treinamento.length +
      candidatosPorEtapa.reprovados.length
    );
  };

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

  // -----------------------------------------
  // 11. RENDER CARDS
  // -----------------------------------------

  // ===========================================
  // RENDER CARD PENDENTE
  // ===========================================
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

        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        />

        <div className="mb-2">
          <a
            href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center transition-all duration-200 group ${
              isDark
                ? "text-green-400 hover:text-green-300"
                : "text-green-600 hover:text-green-700"
            }`}
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

        <div
          className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}
        >
          <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-sm truncate">{candidato.email}</span>
        </div>

        <div
          className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
        />

        <div
          className={`flex items-center ${isDark ? "text-gray-400" : "text-gray-500"}`}
        >
          <ClockIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="text-xs">
            Cadastrou:{" "}
            {new Date(candidato.created_at).toLocaleDateString("pt-BR")}
          </span>
        </div>

        {candidato.origem && (
          <div
            className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-600"}`}
          >
            Origem: {candidato.origem}
          </div>
        )}
      </div>

      <div
        className={`px-4 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}`}
      >
        <div className="flex space-x-2">
          <button
            onClick={() => handleAbrirModalAgendamento(candidato)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isDark
                ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
            }`}
          >
            Agendar Entrevista
          </button>
          <button
            onClick={() => handleDelete(candidato.id, "candidato")}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isDark
                ? "bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-800"
                : "bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
            }`}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );

  // ===========================================
  // RENDER CARD ENTREVISTA
  // ===========================================
  const renderCardEntrevista = (candidato) => {
    // Dados de reagendamento
    const foiReagendado = candidato.reagendado || false;
    const numeroReagendamentos = candidato.numero_reagendamentos || 0;
    const dataOriginal = candidato.data_original;
    const horarioOriginal = candidato.horario_original;

    // Dados de feedback
    const temFeedback = candidato.feedback_nota ? true : false;
    const feedbackNota = candidato.feedback_nota || 0;
    const feedbackStatus = candidato.feedback_status || "";
    const feedbackObs = candidato.feedback_observacoes || "";
    // ✅ CORRIGIDO - usa formatarData em vez de new Date()
    const feedbackData = candidato.feedback_data
      ? formatarData(candidato.feedback_data)
      : "";

    // Função para formatar horário
    const formatarHorario = (horario) => {
      if (!horario) return "";
      return horario.split(":").slice(0, 2).join(":");
    };

    // Função para renderizar estrelas no card
    const renderEstrelasCard = (nota) => {
      return (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <StarIconSolid
              key={n}
              className={`w-3 h-3 ${
                n <= nota
                  ? "text-yellow-500"
                  : isDark
                    ? "text-gray-600"
                    : "text-gray-300"
              }`}
            />
          ))}
        </div>
      );
    };

    return (
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
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3
                  className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                >
                  {candidato.nome}
                </h3>

                {/* Badge de Entrevista */}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${etapaCandidatosColors.entrevista}`}
                >
                  Entrevista
                </span>

                {/* Badge de nota (se tiver feedback) */}
                {temFeedback && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      isDark
                        ? "bg-purple-900/30 text-purple-300 border border-purple-800"
                        : "bg-purple-100 text-purple-800 border border-purple-300"
                    }`}
                  >
                    <StarIcon className="w-3 h-3" />
                    {feedbackNota} ★
                  </span>
                )}

                {/* Badge de Reagendamento */}
                {foiReagendado && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      numeroReagendamentos >= 3
                        ? isDark
                          ? "bg-amber-900/30 text-amber-300 border border-amber-800"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                        : isDark
                          ? "bg-blue-900/30 text-blue-300 border border-blue-800"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                    }`}
                  >
                    <CalendarIcon className="w-3 h-3" />
                    {numeroReagendamentos === 1 && "Reagendada 1x"}
                    {numeroReagendamentos === 2 && "Reagendada 2x"}
                    {numeroReagendamentos >= 3 && `⚠️ ${numeroReagendamentos}x`}
                  </span>
                )}
              </div>

              <div
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mb-3`}
              >
                CRECI: {candidato.creci}
              </div>
            </div>
          </div>

          <div
            className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
          />

          {/* Contatos */}
          <div className="mb-2">
            <a
              href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center transition-all duration-200 group ${
                isDark
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }`}
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

          <div
            className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}
          >
            <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{candidato.email}</span>
          </div>

          <div
            className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
          />

          {/* SEÇÃO DE DATAS */}
          <div className="space-y-2">
            {/* Data atual */}
            <div
              className={`flex items-center text-sm ${
                foiReagendado
                  ? isDark
                    ? "text-blue-400"
                    : "text-blue-600 font-medium"
                  : isDark
                    ? "text-gray-400"
                    : "text-gray-600"
              }`}
            >
              {foiReagendado ? (
                <CalendarIcon className="w-4 h-4 mr-2 text-blue-500" />
              ) : (
                <CalendarIcon className="w-4 h-4 mr-2" />
              )}
              <span>
                {foiReagendado ? "Reagendada: " : "Entrevista: "}
                {formatarDataParaExibicao(candidato.data_entrevista)},{" "}
                {formatarHorario(candidato.horario_entrevista)}
              </span>
            </div>

            {/* Data original */}
            {foiReagendado && dataOriginal && (
              <div
                className={`flex items-center text-xs ${
                  isDark ? "text-gray-500" : "text-gray-500"
                } line-through`}
              >
                <CalendarIcon className="w-3 h-3 mr-2 opacity-50" />
                <span>
                  Original: {formatarDataParaExibicao(dataOriginal)},{" "}
                  {formatarHorario(horarioOriginal)}
                </span>
              </div>
            )}

            {/* Seção de Feedback */}
            {temFeedback && (
              <div
                className={`mt-3 p-3 rounded-lg border ${
                  feedbackStatus === "aprovado"
                    ? isDark
                      ? "bg-green-900/20 border-green-800"
                      : "bg-green-50 border-green-200"
                    : feedbackStatus === "banco"
                      ? isDark
                        ? "bg-blue-900/20 border-blue-800"
                        : "bg-blue-50 border-blue-200"
                      : isDark
                        ? "bg-red-900/20 border-red-800"
                        : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                    >
                      ⭐ {feedbackNota}.0
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        feedbackStatus === "aprovado"
                          ? isDark
                            ? "bg-green-900/30 text-green-300"
                            : "bg-green-100 text-green-800"
                          : feedbackStatus === "banco"
                            ? isDark
                              ? "bg-blue-900/30 text-blue-300"
                              : "bg-blue-100 text-blue-800"
                            : isDark
                              ? "bg-red-900/30 text-red-300"
                              : "bg-red-100 text-red-800"
                      }`}
                    >
                      {feedbackStatus === "aprovado" && "✅ Aprovado"}
                      {feedbackStatus === "banco" && "📦 Banco"}
                      {feedbackStatus === "reprovado" && "❌ Reprovado"}
                    </span>
                  </div>
                  <span
                    className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                  >
                    {feedbackData}
                  </span>
                </div>

                {feedbackObs ? (
                  <div className="flex items-start gap-2">
                    <ChatBubbleLeftRightIcon
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        feedbackStatus === "aprovado"
                          ? isDark
                            ? "text-green-400"
                            : "text-green-600"
                          : feedbackStatus === "banco"
                            ? isDark
                              ? "text-blue-400"
                              : "text-blue-600"
                            : isDark
                              ? "text-red-400"
                              : "text-red-600"
                      }`}
                    />
                    <p
                      className={`text-xs ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      } leading-relaxed`}
                    >
                      {feedbackObs}
                    </p>
                  </div>
                ) : (
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    } italic`}
                  >
                    Sem observações adicionais
                  </p>
                )}
              </div>
            )}

            {/* Alerta para muitos reagendamentos */}
            {numeroReagendamentos >= 3 && (
              <div
                className={`flex items-center text-xs mt-1 ${
                  isDark ? "text-amber-400" : "text-amber-600"
                }`}
              >
                <ExclamationCircleIcon className="w-3 h-3 mr-1" />
                <span>
                  ⚠️ Candidato já remarcou {numeroReagendamentos} vezes
                </span>
              </div>
            )}

            {/* Entrevistador */}
            {candidato.entrevistador && (
              <div
                className={`flex items-center text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-2`}
              >
                <UserIcon className="w-4 h-4 mr-2" />
                <span>Com: {candidato.entrevistador}</span>
              </div>
            )}

            {/* Observações da entrevista */}
            {candidato.observacoes && (
              <div
                className={`mt-2 p-3 rounded-lg text-sm ${
                  isDark
                    ? "bg-yellow-900/30 text-yellow-200 border border-yellow-800/50"
                    : "bg-yellow-50 text-yellow-800 border border-yellow-200"
                }`}
              >
                <div className="flex items-start gap-2">
                  <ChatBubbleLeftRightIcon
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isDark ? "text-yellow-400" : "text-yellow-600"
                    }`}
                  />
                  <span>
                    <span className="font-medium">Observações:</span>{" "}
                    {candidato.observacoes}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Botão Feedback (largura total) */}
        <div className="px-4 py-2">
          <button
            onClick={() => handleAbrirFeedback(candidato)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              temFeedback
                ? isDark
                  ? "bg-purple-900/30 text-purple-300 hover:bg-purple-800/40 border border-purple-800"
                  : "bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300"
                : isDark
                  ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/40 border border-blue-800"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300"
            }`}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4" />
            {temFeedback ? "Ver Feedback" : "Registrar Feedback"}
          </button>
        </div>

        {/* Botão Reagendar (largura total) - Vermelho */}
        <div className="px-4 py-2 pb-3">
          <button
            onClick={() => handleAbrirModalAgendamento(candidato)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isDark
                ? "bg-red-900/30 text-red-300 hover:bg-red-800/40 border border-red-800"
                : "bg-red-100 text-red-800 hover:bg-red-200 border border-red-300"
            }`}
          >
            <CalendarIcon className="w-4 h-4" />
            {foiReagendado ? "Reagendar Novamente" : "Reagendar Entrevista"}
          </button>
        </div>
      </div>
    );
  };

  // ===========================================
  // RENDER CARD TREINAMENTO
  // ===========================================
  const renderCardTreinamento = (candidato) => {
    if (!candidato) return null;

    const checkpoints = candidato.checkpoints_treinamento || {
      modulo1: false,
      modulo2: false,
      modulo3: false,
      modulo4: false,
      modulo5: false,
    };

    const atributos = candidato.atributos_treinamento || {
      demonstrouInteresse: false,
      temProposito: false,
      conheceMercado: false,
      disponibilidadeHorario: false,
      veiculoProprio: false,
      experienciaVendas: false,
      comunicacao: false,
      eticaProfissional: false,
      trabalhoEquipe: false,
      metasAmbiciosas: false,
    };

    const progresso = candidato.progresso_treinamento ?? 0;
    const progressoExibido = `${progresso}%`;
    const modulosConcluidos = Object.values(checkpoints).filter(Boolean).length;
    const atributosConcluidos = Object.values(atributos).filter(Boolean).length;

    return (
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
          {/* Cabeçalho do card */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
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

                {/* Badge de nota (se tiver feedback) */}
                {candidato.feedback_nota && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      isDark
                        ? "bg-purple-900/30 text-purple-300 border border-purple-800"
                        : "bg-purple-100 text-purple-800 border border-purple-300"
                    }`}
                  >
                    <StarIcon className="w-3 h-3" />
                    {candidato.feedback_nota} ★
                  </span>
                )}
              </div>
              <div
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mb-3`}
              >
                CRECI: {candidato.creci}
              </div>
            </div>
          </div>

          {/* Linha divisória após cabeçalho */}
          <div
            className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
          />

          {/* Contatos */}
          <div className="mb-2">
            <a
              href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center transition-all duration-200 group ${
                isDark
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }`}
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

          <div
            className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}
          >
            <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{candidato.email}</span>
          </div>

          {/* Linha divisória após contatos */}
          <div
            className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
          />

          {/* ===== SEÇÃO 1: FEEDBACK DA ENTREVISTA ===== */}
          <div className="mb-4">
            <h4
              className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              📋 Feedback da Entrevista
            </h4>
            <FeedbackCompacto candidato={candidato} isDark={isDark} />
          </div>
          {/* ===== 🆕 NOVA SEÇÃO: INFORMAÇÕES COMPLEMENTARES ===== */}
          {(candidato.creci_desde ||
            candidato.experiencia_anos ||
            candidato.formacao) && (
            <div className="mb-4">
              <h4
                className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                  isDark ? "text-gray-500" : "text-gray-500"
                }`}
              >
                📊 Perfil do Candidato
              </h4>
              <div
                className={`p-3 rounded-lg border ${
                  isDark
                    ? "bg-gray-700/30 border-gray-600"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="space-y-2">
                  {candidato.creci_desde && (
                    <div className="flex items-start gap-2">
                      <DocumentTextIcon
                        className={`w-4 h-4 mt-0.5 ${
                          isDark ? "text-blue-400" : "text-blue-600"
                        }`}
                      />
                      <p
                        className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        <span className="font-medium">CRECI desde:</span>{" "}
                        {new Date(candidato.creci_desde).toLocaleDateString(
                          "pt-BR",
                        )}
                      </p>
                    </div>
                  )}

                  {candidato.experiencia_anos && (
                    <div className="flex items-start gap-2">
                      <BriefcaseIcon
                        className={`w-4 h-4 mt-0.5 ${
                          isDark ? "text-green-400" : "text-green-600"
                        }`}
                      />
                      <p
                        className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        <span className="font-medium">Experiência:</span>{" "}
                        {candidato.experiencia_anos}{" "}
                        {candidato.experiencia_anos === 1 ? "ano" : "anos"}
                      </p>
                    </div>
                  )}

                  {candidato.formacao && (
                    <div className="flex items-start gap-2">
                      <AcademicCapIcon
                        className={`w-4 h-4 mt-0.5 ${
                          isDark ? "text-purple-400" : "text-purple-600"
                        }`}
                      />
                      <p
                        className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        <span className="font-medium">Formação:</span>{" "}
                        {candidato.formacao === "ensino_medio" &&
                          "Ensino Médio"}
                        {candidato.formacao === "superior_incompleto" &&
                          "Superior Incompleto"}
                        {candidato.formacao === "superior_completo" &&
                          "Superior Completo"}
                        {candidato.formacao === "pos_graduacao" &&
                          "Pós-graduação"}
                        {candidato.formacao === "mestrado" && "Mestrado"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ===== DIVISÓRIA ENTRE AS SEÇÕES ===== */}
          <div
            className={`w-full h-px ${
              isDark ? "bg-gray-700" : "bg-gray-200"
            } my-4`}
          />

          {/* ===== SEÇÃO 2: ACOMPANHAMENTO DO TREINAMENTO ===== */}
          <div>
            <h4
              className={`text-xs font-semibold uppercase tracking-wider mb-2 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              🎯 Acompanhamento do Treinamento
            </h4>
            <CronogramaTreinamento
              candidato={candidato}
              isDark={isDark}
              onIniciar={handleIniciarTreinamento}
              onPausar={handlePausarTreinamento}
              onRetomar={handleRetomarTreinamento}
              onCancelar={handleCancelarTreinamento}
              onConcluir={handleConcluirTreinamento}
              onAtivar={handleAtivarCorretor}
              onArquivar={handleArquivar}
            />
          </div>
        </div>

        {/* BOTÕES DE AÇÃO */}
        <div
          className={`px-4 py-3 border-t ${
            isDark
              ? "border-gray-700 bg-gray-800/70"
              : "border-gray-200 bg-gray-50/80"
          }`}
        >
          <div className="flex space-x-2">
            <button
              onClick={() => handleAbrirProgresso(candidato)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/40 border border-blue-800"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-300"
              }`}
            >
              <AcademicCapIcon className="w-4 h-4" />
              Ver Progresso
            </button>

            <button
              onClick={() => handleAbrirModalAtivacao(candidato)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                isDark
                  ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                  : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
              }`}
            >
              <CheckCircleIcon className="w-4 h-4" />
              Ativar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ===========================================
  // RENDER CARD REPROVADO
  // ===========================================
  const renderCardReprovado = (candidato) => {
    // Dados de feedback
    const temFeedback = candidato.feedback_nota ? true : false;
    const feedbackNota = candidato.feedback_nota || 0;
    const feedbackStatus = candidato.feedback_status || "";
    const feedbackObs = candidato.feedback_observacoes || "";
    // ✅ CORRIGIDO - usa formatarData
    const feedbackData = candidato.feedback_data
      ? formatarData(candidato.feedback_data)
      : "";

    // Função para renderizar estrelas no card
    const renderEstrelasCard = (nota) => {
      return (
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <StarIconSolid
              key={n}
              className={`w-3 h-3 ${
                n <= nota
                  ? "text-yellow-500"
                  : isDark
                    ? "text-gray-600"
                    : "text-gray-300"
              }`}
            />
          ))}
        </div>
      );
    };

    return (
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
              <div className="flex items-center gap-2 mb-1 flex-wrap">
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

                {/* Badge de nota (se tiver feedback) */}
                {temFeedback && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${
                      isDark
                        ? "bg-purple-900/30 text-purple-300 border border-purple-800"
                        : "bg-purple-100 text-purple-800 border border-purple-300"
                    }`}
                  >
                    <StarIcon className="w-3 h-3" />
                    {feedbackNota} ★
                  </span>
                )}
              </div>
              <div
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} mb-3`}
              >
                CRECI: {candidato.creci}
              </div>
            </div>
          </div>

          <div
            className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
          />

          {/* Contatos */}
          <div className="mb-2">
            <a
              href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center transition-all duration-200 group ${
                isDark
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }`}
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

          <div
            className={`flex items-center ${isDark ? "text-gray-300" : "text-gray-600"} mb-3`}
          >
            <EnvelopeIcon className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="text-sm truncate">{candidato.email}</span>
          </div>

          <div
            className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
          />

          {/* 🆕 SEÇÃO DE FEEDBACK - MESMO LAYOUT DO APROVADO */}
          {temFeedback && (
            <div
              className={`mt-3 p-3 rounded-lg border ${
                isDark
                  ? "bg-red-900/20 border-red-800"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {/* Linha superior com nota e data - IGUAL AO APROVADO */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-700"}`}
                  >
                    ⭐ {feedbackNota}.0
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      isDark
                        ? "bg-red-900/30 text-red-300"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    ❌ Reprovado
                  </span>
                </div>
                <span
                  className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
                >
                  {feedbackData}
                </span>
              </div>

              {/* Observações - IGUAL AO APROVADO */}
              {feedbackObs ? (
                <div className="flex items-start gap-2">
                  <ChatBubbleLeftRightIcon
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isDark ? "text-red-400" : "text-red-600"
                    }`}
                  />
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    } leading-relaxed`}
                  >
                    {feedbackObs}
                  </p>
                </div>
              ) : (
                <p
                  className={`text-xs ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  } italic`}
                >
                  Sem observações adicionais
                </p>
              )}
            </div>
          )}

          {/* Motivo original da reprovação (opcional, pode remover se quiser) */}
          {candidato.motivo_reprovacao && (
            <div className="mt-3 space-y-2">
              <div
                className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Motivo original:
              </div>
              <div
                className={`px-3 py-2 rounded-lg border text-sm ${
                  isDark
                    ? "bg-red-900/30 text-red-200 border-red-800/50"
                    : "bg-red-50 text-red-800 border-red-200"
                }`}
              >
                <div className="flex items-start">
                  <DocumentTextIcon
                    className={`w-4 h-4 mr-2 flex-shrink-0 ${isDark ? "text-red-300" : "text-red-600"}`}
                  />
                  <span>{candidato.motivo_reprovacao}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`px-4 py-3 border-t ${isDark ? "border-gray-700 bg-gray-800/70" : "border-gray-200 bg-gray-50/80"}`}
        >
          <button
            onClick={() => handleVerDetalhesReprovado(candidato)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isDark
                ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border border-amber-800/50"
                : "bg-[#D4A24D] text-white hover:bg-[#C19137] border border-[#D4A24D]"
            }`}
          >
            <EyeIcon className="w-4 h-4" />
            Ver Detalhes
          </button>
        </div>
      </div>
    );
  };

  // ===========================================
  // RENDER CARD ARQUIVADO - VERSÃO OTIMIZADA
  // ===========================================
  const renderCardArquivado = (candidato) => {
    // Formatar data de arquivamento
    const dataArquivamento = candidato.treinamento_conclusao
      ? new Date(candidato.treinamento_conclusao).toLocaleDateString("pt-BR")
      : new Date().toLocaleDateString("pt-BR");

    // Dados resumidos do treinamento
    const progresso = candidato.progresso_treinamento || 0;
    const modulosConcluidos = Object.values(
      candidato.checkpoints_treinamento || {},
    ).filter(Boolean).length;
    const atributosConcluidos = Object.values(
      candidato.atributos_treinamento || {},
    ).filter(Boolean).length;

    // Calcular dias de treinamento até o cancelamento
    const calcularDiasTreinamento = () => {
      if (candidato.treinamento_inicio && candidato.treinamento_conclusao) {
        const inicio = new Date(candidato.treinamento_inicio);
        const fim = new Date(candidato.treinamento_conclusao);
        const diffTime = Math.abs(fim - inicio);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      return null;
    };

    const diasTreinamento = calcularDiasTreinamento();

    return (
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
          {/* Cabeçalho */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3
                className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {candidato.nome}
              </h3>
              <p
                className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
              >
                CRECI: {candidato.creci}
              </p>
            </div>
            <span className="px-2 py-1 bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
              📁 Arquivado
            </span>
          </div>

          {/* Linha divisória após cabeçalho */}
          <div
            className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
          />

          {/* Contatos */}
          <div className="mb-2">
            <a
              href={criarLinkWhatsApp(candidato.telefone, candidato.nome)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center transition-all duration-200 group ${
                isDark
                  ? "text-green-400 hover:text-green-300"
                  : "text-green-600 hover:text-green-700"
              }`}
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

          {/* Linha divisória após contatos */}
          <div
            className={`h-px w-full ${isDark ? "bg-gray-700" : "bg-gray-200"} my-3`}
          />

          {/* 📅 ARQUIVADO EM */}
          <div className="flex items-center gap-1 mb-3">
            <span
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              📅
            </span>
            <span
              className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
            >
              Arquivado em:
            </span>
            <span
              className={`text-sm font-semibold ml-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {dataArquivamento}
            </span>
          </div>

          {/* ⚠️ MOTIVO */}
          {candidato.treinamento_motivo_pausa && (
            <div className="flex items-start gap-2 mb-4">
              <ExclamationCircleIcon
                className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                  isDark ? "text-red-400" : "text-red-600"
                }`}
              />
              <p
                className={`text-xs ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                <span className="font-semibold">Motivo:</span>{" "}
                {candidato.treinamento_motivo_pausa}
              </p>
            </div>
          )}

          {/* BOX RESUMO DO TREINAMENTO */}
          <div
            className={`p-3 rounded-lg border mb-3 ${
              isDark
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1">
                <span className="text-base">⏹️</span>
                <span
                  className={`text-xs font-medium ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Cancelado após
                </span>
              </div>
              <span
                className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {diasTreinamento || 0} dias
              </span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span
                  className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  📊
                </span>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  {progresso}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  📚
                </span>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  {modulosConcluidos}/5
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span
                  className={`${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  ⭐
                </span>
                <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                  {atributosConcluidos}/10
                </span>
              </div>
            </div>
          </div>

          {/* BOTÃO VER DETALHES */}
          <button
            onClick={() => handleAbrirDetalhesArquivado(candidato)}
            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 border ${
              isDark
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600 border-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200"
            }`}
          >
            <EyeIcon className="w-4 h-4" />
            Ver detalhes completos
          </button>
        </div>
      </div>
    );
  };

  // ===========================================
  // DEBUG - REMOVER DEPOIS
  // ===========================================
  if (typeof window !== "undefined") {
    window.debugCorretores = () => ({
      candidatosPorEtapa: candidatosPorEtapa,
      dadosAtuais: dadosAtuais,
      ativos: candidatosPorEtapa.ativos,
      treinamento: candidatosPorEtapa.treinamento,
      primeiroAtivo: candidatosPorEtapa.ativos[0],
      primeiroTreinamento: candidatosPorEtapa.treinamento[0],
    });
  }

  // -----------------------------------------
  // 12. RENDER PRINCIPAL
  // -----------------------------------------
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

        <div className="flex space-x-3 mt-4 sm:mt-0">
          {/* Candidatos */}
          <button
            onClick={() => setAbaAtiva("candidatos")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
              isDark
                ? abaAtiva === "candidatos"
                  ? "bg-amber-800/50 text-amber-200 border border-amber-700"
                  : "bg-amber-900/30 text-amber-300 border border-amber-800 hover:bg-amber-800/40 hover:text-amber-200"
                : abaAtiva === "candidatos"
                  ? "bg-amber-200 text-amber-900 border border-amber-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 hover:text-amber-900"
            } flex items-center justify-center shadow-sm hover:shadow`}
          >
            <UserGroupIcon className="w-5 h-5 mr-2" />
            Candidatos ({getTotalCandidatos()})
          </button>

          {/* Ativos */}
          <button
            onClick={() => setAbaAtiva("ativos")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
              isDark
                ? abaAtiva === "ativos"
                  ? "bg-green-800/50 text-green-200 border border-green-700"
                  : "bg-green-900/30 text-green-300 border border-green-800 hover:bg-green-800/40 hover:text-green-200"
                : abaAtiva === "ativos"
                  ? "bg-green-200 text-green-900 border border-green-300"
                  : "bg-green-100 text-green-800 border border-green-300 hover:bg-green-200 hover:text-green-900"
            } flex items-center justify-center shadow-sm hover:shadow`}
          >
            <EyeIcon className="w-5 h-5 mr-2" />
            Ativos ({candidatosPorEtapa.ativos.length})
          </button>

          {/* Inativos */}
          <button
            onClick={() => setAbaAtiva("inativos")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
              isDark
                ? abaAtiva === "inativos"
                  ? "bg-red-800/50 text-red-200 border border-red-700"
                  : "bg-red-900/30 text-red-300 border border-red-800 hover:bg-red-800/40 hover:text-red-200"
                : abaAtiva === "inativos"
                  ? "bg-red-200 text-red-900 border border-red-300"
                  : "bg-red-100 text-red-800 border border-red-300 hover:bg-red-200 hover:text-red-900"
            } flex items-center justify-center shadow-sm hover:shadow`}
          >
            <EyeSlashIcon className="w-5 h-5 mr-2" />
            Inativos ({candidatosPorEtapa.inativos.length})
          </button>

          {/* Arquivados */}
          <button
            onClick={() => setAbaAtiva("arquivados")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium ${
              isDark
                ? abaAtiva === "arquivados"
                  ? "bg-gray-700 text-gray-200 border border-gray-600"
                  : "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700"
                : abaAtiva === "arquivados"
                  ? "bg-gray-200 text-gray-900 border border-gray-300"
                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
            } flex items-center justify-center shadow-sm hover:shadow`}
          >
            <ArchiveBoxIcon className="w-5 h-5 mr-2" />
            Arquivados ({candidatosPorEtapa.arquivados?.length || 0})
          </button>

          {/* Novo Corretor */}
          <button
            onClick={() => navigate("/admin/corretores/novo")}
            className={`flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200 font-medium border ${
              isDark
                ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 border-amber-800/50"
                : "bg-[#D4A24D] text-white hover:bg-[#C19137] border-[#D4A24D]"
            } shadow-sm hover:shadow`}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Corretor
          </button>
        </div>
      </div>

      {/* Seção Processo Seletivo */}
      {abaAtiva === "candidatos" && (
        <div
          className={`${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-xl shadow-sm border p-6 mb-6 mx-6`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0 mb-6">
            <div className="flex-1">
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                } mb-2`}
              >
                Processo Seletivo
              </h2>
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Gerenciar candidatos do cadastro à contratação
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`text-base font-semibold ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                <span className="font-bold">Total: </span>
                <span className="font-normal">
                  {getTotalCandidatos()} candidatos
                </span>
              </div>
              <Button variant="outline">Exportar Lista</Button>
            </div>
          </div>

          {renderEtapasCandidatos()}
        </div>
      )}

      {/* Search and Filters */}
      {abaAtiva !== "candidatos" && (
        <div
          className={`${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-xl shadow-sm border p-6 mb-6 mx-6`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <input
                  type="text"
                  placeholder={`Buscar ${abaAtiva === "candidatos" ? "candidatos" : "corretores"}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-4 pr-10 py-2.5 rounded-lg border ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                      : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#D4A24D] focus:ring-[#D4A24D]/30"
                  } focus:outline-none focus:ring-2 transition-colors duration-200`}
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
                className={`px-4 py-2.5 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-200"
                    : "bg-white border-gray-300 text-gray-900"
                } border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200`}
              >
                <option value="">Todos os Status</option>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
                <option value="ferias">Férias</option>
                <option value="experiencia">Período de Experiência</option>
              </select>
              <Button variant="outline">Exportar Lista</Button>
            </div>
          </div>
        </div>
      )}

      {/* CONTEÚDO DINÂMICO */}
      <div className="px-6">
        {/* SÓ MOSTRA O TÍTULO SE NÃO FOR ARQUIVADOS */}
        {abaAtiva !== "arquivados" && (
          <div className="flex items-center justify-between mb-4">
            {renderTituloAba()}
          </div>
        )}

        {/* TRATAMENTO PARA ARQUIVADOS */}
        {abaAtiva === "arquivados" ? (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-4">
              <h2
                className={`text-xl font-semibold ${
                  isDark ? "text-gray-200" : "text-gray-800"
                }`}
              >
                📁 Candidatos Arquivados
              </h2>
              <span
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Total: {candidatosPorEtapa.arquivados?.length || 0}
              </span>
            </div>

            {candidatosPorEtapa.arquivados?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidatosPorEtapa.arquivados.map((candidato) => (
                  <div key={candidato.id}>{renderCardArquivado(candidato)}</div>
                ))}
              </div>
            ) : (
              <div
                className={`text-center py-12 bg-white dark:bg-gray-800 rounded-xl border ${
                  isDark ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <ArchiveBoxIcon className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3
                  className={`text-lg font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  } mb-2`}
                >
                  Nenhum candidato arquivado
                </h3>
                <p className={`${isDark ? "text-gray-500" : "text-gray-600"}`}>
                  Candidatos cancelados no treinamento aparecerão aqui após
                  arquivados.
                </p>
              </div>
            )}
          </div>
        ) : dadosAtuais.dados.length === 0 ? (
          <div
            className={`text-center py-12 ${
              isDark ? "bg-gray-800" : "bg-white"
            } rounded-xl border ${
              isDark ? "border-gray-700" : "border-gray-200"
            }`}
          >
            <div
              className={`w-16 h-16 mx-auto mb-4 ${
                isDark ? "text-gray-600" : "text-gray-400"
              }`}
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
              className={`text-lg font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              } mb-2`}
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
              candidatosPorEtapa.pendentes.map((candidato) => (
                <div key={candidato.id}>{renderCardPendente(candidato)}</div>
              ))}

            {/* CARDS ENTREVISTA */}
            {abaAtiva === "candidatos" &&
              etapaCandidato === "entrevista" &&
              candidatosPorEtapa.entrevista.map((candidato) => (
                <div key={candidato.id}>{renderCardEntrevista(candidato)}</div>
              ))}

            {/* CARDS TREINAMENTO */}
            {abaAtiva === "candidatos" &&
              etapaCandidato === "treinamento" &&
              candidatosPorEtapa.treinamento.map((candidato) => (
                <div key={candidato.id}>{renderCardTreinamento(candidato)}</div>
              ))}

            {/* CARDS REPROVADOS */}
            {abaAtiva === "candidatos" &&
              etapaCandidato === "reprovados" &&
              candidatosPorEtapa.reprovados.map((candidato) => (
                <div key={candidato.id}>{renderCardReprovado(candidato)}</div>
              ))}

            {/* CARDS CORRETORES (ATIVOS/INATIVOS) */}
            {abaAtiva !== "candidatos" &&
              dadosAtuais.dados.map((corretor) => {
                // CARD PARA ATIVOS - LAYOUT CORRIGIDO
                if (abaAtiva === "ativos") {
                  const diasPassados =
                    corretor.periodoExperiencia &&
                    corretor.treinamento_conclusao
                      ? calcularDiasPassados(corretor.treinamento_conclusao)
                      : 0;
                  const diasTotais = 90;
                  const diasRestantes = Math.max(0, diasTotais - diasPassados);
                  const progresso =
                    corretor.periodoExperiencia &&
                    corretor.treinamento_conclusao &&
                    corretor.data_experiencia_fim
                      ? calcularProgressoExperiencia(corretor)
                      : 0;

                  return (
                    <div
                      key={corretor.id}
                      className={`${
                        isDark
                          ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                          : "bg-white border-gray-200 hover:bg-gray-50"
                      } rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col h-full`}
                    >
                      {/* CABEÇALHO - COM ATIVO E NOTA JUNTOS */}
                      <div className="p-6 pb-4">
                        <div className="flex items-center justify-between">
                          <h3
                            className={`text-xl font-bold ${
                              isDark ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {corretor.nome}
                          </h3>

                          {/* GRUPO: ATIVO + NOTA */}
                          <div className="flex items-center gap-2">
                            {/* ATIVO - SÓ PARA ATIVOS */}
                            {!corretor.periodoExperiencia && (
                              <div
                                className={`flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full`}
                              >
                                <CheckCircleIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                                <span
                                  className={`text-[10px] font-medium uppercase tracking-wider ${
                                    isDark ? "text-green-400" : "text-green-700"
                                  }`}
                                >
                                  ativo
                                </span>
                              </div>
                            )}

                            {/* NOTA - SEMPRE PRESENTE */}
                            <div
                              className={`flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-full`}
                            >
                              <StarIconSolid className="w-3.5 h-3.5 text-amber-500" />
                              <span
                                className={`text-xs font-semibold ${
                                  isDark ? "text-amber-400" : "text-amber-600"
                                }`}
                              >
                                {corretor.rating || 4.8}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* CRECI */}
                        <p
                          className={`text-sm mt-1 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          CRECI: {corretor.creci}
                        </p>
                      </div>

                      {/* SEÇÃO DE EXPERIÊNCIA - SÓ PARA EXPERIÊNCIA */}
                      {corretor.periodoExperiencia && (
                        <>
                          {/* BADGE DE EXPERIÊNCIA - AJUSTADA */}
                          <div className="px-6 pt-2">
                            <div
                              className={`inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800`}
                            >
                              <div className="relative">
                                <div className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping opacity-75"></div>
                              </div>
                              <span
                                className={`text-[10px] font-semibold uppercase tracking-wider leading-none ${
                                  isDark ? "text-amber-400" : "text-amber-700"
                                }`}
                              >
                                EM PERÍODO DE EXPERIÊNCIA
                              </span>
                            </div>
                          </div>

                          {/* BARRA DE PROGRESSO */}
                          {corretor.data_experiencia_fim &&
                            corretor.treinamento_conclusao && (
                              <div className="px-6 py-3">
                                <div className="flex items-center justify-between mb-1">
                                  <span
                                    className={`text-xs ${
                                      isDark ? "text-gray-400" : "text-gray-600"
                                    }`}
                                  >
                                    ⏱️ {diasPassados} de 90 dias (
                                    {diasRestantes} restantes)
                                  </span>
                                  <span
                                    className={`text-xs font-semibold ${
                                      isDark
                                        ? "text-amber-400"
                                        : "text-amber-600"
                                    }`}
                                  >
                                    {progresso}%
                                  </span>
                                </div>
                                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-amber-500 rounded-full"
                                    style={{ width: `${progresso}%` }}
                                  />
                                </div>
                              </div>
                            )}
                        </>
                      )}

                      {/* DIVISÓRIA */}
                      <div
                        className={`h-px mx-6 ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />

                      {/* DATAS DE REGISTRO */}
                      <div className="px-6 py-2">
                        <div
                          className={`text-xs space-y-0.5 ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <div>
                            CRECI desde:{" "}
                            {formatarData(corretor.creci_desde) || "09/09/2014"}
                          </div>
                          <div>
                            Na imobiliária desde:{" "}
                            {formatarData(corretor.treinamento_conclusao) ||
                              "19/02/2026"}
                          </div>
                        </div>
                      </div>

                      {/* DIVISÓRIA */}
                      <div
                        className={`h-px mx-6 ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />

                      {/* CONTATOS */}
                      <div className="px-6 py-3 space-y-2">
                        <div
                          className={`flex items-center ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <EnvelopeIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="text-sm truncate">
                            {corretor.email}
                          </span>
                        </div>
                        <a
                          href={`https://wa.me/55${corretor.telefone?.replace(
                            /\D/g,
                            "",
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center ${
                            isDark
                              ? "text-green-400 hover:text-green-300"
                              : "text-green-600 hover:text-green-700"
                          } transition-colors`}
                        >
                          <PhoneIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="text-sm">{corretor.telefone}</span>
                        </a>
                      </div>

                      {/* DIVISÓRIA */}
                      <div
                        className={`h-px mx-6 ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />

                      {/* MÉTRICAS - COM FONTE REDUZIDA */}
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-center">
                            <div
                              className={`text-2xl font-bold ${
                                isDark ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              {corretor.imoveis || 0}
                            </div>
                            <div
                              className={`text-[11px] font-medium mt-1 ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              IMÓVEIS
                            </div>
                          </div>

                          <div
                            className={`w-px h-12 ${
                              isDark ? "bg-gray-700" : "bg-gray-300"
                            }`}
                          />

                          <div className="flex-1 text-center">
                            <div
                              className={`text-2xl font-bold ${
                                isDark ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              {corretor.vendas_mes || 0}
                            </div>
                            <div
                              className={`text-[11px] font-medium mt-1 whitespace-nowrap ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              VENDAS (MÊS)
                            </div>
                          </div>

                          <div
                            className={`w-px h-12 ${
                              isDark ? "bg-gray-700" : "bg-gray-300"
                            }`}
                          />

                          <div className="flex-1 text-center">
                            <div
                              className={`text-2xl font-bold ${
                                isDark ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              {corretor.leads || 0}
                            </div>
                            <div
                              className={`text-[11px] font-medium mt-1 ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              LEADS
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* PONTUAÇÃO */}
                      <div className="px-6 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            Pontuação
                          </span>
                          <span
                            className={`text-xs font-medium ${
                              isDark ? "text-amber-400" : "text-amber-600"
                            }`}
                          >
                            {corretor.pontuacao || 0} pts
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isDark ? "bg-[#D4A24D]" : "bg-[#D4A24D]"
                            }`}
                            style={{
                              width: `${Math.round(
                                ((corretor.pontuacao || 0) /
                                  (corretor.meta || 1000)) *
                                  100,
                              )}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-end mt-1">
                          <span
                            className={`text-xs ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}
                          >
                            Meta: {corretor.meta || 1000} pts
                          </span>
                        </div>
                      </div>

                      {/* DIVISÓRIA ANTES DOS BOTÕES */}
                      <div
                        className={`h-px mx-6 ${
                          isDark ? "bg-gray-700" : "bg-gray-200"
                        }`}
                      />

                      {/* BOTÕES DE AÇÃO - NO RODAPÉ */}
                      <div
                        className={`px-6 py-4 mt-auto ${
                          isDark ? "bg-gray-800/70" : "bg-gray-50/80"
                        } flex justify-end space-x-3`}
                      >
                        <button
                          onClick={() =>
                            navigate(`/admin/corretores/editar/${corretor.id}`)
                          }
                          className={`p-2.5 rounded-lg ${
                            isDark
                              ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/50"
                              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          }`}
                          title="Editar"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(corretor.id, "corretor")}
                          className={`p-2.5 rounded-lg ${
                            isDark
                              ? "bg-red-900/40 text-white hover:bg-red-800/60"
                              : "bg-red-600 text-white hover:bg-red-700"
                          }`}
                          title="Excluir"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAbrirPerfil(corretor)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            isDark
                              ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30"
                              : "bg-[#D4A24D] text-white hover:bg-[#C19137]"
                          }`}
                        >
                          Ver Perfil
                        </button>
                      </div>
                    </div>
                  );
                }

                // CARD PARA INATIVOS (MANTÉM O ORIGINAL)
                return (
                  <div
                    key={corretor.id}
                    className={`${
                      isDark
                        ? "bg-gray-800 border-gray-700 hover:bg-gray-750"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    } rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200`}
                  >
                    {/* CARD INATIVO ORIGINAL */}
                    <div
                      className={`p-6 border-b ${
                        isDark ? "border-gray-700" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={`text-lg font-semibold ${
                              isDark ? "text-gray-100" : "text-gray-900"
                            }`}
                          >
                            {corretor.nome}
                          </h3>
                          <div className="flex items-center mt-2 space-x-2 flex-wrap gap-y-2">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                                isDark
                                  ? "bg-red-900/30 text-red-300 border border-red-800"
                                  : "bg-red-100 text-red-800 border border-red-300"
                              }`}
                            >
                              Inativo
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 text-xs">
                        <div
                          className={`flex items-center ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <span className="font-medium mr-1">Período:</span>{" "}
                          {corretor.naImobiliariaDesde}
                        </div>
                        <div
                          className={`flex items-center ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          } mt-1`}
                        >
                          <span className="font-medium mr-1">Motivo:</span>{" "}
                          {corretor.motivoInativacao}
                        </div>
                        <div
                          className={`flex items-center ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          } mt-1`}
                        >
                          <span className="font-medium mr-1">Inativo há:</span>{" "}
                          {corretor.inativoHa}
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="space-y-4">
                        <div
                          className={`flex items-center ${
                            isDark ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          <EnvelopeIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="truncate">{corretor.email}</span>
                        </div>
                        <a
                          href={`https://wa.me/55${corretor.telefone?.replace(
                            /\D/g,
                            "",
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center ${
                            isDark
                              ? "text-green-400 hover:text-green-300"
                              : "text-green-600 hover:text-green-700"
                          } transition-colors`}
                        >
                          <PhoneIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="text-sm">{corretor.telefone}</span>
                        </a>
                        <div
                          className={`text-sm ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          CRECI: {corretor.creci}
                        </div>
                      </div>

                      <div
                        className={`mt-6 pt-6 border-t ${
                          isDark ? "border-gray-700" : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div
                              className={`text-lg font-semibold ${
                                isDark ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              {corretor.imoveis}
                            </div>
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Imóveis
                            </div>
                          </div>
                          <div
                            className={`h-12 w-px ${
                              isDark ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          />
                          <div className="text-center">
                            <div
                              className={`text-lg font-semibold ${
                                isDark ? "text-gray-200" : "text-gray-700"
                              }`}
                            >
                              {corretor.ultimasVendas || "-"}
                            </div>
                            <div
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              Últimas Vendas
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`px-6 py-4 ${
                        isDark
                          ? "bg-gray-800/70 border-gray-700"
                          : "bg-gray-50/80 border-gray-200"
                      } border-t flex justify-end space-x-3`}
                    >
                      <button
                        onClick={() =>
                          navigate(`/admin/corretores/editar/${corretor.id}`)
                        }
                        className={`p-3 rounded-lg transition-all duration-200 ${
                          isDark
                            ? "bg-blue-900/30 text-blue-300 hover:bg-blue-800/50 hover:text-blue-200 border border-blue-800/50"
                            : "bg-blue-100 text-blue-600 hover:bg-blue-200 hover:text-blue-700 border border-blue-200"
                        } flex items-center justify-center shadow-sm hover:shadow`}
                        title="Editar"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(corretor.id, "corretor")}
                        className={`p-3 rounded-lg transition-all duration-200 ${
                          isDark
                            ? "bg-red-900/40 text-white hover:bg-red-800/60 hover:text-red-100 border border-red-800/50"
                            : "bg-red-600 text-white hover:bg-red-700 hover:text-white border border-red-600"
                        } flex items-center justify-center shadow-sm hover:shadow`}
                        title="Excluir"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleAbrirPerfil(corretor)}
                        className={`px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                          isDark
                            ? "bg-[#D4A24D]/20 text-amber-200 hover:bg-[#D4A24D]/30 hover:text-amber-100 border border-amber-800/50"
                            : "bg-[#D4A24D] text-white hover:bg-[#C19137] hover:text-white border border-[#D4A24D]"
                        } flex items-center justify-center shadow-sm hover:shadow whitespace-nowrap`}
                      >
                        Ver Perfil
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>

      {/* Performance Summary */}
      {abaAtiva === "ativos" && (
        <div
          className={`mt-8 ${
            isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          } rounded-xl shadow-sm border p-6 mx-6 mb-6`}
        >
          <h2
            className={`text-xl font-semibold ${
              isDark ? "text-gray-100" : "text-gray-900"
            } mb-4`}
          >
            Desempenho da Equipe
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div
              className={`text-center p-4 ${
                isDark ? "bg-blue-900/30 border border-blue-800" : "bg-blue-50"
              } rounded-lg`}
            >
              <div
                className={`text-3xl font-bold ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {candidatosPorEtapa.ativos.length}
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-blue-300" : "text-blue-800"
                } mt-1`}
              >
                Corretores Ativos
              </div>
              <div
                className={`text-xs mt-1 ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                {
                  candidatosPorEtapa.ativos.filter((c) => c.periodoExperiencia)
                    .length
                }{" "}
                em experiência
              </div>
            </div>
            <div
              className={`text-center p-4 ${
                isDark
                  ? "bg-green-900/30 border border-green-800"
                  : "bg-green-50"
              } rounded-lg`}
            >
              <div
                className={`text-3xl font-bold ${
                  isDark ? "text-green-400" : "text-green-600"
                }`}
              >
                156
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-green-300" : "text-green-800"
                } mt-1`}
              >
                Imóveis Ativos
              </div>
            </div>
            <div
              className={`text-center p-4 ${
                isDark
                  ? "bg-purple-900/30 border border-purple-800"
                  : "bg-purple-50"
              } rounded-lg`}
            >
              <div
                className={`text-3xl font-bold ${
                  isDark ? "text-purple-400" : "text-purple-600"
                }`}
              >
                89
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-purple-300" : "text-purple-800"
                } mt-1`}
              >
                Leads/Mês
              </div>
            </div>
            <div
              className={`text-center p-4 ${
                isDark
                  ? "bg-[#D4A24D]/20 border border-amber-800"
                  : "bg-[#D4A24D]/10"
              } rounded-lg`}
            >
              <div
                className={`text-3xl font-bold ${
                  isDark ? "text-amber-300" : "text-[#D4A24D]"
                }`}
              >
                R$ 5.2M
              </div>
              <div
                className={`text-sm ${
                  isDark ? "text-amber-300" : "text-[#c1923e]"
                } mt-1`}
              >
                Vendas (mês)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAIS */}
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

      {modalProgressoAberto && (
        <ModalProgressoTreinamento
          isOpen={modalProgressoAberto}
          onClose={handleFecharModal}
          candidato={candidatoProgresso}
          onToggleCheckpoint={handleToggleCheckpoint}
          onToggleAtributo={handleToggleAtributo}
          isDark={isDark}
        />
      )}

      {/* MODAL DE PERFIL ÚNICO */}
      {modalPerfilAberto && (
        <ModalPerfilCorretor
          isOpen={modalPerfilAberto}
          onClose={handleFecharModal}
          corretor={corretorSelecionado}
          isDark={isDark}
          onAtivar={handleAtivacaoDireta} // ← FUNÇÃO CORRETA!
        />
      )}

      {modalReprovacaoAberto && (
        <ModalReprovacao
          isOpen={modalReprovacaoAberto}
          onClose={() => {
            setModalReprovacaoAberto(false);
            setCandidatoParaReprovar(null);
          }}
          candidato={candidatoParaReprovar}
          onConfirmarReprovacao={handleConfirmarReprovacao}
          isDark={isDark}
        />
      )}

      {modalAtivacaoAberto && (
        <ModalAtivacao
          isOpen={modalAtivacaoAberto}
          onClose={() => {
            setModalAtivacaoAberto(false);
            setCandidatoParaAtivar(null);
          }}
          candidato={candidatoParaAtivar}
          onConfirmarAtivacao={handleConfirmarAtivacao}
          isDark={isDark}
        />
      )}

      {modalFeedbackAberto && (
        <ModalFeedbackBasico
          isOpen={modalFeedbackAberto}
          onClose={() => {
            setModalFeedbackAberto(false);
            setCandidatoParaFeedback(null);
          }}
          candidato={candidatoParaFeedback}
          onSalvar={handleSalvarFeedback}
          isDark={isDark}
        />
      )}

      {modalPausaAberto && (
        <ModalPausaTreinamento
          isOpen={modalPausaAberto}
          onClose={() => {
            setModalPausaAberto(false);
            setCandidatoParaPausa(null);
          }}
          candidato={candidatoParaPausa}
          onConfirmarPausa={handleConfirmarPausa}
          isDark={isDark}
        />
      )}

      {modalCancelamentoAberto && (
        <ModalCancelamentoTreinamento
          isOpen={modalCancelamentoAberto}
          onClose={() => {
            setModalCancelamentoAberto(false);
            setCandidatoParaCancelar(null);
          }}
          candidato={candidatoParaCancelar}
          onConfirmarCancelamento={handleConfirmarCancelamento}
          isDark={isDark}
        />
      )}

      {modalDetalhesAberto && (
        <ModalDetalhesArquivado
          isOpen={modalDetalhesAberto}
          onClose={() => {
            setModalDetalhesAberto(false);
            setCandidatoDetalhes(null);
          }}
          candidato={candidatoDetalhes}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default Corretores;
