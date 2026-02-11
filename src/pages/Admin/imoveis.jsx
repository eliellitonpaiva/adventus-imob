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
import { useTheme } from "../../contexts/ThemeContext";

// ADICIONE ESTE IMPORT:
import { useNavigate } from "react-router-dom";

// Adicionando ícone de Troféu
import { TrophyIcon } from "@heroicons/react/24/outline";

// Componente Modal Performance
const ModalPerformanceImovel = ({ imovel, onClose, onAction }) => {
  const { isDark } = useTheme();

  // Estado para controlar a visibilidade do tooltip de informação
  const [showTooltipInfo, setShowTooltipInfo] = useState(false);

  // Estado local para controlar se o imóvel foi marcado como vendido DURANTE esta sessão do modal
  const [localMarcadoComoVendido, setLocalMarcadoComoVendido] = useState(false);

  // Dados de performance mockados - DINÂMICOS baseado no estado de desempenho do imóvel
  const getMetricsData = () => {
    // Se o imóvel foi marcado como vendido, ajusta os dados
    if (localMarcadoComoVendido) {
      return {
        visualizacoes: 247,
        cliquesWhatsApp: 48,
        solicitacoesVisita: 12,
        interessadosAtivos: 0,
        status: "VENDIDO",
        tempoNegociacao: "Concluído",
        ultimaAtualizacao: "Agora mesmo",
        engajamentoCalculado: 150,
      };
    }

    // Agora usamos o campo 'desempenho' do imóvel para determinar os dados
    switch (imovel.desempenho) {
      case "Destaque":
        // Verifica qual imóvel para definir o valor exato
        if (imovel.id === 1) {
          return {
            visualizacoes: 320,
            cliquesWhatsApp: 78,
            solicitacoesVisita: 25,
            interessadosAtivos: 5,
            status: "Em Negociação",
            tempoNegociacao: "3 dias",
            ultimaAtualizacao: "1 hora atrás",
            engajamentoCalculado: 158, // Faixa Destaque: ≥150%
          };
        } else if (imovel.id === 3) {
          return {
            visualizacoes: 285,
            cliquesWhatsApp: 65,
            solicitacoesVisita: 18,
            interessadosAtivos: 4,
            status: "Vendido",
            tempoNegociacao: "Concluído",
            ultimaAtualizacao: "2 horas atrás",
            engajamentoCalculado: 162, // Faixa Destaque: ≥150%
          };
        } else {
          // Fallback para outros imóveis Destaque
          return {
            visualizacoes: 320,
            cliquesWhatsApp: 78,
            solicitacoesVisita: 25,
            interessadosAtivos: 5,
            status: "Em Negociação",
            tempoNegociacao: "3 dias",
            ultimaAtualizacao: "1 hora atrás",
            engajamentoCalculado: 158,
          };
        }
      case "Excelente":
        return {
          visualizacoes: 247,
          cliquesWhatsApp: 48,
          solicitacoesVisita: 12,
          interessadosAtivos: 3,
          status: "Em Negociação",
          tempoNegociacao: "10 dias",
          ultimaAtualizacao: "2 horas atrás",
          engajamentoCalculado: 125, // Faixa Excelente: 120-149%
        };
      case "Saudável":
        return {
          visualizacoes: 180,
          cliquesWhatsApp: 18,
          solicitacoesVisita: 4,
          interessadosAtivos: 2,
          status: "Disponível",
          tempoNegociacao: "5 dias",
          ultimaAtualizacao: "1 hora atrás",
          engajamentoCalculado: 107, // Faixa Saudável: 100-119%
        };
      case "Atenção":
        return {
          visualizacoes: 150,
          cliquesWhatsApp: 10,
          solicitacoesVisita: 2,
          interessadosAtivos: 1,
          status: "Disponível",
          tempoNegociacao: "15 dias",
          ultimaAtualizacao: "3 horas atrás",
          engajamentoCalculado: 85, // Faixa Atenção: 80-99%
        };
      case "Crítico":
        return {
          visualizacoes: 200,
          cliquesWhatsApp: 6,
          solicitacoesVisita: 1,
          interessadosAtivos: 0,
          status: "Disponível",
          tempoNegociacao: "30 dias",
          ultimaAtualizacao: "5 horas atrás",
          engajamentoCalculado: 35, // Faixa Crítico: 0-79%
        };
      default:
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
    return metricsData.engajamentoCalculado;
  };

  const engajamento = calcularEngajamento();

  // Função para determinar classificação do desempenho
  const getClassificacaoDesempenho = () => {
    // Se foi vendido, sempre mostra como Destaque
    if (localMarcadoComoVendido) {
      return {
        label: "Destaque",
        texto: "Imóvel vendido com sucesso!",
        cor: "text-green-700",
        corIcone: "text-yellow-500",
        bgIcone: "bg-yellow-50",
        Icone: TrophyIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-2",
      };
    }

    // NOVAS FAIXAS SEGUNDO ESPECIFICAÇÃO:
    // 0% a 79%  → Status: "Crítico"
    // 80% a 99% → Status: "Atenção"
    // 100% a 119% → Status: "Saudável"
    // 120% a 149% → Status: "Excelente"
    // 150% ou mais → Status: "Destaque"
    if (engajamento >= 150) {
      return {
        label: "Destaque",
        texto: "Resultado excepcional fora da curva",
        cor: "text-green-700",
        corIcone: "text-yellow-600",
        bgIcone: "bg-yellow-50",
        Icone: TrophyIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-2",
      };
    } else if (engajamento >= 120) {
      return {
        label: "Excelente",
        texto: "Resultado acima do esperado",
        cor: "text-green-700",
        corIcone: "text-yellow-500",
        bgIcone: "bg-yellow-50",
        Icone: StarIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-2",
      };
    } else if (engajamento >= 100) {
      return {
        label: "Saudável",
        texto: "Dentro da meta esperada",
        cor: "text-blue-700",
        corIcone: "text-green-500",
        bgIcone: "bg-green-50",
        Icone: CheckCircleIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-2",
      };
    } else if (engajamento >= 80) {
      return {
        label: "Atenção",
        texto: "Abaixo do potencial esperado",
        cor: "text-amber-700",
        corIcone: "text-black",
        bgIcone: "bg-amber-100",
        Icone: ExclamationTriangleIcon,
        iconSize: "w-5 h-5",
        marginBottom: "mb-1",
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
        marginBottom: "mb-2",
      };
    }
  };

  const classificacao = getClassificacaoDesempenho();
  const ClassificacaoIcon = classificacao.Icone;

  // Determinar cor e ícone do engajamento para outros usos
  const getEngajamentoInfo = () => {
    if (localMarcadoComoVendido || engajamento >= 150) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: ArrowTrendingUpIcon,
        label: "Engajamento Excepcional",
      };
    } else if (engajamento >= 120) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: ArrowTrendingUpIcon,
        label: "Alto Engajamento",
      };
    } else if (engajamento >= 100) {
      return {
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        icon: ArrowTrendingUpIcon,
        label: "Bom Engajamento",
      };
    } else if (engajamento >= 80) {
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
    } else if (engajamento >= 100) {
      insights.push("Imóvel dentro da média esperada de conversão.");
    } else if (engajamento >= 80) {
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

  // Dados do imóvel com imagem
  const imovelCompleto = {
    ...imovel,
    imagemUrl:
      "https://adventusimobiliaria.com.br/img/imovei/filename/5/WhatsApp%20Image%202022-09-19%20at%2016.39.15.jpeg",
  };

  // Paleta de cores Advents
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
      className={`p-3 rounded-xl border ${color.border} ${color.bg} transition-all duration-200 hover:scale-[1.02] hover:shadow-md ${isDark ? "dark:border-gray-700" : ""}`}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color.iconBg} ${color.iconText}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div
            className={`text-xl font-bold ${isDark ? "text-gray-200" : "text-[#0F172A]"}`}
          >
            {value.toLocaleString()}
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mt-1`}
          >
            {label}
          </div>
        </div>
      </div>
    </div>
  );

  // Função para lidar com o clique em "Marcar como vendido"
  const handleMarcarComoVendido = () => {
    setLocalMarcadoComoVendido(true);
    if (onAction) {
      onAction("marcarVendido", imovel.id);
    }
  };

  return (
    <div
      className={`fixed inset-0 ${isDark ? "bg-black/80" : "bg-black/60"} flex items-center justify-center z-50 p-4 backdrop-blur-sm`}
    >
      <div
        className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border`}
      >
        {/* HEADER com Banner */}
        <div className="relative">
          <div className="h-56 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
            <img
              src={imovelCompleto.imagemUrl}
              alt={imovelCompleto.codigo}
              className="w-full h-full object-cover opacity-90"
            />
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

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#C19137] transition-all duration-200 shadow-md border border-amber-600"
            title="Fechar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Localização e Preço com Divisória */}
          <div className="mb-6">
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div
                  className={`w-full border-t ${isDark ? "border-gray-700" : "border-gray-300"}`}
                ></div>
              </div>
              <div className="relative flex justify-between items-center">
                <div className={`${isDark ? "bg-gray-900" : "bg-white"} pr-4`}>
                  <div
                    className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                  >
                    {imovelCompleto.preco}
                    {localMarcadoComoVendido && (
                      <span className="text-green-600 text-sm ml-2">
                        ✓ VENDIDO
                      </span>
                    )}
                  </div>
                </div>
                <div className={`${isDark ? "bg-gray-900" : "bg-white"} pl-4`}>
                  <div
                    className={`text-sm ${isDark ? "text-gray-400 bg-gray-800" : "text-gray-600 bg-gray-50"} px-3 py-1 rounded-lg`}
                  >
                    Valor do imóvel
                  </div>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="flex flex-wrap items-center gap-1.5 text-sm">
              <div
                className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                {imovelCompleto.endereco}
              </div>
              <span className={isDark ? "text-gray-600" : "text-gray-400"}>
                •
              </span>
              <div className={isDark ? "text-gray-400" : "text-gray-600"}>
                {imovelCompleto.bairro}
              </div>
              <span className={isDark ? "text-gray-600" : "text-gray-400"}>
                |
              </span>
              <div
                className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
              >
                {imovelCompleto.cidade} - {imovelCompleto.estado}
              </div>
            </div>
          </div>

          {/* GRID DE MÉTRICAS */}
          <div className="mb-6">
            <h3
              className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"} uppercase tracking-wider mb-4`}
            >
              Performance Comercial
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                icon={EyeIcon}
                value={metricsData.visualizacoes}
                label="Visualizações"
                color={{
                  bg: isDark
                    ? "bg-gray-800"
                    : "bg-gradient-to-br from-blue-50 to-blue-100/80",
                  border: isDark ? "border-gray-700" : "border-blue-200",
                  iconBg: isDark ? "bg-blue-900/50" : "bg-blue-100",
                  iconText: "text-blue-600",
                }}
              />
              <MetricCard
                icon={ChatBubbleLeftRightIcon}
                value={metricsData.cliquesWhatsApp}
                label="Cliques WhatsApp"
                color={{
                  bg: isDark
                    ? "bg-gray-800"
                    : "bg-gradient-to-br from-green-50 to-green-100/80",
                  border: isDark ? "border-gray-700" : "border-green-200",
                  iconBg: isDark ? "bg-green-900/50" : "bg-green-100",
                  iconText: "text-green-600",
                }}
              />
              <MetricCard
                icon={CalendarDaysIcon}
                value={metricsData.solicitacoesVisita}
                label="Solicitações Visita"
                color={{
                  bg: isDark
                    ? "bg-gray-800"
                    : "bg-gradient-to-br from-purple-50 to-purple-100/80",
                  border: isDark ? "border-gray-700" : "border-purple-200",
                  iconBg: isDark ? "bg-purple-900/50" : "bg-purple-100",
                  iconText: "text-purple-600",
                }}
              />
              <MetricCard
                icon={UserGroupIcon}
                value={metricsData.interessadosAtivos}
                label="Interessados Ativos"
                color={{
                  bg: isDark
                    ? "bg-gray-800"
                    : "bg-gradient-to-br from-red-50 to-red-100/80",
                  border: isDark ? "border-gray-700" : "border-red-200",
                  iconBg: isDark ? "bg-red-900/50" : "bg-red-100",
                  iconText: "text-red-600",
                }}
              />
            </div>
            <div
              className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"} mt-3 text-center`}
            >
              Última atualização: {metricsData.ultimaAtualizacao}
            </div>
          </div>

          {/* BLOCO DE DECISÃO */}
          <div className="mb-6">
            <div
              className={`rounded-xl p-5 ${palette.amareloDourado.bgLight} border ${palette.amareloDourado.border} ${isDark ? "dark:bg-amber-900/20 dark:border-amber-800" : ""}`}
            >
              <div className="flex items-center justify-between">
                {/* Coluna 1: Status e Tempo */}
                <div className="flex-1 pr-6 border-r border-amber-300">
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className="mb-4">
                      <div
                        className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
                      >
                        Status
                      </div>
                      <div
                        className={`px-3 py-1 ${localMarcadoComoVendido ? "bg-green-600 text-white" : palette.azulNoturno.bgLight + " text-white"} text-sm font-medium rounded-full uppercase`}
                      >
                        {localMarcadoComoVendido
                          ? "VENDIDO"
                          : metricsData.status}
                      </div>
                    </div>

                    <div
                      className={`flex items-center justify-center gap-2 text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
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
                    <div
                      className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"} mb-1`}
                    >
                      Índice de Interesse do Imóvel
                    </div>
                    <div
                      className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                    >
                      {engajamento}%
                    </div>
                  </div>
                  <div
                    className={`w-full h-2 ${isDark ? "bg-gray-700" : "bg-gray-300"} rounded-full overflow-hidden mb-1`}
                  >
                    <div
                      className={`h-full ${localMarcadoComoVendido || engajamento >= 100 ? "bg-green-500" : engajamento >= 80 ? "bg-blue-500" : engajamento >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${Math.min(engajamento / 5, 100)}%` }}
                    ></div>
                  </div>
                  <div
                    className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Meta: <span className="font-medium">5%</span> de conversão
                  </div>
                </div>

                {/* Coluna 3: Resultado */}
                <div className="flex-1 pl-6">
                  <div className="flex flex-col items-center justify-center text-center h-full">
                    <div className={`${classificacao.marginBottom || "mb-2"}`}>
                      <div
                        className={`p-1.5 rounded-lg ${classificacao.bgIcone} ${classificacao.corIcone} flex items-center justify-center mx-auto`}
                      >
                        <ClassificacaoIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="mb-2">
                      <div className={`text-lg font-bold ${classificacao.cor}`}>
                        {classificacao.label}
                      </div>
                    </div>

                    <div className="mb-3">
                      <div
                        className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {classificacao.texto}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* INSIGHTS RÁPIDOS DINÂMICOS */}
          <div className="mb-6">
            <h4
              className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"} mb-3`}
            >
              📊 Insights Rápidos
            </h4>
            <div className="space-y-3">
              {insights.map((insight, index) => {
                let Icon = CheckCircleIcon;
                let bgColor = isDark
                  ? "from-gray-800 to-gray-800/50"
                  : "from-blue-50 to-blue-50/50";
                let borderColor = isDark
                  ? "border-gray-700"
                  : "border-blue-200";
                let textColor = isDark ? "text-gray-300" : "text-gray-700";

                if (localMarcadoComoVendido) {
                  Icon = CheckBadgeIcon;
                  bgColor = isDark
                    ? "from-green-900/30 to-green-900/20"
                    : "from-green-50 to-green-50/50";
                  borderColor = isDark
                    ? "border-green-800"
                    : "border-green-200";
                  textColor = isDark ? "text-green-300" : "text-green-700";
                } else if (
                  insight.includes("acima do esperado") ||
                  insight.includes("excepcional")
                ) {
                  Icon = ArrowTrendingUpIcon;
                  bgColor = isDark
                    ? "from-green-900/30 to-green-900/20"
                    : "from-green-50 to-green-50/50";
                  borderColor = isDark
                    ? "border-green-800"
                    : "border-green-200";
                  textColor = isDark ? "text-green-300" : "text-green-700";
                } else if (
                  insight.includes("abaixo") ||
                  insight.includes("baixa conversão")
                ) {
                  Icon = ExclamationTriangleIcon;
                  bgColor = isDark
                    ? "from-red-900/30 to-red-900/20"
                    : "from-red-50 to-red-50/50";
                  borderColor = isDark ? "border-red-800" : "border-red-200";
                  textColor = isDark ? "text-red-300" : "text-red-700";
                } else if (
                  insight.includes("interessado") ||
                  insight.includes("follow-up")
                ) {
                  Icon = UserGroupIcon;
                  bgColor = isDark
                    ? "from-amber-900/30 to-amber-900/20"
                    : "from-amber-50 to-amber-50/50";
                  borderColor = isDark
                    ? "border-amber-800"
                    : "border-amber-200";
                  textColor = isDark ? "text-amber-300" : "text-amber-700";
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
            <div
              className={`mt-4 pt-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"}`}
            >
              <div
                className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"} text-center italic`}
              >
                <span
                  className={
                    isDark
                      ? "text-gray-400 font-medium"
                      : "text-gray-600 font-medium"
                  }
                >
                  * Classificação automática baseada no engajamento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AÇÕES - Footer */}
        <div
          className={`border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100/50"} p-4 relative`}
        >
          {/* Tooltip de Informação sobre o cálculo */}
          {showTooltipInfo && (
            <div
              className={`absolute bottom-full left-4 mb-2 w-80 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"} rounded-lg shadow-xl z-50 p-4`}
            >
              <div className="absolute top-full left-6 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`p-1.5 ${isDark ? "bg-blue-900/50" : "bg-blue-100"} rounded-lg`}
                  >
                    <InformationCircleIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h5
                    className={`font-bold ${isDark ? "text-gray-200" : "text-gray-900"} text-sm`}
                  >
                    Como calculamos este índice
                  </h5>
                </div>

                <p
                  className={
                    isDark ? "text-gray-300 text-sm" : "text-gray-700 text-sm"
                  }
                >
                  Este índice mostra o quanto o imóvel despertou interesse real
                  em relação ao número de visualizações.
                </p>
                <p
                  className={
                    isDark ? "text-gray-300 text-sm" : "text-gray-700 text-sm"
                  }
                >
                  Consideramos diferentes tipos de interação, dando mais peso
                  para ações que indicam maior intenção, como cliques no
                  WhatsApp e solicitações de visita.
                </p>
                <p
                  className={
                    isDark ? "text-gray-300 text-sm" : "text-gray-700 text-sm"
                  }
                >
                  Quando o índice chega a 100%, o imóvel atingiu o nível
                  esperado de interesse.
                </p>
                <p
                  className={
                    isDark ? "text-gray-300 text-sm" : "text-gray-700 text-sm"
                  }
                >
                  Valores acima disso indicam desempenho acima da média.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* RETÂNGULO ARREDONDADO COM TEXTO E ÍCONE */}
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${isDark ? "border-amber-800 bg-amber-900/30 hover:bg-amber-900/50" : "border-amber-300 bg-amber-50 hover:bg-amber-100 hover:border-amber-400"} transition-all duration-200 cursor-help`}
              onMouseEnter={() => setShowTooltipInfo(true)}
              onMouseLeave={() => setShowTooltipInfo(false)}
              onTouchStart={() => setShowTooltipInfo(!showTooltipInfo)}
            >
              <div
                className={`p-1 ${isDark ? "bg-amber-900/50 border-amber-800" : "bg-amber-100 border-amber-200"} border rounded-md`}
              >
                <InformationCircleIcon className="w-3.5 h-3.5 text-amber-700" />
              </div>

              <span
                className={`text-xs font-medium ${isDark ? "text-amber-300" : "text-amber-800"} whitespace-nowrap`}
              >
                Como calculamos este índice
              </span>
            </div>

            {/* Botões */}
            <div className="flex items-center gap-3">
              {/* Botão Fechar */}
              <button
                onClick={onClose}
                className={`px-4 py-2.5 text-white ${palette.azulNoturno.bg} border ${palette.azulNoturno.border} rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2 mr-2`}
              >
                <XMarkIcon className="w-4 h-4" />
                Fechar
              </button>

              {/* Botão Marcar como Vendido */}
              <button
                onClick={handleMarcarComoVendido}
                disabled={localMarcadoComoVendido}
                className={`px-4 py-2.5 ${localMarcadoComoVendido ? "bg-green-600 text-white hover:bg-green-700 cursor-default" : isDark ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" : "bg-white text-gray-800 border border-gray-400 hover:bg-gray-50"} rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2 ${localMarcadoComoVendido ? "opacity-90" : ""}`}
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
      // Implemente a lógica de ação aqui
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

// Componente para Card de KPI
const KPICard = ({ icon: Icon, title, value, colorScheme }) => {
  const { isDark } = useTheme();

  let iconText, iconBg, borderColor;

  switch (colorScheme) {
    case "slate":
      iconText = isDark ? "text-slate-400" : "text-slate-600";
      iconBg = isDark ? "bg-slate-800/50" : "bg-slate-100/50";
      borderColor = isDark ? "border-l-slate-700" : "border-l-slate-200";
      break;
    case "green":
      iconText = isDark ? "text-green-400" : "text-green-600";
      iconBg = isDark ? "bg-green-900/20" : "bg-green-100/50";
      borderColor = isDark ? "border-l-green-800/50" : "border-l-green-200";
      break;
    case "amber":
      iconText = isDark ? "text-amber-400" : "text-amber-600";
      iconBg = isDark ? "bg-amber-900/20" : "bg-amber-100/50";
      borderColor = isDark ? "border-l-amber-800/50" : "border-l-amber-200";
      break;
    case "indigo":
      iconText = isDark ? "text-indigo-400" : "text-indigo-600";
      iconBg = isDark ? "bg-indigo-900/20" : "bg-indigo-100/50";
      borderColor = isDark ? "border-l-indigo-800/50" : "border-l-indigo-200";
      break;
    default:
      iconText = isDark ? "text-gray-400" : "text-gray-600";
      iconBg = isDark ? "bg-gray-800/50" : "bg-gray-100/50";
      borderColor = isDark ? "border-l-gray-700" : "border-l-gray-200";
  }

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-lg shadow-sm border transition-colors duration-200 border-l-4 ${borderColor} ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div className={`p-3 rounded-full ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconText}`} />
      </div>
      <div>
        <div
          className={`text-2xl font-bold ${
            isDark ? "text-gray-100" : "text-gray-900"
          }`}
        >
          {value}
        </div>
        <div
          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
        >
          {title}
        </div>
      </div>
    </div>
  );
};

// Componente principal Imoveis
const Imoveis = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate(); // ADICIONADO: Hook de navegação

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
      desempenho: "Destaque", // Faixa Destaque: 158%
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
      status: "Vendido",
      preco: "R$ 180.000,00",
      desempenho: "Destaque", // Faixa Destaque: 162%
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

  // Cálculo dos KPIs
  const totalImoveis = imoveisData.length;
  const disponiveis = imoveisData.filter(
    (i) => i.status === "Disponível",
  ).length;
  const emNegociacaoReservados = imoveisData.filter(
    (i) => i.status === "Reservado",
  ).length;
  const vendidos = imoveisData.filter((i) => i.status === "Vendido").length;

  // Função para filtrar os imóveis
  const imoveisFiltrados = useMemo(() => {
    return imoveisData.filter((imovel) => {
      const buscaMatch =
        searchTerm === "" ||
        imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.bairro.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imovel.cidade.toLowerCase().includes(searchTerm.toLowerCase());

      const tipoMatch =
        selectedTipo === "" ||
        imovel.tipo.toLowerCase() === selectedTipo.toLowerCase();

      const finalidadeMatch =
        selectedFinalidade === "" ||
        imovel.finalidade.toLowerCase() === selectedFinalidade.toLowerCase();

      const statusMatch =
        selectedStatus === "" ||
        imovel.status.toLowerCase() === selectedStatus.toLowerCase();

      const cidadeMatch =
        selectedCidade === "" ||
        imovel.cidade.toLowerCase() === selectedCidade.toLowerCase();

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
  const imoveisEncontrados = imoveisFiltrados.length;

  // Cores para os status
  const statusColors = {
    Disponível: isDark
      ? "bg-green-900/30 text-green-300 border border-green-800"
      : "bg-green-100 text-green-800",
    Vendido: isDark
      ? "bg-red-900/30 text-red-300 border border-red-800"
      : "bg-red-100 text-red-800",
    Alugado: isDark
      ? "bg-yellow-900/30 text-yellow-300 border border-yellow-800"
      : "bg-yellow-100 text-yellow-800",
    Reservado: isDark
      ? "bg-blue-900/30 text-blue-300 border border-blue-800"
      : "bg-blue-100 text-blue-800",
  };

  const tipoColors = {
    Apartamento: isDark
      ? "bg-blue-900/30 text-blue-300 border border-blue-800"
      : "bg-blue-50 text-blue-700",
    Casa: isDark
      ? "bg-green-900/30 text-green-300 border border-green-800"
      : "bg-green-50 text-green-700",
    Terreno: isDark
      ? "bg-amber-900/30 text-amber-300 border border-amber-800"
      : "bg-amber-50 text-amber-700",
  };

  const finalidadeColors = {
    Venda: isDark
      ? "bg-purple-900/30 text-purple-300 border border-purple-800"
      : "bg-purple-50 text-purple-700",
    Aluguel: isDark
      ? "bg-cyan-900/30 text-cyan-300 border border-cyan-800"
      : "bg-cyan-50 text-cyan-700",
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <div>
          <h1
            className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Imóveis
          </h1>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"} mt-2`}>
            Gerencie todos os imóveis cadastrados
          </p>
        </div>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          {/* BOTÃO NOVO EMPREENDIMENTO - VERDE ESCURO (#15803D) */}
          <Button
            variant="secondary"
            className="bg-[#15803D] hover:bg-[#166534] text-white border-none"
            onClick={() => navigate("/admin/cadastrar-empreendimento")}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Empreendimento
          </Button>
          {/* Botão Novo Imóvel existente */}
          <Button
            variant="primary"
            onClick={() => navigate("/admin/imoveis/novo")}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Imóvel
          </Button>
        </div>
      </div>

      {/* Bloco de KPIs */}
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            icon={ChartBarIcon}
            title="Total de Imóveis"
            value={totalImoveis}
            colorScheme="slate"
          />
          <KPICard
            icon={CheckCircleIcon}
            title="Disponíveis"
            value={disponiveis}
            colorScheme="green"
          />
          <KPICard
            icon={ClockIcon}
            title="Em Negociação / Reservados"
            value={emNegociacaoReservados}
            colorScheme="amber"
          />
          <KPICard
            icon={CheckBadgeIcon}
            title="Vendidos"
            value={vendidos}
            colorScheme="indigo"
          />
        </div>
      </div>

      {/* Search - FILTROS INTERATIVOS */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* BUSCA POR TEXTO */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <MagnifyingGlassIcon
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              />
              <input
                type="text"
                placeholder="Buscar por código (APT, CS, TER), endereço, bairro, cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm transition-colors duration-200`}
              />
            </div>
          </div>

          {/* FILTROS COM DROPDOWN */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filtro Tipo */}
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className={`h-[42px] px-3 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto transition-colors duration-200`}
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
              className={`h-[42px] px-3 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto transition-colors duration-200`}
            >
              <option value="">Todas Finalidades</option>
              <option value="venda">Venda</option>
              <option value="aluguel">Aluguel</option>
            </select>

            {/* Filtro Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`h-[42px] px-3 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto transition-colors duration-200`}
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
              className={`h-[42px] px-3 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto transition-colors duration-200`}
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
                className={`h-[42px] px-3 ${isDark ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"} border rounded-lg transition-colors duration-200 text-sm font-medium`}
              >
                Limpar Filtros
              </button>
            )}
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="mt-4 flex items-center justify-between">
          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Mostrando{" "}
            <span
              className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-900"}`}
            >
              {imoveisEncontrados}
            </span>{" "}
            de{" "}
            <span
              className={`font-semibold ${isDark ? "text-gray-300" : "text-gray-900"}`}
            >
              {totalImoveis}
            </span>{" "}
            imóveis
          </div>

          {/* Indicador de filtros ativos */}
          {(searchTerm ||
            selectedTipo ||
            selectedFinalidade ||
            selectedStatus ||
            selectedCidade) && (
            <div
              className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}
            >
              Filtros ativos:
              {searchTerm && (
                <span
                  className={`ml-2 px-2 py-1 ${isDark ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-100 text-gray-700 border-gray-300"} rounded border`}
                >
                  Busca: "{searchTerm}"
                </span>
              )}
              {selectedTipo && (
                <span
                  className={`ml-2 px-2 py-1 ${isDark ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-100 text-gray-700 border-gray-300"} rounded border`}
                >
                  Tipo: {selectedTipo}
                </span>
              )}
              {selectedFinalidade && (
                <span
                  className={`ml-2 px-2 py-1 ${isDark ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-100 text-gray-700 border-gray-300"} rounded border`}
                >
                  Finalidade: {selectedFinalidade}
                </span>
              )}
              {selectedStatus && (
                <span
                  className={`ml-2 px-2 py-1 ${isDark ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-100 text-gray-700 border-gray-300"} rounded border`}
                >
                  Status: {selectedStatus}
                </span>
              )}
              {selectedCidade && (
                <span
                  className={`ml-2 px-2 py-1 ${isDark ? "bg-gray-800 text-gray-300 border-gray-700" : "bg-gray-100 text-gray-700 border-gray-300"} rounded border`}
                >
                  Cidade: {selectedCidade}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Tabela com imóveis filtrados */}
      <div
        className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border overflow-hidden transition-colors duration-200`}
      >
        <div className="overflow-x-auto">
          {imoveisFiltrados.length === 0 ? (
            <div className="py-12 text-center">
              <div
                className={`${isDark ? "text-gray-600" : "text-gray-400"} mb-2`}
              >
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto" />
              </div>
              <h3
                className={`text-lg font-medium ${isDark ? "text-gray-200" : "text-gray-900"} mb-2`}
              >
                Nenhum imóvel encontrado
              </h3>
              <p className={isDark ? "text-gray-400" : "text-gray-600"}>
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
                  className="mt-4 px-4 py-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#D4A24D]/90 transition-colors duration-200"
                >
                  Limpar todos os filtros
                </button>
              )}
            </div>
          ) : (
            <table className="min-w-full table-fixed">
              <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`w-[60px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    ID
                  </th>
                  <th
                    className={`w-[90px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Código
                  </th>
                  <th
                    className={`w-[90px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Finalidade
                  </th>
                  <th
                    className={`w-[90px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Tipo
                  </th>
                  <th
                    className={`w-[160px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Endereço
                  </th>
                  <th
                    className={`w-[130px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Bairro
                  </th>
                  <th
                    className={`w-[130px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Cidade
                  </th>
                  <th
                    className={`w-[60px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Estado
                  </th>
                  <th
                    className={`w-[90px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Status
                  </th>
                  <th
                    className={`w-[130px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Preço
                  </th>
                  <th
                    className={`w-[120px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider`}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody
                className={
                  isDark ? "divide-gray-700" : "divide-gray-200 divide-y"
                }
              >
                {imoveisFiltrados.map((imovel) => (
                  <tr
                    key={imovel.id}
                    className={
                      isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                    }
                  >
                    {/* ID */}
                    <td
                      className={`w-[60px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`font-medium ${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                      >
                        {imovel.id}
                      </span>
                    </td>

                    {/* Código */}
                    <td
                      className={`w-[90px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                      >
                        {imovel.codigo}
                      </span>
                    </td>

                    {/* Finalidade */}
                    <td
                      className={`w-[90px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${finalidadeColors[imovel.finalidade]} inline-block whitespace-nowrap`}
                      >
                        {imovel.finalidade}
                      </span>
                    </td>

                    {/* Tipo */}
                    <td
                      className={`w-[90px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${tipoColors[imovel.tipo] || (isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-800")} inline-block whitespace-nowrap`}
                      >
                        {imovel.tipo}
                      </span>
                    </td>

                    {/* Endereço */}
                    <td
                      className={`w-[160px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                      >
                        {imovel.endereco}
                      </span>
                    </td>

                    {/* Bairro */}
                    <td
                      className={`w-[130px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                      >
                        {imovel.bairro}
                      </span>
                    </td>

                    {/* Cidade */}
                    <td
                      className={`w-[130px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                      >
                        {imovel.cidade}
                      </span>
                    </td>

                    {/* Estado */}
                    <td
                      className={`w-[60px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                      >
                        {imovel.estado}
                      </span>
                    </td>

                    {/* Status */}
                    <td
                      className={`w-[90px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[imovel.status]} inline-block whitespace-nowrap`}
                      >
                        {imovel.status}
                      </span>
                    </td>

                    {/* Preço */}
                    <td
                      className={`w-[130px] p-3 text-center border-r ${isDark ? "border-gray-700" : "border-gray-200"}`}
                    >
                      <span
                        className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                      >
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
