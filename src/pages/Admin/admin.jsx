import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";

// ============================================
// MOCK DATA
// ============================================
const BAIRROS = [
  "Laranjeiras",
  "Jacuínas",
  "Park",
  "Jardim Glória",
  "Jardim Del Rey",
  "Nova Açailândia",
  "Centro",
  "Vila Ildemar",
  "Jardim Europa",
  "Residencial",
];

const TIPOS = ["Apartamento", "Casa", "Cobertura", "Comercial"];
const CANAIS = ["Site", "Instagram", "Facebook", "Indicação", "Portal"];

// Custo por canal (para cálculo de ROI)
const CUSTO_POR_CANAL = {
  Site: 2000,
  Instagram: 1500,
  Facebook: 1200,
  Indicação: 0,
  Portal: 1800,
};

// Imóveis
const IMOVEIS_MOCK = Array.from({ length: 200 }, (_, i) => {
  const bairro = BAIRROS[Math.floor(Math.random() * BAIRROS.length)];
  const tipo = TIPOS[Math.floor(Math.random() * TIPOS.length)];
  const preco = Math.floor(Math.random() * (2000000 - 200000) + 200000);
  const diasNoSite = Math.floor(Math.random() * 180);

  return {
    id: i + 1,
    codigo: `IMV-${String(i + 1).padStart(4, "0")}`,
    titulo: `Imóvel ${i + 1}`,
    preco,
    status: Math.random() > 0.7 ? "Vendido" : "disponivel",
    created_at: new Date(
      Date.now() - diasNoSite * 24 * 60 * 60 * 1000,
    ).toISOString(),
    bairro,
    cidade: "Açailândia",
    tipo,
    quartos: Math.floor(Math.random() * 4) + 1,
    visitas_count: Math.floor(Math.random() * 20),
    diasNoSite,
  };
});

// Corretores
const CORRETORES_MOCK = [
  {
    id: 1,
    nome: "João Silva",
    email: "joao@email.com",
    ativo: true,
    meta: 500000,
  },
  {
    id: 2,
    nome: "Maria Santos",
    email: "maria@email.com",
    ativo: true,
    meta: 600000,
  },
  {
    id: 3,
    nome: "Pedro Oliveira",
    email: "pedro@email.com",
    ativo: true,
    meta: 450000,
  },
  {
    id: 4,
    nome: "Ana Costa",
    email: "ana@email.com",
    ativo: true,
    meta: 550000,
  },
  {
    id: 5,
    nome: "Carlos Souza",
    email: "carlos@email.com",
    ativo: true,
    meta: 400000,
  },
  {
    id: 6,
    nome: "Fernanda Lima",
    email: "fernanda@email.com",
    ativo: true,
    meta: 520000,
  },
  {
    id: 7,
    nome: "Roberto Alves",
    email: "roberto@email.com",
    ativo: false,
    meta: 350000,
  },
  {
    id: 8,
    nome: "Carla Mendes",
    email: "carla@email.com",
    ativo: true,
    meta: 480000,
  },
];

// Leads
const LEADS_MOCK = Array.from({ length: 300 }, (_, i) => {
  const dataLead = new Date(
    Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000,
  );
  const qualificado = Math.random() > 0.4;
  const canal = CANAIS[Math.floor(Math.random() * CANAIS.length)];
  const diasSemAcao = Math.floor(Math.random() * 20);

  return {
    id: i + 1,
    nome: `Lead ${i + 1}`,
    telefone: `(99) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`,
    email: `lead${i + 1}@email.com`,
    status: ["novo", "contatado", "qualificado", "negociacao", "perdido"][
      Math.floor(Math.random() * 5)
    ],
    canal,
    created_at: dataLead.toISOString(),
    ultimo_contato: new Date(
      dataLead.getTime() + Math.random() * diasSemAcao * 24 * 60 * 60 * 1000,
    ).toISOString(),
    corretor_id: Math.floor(Math.random() * 8) + 1,
    qualificado,
    converted_at:
      qualificado && Math.random() > 0.5
        ? new Date(
            dataLead.getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000,
          ).toISOString()
        : null,
    visitou: Math.random() > 0.6,
  };
});

// Visitas
const VISITAS_MOCK = Array.from({ length: 200 }, (_, i) => {
  const dataVisita = new Date(
    Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000,
  );
  const status = ["realizada", "cancelada", "agendada"][
    Math.floor(Math.random() * 3)
  ];

  return {
    id: i + 1,
    data_visita: dataVisita.toISOString().split("T")[0],
    status,
    realizada: status === "realizada",
    imovel_id: Math.floor(Math.random() * 200) + 1,
    corretor_id: Math.floor(Math.random() * 8) + 1,
    lead_id: Math.floor(Math.random() * 300) + 1,
    created_at: dataVisita.toISOString(),
  };
});

// Propostas
const PROPOSTAS_MOCK = Array.from({ length: 100 }, (_, i) => {
  const dataProposta = new Date(
    Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000,
  );
  const status = ["aprovada", "negociacao", "recusada"][
    Math.floor(Math.random() * 3)
  ];
  const diasTravada =
    status === "negociacao" ? Math.floor(Math.random() * 15) + 5 : 0;

  return {
    id: i + 1,
    lead_id: Math.floor(Math.random() * 300) + 1,
    imovel_id: Math.floor(Math.random() * 200) + 1,
    corretor_id: Math.floor(Math.random() * 8) + 1,
    valor: Math.floor(Math.random() * (1800000 - 250000) + 250000),
    status,
    created_at: dataProposta.toISOString(),
    ultima_atualizacao: new Date(
      dataProposta.getTime() + diasTravada * 24 * 60 * 60 * 1000,
    ).toISOString(),
  };
});

// Vendas
const VENDAS_MOCK = Array.from({ length: 60 }, (_, i) => {
  const dataVenda = new Date(
    Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000,
  );
  const imovel = IMOVEIS_MOCK[Math.floor(Math.random() * IMOVEIS_MOCK.length)];
  const lead = LEADS_MOCK[Math.floor(Math.random() * LEADS_MOCK.length)];
  const proposta =
    PROPOSTAS_MOCK[Math.floor(Math.random() * PROPOSTAS_MOCK.length)];

  return {
    id: i + 1,
    imovel_id: imovel.id,
    corretor_id: Math.floor(Math.random() * 8) + 1,
    lead_id: lead.id,
    proposta_id: proposta.id,
    valor: imovel.preco,
    data_venda: dataVenda.toISOString(),
    comissao: imovel.preco * 0.06,
    bairro: imovel.bairro,
    tipo: imovel.tipo,
    canal: lead.canal,
    dias_fechamento: Math.floor(Math.random() * 60) + 15,
  };
});

const MOCK_DATA = {
  imoveis: IMOVEIS_MOCK,
  corretores: CORRETORES_MOCK,
  leads: LEADS_MOCK,
  visitas: VISITAS_MOCK,
  propostas: PROPOSTAS_MOCK,
  vendas: VENDAS_MOCK,
};

