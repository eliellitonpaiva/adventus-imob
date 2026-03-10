import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import sitemap from "vite-plugin-sitemap";

// ==============================================
// DADOS REAIS DA ADVENTUS IMOBILIÁRIA
// ==============================================
const imobiliariaData = {
  nome: "Adventus Imobiliária",
  telefone: "+55 99 98808-7867",
  telefoneFixo: "+55 99 8808-7867",
  email: "adventusimobiliaria@gmail.com",
  emailAlternativo: "francesilva@hotmail.com.br",
  endereco: {
    rua: "Rua Fortaleza, 1382-B",
    bairro: "Centro",
    cidade: "Açailândia",
    estado: "MA",
    cep: "65930-000",
    completo: "Rua Fortaleza 1382-B, Centro, Açailândia - MA",
  },
  horarioFuncionamento: "Mo-Fr 08:00-18:00",
  redesSociais: {
    instagram: "https://www.instagram.com/adventusimobiliaria/",
    facebook: "https://www.facebook.com/profile.php?id=100041371455024",
    whatsapp: "https://wa.me/5599988087867",
  },
  coordenadas: {
    lat: "-4.9472",
    lng: "-47.5044",
  },
  slogan: "Cada cliente, uma história.",
  site: "https://adventusimobiliaria.com.br",
  creci: "🔴 ADICIONAR CRECI",
  fundacao: "🔴 ADICIONAR ANO",
  corretores: "🔴 ADICIONAR QUANTIDADE",
};

// ==============================================
// FUNÇÃO DE GERAÇÃO SEMÂNTICA DE KEYWORDS
// ==============================================
function generateKeywords(termos, location) {
  const variations = [];
  const locationVars = [
    location,
    `${location} MA`,
    `${location} Maranhão`,
    `em ${location}`,
    `- ${location}`,
  ];

  termos.forEach((term) => {
    locationVars.forEach((loc) => {
      variations.push(`${term} ${loc}`);
      variations.push(`${loc} ${term}`);
      variations.push(term.replace("Açailândia", loc));
    });
  });

  return [...new Set(variations)].filter((k) => k.length > 5);
}

// ==============================================
// BASE DE PALAVRAS-CHAVE
// ==============================================
const baseKeywords = [
  "Adventus Imobiliária",
  "Adventus Açailândia",
  "imobiliária Açailândia",
  "corretor de imóveis Açailândia",
  "imóveis Açailândia",
  "comprar imóvel Açailândia",
  "alugar imóvel Açailândia",
  "vender imóvel Açailândia",
  "casas Açailândia",
  "apartamentos Açailândia",
  "terrenos Açailândia",
  "imóveis comerciais Açailândia",
  "lançamentos imobiliários Açailândia",
  "financiamento imobiliário Açailândia",
  "melhor imobiliária Açailândia",
  "imobiliárias em Açailândia",
];

