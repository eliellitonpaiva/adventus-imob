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
  { nome: "Centro", slug: "centro", regiao: "central" },
  { nome: "Vila Ildemar", slug: "vila-ildemar", regiao: "central" },
  { nome: "Vila Sarney Filho", slug: "vila-sarney-filho", regiao: "central" },
  { nome: "João Paulo", slug: "joao-paulo", regiao: "central" },
  { nome: "Entroncamento", slug: "entroncamento", regiao: "central" },
  { nome: "Vila Maranhão", slug: "vila-maranhao", regiao: "central" },
  { nome: "Vila Ipiranga", slug: "vila-ipiranga", regiao: "central" },
  { nome: "Getat", slug: "getat", regiao: "central" },
  { nome: "Jardim América", slug: "jardim-america", regiao: "nobre" },
  { nome: "Jardim Glória", slug: "jardim-gloria", regiao: "nobre" },
  { nome: "Jardim Glória II", slug: "jardim-gloria-ii", regiao: "nobre" },
  { nome: "Jardim Glória III", slug: "jardim-gloria-iii", regiao: "nobre" },
  { nome: "Jardim de Alah", slug: "jardim-de-alah", regiao: "nobre" },
  { nome: "Jardim Brasil", slug: "jardim-brasil", regiao: "nobre" },
  { nome: "Jardim Aulídia", slug: "jardim-aulidia", regiao: "nobre" },
  { nome: "Park Jardins", slug: "park-jardins", regiao: "nobre" },
  { nome: "Parque Planalto", slug: "parque-planalto", regiao: "nobre" },
  { nome: "Parque da Lagoa", slug: "parque-da-lagoa", regiao: "nobre" },
  { nome: "Parque das Nações", slug: "parque-das-nacoes", regiao: "nobre" },
  {
    nome: "Parque Novo Horizonte",
    slug: "parque-novo-horizonte",
    regiao: "nobre",
  },
  { nome: "Nova Açailândia", slug: "nova-acailandia", regiao: "novo" },
  { nome: "Nova Açailândia II", slug: "nova-acailandia-ii", regiao: "novo" },
  {
    nome: "Residencial Tropical",
    slug: "residencial-tropical",
    regiao: "novo",
  },
  {
    nome: "Residencial Ouro Verde",
    slug: "residencial-ouro-verde",
    regiao: "novo",
  },
  { nome: "Residencial Valle do Açaí", slug: "valle-do-acai", regiao: "novo" },
  { nome: "Colinas Park", slug: "colinas-park", regiao: "novo" },
  { nome: "Porto Seguro", slug: "porto-seguro", regiao: "novo" },
  { nome: "Porto Seguro II", slug: "porto-seguro-ii", regiao: "novo" },
  { nome: "Novo Bacabal", slug: "novo-bacabal", regiao: "novo" },
  { nome: "Brasil Novo", slug: "brasil-novo", regiao: "novo" },
  { nome: "Barra Azul", slug: "barra-azul", regiao: "novo" },
  { nome: "Jacu", slug: "jacu", regiao: "popular" },
  { nome: "Piquiá", slug: "piquia", regiao: "popular" },
  { nome: "Vila Bom Jardim", slug: "vila-bom-jardim", regiao: "popular" },
  { nome: "Bom Jardim", slug: "bom-jardim", regiao: "popular" },
  { nome: "Laranjeiras", slug: "laranjeiras", regiao: "popular" },
  { nome: "Vila São Francisco", slug: "vila-sao-francisco", regiao: "popular" },
  {
    nome: "Vila Tancredo Neves",
    slug: "vila-tancredo-neves",
    regiao: "popular",
  },
  { nome: "Capelosa", slug: "capelosa", regiao: "popular" },
  { nome: "Vila União", slug: "vila-uniao", regiao: "popular" },
  { nome: "Massaranduba", slug: "massaranduba", regiao: "popular" },
  { nome: "Plano da Serra", slug: "plano-da-serra", regiao: "popular" },
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
// GERAR TODAS AS ROTAS (APENAS STRINGS!)
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
// CONFIGURAÇÃO PRINCIPAL (APENAS STRINGS!)
// ==============================================
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: imobiliariaData.site,
      dynamicRoutes: gerarTodasRotas(), // ← APENAS ARRAY DE STRINGS!
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