// ============================================
// ÍCONES REACT (HEROICONS)
// ============================================
const Icons = {
  // Gerais
  dashboard: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  building: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 21h18M5 21V7a2 2 0 012-2h10a2 2 0 012 2v14" />
      <path d="M9 7h1m-1 3h1m4-3h1m-1 3h1" />
    </svg>
  ),
  users: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  megaphone: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 10h18v4H3z" />
      <path d="M8 14v5a2 2 0 002 2h4a2 2 0 002-2v-5" />
      <path d="M16 8V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v3" />
    </svg>
  ),
  dollar: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 1v22M17 5H9.5C7.5 5 6 6.5 6 8.5s1.5 3.5 3.5 3.5h5c2 0 3.5 1.5 3.5 3.5S17 19 15 19H6" />
    </svg>
  ),
  filter: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="22 3 2 3 10 13 10 21 14 18 14 13 22 3" />
    </svg>
  ),

  // Alertas
  fire: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8.5 14.5A4.5 4.5 0 0113 10M13 2s-1.5 3-3 6c-1.5 3-2 6-2 9a5 5 0 1010 0c0-3-1-6-3-9-1-2-2-4-2-6z" />
    </svg>
  ),
  zap: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  list: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
  sparkles: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2l2.5 6.5L21 9l-5 4.5L17 21l-5-3.5L7 21l1-7.5L3 9l6.5-.5L12 2z" />
    </svg>
  ),

  // Alertas e utilitários
  alertCircle: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" />
    </svg>
  ),
  alertTriangle: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 9v4M12 17h.01" />
      <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
    </svg>
  ),
  clock: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  trendingUp: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 20L8.4 13.6C9.2 12.8 10.5 12.8 11.3 13.6L13.8 16.1C14.6 16.9 15.9 16.9 16.7 16.1L22 10.8" />
      <path d="M17 8H22V13" />
    </svg>
  ),
  trendingDown: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 4L8.4 10.4C9.2 11.2 10.5 11.2 11.3 10.4L13.8 7.9C14.6 7.1 15.9 7.1 16.7 7.9L22 13.2" />
      <path d="M17 14H22V9" />
    </svg>
  ),

  // Ícones de oportunidade
  chartBar: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 21H4V4" />
      <path d="M7 15v4" />
      <path d="M11 9v10" />
      <path d="M15 12v7" />
      <path d="M19 5v14" />
    </svg>
  ),
  star: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),

  // Ícones operacionais
  user: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  home: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9.5L12 3l9 6.5V20a2 2 0 01-2 2H5a2 2 0 01-2-2V9.5z" />
      <path d="M9 22v-6h6v6" />
    </svg>
  ),
  document: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
      <path d="M14 2v6h6" />
    </svg>
  ),
  usersGroup: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 00-3-3.87" />
      <path d="M16 3.13a4 4 0 010 7.75" />
    </svg>
  ),
  arrowRight: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
};

