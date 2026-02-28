import React, { useState, useEffect } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
window.supabase = supabase;

// ============================================
// IMPORTAÇÕES DE ÍCONES
// ============================================
import {
  StarIcon as StarIconSolid,
  DocumentIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  FunnelIcon,
  PlusIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  HomeIcon,
  MapPinIcon,
  EnvelopeIcon,
  ChartBarIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";

// ============================================
// MOCK DATA (MANTIDO PARA FALLBACK)
// ============================================
const BAIRROS = [
  "Laranjeiras",
  "Colinas Park",
  "Jardim Glória",
  "Nova Açailândia",
];

const TIPOS = ["Apartamento", "Casa", "Sobrado", "Comercial"];
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
    suite: Math.random() > 0.5,
    garagem_coberta: Math.random() > 0.5,
    condominio_fechado: Math.random() > 0.7,
    financiavel: Math.random() > 0.3,
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

// Comissões
const COMISSOES_MOCK = VENDAS_MOCK.map((venda, index) => ({
  id: index + 1,
  venda_id: venda.id,
  corretor_id: venda.corretor_id,
  valor: venda.comissao,
  status: Math.random() > 0.6 ? "pago" : "a_pagar",
  data_vencimento: new Date(
    new Date(venda.data_venda).getTime() + 30 * 24 * 60 * 60 * 1000,
  ).toISOString(),
  created_at: venda.data_venda,
}));

const MOCK_DATA = {
  imoveis: IMOVEIS_MOCK,
  corretores: CORRETORES_MOCK,
  leads: LEADS_MOCK,
  visitas: VISITAS_MOCK,
  propostas: PROPOSTAS_MOCK,
  vendas: VENDAS_MOCK,
  comissoes: COMISSOES_MOCK,
};

// ============================================
// ÍCONES REACT (HEROICONS) - VERSÃO COMPLETA
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

  // Utilitários
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
  starSolid: (props) => <StarIconSolid {...props} />,
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
  arrowLeft: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  ),
  eye: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  target: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  lightbulb: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M9 18h6M10 21h4M9 15v3a3 3 0 006 0v-3" />
      <path d="M12 3a6 6 0 00-6 6c0 3 2 5 2 5h8s2-2 2-5a6 6 0 00-6-6z" />
    </svg>
  ),
  heart: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
  tag: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  ),
  wrench: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  ),
  paintBrush: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M18.37 2.63L14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 10-3-3z" />
      <path d="M9 13l-3 3" />
      <path d="M6 21l3-3" />
    </svg>
  ),
  checkCircle: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M8 12l2 2 4-4" />
    </svg>
  ),
  sun: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  shield: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 2L3 6v6c0 5.5 9 10 9 10s9-4.5 9-10V6l-9-4z" />
    </svg>
  ),
  store: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  bolt: (props) => (
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
  cube: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      <path d="M12 22V12" />
      <path d="M3.3 7L12 12l8.7-5" />
    </svg>
  ),
  beaker: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 3v3a2 2 0 01-2 2H4a2 2 0 01-2-2V3h18v3a2 2 0 01-2 2h-2a2 2 0 01-2-2V3" />
      <path d="M5 12l2 7" />
      <path d="M8 12l2 7" />
      <path d="M11 12l2 7" />
      <path d="M14 12l2 7" />
      <path d="M17 12l2 7" />
    </svg>
  ),
  plus: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  camera: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  trash: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0h10" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  upload: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  buildingOffice: (props) => (
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
  map: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 10.5V19a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h9.5" />
      <polyline points="16 2 22 8 16 8" />
      <line x1="10" y1="14" x2="21" y2="14" />
      <line x1="10" y1="18" x2="18" y2="18" />
      <line x1="3" y1="10" x2="8" y2="10" />
    </svg>
  ),
  // Ícones adicionais
  download: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  search: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  calendar: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  // Funil
  funnel: (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M4 4h16v2l-6 6v6l-4 2v-8L4 6V4z" />
    </svg>
  ),
};

