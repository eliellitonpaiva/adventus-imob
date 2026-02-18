import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { isDark } = useTheme();

  // Estados para dados reais
  const [stats, setStats] = useState([
    {
      title: "Total de Imóveis",
      value: "0",
      change: "+0%",
      trend: "up",
      color: isDark ? "bg-blue-600" : "bg-blue-500",
    },
    {
      title: "Corretores Ativos",
      value: "0",
      change: "+0%",
      trend: "up",
      color: isDark ? "bg-green-600" : "bg-green-500",
    },
    {
      title: "Novos Leads (hoje)",
      value: "0",
      change: "+0",
      trend: "up",
      color: isDark ? "bg-purple-600" : "bg-purple-500",
    },
    {
      title: "Visitas Hoje",
      value: "0",
      change: "0",
      trend: "up",
      color: isDark ? "bg-amber-600" : "bg-[#D4A24D]",
    },
  ]);

  // Estados para as listas
  const [imoveisRecentes, setImoveisRecentes] = useState([]);
  const [leadsRecentes, setLeadsRecentes] = useState([]);
  const [visitasHoje, setVisitasHoje] = useState([]);
  const [corretoresDestaque, setCorretoresDestaque] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);

  // Buscar dados do Supabase
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. CONTAGENS PARA OS KPIs
        const { count: totalImoveis } = await supabase
          .from("imoveis")
          .select("*", { count: "exact", head: true });

        const { count: corretoresAtivos } = await supabase
          .from("corretores")
          .select("*", { count: "exact", head: true })
          .eq("etapa", "aprovado");

        // Leads de hoje
        const hoje = new Date().toISOString().split("T")[0];
        const { count: leadsHoje } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .gte("created_at", hoje);

        // Visitas de hoje
        const { count: visitasHojeCount } = await supabase
          .from("visitas")
          .select("*", { count: "exact", head: true })
          .eq("data_visita", hoje);

        // Comparação com mês passado (para trends)
        const mesPassado = new Date();
        mesPassado.setMonth(mesPassado.getMonth() - 1);

        const { count: imoveisMesPassado } = await supabase
          .from("imoveis")
          .select("*", { count: "exact", head: true })
          .lt("created_at", mesPassado.toISOString());

        const variacaoImoveis = imoveisMesPassado
          ? Math.round(
              ((totalImoveis - imoveisMesPassado) / imoveisMesPassado) * 100,
            )
          : 0;

        setStats([
          {
            title: "Total de Imóveis",
            value: totalImoveis?.toString() || "0",
            change: `${variacaoImoveis > 0 ? "+" : ""}${variacaoImoveis}%`,
            trend: variacaoImoveis >= 0 ? "up" : "down",
            color: isDark ? "bg-blue-600" : "bg-blue-500",
          },
          {
            title: "Corretores Ativos",
            value: corretoresAtivos?.toString() || "0",
            change: "+0%",
            trend: "up",
            color: isDark ? "bg-green-600" : "bg-green-500",
          },
          {
            title: "Novos Leads (hoje)",
            value: leadsHoje?.toString() || "0",
            change: `+${leadsHoje || 0}`,
            trend: "up",
            color: isDark ? "bg-purple-600" : "bg-purple-500",
          },
          {
            title: "Visitas Hoje",
            value: visitasHojeCount?.toString() || "0",
            change: `${visitasHojeCount || 0}`,
            trend: "up",
            color: isDark ? "bg-amber-600" : "bg-[#D4A24D]",
          },
        ]);

        // 2. IMÓVEIS RECENTES
        const { data: imoveis } = await supabase
          .from("imoveis")
          .select("id, codigo, titulo, bairro, cidade, preco, created_at")
          .order("created_at", { ascending: false })
          .limit(5);

        setImoveisRecentes(imoveis || []);

        // 3. LEADS RECENTES (TODOS os últimos leads)
        const { data: leads } = await supabase
          .from("leads")
          .select("id, nome, telefone, email, created_at, status")
          .order("created_at", { ascending: false })
          .limit(5);

        setLeadsRecentes(leads || []);

        // 4. VISITAS DE HOJE - Opção 3: MISTO (todas com destaque visual)
        try {
          const { data: visitasData, error: visitasError } = await supabase
            .from("visitas")
            .select(
              "id, imovel_id, data_visita, horario_preferencia, status, nome_cliente, telefone",
            )
            .eq("data_visita", hoje)
            .order("horario_preferencia", { ascending: true });

          if (visitasError) throw visitasError;

          const visitasComImoveis = await Promise.all(
            (visitasData || []).map(async (visita) => {
              const { data: imovel, error: imovelError } = await supabase
                .from("imoveis")
                .select("codigo, titulo, bairro")
                .eq("id", visita.imovel_id)
                .single();

              return {
                ...visita,
                imoveis: imovelError
                  ? {
                      codigo: "N/A",
                      titulo: "Imóvel não encontrado",
                      bairro: "",
                    }
                  : imovel,
              };
            }),
          );

          setVisitasHoje(visitasComImoveis || []);
        } catch (error) {
          console.error("Erro ao buscar visitas:", error);
          setVisitasHoje([]);
        }

        // 5. CORRETORES EM DESTAQUE
        const { data: corretores } = await supabase
          .from("corretores")
          .select("id, nome, avatar_url")
          .limit(5);

        const corretoresComContagem = await Promise.all(
          (corretores || []).map(async (corretor) => {
            const { count } = await supabase
              .from("imoveis")
              .select("*", { count: "exact", head: true })
              .eq("corretor_id", corretor.id);

            return {
              ...corretor,
              imoveis_count: count || 0,
            };
          }),
        );

        corretoresComContagem.sort((a, b) => b.imoveis_count - a.imoveis_count);
        setCorretoresDestaque(corretoresComContagem.slice(0, 3));

        // 6. ALERTAS
        const alertasList = [];

        const { count: leadsAntigos } = await supabase
          .from("leads")
          .select("*", { count: "exact", head: true })
          .eq("status", "nao_lido")
          .lt(
            "created_at",
            new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          );

        if (leadsAntigos > 0) {
          alertasList.push({
            tipo: "alerta",
            mensagem: `${leadsAntigos} lead(s) aguardando resposta há mais de 24h`,
          });
        }

        const amanha = new Date();
        amanha.setDate(amanha.getDate() + 1);
        const amanhaStr = amanha.toISOString().split("T")[0];

        const { count: visitasNaoConfirmadas } = await supabase
          .from("visitas")
          .select("*", { count: "exact", head: true })
          .eq("data_visita", amanhaStr)
          .eq("status", "solicitada");

        if (visitasNaoConfirmadas > 0) {
          alertasList.push({
            tipo: "aviso",
            mensagem: `${visitasNaoConfirmadas} visita(s) para amanhã aguardam confirmação`,
          });
        }

        setAlertas(alertasList);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isDark]);

  // Ícones
  const icons = {
    building: (
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14"
        />
      </svg>
    ),
    users: (
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4a4 4 0 100 8 4 4 0 000-8zM4 20a8 8 0 0116 0"
        />
      </svg>
    ),
    envelope: (
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
    currency: (
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-2 0-3 1-3 2s1 2 3 2 3 1 3 2-1 2-3 2"
        />
      </svg>
    ),
    arrowUp: (
      <span
        className={`${isDark ? "text-emerald-400" : "text-green-600"} font-semibold`}
      >
        ▲
      </span>
    ),
    arrowDown: (
      <span
        className={`${isDark ? "text-rose-400" : "text-red-600"} font-semibold`}
      >
        ▼
      </span>
    ),
    calendar: (
      <svg
        className="w-5 h-5"
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
    ),
  };

  const Button = ({ children, variant = "primary" }) => {
    const styles = {
      primary: isDark
        ? "bg-amber-600/80 text-white hover:bg-amber-600"
        : "bg-[#D4A24D] text-white hover:bg-[#c1923e]",
      outline: isDark
        ? "border border-amber-500 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300"
        : "border border-[#D4A24D] text-[#D4A24D] bg-transparent hover:bg-[#D4A24D]/10",
    };

    return (
      <button
        className={`px-4 py-2 rounded-lg font-medium transition ${styles[variant]}`}
      >
        {children}
      </button>
    );
  };

  const formatarPreco = (preco) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(preco || 0);
  };

  const formatarDataRelativa = (data) => {
    const agora = new Date();
    const diff = agora - new Date(data);
    const horas = Math.floor(diff / (1000 * 60 * 60));

    if (horas < 1) return "agora mesmo";
    if (horas === 1) return "há 1 hora";
    if (horas < 24) return `há ${horas} horas`;
    return new Date(data).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24D]"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
            >
              Dashboard
            </h1>
            <p
              className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
            >
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isDark
                  ? "border border-amber-500 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300"
                  : "border border-[#D4A24D] text-[#D4A24D] bg-transparent hover:bg-[#D4A24D]/10"
              }`}
            >
              Este mês
            </button>
            <Button>Gerar relatório</Button>
          </div>
        </header>

        {/* KPIs */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const statIcons = [
              icons.building,
              icons.users,
              icons.envelope,
              icons.currency,
            ];

            return (
              <div
                key={stat.title}
                className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl p-6 hover:shadow-md transition flex flex-col items-center text-center`}
              >
                <div className={`${stat.color} p-4 rounded-2xl mb-4 shadow-sm`}>
                  {statIcons[index]}
                </div>
                <p
                  className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                >
                  {stat.value}
                </p>
                <p
                  className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {stat.title}
                </p>
                <div className="flex items-center gap-1 mt-3 text-sm font-medium">
                  {stat.trend === "up" ? icons.arrowUp : icons.arrowDown}
                  <span
                    className={
                      stat.trend === "up"
                        ? isDark
                          ? "text-emerald-400"
                          : "text-green-600"
                        : isDark
                          ? "text-rose-400"
                          : "text-red-600"
                    }
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* GRID DE CONTEÚDO */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* IMÓVEIS RECENTES */}
          <div
            className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl p-6`}
          >
            <h2
              className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}
            >
              Imóveis Recentes
            </h2>
            <div className="space-y-4">
              {imoveisRecentes.length > 0 ? (
                imoveisRecentes.map((imovel) => (
                  <Link
                    key={imovel.id}
                    to={`/admin/imoveis/editar/${imovel.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition ${
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${isDark ? "bg-blue-900/30" : "bg-blue-100"} flex items-center justify-center`}
                      >
                        <span
                          className={`text-sm font-bold ${isDark ? "text-blue-400" : "text-blue-700"}`}
                        >
                          {imovel.codigo?.split("-")[0] || "IMO"}
                        </span>
                      </div>
                      <div>
                        <p
                          className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
                        >
                          {imovel.codigo} - {imovel.bairro || imovel.cidade}
                        </p>
                        <p
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {formatarPreco(imovel.preco)} •{" "}
                          {formatarDataRelativa(imovel.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isDark
                          ? "bg-emerald-900/30 text-emerald-400"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      Novo
                    </span>
                  </Link>
                ))
              ) : (
                <p
                  className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Nenhum imóvel cadastrado recentemente
                </p>
              )}
            </div>
            <Link
              to="/admin/imoveis"
              className={`block text-center mt-4 text-sm font-medium ${
                isDark
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-[#D4A24D] hover:text-[#c1923e]"
              }`}
            >
              Ver todos os imóveis →
            </Link>
          </div>

          {/* LEADS NOVOS */}
          <div
            className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl p-6`}
          >
            <h2
              className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}
            >
              Leads Recentes
            </h2>
            <div className="space-y-4">
              {leadsRecentes.length > 0 ? (
                leadsRecentes.map((lead) => (
                  <Link
                    key={lead.id}
                    to={`/admin/leads/${lead.id}`}
                    className={`flex items-center justify-between p-3 rounded-lg transition ${
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full ${isDark ? "bg-purple-900/30" : "bg-purple-100"} flex items-center justify-center`}
                      >
                        <span
                          className={`text-sm font-bold ${isDark ? "text-purple-400" : "text-purple-700"}`}
                        >
                          {lead.nome?.charAt(0) || "L"}
                        </span>
                      </div>
                      <div>
                        <p
                          className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
                        >
                          {lead.nome}
                        </p>
                        <p
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {lead.telefone} •{" "}
                          {formatarDataRelativa(lead.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        lead.status === "nao_lido" || lead.status === "novo"
                          ? isDark
                            ? "bg-red-900/30 text-red-400"
                            : "bg-red-100 text-red-700"
                          : isDark
                            ? "bg-gray-700 text-gray-400"
                            : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {lead.status === "nao_lido" || lead.status === "novo"
                        ? "🆕 Novo"
                        : "✅ Visto"}
                    </span>
                  </Link>
                ))
              ) : (
                <p
                  className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Nenhum lead no momento
                </p>
              )}
            </div>
            <Link
              to="/admin/leads"
              className={`block text-center mt-4 text-sm font-medium ${
                isDark
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-[#D4A24D] hover:text-[#c1923e]"
              }`}
            >
              Ver todos os leads →
            </Link>
          </div>

          {/* VISITAS DE HOJE - Opção 3: MISTO (todas com destaque visual) */}
          <div
            className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl p-6`}
          >
            <h2
              className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4 flex items-center gap-2`}
            >
              {icons.calendar}
              Visitas de Hoje
            </h2>
            <div className="space-y-4">
              {visitasHoje.length > 0 ? (
                visitasHoje.map((visita) => (
                  <div
                    key={visita.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <div>
                      <p
                        className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
                      >
                        {visita.horario_preferencia === "manha"
                          ? "🌅 Manhã"
                          : "☀️ Tarde"}
                      </p>
                      <p
                        className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {visita.nome_cliente} • {visita.imoveis?.codigo}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        visita.status === "solicitada"
                          ? isDark
                            ? "bg-amber-900/30 text-amber-400"
                            : "bg-amber-100 text-amber-700" // 🔸 Laranja = pendente
                          : visita.status === "agendada" ||
                              visita.status === "confirmada"
                            ? isDark
                              ? "bg-emerald-900/30 text-emerald-400"
                              : "bg-emerald-100 text-emerald-700" // ✅ Verde = confirmada
                            : isDark
                              ? "bg-gray-700 text-gray-400"
                              : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {visita.status === "solicitada"
                        ? "⏳ Pendente"
                        : visita.status === "agendada"
                          ? "📅 Agendada"
                          : visita.status === "confirmada"
                            ? "✅ Confirmada"
                            : visita.status}
                    </span>
                  </div>
                ))
              ) : (
                <p
                  className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Nenhuma visita agendada para hoje
                </p>
              )}
            </div>
          </div>

          {/* CORRETORES EM DESTAQUE */}
          <div
            className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl p-6`}
          >
            <h2
              className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}
            >
              Corretores em Destaque
            </h2>
            <div className="space-y-4">
              {corretoresDestaque.length > 0 ? (
                corretoresDestaque.map((corretor, index) => (
                  <div
                    key={corretor.id}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      isDark ? "bg-gray-700/50" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          index === 0
                            ? isDark
                              ? "bg-yellow-900/50 text-yellow-400"
                              : "bg-yellow-100 text-yellow-700"
                            : index === 1
                              ? isDark
                                ? "bg-gray-600 text-gray-300"
                                : "bg-gray-200 text-gray-700"
                              : isDark
                                ? "bg-amber-900/50 text-amber-400"
                                : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                      </div>
                      <div>
                        <p
                          className={`font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
                        >
                          {corretor.nome}
                        </p>
                        <p
                          className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}
                        >
                          {corretor.imoveis_count} imóveis cadastrados
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p
                  className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  Nenhum corretor em destaque
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ALERTAS */}
        {alertas.length > 0 && (
          <div
            className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl p-6`}
          >
            <h2
              className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-4`}
            >
              Alertas e Avisos
            </h2>
            <div className="space-y-3">
              {alertas.map((alerta, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    alerta.tipo === "alerta"
                      ? isDark
                        ? "bg-red-900/20 border border-red-800"
                        : "bg-red-50 border border-red-200"
                      : alerta.tipo === "aviso"
                        ? isDark
                          ? "bg-amber-900/20 border border-amber-800"
                          : "bg-amber-50 border border-amber-200"
                        : isDark
                          ? "bg-blue-900/20 border border-blue-800"
                          : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <p
                    className={`text-sm ${
                      alerta.tipo === "alerta"
                        ? isDark
                          ? "text-red-400"
                          : "text-red-700"
                        : alerta.tipo === "aviso"
                          ? isDark
                            ? "text-amber-400"
                            : "text-amber-700"
                          : isDark
                            ? "text-blue-400"
                            : "text-blue-700"
                    }`}
                  >
                    {alerta.mensagem}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ACESSO RÁPIDO */}
        <section
          className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl p-6`}
        >
          <h2
            className={`text-xl font-semibold ${isDark ? "text-gray-100" : "text-gray-900"} mb-1`}
          >
            Acesso rápido
          </h2>
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"} mb-6`}>
            Atalhos para o que você mais usa no dia a dia
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              className={`rounded-xl ${isDark ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50"} p-5`}
            >
              <h3
                className={`font-semibold ${isDark ? "text-blue-300" : "text-blue-900"} mb-3`}
              >
                Gestão
              </h3>
              <ul
                className={`space-y-2 ${isDark ? "text-blue-400" : "text-blue-700"}`}
              >
                <li>
                  <Link
                    to="/admin/imoveis"
                    className={`hover:underline ${isDark ? "hover:text-blue-300" : "hover:text-blue-900"}`}
                  >
                    Imóveis
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/corretores"
                    className={`hover:underline ${isDark ? "hover:text-blue-300" : "hover:text-blue-900"}`}
                  >
                    Corretores
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/leads"
                    className={`hover:underline ${isDark ? "hover:text-blue-300" : "hover:text-blue-900"}`}
                  >
                    Leads
                  </Link>
                </li>
              </ul>
            </div>

            <div
              className={`rounded-xl ${isDark ? "bg-emerald-900/20 border border-emerald-800/30" : "bg-green-50"} p-5`}
            >
              <h3
                className={`font-semibold ${isDark ? "text-emerald-300" : "text-green-900"} mb-3`}
              >
                Resumo rápido
              </h3>
              <p
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"} leading-relaxed`}
              >
                • {stats[0].value} imóveis ativos
                <br />• {stats[2].value} leads recebidos hoje
              </p>
            </div>

            <div
              className={`rounded-xl ${isDark ? "bg-amber-900/20 border border-amber-800/30" : "bg-[#D4A24D]/10"} p-5`}
            >
              <h3
                className={`font-semibold ${isDark ? "text-amber-300" : "text-[#c1923e]"} mb-3`}
              >
                Insight
              </h3>
              <p
                className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Responder um lead em até 15 minutos aumenta muito a chance de
                fechamento.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
