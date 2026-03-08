// pages/Admin/Candidatos.jsx
import React, { useState, useEffect } from "react";
import { candidatosService } from "../../lib/candidatosService";
import { treinamentosService } from "../../lib/treinamentosService";

// ============================================================================
// COMPONENTES DE ÍCONE (SVG puro, sem dependências)
// ============================================================================

const ButtonPremium = ({
  children,
  variant = "primary",
  onClick,
  className = "",
}) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-[#D4A24D] hover:bg-[#C4933E] text-white focus:ring-[#D4A24D]",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    outline:
      "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// Ícones básicos
const UserIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
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
);

const PhoneIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const EnvelopeIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const ClockIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CalendarIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CheckCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
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
);

const XCircleIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
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
);

const AcademicCapIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
    />
  </svg>
);

const FilterIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const SearchIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
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
);

const ChartIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

const ArrowLeftIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

// Ícones específicos para as abas
const UserWaitingIcon = ({ className = "w-5 h-5" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0zM12 12h.01"
    />
  </svg>
);

// ============================================================================
// FUNÇÕES AUXILIARES
// ============================================================================

const formatarDataAmigavel = (dataString) => {
  if (!dataString) return "Data não disponível";

  try {
    const data = new Date(dataString);
    if (isNaN(data.getTime())) return "Data inválida";

    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "Data inválida";
  }
};

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const CandidatosPremium = () => {
  const [abaAtiva, setAbaAtiva] = useState("pendentes");
  const [searchTerm, setSearchTerm] = useState("");
  const [candidatos, setCandidatos] = useState({
    pendentes: [],
    entrevista: [],
    treinamento: [],
    reprovados: [],
  });
  const [loading, setLoading] = useState(true);
  const [showAgendarModal, setShowAgendarModal] = useState(false);
  const [selectedCandidato, setSelectedCandidato] = useState(null);
  const [formData, setFormData] = useState({
    data: "",
    horario: "",
    entrevistador: "RH",
  });

  // ==========================================================================
  // CARREGAR DADOS
  // ==========================================================================

  const carregarCandidatos = async () => {
    try {
      setLoading(true);

      const [pendentes, entrevista, treinamento, reprovados] =
        await Promise.all([
          candidatosService.buscarPorStatus("pendente"),
          candidatosService.buscarPorStatus("entrevista"),
          candidatosService.buscarPorStatus("treinamento"),
          candidatosService.buscarPorStatus("reprovado"),
        ]);

      // Para candidatos em treinamento, buscar progresso
      const treinamentosCompletos = await Promise.all(
        treinamento.map(async (cand) => {
          try {
            const treino = await treinamentosService.buscarPorCandidato(
              cand.id,
            );
            return { ...cand, treinamento: treino };
          } catch (error) {
            console.error(`Erro ao buscar treinamento para ${cand.id}:`, error);
            return { ...cand, treinamento: null };
          }
        }),
      );

      setCandidatos({
        pendentes: pendentes || [],
        entrevista: entrevista || [],
        treinamento: treinamentosCompletos || [],
        reprovados: reprovados || [],
      });
    } catch (error) {
      console.error("❌ Erro ao carregar candidatos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCandidatos();
  }, []);

  // ==========================================================================
  // HANDLERS
  // ==========================================================================

  const handleAgendarEntrevista = async (candidatoId, dados) => {
    try {
      await candidatosService.agendarEntrevista(candidatoId, dados);
      await carregarCandidatos();
      setShowAgendarModal(false);
      setSelectedCandidato(null);
      setFormData({ data: "", horario: "", entrevistador: "RH" });
      alert("Entrevista agendada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao agendar entrevista:", error);
      alert("Erro ao agendar entrevista. Tente novamente.");
    }
  };

  const handleAprovarCandidato = async (candidatoId) => {
    try {
      // Registrar feedback (nota 8 como padrão para aprovados)
      await candidatosService.registrarFeedbackEntrevista(candidatoId, {
        nota: 8,
        status: "aprovado",
        observacoes: "Aprovado na entrevista",
      });

      // Iniciar treinamento
      await treinamentosService.iniciarTreinamento(candidatoId);

      await carregarCandidatos();
      alert("✅ Candidato aprovado e encaminhado para treinamento!");
    } catch (error) {
      console.error("❌ Erro ao aprovar candidato:", error);
      alert("Erro ao aprovar candidato. Tente novamente.");
    }
  };

  const handleReprovarCandidato = async (candidatoId, motivo) => {
    if (!motivo || motivo.trim() === "") {
      alert("Por favor, informe o motivo da reprovação.");
      return;
    }

    try {
      await candidatosService.registrarFeedbackEntrevista(candidatoId, {
        nota: 3,
        status: "reprovado",
        observacoes: motivo,
      });
      await carregarCandidatos();
    } catch (error) {
      console.error("❌ Erro ao reprovar candidato:", error);
      alert("Erro ao reprovar candidato. Tente novamente.");
    }
  };

  const handleIniciarTreinamento = async (treinamentoId) => {
    try {
      await treinamentosService.comecarTreinamento(treinamentoId);
      await carregarCandidatos();
      alert("✅ Treinamento iniciado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao iniciar treinamento:", error);
      alert("Erro ao iniciar treinamento. Tente novamente.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const abrirModalAgendar = (candidato) => {
    setSelectedCandidato(candidato);
    setShowAgendarModal(true);
  };

  const fecharModal = () => {
    setShowAgendarModal(false);
    setSelectedCandidato(null);
    setFormData({ data: "", horario: "", entrevistador: "RH" });
  };

  // ==========================================================================
  // FILTROS
  // ==========================================================================

  const candidatosFiltrados = (candidatos[abaAtiva] || []).filter((c) => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    return (
      c.nome?.toLowerCase().includes(term) ||
      c.creci?.toLowerCase().includes(term) ||
      c.telefone?.includes(term) ||
      c.email?.toLowerCase().includes(term)
    );
  });

  // ==========================================================================
  // CONFIGURAÇÃO DAS ABAS
  // ==========================================================================

  const abas = [
    {
      id: "pendentes",
      nome: "Pendentes",
      icone: UserWaitingIcon,
      cor: "bg-gradient-to-r from-red-500 to-red-600",
      badgeCor: "bg-red-50 text-red-700 border border-red-200",
      count: candidatos.pendentes.length,
      descricao: "Necessita atenção",
    },
    {
      id: "entrevista",
      nome: "Entrevista",
      icone: CalendarIcon,
      cor: "bg-gradient-to-r from-purple-500 to-purple-600",
      badgeCor: "bg-purple-50 text-purple-700 border border-purple-200",
      count: candidatos.entrevista.length,
      descricao: "Agendados",
    },
    {
      id: "treinamento",
      nome: "Treinamento",
      icone: AcademicCapIcon,
      cor: "bg-gradient-to-r from-amber-500 to-yellow-500",
      badgeCor: "bg-amber-50 text-amber-700 border border-amber-200",
      count: candidatos.treinamento.length,
      descricao: "Capacitação",
    },
    {
      id: "reprovados",
      nome: "Reprovados",
      icone: XCircleIcon,
      cor: "bg-gradient-to-r from-red-500 to-red-600",
      badgeCor: "bg-red-500 text-white",
      count: candidatos.reprovados.length,
      descricao: "Finalizados",
    },
  ];

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================

  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24D] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando candidatos...</p>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDERIZAÇÃO PRINCIPAL
  // ==========================================================================

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* HEADER */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Processo Seletivo
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Gerencie candidatos do cadastro à contratação
            </p>
          </div>

          <div className="flex gap-3">
            <ButtonPremium
              variant="outline"
              onClick={() => window.history.back()}
            >
              <ArrowLeftIcon className="w-4 h-4 inline mr-2" />
              Voltar
            </ButtonPremium>
            <ButtonPremium variant="primary">
              <ChartIcon className="w-4 h-4 inline mr-2" />
              Relatório
            </ButtonPremium>
          </div>
        </div>

        {/* BARRA DE BUSCA */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, CRECI ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-xs hover:shadow-sm transition-all duration-300 text-sm"
          />
        </div>
      </div>

      {/* ABAS */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <FilterIcon className="w-4 h-4 mr-2 text-gray-500" />
                Filtros do Processo
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Selecione uma etapa para visualizar os candidatos
              </p>
            </div>

            <div className="mt-3 lg:mt-0">
              <div className="text-xs text-gray-500">
                Total:{" "}
                <span className="font-semibold text-gray-900">
                  {Object.values(candidatos).reduce(
                    (acc, curr) => acc + curr.length,
                    0,
                  )}{" "}
                  candidatos
                </span>
              </div>
            </div>
          </div>

          {/* BOTÕES DAS ABAS */}
          <div className="flex flex-wrap gap-2">
            {abas.map((aba) => {
              const Icone = aba.icone;
              const estaAtiva = abaAtiva === aba.id;

              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`
                    group relative px-5 py-3 rounded-lg transition-all duration-200 flex items-center
                    ${estaAtiva ? `${aba.cor} text-white` : "bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"}
                    overflow-hidden min-w-[180px] flex-1
                  `}
                >
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-200 ${
                      estaAtiva ? "bg-white" : "bg-gray-900"
                    }`}
                  ></div>

                  <div className="relative flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Icone
                        className={`w-5 h-5 mr-3 ${estaAtiva ? "text-white" : "text-gray-500"}`}
                      />
                      <div className="text-left">
                        <div
                          className={`font-medium text-base ${estaAtiva ? "text-white" : "text-gray-900"}`}
                        >
                          {aba.nome}
                        </div>
                        <div
                          className={`text-xs ${estaAtiva ? "text-white/80" : "text-gray-500"}`}
                        >
                          {aba.count}{" "}
                          {aba.count === 1 ? "candidato" : "candidatos"}
                        </div>
                      </div>
                    </div>
                    {estaAtiva && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full ml-2"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">
              {abaAtiva === "pendentes" && "Cadastros Pendentes"}
              {abaAtiva === "entrevista" && "Em Entrevista"}
              {abaAtiva === "treinamento" && "Em Treinamento"}
              {abaAtiva === "reprovados" && "Histórico de Reprovados"}
            </h2>
            <p className="text-sm text-gray-600">
              {abaAtiva === "pendentes" &&
                "Candidatos que se cadastraram e aguardam análise"}
              {abaAtiva === "entrevista" &&
                "Candidatos com entrevista agendada"}
              {abaAtiva === "treinamento" &&
                "Candidatos em fase de capacitação"}
              {abaAtiva === "reprovados" &&
                "Candidatos que não prosseguiram no processo"}
            </p>
          </div>

          <div className="text-sm text-gray-500">
            Mostrando{" "}
            <span className="font-semibold text-gray-900">
              {candidatosFiltrados.length}
            </span>{" "}
            de {candidatos[abaAtiva]?.length || 0}
          </div>
        </div>

        {/* GRID DE CARDS */}
        {candidatosFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum candidato encontrado
            </h3>
            <p className="text-gray-500">
              {searchTerm
                ? "Tente buscar com outros termos"
                : `Não há candidatos ${
                    abaAtiva === "pendentes"
                      ? "pendentes"
                      : abaAtiva === "entrevista"
                        ? "em entrevista"
                        : abaAtiva === "treinamento"
                          ? "em treinamento"
                          : "reprovados"
                  } no momento.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {candidatosFiltrados.map((candidato) => (
              <div
                key={candidato.id}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow"
              >
                {/* HEADER DO CARD */}
                <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                        abaAtiva === "pendentes"
                          ? "bg-red-50"
                          : abaAtiva === "entrevista"
                            ? "bg-purple-50"
                            : abaAtiva === "treinamento"
                              ? "bg-amber-50"
                              : "bg-red-100"
                      }`}
                    >
                      <UserIcon
                        className={`w-6 h-6 ${
                          abaAtiva === "pendentes"
                            ? "text-red-500"
                            : abaAtiva === "entrevista"
                              ? "text-purple-500"
                              : abaAtiva === "treinamento"
                                ? "text-amber-500"
                                : "text-red-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {candidato.nome || "Nome não informado"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-0.5">
                        CRECI: {candidato.creci || "Não informado"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      abaAtiva === "pendentes"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : abaAtiva === "entrevista"
                          ? "bg-purple-50 text-purple-700 border border-purple-200"
                          : abaAtiva === "treinamento"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-red-500 text-white"
                    }`}
                  >
                    {abaAtiva === "pendentes"
                      ? "Pendente"
                      : abaAtiva === "entrevista"
                        ? "Entrevista"
                        : abaAtiva === "treinamento"
                          ? "Treinamento"
                          : "Reprovado"}
                  </span>
                </div>

                {/* INFORMAÇÕES DO CANDIDATO */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-start">
                    <PhoneIcon className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                    <span className="text-sm text-gray-700 flex-1 break-all">
                      {candidato.telefone || "Não informado"}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                    <span className="text-sm text-gray-700 flex-1 break-all">
                      {candidato.email || "Não informado"}
                    </span>
                  </div>

                  {/* Data de cadastro */}
                  {candidato.created_at && (
                    <div className="pt-4 mt-3 border-t border-gray-100">
                      <div className="flex items-start">
                        <ClockIcon className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                        <div className="text-sm flex-1">
                          <span className="text-gray-500">Cadastrou: </span>
                          <span className="text-gray-800 font-medium">
                            {formatarDataAmigavel(candidato.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Informações específicas por etapa */}
                  {abaAtiva === "entrevista" && candidato.data_entrevista && (
                    <div className="pt-4 mt-3 border-t border-gray-100">
                      <div className="text-sm">
                        <div className="text-gray-500 mb-1.5">Entrevista</div>
                        <div className="text-gray-800 font-medium">
                          {new Date(
                            candidato.data_entrevista,
                          ).toLocaleDateString("pt-BR")}{" "}
                          às {candidato.horario_entrevista}
                        </div>
                        {candidato.entrevistador && (
                          <div className="text-gray-600 mt-1">
                            Com: {candidato.entrevistador}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {abaAtiva === "treinamento" && candidato.treinamento && (
                    <div className="pt-4 mt-3 border-t border-gray-100">
                      <div className="text-sm">
                        <div className="text-gray-500 mb-1.5">
                          Progresso do Treinamento
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${candidato.treinamento.progresso || 0}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-gray-800 font-medium">
                          {candidato.treinamento.progresso || 0}% completo
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Status:{" "}
                          {candidato.treinamento.status || "não iniciado"}
                        </div>
                      </div>
                    </div>
                  )}

                  {abaAtiva === "reprovados" && candidato.motivo_reprovacao && (
                    <div className="pt-4 mt-3 border-t border-gray-100">
                      <div className="text-sm">
                        <div className="text-gray-500 mb-2 font-medium">
                          Motivo da Reprovação
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                          <div className="text-red-800 font-bold text-sm">
                            {candidato.motivo_reprovacao}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* AÇÕES */}
                <div className="pt-4 border-t border-gray-100">
                  {abaAtiva === "pendentes" && (
                    <ButtonPremium
                      variant="primary"
                      className="w-full text-sm py-2.5"
                      onClick={() => abrirModalAgendar(candidato)}
                    >
                      <CalendarIcon className="w-4 h-4 inline mr-2" />
                      Agendar Entrevista
                    </ButtonPremium>
                  )}

                  {abaAtiva === "entrevista" && (
                    <div className="flex gap-3">
                      <ButtonPremium
                        variant="success"
                        className="flex-1 text-sm py-2.5"
                        onClick={() => handleAprovarCandidato(candidato.id)}
                      >
                        <CheckCircleIcon className="w-4 h-4 inline mr-2" />
                        Aprovar
                      </ButtonPremium>
                      <ButtonPremium
                        variant="danger"
                        className="flex-1 text-sm py-2.5"
                        onClick={() => {
                          const motivo = prompt("Motivo da reprovação:");
                          if (motivo)
                            handleReprovarCandidato(candidato.id, motivo);
                        }}
                      >
                        <XCircleIcon className="w-4 h-4 inline mr-2" />
                        Reprovar
                      </ButtonPremium>
                    </div>
                  )}

                  {abaAtiva === "treinamento" && candidato.treinamento && (
                    <ButtonPremium
                      variant="primary"
                      className="w-full text-sm py-2.5"
                      onClick={() => {
                        if (candidato.treinamento.status === "nao_iniciado") {
                          handleIniciarTreinamento(candidato.treinamento.id);
                        } else {
                          alert(`Detalhes do treinamento de ${candidato.nome}`);
                        }
                      }}
                    >
                      <AcademicCapIcon className="w-4 h-4 inline mr-2" />
                      {candidato.treinamento.status === "nao_iniciado"
                        ? "Iniciar Treinamento"
                        : "Ver Detalhes"}
                    </ButtonPremium>
                  )}

                  {abaAtiva === "reprovados" && (
                    <ButtonPremium
                      variant="outline"
                      className="w-full text-sm py-2.5"
                      onClick={() => alert(`Histórico de ${candidato.nome}`)}
                    >
                      Ver Detalhes
                    </ButtonPremium>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ESTATÍSTICAS */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 text-base mb-4">
          Estatísticas do Processo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {candidatos.pendentes.length}
            </div>
            <div className="text-sm font-medium text-red-800 mt-1">
              Pendentes
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="text-2xl font-bold text-purple-700">
              {candidatos.entrevista.length}
            </div>
            <div className="text-sm font-medium text-purple-800 mt-1">
              Entrevista
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200">
            <div className="text-2xl font-bold text-amber-700">
              {candidatos.treinamento.length}
            </div>
            <div className="text-sm font-medium text-amber-800 mt-1">
              Treinamento
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="text-2xl font-bold text-red-700">
              {candidatos.reprovados.length}
            </div>
            <div className="text-sm font-medium text-red-800 mt-1">
              Reprovados
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE AGENDAMENTO */}
      {showAgendarModal && selectedCandidato && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={fecharModal}
          ></div>
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
              <div className="bg-[#D4A24D] text-white p-5 rounded-t-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Agendar Entrevista</h3>
                  <button
                    onClick={fecharModal}
                    className="text-white/80 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-white/80 mt-1">
                  Candidato: {selectedCandidato.nome}
                </p>
              </div>

              <div className="p-6">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAgendarEntrevista(selectedCandidato.id, formData);
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data da Entrevista *
                      </label>
                      <input
                        type="date"
                        name="data"
                        value={formData.data}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Horário *
                      </label>
                      <input
                        type="time"
                        name="horario"
                        value={formData.horario}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entrevistador
                      </label>
                      <input
                        type="text"
                        name="entrevistador"
                        value={formData.entrevistador}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
                        placeholder="Nome do entrevistador"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <ButtonPremium
                      variant="outline"
                      onClick={fecharModal}
                      type="button"
                    >
                      Cancelar
                    </ButtonPremium>
                    <ButtonPremium variant="primary" type="submit">
                      Agendar
                    </ButtonPremium>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidatosPremium;
