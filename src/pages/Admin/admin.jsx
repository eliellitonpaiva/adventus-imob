import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isDark } = useTheme();

  // ========== ESTADOS ==========
  const [kpis, setKpis] = useState({
    imoveisAtivos: 0,
    corretoresAtivos: 0,
    leadsHoje: 0,
    visitasHoje: 0,
    visitasMes: 0,
    leadsSemAtendimento: 0,
    visitasVencidas: 0,
    vendasMes: 0,
  });

  const [variacoes, setVariacoes] = useState({
    imoveis: { valor: 0, tendencia: "up" },
    corretores: { valor: 0, tendencia: "up" },
    leads: { valor: 0, tendencia: "up" },
    visitas: { valor: 0, tendencia: "up" },
    vendas: { valor: 0, tendencia: "up" },
  });

  const [atencao, setAtencao] = useState({
    leadsAguardando: [],
    visitasVencidasList: [],
    imoveisSemVisitas: [],
  });

  const [funil, setFunil] = useState({
    leadsMes: 0,
    visitasMes: 0,
    taxaConversao: 0,
  });

  const [rankingCorretores, setRankingCorretores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [dataAtualizacao, setDataAtualizacao] = useState(new Date());

  // ========== BUSCAR DADOS ==========
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const hoje = new Date().toISOString().split("T")[0];

        // Datas para comparação mensal
        const inicioMes = new Date();
        inicioMes.setDate(1);
        inicioMes.setHours(0, 0, 0, 0);
        const inicioMesStr = inicioMes.toISOString();

        const mesPassado = new Date();
        mesPassado.setMonth(mesPassado.getMonth() - 1);
        mesPassado.setDate(1);
        mesPassado.setHours(0, 0, 0, 0);
        const mesPassadoStr = mesPassado.toISOString();

        const fimMesPassado = new Date();
        fimMesPassado.setMonth(fimMesPassado.getMonth(), 0);
        fimMesPassado.setHours(23, 59, 59, 999);
        const fimMesPassadoStr = fimMesPassado.toISOString();

        // ===== 1. QUERIES PRINCIPAIS =====

        // IMÓVEIS ATIVOS
        const { count: imoveisAtivos } = await supabase
          .from("imoveis")
          .select("*", { count: "exact", head: true })
          .eq("status", "disponivel");

        // CORRETORES ATIVOS
        const { count: corretoresAtivos } = await supabase
          .from("corretores")
          .select("*", { count: "exact", head: true })
          .eq("etapa", "aprovado");

        // LEADS HOJE
        const { count: leadsHoje } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", hoje);

        // LEADS SEM ATENDIMENTO
        const { count: leadsSemAtendimento } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("status", "novo");

        // VISITAS DE HOJE
        const { count: visitasHojeCount } = await supabase
          .from("visitas")
          .select("*", { count: "exact", head: true })
          .eq("data_visita", hoje)
          .in("status", ["agendada", "confirmada"]);

        // VISITAS VENCIDAS
        const { count: visitasVencidas } = await supabase
          .from("visitas")
          .select("*", { count: "exact", head: true })
          .eq("status", "agendada")
          .lt("data_visita", hoje);

        // ===== 2. VISITAS NO MÊS (PARA O KPI) =====
        const { count: visitasMesCount } = await supabase
          .from("visitas")
          .select("*", { count: "exact", head: true })
          .in("status", ["agendada", "confirmada"])
          .gte("created_at", inicioMesStr);

        // ===== 3. VENDAS NO MÊS (NOVO!) =====
        const { count: vendasMesCount } = await supabase
          .from("imoveis")
          .select("*", { count: "exact", head: true })
          .eq("status", "Vendido") // Com V maiúsculo
          .gte("updated_at", inicioMesStr);

        // Vendas mês passado (para variação)
        const { count: vendasMesPassado } = await supabase
          .from("imoveis")
          .select("*", { count: "exact", head: true })
          .eq("status", "Vendido")
          .gte("updated_at", mesPassadoStr)
          .lt("updated_at", fimMesPassadoStr);

        // ===== 4. COMPARATIVOS MENSAIS =====

        // Imóveis mês atual vs mês passado
        const { count: imoveisMesAtual } = await supabase
          .from("imoveis")
          .select("*", { count: "exact", head: true })
          .gte("created_at", inicioMesStr);

        const { count: imoveisMesPassado } = await supabase
          .from("imoveis")
          .select("*", { count: "exact", head: true })
          .gte("created_at", mesPassadoStr)
          .lt("created_at", fimMesPassadoStr);

        // Leads mês atual vs mês passado
        const { count: leadsMesAtual } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", inicioMesStr);

        const { count: leadsMesPassado } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", mesPassadoStr)
          .lt("created_at", fimMesPassadoStr);

        // Visitas mês atual vs mês passado
        const { count: visitasMesAtual } = await supabase
          .from("visitas")
          .select("*", { count: "exact", head: true })
          .in("status", ["agendada", "confirmada"])
          .gte("created_at", inicioMesStr);

        const { count: visitasMesPassado } = await supabase
          .from("visitas")
          .select("*", { count: "exact", head: true })
          .in("status", ["agendada", "confirmada"])
          .gte("created_at", mesPassadoStr)
          .lt("created_at", fimMesPassadoStr);

        // ===== 5. CALCULAR VARIAÇÕES =====
        const variacaoImoveis =
          imoveisMesPassado > 0
            ? Math.round(
                ((imoveisMesAtual - imoveisMesPassado) / imoveisMesPassado) *
                  100,
              )
            : 0;

        const variacaoLeads =
          leadsMesPassado > 0
            ? Math.round(
                ((leadsMesAtual - leadsMesPassado) / leadsMesPassado) * 100,
              )
            : 0;

        const variacaoVisitas =
          visitasMesPassado > 0
            ? Math.round(
                ((visitasMesAtual - visitasMesPassado) / visitasMesPassado) *
                  100,
              )
            : 0;

        const variacaoVendas =
          vendasMesPassado > 0
            ? Math.round(
                ((vendasMesCount - vendasMesPassado) / vendasMesPassado) * 100,
              )
            : vendasMesCount > 0
              ? 100
              : 0;

        // ===== 6. FUNIL COMERCIAL =====
        const { count: leadsMes } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", inicioMesStr);

        const { count: visitasMes } = await supabase
          .from("visitas")
          .select("*", { count: "exact", head: true })
          .in("status", ["agendada", "confirmada"])
          .gte("created_at", inicioMesStr);

        const taxaConversao =
          leadsMes > 0 ? Math.round((visitasMes / leadsMes) * 100) : 0;

        // ===== 7. ATUALIZAR TODOS OS ESTADOS =====
        setKpis({
          imoveisAtivos: imoveisAtivos || 0,
          corretoresAtivos: corretoresAtivos || 0,
          leadsHoje: leadsHoje || 0,
          visitasHoje: visitasHojeCount || 0,
          visitasMes: visitasMesCount || 0,
          leadsSemAtendimento: leadsSemAtendimento || 0,
          visitasVencidas: visitasVencidas || 0,
          vendasMes: vendasMesCount || 0, // ← AGORA FUNCIONA!
        });

        setVariacoes({
          imoveis: {
            valor: Math.abs(variacaoImoveis),
            tendencia: variacaoImoveis >= 0 ? "up" : "down",
          },
          corretores: { valor: 0, tendencia: "up" },
          leads: {
            valor: Math.abs(variacaoLeads),
            tendencia: variacaoLeads >= 0 ? "up" : "down",
          },
          visitas: {
            valor: Math.abs(variacaoVisitas),
            tendencia: variacaoVisitas >= 0 ? "up" : "down",
          },
          vendas: {
            valor: Math.abs(variacaoVendas),
            tendencia: variacaoVendas >= 0 ? "up" : "down",
          },
        });

        setFunil({
          leadsMes: leadsMes || 0,
          visitasMes: visitasMes || 0,
          taxaConversao,
        });

        // ===== 8. CENTRAL DE ATENÇÃO =====
        const trintaMinutosAtras = new Date();
        trintaMinutosAtras.setMinutes(trintaMinutosAtras.getMinutes() - 30);
        const trintaMinutosAtrasStr = trintaMinutosAtras.toISOString();

        const { data: leadsAguardando } = await supabase
          .from("leads")
          .select("id, nome, telefone, created_at")
          .eq("status", "novo")
          .lt("created_at", trintaMinutosAtrasStr)
          .order("created_at", { ascending: false })
          .limit(5);

        const { data: visitasVencidasList } = await supabase
          .from("visitas")
          .select(
            `
            id, 
            data_visita, 
            horario_preferencia, 
            nome_cliente, 
            telefone,
            imoveis (codigo, titulo, bairro)
          `,
          )
          .eq("status", "agendada")
          .lt("data_visita", hoje)
          .order("data_visita", { ascending: false })
          .limit(5);

        const trintaDiasAtras = new Date();
        trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
        const trintaDiasAtrasStr = trintaDiasAtras.toISOString();

        const { data: imoveisAntigos } = await supabase
          .from("imoveis")
          .select("id, codigo, bairro, cidade, created_at")
          .lt("created_at", trintaDiasAtrasStr)
          .order("created_at", { ascending: false });

        const imoveisSemVisitas = [];
        for (const imovel of imoveisAntigos || []) {
          const { count } = await supabase
            .from("visitas")
            .select("*", { count: "exact", head: true })
            .eq("imovel_id", imovel.id);

          if (count === 0 && imoveisSemVisitas.length < 5) {
            imoveisSemVisitas.push(imovel);
          }
        }

        setAtencao({
          leadsAguardando: leadsAguardando || [],
          visitasVencidasList: visitasVencidasList || [],
          imoveisSemVisitas: imoveisSemVisitas || [],
        });

        // ===== 9. RANKING DE CORRETORES =====
        const { data: corretores } = await supabase
          .from("corretores")
          .select("id, nome")
          .limit(10);

        const corretoresComVisitas = await Promise.all(
          (corretores || []).map(async (corretor) => {
            const { count } = await supabase
              .from("visitas")
              .select("*", { count: "exact", head: true })
              .eq("corretor_id", corretor.id)
              .gte("created_at", inicioMesStr);

            return {
              ...corretor,
              visitas_mes: count || 0,
            };
          }),
        );

        const ranking = corretoresComVisitas
          .filter((c) => c.visitas_mes > 0)
          .sort((a, b) => b.visitas_mes - a.visitas_mes)
          .slice(0, 5);

        setRankingCorretores(ranking);
        setDataAtualizacao(new Date());
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [isDark]);

  // ========== ÍCONES ==========
  const icons = {
    building: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14" />
        <path d="M9 7h1m-1 3h1m4-3h1m-1 3h1" />
      </svg>
    ),
    envelope: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    calendar: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    trendingUp: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 20L8.4 13.6C9.2 12.8 10.5 12.8 11.3 13.6L13.8 16.1C14.6 16.9 15.9 16.9 16.7 16.1L22 10.8" />
        <path d="M17 8H22V13" />
      </svg>
    ),
    arrowUp: (
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M5 15l7-7 7 7" />
      </svg>
    ),
    arrowDown: (
      <svg
        className="w-3 h-3"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M19 9l-7 7-7-7" />
      </svg>
    ),
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  const formatarDataRelativa = (data) => {
    const agora = new Date();
    const diff = agora - new Date(data);
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor(diff / (1000 * 60 * 60));

    if (dias > 0) return `há ${dias} ${dias === 1 ? "dia" : "dias"}`;
    if (horas > 0) return `há ${horas} ${horas === 1 ? "hora" : "horas"}`;
    return "agora mesmo";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24D] opacity-50"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="space-y-1">
            <h1
              className={`text-4xl font-light tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Estratégico
            </h1>
            <p
              className={`text-sm font-light tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {dataAtualizacao.toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • Última atualização
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className={`px-5 py-2 text-xs font-medium uppercase tracking-wider transition-opacity hover:opacity-70 ${
              isDark
                ? "text-gray-400 border border-gray-800 hover:border-gray-700"
                : "text-gray-500 border border-gray-200 hover:border-gray-300"
            } rounded-full`}
          >
            Atualizar
          </button>
        </header>

        {/* ===== 1. BARRA DE KPIs ESTRATÉGICOS ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "IMÓVEIS ATIVOS",
              value: kpis.imoveisAtivos ?? 0,
              icon: icons.building,
              variacao: variacoes.imoveis,
              color: "emerald",
            },
            {
              label: "NOVOS LEADS",
              value: kpis.leadsHoje ?? 0,
              icon: icons.envelope,
              variacao: variacoes.leads,
              color: "blue",
            },
            {
              label: "VISITAS AGENDADAS",
              value: kpis.visitasMes ?? 0,
              icon: icons.calendar,
              variacao: variacoes.visitas,
              color: "amber",
            },
            {
              label: "VENDAS NO MÊS",
              value: kpis.vendasMes ?? 0, // ← AGORA FUNCIONA!
              icon: icons.trendingUp,
              variacao: variacoes.vendas,
              color: "violet",
            },
          ].map((kpi, index) => {
            // Mapa de cores
            const colorMap = {
              emerald: {
                bg: isDark ? "bg-emerald-500/10" : "bg-emerald-500/8",
                text: isDark ? "text-emerald-400" : "text-emerald-600",
                icon: isDark ? "text-emerald-400" : "text-emerald-600",
                glow: isDark ? "via-emerald-500/20" : "via-emerald-500/15",
              },
              blue: {
                bg: isDark ? "bg-blue-500/10" : "bg-blue-500/8",
                text: isDark ? "text-blue-400" : "text-blue-600",
                icon: isDark ? "text-blue-400" : "text-blue-600",
                glow: isDark ? "via-blue-500/20" : "via-blue-500/15",
              },
              amber: {
                bg: isDark ? "bg-amber-500/10" : "bg-amber-500/8",
                text: isDark ? "text-amber-400" : "text-amber-600",
                icon: isDark ? "text-amber-400" : "text-amber-600",
                glow: isDark ? "via-amber-500/20" : "via-amber-500/15",
              },
              violet: {
                bg: isDark ? "bg-violet-500/10" : "bg-violet-500/8",
                text: isDark ? "text-violet-400" : "text-violet-600",
                icon: isDark ? "text-violet-400" : "text-violet-600",
                glow: isDark ? "via-violet-500/20" : "via-violet-500/15",
              },
            };

            const colors = colorMap[kpi.color];

            // Lógica do badge
            const badgeConfig = {
              up: { color: "emerald", icon: icons.arrowUp },
              down: { color: "red", icon: icons.arrowDown },
            };

            const tendenciaAtual = kpi.variacao?.tendencia || "up";
            const badgeStyle = badgeConfig[tendenciaAtual] || badgeConfig.up;

            const badgeColors = {
              emerald: {
                bg: isDark ? "bg-emerald-500/15" : "bg-emerald-500/10",
                text: isDark ? "text-emerald-400" : "text-emerald-600",
                border: isDark
                  ? "border-emerald-500/20"
                  : "border-emerald-500/15",
              },
              red: {
                bg: isDark ? "bg-red-500/15" : "bg-red-500/10",
                text: isDark ? "text-red-400" : "text-red-600",
                border: isDark ? "border-red-500/20" : "border-red-500/15",
              },
            };

            return (
              <div
                key={index}
                className={`
                  ${isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} 
                  border rounded-2xl p-5
                  relative overflow-hidden
                  group transition-all duration-300 hover:shadow-md
                `}
              >
                {/* Glow interno suave */}
                <div
                  className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-700 ease-in-out
                    pointer-events-none rounded-2xl
                    bg-gradient-to-br from-transparent ${colors.glow} to-transparent
                  `}
                />

                {/* Layout com Número em Cima e Label Embaixo */}
                <div className="flex flex-col relative z-10">
                  {/* Linha Superior - Ícone + Número + Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {/* Ícone Luminoso */}
                      <div
                        className={`
                          w-8 h-8 rounded-xl 
                          flex items-center justify-center
                          ${colors.bg}
                          backdrop-blur-sm
                          transition-all duration-300
                        `}
                      >
                        <div className={`w-4 h-4 ${colors.icon}`}>
                          {kpi.icon}
                        </div>
                      </div>

                      {/* Número Grande */}
                      <p
                        className={`
                        text-4xl font-light tracking-tight leading-none
                        ${isDark ? "text-white" : "text-gray-900"}
                      `}
                      >
                        {kpi.value}
                      </p>
                    </div>

                    {/* Badge de Variação */}
                    {kpi.variacao && (
                      <div
                        className={`
                          flex items-center gap-1 px-2 py-0.5 
                          rounded-full text-[10px] font-medium
                          backdrop-blur-md
                          ${badgeColors[badgeStyle.color].bg}
                          ${badgeColors[badgeStyle.color].text}
                          border ${badgeColors[badgeStyle.color].border}
                          transition-all duration-300
                          whitespace-nowrap
                        `}
                      >
                        <span className="w-2.5 h-2.5">{badgeStyle.icon}</span>
                        <span>{kpi.variacao.valor || 0}%</span>
                      </div>
                    )}
                  </div>

                  {/* Linha Inferior - Label */}
                  <p
                    className={`
                    text-[11px] font-medium tracking-widest uppercase
                    ${isDark ? "text-gray-500" : "text-gray-400"}
                    pl-[40px]
                  `}
                  >
                    {kpi.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== 2. CENTRAL DE ATENÇÃO ===== */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2
              className={`text-3xl font-light tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Central de Atenção
            </h2>
            <p
              className={`text-sm font-light ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Prioridades que requerem ação imediata
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads aguardando */}
            <div
              className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-2xl p-6 shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"} ${atencao.leadsAguardando.length > 0 ? "ring-1 ring-red-500/20" : ""}`}
            >
              <div className="flex items-center justify-between mb-5">
                <h3
                  className={`text-sm font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Leads Aguardando
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    atencao.leadsAguardando.length > 0
                      ? "bg-red-500/10 text-red-500"
                      : isDark
                        ? "bg-gray-800 text-gray-500"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {atencao.leadsAguardando.length}
                </span>
              </div>
              <div className="space-y-3">
                {atencao.leadsAguardando.length > 0 ? (
                  atencao.leadsAguardando.map((lead) => (
                    <Link
                      key={lead.id}
                      to={`/admin/leads/${lead.id}`}
                      className={`block p-3 rounded-xl transition-all hover:scale-[1.02] ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                    >
                      <p
                        className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {lead.nome}
                      </p>
                      <p
                        className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {lead.telefone} •{" "}
                        {formatarDataRelativa(lead.created_at)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p
                    className={`text-sm py-4 text-center ${isDark ? "text-gray-600" : "text-gray-300"}`}
                  >
                    Nenhum lead aguardando
                  </p>
                )}
              </div>
            </div>

            {/* Visitas vencidas */}
            <div
              className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-2xl p-6 shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"} ${atencao.visitasVencidasList.length > 0 ? "ring-1 ring-red-500/20" : ""}`}
            >
              <div className="flex items-center justify-between mb-5">
                <h3
                  className={`text-sm font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Visitas Vencidas
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    atencao.visitasVencidasList.length > 0
                      ? "bg-red-500/10 text-red-500"
                      : isDark
                        ? "bg-gray-800 text-gray-500"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {atencao.visitasVencidasList.length}
                </span>
              </div>
              <div className="space-y-3">
                {atencao.visitasVencidasList.length > 0 ? (
                  atencao.visitasVencidasList.map((visita) => (
                    <div
                      key={visita.id}
                      className={`p-3 rounded-xl ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}
                    >
                      <p
                        className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {visita.nome_cliente}
                      </p>
                      <p
                        className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {visita.imoveis?.codigo} •{" "}
                        {formatarData(visita.data_visita)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p
                    className={`text-sm py-4 text-center ${isDark ? "text-gray-600" : "text-gray-300"}`}
                  >
                    Nenhuma visita vencida
                  </p>
                )}
              </div>
            </div>

            {/* Imóveis sem visitas */}
            <div
              className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-2xl p-6 shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"} ${atencao.imoveisSemVisitas.length > 0 ? "ring-1 ring-yellow-500/20" : ""}`}
            >
              <div className="flex items-center justify-between mb-5">
                <h3
                  className={`text-sm font-medium uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Imóveis sem Visitas
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${
                    atencao.imoveisSemVisitas.length > 0
                      ? "bg-yellow-500/10 text-yellow-500"
                      : isDark
                        ? "bg-gray-800 text-gray-500"
                        : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {atencao.imoveisSemVisitas.length}
                </span>
              </div>
              <div className="space-y-3">
                {atencao.imoveisSemVisitas.length > 0 ? (
                  atencao.imoveisSemVisitas.map((imovel) => (
                    <Link
                      key={imovel.id}
                      to={`/admin/imoveis/editar/${imovel.id}`}
                      className={`block p-3 rounded-xl transition-all hover:scale-[1.02] ${isDark ? "hover:bg-gray-800" : "hover:bg-gray-50"}`}
                    >
                      <p
                        className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {imovel.codigo}
                      </p>
                      <p
                        className={`text-xs mt-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {imovel.bairro || imovel.cidade} •{" "}
                        {formatarDataRelativa(imovel.created_at)}
                      </p>
                    </Link>
                  ))
                ) : (
                  <p
                    className={`text-sm py-4 text-center ${isDark ? "text-gray-600" : "text-gray-300"}`}
                  >
                    Todos imóveis têm visitas
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ===== 3. FUNIL COMERCIAL ===== */}
        <section
          className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-2xl p-8 shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"}`}
        >
          <div className="space-y-1 mb-8">
            <h2
              className={`text-2xl font-light tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Funil Comercial
            </h2>
            <p
              className={`text-sm font-light ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              {new Date().toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <p
                className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Leads
              </p>
              <p
                className={`text-5xl font-light ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {funil.leadsMes}
              </p>
            </div>

            <div className="space-y-2">
              <p
                className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Visitas
              </p>
              <p
                className={`text-5xl font-light ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {funil.visitasMes}
              </p>
            </div>

            <div className="space-y-2">
              <p
                className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}
              >
                Conversão
              </p>
              <p
                className={`text-5xl font-light ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {funil.taxaConversao}%
              </p>
            </div>
          </div>

          {/* Linha de progresso */}
          <div
            className={`mt-8 h-px w-full ${isDark ? "bg-gray-800" : "bg-gray-100"}`}
          >
            <div
              className="h-px bg-[#D4A24D] transition-all duration-500"
              style={{ width: `${funil.taxaConversao}%` }}
            />
          </div>
        </section>

        {/* ===== 4. RANKING DE CORRETORES ===== */}
        <section
          className={`${isDark ? "bg-gray-900" : "bg-white"} rounded-2xl p-8 shadow-sm border ${isDark ? "border-gray-800" : "border-gray-100"}`}
        >
          <div className="space-y-1 mb-8">
            <h2
              className={`text-2xl font-light tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Hall da Performance
            </h2>
            <p
              className={`text-sm font-light ${isDark ? "text-gray-500" : "text-gray-400"}`}
            >
              Corretores com mais visitas no mês
            </p>
          </div>

          <div className="space-y-3">
            {rankingCorretores.length > 0 ? (
              rankingCorretores.map((corretor, index) => (
                <div
                  key={corretor.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    index === 0
                      ? isDark
                        ? "bg-gray-800/50 ring-1 ring-[#D4A24D]/20"
                        : "bg-gray-50 ring-1 ring-[#D4A24D]/10"
                      : isDark
                        ? "hover:bg-gray-800/30"
                        : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-6 text-sm font-light ${isDark ? "text-gray-600" : "text-gray-300"}`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                    >
                      {corretor.nome}
                    </span>
                    {index === 0 && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${isDark ? "bg-[#D4A24D]/10 text-[#D4A24D]" : "bg-[#D4A24D]/5 text-[#D4A24D]"}`}
                      >
                        Líder
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-sm font-light ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {corretor.visitas_mes}{" "}
                    {corretor.visitas_mes === 1 ? "visita" : "visitas"}
                  </span>
                </div>
              ))
            ) : (
              <p
                className={`text-center py-8 text-sm ${isDark ? "text-gray-600" : "text-gray-300"}`}
              >
                Nenhuma visita registrada no mês
              </p>
            )}
          </div>
        </section>

        {/* ===== 5. ACESSO RÁPIDO ===== */}
        <section className="pt-4">
          <div className="flex items-center justify-center gap-8">
            <Link
              to="/admin/imoveis"
              className={`text-xs uppercase tracking-wider transition-opacity hover:opacity-60 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              Imóveis
            </Link>
            <span
              className={`text-xs ${isDark ? "text-gray-700" : "text-gray-200"}`}
            >
              •
            </span>
            <Link
              to="/admin/corretores"
              className={`text-xs uppercase tracking-wider transition-opacity hover:opacity-60 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              Corretores
            </Link>
            <span
              className={`text-xs ${isDark ? "text-gray-700" : "text-gray-200"}`}
            >
              •
            </span>
            <Link
              to="/admin/leads"
              className={`text-xs uppercase tracking-wider transition-opacity hover:opacity-60 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              Leads
            </Link>
            <span
              className={`text-xs ${isDark ? "text-gray-700" : "text-gray-200"}`}
            >
              •
            </span>
            <Link
              to="/admin/visitas"
              className={`text-xs uppercase tracking-wider transition-opacity hover:opacity-60 ${isDark ? "text-gray-600" : "text-gray-400"}`}
            >
              Visitas
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
