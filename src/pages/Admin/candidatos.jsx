import React, { useState } from "react";

// Componentes Premium
const ButtonPremium = ({
  children,
  variant = "primary",
  onClick,
  className = "",
}) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm
      ${
        variant === "primary"
          ? "bg-gradient-to-r from-[#D4A24D] to-[#e6b64e] text-white shadow-sm hover:shadow-md hover:from-[#c1923e] hover:to-[#d4a24d] active:scale-95"
          : variant === "success"
            ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm hover:shadow-md hover:from-emerald-600 hover:to-emerald-700 active:scale-95"
            : variant === "danger"
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm hover:shadow-md hover:from-red-600 hover:to-red-700 active:scale-95"
              : "bg-white border border-gray-200 text-gray-700 shadow-xs hover:shadow-sm hover:border-gray-300 hover:bg-gray-50 active:scale-95"
      } ${className}`}
  >
    {children}
  </button>
);

// Ícones SVG Premium
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
      strokeWidth="1.5"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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
      strokeWidth="1.5"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
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
      strokeWidth="1.5"
      d="M12 14l9-5-9-5-9 5 9 5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 14l9-5-9-5-9 5 9 5z"
      opacity="0.4"
      transform="translate(0 7)"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M4.5 17.5L12 21l7.5-3.5"
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
      strokeWidth="1.5"
      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
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
      strokeWidth="1.5"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
      strokeWidth="1.5"
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
      strokeWidth="1.5"
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
      strokeWidth="1.5"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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
      strokeWidth="1.5"
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
      strokeWidth="1.5"
      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
    />
  </svg>
);

// Novo ícone para "Filtros do Processo" - ícone de filtro mais profissional
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
      strokeWidth="1.5"
      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
    />
  </svg>
);

// NOVO ÍCONE para "Pendentes" - Ícone de usuário com círculo de espera (mais compreensível)
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
      strokeWidth="1.5"
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
    <circle
      cx="12"
      cy="12"
      r="1"
      strokeWidth="1.5"
      fill="currentColor"
      opacity="0.7"
    />
    <circle
      cx="17"
      cy="12"
      r="1"
      strokeWidth="1.5"
      fill="currentColor"
      opacity="0.7"
    />
    <circle
      cx="7"
      cy="12"
      r="1"
      strokeWidth="1.5"
      fill="currentColor"
      opacity="0.7"
    />
  </svg>
);

// Sistema de datas inteligente
const formatarDataAmigavel = (dataString) => {
  const dataCadastro = new Date(dataString);
  const hoje = new Date();
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);

  const dataSemHora = new Date(
    dataCadastro.getFullYear(),
    dataCadastro.getMonth(),
    dataCadastro.getDate(),
  );
  const hojeSemHora = new Date(
    hoje.getFullYear(),
    hoje.getMonth(),
    hoje.getDate(),
  );
  const ontemSemHora = new Date(
    ontem.getFullYear(),
    ontem.getMonth(),
    ontem.getDate(),
  );

  const hora = dataCadastro.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (dataSemHora.getTime() === hojeSemHora.getTime()) return `Hoje, ${hora}`;
  if (dataSemHora.getTime() === ontemSemHora.getTime()) return `Ontem, ${hora}`;

  const diffDias = Math.floor(
    (hojeSemHora - dataSemHora) / (1000 * 60 * 60 * 24),
  );
  if (diffDias < 7) {
    const diasDaSemana = [
      "Domingo",
      "Segunda",
      "Terça",
      "Quarta",
      "Quinta",
      "Sexta",
      "Sábado",
    ];
    return `${diasDaSemana[dataCadastro.getDay()]}, ${hora}`;
  }

  return dataCadastro.toLocaleDateString("pt-BR") + `, ${hora}`;
};

const CandidatosPremium = () => {
  const [abaAtiva, setAbaAtiva] = useState("pendentes");
  const [searchTerm, setSearchTerm] = useState("");

  // Dados de exemplo - REMOVIDA A PROPRIEDADE 'foto' DOS CANDIDATOS PENDENTES
  const candidatos = {
    pendentes: [
      {
        id: 1,
        nome: "Fulano Silva",
        creci: "123456-MA",
        whatsapp: "(98) 99999-9999",
        email: "fulano@email.com",
        dataCadastro: new Date().toISOString(),
      },
      {
        id: 2,
        nome: "Beltrano Santos",
        creci: "654321-MA",
        whatsapp: "(98) 98888-8888",
        email: "beltrano@email.com",
        dataCadastro: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        nome: "Ciclano Oliveira",
        creci: "789012-MA",
        whatsapp: "(98) 97777-7777",
        email: "ciclano@email.com",
        dataCadastro: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
      {
        id: 4,
        nome: "Maria Pereira",
        creci: "345678-MA",
        whatsapp: "(98) 96666-6666",
        email: "maria@email.com",
        dataCadastro: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      },
    ],
    entrevista: [
      {
        id: 5,
        nome: "Carlos Mendes",
        creci: "111222-MA",
        whatsapp: "(98) 94444-4444",
        email: "carlos@email.com",
        dataEntrevista: "Amanhã, 14:00",
        entrevistador: "CEO",
        foto: "CM",
      },
    ],
    treinamento: [
      {
        id: 6,
        nome: "Ana Lima",
        creci: "333444-MA",
        whatsapp: "(98) 93333-3333",
        email: "ana@email.com",
        progresso: "60%",
        foto: "AL",
      },
    ],
    reprovados: [
      {
        id: 7,
        nome: "Pedro Alves",
        creci: "555666-MA",
        whatsapp: "(98) 92222-2222",
        motivo: "Documentação incompleta",
        dataReprovacao: "20/02/2024",
        foto: "PA",
      },
    ],
  };

  // Abas premium - CORES ATUALIZADAS
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
      cor: "bg-gradient-to-r from-red-500 to-red-600", // AGORA TAMBÉM VERMELHO
      badgeCor: "bg-red-500 text-white", // VERMELHO COM TEXTO BRANCO
      count: candidatos.reprovados.length,
      descricao: "Finalizados",
    },
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      {/* Header Premium */}
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

      {/* Abas Horizontalizadas - CORES ATUALIZADAS PARA REPROVADOS TAMBÉM */}
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

          {/* Indicador de Progresso - CORES ATUALIZADAS */}
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
              {abaAtiva === "pendentes" && (
                <>
                  <UserWaitingIcon className="w-5 h-5 inline mr-2 text-red-500 align-text-bottom" />
                  Cadastros Pendentes
                </>
              )}
              {abaAtiva === "entrevista" && (
                <>
                  <CalendarIcon className="w-5 h-5 inline mr-2 text-purple-500 align-text-bottom" />
                  Em Entrevista
                </>
              )}
              {abaAtiva === "treinamento" && (
                <>
                  <AcademicCapIcon className="w-5 h-5 inline mr-2 text-amber-500 align-text-bottom" />
                  Em Treinamento
                </>
              )}
              {abaAtiva === "reprovados" && (
                <>
                  <XCircleIcon className="w-5 h-5 inline mr-2 text-red-500 align-text-bottom" />
                  Histórico de Reprovados
                </>
              )}
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
              {candidatos[abaAtiva].length}
            </span>{" "}
            de {candidatos[abaAtiva].length}
          </div>
        </div>

        {/* Grid de Cards - MELHORIAS PARA REPROVADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {candidatos[abaAtiva].map((candidato) => (
            <div
              key={candidato.id}
              className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              {/* Header do Card - ETIQUETA REPROVADO COM VERMELHO E TEXTO BRANCO */}
              <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-100">
                <div className="flex items-center">
                  {/* Renderiza avatar apenas se houver foto */}
                  {candidato.foto ? (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="font-semibold text-base text-gray-700">
                        {candidato.foto}
                      </span>
                    </div>
                  ) : abaAtiva === "pendentes" ? (
                    <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                      <UserIcon className="w-6 h-6 text-red-500" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <UserIcon className="w-6 h-6 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 text-base">
                      {candidato.nome}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">
                      CRECI: {candidato.creci}
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
                          : "bg-red-500 text-white" // REPROVADO: VERMELHO COM TEXTO BRANCO
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
                {/* Linha de Telefone */}
                <div className="flex items-start">
                  <div className="w-6 mr-3 flex justify-center pt-0.5">
                    <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  </div>
                  <span className="text-sm text-gray-700 flex-1">
                    {candidato.whatsapp}
                  </span>
                </div>

                {/* Linha de Email */}
                {candidato.email && (
                  <div className="flex items-start">
                    <div className="w-6 mr-3 flex justify-center pt-0.5">
                      <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                    <span className="text-sm text-gray-700 flex-1">
                      {candidato.email}
                    </span>
                  </div>
                )}

                {/* Separador entre dados do candidato e estado temporal */}
                {abaAtiva === "pendentes" && candidato.dataCadastro && (
                  <div className="pt-4 mt-3 border-t border-gray-100">
                    <div className="flex items-start">
                      <div className="w-6 mr-3 flex justify-center pt-0.5">
                        <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                      <div className="text-sm flex-1">
                        <span className="text-gray-500">Cadastrou: </span>
                        <span className="text-gray-800 font-medium">
                          {formatarDataAmigavel(candidato.dataCadastro)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informações específicas por etapa */}
                {abaAtiva === "entrevista" && candidato.dataEntrevista && (
                  <div className="pt-4 mt-3 border-t border-gray-100">
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1.5">Entrevista</div>
                      <div className="text-gray-800 font-medium">
                        {candidato.dataEntrevista}
                      </div>
                      {candidato.entrevistador && (
                        <div className="text-gray-600 mt-1">
                          Com: {candidato.entrevistador}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {abaAtiva === "treinamento" && candidato.progresso && (
                  <div className="pt-4 mt-3 border-t border-gray-100">
                    <div className="text-sm">
                      <div className="text-gray-500 mb-1.5">Progresso</div>
                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: candidato.progresso }}
                        ></div>
                      </div>
                      <div className="text-gray-800 font-medium">
                        {candidato.progresso}
                      </div>
                    </div>
                  </div>
                )}

                {abaAtiva === "reprovados" && candidato.motivo && (
                  <div className="pt-4 mt-3 border-t border-gray-100">
                    <div className="text-sm">
                      <div className="text-gray-500 mb-2 font-medium">
                        Motivo da Reprovação
                      </div>
                      {/* RETÂNGULO COM BORDAS VERMELHAS E TEXTO EM NEGRITO */}
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                        <div className="text-red-800 font-bold text-sm">
                          {candidato.motivo}
                        </div>
                      </div>
                      {candidato.dataReprovacao && (
                        <div className="text-gray-600 mt-3">
                          <span className="font-medium">Data:</span>{" "}
                          {candidato.dataReprovacao}
                        </div>
                      )}
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
                    onClick={() =>
                      alert(`Agendar entrevista com ${candidato.nome}`)
                    }
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
                      onClick={() => alert(`Aprovar ${candidato.nome}`)}
                    >
                      <CheckCircleIcon className="w-4 h-4 inline mr-2" />
                      Aprovar
                    </ButtonPremium>
                    <ButtonPremium
                      variant="danger"
                      className="flex-1 text-sm py-2.5"
                      onClick={() => alert(`Reprovar ${candidato.nome}`)}
                    >
                      <XCircleIcon className="w-4 h-4 inline mr-2" />
                      Reprovar
                    </ButtonPremium>
                  </div>
                )}

                {abaAtiva === "treinamento" && (
                  <ButtonPremium
                    variant="primary"
                    className="w-full text-sm py-2.5"
                    onClick={() =>
                      alert(`Ativar ${candidato.nome} como corretor`)
                    }
                  >
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    Ativar como Corretor
                  </ButtonPremium>
                )}

                {abaAtiva === "reprovados" && (
                  <ButtonPremium
                    variant="outline"
                    className="w-full text-sm py-2.5"
                    onClick={() => alert(`Ver detalhes de ${candidato.nome}`)}
                  >
                    Ver Detalhes
                  </ButtonPremium>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estatísticas - CORES ATUALIZADAS PARA REPROVADOS TAMBÉM */}
      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-900 text-base mb-4">
          Estatísticas do Processo
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1 - Pendentes (VERMELHO) */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-xs">
                <UserWaitingIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-red-700">
              {candidatos.pendentes.length}
            </div>
            <div className="text-sm font-medium text-red-800 mt-1">
              Pendentes
            </div>
            <div className="text-xs text-red-600 mt-1">Necessita atenção</div>
          </div>

          {/* Card 2 - Entrevista (Roxo) */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-xs">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              {candidatos.entrevista.length}
            </div>
            <div className="text-sm font-medium text-purple-800 mt-1">
              Entrevista
            </div>
            <div className="text-xs text-purple-600 mt-1">Agendados</div>
          </div>

          {/* Card 3 - Treinamento (Âmbar/Amarelo) */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-[#D4A24D] to-[#e6b64e] rounded-lg shadow-xs">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-amber-700">
              {candidatos.treinamento.length}
            </div>
            <div className="text-sm font-medium text-amber-800 mt-1">
              Treinamento
            </div>
            <div className="text-xs text-amber-600 mt-1">Em capacitação</div>
          </div>

          {/* Card 4 - Reprovados (AGORA VERMELHO TAMBÉM) */}
          <div className="text-center p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
            <div className="flex justify-center mb-3">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-xs">
                <XCircleIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold text-red-700">
              {candidatos.reprovados.length}
            </div>
            <div className="text-sm font-medium text-red-800 mt-1">
              Reprovados
            </div>
            <div className="text-xs text-red-600 mt-1">Finalizados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidatosPremium;
