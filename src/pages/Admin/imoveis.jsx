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
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";

// Componente Modal Performance
const ModalPerformanceImovel = ({ imovel, onClose, onAction }) => {
  // Estado para controlar a visibilidade do tooltip de informação
  const [showTooltipInfo, setShowTooltipInfo] = useState(false);

  // Estado local para controlar se o imóvel foi marcado como vendido DURANTE esta sessão do modal
  // INICIA SEMPRE COMO FALSE - NUNCA baseado no status do imóvel
  const [localMarcadoComoVendido, setLocalMarcadoComoVendido] = useState(false);

  // Dados de performance mockados - DINÂMICOS baseado no estado de desempenho do imóvel
  const getMetricsData = () => {
    // Se o imóvel foi marcado como vendido, ajusta os dados
    if (localMarcadoComoVendido) {
      return {
        visualizacoes: 247,
        cliquesWhatsApp: 48,
        solicitacoesVisita: 12,
        interessadosAtivos: 0, // Zera interessados ativos quando vendido
        status: "VENDIDO",
        tempoNegociacao: "Concluído",
        ultimaAtualizacao: "Agora mesmo",
        engajamentoCalculado: 150, // Engajamento alto quando vendido
      };
    }

    // Agora usamos o campo 'desempenho' do imóvel para determinar os dados
    switch (imovel.desempenho) {
      case "Excelente": // Engajamento ≥ 120%
        return {
          visualizacoes: 247,
          cliquesWhatsApp: 48,
          solicitacoesVisita: 12,
          interessadosAtivos: 3,
          status: "Em Negociação",
          tempoNegociacao: "10 dias",
          ultimaAtualizacao: "2 horas atrás",
          engajamentoCalculado: 125, // Valor fixo para demonstração
        };
      case "Saudável": // Engajamento 80-119%
        return {
          visualizacoes: 180,
          cliquesWhatsApp: 18,
          solicitacoesVisita: 4,
          interessadosAtivos: 2,
          status: "Disponível",
          tempoNegociacao: "5 dias",
          ultimaAtualizacao: "1 hora atrás",
          engajamentoCalculado: 95,
        };
      case "Atenção": // Engajamento 50-79%
        return {
          visualizacoes: 150,
          cliquesWhatsApp: 10,
          solicitacoesVisita: 2,
          interessadosAtivos: 1,
          status: "Disponível",
          tempoNegociacao: "15 dias",
          ultimaAtualizacao: "3 horas atrás",
          engajamentoCalculado: 65,
        };
      case "Crítico": // Engajamento < 50%
        return {
          visualizacoes: 200,
          cliquesWhatsApp: 6,
          solicitacoesVisita: 1,
          interessadosAtivos: 0,
          status: "Disponível",
          tempoNegociacao: "30 dias",
          ultimaAtualizacao: "5 horas atrás",
          engajamentoCalculado: 35,
        };
      default: // Default - Excelente
        return {
          visualizacoes: 247,
          cliquesWhatsApp: 48,
          solicitacoesVisita: 12,
          interessadosAtivos: 3,
          status: "Em Negociação",
          tempoNegociacao: "10 dias",
          ultimaAtualizacao: "2 horas atrás",
          engajamentoCalculado: 125,
        };
    }
  };

  const [metricsData, setMetricsData] = useState(getMetricsData());

  // Atualiza os dados quando o estado de vendido muda
  React.useEffect(() => {
    setMetricsData(getMetricsData());
  }, [localMarcadoComoVendido]);

  // Cálculo do engajamento baseado na regra de negócio
  const calcularEngajamento = () => {
    // Retorna o engajamento pré-calculado baseado no estado
    return metricsData.engajamentoCalculado;
  };

  const engajamento = calcularEngajamento();

  // Função para determinar classificação do desempenho
  const getClassificacaoDesempenho = () => {
    // Se foi vendido, sempre mostra como Excelente
    if (localMarcadoComoVendido) {
      return {
        label: "Excelente",
        texto: "Imóvel vendido com sucesso!",
        cor: "text-green-700",
        corIcone: "text-yellow-500",
        bgIcone: "bg-yellow-50",
        Icone: StarIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-2",
      };
    }

    if (engajamento >= 120) {
      return {
        label: "Excelente",
        texto: "Resultado acima do esperado",
        cor: "text-green-700",
        corIcone: "text-yellow-500",
        bgIcone: "bg-yellow-50",
        Icone: StarIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-2", // MARGEM REDUZIDA
      };
    } else if (engajamento >= 80) {
      return {
        label: "Saudável",
        texto: "Dentro da meta esperada",
        cor: "text-blue-700",
        corIcone: "text-green-500",
        bgIcone: "bg-green-50",
        Icone: CheckCircleIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-2", // MARGEM REDUZIDA
      };
    } else if (engajamento >= 50) {
      return {
        label: "Atenção",
        texto: "Abaixo do potencial esperado",
        cor: "text-amber-700",
        corIcone: "text-black",
        bgIcone: "bg-amber-100",
        Icone: ExclamationTriangleIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-1", // MARGEM MUITO REDUZIDA (para Atenção)
      };
    } else {
      return {
        label: "Crítico",
        texto: "Alto tráfego com baixa conversão",
        cor: "text-red-700",
        corIcone: "text-red-500",
        bgIcone: "bg-red-50",
        Icone: ExclamationCircleIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-2", // MARGEM REDUZIDA
      };
    }
  };

  const classificacao = getClassificacaoDesempenho();
  const ClassificacaoIcon = classificacao.Icone;

  // Determinar cor e ícone do engajamento para outros usos
  const getEngajamentoInfo = () => {
    if (localMarcadoComoVendido || engajamento >= 120) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: ArrowTrendingUpIcon,
        label: "Alto Engajamento",
      };
    } else if (engajamento >= 80) {
      return {
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        icon: ArrowTrendingUpIcon,
        label: "Bom Engajamento",
      };
    } else if (engajamento >= 50) {
      return {
        color: "text-amber-600",
        bgColor: "bg-amber-100",
        icon: ArrowTrendingDownIcon,
        label: "Engajamento Médio",
      };
    } else {
      return {
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: ExclamationTriangleIcon,
        label: "Baixo Engajamento",
      };
    }
  };

  // Gerar insights dinâmicos baseados no engajamento
  const gerarInsights = () => {
    const insights = [];

    // Insight especial para imóvel vendido
    if (localMarcadoComoVendido) {
      insights.push("✅ Imóvel vendido com sucesso!");
      insights.push("🎉 Parabéns pela venda concluída!");
      insights.push("📊 Este imóvel teve excelente performance comercial.");
      return insights;
    }

    // Insight baseado no engajamento
    if (engajamento >= 120) {
      insights.push(
        "Imóvel está convertendo acima do esperado para o volume de tráfego.",
      );
    } else if (engajamento >= 80) {
      insights.push("Imóvel dentro da média esperada de conversão.");
    } else if (engajamento >= 50) {
      insights.push(
        "Imóvel abaixo do potencial esperado. Avaliar ajustes no anúncio.",
      );
    } else {
      insights.push(
        "Alto tráfego com baixa conversão. Ação corretiva recomendada.",
      );
    }

    // Insight fixo sobre interessados
    if (metricsData.interessadosAtivos > 0) {
      insights.push(
        `${metricsData.interessadosAtivos} interessado(s) ativo(s) necessitam follow-up imediato.`,
      );
    }

    // Insight adicional baseado em métricas
    const taxaConversao = (
      ((metricsData.cliquesWhatsApp + metricsData.solicitacoesVisita) /
        metricsData.visualizacoes) *
      100
    ).toFixed(1);
    if (taxaConversao > 10) {
      insights.push("Taxa de conversão excepcional (acima de 10%).");
    }

    return insights;
  };

  const insights = gerarInsights();
  const engajamentoInfo = getEngajamentoInfo();
  const EngajamentoIcon = engajamentoInfo.icon;

  // Dados do imóvel com imagem NOVA
  const imovelCompleto = {
    ...imovel,
    // NOVA IMAGEM DO LINK QUE VOCÊ ENVIOU
    imagemUrl:
      "https://adventusimobiliaria.com.br/img/imovei/filename/5/WhatsApp%20Image%202022-09-19%20at%2016.39.15.jpeg",
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
      bgLight: "bg-[#FEF3C7]", // Amarelo claro da paleta
      text: "text-[#B45309]",
      border: "border-[#F59E0B]",
      gradient: "from-[#D4A24D]/20 to-transparent",
    },
  };

  // Componente de Card de Métrica com cores sutis
  const MetricCard = ({ icon: Icon, value, label, color }) => (
    <div
      className={`p-3 rounded-xl border ${color.border} ${color.bg} transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color.iconBg} ${color.iconText}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          {/* Número na cor azul noturno da paleta */}
          <div className="text-xl font-bold text-[#0F172A]">
            {value.toLocaleString()}
          </div>
          <div className="text-xs text-gray-600 mt-1">{label}</div>
        </div>
      </div>
    </div>
  );

  // Função para lidar com o clique em "Marcar como vendido"
  const handleMarcarComoVendido = () => {
    // Primeiro atualiza o estado local
    setLocalMarcadoComoVendido(true);

    // Chama a função de ação passada como prop
    if (onAction) {
      onAction("marcarVendido", imovel.id);
    }

    // NÃO FECHA O MODAL - permanece aberto
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      {/* ALTURA ORIGINAL RESTAURADA: max-h-[90vh] */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-300">
        {/* HEADER com Banner - ALTURA ORIGINAL RESTAURADA: h-56 */}
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
                {localMarcadoComoVendido && " - VENDIDO"}
              </p>
            </div>
          </div>

          {/* Botão Fechar - EM AMARELO */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#C19137] transition-all duration-200 shadow-md border border-amber-600"
            title="Fechar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL - PADDING ORIGINAL RESTAURADO: p-6 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Localização e Preço com Divisória - ENDEREÇO EM UMA LINHA */}
          <div className="mb-6">
            {/* Divisória sutil */}
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-between items-center">
                <div className="bg-white pr-4">
                  <div className="text-3xl font-bold text-gray-900">
                    {imovelCompleto.preco}
                    {localMarcadoComoVendido && (
                      <span className="text-green-600 text-sm ml-2">
                        ✓ VENDIDO
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-white pl-4">
                  <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">
                    Valor do imóvel
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço - NOVO FORMATO EM UMA LINHA COM DIVISÓRIA E BAIRRO */}
            <div className="flex flex-wrap items-center gap-1.5 text-sm text-gray-700">
              <div className="font-medium text-gray-900">
                {imovelCompleto.endereco}
              </div>
              <span className="text-gray-400">•</span>
              <div className="text-gray-600">{imovelCompleto.bairro}</div>
              <span className="text-gray-400">|</span>
              <div className="font-medium text-gray-900">
                {imovelCompleto.cidade} - {imovelCompleto.estado}
              </div>
            </div>
          </div>

          {/* GRID DE MÉTRICAS - Cores suaves com fundo */}
          <div className="mb-6">
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
              {/* MUDANÇA: Interessados Ativos EM VERMELHO */}
              <MetricCard
                icon={UserGroupIcon}
                value={metricsData.interessadosAtivos}
                label="Interessados Ativos"
                color={{
                  bg: "bg-gradient-to-br from-red-50 to-red-100/80",
                  border: "border-red-200",
                  iconBg: "bg-red-100",
                  iconText: "text-red-600",
                }}
              />
            </div>
            <div className="text-xs text-gray-500 mt-3 text-center">
              Última atualização: {metricsData.ultimaAtualizacao}
            </div>
          </div>

          {/* BLOCO DE DECISÃO - CORREÇÕES FINAIS AQUI (AGORA CORRETO) */}
          <div className="mb-6">
            <div
              className={`rounded-xl p-5 ${palette.amareloDourado.bgLight} border ${palette.amareloDourado.border}`}
            >
              <div className="flex items-center justify-between">
                {/* Coluna 1: Status e Tempo - CORRIGIDA DEFINITIVAMENTE */}
                <div className="flex-1 pr-6 border-r border-amber-300">
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    {/* APENAS STATUS SEM ÍCONE DE CLASSIFICAÇÃO */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        Status
                      </div>
                      {/* Status dinâmico - muda para VENDIDO quando marcado */}
                      <div
                        className={`px-3 py-1 ${localMarcadoComoVendido ? "bg-green-600 text-white" : palette.azulNoturno.bgLight + " text-white"} text-sm font-medium rounded-full uppercase`}
                      >
                        {localMarcadoComoVendido
                          ? "VENDIDO"
                          : metricsData.status}
                      </div>
                    </div>

                    {/* Dias de negociação EM UMA LINHA SÓ COM ÍCONE DE RELÓGIO */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-700">
                      <ClockIcon className="w-4 h-4" />
                      <span>
                        <span className="font-medium">
                          {localMarcadoComoVendido
                            ? "Concluído"
                            : metricsData.tempoNegociacao}
                        </span>{" "}
                        {localMarcadoComoVendido
                          ? "negociação"
                          : "em negociação"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Conversão */}
                <div className="flex-1 px-6 border-r border-amber-300">
                  <div className="mb-2">
                    <div className="text-sm font-medium text-gray-700 mb-1">
                      Conversão
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {engajamento}%
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden mb-1">
                    <div
                      className={`h-full ${localMarcadoComoVendido || engajamento >= 100 ? "bg-green-500" : engajamento >= 80 ? "bg-blue-500" : engajamento >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(engajamento / 5, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">
                    Meta: <span className="font-medium">5%</span> de conversão
                  </div>
                </div>

                {/* Coluna 3: Resultado - AQUI FICAM OS ÍCONES DE CLASSIFICAÇÃO */}
                <div className="flex-1 pl-6">
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    {/* Ícone de classificação - MARGEM AJUSTADA (especialmente para "Atenção") */}
                    <div className={`${classificacao.marginBottom || "mb-2"}`}>
                      <div
                        className={`p-1.5 rounded-lg ${classificacao.bgIcone} ${classificacao.corIcone} flex items-center justify-center mx-auto`}
                      >
                        <ClassificacaoIcon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Texto da classificação */}
                    <div className="mb-2">
                      <div className={`text-lg font-bold ${classificacao.cor}`}>
                        {classificacao.label}
                      </div>
                    </div>

                    {/* Descrição */}
                    <div className="mb-3">
                      <div className="text-sm text-gray-700">
                        {classificacao.texto}
                      </div>
                    </div>

                    {/* Comparativo */}
                    <div className="text-xs text-gray-600">
                      Esperado: <span className="font-medium">24%</span> |
                      Alcançado:{" "}
                      <span className="font-medium">{engajamento}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INSIGHTS RÁPIDOS DINÂMICOS */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              📊 Insights Rápidos
            </h4>
            <div className="space-y-3">
              {insights.map((insight, index) => {
                // Determinar cor e ícone baseado no tipo de insight
                let Icon = CheckCircleIcon;
                let bgColor = "from-blue-50 to-blue-50/50";
                let borderColor = "border-blue-200";
                let textColor = "text-gray-700";

                if (localMarcadoComoVendido) {
                  Icon = CheckBadgeIcon;
                  bgColor = "from-green-50 to-green-50/50";
                  borderColor = "border-green-200";
                  textColor = "text-green-700";
                } else if (
                  insight.includes("acima do esperado") ||
                  insight.includes("excepcional")
                ) {
                  Icon = ArrowTrendingUpIcon;
                  bgColor = "from-green-50 to-green-50/50";
                  borderColor = "border-green-200";
                  textColor = "text-green-700";
                } else if (
                  insight.includes("abaixo") ||
                  insight.includes("baixa conversão")
                ) {
                  Icon = ExclamationTriangleIcon;
                  bgColor = "from-red-50 to-red-50/50";
                  borderColor = "border-red-200";
                  textColor = "text-red-700";
                } else if (
                  insight.includes("interessado") ||
                  insight.includes("follow-up")
                ) {
                  Icon = UserGroupIcon;
                  bgColor = "from-amber-50 to-amber-50/50";
                  borderColor = "border-amber-200";
                  textColor = "text-amber-700";
                }

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 bg-gradient-to-r ${bgColor} rounded-lg border ${borderColor}`}
                  >
                    <Icon className={`w-5 h-5 ${textColor} flex-shrink-0`} />
                    <span className={`text-sm ${textColor}`}>{insight}</span>
                  </div>
                );
              })}
            </div>

            {/* Nota sobre métricas */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="text-xs text-gray-500 text-center italic">
                <span className="text-gray-600 font-medium">
                  * Classificação automática baseada no engajamento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AÇÕES - Footer COM BOTÃO "MARCAR COMO VENDIDO" ATUALIZADO */}
        <div className="border-t border-gray-300 p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 relative">
          {/* Tooltip de Informação sobre o cálculo */}
          {showTooltipInfo && (
            <div className="absolute bottom-full left-4 mb-2 w-80 bg-white border border-gray-300 rounded-lg shadow-xl z-50 p-4">
              {/* Seta do tooltip */}
              <div className="absolute top-full left-6 transform -translate-x-1/2 border-8 border-transparent border-t-white"></div>

              <div className="space-y-3">
                {/* Título */}
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 rounded-lg">
                    <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h5 className="font-bold text-gray-900 text-sm">
                    Índice de Performance Comercial
                  </h5>
                </div>

                {/* Descrição */}
                <p className="text-gray-700 text-sm">
                  Este indicador mostra o nível de interesse real gerado por
                  este imóvel com base nas interações dos usuários.
                </p>

                {/* Critérios de pontuação */}
                <div>
                  <h6 className="font-semibold text-gray-800 text-sm mb-1">
                    Critérios de pontuação:
                  </h6>
                  <ul className="text-gray-700 text-sm space-y-1 ml-2">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span>
                        <strong>Visualização do imóvel:</strong> 1 ponto
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span>
                        <strong>Clique no WhatsApp:</strong> 10 pontos
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>
                        <strong>Solicitação de visita:</strong> 50 pontos
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Regra de cálculo */}
                <div>
                  <h6 className="font-semibold text-gray-800 text-sm mb-1">
                    Regra de cálculo:
                  </h6>
                  <p className="text-gray-700 text-sm">
                    A meta de 100% é atingida quando 5% do total de
                    visualizações se convertem em ações comerciais ponderadas
                    por pontuação.
                  </p>
                </div>

                {/* Observação */}
                <div className="pt-2 border-t border-gray-200">
                  <p className="text-gray-700 text-sm italic">
                    <strong>Observação:</strong> Quanto maior o índice, maior o
                    potencial de conversão comercial do imóvel.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* RETÂNGULO ARREDONDADO COM TEXTO E ÍCONE - AMARELO CLARO DA PALETA */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-300 bg-amber-50 transition-all duration-200 hover:bg-amber-100 hover:border-amber-400 cursor-help"
              onMouseEnter={() => setShowTooltipInfo(true)}
              onMouseLeave={() => setShowTooltipInfo(false)}
              onTouchStart={() => setShowTooltipInfo(!showTooltipInfo)}
            >
              {/* Ícone de informação */}
              <div className="p-1 bg-amber-100 border border-amber-200 rounded-md">
                <InformationCircleIcon className="w-3.5 h-3.5 text-amber-700" />
              </div>

              {/* Texto "Como calculamos a conversão" */}
              <span className="text-xs font-medium text-amber-800 whitespace-nowrap">
                Como calculamos a conversão
              </span>
            </div>

            {/* Botões com mesma altura - ESPAÇAMENTO AJUSTADO */}
            <div className="flex items-center gap-3">
              {/* Botão Fechar - Azul noturno - MAIS PARA A ESQUERDA */}
              <button
                onClick={onClose}
                className={`px-4 py-2.5 text-white ${palette.azulNoturno.bg} border ${palette.azulNoturno.border} rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2 mr-2`}
              >
                <XMarkIcon className="w-4 h-4" />
                Fechar
              </button>

              {/* Botão Marcar como Vendido / VENDIDO - ESTADO DINÂMICO */}
              <button
                onClick={handleMarcarComoVendido}
                disabled={localMarcadoComoVendido}
                className={`px-4 py-2.5 ${localMarcadoComoVendido ? "bg-green-600 text-white hover:bg-green-700 cursor-default" : "bg-white text-gray-800 border border-gray-400 hover:bg-gray-50"} rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2 ${localMarcadoComoVendido ? "opacity-90" : ""}`}
              >
                {localMarcadoComoVendido ? (
                  <>
                    <CheckBadgeIcon className="w-4 h-4" />
                    VENDIDO
                  </>
                ) : (
                  <>
                    <CheckBadgeIcon className="w-4 h-4 text-green-600" />
                    Marcar como vendido
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente Wrapper para o botão Desempenho
const BotaoDesempenho = ({ imovel }) => {
  const [modalAberto, setModalAberto] = useState(false);

  const handleAcaoModal = (acao, imovelId) => {
    console.log(`Ação: ${acao} no imóvel ID: ${imovelId}`);

    if (acao === "marcarVendido") {
      // Aqui você implementaria a lógica de ação (API call, etc.)
      // Atualizar o status do imóvel no backend
      // NÃO fecha o modal aqui - isso é controlado dentro do modal
    }
  };

  return (
    <>
      {/* Botão Desempenho na tabela */}
      <div className="relative group">
        <button
          onClick={() => setModalAberto(true)}
          className="p-1.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 shadow-sm"
          title="Desempenho"
        >
          <ChartBarIcon className="w-4 h-4" />
        </button>
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap z-10">
          Desempenho
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

// Componente principal Imoveis
const Imoveis = () => {
  // Estados para os filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedFinalidade, setSelectedFinalidade] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCidade, setSelectedCidade] = useState("");

  // Dados dos imóveis - COM OS 4 ESTADOS BEM DISTRIBUÍDOS
  const imoveisData = [
    // GRUPO 1: EXCELENTE (IDs 1-3) - engajamento ≥ 120%
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
      desempenho: "Excelente",
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
      desempenho: "Excelente",
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
      status: "Vendido", // Este é vendido na tabela, mas no modal começa como disponível
      preco: "R$ 180.000,00",
      desempenho: "Excelente",
    },

    // GRUPO 2: SAUDÁVEL (IDs 4-6) - engajamento 80-119%
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
      desempenho: "Saudável",
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
      desempenho: "Saudável",
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
      desempenho: "Saudável",
    },

    // GRUPO 3: ATENÇÃO (IDs 7-9) - engajamento 50-79%
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
      desempenho: "Atenção",
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
      desempenho: "Atenção",
    },
    {
      id: 9,
      codigo: "CS-009",
      finalidade: "Venda",
      tipo: "Casa",
      endereco: "Rua das Palmeiras, 321",
      bairro: "Jardim Europa",
      cidade: "Açailândia",
      estado: "MA",
      status: "Disponível",
      preco: "R$ 280.000,00",
      desempenho: "Atenção",
    },

    // GRUPO 4: CRÍTICO (IDs 10-12) - engajamento < 50%
    {
      id: 10,
      codigo: "APT-010",
      finalidade: "Aluguel",
      tipo: "Apartamento",
      endereco: "Rua dos Ipês, 789",
      bairro: "Centro",
      cidade: "Imperatriz",
      estado: "MA",
      status: "Disponível",
      preco: "R$ 1.050,00/mês",
      desempenho: "Crítico",
    },
    {
      id: 11,
      codigo: "TER-011",
      finalidade: "Venda",
      tipo: "Terreno",
      endereco: "Av. Principal, 1500",
      bairro: "Vila Nova",
      cidade: "Itinga",
      estado: "MA",
      status: "Disponível",
      preco: "R$ 75.000,00",
      desempenho: "Crítico",
    },
    {
      id: 12,
      codigo: "CS-012",
      finalidade: "Venda",
      tipo: "Casa",
      endereco: "Rua Nova Esperança, 550",
      bairro: "Centro",
      cidade: "Dom Eliseu",
      estado: "PA",
      status: "Disponível",
      preco: "R$ 190.000,00",
      desempenho: "Crítico",
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
                        {/* Botão Desempenho */}
                        <BotaoDesempenho imovel={imovel} />

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
