import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext"; // Importando o contexto de tema

const Dashboard = () => {
  const { isDark } = useTheme(); // Hook para verificar se está no modo escuro
  const [stats] = useState([
    {
      title: "Total de Imóveis",
      value: "156",
      change: "+12%",
      trend: "up",
      color: isDark ? "bg-blue-600" : "bg-blue-500",
    },
    {
      title: "Corretores Ativos",
      value: "24",
      change: "+8%",
      trend: "up",
      color: isDark ? "bg-green-600" : "bg-green-500",
    },
    {
      title: "Novos Leads",
      value: "89",
      change: "+23%",
      trend: "up",
      color: isDark ? "bg-purple-600" : "bg-purple-500",
    },
    {
      title: "Faturamento",
      value: "R$ 245,8k",
      change: "-5%",
      trend: "down",
      color: isDark ? "bg-amber-600" : "bg-[#D4A24D]",
    },
  ]);

  /* Ícones */
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
  };

  const Button = ({ children, variant = "primary" }) => {
    const styles = {
      primary: isDark
        ? "bg-amber-600/80 text-white hover:bg-amber-600"
        : "bg-[#D4A24D] text-white hover:bg-[#c1923e]",
      outline: isDark
        ? "border border-amber-500 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300"
        : "border border-[#D4A24D] text-[#D4A24D] bg-transparent hover:bg-[#D4A24D]/10", // MODIFICADO: fundo transparente no modo claro
    };

    return (
      <button
        className={`px-4 py-2 rounded-lg font-medium transition ${styles[variant]}`}
      >
        {children}
      </button>
    );
  };

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
              Visão geral do seu CRM imobiliário
            </p>
          </div>
          <div className="flex gap-3">
            {/* Botão "Este mês" - CORRIGIDO: No modo claro, fundo transparente, só contorno e texto amarelo */}
            <button
              className={`px-4 py-2 rounded-lg font-medium transition ${
                isDark
                  ? "border border-amber-500 text-amber-400 hover:bg-amber-900/30 hover:text-amber-300"
                  : "border border-[#D4A24D] text-[#D4A24D] bg-transparent hover:bg-[#D4A24D]/10"
              }`}
            >
              Este mês
            </button>

            {/* Botão "Gerar relatório" - Usando o componente Button com estilos diferentes */}
            <Button>Gerar relatório</Button>
          </div>
        </header>

        {/* KPIs / STATS */}
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
                className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border rounded-2xl p-6
                           hover:shadow-md transition
                           flex flex-col items-center text-center`}
              >
                {/* Ícone */}
                <div className={`${stat.color} p-4 rounded-2xl mb-4 shadow-sm`}>
                  {statIcons[index]}
                </div>

                {/* Valor */}
                <p
                  className={`text-3xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
                >
                  {stat.value}
                </p>

                {/* Título */}
                <p
                  className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {stat.title}
                </p>

                {/* Tendência */}
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
                    {stat.change} no mês
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* CONTEÚDO INFERIOR */}
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
                  <a
                    href="/admin/imoveis"
                    className={`hover:underline ${isDark ? "hover:text-blue-300" : "hover:text-blue-900"}`}
                  >
                    Imóveis
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/corretores"
                    className={`hover:underline ${isDark ? "hover:text-blue-300" : "hover:text-blue-900"}`}
                  >
                    Corretores
                  </a>
                </li>
                <li>
                  <a
                    href="/admin/leads"
                    className={`hover:underline ${isDark ? "hover:text-blue-300" : "hover:text-blue-900"}`}
                  >
                    Leads
                  </a>
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
                • 156 imóveis ativos
                <br />• 12 leads recebidos hoje
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
