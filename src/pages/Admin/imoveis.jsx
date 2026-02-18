import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  PlusIcon,
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
import { useNavigate } from "react-router-dom";
import { TrophyIcon } from "@heroicons/react/24/outline";
import { supabase } from "../../lib/supabase";
import { useNotifications } from "../../contexts/NotificationContext";

// ============ COMPONENTE MODAL PERFORMANCE (ESSENCIAL) ============
const ModalPerformanceImovel = ({ imovel, onClose, onAction }) => {
  const { isDark } = useTheme();
  const [showTooltipInfo, setShowTooltipInfo] = useState(false);
  const [localMarcadoComoVendido, setLocalMarcadoComoVendido] = useState(false);
  const [metricsData, setMetricsData] = useState({
    visualizacoes: 0,
    cliquesWhatsApp: 0,
    solicitacoesVisita: 0,
    interessadosAtivos: 0,
    status: "Disponível",
    tempoNegociacao: "0 dias",
    ultimaAtualizacao: "Agora mesmo",
    engajamentoCalculado: 0,
  });

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const { data: estatisticas, error } = await supabase
          .from("imovel_estatisticas")
          .select("*")
          .eq("imovel_id", imovel.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Erro ao carregar performance:", error);
        }

        if (estatisticas) {
          setMetricsData({
            visualizacoes: estatisticas.visualizacoes || 0,
            cliquesWhatsApp: estatisticas.cliques_whatsapp || 0,
            solicitacoesVisita: estatisticas.solicitacoes_visita || 0,
            interessadosAtivos: estatisticas.interessados_ativos || 0,
            status: imovel.status,
            tempoNegociacao: estatisticas.tempo_negociacao || "0 dias",
            ultimaAtualizacao: estatisticas.updated_at
              ? new Date(estatisticas.updated_at).toLocaleString("pt-BR")
              : "Agora mesmo",
            engajamentoCalculado: estatisticas.engajamento || 0,
          });
        } else {
          // Dados simulados apenas para demonstração enquanto não há dados reais
          const getMockData = () => {
            switch (imovel.desempenho) {
              case "Destaque":
                return {
                  visualizacoes: 320,
                  cliquesWhatsApp: 78,
                  solicitacoesVisita: 25,
                  interessadosAtivos: 5,
                  status: imovel.status,
                  tempoNegociacao: "3 dias",
                  ultimaAtualizacao: "1 hora atrás",
                  engajamentoCalculado: 158,
                };
              case "Excelente":
                return {
                  visualizacoes: 247,
                  cliquesWhatsApp: 48,
                  solicitacoesVisita: 12,
                  interessadosAtivos: 3,
                  status: imovel.status,
                  tempoNegociacao: "10 dias",
                  ultimaAtualizacao: "2 horas atrás",
                  engajamentoCalculado: 125,
                };
              case "Saudável":
                return {
                  visualizacoes: 180,
                  cliquesWhatsApp: 18,
                  solicitacoesVisita: 4,
                  interessadosAtivos: 2,
                  status: imovel.status,
                  tempoNegociacao: "5 dias",
                  ultimaAtualizacao: "1 hora atrás",
                  engajamentoCalculado: 107,
                };
              case "Atenção":
                return {
                  visualizacoes: 150,
                  cliquesWhatsApp: 10,
                  solicitacoesVisita: 2,
                  interessadosAtivos: 1,
                  status: imovel.status,
                  tempoNegociacao: "15 dias",
                  ultimaAtualizacao: "3 horas atrás",
                  engajamentoCalculado: 85,
                };
              case "Crítico":
                return {
                  visualizacoes: 200,
                  cliquesWhatsApp: 6,
                  solicitacoesVisita: 1,
                  interessadosAtivos: 0,
                  status: imovel.status,
                  tempoNegociacao: "30 dias",
                  ultimaAtualizacao: "5 horas atrás",
                  engajamentoCalculado: 35,
                };
              default:
                return {
                  visualizacoes: 247,
                  cliquesWhatsApp: 48,
                  solicitacoesVisita: 12,
                  interessadosAtivos: 3,
                  status: imovel.status,
                  tempoNegociacao: "10 dias",
                  ultimaAtualizacao: "2 horas atrás",
                  engajamentoCalculado: 125,
                };
            }
          };
          setMetricsData(getMockData());
        }
      } catch (error) {
        console.error("Erro ao carregar performance:", error);
      }
    };

    fetchPerformanceData();
  }, [imovel.id, imovel.desempenho, imovel.status]);

  useEffect(() => {
    if (localMarcadoComoVendido) {
      setMetricsData((prev) => ({
        ...prev,
        visualizacoes: prev.visualizacoes + 20,
        cliquesWhatsApp: prev.cliquesWhatsApp + 5,
        solicitacoesVisita: prev.solicitacoesVisita + 2,
        interessadosAtivos: 0,
        status: "VENDIDO",
        tempoNegociacao: "Concluído",
        ultimaAtualizacao: "Agora mesmo",
        engajamentoCalculado: 150,
      }));
    }
  }, [localMarcadoComoVendido]);

  const engajamento = metricsData.engajamentoCalculado;

  const getClassificacaoDesempenho = () => {
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

  const gerarInsights = () => {
    const insights = [];

    if (localMarcadoComoVendido) {
      insights.push("✅ Imóvel vendido com sucesso!");
      insights.push("🎉 Parabéns pela venda concluída!");
      insights.push("📊 Este imóvel teve excelente performance comercial.");
      return insights;
    }

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

    if (metricsData.interessadosAtivos > 0) {
      insights.push(
        `${metricsData.interessadosAtivos} interessado(s) ativo(s) necessitam follow-up imediato.`,
      );
    }

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

  const imovelCompleto = {
    ...imovel,
    imagemUrl:
      imovel.imagem_url ||
      "https://adventusimobiliaria.com.br/img/imovei/filename/5/WhatsApp%20Image%202022-09-19%20at%2016.39.15.jpeg",
  };

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

  const handleMarcarComoVendido = async () => {
    try {
      const { error } = await supabase
        .from("imoveis")
        .update({
          status: "Vendido",
          updated_at: new Date(),
        })
        .eq("id", imovel.id);

      if (error) throw error;

      setLocalMarcadoComoVendido(true);
      if (onAction) {
        onAction("marcarVendido", imovel.id);
      }
    } catch (error) {
      console.error("Erro ao marcar imóvel como vendido:", error);
      alert("Erro ao marcar imóvel como vendido. Tente novamente.");
    }
  };

  return (
    <div
      className={`fixed inset-0 ${isDark ? "bg-black/80" : "bg-black/60"} flex items-center justify-center z-50 p-4 backdrop-blur-sm`}
    >
      <div
        className={`${isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border`}
      >
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

          <div className="absolute inset-0 p-6 flex flex-col justify-end">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-1 drop-shadow-lg">
                {imovelCompleto.codigo}
              </h2>
              <p className="text-gray-200 font-light">
                {imovelCompleto.tipo} para{" "}
                {imovelCompleto.finalidade?.toLowerCase() || "venda"}
                {localMarcadoComoVendido && " - VENDIDO"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#C19137] transition-all duration-200 shadow-md border border-amber-600"
            title="Fechar"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
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
                    {typeof imovelCompleto.preco === "number"
                      ? new Intl.NumberFormat("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        }).format(imovelCompleto.preco)
                      : imovelCompleto.preco_formatado || imovelCompleto.preco}
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

          <div className="mb-6">
            <div
              className={`rounded-xl p-5 ${palette.amareloDourado.bgLight} border ${palette.amareloDourado.border} ${isDark ? "dark:bg-amber-900/20 dark:border-amber-800" : ""}`}
            >
              <div className="flex items-center justify-between">
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

        <div
          className={`border-t ${isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100/50"} p-4 relative`}
        >
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

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className={`px-4 py-2.5 text-white ${palette.azulNoturno.bg} border ${palette.azulNoturno.border} rounded-lg hover:opacity-90 transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2 mr-2`}
              >
                <XMarkIcon className="w-4 h-4" />
                Fechar
              </button>

              <button
                onClick={handleMarcarComoVendido}
                disabled={
                  localMarcadoComoVendido ||
                  imovel.status === "Vendido" ||
                  imovel.status === "Alugado"
                }
                className={`px-4 py-2.5 ${localMarcadoComoVendido || imovel.status === "Vendido" || imovel.status === "Alugado" ? "bg-green-600 text-white hover:bg-green-700 cursor-default" : isDark ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" : "bg-white text-gray-800 border border-gray-400 hover:bg-gray-50"} rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow flex items-center gap-2 ${localMarcadoComoVendido || imovel.status === "Vendido" || imovel.status === "Alugado" ? "opacity-90" : ""}`}
              >
                {localMarcadoComoVendido ||
                imovel.status === "Vendido" ||
                imovel.status === "Alugado" ? (
                  <>
                    <CheckBadgeIcon className="w-4 h-4" />
                    {imovel.status === "Alugado" ? "ALUGADO" : "VENDIDO"}
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

// ============ COMPONENTE BOTÃO DESEMPENHO (ESSENCIAL) ============
const BotaoDesempenho = ({ imovel }) => {
  const [modalAberto, setModalAberto] = useState(false);

  const handleAcaoModal = (acao, imovelId) => {
    console.log(`Ação: ${acao} no imóvel ID: ${imovelId}`);
  };

  return (
    <>
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

// ============ COMPONENTE KPI CARD ============
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

// ============ COMPONENTE PRINCIPAL ============
const Imoveis = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const { carregarNotificacoes } = useNotifications();
  const marcouVisualizados = useRef(false);

  const [imoveisData, setImoveisData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedFinalidade, setSelectedFinalidade] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCidade, setSelectedCidade] = useState("");

  const [cidades, setCidades] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [finalidades, setFinalidades] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const fetchImoveis = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("imoveis")
        .select("*")
        .order("id", { ascending: false });

      if (error) throw error;

      const imoveisMapeados = data.map((imovel) => {
        let finalidade = "Venda";
        if (imovel.finalidade_aluguel && !imovel.finalidade_venda) {
          finalidade = "Aluguel";
        } else if (imovel.finalidade_venda && imovel.finalidade_aluguel) {
          finalidade = "Venda e Aluguel";
        }

        const precoFormatado = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(imovel.preco || 0);

        let tipoFormatado = imovel.tipo || "Apartamento";
        tipoFormatado =
          tipoFormatado.charAt(0).toUpperCase() +
          tipoFormatado.slice(1).toLowerCase();

        let statusFormatado = imovel.status || "Disponível";
        statusFormatado = statusFormatado.toLowerCase();

        if (
          statusFormatado === "disponivel" ||
          statusFormatado === "disponível"
        ) {
          statusFormatado = "Disponível";
        } else if (statusFormatado === "vendido") {
          statusFormatado = "Vendido";
        } else if (statusFormatado === "alugado") {
          statusFormatado = "Alugado";
        } else if (statusFormatado === "reservado") {
          statusFormatado = "Reservado";
        } else if (
          statusFormatado === "em negociação" ||
          statusFormatado === "em negociacao"
        ) {
          statusFormatado = "Em Negociação";
        }

        return {
          id: imovel.id,
          codigo:
            imovel.codigo ||
            `${(tipoFormatado || "IMO").substring(0, 3).toUpperCase()}-${imovel.id.toString().padStart(3, "0")}`,
          finalidade: finalidade,
          finalidade_venda: imovel.finalidade_venda || false,
          finalidade_aluguel: imovel.finalidade_aluguel || false,
          tipo: tipoFormatado,
          endereco: imovel.endereco || "",
          bairro: imovel.bairro || "",
          cidade: imovel.cidade || "",
          estado: imovel.estado || "MA",
          status: statusFormatado,
          preco: imovel.preco || 0,
          preco_formatado:
            finalidade === "Aluguel" ? `${precoFormatado}/mês` : precoFormatado,
          desempenho: imovel.desempenho || "Saudável",
          imagem_url: imovel.imagem_url || null,
        };
      });

      setImoveisData(imoveisMapeados);

      const cidadesUnicas = [
        ...new Set(imoveisMapeados.map((i) => i.cidade).filter(Boolean)),
      ];
      const tiposUnicos = [
        ...new Set(imoveisMapeados.map((i) => i.tipo).filter(Boolean)),
      ];
      const finalidadesUnicas = [
        ...new Set(imoveisMapeados.map((i) => i.finalidade).filter(Boolean)),
      ];
      const statusUnicos = [
        ...new Set(imoveisMapeados.map((i) => i.status).filter(Boolean)),
      ];

      setCidades(cidadesUnicas);
      setTipos(tiposUnicos);
      setFinalidades(finalidadesUnicas);
      setStatusList(statusUnicos);

      setError(null);
    } catch (err) {
      console.error("Erro ao carregar imóveis:", err);
      setError("Não foi possível carregar os imóveis.");
    } finally {
      setLoading(false);
    }
  };

  // ===== MARCAR IMÓVEIS COMO VISUALIZADOS (UMA ÚNICA VEZ) =====
  useEffect(() => {
    const marcarImoveisComoVisualizados = async () => {
      if (marcouVisualizados.current) return;

      try {
        console.log("👁️ Marcando imóveis como visualizados...");

        const { error } = await supabase
          .from("imoveis")
          .update({ visualizado: true })
          .eq("visualizado", false);

        if (error) {
          console.error("Erro ao marcar imóveis:", error);
        } else {
          console.log("✅ Imóveis marcados como visualizados");
          await carregarNotificacoes();
          marcouVisualizados.current = true;
        }
      } catch (err) {
        console.error("Erro:", err);
      }
    };

    if (!loading && imoveisData.length > 0) {
      marcarImoveisComoVisualizados();
    }
  }, [loading, imoveisData.length, carregarNotificacoes]);

  useEffect(() => {
    fetchImoveis();
  }, []);

  const totalImoveis = imoveisData.length;
  const disponiveis = imoveisData.filter(
    (i) => i.status === "Disponível",
  ).length;
  const emNegociacaoReservados = imoveisData.filter(
    (i) => i.status === "Reservado" || i.status === "Em Negociação",
  ).length;
  const vendidos = imoveisData.filter(
    (i) => i.status === "Vendido" || i.status === "Alugado",
  ).length;

  const imoveisFiltrados = useMemo(() => {
    return imoveisData.filter((imovel) => {
      const buscaMatch =
        searchTerm === "" ||
        (imovel.codigo &&
          imovel.codigo.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (imovel.endereco &&
          imovel.endereco.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (imovel.bairro &&
          imovel.bairro.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (imovel.cidade &&
          imovel.cidade.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (imovel.tipo &&
          imovel.tipo.toLowerCase().includes(searchTerm.toLowerCase()));

      const tipoMatch =
        selectedTipo === "" ||
        (imovel.tipo &&
          imovel.tipo.toLowerCase() === selectedTipo.toLowerCase());

      const finalidadeMatch =
        selectedFinalidade === "" ||
        (imovel.finalidade &&
          imovel.finalidade.toLowerCase() === selectedFinalidade.toLowerCase());

      const statusMatch =
        selectedStatus === "" ||
        (imovel.status &&
          imovel.status.toLowerCase() === selectedStatus.toLowerCase());

      const cidadeMatch =
        selectedCidade === "" ||
        (imovel.cidade &&
          imovel.cidade.toLowerCase() === selectedCidade.toLowerCase());

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
    imoveisData,
  ]);

  const limparFiltros = () => {
    setSearchTerm("");
    setSelectedTipo("");
    setSelectedFinalidade("");
    setSelectedStatus("");
    setSelectedCidade("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este imóvel?")) {
      try {
        const { error } = await supabase.from("imoveis").delete().eq("id", id);

        if (error) throw error;
        fetchImoveis();
        alert("Imóvel excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao deletar imóvel:", error);
        alert("Erro ao deletar imóvel. Tente novamente.");
      }
    }
  };

  const imoveisEncontrados = imoveisFiltrados.length;

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24D] mx-auto"></div>
          <p className={`mt-4 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Carregando imóveis...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div
          className={`${isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"} border rounded-lg p-6 text-center`}
        >
          <ExclamationCircleIcon
            className={`w-12 h-12 ${isDark ? "text-red-400" : "text-red-500"} mx-auto mb-4`}
          />
          <h3
            className={`text-lg font-medium ${isDark ? "text-red-300" : "text-red-800"} mb-2`}
          >
            Erro ao carregar imóveis
          </h3>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>{error}</p>
          <button
            onClick={fetchImoveis}
            className="mt-4 px-4 py-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#C19137] transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
          <Button
            variant="primary"
            onClick={() => navigate("/admin/imoveis/novo")}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Imóvel
          </Button>
        </div>
      </div>

      {/* KPIs */}
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
            title="Vendidos / Alugados"
            value={vendidos}
            colorScheme="indigo"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <MagnifyingGlassIcon
                className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
              />
              <input
                type="text"
                placeholder="Buscar por código, endereço, bairro, cidade, tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm transition-colors duration-200`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedTipo}
              onChange={(e) => setSelectedTipo(e.target.value)}
              className={`h-[42px] px-3 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto transition-colors duration-200`}
            >
              <option value="">Todos os Tipos</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo.toLowerCase()}>
                  {tipo}
                </option>
              ))}
            </select>

            <select
              value={selectedFinalidade}
              onChange={(e) => setSelectedFinalidade(e.target.value)}
              className={`h-[42px] px-3 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto transition-colors duration-200`}
            >
              <option value="">Todas Finalidades</option>
              {finalidades.map((finalidade) => (
                <option key={finalidade} value={finalidade.toLowerCase()}>
                  {finalidade}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className={`h-[42px] px-3 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto transition-colors duration-200`}
            >
              <option value="">Todos Status</option>
              {statusList.map((status) => (
                <option key={status} value={status.toLowerCase()}>
                  {status}
                </option>
              ))}
            </select>

            <select
              value={selectedCidade}
              onChange={(e) => setSelectedCidade(e.target.value)}
              className={`h-[42px] px-3 ${isDark ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-gray-300 text-gray-900"} border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm w-full sm:w-auto transition-colors duration-200`}
            >
              <option value="">Todas Cidades</option>
              {cidades.map((cidade) => (
                <option key={cidade} value={cidade.toLowerCase()}>
                  {cidade}
                </option>
              ))}
            </select>

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
        </div>
      </div>

      {/* Tabela */}
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
                  ? "Tente ajustar os filtros ou limpar todos."
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
            <table className="min-w-full table-fixed border-collapse">
              <thead className={isDark ? "bg-gray-900" : "bg-gray-50"}>
                <tr>
                  <th
                    className={`w-[60px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    ID
                  </th>
                  <th
                    className={`w-[90px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Código
                  </th>
                  <th
                    className={`w-[100px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Finalidade
                  </th>
                  <th
                    className={`w-[100px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Tipo
                  </th>
                  <th
                    className={`w-[160px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Endereço
                  </th>
                  <th
                    className={`w-[130px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Bairro
                  </th>
                  <th
                    className={`w-[130px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Cidade
                  </th>
                  <th
                    className={`w-[60px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    UF
                  </th>
                  <th
                    className={`w-[100px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Status
                  </th>
                  <th
                    className={`w-[130px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Preço
                  </th>
                  <th
                    className={`w-[150px] p-3 text-center text-xs font-semibold ${isDark ? "text-gray-300" : "text-gray-800"} uppercase tracking-wider border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                  >
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody
                className={
                  isDark
                    ? "divide-y divide-gray-700"
                    : "divide-y divide-gray-200"
                }
              >
                {imoveisFiltrados.map((imovel) => {
                  let tipoClasses = "";
                  if (!isDark) {
                    if (imovel.tipo === "Apartamento")
                      tipoClasses = "bg-blue-100 text-blue-800 border-blue-200";
                    else if (imovel.tipo === "Casa")
                      tipoClasses =
                        "bg-green-100 text-green-800 border-green-200";
                    else if (imovel.tipo === "Terreno")
                      tipoClasses =
                        "bg-amber-100 text-amber-800 border-amber-200";
                    else if (imovel.tipo === "Comercial")
                      tipoClasses =
                        "bg-purple-100 text-purple-800 border-purple-200";
                    else
                      tipoClasses = "bg-gray-100 text-gray-800 border-gray-300";
                  } else {
                    if (imovel.tipo === "Apartamento")
                      tipoClasses =
                        "bg-blue-900/30 text-blue-300 border-blue-800";
                    else if (imovel.tipo === "Casa")
                      tipoClasses =
                        "bg-green-900/30 text-green-300 border-green-800";
                    else if (imovel.tipo === "Terreno")
                      tipoClasses =
                        "bg-amber-900/30 text-amber-300 border-amber-800";
                    else if (imovel.tipo === "Comercial")
                      tipoClasses =
                        "bg-purple-900/30 text-purple-300 border-purple-800";
                    else
                      tipoClasses = "bg-gray-700 text-gray-300 border-gray-600";
                  }

                  let finalidadeClasses = "";
                  if (!isDark) {
                    if (imovel.finalidade === "Venda")
                      finalidadeClasses =
                        "bg-purple-100 text-purple-800 border-purple-200";
                    else if (imovel.finalidade === "Aluguel")
                      finalidadeClasses =
                        "bg-cyan-100 text-cyan-800 border-cyan-200";
                    else if (imovel.finalidade === "Venda e Aluguel")
                      finalidadeClasses =
                        "bg-indigo-100 text-indigo-800 border-indigo-200";
                    else
                      finalidadeClasses =
                        "bg-purple-100 text-purple-800 border-purple-200";
                  } else {
                    if (imovel.finalidade === "Venda")
                      finalidadeClasses =
                        "bg-purple-900/30 text-purple-300 border-purple-800";
                    else if (imovel.finalidade === "Aluguel")
                      finalidadeClasses =
                        "bg-cyan-900/30 text-cyan-300 border-cyan-800";
                    else if (imovel.finalidade === "Venda e Aluguel")
                      finalidadeClasses =
                        "bg-indigo-900/30 text-indigo-300 border-indigo-800";
                    else
                      finalidadeClasses =
                        "bg-purple-900/30 text-purple-300 border-purple-800";
                  }

                  let statusClasses = "";
                  if (!isDark) {
                    if (imovel.status === "Disponível")
                      statusClasses =
                        "bg-green-100 text-green-800 border-green-200";
                    else if (imovel.status === "Vendido")
                      statusClasses = "bg-red-100 text-red-800 border-red-200";
                    else if (imovel.status === "Alugado")
                      statusClasses =
                        "bg-yellow-100 text-yellow-800 border-yellow-200";
                    else if (imovel.status === "Reservado")
                      statusClasses =
                        "bg-blue-100 text-blue-800 border-blue-200";
                    else if (imovel.status === "Em Negociação")
                      statusClasses =
                        "bg-purple-100 text-purple-800 border-purple-200";
                    else
                      statusClasses =
                        "bg-green-100 text-green-800 border-green-200";
                  } else {
                    if (imovel.status === "Disponível")
                      statusClasses =
                        "bg-green-900/30 text-green-300 border-green-800";
                    else if (imovel.status === "Vendido")
                      statusClasses =
                        "bg-red-900/30 text-red-300 border-red-800";
                    else if (imovel.status === "Alugado")
                      statusClasses =
                        "bg-yellow-900/30 text-yellow-300 border-yellow-800";
                    else if (imovel.status === "Reservado")
                      statusClasses =
                        "bg-blue-900/30 text-blue-300 border-blue-800";
                    else if (imovel.status === "Em Negociação")
                      statusClasses =
                        "bg-purple-900/30 text-purple-300 border-purple-800";
                    else
                      statusClasses =
                        "bg-green-900/30 text-green-300 border-green-800";
                  }

                  return (
                    <tr
                      key={imovel.id}
                      className={
                        isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                      }
                    >
                      <td
                        className={`w-[60px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`font-medium ${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                        >
                          {imovel.id}
                        </span>
                      </td>
                      <td
                        className={`w-[90px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block font-mono`}
                        >
                          {imovel.codigo}
                        </span>
                      </td>
                      <td
                        className={`w-[100px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${finalidadeClasses} inline-block whitespace-nowrap`}
                        >
                          {imovel.finalidade}
                        </span>
                      </td>
                      <td
                        className={`w-[100px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${tipoClasses} inline-block whitespace-nowrap`}
                        >
                          {imovel.tipo}
                        </span>
                      </td>
                      <td
                        className={`w-[160px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block truncate`}
                          title={imovel.endereco}
                        >
                          {imovel.endereco || "-"}
                        </span>
                      </td>
                      <td
                        className={`w-[130px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block truncate`}
                          title={imovel.bairro}
                        >
                          {imovel.bairro || "-"}
                        </span>
                      </td>
                      <td
                        className={`w-[130px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block truncate`}
                          title={imovel.cidade}
                        >
                          {imovel.cidade || "-"}
                        </span>
                      </td>
                      <td
                        className={`w-[60px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block`}
                        >
                          {imovel.estado || "-"}
                        </span>
                      </td>
                      <td
                        className={`w-[100px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusClasses} inline-block whitespace-nowrap`}
                        >
                          {imovel.status}
                        </span>
                      </td>
                      <td
                        className={`w-[130px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <span
                          className={`${isDark ? "text-gray-300" : "text-gray-900"} text-sm block font-semibold`}
                        >
                          {imovel.preco_formatado}
                        </span>
                      </td>
                      <td
                        className={`w-[150px] p-3 text-center border ${isDark ? "border-gray-700" : "border-gray-200"}`}
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <BotaoDesempenho imovel={imovel} />
                          <div className="relative group">
                            <button
                              onClick={() =>
                                navigate(`/admin/imoveis/editar/${imovel.id}`)
                              }
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
                          <div className="relative group">
                            <button
                              onClick={() => handleDelete(imovel.id)}
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
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Imoveis;
