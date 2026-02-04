import React, { useState, useEffect } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState([
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

  // Ícones SVG inline
  const icons = {
    building: (
      <svg
        className="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
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
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5 0c-.281.384-.5.819-.5 1.287 0 1.136-.906 2.058-2.025 2.058S16 18.136 16 17c0-.468-.219-.903-.5-1.287"
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
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
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
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    arrowUp: (
      <svg
        className="w-4 h-4 text-green-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    arrowDown: (
      <svg
        className="w-4 h-4 text-red-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
        />
      </svg>
    ),
    clock: (
      <svg
        className="w-4 h-4 inline-block mr-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    calendar: (
      <svg
        className="w-4 h-4 mr-2"
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
    star: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ),
  };

  // Componente Button simples (substituto)
  const Button = ({
    children,
    variant = "primary",
    onClick,
    className = "",
  }) => {
    const base =
      "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center px-4 py-2.5";
    const variants = {
      primary:
        "bg-[#D4A24D] text-white hover:bg-[#c1923e] focus:ring-[#D4A24D]",
      secondary:
        "bg-[#31353E] text-white hover:bg-[#25282f] focus:ring-[#31353E]",
      outline:
        "border border-[#D4A24D] text-[#D4A24D] hover:bg-[#D4A24D] hover:text-white focus:ring-[#D4A24D]",
      ghost: "text-[#31353E] hover:bg-gray-100 focus:ring-gray-300",
    };

    return (
      <button
        onClick={onClick}
        className={`${base} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">
              {icons.clock}
              Última atualização: Hoje, 14:30
            </p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <Button variant="outline">
              {icons.calendar}
              Este mês
            </Button>
            <Button variant="primary">Gerar Relatório</Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? icons.arrowUp : icons.arrowDown}
                    <span
                      className={`text-sm font-medium ml-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.change} este mês
                    </span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  {statIcons[index]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Conteúdo simplificado */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Bem-vindo ao Painel Admin
        </h2>
        <p className="text-gray-600 mb-6">
          Gerencie seus imóveis, corretores e leads de forma eficiente.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Acesso Rápido</h3>
            <div className="space-y-2">
              <a
                href="/admin/imoveis"
                className="block text-blue-600 hover:text-blue-800"
              >
                Imóveis
              </a>
              <a
                href="/admin/corretores"
                className="block text-blue-600 hover:text-blue-800"
              >
                Corretores
              </a>
              <a
                href="/admin/leads"
                className="block text-blue-600 hover:text-blue-800"
              >
                Leads
              </a>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800 mb-2">Estatísticas</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Imóveis ativos:</span>
                <span className="font-semibold">156</span>
              </div>
              <div className="flex justify-between">
                <span>Leads hoje:</span>
                <span className="font-semibold">12</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#D4A24D]/10 rounded-lg">
            <h3 className="font-semibold text-[#c1923e] mb-2">Dicas</h3>
            <p className="text-sm text-gray-700">
              Revise os leads pendentes diariamente para aumentar a conversão.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
