import React, { useState } from "react";

const Dashboard = () => {
  const [stats] = useState([
    {
      title: "Total de Imóveis",
      value: "156",
      change: "+12%",
      trend: "up",
      color: "bg-blue-500",
    },
    {
      title: "Corretores Ativos",
      value: "24",
      change: "+8%",
      trend: "up",
      color: "bg-green-500",
    },
    {
      title: "Novos Leads",
      value: "89",
      change: "+23%",
      trend: "up",
      color: "bg-purple-500",
    },
    {
      title: "Faturamento",
      value: "R$ 245,8k",
      change: "-5%",
      trend: "down",
      color: "bg-[#D4A24D]",
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
    arrowUp: <span className="text-green-600 font-semibold">▲</span>,
    arrowDown: <span className="text-red-600 font-semibold">▼</span>,
  };

  const Button = ({ children, variant = "primary" }) => {
    const styles = {
      primary: "bg-[#D4A24D] text-white hover:bg-[#c1923e]",
      outline:
        "border border-[#D4A24D] text-[#D4A24D] hover:bg-[#D4A24D] hover:text-white",
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">
              Visão geral do seu CRM imobiliário
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">Este mês</Button>
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
                className="bg-white border border-gray-200 rounded-2xl p-6
                           hover:shadow-md transition
                           flex flex-col items-center text-center"
              >
                {/* Ícone */}
                <div className={`${stat.color} p-4 rounded-2xl mb-4 shadow-sm`}>
                  {statIcons[index]}
                </div>

                {/* Valor */}
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>

                {/* Título */}
                <p className="text-sm text-gray-500 mt-1">{stat.title}</p>

                {/* Tendência */}
                <div className="flex items-center gap-1 mt-3 text-sm font-medium">
                  {stat.trend === "up" ? icons.arrowUp : icons.arrowDown}
                  <span
                    className={
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
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
        <section className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-1">
            Acesso rápido
          </h2>
          <p className="text-gray-500 mb-6">
            Atalhos para o que você mais usa no dia a dia
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl bg-blue-50 p-5">
              <h3 className="font-semibold text-blue-900 mb-3">Gestão</h3>
              <ul className="space-y-2 text-blue-700">
                <li>
                  <a href="/admin/imoveis" className="hover:underline">
                    Imóveis
                  </a>
                </li>
                <li>
                  <a href="/admin/corretores" className="hover:underline">
                    Corretores
                  </a>
                </li>
                <li>
                  <a href="/admin/leads" className="hover:underline">
                    Leads
                  </a>
                </li>
              </ul>
            </div>

            <div className="rounded-xl bg-green-50 p-5">
              <h3 className="font-semibold text-green-900 mb-3">
                Resumo rápido
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                • 156 imóveis ativos
                <br />• 12 leads recebidos hoje
              </p>
            </div>

            <div className="rounded-xl bg-[#D4A24D]/10 p-5">
              <h3 className="font-semibold text-[#c1923e] mb-3">Insight</h3>
              <p className="text-sm text-gray-700">
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