// ============================================
// COMPONENTE DE ALERTA CARD
// ============================================
const AlertaCard = ({ alerta, tipo, onAcao }) => {
  const config = {
    critico: {
      bg: "bg-white dark:bg-gray-900 border-l-4 border-red-500",
      icon: Icons.fire,
      iconColor: "text-red-500",
      titulo: "text-base font-bold text-gray-900 dark:text-white",
      botao: "bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow",
      badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      tooltip: "Impacto financeiro direto - agir imediatamente",
    },
    atencao: {
      bg: "bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-800",
      icon: Icons.zap,
      iconColor: "text-amber-500",
      titulo: "text-sm font-semibold text-gray-900 dark:text-white",
      badge:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      tooltip: "Monitorar - impacto moderado",
    },
  };

  const estilo = config[tipo] || config.atencao;
  const Icon = estilo.icon;

  const getImpactoTooltip = (impacto) => {
    switch (impacto) {
      case "alto":
        return "⚠️ Perda financeira significativa - agir hoje";
      case "médio":
        return "⚡ Oportunidade ou risco moderado";
      default:
        return "ℹ️ Apenas informativo";
    }
  };

  const getImpactoIcon = (impacto) => {
    switch (impacto) {
      case "alto":
        return "🔴";
      case "médio":
        return "🟠";
      default:
        return "🟢";
    }
  };

  return (
    <div
      className={`${estilo.bg} rounded-lg shadow-sm p-5 hover:shadow-md transition-all duration-200 group`}
      title={estilo.tooltip}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`w-6 h-6 ${estilo.iconColor}`} />
            <h3 className={estilo.titulo}>{alerta.titulo}</h3>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {alerta.mensagem}
          </p>

          <div className="flex items-center gap-3">
            <div
              className={`text-xs px-2 py-1 rounded-full ${estilo.badge} flex items-center gap-1 cursor-help`}
              title={getImpactoTooltip(alerta.impacto)}
            >
              <span>{getImpactoIcon(alerta.impacto)}</span>
              <span>{alerta.impacto}</span>
            </div>

            {tipo === "critico" && (
              <div
                className="text-xs text-gray-500 dark:text-gray-500 flex items-center gap-1"
                title="Prazo recomendado para ação"
              >
                <Icons.clock className="w-3 h-3" />
                <span>Hoje</span>
              </div>
            )}
          </div>
        </div>

        {tipo === "critico" && (
          <button
            onClick={onAcao}
            className="text-xs px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shadow-sm hover:shadow flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white"
            title="Resolver este alerta agora"
          >
            Resolver agora
            <Icons.arrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE DE ITEM OPERACIONAL
// ============================================
const ItemOperacional = ({ alerta, onDetalhes }) => {
  const getIcon = (titulo) => {
    if (titulo.includes("Leads")) return Icons.user;
    if (titulo.includes("Visitas")) return Icons.home;
    if (titulo.includes("Propostas")) return Icons.document;
    if (titulo.includes("Corretores")) return Icons.usersGroup;
    return Icons.alertCircle;
  };

  const getImpactoTooltip = (impacto) => {
    switch (impacto) {
      case "alto":
        return "🔴 Impacto alto - prioridade máxima";
      case "médio":
        return "🟠 Impacto médio - resolver esta semana";
      default:
        return "🟢 Impacto baixo - monitorar";
    }
  };

  const getDetalhesPath = (alerta) => {
    if (alerta.titulo.includes("Leads"))
      return "/admin/corretores?filtro=leads-pendentes";
    if (alerta.titulo.includes("Propostas"))
      return "/admin/corretores?filtro=propostas-travadas";
    if (alerta.titulo.includes("Visitas"))
      return "/admin/corretores?filtro=visitas-hoje";
    if (alerta.titulo.includes("Imóveis"))
      return "/admin/estoque?filtro=dom>90";
    return "#";
  };

  const Icon = getIcon(alerta.titulo);

  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-lg">
      <div className="flex items-center gap-3 flex-1">
        <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {alerta.titulo}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {alerta.mensagem}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 cursor-help ${
            alerta.impacto === "alto"
              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          }`}
          title={getImpactoTooltip(alerta.impacto)}
        >
          <span>{alerta.impacto === "alto" ? "🔴" : "🟠"}</span>
          <span>{alerta.impacto}</span>
        </div>

        <button
          onClick={() => onDetalhes?.(getDetalhesPath(alerta))}
          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
          title="Ver detalhes e tomar ação"
        >
          Ver detalhes
          <Icons.arrowRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const Dashboard = () => {
  const { isDark } = useTheme();

  const [abaAtiva, setAbaAtiva] = useState("visao-geral");
  const [data] = useState(MOCK_DATA);
  const [filtros, setFiltros] = useState({
    bairro: "todos",
    tipo: "todos",
    status: "todos",
    dom: "todos",
    faixaPreco: "todos",
  });
  const [ordemEstoque, setOrdemEstoque] = useState({
    campo: "diasNoSite",
    direcao: "desc",
  });

  const [indicadores, setIndicadores] = useState({
    receitaMes: 0,
    receitaAcumulada: 0,
    imoveisAtivos: 0,
    vendasMes: 0,
    ticketMedio: 0,
    tempoMedioVenda: 0,
    domMedio: 0,
    conversaoGeral: 0,
    conversaoSite: 0,
    alertasEstrategicos: [],
    alertasOperacionais: [],
    valorTotalEstoque: 0,
    capitalParado90d: 0,
    percentualEstoque90d: 0,
    giroDias: 0,
    ciclosPorAno: 0,
    ticketMedioEstoque: 0,
    metaMensal: 2500000,
    realizadoPercentual: 0,
    comissaoProjetada: 0,
    capitalImobilizado: 0,
    diasParaMeta: 0,
    riscoFinanceiro: "baixo",
    rankingCorretores: [],
    mediaConversaoCorretores: 0,
    totalLeadsMes: 0,
    totalLeadsAtivos: 0,
    corretorDestaque: null,
    leadsPorCanal: [],
    melhorCanal: null,
    piorCanal: null,
  });

  const [loading, setLoading] = useState(true);
  const [dataAtualizacao, setDataAtualizacao] = useState(new Date());

  const formatarMoeda = (valor) => {
    if (!valor || isNaN(valor) || typeof valor !== "number") {
      return "R$ 0";
    }
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
    }).format(valor);
  };

  const formatarTempoResposta = (minutos) => {
    if (!minutos || minutos < 1) return "-";

    if (minutos < 60) {
      return `${minutos}min`; // Ex: 5min, 30min
    } else {
      const horas = Math.floor(minutos / 60);
      const minsRestantes = minutos % 60;

      if (minsRestantes === 0) {
        return `${horas}h`; // Ex: 2h, 3h
      } else {
        return `${horas}h ${minsRestantes}min`; // Ex: 1h 15min, 2h 30min
      }
    }
  };

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const imoveis = MOCK_DATA.imoveis || [];
      const vendas = MOCK_DATA.vendas || [];
      const leads = MOCK_DATA.leads || [];
      const visitas = MOCK_DATA.visitas || [];
      const propostas = MOCK_DATA.propostas || [];
      const corretores = MOCK_DATA.corretores || [];

      const hoje = new Date();
      const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      const inicioAno = new Date(hoje.getFullYear(), 0, 1);

      // ===== DADOS BÁSICOS =====
      const imoveisDisponiveis = imoveis.filter(
        (i) => i.status === "disponivel",
      );
      const valorTotalEstoque = imoveisDisponiveis.reduce(
        (acc, i) => acc + i.preco,
        0,
      );

      const vendasMes = vendas.filter(
        (v) => new Date(v.data_venda) >= inicioMes,
      );
      const receitaMes = vendasMes.reduce((acc, v) => acc + v.valor, 0);

      const vendasAno = vendas.filter(
        (v) => new Date(v.data_venda) >= inicioAno,
      );
      const receitaAcumulada = vendasAno.reduce((acc, v) => acc + v.valor, 0);

      const ticketMedio =
        vendasMes.length > 0 ? receitaMes / vendasMes.length : 0;

      const domMedio =
        imoveisDisponiveis.length > 0
          ? imoveisDisponiveis.reduce((acc, i) => acc + i.diasNoSite, 0) /
            imoveisDisponiveis.length
          : 0;

      const imoveisAcima90d = imoveisDisponiveis.filter(
        (i) => i.diasNoSite > 90,
      );
      const valorEstoque90d = imoveisAcima90d.reduce(
        (acc, i) => acc + i.preco,
        0,
      );
      const percentualEstoque90d =
        valorTotalEstoque > 0 ? (valorEstoque90d / valorTotalEstoque) * 100 : 0;

      const ticketMedioEstoque =
        imoveisDisponiveis.length > 0
          ? valorTotalEstoque / imoveisDisponiveis.length
          : 0;

      const giroDias = domMedio;
      const ciclosPorAno = giroDias > 0 ? 365 / giroDias : 0;

      // ===== ALERTAS ESTRATÉGICOS =====
      const alertasEstrategicos = [];

      if (valorEstoque90d > 0) {
        alertasEstrategicos.push({
          titulo: "Capital parado em estoque",
          mensagem: `${formatarMoeda(valorEstoque90d)} em imóveis com mais de 90 dias (${percentualEstoque90d.toFixed(1)}% do total)`,
          impacto: percentualEstoque90d > 30 ? "alto" : "médio",
          acao: "Criar campanha de liquidação",
          tipo: "capital",
          origem:
            "Estoque parado por mais de 90 dias impacta diretamente o fluxo de caixa",
        });
      }

      if (domMedio > 75) {
        alertasEstrategicos.push({
          titulo: "Giro de estoque lento",
          mensagem: `DOM médio de ${domMedio.toFixed(0)} dias - 40% acima do ideal`,
          impacto: "alto",
          acao: "Revisar estratégia de precificação",
          tipo: "giro",
          origem:
            "Imóveis demoram mais de 75 dias para vender - 40% acima da média do mercado",
        });
      }

      const conversaoGeral =
        leads.length > 0 ? (vendas.length / leads.length) * 100 : 0;
      if (conversaoGeral < 2) {
        alertasEstrategicos.push({
          titulo: "Conversão em nível crítico",
          mensagem: `Apenas ${conversaoGeral.toFixed(1)}% dos leads viram vendas (meta: 4%)`,
          impacto: "alto",
          acao: "Revisar processo comercial urgente",
          tipo: "conversao",
          origem:
            "Menos de 2% dos leads estão virando venda - perda de oportunidades",
        });
      } else if (conversaoGeral < 3.5) {
        alertasEstrategicos.push({
          titulo: "Conversão abaixo da meta",
          mensagem: `${conversaoGeral.toFixed(1)}% de conversão (meta: 4%)`,
          impacto: "médio",
          acao: "Analisar gargalos no funil",
          tipo: "conversao",
          origem: "Conversão 15% abaixo da meta estabelecida",
        });
      }

      const metaMensal = 2500000;
      const realizadoPercentual = (receitaMes / metaMensal) * 100;
      if (hoje.getDate() > 15 && realizadoPercentual < 70) {
        alertasEstrategicos.push({
          titulo: "Meta mensal em risco",
          mensagem: `${realizadoPercentual.toFixed(0)}% da meta atingida no meio do mês`,
          impacto: "alto",
          acao: "Intensificar follow-up com leads quentes",
          tipo: "meta",
          origem: "Ritmo atual insuficiente para bater a meta até o fim do mês",
        });
      }

      const leadsSite = leads.filter(
        (l) => l.canal === "Site" && new Date(l.created_at) >= inicioMes,
      ).length;
      const vendasSite = vendasMes.filter((v) => v.canal === "Site").length;
      if (leadsSite > 50 && vendasSite < 3) {
        alertasEstrategicos.push({
          titulo: "Marketing com baixo ROI",
          mensagem: `${leadsSite} leads do site geraram apenas ${vendasSite} vendas`,
          impacto: "médio",
          acao: "Avaliar qualidade do tráfego",
          tipo: "marketing",
          origem: "Custo de aquisição elevado para poucas vendas",
        });
      }

      // ===== ALERTAS OPERACIONAIS =====
      const alertasOperacionais = [];

      const leadsAguardando = leads.filter((l) => {
        const dataLead = new Date(l.created_at);
        const diffHoras = (hoje - dataLead) / (1000 * 60 * 60);
        return l.status === "novo" && diffHoras > 24;
      }).length;

      if (leadsAguardando > 0) {
        alertasOperacionais.push({
          titulo: "Leads aguardando contato",
          mensagem: `${leadsAguardando} leads aguardando contato há mais de 24h`,
          impacto: leadsAguardando > 10 ? "alto" : "médio",
          acao: "Distribuir para corretores",
          origem: "Leads frios após 24h perdem 80% de chance de conversão",
        });
      }

      const leadsSemAcao = leads.filter((l) => {
        const dataLead = new Date(l.created_at);
        const diffDias = (hoje - dataLead) / (1000 * 60 * 60 * 24);
        return l.status === "contatado" && diffDias > 7 && !l.qualificado;
      }).length;

      if (leadsSemAcao > 0) {
        alertasOperacionais.push({
          titulo: "Leads sem evolução",
          mensagem: `${leadsSemAcao} leads parados no status "contatado" há mais de 7 dias`,
          impacto: leadsSemAcao > 15 ? "alto" : "médio",
          acao: "Realizar follow-up",
          origem: "Leads parados por mais de 7 dias raramente progridem",
        });
      }

      const propostasTravadas = propostas.filter((p) => {
        const dataProposta = new Date(p.created_at);
        const diffDias = (hoje - dataProposta) / (1000 * 60 * 60 * 24);
        return p.status === "negociacao" && diffDias > 10;
      }).length;

      if (propostasTravadas > 0) {
        alertasOperacionais.push({
          titulo: "Propostas travadas",
          mensagem: `${propostasTravadas} propostas em negociação há mais de 10 dias`,
          impacto: propostasTravadas > 5 ? "alto" : "médio",
          acao: "Intervir para acelerar decisão",
          origem:
            "Propostas paradas por mais de 10 dias têm 70% de chance de serem perdidas",
        });
      }

      const visitasNaoRealizadas = visitas.filter((v) => {
        return v.status === "agendada" && new Date(v.data_visita) < hoje;
      }).length;

      if (visitasNaoRealizadas > 0) {
        alertasOperacionais.push({
          titulo: "Visitas não realizadas",
          mensagem: `${visitasNaoRealizadas} visitas agendadas não foram realizadas`,
          impacto: visitasNaoRealizadas > 8 ? "alto" : "médio",
          acao: "Remarcar com clientes",
          origem: "Falha de agendamento ou desistência sem aviso",
        });
      }

      const corretoresZeroVendas = corretores
        .filter((c) => {
          const leadsCorretor = leads.filter(
            (l) =>
              l.corretor_id === c.id && new Date(l.created_at) >= inicioMes,
          ).length;
          const vendasCorretor = vendasMes.filter(
            (v) => v.corretor_id === c.id,
          ).length;
          return leadsCorretor > 5 && vendasCorretor === 0;
        })
        .map((c) => c.nome);

      if (corretoresZeroVendas.length > 0) {
        alertasOperacionais.push({
          titulo: "Corretores sem vendas",
          mensagem: `${corretoresZeroVendas.length} corretores com leads mas 0 vendas no mês`,
          impacto: corretoresZeroVendas.length > 2 ? "alto" : "médio",
          acao: "Acompanhar funil individual",
          origem:
            "Corretores com leads mas sem vendas indicam gargalo na abordagem",
        });
      }

      // ===== RANKING CORRETORES =====
      const rankingCorretores = corretores
        .filter((c) => c.ativo)
        .map((c) => {
          const vendasCorretor = vendas.filter(
            (v) =>
              v.corretor_id === c.id && new Date(v.data_venda) >= inicioMes,
          );
          const receita = vendasCorretor.reduce((acc, v) => acc + v.valor, 0);
          const leadsCorretor = leads.filter(
            (l) =>
              l.corretor_id === c.id && new Date(l.created_at) >= inicioMes,
          );
          const leadsAtivos = leads.filter(
            (l) =>
              l.corretor_id === c.id &&
              ["novo", "contatado", "qualificado", "negociacao"].includes(
                l.status,
              ),
          ).length;

          const tempoResposta = Math.floor(Math.random() * 180) + 30;
          const conversao =
            leadsCorretor.length > 0
              ? (vendasCorretor.length / leadsCorretor.length) * 100
              : 0;

          return {
            id: c.id,
            nome: c.nome,
            vendas: vendasCorretor.length,
            meta: c.meta,
            receita,
            leads: leadsCorretor.length,
            leadsAtivos,
            conversao,
            tempoResposta: Math.floor(tempoResposta / 60),
            percentualMeta: c.meta > 0 ? (receita / c.meta) * 100 : 0,
            alerta:
              leadsCorretor.length > 10 && vendasCorretor.length === 0
                ? true
                : false,
          };
        })
        .sort((a, b) => b.receita - a.receita);

      const mediaConversaoCorretores =
        rankingCorretores.length > 0
          ? rankingCorretores.reduce((acc, c) => acc + c.conversao, 0) /
            rankingCorretores.length
          : 0;

      const totalLeadsMes = rankingCorretores.reduce(
        (acc, c) => acc + c.leads,
        0,
      );
      const totalLeadsAtivos = rankingCorretores.reduce(
        (acc, c) => acc + c.leadsAtivos,
        0,
      );
      const corretorDestaque = rankingCorretores[0];

      // ===== MARKETING =====
      const leadsPorCanal = CANAIS.map((canal) => {
        const leadsCanal = leads.filter(
          (l) => l.canal === canal && new Date(l.created_at) >= inicioMes,
        );
        const leadsCount = leadsCanal.length;

        const vendasCanal = vendasMes.filter((v) => v.canal === canal);
        const vendasCount = vendasCanal.length;
        const receitaCanal = vendasCanal.reduce((acc, v) => acc + v.valor, 0);

        const conversao = leadsCount > 0 ? (vendasCount / leadsCount) * 100 : 0;

        return {
          canal,
          leads: leadsCount,
          vendas: vendasCount,
          receita: receitaCanal,
          conversao,
        };
      });

      const eficienciaCanais = [...leadsPorCanal].sort(
        (a, b) => b.conversao - a.conversao,
      );
      const melhorCanal = eficienciaCanais[0];
      const piorCanal = eficienciaCanais[eficienciaCanais.length - 1];

      // ===== FINANCEIRO =====
      const comissaoProjetada = receitaMes * 0.06;
      const capitalImobilizado = valorEstoque90d;

      const mediaDiaria = receitaMes / hoje.getDate();
      const diasParaMeta =
        mediaDiaria > 0 ? (metaMensal - receitaMes) / mediaDiaria : 0;

      const riscoFinanceiro =
        diasParaMeta > 20 ? "alto" : diasParaMeta > 10 ? "médio" : "baixo";

      setIndicadores({
        receitaMes,
        receitaAcumulada,
        imoveisAtivos: imoveisDisponiveis.length,
        vendasMes: vendasMes.length,
        ticketMedio,
        tempoMedioVenda: 45,
        domMedio,
        conversaoGeral,
        conversaoSite:
          leadsPorCanal.find((c) => c.canal === "Site")?.conversao || 0,
        alertasEstrategicos,
        alertasOperacionais,
        valorTotalEstoque,
        capitalParado90d: valorEstoque90d,
        percentualEstoque90d,
        giroDias,
        ciclosPorAno,
        ticketMedioEstoque,
        metaMensal,
        realizadoPercentual,
        comissaoProjetada,
        capitalImobilizado: valorEstoque90d,
        diasParaMeta,
        riscoFinanceiro,
        rankingCorretores,
        mediaConversaoCorretores,
        totalLeadsMes,
        totalLeadsAtivos,
        corretorDestaque,
        leadsPorCanal,
        melhorCanal,
        piorCanal,
      });

      setDataAtualizacao(new Date());
      setLoading(false);
    }, 500);
  }, []);

  // ===== ORDENAÇÃO =====
  const ordenarImoveis = (imoveis) => {
    return [...imoveis].sort((a, b) => {
      if (ordemEstoque.direcao === "asc") {
        return a[ordemEstoque.campo] - b[ordemEstoque.campo];
      } else {
        return b[ordemEstoque.campo] - a[ordemEstoque.campo];
      }
    });
  };

  // ===== FILTROS =====
  const imoveisFiltrados = ordenarImoveis(
    data.imoveis.filter((imovel) => {
      if (filtros.bairro !== "todos" && imovel.bairro !== filtros.bairro)
        return false;
      if (filtros.tipo !== "todos" && imovel.tipo !== filtros.tipo)
        return false;
      if (filtros.status !== "todos" && imovel.status !== filtros.status)
        return false;

      if (filtros.dom === "ate30" && imovel.diasNoSite > 30) return false;
      if (
        filtros.dom === "30a60" &&
        (imovel.diasNoSite < 30 || imovel.diasNoSite > 60)
      )
        return false;
      if (
        filtros.dom === "60a90" &&
        (imovel.diasNoSite < 60 || imovel.diasNoSite > 90)
      )
        return false;
      if (filtros.dom === "acima90" && imovel.diasNoSite <= 90) return false;

      if (filtros.faixaPreco === "ate500k" && imovel.preco > 500000)
        return false;
      if (
        filtros.faixaPreco === "500k-1mi" &&
        (imovel.preco < 500000 || imovel.preco > 1000000)
      )
        return false;
      if (
        filtros.faixaPreco === "1mi-2mi" &&
        (imovel.preco < 1000000 || imovel.preco > 2000000)
      )
        return false;
      if (filtros.faixaPreco === "acima2mi" && imovel.preco < 2000000)
        return false;

      return true;
    }),
  );

  // ========== ABA VISÃO GERAL ==========
  const AbaVisaoGeral = () => {
    const alertasCriticos = indicadores.alertasEstrategicos.filter(
      (a) => a.impacto === "alto",
    );
    const alertasMedios = indicadores.alertasEstrategicos.filter(
      (a) => a.impacto === "médio",
    );
    const alertasOperacionais = indicadores.alertasOperacionais;

    const handleResolverAlerta = (alerta) => {
      console.log("Resolver:", alerta);
      if (alerta.tipo === "capital" || alerta.tipo === "giro") {
        setAbaAtiva("estoque");
      } else if (alerta.tipo === "conversao" || alerta.tipo === "meta") {
        setAbaAtiva("corretores");
      } else if (alerta.tipo === "marketing") {
        setAbaAtiva("marketing");
      }
    };

    const handleVerDetalhes = (path) => {
      console.log("Navegar para:", path);
      if (path.includes("estoque")) {
        setAbaAtiva("estoque");
      } else {
        setAbaAtiva("corretores");
      }
    };

    return (
      <div className="space-y-8">
        {/* KPIs principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.dollar className="w-5 h-5 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Receita do Mês
              </p>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {formatarMoeda(indicadores.receitaMes)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Acumulado: {formatarMoeda(indicadores.receitaAcumulada)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.building className="w-5 h-5 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Imóveis Ativos
              </p>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {indicadores.imoveisAtivos}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {indicadores.percentualEstoque90d.toFixed(1)}% acima de 90 dias
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.trendingUp className="w-5 h-5 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Vendas no Mês
              </p>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {indicadores.vendasMes}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Ticket médio: {formatarMoeda(indicadores.ticketMedio)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.chartBar className="w-5 h-5 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Conversão Geral
              </p>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {indicadores.conversaoGeral.toFixed(1)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Site: {indicadores.conversaoSite.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* AÇÕES PRIORITÁRIAS */}
        {alertasCriticos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icons.fire className="w-5 h-5 text-red-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Ações Prioritárias
              </h2>
              <span
                className="text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full cursor-help"
                title="Alertas com impacto financeiro direto que exigem ação imediata"
              >
                Impacto financeiro direto
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {alertasCriticos.map((alerta, idx) => (
                <AlertaCard
                  key={idx}
                  alerta={alerta}
                  tipo="critico"
                  onAcao={() => handleResolverAlerta(alerta)}
                />
              ))}
            </div>
          </div>
        )}

        {/* PONTOS DE ATENÇÃO */}
        {alertasMedios.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icons.zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Pontos de Atenção
              </h2>
              <span
                className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full cursor-help"
                title="Alertas que requerem monitoramento, sem perda financeira imediata"
              >
                Monitorar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alertasMedios.map((alerta, idx) => (
                <AlertaCard key={idx} alerta={alerta} tipo="atencao" />
              ))}
            </div>
          </div>
        )}

        {/* OPERACIONAL DO DIA */}
        {alertasOperacionais.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icons.list className="w-5 h-5 text-blue-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Operacional do Dia
              </h2>
              <span
                className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full cursor-help"
                title="Tarefas operacionais que impactam o funil de vendas"
              >
                {alertasOperacionais.length} pendências
              </span>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg divide-y divide-gray-100 dark:divide-gray-800">
              {alertasOperacionais.map((alerta, idx) => (
                <ItemOperacional
                  key={idx}
                  alerta={alerta}
                  onDetalhes={handleVerDetalhes}
                />
              ))}
            </div>
          </div>
        )}

        {/* OPORTUNIDADES */}
        {(indicadores.melhorCanal || indicadores.corretorDestaque) && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Icons.sparkles className="w-5 h-5 text-green-500" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                Oportunidades
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {indicadores.melhorCanal && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-4">
                    <Icons.chartBar className="w-10 h-10 text-green-600 dark:text-green-400" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        Canal com maior conversão
                        <span
                          className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full cursor-help"
                          title="Este canal tem o melhor ROI - considere aumentar investimento"
                        >
                          +{indicadores.melhorCanal.conversao.toFixed(1)}%
                        </span>
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-bold">
                          {indicadores.melhorCanal.canal}
                        </span>{" "}
                        converte {indicadores.melhorCanal.conversao.toFixed(1)}%
                        {indicadores.piorCanal &&
                          ` vs ${indicadores.piorCanal.canal} (${indicadores.piorCanal.conversao.toFixed(1)}%)`}
                      </p>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 flex items-center gap-1">
                        <Icons.trendingUp className="w-3 h-3" />
                        Aumentar investimento em 30%
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {indicadores.corretorDestaque && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5 hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-4">
                    <Icons.star className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                        Corretor destaque do mês
                        <span
                          className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full cursor-help"
                          title="Maior volume de vendas do mês - referência para o time"
                        >
                          🏆 Top 1
                        </span>
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <span className="font-bold">
                          {indicadores.corretorDestaque.nome}
                        </span>
                        : {indicadores.corretorDestaque.vendas} vendas,{" "}
                        {formatarMoeda(indicadores.corretorDestaque.receita)}
                      </p>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Icons.users className="w-3 h-3" />
                        Compartilhar boas práticas com o time
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Métricas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.clock className="w-4 h-4 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                DOM Médio
              </p>
            </div>
            <p
              className={`text-2xl font-semibold ${indicadores.domMedio > 75 ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-white"}`}
            >
              {indicadores.domMedio.toFixed(0)} dias
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
              <Icons.trendingUp className="w-3 h-3" />
              Giro: {indicadores.ciclosPorAno.toFixed(1)}x ao ano
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.trendingUp className="w-4 h-4 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Meta vs Realizado
              </p>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {indicadores.realizadoPercentual.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Meta: {formatarMoeda(indicadores.metaMensal)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.clock className="w-4 h-4 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Tempo Médio Venda
              </p>
            </div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {indicadores.tempoMedioVenda} dias
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Lead → Venda
            </p>
          </div>
        </div>
      </div>
    );
  };

  // ========== ABA ESTOQUE ==========
  const AbaEstoque = () => {
    const domMedioGlobal = indicadores.domMedio;

    return (
      <div className="space-y-8">
        {/* Indicadores rápidos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.dollar className="w-5 h-5 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Valor Total Estoque
              </p>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {formatarMoeda(indicadores.valorTotalEstoque)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.alertCircle className="w-5 h-5 text-red-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Capital Parado (+90d)
              </p>
            </div>
            <p className="text-3xl font-semibold text-red-600 dark:text-red-400">
              {formatarMoeda(indicadores.capitalParado90d)}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {indicadores.percentualEstoque90d.toFixed(1)}% do total
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.chartBar className="w-5 h-5 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Ticket Médio
              </p>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {formatarMoeda(indicadores.ticketMedioEstoque)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-2">
              <Icons.trendingUp className="w-5 h-5 text-gray-500" />
              <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Giro Médio
              </p>
            </div>
            <p className="text-3xl font-semibold text-gray-900 dark:text-white">
              {indicadores.ciclosPorAno.toFixed(1)}x
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              a cada {indicadores.giroDias.toFixed(0)} dias
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <Icons.filter className="w-4 h-4 text-gray-500" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Filtros
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <select
              value={filtros.bairro}
              onChange={(e) =>
                setFiltros({ ...filtros, bairro: e.target.value })
              }
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2"
            >
              <option value="todos">Todos os bairros</option>
              {BAIRROS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2"
            >
              <option value="todos">Todos os tipos</option>
              {TIPOS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <select
              value={filtros.status}
              onChange={(e) =>
                setFiltros({ ...filtros, status: e.target.value })
              }
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2"
            >
              <option value="todos">Todos os status</option>
              <option value="disponivel">Disponível</option>
              <option value="Vendido">Vendido</option>
            </select>

            <select
              value={filtros.dom}
              onChange={(e) => setFiltros({ ...filtros, dom: e.target.value })}
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2"
            >
              <option value="todos">Todos os prazos</option>
              <option value="ate30">Até 30 dias</option>
              <option value="30a60">30 a 60 dias</option>
              <option value="60a90">60 a 90 dias</option>
              <option value="acima90">Acima de 90 dias</option>
            </select>

            <select
              value={filtros.faixaPreco}
              onChange={(e) =>
                setFiltros({ ...filtros, faixaPreco: e.target.value })
              }
              className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2"
            >
              <option value="todos">Todas as faixas</option>
              <option value="ate500k">Até R$ 500k</option>
              <option value="500k-1mi">R$ 500k - R$ 1mi</option>
              <option value="1mi-2mi">R$ 1mi - R$ 2mi</option>
              <option value="acima2mi">Acima de R$ 2mi</option>
            </select>
          </div>
        </div>

        {/* Tabela de Estoque */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Estoque Detalhado
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setOrdemEstoque({
                    campo: "diasNoSite",
                    direcao:
                      ordemEstoque.campo === "diasNoSite" &&
                      ordemEstoque.direcao === "desc"
                        ? "asc"
                        : "desc",
                  })
                }
                className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${ordemEstoque.campo === "diasNoSite" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : ""}`}
              >
                <Icons.clock className="w-3 h-3" />
                DOM{" "}
                {ordemEstoque.campo === "diasNoSite"
                  ? ordemEstoque.direcao === "desc"
                    ? "↓"
                    : "↑"
                  : ""}
              </button>
              <button
                onClick={() =>
                  setOrdemEstoque({
                    campo: "preco",
                    direcao:
                      ordemEstoque.campo === "preco" &&
                      ordemEstoque.direcao === "desc"
                        ? "asc"
                        : "desc",
                  })
                }
                className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${ordemEstoque.campo === "preco" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : ""}`}
              >
                <Icons.dollar className="w-3 h-3" />
                Preço{" "}
                {ordemEstoque.campo === "preco"
                  ? ordemEstoque.direcao === "desc"
                    ? "↓"
                    : "↑"
                  : ""}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                    Código
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                    Bairro
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                    Preço
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    DOM
                  </th>
                </tr>
              </thead>
              <tbody>
                {imoveisFiltrados.slice(0, 20).map((imovel, index) => {
                  const acimaMedia = imovel.diasNoSite > domMedioGlobal;
                  const riscoCor =
                    imovel.diasNoSite <= 45
                      ? "text-emerald-600 dark:text-emerald-400"
                      : imovel.diasNoSite <= 90
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400 font-medium";

                  return (
                    <tr
                      key={imovel.id}
                      className={`
                        ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/20"}
                        hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors
                      `}
                    >
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {imovel.codigo}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {imovel.tipo}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {imovel.bairro}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {formatarMoeda(imovel.preco)}
                      </td>
                      <td className="py-3 px-4 border-r border-gray-200 dark:border-gray-700">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            imovel.status === "disponivel"
                              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                          }`}
                        >
                          {imovel.status === "disponivel"
                            ? "Disponível"
                            : "Vendido"}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-sm ${riscoCor} flex items-center gap-1`}
                      >
                        <Icons.clock className="w-3 h-3" />
                        {imovel.diasNoSite} dias
                        {acimaMedia && (
                          <span
                            className="ml-1 text-xs text-amber-600 dark:text-amber-400"
                            title="Acima da média de DOM"
                          >
                            ↑
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Mostrando {Math.min(imoveisFiltrados.length, 20)} de{" "}
            {imoveisFiltrados.length} imóveis
          </p>
        </div>
      </div>
    );
  };

  // ========== ABA FINANCEIRO ==========
  const AbaFinanceiro = () => (
    <div className="space-y-8">
      {/* KPIs Financeiros */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icons.dollar className="w-5 h-5 text-emerald-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Receita Realizada
            </p>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {formatarMoeda(indicadores.receitaMes)}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
            <Icons.trendingUp className="w-3 h-3" />
            Mês atual
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icons.chartBar className="w-5 h-5 text-blue-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Receita Prevista
            </p>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {formatarMoeda(indicadores.metaMensal)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Meta do mês
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icons.alertCircle className="w-5 h-5 text-red-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Capital Imobilizado
            </p>
          </div>
          <p className="text-3xl font-semibold text-red-600 dark:text-red-400">
            {formatarMoeda(indicadores.capitalImobilizado)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Estoque +90 dias
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icons.trendingUp className="w-5 h-5 text-violet-500" />
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Comissão Projetada
            </p>
          </div>
          <p className="text-3xl font-semibold text-gray-900 dark:text-white">
            {formatarMoeda(indicadores.comissaoProjetada)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            6% sobre receita
          </p>
        </div>
      </div>

      {/* Indicador de risco financeiro */}
      <div
        className={`bg-white dark:bg-gray-900 border rounded-lg shadow-sm p-6 ${
          indicadores.riscoFinanceiro === "alto"
            ? "border-red-200 dark:border-red-900/30"
            : indicadores.riscoFinanceiro === "médio"
              ? "border-amber-200 dark:border-amber-900/30"
              : "border-green-200 dark:border-green-900/30"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Icons.alertTriangle
            className={`w-5 h-5 ${
              indicadores.riscoFinanceiro === "alto"
                ? "text-red-500"
                : indicadores.riscoFinanceiro === "médio"
                  ? "text-amber-500"
                  : "text-green-500"
            }`}
          />
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Risco Financeiro
          </p>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white">
              {indicadores.riscoFinanceiro === "alto"
                ? "Alto"
                : indicadores.riscoFinanceiro === "médio"
                  ? "Médio"
                  : "Baixo"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 flex items-center gap-1">
              <Icons.clock className="w-4 h-4" />
              {indicadores.diasParaMeta > 0
                ? `Se mantiver ritmo atual, meta será atingida em ${indicadores.diasParaMeta.toFixed(0)} dias`
                : "Meta já atingida"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {indicadores.realizadoPercentual.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              da meta realizada
            </p>
          </div>
        </div>
      </div>

      {/* Meta vs Realizado */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
          Progresso da Meta
        </h2>
        <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-4 bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(indicadores.realizadoPercentual, 100)}%`,
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Realizado: {formatarMoeda(indicadores.receitaMes)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Meta: {formatarMoeda(indicadores.metaMensal)}
          </p>
        </div>
      </div>
    </div>
  );

  // ========== ABA CORRETORES - COM TEMPO EM MINUTOS ==========
  const AbaCorretores = () => (
    <div className="space-y-8">
      {/* Ranking com indicadores individuais */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
        <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          Performance por Corretor
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th className="text-center py-3 px-4 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Corretor</div>
                </th>
                <th className="text-center py-3 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Vendas</div>
                </th>
                <th className="text-center py-3 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Meta (R$)</div>
                </th>
                <th className="text-center py-3 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Atingimento</div>
                </th>
                <th className="text-center py-3 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Receita</div>
                </th>
                <th className="text-center py-3 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Leads (Mês)</div>
                </th>
                <th className="text-center py-3 px-[5px] text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>
                    Em
                    <br />
                    Negociação
                  </div>
                </th>
                <th className="text-center py-3 px-[5px] text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Conversão</div>
                </th>
                <th className="text-center py-3 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 align-middle">
                  <div>
                    Tempo
                    <br />
                    Resposta
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {indicadores.rankingCorretores.map((corretor, index) => {
                // Simulando valores grandes para teste
                const metaTeste = corretor.id === 1 ? 100000000 : corretor.meta;
                const receitaTeste =
                  corretor.id === 1 ? 45000000 : corretor.receita;

                return (
                  <tr
                    key={corretor.id}
                    className={`
                    ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/20"}
                    ${corretor.alerta ? "bg-amber-50 dark:bg-amber-900/10" : ""}
                    hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors
                  `}
                  >
                    <td className="py-3 px-4 text-[13px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-1">
                        <span className="truncate max-w-[130px]">
                          {corretor.nome}
                        </span>
                        {corretor.alerta && (
                          <span
                            className="text-[10px] font-light text-amber-600 dark:text-amber-400 flex items-center gap-0.5 whitespace-nowrap"
                            title="Mais de 10 leads e nenhuma venda no mês"
                          >
                            <Icons.alertCircle className="w-2.5 h-2.5" />
                            <span>sem vendas</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-center">
                      {corretor.vendas}
                    </td>
                    <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-left whitespace-nowrap">
                      {formatarMoeda(metaTeste)}
                    </td>
                    <td className="py-3 px-2 text-[13px] border-r border-gray-200 dark:border-gray-700 text-center">
                      <span
                        className={`text-[12px] font-medium ${corretor.percentualMeta >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"}`}
                      >
                        {corretor.percentualMeta.toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-left whitespace-nowrap">
                      {formatarMoeda(receitaTeste)}
                    </td>
                    <td className="py-3 px-2 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-center whitespace-nowrap">
                      {corretor.leads}
                    </td>
                    <td className="py-3 px-[5px] text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-center">
                      {corretor.leadsAtivos}
                    </td>
                    <td className="py-3 px-[5px] text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-center">
                      {corretor.conversao.toFixed(1)}%
                    </td>
                    <td className="py-3 px-2 text-[13px] text-gray-700 dark:text-gray-300 flex items-center justify-center gap-1 text-center whitespace-nowrap">
                      <Icons.clock className="w-3 h-3" />
                      {formatarTempoResposta(corretor.tempoResposta)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Médias do time - mantido */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icons.trendingUp className="w-4 h-4 text-gray-500" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Conversão Média
            </p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {indicadores.mediaConversaoCorretores.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icons.user className="w-4 h-4 text-gray-500" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Total Leads do Mês
            </p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {indicadores.totalLeadsMes}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icons.users className="w-4 h-4 text-gray-500" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Em Negociação
            </p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {indicadores.totalLeadsAtivos}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icons.clock className="w-4 h-4 text-gray-500" />
            <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Tempo Resposta Médio
            </p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">
            {formatarTempoResposta(
              Math.floor(
                indicadores.rankingCorretores.reduce(
                  (acc, c) => acc + c.tempoResposta,
                  0,
                ) / indicadores.rankingCorretores.length,
              ),
            )}
          </p>
        </div>
      </div>
    </div>
  );
  // ========== ABA MARKETING ==========
  const AbaMarketing = () => {
    // Separar canais por categoria
    const canaisSite = indicadores.leadsPorCanal.filter((c) =>
      ["Site", "Portal"].includes(c.canal),
    );
    const canaisRedes = indicadores.leadsPorCanal.filter((c) =>
      ["Instagram", "Facebook"].includes(c.canal),
    );
    const canaisIndicacao = indicadores.leadsPorCanal.filter((c) =>
      ["Indicação"].includes(c.canal),
    );

    // Componente de tabela reutilizável com grid fixo e alinhamento à esquerda
    const TabelaCanais = ({
      titulo,
      icone: Icon,
      corIcone,
      canais,
      corDestaque,
    }) => {
      if (canais.length === 0) return null;

      return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Cabeçalho do box com ícone */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Icon className={`w-5 h-5 ${corIcone}`} />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {titulo}
            </h2>
          </div>

          {/* Cabeçalho das colunas - TODOS ALINHADOS À ESQUERDA */}
          <div className="grid grid-cols-12 gap-6 px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
            <div className="col-span-4 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 text-left">
              Canal
            </div>
            <div className="col-span-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 text-left">
              Leads
            </div>
            <div className="col-span-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 text-left">
              Vendas
            </div>
            <div className="col-span-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 text-left">
              Receita
            </div>
            <div className="col-span-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 text-left">
              Conversão
            </div>
          </div>

          {/* Linhas de dados - TODOS OS NÚMEROS ALINHADOS À ESQUERDA */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {canais.map((item, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 gap-6 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="col-span-4 text-sm font-medium text-gray-900 dark:text-white flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${corDestaque}`} />
                  {item.canal}
                </div>
                <div className="col-span-2 text-sm text-gray-700 dark:text-gray-300 text-left">
                  {item.leads}
                </div>
                <div className="col-span-2 text-sm text-gray-700 dark:text-gray-300 text-left">
                  {item.vendas}
                </div>
                <div className="col-span-2 text-sm font-medium text-gray-900 dark:text-white text-left">
                  {formatarMoeda(item.receita)}
                </div>
                <div className="col-span-2 text-sm text-green-600 dark:text-green-400 text-left">
                  {item.conversao.toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-8">
        {/* Tráfego */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icons.trendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              📊 Tráfego
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total de Leads
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white text-left">
                {indicadores.leadsPorCanal.reduce((acc, c) => acc + c.leads, 0)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Total de Vendas
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white text-left">
                {indicadores.leadsPorCanal.reduce(
                  (acc, c) => acc + c.vendas,
                  0,
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Conversão Média
              </p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white text-left">
                {(
                  (indicadores.leadsPorCanal.reduce(
                    (acc, c) => acc + c.vendas,
                    0,
                  ) /
                    indicadores.leadsPorCanal.reduce(
                      (acc, c) => acc + c.leads,
                      0,
                    )) *
                  100
                ).toFixed(1)}
                %
              </p>
            </div>
          </div>
        </div>

        {/* Box 1: Site e Portais */}
        <TabelaCanais
          titulo="🌐 Site e Portais"
          icone={Icons.home}
          corIcone="text-blue-500"
          canais={canaisSite}
          corDestaque="bg-blue-500"
        />

        {/* Box 2: Redes Sociais */}
        <TabelaCanais
          titulo="📱 Redes Sociais"
          icone={Icons.users}
          corIcone="text-indigo-500"
          canais={canaisRedes}
          corDestaque="bg-indigo-500"
        />

        {/* Box 3: Indicação */}
        <TabelaCanais
          titulo="🤝 Indicação"
          icone={Icons.star}
          corIcone="text-yellow-500"
          canais={canaisIndicacao}
          corDestaque="bg-yellow-500"
        />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Gestão Imobiliária
            </h1>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
              {dataAtualizacao.toLocaleDateString("pt-BR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}{" "}
              • Açailândia
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 text-xs font-medium uppercase tracking-wider transition-all rounded-md border border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 flex items-center gap-2"
          >
            <Icons.clock className="w-4 h-4" />
            Atualizar
          </button>
        </header>

        {/* ===== NAVEGAÇÃO ===== */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-1 overflow-x-auto">
            {[
              {
                id: "visao-geral",
                label: "Visão Geral",
                icon: Icons.dashboard,
              },
              { id: "estoque", label: "Estoque", icon: Icons.building },
              { id: "financeiro", label: "Financeiro", icon: Icons.dollar },
              { id: "corretores", label: "Corretores", icon: Icons.users },
              { id: "marketing", label: "Marketing", icon: Icons.megaphone },
            ].map((aba) => {
              const Icon = aba.icon;
              return (
                <button
                  key={aba.id}
                  onClick={() => setAbaAtiva(aba.id)}
                  className={`
                    flex items-center gap-3 px-6 py-3 text-sm font-medium whitespace-nowrap
                    border-b-2 transition-all
                    ${
                      abaAtiva === aba.id
                        ? "border-[#D4A24D] font-semibold text-gray-900 dark:text-white"
                        : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {aba.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ===== CONTEÚDO ===== */}
        <div className="mt-6 animate-fadeIn">
          {abaAtiva === "visao-geral" && <AbaVisaoGeral />}
          {abaAtiva === "estoque" && <AbaEstoque />}
          {abaAtiva === "financeiro" && <AbaFinanceiro />}
          {abaAtiva === "corretores" && <AbaCorretores />}
          {abaAtiva === "marketing" && <AbaMarketing />}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
