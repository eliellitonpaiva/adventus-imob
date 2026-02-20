// pages/Admin/candidatos.jsx
import React, { useState, useEffect } from "react";
import { candidatosService } from "../../lib/candidatosService";
import { treinamentosService } from "../../lib/treinamentosService";

// Seus componentes de ícone (mantém tudo igual)
const ButtonPremium = ({ children, variant = "primary", onClick, className = "" }) => (
  // ... seu código existente
);

const UserIcon = ({ className = "w-5 h-5" }) => (
  // ... seu código existente
);

// ... (todos os seus ícones permanecem IGUAIS)

const formatarDataAmigavel = (dataString) => {
  // ... sua função existente
};

const CandidatosPremium = () => {
  const [abaAtiva, setAbaAtiva] = useState("pendentes");
  const [searchTerm, setSearchTerm] = useState("");
  const [candidatos, setCandidatos] = useState({
    pendentes: [],
    entrevista: [],
    treinamento: [],
    reprovados: []
  });
  const [loading, setLoading] = useState(true);

  // Carregar dados do banco
  useEffect(() => {
    carregarCandidatos();
  }, []);

  const carregarCandidatos = async () => {
    try {
      const [pendentes, entrevista, treinamento, reprovados] = await Promise.all([
        candidatosService.buscarPorStatus("pendente"),
        candidatosService.buscarPorStatus("entrevista"),
        candidatosService.buscarPorStatus("treinamento"),
        candidatosService.buscarPorStatus("reprovado")
      ]);

      // Para candidatos em treinamento, buscar progresso
      const treinamentosCompletos = await Promise.all(
        treinamento.map(async (cand) => {
          try {
            const treino = await treinamentosService.buscarPorCandidato(cand.id);
            return { ...cand, treinamento: treino };
          } catch (error) {
            return { ...cand, treinamento: null };
          }
        })
      );

      setCandidatos({
        pendentes,
        entrevista,
        treinamento: treinamentosCompletos,
        reprovados
      });
    } catch (error) {
      console.error("Erro ao carregar candidatos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleAgendarEntrevista = async (candidatoId, dados) => {
    try {
      await candidatosService.agendarEntrevista(candidatoId, dados);
      await carregarCandidatos();
    } catch (error) {
      console.error("Erro ao agendar:", error);
      alert("Erro ao agendar entrevista");
    }
  };

  const handleAprovarCandidato = async (candidatoId) => {
    try {
      // Registrar feedback (nota 8 como padrão para aprovados)
      await candidatosService.registrarFeedbackEntrevista(candidatoId, {
        nota: 8,
        status: "aprovado",
        observacoes: "Aprovado na entrevista"
      });
      
      // Iniciar treinamento
      await treinamentosService.iniciarTreinamento(candidatoId);
      
      await carregarCandidatos();
      alert("Candidato aprovado e encaminhado para treinamento!");
    } catch (error) {
      console.error("Erro ao aprovar:", error);
      alert("Erro ao aprovar candidato");
    }
  };

  const handleReprovarCandidato = async (candidatoId, motivo) => {
    try {
      await candidatosService.registrarFeedbackEntrevista(candidatoId, {
        nota: 3,
        status: "reprovado",
        observacoes: motivo
      });
      await carregarCandidatos();
    } catch (error) {
      console.error("Erro ao reprovar:", error);
      alert("Erro ao reprovar candidato");
    }
  };

  const handleIniciarTreinamento = async (treinamentoId) => {
    try {
      await treinamentosService.comecarTreinamento(treinamentoId);
      await carregarCandidatos();
    } catch (error) {
      console.error("Erro ao iniciar treinamento:", error);
      alert("Erro ao iniciar treinamento");
    }
  };

  // Filtrar por busca
  const candidatosFiltrados = candidatos[abaAtiva].filter(c => 
    c.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.creci?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.telefone?.includes(searchTerm) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Suas abas (mantém IGUAL)
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

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header - MANTÉM IGUAL */}
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
              ← Voltar
            </ButtonPremium>
            <ButtonPremium variant="primary">
              <ChartIcon className="w-4 h-4 inline mr-2" />
              Relatório
            </ButtonPremium>
          </div>
        </div>

        {/* Barra de Busca */}
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

      {/* Abas - MANTÉM IGUAL */}
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
                    0
                  )}{" "}
                  candidatos
                </span>
              </div>
            </div>
          </div>

          {/* Abas Horizontalizadas */}
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

          {/* Indicador de Progresso */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <div className="text-xs text-gray-600 mr-3">
                Fluxo do Processo:
              </div>
              <div className="flex items-center">
                <span className="px-2 py-1 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                  Cadastro
                </span>
                <div className="w-6 h-px bg-gray-300 mx-2"></div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                  Entrevista
                </span>
                <div className="w-6 h-px bg-gray-300 mx-2"></div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                  Treinamento
                </span>
                <div className="w-6 h-px bg-gray-300 mx-2"></div>
                <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-800 border border-red-300">
                  Resultado
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
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
            de {candidatos[abaAtiva].length}
          </div>
        </div>

        {/* Grid de Cards - AGORA COM DADOS REAIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {candidatosFiltrados.map((candidato) => (
            <div
              key={candidato.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                    abaAtiva === "pendentes" ? "bg-red-50" :
                    abaAtiva === "entrevista" ? "bg-purple-50" :
                    abaAtiva === "treinamento" ? "bg-amber-50" :
                    "bg-red-100"
                  }`}>
                    <UserIcon className={`w-6 h-6 ${
                      abaAtiva === "pendentes" ? "text-red-500" :
                      abaAtiva === "entrevista" ? "text-purple-500" :
                      abaAtiva === "treinamento" ? "text-amber-500" :
                      "text-red-600"
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">
                      {candidato.nome}
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

              {/* Informações do Candidato */}
              <div className="space-y-3 mb-4">
                <div className="flex items-start">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                  <span className="text-sm text-gray-700 flex-1">
                    {candidato.telefone || "Não informado"}
                  </span>
                </div>

                <div className="flex items-start">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400 mr-3 mt-1" />
                  <span className="text-sm text-gray-700 flex-1">
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
                        {new Date(candidato.data_entrevista).toLocaleDateString()} às {candidato.horario_entrevista}
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
                      <div className="text-gray-500 mb-1.5">Progresso do Treinamento</div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${candidato.treinamento.progresso || 0}%` }}
                        ></div>
                      </div>
                      <div className="text-gray-800 font-medium">
                        {candidato.treinamento.progresso || 0}% completo
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Status: {candidato.treinamento.status || "não iniciado"}
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

              {/* Ações */}
              <div className="pt-4 border-t border-gray-100">
                {abaAtiva === "pendentes" && (
                  <ButtonPremium
                    variant="primary"
                    className="w-full text-sm py-2.5"
                    onClick={() => {
                      const data = prompt("Data da entrevista (AAAA-MM-DD):");
                      const horario = prompt("Horário (HH:MM):");
                      if (data && horario) {
                        handleAgendarEntrevista(candidato.id, {
                          data,
                          horario,
                          entrevistador: "RH"
                        });
                      }
                    }}
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
                        if (motivo) handleReprovarCandidato(candidato.id, motivo);
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
      </div>

      {/* Estatísticas */}
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
    </div>
  );
};

export default CandidatosPremium;