// ==============================================
// BAIRROS DE AÇAILÂNDIA (LISTA COMPLETA - 41 BAIRROS)
// ==============================================
const bairrosAcilandia = [
  // Centro e região central (8 bairros)
  {
    nome: "Centro",
    slug: "centro",
    regiao: "central",
    descricao: "área central com comércio e serviços",
  },
  {
    nome: "Vila Ildemar",
    slug: "vila-ildemar",
    regiao: "central",
    descricao: "bairro tradicional próximo ao centro",
  },
  {
    nome: "Vila Sarney Filho",
    slug: "vila-sarney-filho",
    regiao: "central",
    descricao: "região central consolidada",
  },
  {
    nome: "João Paulo",
    slug: "joao-paulo",
    regiao: "central",
    descricao: "área residencial próxima ao centro",
  },
  {
    nome: "Entroncamento",
    slug: "entroncamento",
    regiao: "central",
    descricao: "ponto estratégico da cidade",
  },
  {
    nome: "Vila Maranhão",
    slug: "vila-maranhao",
    regiao: "central",
    descricao: "comunidade estabelecida",
  },
  {
    nome: "Vila Ipiranga",
    slug: "vila-ipiranga",
    regiao: "central",
    descricao: "bairro tradicional",
  },
  {
    nome: "Getat",
    slug: "getat",
    regiao: "central",
    descricao: "área do grupo executivo",
  },

  // Jardins e áreas nobres (12 bairros)
  {
    nome: "Jardim América",
    slug: "jardim-america",
    regiao: "nobre",
    descricao: "bairro nobre e residencial",
  },
  {
    nome: "Jardim Glória",
    slug: "jardim-gloria",
    regiao: "nobre",
    descricao: "área nobre em expansão",
  },
  {
    nome: "Jardim Glória II",
    slug: "jardim-gloria-ii",
    regiao: "nobre",
    descricao: "continuação do Jardim Glória",
  },
  {
    nome: "Jardim Glória III",
    slug: "jardim-gloria-iii",
    regiao: "nobre",
    descricao: "novo loteamento nobre",
  },
  {
    nome: "Jardim de Alah",
    slug: "jardim-de-alah",
    regiao: "nobre",
    descricao: "bairro planejado",
  },
  {
    nome: "Jardim Brasil",
    slug: "jardim-brasil",
    regiao: "nobre",
    descricao: "área residencial de qualidade",
  },
  {
    nome: "Jardim Aulídia",
    slug: "jardim-aulidia",
    regiao: "nobre",
    descricao: "bairro tranquilo e arborizado",
  },
  {
    nome: "Park Jardins",
    slug: "park-jardins",
    regiao: "nobre",
    descricao: "condomínio de alto padrão",
  },
  {
    nome: "Parque Planalto",
    slug: "parque-planalto",
    regiao: "nobre",
    descricao: "área nobre com infraestrutura",
  },
  {
    nome: "Parque da Lagoa",
    slug: "parque-da-lagoa",
    regiao: "nobre",
    descricao: "região valorizada",
  },
  {
    nome: "Parque das Nações",
    slug: "parque-das-nacoes",
    regiao: "nobre",
    descricao: "bairro planejado",
  },
  {
    nome: "Parque Novo Horizonte",
    slug: "parque-novo-horizonte",
    regiao: "nobre",
    descricao: "novo parque residencial",
  },

  // Novos loteamentos e residenciais (11 bairros)
  {
    nome: "Nova Açailândia",
    slug: "nova-acailandia",
    regiao: "novo",
    descricao: "bairro novo em crescimento",
  },
  {
    nome: "Nova Açailândia II",
    slug: "nova-acailandia-ii",
    regiao: "novo",
    descricao: "expansão da Nova Açailândia",
  },
  {
    nome: "Residencial Tropical",
    slug: "residencial-tropical",
    regiao: "novo",
    descricao: "condomínio residencial",
  },
  {
    nome: "Residencial Ouro Verde",
    slug: "residencial-ouro-verde",
    regiao: "novo",
    descricao: "loteamento novo",
  },
  {
    nome: "Residencial Valle do Açaí",
    slug: "valle-do-acai",
    regiao: "novo",
    descricao: "residencial planejado",
  },
  {
    nome: "Colinas Park",
    slug: "colinas-park",
    regiao: "novo",
    descricao: "loteamento em desenvolvimento",
  },
  {
    nome: "Porto Seguro",
    slug: "porto-seguro",
    regiao: "novo",
    descricao: "novo bairro residencial",
  },
  {
    nome: "Porto Seguro II",
    slug: "porto-seguro-ii",
    regiao: "novo",
    descricao: "ampliação do Porto Seguro",
  },
  {
    nome: "Novo Bacabal",
    slug: "novo-bacabal",
    regiao: "novo",
    descricao: "área em expansão",
  },
  {
    nome: "Brasil Novo",
    slug: "brasil-novo",
    regiao: "novo",
    descricao: "bairro em desenvolvimento",
  },
  {
    nome: "Barra Azul",
    slug: "barra-azul",
    regiao: "novo",
    descricao: "área residencial",
  },

  // Bairros populares e consolidados (10 bairros)
  {
    nome: "Jacu",
    slug: "jacu",
    regiao: "popular",
    descricao: "bairro tradicional",
  },
  {
    nome: "Piquiá",
    slug: "piquia",
    regiao: "popular",
    descricao: "bairro operário",
  },
  {
    nome: "Vila Bom Jardim",
    slug: "vila-bom-jardim",
    regiao: "popular",
    descricao: "comunidade tradicional",
  },
  {
    nome: "Bom Jardim",
    slug: "bom-jardim",
    regiao: "popular",
    descricao: "bairro residencial",
  },
  {
    nome: "Laranjeiras",
    slug: "laranjeiras",
    regiao: "popular",
    descricao: "área residencial",
  },
  {
    nome: "Vila São Francisco",
    slug: "vila-sao-francisco",
    regiao: "popular",
    descricao: "bairro tradicional",
  },
  {
    nome: "Vila Tancredo Neves",
    slug: "vila-tancredo-neves",
    regiao: "popular",
    descricao: "bairro tradicional",
  },
  {
    nome: "Capelosa",
    slug: "capelosa",
    regiao: "popular",
    descricao: "comunidade tradicional",
  },
  {
    nome: "Vila União",
    slug: "vila-uniao",
    regiao: "popular",
    descricao: "bairro unido",
  },
  {
    nome: "Massaranduba",
    slug: "massaranduba",
    regiao: "popular",
    descricao: "área tradicional",
  },
  {
    nome: "Plano da Serra",
    slug: "plano-da-serra",
    regiao: "popular",
    descricao: "região serrana",
  },
];

