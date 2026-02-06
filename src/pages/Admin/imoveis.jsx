import React, { useState, useMemo } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
  CheckBadgeIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";

// Componente Modal Performance
const ModalPerformanceImovel = ({ imovel, onClose, onAction }) => {
  // Dados de performance mockados
  const metricsData = {
    visualizacoes: 247,
    cliquesWhatsApp: 48,
    solicitacoesVisita: 12,
    interessadosAtivos: 3,
    status: "Em Negociação",
    tempoNegociacao: "10 dias",
    ultimaAtualizacao: "2 horas atrás",
  };

  // Dados do imóvel com imagem
  const imovelCompleto = {
    ...imovel,
    imagemUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=250&q=80",
  };

  // Paleta de cores Advents (azul noturno e amarelo dourado)
  const palette = {
    azulNoturno: {
      bg: "bg-[#0F172A]",
      bgLight: "bg-[#1E293B]",
      text: "text-[#0F172A]",
      border: "border-[#334155]",
      gradient: "from-[#0F172A]/90 to-[#1E293B]/70",
    },
    amareloDourado: {
      bg: "bg-[#D4A24D]",
      bgLight: "bg-[#FEF3C7]",
      text: "text-[#B45309]",
      border: "border-[#F59E0B]",
      gradient: "from-[#D4A24D]/20 to-transparent",
    },
  };

  // Componente de Card de Métrica com cores sutis
  const MetricCard = ({ icon: Icon, value, label, color }) => (
    <div
      className={`p-4 rounded-xl border ${color.border} ${color.bg} transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color.iconBg} ${color.iconText}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          {/* Número na cor azul noturno da paleta */}
          <div className="text-2xl font-bold text-[#0F172A]">
            {value.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-300">
        {/* HEADER com Banner - Altura aumentada */}
        <div className="relative">
          <div className="h-56 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
            <img
              src={imovelCompleto.imagemUrl}
              alt={imovelCompleto.codigo}
              className="w-full h-full object-cover opacity-90"
            />
            {/* Overlay com gradiente da paleta Advents */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${palette.azulNoturno.gradient} to-transparent`}
            />
          </div>

          {/* Conteúdo sobreposto */}
          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">
                {imovelCompleto.codigo}
              </h2>
              <p className="text-gray-200 font-light">
                {imovelCompleto.tipo} para{" "}
                {imovelCompleto.finalidade.toLowerCase()}
              </p>
            </div>
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-md text-white rounded-lg hover:bg-black/50 transition-all duration-200"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Localização e Preço com Divisória */}
          <div className="mb-8">
            {/* Divisória sutil */}
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-between items-center">
                <div className="bg-white pr-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {imovelCompleto.preco}
                  </div>
                </div>
                <div className="bg-white pl-4">
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                    Valor do imóvel
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço - Menor e mais discreto */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <div className="font-medium text-gray-900">
                  {imovelCompleto.endereco}
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <span>{imovelCompleto.bairro}</span>
                <span className="text-gray-400">•</span>
                <span className="font-medium">
                  {imovelCompleto.cidade} - {imovelCompleto.estado}
                </span>
              </div>
            </div>
          </div>

          {/* GRID DE MÉTRICAS - Cores suaves com fundo */}
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-4">
              Performance Comercial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={EyeIcon}
                value={metricsData.visualizacoes}
                label="Visualizações"
                color={{
                  bg: "bg-gradient-to-br from-blue-50 to-blue-100/80",
                  border: "border-blue-200",
                  iconBg: "bg-blue-100",
                  iconText: "text-blue-600",
                }}
              />
              <MetricCard
                icon={ChatBubbleLeftRightIcon}
                value={metricsData.cliquesWhatsApp}
                label="Cliques WhatsApp"
                color={{
                  bg: "bg-gradient-to-br from-green-50 to-green-100/80",
                  border: "border-green-200",
                  iconBg: "bg-green-100",
                  iconText: "text-green-600",
                }}
              />
              <MetricCard
                icon={CalendarDaysIcon}
                value={metricsData.solicitacoesVisita}
                label="Solicitações Visita"
                color={{
                  bg: "bg-gradient-to-br from-purple-50 to-purple-100/80",
                  border: "border-purple-200",
                  iconBg: "bg-purple-100",
                  iconText: "text-purple-600",
                }}
              />
              <MetricCard
                icon={UserGroupIcon}
                value={metricsData.interessadosAtivos}
                label="Interessados Ativos"
                color={{
                  bg: "bg-gradient-to-br from-amber-50 to-amber-100/80",
                  border: "border-amber-200",
                  iconBg: "bg-amber-100",
                  iconText: "text-amber-600",
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-3 text-center">
              Última atualização: {metricsData.ultimaAtualizacao}
            </div>
          </div>

          {/* BLOCO DE DECISÃO - Cores Advents */}
          <div className="mb-8">
            <div
              className={`rounded-xl p-5 ${palette.amareloDourado.bgLight} border ${palette.amareloDourado.border}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-lg ${palette.amareloDourado.bg} text-white`}
                  >
                    <ClockIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        Status:
                      </span>
                      <span
                        className={`px-4 py-1.5 ${palette.azulNoturno.bgLight} text-white text-sm font-medium rounded-full border ${palette.azulNoturno.border}`}
                      >
                        {metricsData.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-700 mt-2">
                      ⏳ Tempo em negociação:{" "}
                      <span className="font-bold">
                        {metricsData.tempoNegociacao}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-600 font-medium">
                    Engajamento
                  </div>
                  <div className="text-xl font-bold text-gray-900">84%</div>
                  <div className="w-24 h-1.5 bg-gray-300 rounded-full overflow-hidden mt-1">
                    <div className="h-full bg-green-500 w-3/4"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESUMO RÁPIDO */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              📊 Insights Rápidos
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-lg border border-blue-200">
                <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <strong className="text-green-600">
                    Taxa de conversão: 5.2%
                  </strong>{" "}
                  (acima da média do mercado)
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-green-50/50 rounded-lg border border-green-200">
                <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <strong className="text-green-600">
                    12 solicitações de visita
                  </strong>{" "}
                  nos últimos 7 dias
                </span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-amber-50/50 rounded-lg border border-amber-200">
                <CheckCircleIcon className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span className="text-sm text-gray-700">
                  <strong className="text-amber-600">
                    3 interessados ativos
                  </strong>{" "}
                  necessitam follow-up imediato
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AÇÕES - Footer REDUZIDO */}
        <div className="border-t border-gray-300 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Texto reduzido para 5 palavras */}
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-800">
                Tomada de decisão estratégica
              </span>
            </div>

            {/* Botões com mesma altura */}
            <div className="flex items-center gap-3">
              {/* Botão Fechar - Azul noturno */}
              <button
                onClick={onClose}
                className={`px-5 py-2.5 text-white ${palette.azulNoturno.bg} border ${palette.azulNoturno.border} rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2`}
              >
                <XMarkIcon className="w-4 h-4" />
                Fechar
              </button>

              {/* Botão Marcar como Vendido - Sofisticado com ícone checkbox */}
              <button
                onClick={() => onAction && onAction("marcarVendido", imovel.id)}
                className={`px-5 py-2.5 bg-white text-gray-800 border border-gray-400 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2`}
              >
                <CheckBadgeIcon className="w-4 h-4 text-green-600" />
                Marcar Vendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Wrapper para o botão Visualizar
const BotaoVisualizarPerformance = ({ imovel }) => {
  const [modalAberto, setModalAberto] = useState(false);

  const handleAcaoModal = (acao, imovelId) => {
    console.log(`Ação: ${acao} no imóvel ID: ${imovelId}`);
    setModalAberto(false);
    // Aqui você implementaria a lógica de ação (API call, etc.)
  };

  return (
    <>
      {/* Botão Visualizar na tabela */}
      <div className="relative group">
        <button
          onClick={() => setModalAberto(true)}
          className="p-1.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
          title="Visualizar Performance"
        >
          <EyeIcon className="w-4 h-4" />
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-10">
          Dashboard Performance
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
      </div>

      {/* Modal */}
      {modalAberto && (
        <ModalPerformanceImovel
          imovel={imovel}
          onClose={() => setModalAberto(false)}
          onAction={handleAcaoModal}
        />
      )}
    </>
  );
};

// O resto do código permanece exatamente igual...
const Imoveis = () => {
  // Estados para os filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedFinalidade, setSelectedFinalidade] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCidade, setSelectedCidade] = useState("");

  // Dados dos imóveis
  const imoveisData = [
    {
      id: 1,
      codigo: "APT-001",
      finalidade: "Venda",
      tipo: "Apartamento",
      endereco: "Rua Piauí, 1176",
      bairro: "Laranjeiras",
      cidade: "Açailândia",
      estado: "MA",
      status: "Disponível",
      preco: "R$ 250.000,00",
    },
    {
      id: 2,
      codigo: "CS-002",
      finalidade: "Aluguel",
      tipo: "Casa",
      endereco: "Rua São Francisco, 800",
      bairro: "Nova Açailândia II",
      cidade: "Açailândia",
      estado: "MA",
      status: "Alugado",
      preco: "R$ 1.200,00/mês",
    },
    {
      id: 3,
      codigo: "APT-003",
      finalidade: "Venda",
      tipo: "Apartamento",
      endereco: "Rua Tiradentes, 180",
      bairro: "Jardim Glória City",
      cidade: "Imperatriz",
      estado: "MA",
      status: "Vendido",
      preco: "R$ 180.000,00",
    },
    {
      id: 4,
      codigo: "TER-004",
      finalidade: "Venda",
      tipo: "Terreno",
      endereco: "Av. Des. Tácido de Caldas, 1150",
      bairro: "Centro",
      cidade: "Itinga",
      estado: "MA",
      status: "Disponível",
      preco: "R$ 85.000,00",
    },
    {
      id: 5,
      codigo: "CS-005",
      finalidade: "Venda",
      tipo: "Casa",
      endereco: "Rua Principal, 450",
      bairro: "Centro",
      cidade: "Dom Eliseu",
      estado: "PA",
      status: "Reservado",
      preco: "R$ 320.000,00",
    },
    {
      id: 6,
      codigo: "APT-006",
      finalidade: "Aluguel",
      tipo: "Apartamento",
      endereco: "Rua das Flores, 123",
      bairro: "Jardim América",
      cidade: "Imperatriz",
      estado: "MA",
      status: "Disponível",
      preco: "R$ 950,00/mês",
    },
    {
      id: 7,
      codigo: "CS-007",
      finalidade: "Venda",
      tipo: "Casa",
      endereco: "Rua Central, 789",
      bairro: "Vila Nova",
      cidade: "Açailândia",
      estado: "MA",
      status: "Vendido",
      preco: "R$ 210.000,00",
    },
    {
      id: 8,
      codigo: "APT-008",
      finalidade: "Aluguel",
      tipo: "Apartamento",
      endereco: "Av. Getúlio Vargas, 456",
      bairro: "Centro",
      cidade: "Imperatriz",
      estado: "MA",
      status: "Alugado",
      preco: "R$ 1.100,00/mês",
    },
  ];

  // Função para filtrar os imóveis
  const imoveisFiltrados = useMemo(() => {
    return imoveisData.filter((imovel) => {
      // Filtro por texto (busca)
      const buscaMatch =
        searchTerm === "" ||
        imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.cidade.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipo
      const tipoMatch =
        selectedTipo === "" ||
        imovel.tipo.toLowerCase() === selectedTipo.toLowerCase();

      // Filtro por finalidade
      const finalidadeMatch =
        selectedFinalidade === "" ||
        imovel.finalidade.toLowerCase() === selectedFinalidade.toLowerCase();

      // Filtro por status
      const statusMatch =
        selectedStatus === "" ||
        imovel.status.toLowerCase() === selectedStatus.toLowerCase();

      // Filtro por cidade
      const cidadeMatch =
        selectedCidade === "" ||
        imovel.cidade.toLowerCase() === selectedCidade.toLowerCase();

      // Retorna apenas se todos os filtros combinarem
      return (
        buscaMatch && tipoMatch && finalidadeMatch && statusMatch && cidadeMatch
      );
    });
  }, [
    searchTerm,
    selectedTipo,
    selectedFinalidade,
    selectedStatus,
    selectedCidade,
  ]);

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setSearchTerm("");
    setSelectedTipo("");
    setSelectedFinalidade("");
    setSelectedStatus("");
    setSelectedCidade("");
  };

  // Contadores para mostrar quantos imóveis foram encontrados
  const totalImoveis = imoveisData.length;
  const imoveisEncontrados = imoveisFiltrados.length;

  // Cores para os status
  const statusColors = {
    Disponível: "bg-green-100 text-green-800",
    Vendido: "bg-red-100 text-red-800",
    Alugado: "bg-yellow-100 text-yellow-800",
    Reservado: "bg-blue-100 text-blue-800",
  };

  const tipoColors = {
    Apartamento: "bg-blue-50 text-blue-700",
    Casa: "bg-green-50 text-green-700",
    Terreno: "bg-amber-50 text-amber-700",
  };

  const finalidadeColors = {
    Venda: "bg-purple-50 text-purple-700",
    Aluguel: "bg-cyan-50 text-cyan-700",
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Imóveis</h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os imóveis cadastrados
          </p>
        </div>
        <Button variant="primary" className="mt-4 sm:mt-0">
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Imóvel
        </Button>
      </div>

      {/* Search - FILTROS INTERATIVOS */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* BUSCA POR TEXTO */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código (APT, CS, TER), endereço, bairro, cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm"
              />
            </div>
          </div>

          {/* FILTROS COM DROPDOWN */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro Tipo */}
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className="h-[42px] px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto"
            >
              <option value="">Todos os Tipos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
            </select>

            {/* Filtro Finalidade */}
            <select
              value={selectedFinalidade}
              onChange={(e) => setSelectedFinalidade(e.target.value)}
              className="h-[42px] px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto"
            >
              <option value="">Todas Finalidades</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>

            {/* Filtro Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-[42px] px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto"
            >
              <option value="">Todos Status</option>
              <option value="disponível">Disponível</option>
              <option value="vendido">Vendido</option>
              <option value="alugado">Alugado</option>
              <option value="reservado">Reservado</option>
            </select>

            {/* Filtro Cidade */}
            <select
              value={selectedCidade}
              onChange={(e) => setSelectedCidade(e.target.value)}
              className="h-[42px] px-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto"
            >
              <option value="">Todas Cidades</option>
              <option value="açailândia">Açailândia</option>
              <option value="imperatriz">Imperatriz</option>
              <option value="itinga">Itinga</option>
              <option value="dom eliseu">Dom Eliseu</option>
            </select>

            {/* Botão Limpar Filtros */}
            {(searchTerm ||
              selectedTipo ||
              selectedFinalidade ||
              selectedStatus ||
              selectedCidade) && (
              <button
                onClick={limparFiltros}
                className="h-[42px] px-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando{" "}
            <span className="font-semibold">{imoveisEncontrados}</span> de{" "}
            <span className="font-semibold">{totalImoveis}</span> imóveis
          </div>

          {/* Indicador de filtros ativos */}
          {(searchTerm ||
            selectedTipo ||
            selectedFinalidade ||
            selectedStatus ||
            selectedCidade) && (
            <div className="text-xs text-gray-500">
              Filtros ativos:
              {searchTerm && (
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded">
                  Busca: "{searchTerm}"
                </span>
              )}
              {selectedTipo && (
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded">
                  Tipo: {selectedTipo}
                </span>
              )}
              {selectedFinalidade && (
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded">
                  Finalidade: {selectedFinalidade}
                </span>
              )}
              {selectedStatus && (
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded">
                  Status: {selectedStatus}
                </span>
              )}
              {selectedCidade && (
                <span className="ml-2 px-2 py-1 bg-gray-100 rounded">
                  Cidade: {selectedCidade}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabela com imóveis filtrados */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {imoveisFiltrados.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-gray-400 mb-2">
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-600">
                {searchTerm ||
                selectedTipo ||
                selectedFinalidade ||
                selectedStatus ||
                selectedCidade
                  ? "Tente ajustar os filtros ou limpar todos para ver todos os imóveis."
                  : "Não há imóveis cadastrados no momento."}
              </p>
              {(searchTerm ||
                selectedTipo ||
                selectedFinalidade ||
                selectedStatus ||
                selectedCidade) && (
                <button
                  onClick={limparFiltros}
                  className="mt-4 px-4 py-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#D4A24D]/90 transition-colors"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-[60px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    ID
                  </th>
                  <th className="w-[90px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Código
                  </th>
                  <th className="w-[90px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Finalidade
                  </th>
                  <th className="w-[90px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Tipo
                  </th>
                  <th className="w-[160px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Endereço
                  </th>
                  <th className="w-[130px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Bairro
                  </th>
                  <th className="w-[130px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Cidade
                  </th>
                  <th className="w-[60px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Estado
                  </th>
                  <th className="w-[90px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Status
                  </th>
                  <th className="w-[130px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider border-r border-gray-200">
                    Preço
                  </th>
                  <th className="w-[120px] p-3 text-center text-xs font-semibold text-gray-800 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {imoveisFiltrados.map((imovel) => (
                  <tr key={imovel.id} className="hover:bg-gray-50">
                    {/* ID */}
                    <td className="w-[60px] p-3 text-center border-r border-gray-200">
                      <span className="font-medium text-gray-900 text-sm block">
                        {imovel.id}
                      </span>
                    </td>

                    {/* Código */}
                    <td className="w-[90px] p-3 text-center border-r border-gray-200">
                      <span className="text-gray-900 text-sm block">
                        {imovel.codigo}
                      </span>
                    </td>

                    {/* Finalidade */}
                    <td className="w-[90px] p-3 text-center border-r border-gray-200">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${finalidadeColors[imovel.finalidade]} inline-block whitespace-nowrap`}
                      >
                        {imovel.finalidade}
                      </span>
                    </td>

                    {/* Tipo */}
                    <td className="w-[90px] p-3 text-center border-r border-gray-200">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${tipoColors[imovel.tipo] || "bg-gray-100 text-gray-800"} inline-block whitespace-nowrap`}
                      >
                        {imovel.tipo}
                      </span>
                    </td>

                    {/* Endereço */}
                    <td className="w-[160px] p-3 text-center border-r border-gray-200">
                      <span className="text-gray-900 text-sm block">
                        {imovel.endereco}
                      </span>
                    </td>

                    {/* Bairro */}
                    <td className="w-[130px] p-3 text-center border-r border-gray-200">
                      <span className="text-gray-900 text-sm block">
                        {imovel.bairro}
                      </span>
                    </td>

                    {/* Cidade */}
                    <td className="w-[130px] p-3 text-center border-r border-gray-200">
                      <span className="text-gray-900 text-sm block">
                        {imovel.cidade}
                      </span>
                    </td>

                    {/* Estado */}
                    <td className="w-[60px] p-3 text-center border-r border-gray-200">
                      <span className="text-gray-900 text-sm block">
                        {imovel.estado}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="w-[90px] p-3 text-center border-r border-gray-200">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[imovel.status]} inline-block whitespace-nowrap`}
                      >
                        {imovel.status}
                      </span>
                    </td>

                    {/* Preço */}
                    <td className="w-[130px] p-3 text-center border-r border-gray-200">
                      <span className="text-gray-900 text-sm block">
                        {imovel.preco}
                      </span>
                    </td>

                    {/* Ações */}
                    <td className="w-[120px] p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Botão Visualizar Performance */}
                        <BotaoVisualizarPerformance imovel={imovel} />

                        {/* Botão Editar */}
                        <div className="relative group">
                          <button
                            className="p-1.5 bg-gradient-to-r from-[#D4A24D] to-[#C19137] text-white rounded-lg hover:from-[#C19137] hover:to-[#A87822] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#D4A24D] focus:ring-offset-2 shadow-sm"
                            title="Editar"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-10">
                            Editar
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>

                        {/* Botão Excluir */}
                        <div className="relative group">
                          <button
                            className="p-1.5 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
                            title="Excluir"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-10">
                            Excluir
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Imoveis;