// ============================================
// FUNÇÕES DE FORMATAÇÃO
// ============================================
const formatarMoeda = (valor) => {
  if (!valor || isNaN(valor) || typeof valor !== "number") {
    return "R$ 0,00";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(valor);
};

const formatarTempoResposta = (minutos) => {
  if (!minutos || minutos < 1) return "-";

  if (minutos < 60) {
    return `${minutos}min`;
  } else {
    const horas = Math.floor(minutos / 60);
    const minsRestantes = minutos % 60;

    if (minsRestantes === 0) {
      return `${horas}h`;
    } else {
      return `${horas}h ${minsRestantes}min`;
    }
  }
};

const formatarData = (data) => {
  if (!data) return "-";
  return new Date(data).toLocaleDateString("pt-BR");
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

  // ============================================
  // NOVO ESTADO PARA DADOS REAIS
  // ============================================
  const [dadosReais, setDadosReais] = useState({
    leadsSite: 0,
    qualificados: 0,
    visitasAgendadas: 0,
    visitasRealizadas: 0,
    propostasNegociacao: 0,
    vendas: 0,
    receitaMes: 0,
    comissoesAPagar: 0,
    comissoesPagas: 0,
    ticketMedio: 0,
    vendasLista: [],
    comissoesLista: [],
    corretores: [],
    medias: { leads: 0, vendas: 0 },
  });

  const [data, setData] = useState(MOCK_DATA);
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

  // ============================================
  // useEffect PARA BUSCAR DADOS REAIS (COMPLETO)
  // ============================================
  useEffect(() => {
    const buscarDadosReais = async () => {
      try {
        setLoading(true);

        console.log("🔍 BUSCANDO DADOS REAIS DO BANCO...");

        const hoje = new Date();
        const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        // ===== LEADS DO SITE =====
        const { data: leadsSite, error: errorLeads } = await supabase
          .from("leads")
          .select("*")
          .eq("origem", "site")
          .gte("created_at", inicioMes.toISOString())
          .lte("created_at", fimMes.toISOString());

        console.log(
          "📊 leadsSite DO BANCO:",
          leadsSite?.length || 0,
          "registros",
        );
        if (errorLeads) console.error("❌ Erro leads:", errorLeads);

        // ===== QUALIFICADOS =====
        const { data: qualificados, error: errorQualificados } = await supabase
          .from("leads")
          .select("*")
          .eq("status", "qualificado")
          .gte("created_at", inicioMes.toISOString())
          .lte("created_at", fimMes.toISOString());

        console.log("📊 qualificados DO BANCO:", qualificados?.length || 0);

        // ===== VISITAS =====
        const { data: visitas, error: errorVisitas } = await supabase
          .from("visitas")
          .select("*")
          .gte("created_at", inicioMes.toISOString())
          .lte("created_at", fimMes.toISOString());

        console.log("📊 visitas DO BANCO:", visitas?.length || 0);

        // AGENDAMENTO: TODAS as visitas que já foram agendadas (inclui confirmadas e realizadas)
        const visitasAgendadas =
          visitas?.filter(
            (v) =>
              v.status === "agendada" ||
              v.status === "confirmada" ||
              v.status === "realizada",
          ) || [];

        // VISITAS REALIZADAS: apenas as realizadas
        const visitasRealizadas =
          visitas?.filter((v) => v.status === "realizada") || [];

        console.log(
          "📊 visitas agendadas (total histórico):",
          visitasAgendadas.length,
        );
        console.log("📊 visitas realizadas:", visitasRealizadas.length);

        // ===== PROPOSTAS =====
        const { data: propostas, error: errorPropostas } = await supabase
          .from("propostas")
          .select("*")
          .gte("created_at", inicioMes.toISOString())
          .lte("created_at", fimMes.toISOString());

        console.log("📊 propostas DO BANCO:", propostas?.length || 0);
        console.log("📊 PERÍODO:", {
          inicio: inicioMes.toISOString(),
          fim: fimMes.toISOString(),
        });

        // 👇 FILTRO CORRIGIDO
        const propostasNegociacao =
          propostas?.filter((p) => p.status === "em_andamento") || [];
        const vendas = propostas?.filter((p) => p.status === "aprovada") || [];

        console.log("📊 TODAS PROPOSTAS:", propostas);
        console.log("📊 propostas em_andamento:", propostasNegociacao);
        console.log("📊 propostas aprovadas (vendas):", vendas);
        console.log("📊 QUANTIDADE VENDAS:", vendas.length);

        // ===== RECEITA DO MÊS =====
        const receitaMes =
          vendas?.reduce((acc, v) => acc + (v.valor || 0), 0) || 0;
        console.log("💰 receitaMes DO BANCO:", receitaMes);

        // ===== COMISSÕES =====
        const { data: comissoes, error: errorComissoes } = await supabase
          .from("comissoes")
          .select("*")
          .gte("created_at", inicioMes.toISOString())
          .lte("created_at", fimMes.toISOString());

        console.log("📊 comissoes DO BANCO:", comissoes?.length || 0);

        const comissoesAPagar =
          comissoes?.filter((c) => c.status === "a_pagar") || [];
        const comissoesPagas =
          comissoes?.filter((c) => c.status === "pago") || [];

        // ===== CORRETORES (SEM FILTRO) =====
        const { data: corretores, error: errorCorretores } = await supabase
          .from("corretores")
          .select("*");

        console.log("📊 corretores DO BANCO:", corretores?.length || 0);
        if (errorCorretores)
          console.error("❌ Erro corretores:", errorCorretores);

        // ===== MÉDIAS DOS ÚLTIMOS 3 MESES =====
        const tresMesesAtras = new Date(
          hoje.getFullYear(),
          hoje.getMonth() - 3,
          1,
        );

        const { data: leadsUltimos3Meses } = await supabase
          .from("leads")
          .select("count")
          .gte("created_at", tresMesesAtras.toISOString());

        const { data: vendasUltimos3Meses } = await supabase
          .from("propostas")
          .select("count")
          .eq("status", "aprovada")
          .gte("created_at", tresMesesAtras.toISOString());

        const medias = {
          leads: Math.round((leadsUltimos3Meses?.length || 0) / 3),
          vendas: Math.round((vendasUltimos3Meses?.length || 0) / 3),
        };

        // ===== ATUALIZAR ESTADO COM DADOS REAIS =====
        setDadosReais({
          leadsSite: leadsSite?.length || 0,
          qualificados: qualificados?.length || 0,
          visitasAgendadas: visitasAgendadas.length,
          visitasRealizadas: visitasRealizadas.length,
          propostasNegociacao: propostasNegociacao.length,
          vendas: vendas.length,
          receitaMes,
          comissoesAPagar: comissoesAPagar.reduce(
            (acc, c) => acc + (c.valor || 0),
            0,
          ),
          comissoesPagas: comissoesPagas.reduce(
            (acc, c) => acc + (c.valor || 0),
            0,
          ),
          ticketMedio: vendas.length > 0 ? receitaMes / vendas.length : 0,
          vendasLista: vendas || [],
          comissoesLista: comissoes || [],
          corretores: corretores || [],
          medias,
        });

        // ===== ATUALIZAR DATA (SEM MOCK PARA LEADS) =====
        setData({
          imoveis: MOCK_DATA.imoveis,
          corretores: corretores || [],
          leads: leadsSite || [], // SEM MOCK!
          visitas: visitas || [],
          propostas: propostas || [],
          vendas: vendas || [],
          comissoes: comissoes || [],
        });

        setDataAtualizacao(new Date());

        console.log(
          "✅ RESUMO FINAL - leadsSite no estado:",
          leadsSite?.length || 0,
        );
      } catch (error) {
        console.error("❌ Erro ao buscar dados reais:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarDadosReais();
  }, []);

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      const imoveis = data.imoveis || [];
      const vendas = data.vendas || [];
      const leads = data.leads || [];
      const visitas = data.visitas || [];
      const propostas = data.propostas || [];
      const corretores = data.corretores || [];

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

          const tempoRespostaMinutos = Math.floor(Math.random() * 180) + 5;

          const conversao =
            leadsCorretor.length > 0
              ? (vendasCorretor.length / leadsCorretor.length) * 100
              : 0;

          // Calcular comissões do corretor
          const comissaoGerada = vendasCorretor.reduce(
            (acc, v) => acc + (v.comissao || 0),
            0,
          );
          const comissaoPaga =
            data.comissoes
              ?.filter((c) => c.corretor_id === c.id && c.status === "pago")
              .reduce((acc, c) => acc + c.valor, 0) || 0;

          return {
            id: c.id,
            nome: c.nome,
            vendas: vendasCorretor.length,
            meta: c.meta,
            receita,
            leads: leadsCorretor.length,
            leadsAtivos,
            conversao,
            tempoResposta: tempoRespostaMinutos,
            percentualMeta: c.meta > 0 ? (receita / c.meta) * 100 : 0,
            alerta:
              leadsCorretor.length > 10 && vendasCorretor.length === 0
                ? true
                : false,
            comissaoGerada,
            comissaoPaga,
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
  }, [data]);

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

  // ===== FILTROS PARA TABELAS FINANCEIRAS =====
  const [filtroVendas, setFiltroVendas] = useState({
    dataInicio: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0],
    dataFim: new Date().toISOString().split("T")[0],
    corretor: "todos",
  });

  const [filtroComissoes, setFiltroComissoes] = useState({
    status: "todos",
    corretor: "todos",
  });

  const vendasFiltradas = dadosReais.vendasLista.filter((venda) => {
    // Proteção contra data inválida
    if (!venda.data_venda) return false;

    const dataVenda = new Date(venda.data_venda).toISOString().split("T")[0];
    if (dataVenda < filtroVendas.dataInicio || dataVenda > filtroVendas.dataFim)
      return false;
    if (
      filtroVendas.corretor !== "todos" &&
      venda.corretor_id !== parseInt(filtroVendas.corretor)
    )
      return false;
    return true;
  });

  const comissoesFiltradas = dadosReais.comissoesLista.filter((comissao) => {
    if (
      filtroComissoes.status !== "todos" &&
      comissao.status !== filtroComissoes.status
    )
      return false;
    if (
      filtroComissoes.corretor !== "todos" &&
      comissao.corretor_id !== parseInt(filtroComissoes.corretor)
    )
      return false;
    return true;
  });

  // ========== ABA VISÃO GERAL ==========
  const AbaVisaoGeral = () => {
    // 👇 ADICIONE ESTES LOGS AQUI, NO INÍCIO DA FUNÇÃO
    console.log("📊 ABA VISAO GERAL - dadosReais:", dadosReais);
    console.log("📊 ABA VISAO GERAL - vendas:", dadosReais?.vendas);
    console.log("📊 ABA VISAO GERAL - receita:", dadosReais?.receitaMes);

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
              <ChartBarIcon className="w-5 h-5 text-gray-500" />
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

        {/* ===== FUNIL DE VENDAS (6 ETAPAS) ===== */}
        <div className="bg-white dark:bg-gray-900/95 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Icons.chartBar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Funil de Vendas
            </h2>
          </div>

          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* DESENHO DO FUNIL */}
              <div className="flex-1 flex flex-col items-center space-y-1 mt-8">
                {/* Lead */}
                <div className="relative w-full max-w-[280px] group">
                  <div className="absolute inset-0 bg-blue-500 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-between px-4 text-white font-medium shadow-lg shadow-blue-500/30 border border-blue-400/50 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Lead
                    </span>
                    <span className="font-bold">{dadosReais.leadsSite}</span>
                  </div>
                </div>

                {/* Atendimento */}
                <div className="relative w-full max-w-[250px] group">
                  <div className="absolute inset-0 bg-green-500 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-between px-4 text-white font-medium shadow-lg shadow-green-500/30 border border-green-400/50 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Atendimento
                    </span>
                    <span className="font-bold">{dadosReais.qualificados}</span>
                  </div>
                </div>

                {/* Agendamento */}
                <div className="relative w-full max-w-[220px] group">
                  <div className="absolute inset-0 bg-yellow-500 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-between px-4 text-white font-medium shadow-lg shadow-yellow-500/30 border border-yellow-400/50 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Agendamento
                    </span>
                    <span className="font-bold">
                      {dadosReais.visitasAgendadas}
                    </span>
                  </div>
                </div>

                {/* Visita */}
                <div className="relative w-full max-w-[190px] group">
                  <div className="absolute inset-0 bg-orange-500 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-between px-4 text-white font-medium shadow-lg shadow-orange-500/30 border border-orange-400/50 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Visita
                    </span>
                    <span className="font-bold">
                      {dadosReais.visitasRealizadas}
                    </span>
                  </div>
                </div>

                {/* Proposta */}
                <div className="relative w-full max-w-[160px] group">
                  <div className="absolute inset-0 bg-purple-500 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-between px-4 text-white font-medium shadow-lg shadow-purple-500/30 border border-purple-400/50 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Proposta
                    </span>
                    <span className="font-bold">
                      {dadosReais.propostasNegociacao + dadosReais.vendas}{" "}
                      {/* ← ÚNICA MUDANÇA! */}
                    </span>
                  </div>
                </div>

                {/* Venda */}
                <div className="relative w-full max-w-[130px] group">
                  <div className="absolute inset-0 bg-red-500 rounded-xl opacity-75 blur-sm group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="relative h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-between px-4 text-white font-medium shadow-lg shadow-red-500/30 border border-red-400/50 backdrop-blur-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                      Venda
                    </span>
                    <span className="font-bold">{dadosReais.vendas}</span>
                  </div>
                </div>
              </div>

              {/* LEGENDA EM TABELA */}
              <div className="lg:w-96">
                <table className="w-full text-sm border-collapse border border-gray-200 dark:border-gray-700">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50">
                      <th className="text-left py-3 pl-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        Etapa
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        Qtd
                      </th>
                      <th className="text-center py-3 px-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        % Topo
                      </th>
                      <th className="text-center py-3 pr-3 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Variação
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {/* Lead */}
                    <tr>
                      <td className="py-3 pl-3 flex items-center gap-2 border-r border-gray-200 dark:border-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Lead
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.leadsSite}
                      </td>
                      <td className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        100%
                      </td>
                      <td className="text-center py-3 pr-3 text-gray-400 dark:text-gray-500">
                        —
                      </td>
                    </tr>

                    {/* Atendimento */}
                    <tr>
                      <td className="py-3 pl-3 flex items-center gap-2 border-r border-gray-200 dark:border-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Atendimento
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.qualificados}
                      </td>
                      <td className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.leadsSite > 0
                          ? Math.round(
                              (dadosReais.qualificados / dadosReais.leadsSite) *
                                100,
                            )
                          : 0}
                        %
                      </td>
                      <td className="text-center py-3 pr-3">
                        <span className="text-red-500 font-medium">-5%</span>
                      </td>
                    </tr>

                    {/* Agendamento */}
                    <tr>
                      <td className="py-3 pl-3 flex items-center gap-2 border-r border-gray-200 dark:border-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Agendamento
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.visitasAgendadas}
                      </td>
                      <td className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.leadsSite > 0
                          ? Math.round(
                              (dadosReais.visitasAgendadas /
                                dadosReais.leadsSite) *
                                100,
                            )
                          : 0}
                        %
                      </td>
                      <td className="text-center py-3 pr-3">
                        <span className="text-green-500 font-medium">+10%</span>
                      </td>
                    </tr>

                    {/* Visita */}
                    <tr>
                      <td className="py-3 pl-3 flex items-center gap-2 border-r border-gray-200 dark:border-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Visita
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.visitasRealizadas}
                      </td>
                      <td className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.leadsSite > 0
                          ? Math.round(
                              (dadosReais.visitasRealizadas /
                                dadosReais.leadsSite) *
                                100,
                            )
                          : 0}
                        %
                      </td>
                      <td className="text-center py-3 pr-3">
                        <span className="text-green-500 font-medium">+8%</span>
                      </td>
                    </tr>

                    {/* Proposta */}
                    <tr>
                      <td className="py-3 pl-3 flex items-center gap-2 border-r border-gray-200 dark:border-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Proposta
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.propostasNegociacao + dadosReais.vendas}{" "}
                        {/* ← SOMA! */}
                      </td>
                      <td className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.leadsSite > 0
                          ? Math.round(
                              ((dadosReais.propostasNegociacao +
                                dadosReais.vendas) /
                                dadosReais.leadsSite) *
                                100,
                            )
                          : 0}
                        %
                      </td>
                      <td className="text-center py-3 pr-3">
                        <span className="text-green-500 font-medium">+12%</span>
                      </td>
                    </tr>

                    {/* Venda */}
                    <tr>
                      <td className="py-3 pl-3 flex items-center gap-2 border-r border-gray-200 dark:border-gray-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                        <span className="text-gray-700 dark:text-gray-300">
                          Venda
                        </span>
                      </td>
                      <td className="text-center py-3 px-2 font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.vendas}
                      </td>
                      <td className="text-center py-3 px-2 text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700">
                        {dadosReais.leadsSite > 0
                          ? Math.round(
                              (dadosReais.vendas / dadosReais.leadsSite) * 100,
                            )
                          : 0}
                        %
                      </td>
                      <td className="text-center py-3 pr-3">
                        <span className="text-green-500 font-medium">+3%</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Taxa de conversão geral */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Taxa de conversão
                    </span>
                    <span className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">
                      {dadosReais.leadsSite > 0
                        ? Math.round(
                            (dadosReais.vendas / dadosReais.leadsSite) * 100,
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    De lead a venda •{" "}
                    {dadosReais.leadsSite > 0 && dadosReais.vendas > 0
                      ? `1 a cada ${Math.round(dadosReais.leadsSite / dadosReais.vendas)}`
                      : "0"}{" "}
                    leads
                  </p>
                </div>
              </div>
            </div>
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

    // ===== DADOS PARA ANÁLISE =====
    // Imóveis por bairro
    const imoveisPorBairro = Object.entries(
      data.imoveis.reduce((acc, imovel) => {
        if (!acc[imovel.bairro]) {
          acc[imovel.bairro] = { total: 0, disponivel: 0, valor: 0 };
        }
        acc[imovel.bairro].total++;
        if (imovel.status === "disponivel") {
          acc[imovel.bairro].disponivel++;
          acc[imovel.bairro].valor += imovel.preco;
        }
        return acc;
      }, {}),
    )
      .map(([bairro, dados]) => ({
        bairro,
        total: dados.total,
        disponivel: dados.disponivel,
        vendidos: dados.total - dados.disponivel,
        valor: dados.valor,
        percentual:
          dados.total > 0
            ? Math.round((dados.disponivel / dados.total) * 100)
            : 0,
      }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);

    // Imóveis por tipo
    const imoveisPorTipo = Object.entries(
      data.imoveis.reduce((acc, imovel) => {
        if (!acc[imovel.tipo]) {
          acc[imovel.tipo] = { quantidade: 0, valor: 0 };
        }
        acc[imovel.tipo].quantidade++;
        if (imovel.status === "disponivel") {
          acc[imovel.tipo].valor += imovel.preco;
        }
        return acc;
      }, {}),
    ).map(([tipo, dados]) => ({
      tipo,
      quantidade: dados.quantidade,
      valor: dados.valor,
    }));

    // ===== INTELIGÊNCIA DE MERCADO =====
    // 1. 🔥 MAIS VISITADOS (Top 3)
    const maisVisitados = [...data.imoveis]
      .filter((imovel) => imovel.status === "disponivel")
      .sort((a, b) => b.visitas_count - a.visitas_count)
      .slice(0, 3)
      .map((imovel) => ({
        ...imovel,
        visitas: imovel.visitas_count,
        vendas: data.vendas.filter((v) => v.imovel_id === imovel.id).length,
        conversao:
          imovel.visitas_count > 0
            ? Math.round(
                (data.vendas.filter((v) => v.imovel_id === imovel.id).length /
                  imovel.visitas_count) *
                  100,
              )
            : 0,
      }));

    // 2. 📊 ALTA CONVERSÃO (Top 3)
    const altaConversao = [...data.imoveis]
      .filter((imovel) => imovel.status === "disponivel")
      .map((imovel) => {
        const vendasImovel = data.vendas.filter(
          (v) => v.imovel_id === imovel.id,
        ).length;
        const taxaConversao =
          imovel.visitas_count > 0
            ? (vendasImovel / imovel.visitas_count) * 100
            : 0;
        return {
          ...imovel,
          vendas: vendasImovel,
          taxaConversao: Math.round(taxaConversao * 10) / 10,
        };
      })
      .sort((a, b) => b.taxaConversao - a.taxaConversao)
      .slice(0, 3);

    // ===== INSIGHTS ESTRATÉGICOS =====
    const insights = [];

    // Insight 1: Tipo com mais visita
    const visitasPorTipo = {};
    data.imoveis.forEach((imovel) => {
      if (!visitasPorTipo[imovel.tipo]) {
        visitasPorTipo[imovel.tipo] = { totalVisitas: 0, totalImoveis: 0 };
      }
      visitasPorTipo[imovel.tipo].totalVisitas += imovel.visitas_count;
      visitasPorTipo[imovel.tipo].totalImoveis++;
    });

    const tipoMaisVisitado = Object.entries(visitasPorTipo)
      .map(([tipo, dados]) => ({
        tipo,
        mediaVisitas: dados.totalVisitas / dados.totalImoveis,
      }))
      .sort((a, b) => b.mediaVisitas - a.mediaVisitas)[0];

    if (tipoMaisVisitado) {
      insights.push(
        `📈 ${tipoMaisVisitado.tipo}s têm ${tipoMaisVisitado.mediaVisitas.toFixed(1)}x mais visitas que a média`,
      );
    }

    // Insight 2: Bairro com maior conversão
    const conversaoPorBairro = {};
    data.imoveis.forEach((imovel) => {
      const vendasBairro = data.vendas.filter(
        (v) => v.imovel_id === imovel.id,
      ).length;
      if (!conversaoPorBairro[imovel.bairro]) {
        conversaoPorBairro[imovel.bairro] = { visitas: 0, vendas: 0 };
      }
      conversaoPorBairro[imovel.bairro].visitas += imovel.visitas_count;
      conversaoPorBairro[imovel.bairro].vendas += vendasBairro;
    });

    const melhorBairroConversao = Object.entries(conversaoPorBairro)
      .map(([bairro, dados]) => ({
        bairro,
        taxa: dados.visitas > 0 ? (dados.vendas / dados.visitas) * 100 : 0,
      }))
      .sort((a, b) => b.taxa - a.taxa)[0];

    if (melhorBairroConversao && melhorBairroConversao.taxa > 10) {
      insights.push(
        `🏘️ ${melhorBairroConversao.bairro} tem taxa de conversão de ${melhorBairroConversao.taxa.toFixed(1)}%`,
      );
    }

    // Insight 3: Faixa de preço mais vendida
    const vendasPorFaixa = {
      "até R$ 500k": 0,
      "R$ 500k a R$ 1M": 0,
      "acima de R$ 1M": 0,
    };

    data.vendas.forEach((venda) => {
      if (venda.valor <= 500000) vendasPorFaixa["até R$ 500k"]++;
      else if (venda.valor <= 1000000) vendasPorFaixa["R$ 500k a R$ 1M"]++;
      else vendasPorFaixa["acima de R$ 1M"]++;
    });

    const faixaMaisVendida = Object.entries(vendasPorFaixa).sort(
      (a, b) => b[1] - a[1],
    )[0];

    if (data.vendas.length > 0) {
      insights.push(
        `💰 Imóveis ${faixaMaisVendida[0]} representam ${Math.round(
          (faixaMaisVendida[1] / data.vendas.length) * 100,
        )}% das vendas`,
      );
    }

    // Insight 4: Estratégia recomendada
    insights.push(
      `🎯 Estratégia: Foque em casas financiáveis para casais jovens (28–35 anos) com 1 filho e renda de R$ 6k–10k. 78% das vendas são financiadas.`,
    );

    return (
      <div className="space-y-8">
        {/* ===== BLOCO 1: VISÃO GERAL (4 cards) ===== */}
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

        {/* ===== BLOCO 2: ANÁLISE POR BAIRRO E TIPO ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Imóveis por Bairro */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icons.building className="w-5 h-5 text-blue-500" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Imóveis por Bairro
              </h2>
            </div>
            <div className="space-y-4">
              {imoveisPorBairro.map((item) => (
                <div key={item.bairro} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {item.bairro}
                    </span>
                    <span className="text-gray-900 dark:text-white">
                      {item.disponivel}/{item.total}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-blue-500 rounded-full"
                        style={{ width: `${item.percentual}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                      {item.percentual}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.vendidos} vendidos • {formatarMoeda(item.valor)} em
                    estoque
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Imóveis por Tipo */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Icons.home className="w-5 h-5 text-emerald-500" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Imóveis por Tipo
              </h2>
            </div>
            <div className="space-y-3">
              {imoveisPorTipo.map((item) => (
                <div
                  key={item.tipo}
                  className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {item.tipo}
                  </span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900 dark:text-white block">
                      {item.quantidade} imóveis
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatarMoeda(item.valor)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ===== BLOCO 3: INTELIGÊNCIA DE MERCADO ===== */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
          {/* Cabeçalho da seção */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Icons.trendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Inteligência de Mercado
              </h2>
              <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full ml-2">
                Insights Estratégicos
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Análise do comportamento real de clientes
            </p>
          </div>

          {/* Cards de insights (3 colunas) */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* ===== CARD 1: ATRAÇÃO ===== */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Icons.eye className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Atração
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Imóveis mais visitados pelos clientes
                  </p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {maisVisitados && maisVisitados.length > 0 ? (
                    maisVisitados.slice(0, 3).map((imovel, idx) => (
                      <div
                        key={idx}
                        className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            {imovel.codigo}
                          </span>
                          <span className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded-full">
                            {imovel.visitas || 0} visitas
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {imovel.bairro}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                          {imovel.tipo}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {formatarMoeda(imovel.preco)}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {imovel.conversao || 0}% conversão
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      Nenhum dado disponível
                    </div>
                  )}
                </div>
              </div>

              {/* ===== CARD 2: IMÓVEIS DE SUCESSO ===== */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/10 dark:to-green-900/10 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Icons.trendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Imóveis de Sucesso
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    O que os imóveis mais vendidos têm em comum
                  </p>
                </div>

                <div className="p-4 space-y-4">
                  {(() => {
                    const dadosVendas = {
                      totalVendas: 45,
                      financiados: 35,
                      aVista: 10,
                      perfilCompradores: [
                        {
                          label: "Faixa etária",
                          valor: "28–35 anos",
                          percentual: 62,
                        },
                        {
                          label: "Estrutura familiar",
                          valor: "Casal 1 filho",
                          percentual: 48,
                        },
                        {
                          label: "Finalidade",
                          valor: "Moradia própria",
                          percentual: 78,
                        },
                        {
                          label: "Tipo de renda",
                          valor: "CLT + Autônomo",
                          percentual: 54,
                        },
                      ],
                      faixaRenda: {
                        min: 6000,
                        max: 10000,
                        percentual: 58,
                      },
                    };

                    const percentualFinanciado = Math.round(
                      (dadosVendas.financiados / dadosVendas.totalVendas) * 100,
                    );
                    const percentualAVista = Math.round(
                      (dadosVendas.aVista / dadosVendas.totalVendas) * 100,
                    );

                    return (
                      <>
                        {/* Bloco 1: Financiamento */}
                        <div className="border border-emerald-200 dark:border-emerald-800 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-lg p-3">
                          <div className="flex items-center">
                            <div className="flex-1 text-center border-r border-emerald-200 dark:border-emerald-800 pr-2">
                              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                                {percentualFinanciado}%
                              </p>
                              <p className="text-[10px] font-medium text-emerald-700 dark:text-emerald-400 mt-1">
                                FINANCIADOS
                              </p>
                              <p className="text-[9px] text-gray-500 dark:text-gray-400">
                                {dadosVendas.financiados} vendas
                              </p>
                            </div>
                            <div className="flex-1 text-center pl-2">
                              <p className="text-xl font-bold text-gray-700 dark:text-gray-300">
                                {percentualAVista}%
                              </p>
                              <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 mt-1">
                                À VISTA
                              </p>
                              <p className="text-[9px] text-gray-500 dark:text-gray-400">
                                {dadosVendas.aVista} vendas
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700"></div>

                        {/* Bloco 2: Perfil do Comprador */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Icons.users className="w-3 h-3" />
                            <span>Perfil do Comprador</span>
                          </h4>

                          <div className="space-y-1.5">
                            {dadosVendas.perfilCompradores.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between text-xs"
                              >
                                <span className="text-gray-600 dark:text-gray-400">
                                  {item.label}:
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {item.valor}
                                  </span>
                                  <span className="text-[9px] bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                                    {item.percentual}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700"></div>

                        {/* Bloco 3: Faixa de Renda */}
                        <div className="border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10 rounded-lg p-3">
                          <h4 className="text-xs font-medium uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
                            <Icons.chartBar className="w-3 h-3" />
                            <span>Faixa de Renda</span>
                          </h4>

                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1">
                              <span className="text-[10px] text-gray-500 dark:text-gray-400">
                                R$
                              </span>
                              <span className="text-sm font-bold text-gray-900 dark:text-white">
                                {dadosVendas.faixaRenda.min.toLocaleString()} –{" "}
                                {dadosVendas.faixaRenda.max.toLocaleString()}
                              </span>
                            </div>

                            <div className="w-px h-6 bg-blue-200 dark:bg-blue-800"></div>

                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div
                                  className="h-1.5 bg-blue-500 rounded-full"
                                  style={{
                                    width: `${dadosVendas.faixaRenda.percentual}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                {dadosVendas.faixaRenda.percentual}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* ===== CARD 3: EFICIÊNCIA ===== */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/10 dark:to-violet-900/10 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2">
                    <Icons.lightbulb className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      Eficiência
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Imóveis com maior taxa de conversão
                  </p>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {altaConversao && altaConversao.length > 0 ? (
                    altaConversao.slice(0, 3).map((imovel, idx) => {
                      const visitas = imovel.visitas_count || 0;
                      const vendas = imovel.vendas || 0;
                      const taxa = visitas > 0 ? (vendas / visitas) * 100 : 0;
                      const relacao = visitas > 0 ? `1 a cada ${visitas}` : "-";

                      return (
                        <div
                          key={idx}
                          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {imovel.codigo}
                            </span>
                            {vendas > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full font-medium">
                                <CheckCircleIcon className="w-3 h-3" />
                                <span>Vendido</span>
                              </span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {imovel.bairro}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                            {imovel.tipo}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1">
                              <Icons.eye className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {visitas} {visitas === 1 ? "visita" : "visitas"}
                              </span>
                            </div>
                            <span className="text-gray-600 dark:text-gray-400">
                              {relacao}
                            </span>
                            <div className="flex items-center gap-1">
                              <span className="text-gray-600 dark:text-gray-400">
                                conversão
                              </span>
                              <span className="font-medium text-purple-600 dark:text-purple-400">
                                {taxa.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-1 bg-purple-500 rounded-full"
                              style={{ width: `${taxa}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                      Nenhum dado disponível
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Insights Estratégicos Globais */}
            {insights.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                <h4 className="text-xs font-medium uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-3">
                  📈 Insights Estratégicos
                </h4>
                <div className="space-y-2">
                  {insights.map((insight, idx) => (
                    <p
                      key={idx}
                      className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                        •
                      </span>
                      {insight}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== BLOCO 4: FILTROS ===== */}
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

        {/* ===== BLOCO 5: ESTOQUE DETALHADO ===== */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
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
                className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                  ordemEstoque.campo === "diasNoSite"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : ""
                }`}
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
                className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
                  ordemEstoque.campo === "preco"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                    : ""
                }`}
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

          <div className="overflow-x-auto max-h-96 relative">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    Código
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    Tipo
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    Bairro
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    Preço
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
                    Dias no Site
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
          <p className="text-xs text-gray-500 dark:text-gray-400 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
            Mostrando {Math.min(imoveisFiltrados.length, 20)} de{" "}
            {imoveisFiltrados.length} imóveis
          </p>
        </div>
      </div>
    );
  };

  // ========== NOVA ABA: PROPOSTAS ==========
  const AbaPropostas = () => {
    const [propostas, setPropostas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroStatus, setFiltroStatus] = useState("todas");
    const [propostaSelecionada, setPropostaSelecionada] = useState(null);
    const [modalAberto, setModalAberto] = useState(false);

    // 👇 ESTADO PARA CORRETORES
    const [mapaCorretores, setMapaCorretores] = useState({});

    // 👇 useEffect PARA CARREGAR CORRETORES
    useEffect(() => {
      const carregarCorretores = async () => {
        const { data } = await supabase.from("corretores").select("id, nome");

        console.log("🔍 CORRETORES CARREGADOS:", data);

        const mapa = {};
        data?.forEach((c) => (mapa[c.id] = c.nome));
        setMapaCorretores(mapa);

        console.log("🗺️ MAPA DE CORRETORES:", mapa);
      };

      carregarCorretores();
    }, []);

    // 👇 useEffect PARA PROPOSTAS
    useEffect(() => {
      buscarPropostas();
    }, []);

    const buscarPropostas = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("propostas")
        .select(
          `
        *,
        visitas (
          id,
          lead_id,
          imovel_id,
          corretor_id,
          leads (
            id,
            nome,
            telefone,
            email
          ),
          imoveis (
            id,
            codigo,
            titulo,
            bairro,
            tipo,
            preco
          )
        )
      `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao buscar propostas:", error);
      } else {
        setPropostas(data || []);

        // Logs para debug
        console.log("📊 MAPA CORRETORES:", mapaCorretores);
        console.log("📊 PROPOSTAS CARREGADAS:", data);
        if (data && data.length > 0) {
          console.log("📊 PRIMEIRA PROPOSTA:", data[0]);
          console.log("📊 CORRETOR_ID:", data[0]?.visitas?.corretor_id);
          console.log(
            "📊 NOME CORRETOR:",
            mapaCorretores[data[0]?.visitas?.corretor_id],
          );
        }
      }
      setLoading(false);
    };

    const handleAprovarProposta = async (proposta) => {
      try {
        await supabase
          .from("propostas")
          .update({
            status: "aprovada",
            data_aprovacao: new Date().toISOString(),
          })
          .eq("id", proposta.id);

        await supabase
          .from("imoveis")
          .update({ status: "vendido" })
          .eq("id", proposta.visitas?.imovel_id);

        const comissao = proposta.valor * 0.06;
        await supabase.from("comissoes").insert({
          proposta_id: proposta.id,
          corretor_id: proposta.visitas?.corretor_id,
          valor: comissao,
          status: "a_pagar",
          data_vencimento: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        });

        alert("✅ Proposta aprovada! Venda concluída.");
        buscarPropostas();
      } catch (error) {
        console.error("Erro ao aprovar proposta:", error);
        alert("Erro ao aprovar proposta.");
      }
    };

    const handleRecusarProposta = async (proposta) => {
      if (!confirm("Tem certeza que deseja recusar esta proposta?")) return;

      try {
        await supabase
          .from("propostas")
          .update({ status: "recusada" })
          .eq("id", proposta.id);

        alert("❌ Proposta recusada");
        buscarPropostas();
      } catch (error) {
        console.error("Erro ao recusar proposta:", error);
      }
    };

    const abrirDetalhes = (proposta) => {
      setPropostaSelecionada(proposta);
      setModalAberto(true);
    };

    const getStatusInfo = (status) => {
      switch (status) {
        case "em_andamento":
          return {
            label: "Em Negociação",
            color:
              "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
            icon: "⚡",
          };
        case "aprovada":
          return {
            label: "Aprovada",
            color:
              "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
            icon: "✅",
          };
        case "recusada":
          return {
            label: "Recusada",
            color:
              "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            icon: "❌",
          };
        default:
          return {
            label: status,
            color:
              "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
            icon: "📄",
          };
      }
    };

    const calcularResumo = () => {
      const emAndamento = propostas.filter((p) => p.status === "em_andamento");
      const aprovadas = propostas.filter((p) => p.status === "aprovada");
      const valorTotal = propostas.reduce((acc, p) => acc + (p.valor || 0), 0);
      const valorEmAndamento = emAndamento.reduce(
        (acc, p) => acc + (p.valor || 0),
        0,
      );

      return {
        total: propostas.length,
        emAndamento: emAndamento.length,
        aprovadas: aprovadas.length,
        recusadas: propostas.filter((p) => p.status === "recusada").length,
        valorTotal,
        valorEmAndamento,
        conversao:
          propostas.length > 0
            ? Math.round((aprovadas.length / propostas.length) * 100)
            : 0,
      };
    };

    const resumo = calcularResumo();
    const propostasFiltradas =
      filtroStatus === "todas"
        ? propostas
        : propostas.filter((p) => p.status === filtroStatus);

    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* BARRA UNIFICADA - FILTROS + MÉTRICAS ESTRATÉGICAS */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl rounded-2xl shadow-lg shadow-purple-500/5 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2 pl-1">
            {/* FILTROS */}
            <div className="flex flex-wrap gap-2 flex-1">
              {/* Todas */}
              <button
                onClick={() => setFiltroStatus("todas")}
                className={`
          relative overflow-hidden rounded-xl px-5 py-4 transition-all duration-300 ml-1
          ${
            filtroStatus === "todas"
              ? "bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg shadow-gray-500/30 scale-105"
              : "bg-gray-100/50 dark:bg-gray-800/30 text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:scale-105"
          }
          outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0
        `}
                style={{ outline: "none", boxShadow: "none" }}
              >
                <span className="relative z-10 flex items-center gap-2 text-base font-medium whitespace-nowrap">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                  </svg>
                  <span>Todas</span>
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-sm font-bold ${
                      filtroStatus === "todas"
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {resumo.total}
                  </span>
                </span>
              </button>

              {/* Em Negociação */}
              <button
                onClick={() => setFiltroStatus("em_andamento")}
                className={`
          relative overflow-hidden rounded-xl px-5 py-4 transition-all duration-300
          ${
            filtroStatus === "em_andamento"
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-orange-500/30 scale-105"
              : "bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 hover:bg-amber-100/50 dark:hover:bg-amber-800/30 hover:scale-105"
          }
          outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0
        `}
                style={{ outline: "none", boxShadow: "none" }}
              >
                <span className="relative z-10 flex items-center gap-2 text-base font-medium whitespace-nowrap">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                  </svg>
                  <span>Negociação</span>
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-sm font-bold ${
                      filtroStatus === "em_andamento"
                        ? "bg-white/20 text-white"
                        : "bg-amber-200 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                    }`}
                  >
                    {resumo.emAndamento}
                  </span>
                </span>
              </button>

              {/* Aprovadas */}
              <button
                onClick={() => setFiltroStatus("aprovada")}
                className={`
          relative overflow-hidden rounded-xl px-5 py-4 transition-all duration-300
          ${
            filtroStatus === "aprovada"
              ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-green-500/30 scale-105"
              : "bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50 dark:hover:bg-emerald-800/30 hover:scale-105"
          }
          outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0
        `}
                style={{ outline: "none", boxShadow: "none" }}
              >
                <span className="relative z-10 flex items-center gap-2 text-base font-medium whitespace-nowrap">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span>Aprovadas</span>
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-sm font-bold ${
                      filtroStatus === "aprovada"
                        ? "bg-white/20 text-white"
                        : "bg-emerald-200 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300"
                    }`}
                  >
                    {resumo.aprovadas}
                  </span>
                </span>
              </button>

              {/* Recusadas */}
              <button
                onClick={() => setFiltroStatus("recusada")}
                className={`
          relative overflow-hidden rounded-xl px-5 py-4 transition-all duration-300
          ${
            filtroStatus === "recusada"
              ? "bg-gradient-to-r from-rose-400 to-rose-500 text-white shadow-lg shadow-rose-500/30 scale-105"
              : "bg-rose-50/50 dark:bg-rose-900/10 text-rose-700 dark:text-rose-400 hover:bg-rose-100/50 dark:hover:bg-rose-800/30 hover:scale-105"
          }
          outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none active:ring-0
        `}
                style={{ outline: "none", boxShadow: "none" }}
              >
                <span className="relative z-10 flex items-center gap-2 text-base font-medium whitespace-nowrap">
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <span>Recusadas</span>
                  <span
                    className={`ml-1.5 px-2 py-0.5 rounded-full text-sm font-bold ${
                      filtroStatus === "recusada"
                        ? "bg-white/20 text-white"
                        : "bg-rose-200 dark:bg-rose-900/30 text-rose-800 dark:text-rose-300"
                    }`}
                  >
                    {resumo.recusadas}
                  </span>
                </span>
              </button>
            </div>

            {/* MÉTRICAS ESTRATÉGICAS */}
            <div className="flex items-center gap-3 border-l border-gray-200 dark:border-gray-700 pl-4 mr-1">
              {/* Valor em Jogo */}
              <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-xl">
                <svg
                  className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M12 1v22M17 5H9.5M17 5C18.5 5 19 6.5 19 8.5s-1.5 3.5-3.5 3.5h-5C8.5 12 7 13.5 7 15.5S8.5 19 10.5 19H17" />
                  <path d="M17 5v14" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Valor em Jogo
                  </p>
                  <p className="text-base font-bold text-indigo-600 dark:text-indigo-400">
                    {formatarMoeda(resumo.valorEmAndamento)}
                  </p>
                </div>
              </div>

              {/* Taxa de Conversão */}
              <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 12v-2a5 5 0 0 0-5-5H8a5 5 0 0 0-5 5v2" />
                  <circle cx="12" cy="16" r="5" />
                  <path d="M12 11v5" />
                </svg>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Conversão
                  </p>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {resumo.conversao}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* LISTA DE PROPOSTAS */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <DocumentIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Lista de Propostas
            </h2>
          </div>

          {propostasFiltradas.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <DocumentIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Nenhuma proposta encontrada
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                {filtroStatus === "todas"
                  ? "Crie uma proposta a partir de uma visita realizada"
                  : `Nenhuma proposta com status ${filtroStatus}`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {propostasFiltradas.map((proposta) => {
                // 👇 ADICIONE ESTES LOGS AQUI
                console.log("🔍 PROPOSTA COMPLETA:", proposta);
                console.log("🔍 VISITAS:", proposta.visitas);
                console.log(
                  "🔍 LEADS DENTRO DE VISITAS:",
                  proposta.visitas?.leads,
                );
                console.log(
                  "🔍 CORRETOR_ID na visita:",
                  proposta.visitas?.corretor_id,
                );
                console.log("🔍 MAPA CORRETORES:", mapaCorretores);

                const status = getStatusInfo(proposta.status);
                return (
                  <div
                    key={proposta.id}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        {/* CABEÇALHO */}
                        <div className="flex items-center gap-3 flex-wrap">
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${status.color}`}
                          >
                            {status.icon} {status.label}
                          </span>
                          <span className="text-sm text-gray-500">
                            #
                            {proposta.id?.toString().slice(0, 8) || proposta.id}{" "}
                            •{" "}
                            {proposta.created_at
                              ? new Date(
                                  proposta.created_at,
                                ).toLocaleDateString("pt-BR")
                              : "—"}
                          </span>
                        </div>

                        {/* INFORMAÇÕES PRINCIPAIS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div>
                            <p className="text-xs text-gray-500">Imóvel</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {proposta.visitas?.imoveis?.codigo || "—"} -{" "}
                              {proposta.visitas?.imoveis?.bairro || "—"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {proposta.visitas?.imoveis?.tipo || "—"}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">
                              Valor da Proposta
                            </p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">
                              {formatarMoeda(proposta.valor)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-500">Cliente</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {proposta.visitas?.leads?.nome || "—"}
                            </p>
                            {proposta.visitas?.leads?.telefone && (
                              <p className="text-xs text-gray-500">
                                {proposta.visitas?.leads?.telefone}
                              </p>
                            )}
                          </div>

                          {/* ✅ ÚNICO CAMPO DE CORRETOR - MANTENHA ESTE */}
                          <div>
                            <p className="text-xs text-gray-500">Corretor</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {mapaCorretores[proposta.visitas?.corretor_id] ||
                                proposta.visitas?.corretor_nome ||
                                proposta.corretor_nome ||
                                "—"}
                            </p>
                          </div>
                        </div>

                        {/* CONDIÇÕES */}
                        {proposta.condicoes && (
                          <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            <p className="text-xs text-gray-500 mb-1">
                              Condições da proposta:
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                              {proposta.condicoes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* AÇÕES */}
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => abrirDetalhes(proposta)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          title="Ver detalhes"
                        >
                          <EyeIcon className="w-5 h-5" />
                        </button>

                        {proposta.status === "em_andamento" && (
                          <>
                            <button
                              onClick={() => handleAprovarProposta(proposta)}
                              className="p-2 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                              title="Aprovar proposta"
                            >
                              <CheckCircleIcon className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRecusarProposta(proposta)}
                              className="p-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Recusar proposta"
                            >
                              <XCircleIcon className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MODAL DE DETALHES */}
        {modalAberto && propostaSelecionada && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Detalhes da Proposta
                </h3>
                <button
                  onClick={() => setModalAberto(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {propostaSelecionada.condicoes ||
                    "Nenhuma condição especificada."}
                </p>
              </div>

              <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                <button
                  onClick={() => setModalAberto(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
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

      {/* ===== NOVA SEÇÃO: RELATÓRIO DE VENDAS ===== */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <DocumentIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Relatório de Vendas
          </h2>
        </div>

        {/* Filtros */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Data Início
              </label>
              <input
                type="date"
                value={filtroVendas.dataInicio}
                onChange={(e) =>
                  setFiltroVendas({
                    ...filtroVendas,
                    dataInicio: e.target.value,
                  })
                }
                className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Data Fim
              </label>
              <input
                type="date"
                value={filtroVendas.dataFim}
                onChange={(e) =>
                  setFiltroVendas({ ...filtroVendas, dataFim: e.target.value })
                }
                className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Corretor
              </label>
              <select
                value={filtroVendas.corretor}
                onChange={(e) =>
                  setFiltroVendas({ ...filtroVendas, corretor: e.target.value })
                }
                className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 w-full"
              >
                <option value="todos">Todos os corretores</option>
                {dadosReais.corretores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto max-h-80 relative">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Data
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Imóvel
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Cliente
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Corretor
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Valor
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Comissão
                </th>
              </tr>
            </thead>
            <tbody>
              {vendasFiltradas.length > 0 ? (
                vendasFiltradas.map((venda, index) => {
                  const corretor = dadosReais.corretores.find(
                    (c) => c.id === venda.corretor_id,
                  );
                  return (
                    <tr
                      key={venda.id}
                      className={`
                        ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/20"}
                        hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors
                      `}
                    >
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {formatarData(venda.data_venda)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {venda.bairro} - {venda.tipo}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        Lead #{venda.lead_id}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {corretor?.nome || `Corretor #${venda.corretor_id}`}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {formatarMoeda(venda.valor)}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300">
                        {formatarMoeda(venda.comissao)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Nenhuma venda encontrada no período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-end gap-6">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Total de vendas:{" "}
              </span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {vendasFiltradas.length}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Valor total:{" "}
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatarMoeda(
                  vendasFiltradas.reduce((acc, v) => acc + v.valor, 0),
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== NOVA SEÇÃO: COMISSÕES A PAGAR ===== */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Icons.dollar className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            Comissões a Pagar
          </h2>
        </div>

        {/* Filtros */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Status
              </label>
              <select
                value={filtroComissoes.status}
                onChange={(e) =>
                  setFiltroComissoes({
                    ...filtroComissoes,
                    status: e.target.value,
                  })
                }
                className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 w-full"
              >
                <option value="todos">Todos os status</option>
                <option value="a_pagar">A pagar</option>
                <option value="pago">Pago</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">
                Corretor
              </label>
              <select
                value={filtroComissoes.corretor}
                onChange={(e) =>
                  setFiltroComissoes({
                    ...filtroComissoes,
                    corretor: e.target.value,
                  })
                }
                className="text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 w-full"
              >
                <option value="todos">Todos os corretores</option>
                {dadosReais.corretores.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto max-h-80 relative">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10 bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Corretor
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Venda
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Data
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Valor
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                  Vencimento
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium uppercase tracking-wider text-gray-600 dark:text-gray-300">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {comissoesFiltradas.length > 0 ? (
                comissoesFiltradas.map((comissao, index) => {
                  const corretor = dadosReais.corretores.find(
                    (c) => c.id === comissao.corretor_id,
                  );
                  const venda = dadosReais.vendasLista.find(
                    (v) => v.id === comissao.venda_id,
                  );
                  const dataVencimento = new Date(comissao.data_vencimento);
                  const hoje = new Date();
                  const diasAtraso = Math.floor(
                    (hoje - dataVencimento) / (1000 * 60 * 60 * 24),
                  );

                  return (
                    <tr
                      key={comissao.id}
                      className={`
                        ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/20"}
                        hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors
                      `}
                    >
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {corretor?.nome || `Corretor #${comissao.corretor_id}`}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {venda
                          ? `${venda.bairro} - ${venda.tipo}`
                          : `Venda #${comissao.venda_id}`}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700">
                        {formatarData(comissao.created_at)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                        {formatarMoeda(comissao.valor)}
                      </td>
                      <td className="py-3 px-4 text-sm border-r border-gray-200 dark:border-gray-700">
                        <span
                          className={
                            diasAtraso > 0 && comissao.status === "a_pagar"
                              ? "text-red-600 dark:text-red-400 font-medium"
                              : "text-gray-700 dark:text-gray-300"
                          }
                        >
                          {formatarData(comissao.data_vencimento)}
                          {diasAtraso > 0 && comissao.status === "a_pagar" && (
                            <span className="ml-2 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded-full">
                              {diasAtraso} dias atrasado
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            comissao.status === "pago"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          }`}
                        >
                          {comissao.status === "pago" ? "Pago" : "A pagar"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    Nenhuma comissão encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Resumo */}
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-end gap-6">
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Total a pagar:{" "}
              </span>
              <span className="font-semibold text-red-600 dark:text-red-400">
                {formatarMoeda(
                  comissoesFiltradas
                    .filter((c) => c.status === "a_pagar")
                    .reduce((acc, c) => acc + c.valor, 0),
                )}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                Total pago:{" "}
              </span>
              <span className="font-semibold text-green-600 dark:text-green-400">
                {formatarMoeda(
                  comissoesFiltradas
                    .filter((c) => c.status === "pago")
                    .reduce((acc, c) => acc + c.valor, 0),
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ========== ABA CORRETORES ==========
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
                <th className="text-center py-3 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
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
                <th className="text-center py-3 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Em Neg.</div>
                </th>
                <th className="text-center py-3 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Conversão</div>
                </th>
                <th className="text-center py-3 px-2 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Tempo Resp.</div>
                </th>
                {/* ===== NOVAS COLUNAS ===== */}
                <th className="text-center py-3 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 align-middle">
                  <div>Comissão Gerada</div>
                </th>
                <th className="text-center py-3 px-3 text-[11px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400 align-middle">
                  <div>Comissão Paga</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {indicadores.rankingCorretores.map((corretor, index) => (
                <tr
                  key={corretor.id}
                  className={`
                    ${index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/50 dark:bg-gray-800/20"}
                    ${corretor.alerta ? "bg-amber-50 dark:bg-amber-900/10" : ""}
                    hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors
                  `}
                >
                  <td className="py-3 px-3 text-[13px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <span className="truncate max-w-[110px]">
                        {corretor.nome}
                      </span>
                      {corretor.alerta && (
                        <span
                          className="text-[10px] font-light text-amber-600 dark:text-amber-400 flex items-center gap-0.5 whitespace-nowrap"
                          title="Mais de 10 leads e nenhuma venda no mês"
                        >
                          <Icons.alertCircle className="w-2.5 h-2.5" />
                          <span>0</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-center">
                    {corretor.vendas}
                  </td>
                  <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-left whitespace-nowrap">
                    {formatarMoeda(corretor.meta)}
                  </td>
                  <td className="py-3 px-2 text-[13px] border-r border-gray-200 dark:border-gray-700 text-center">
                    <span
                      className={`text-[12px] font-medium ${corretor.percentualMeta >= 100 ? "text-emerald-600 dark:text-emerald-400" : "text-gray-600 dark:text-gray-400"}`}
                    >
                      {corretor.percentualMeta.toFixed(0)}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-left whitespace-nowrap">
                    {formatarMoeda(corretor.receita)}
                  </td>
                  <td className="py-3 px-2 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-center">
                    {corretor.leads}
                  </td>
                  <td className="py-3 px-2 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-center">
                    {corretor.leadsAtivos}
                  </td>
                  <td className="py-3 px-2 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 text-center">
                    {corretor.conversao.toFixed(1)}%
                  </td>
                  <td className="py-3 px-2 text-[13px] text-gray-700 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center gap-1 text-center whitespace-nowrap">
                    <ClockIcon className="w-3 h-3" />
                    {formatarTempoResposta(corretor.tempoResposta)}
                  </td>
                  {/* ===== NOVAS COLUNAS ===== */}
                  <td className="py-3 px-3 text-[13px] font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-700 text-left whitespace-nowrap">
                    {formatarMoeda(corretor.comissaoGerada || 0)}
                  </td>
                  <td className="py-3 px-3 text-[13px] text-gray-700 dark:text-gray-300 text-left whitespace-nowrap">
                    {formatarMoeda(corretor.comissaoPaga || 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Médias do time */}
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
            <UserIcon className="w-4 h-4 text-gray-500" />
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
    const canaisSite = indicadores.leadsPorCanal.filter((c) =>
      ["Site", "Portal"].includes(c.canal),
    );
    const canaisRedes = indicadores.leadsPorCanal.filter((c) =>
      ["Instagram", "Facebook"].includes(c.canal),
    );
    const canaisIndicacao = indicadores.leadsPorCanal.filter((c) =>
      ["Indicação"].includes(c.canal),
    );

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
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Icon className={`w-5 h-5 ${corIcone}`} />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {titulo}
            </h2>
          </div>

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

        <TabelaCanais
          titulo="🌐 Site e Portais"
          icone={Icons.home}
          corIcone="text-blue-500"
          canais={canaisSite}
          corDestaque="bg-blue-500"
        />

        <TabelaCanais
          titulo="📱 Redes Sociais"
          icone={Icons.users}
          corIcone="text-indigo-500"
          canais={canaisRedes}
          corDestaque="bg-indigo-500"
        />

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

        {/* NAVEGAÇÃO */}
        <div className="border-b border-gray-200 dark:border-gray-800">
          <nav className="flex space-x-1 overflow-x-auto">
            {[
              {
                id: "visao-geral",
                label: "Visão Geral",
                icon: Icons.dashboard,
              },
              { id: "estoque", label: "Estoque", icon: Icons.building },
              { id: "propostas", label: "Propostas", icon: Icons.document },
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
                    border-b-2 transition-all outline-none focus:outline-none focus:ring-0
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

        {/* CONTEÚDO */}
        <div className="mt-6 animate-fadeIn">
          {abaAtiva === "visao-geral" && <AbaVisaoGeral />}
          {abaAtiva === "estoque" && <AbaEstoque />}
          {abaAtiva === "propostas" && <AbaPropostas />} {/* ✅ NOVA LINHA */}
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