// ==============================================
// TIPOS DE IMÓVEIS
// ==============================================
const tiposImovel = [
  { nome: "Casa", slug: "casa", plural: "casas" },
  { nome: "Apartamento", slug: "apartamento", plural: "apartamentos" },
  { nome: "Terreno", slug: "terreno", plural: "terrenos" },
  {
    nome: "Ponto Comercial",
    slug: "ponto-comercial",
    plural: "pontos-comerciais",
  },
  { nome: "Sítio/Chácara", slug: "sitio", plural: "sitios" },
  { nome: "Galpão", slug: "galpao", plural: "galpoes" },
];

// ==============================================
// GERAR TODAS AS ROTAS PARA O SITEMAP
// ==============================================
function gerarTodasRotas() {
  const rotas = [
    "/",
    "/casas-em-acailandia",
    "/apartamentos-em-acailandia",
    "/imoveis-em-acailandia",
    "/terrenos-em-acailandia",
    "/aluguel-acailandia",
    "/venda-acailandia",
    "/imoveis-comerciais-acailandia",
    "/lancamentos-acailandia",
    "/casas",
    "/apartamentos",
    "/terrenos",
    "/pontos-comerciais",
    "/sitios",
    "/galpoes",
  ];

  // Páginas de bairros (41)
  bairrosAcilandia.forEach((bairro) => {
    rotas.push(`/imoveis-${bairro.slug}-acailandia`);
  });

  // Páginas de tipo + bairro (41 * 6 = 246)
  bairrosAcilandia.forEach((bairro) => {
    tiposImovel.forEach((tipo) => {
      rotas.push(`/${tipo.plural}-${bairro.slug}-acailandia`);
    });
  });

  // Páginas de região
  const regioes = ["nobre", "central", "novos-loteamentos", "populares"];
  regioes.forEach((regiao) => {
    rotas.push(`/imoveis-regiao-${regiao}-acailandia`);
    tiposImovel.forEach((tipo) => {
      rotas.push(`/${tipo.plural}-regiao-${regiao}-acailandia`);
    });
  });

  console.log(`✅ Total de rotas geradas: ${rotas.length}`);
  return rotas;
}

// ==============================================
// CONFIGURAÇÃO PRINCIPAL DO VITE (AGORA COM dynamicRoutes!)
// ==============================================
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: imobiliariaData.site,
      dynamicRoutes: gerarTodasRotas(), // ← MUDOU AQUI!
      changefreq: "daily",
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
