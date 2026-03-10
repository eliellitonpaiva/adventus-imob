// gerar-sitemap.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================================
// LISTA DE BAIRROS DE AÇAILÂNDIA
// ==============================================
const bairros = [
  "centro",
  "vila-ildemar",
  "vila-sarney-filho",
  "joao-paulo",
  "entroncamento",
  "vila-maranhao",
  "vila-ipiranga",
  "getat",
  "jardim-america",
  "jardim-gloria",
  "jardim-gloria-ii",
  "jardim-gloria-iii",
  "jardim-de-alah",
  "jardim-brasil",
  "jardim-aulidia",
  "park-jardins",
  "parque-planalto",
  "parque-da-lagoa",
  "parque-das-nacoes",
  "parque-novo-horizonte",
  "nova-acailandia",
  "nova-acailandia-ii",
  "residencial-tropical",
  "residencial-ouro-verde",
  "valle-do-acai",
  "colinas-park",
  "porto-seguro",
  "porto-seguro-ii",
  "novo-bacabal",
  "brasil-novo",
  "barra-azul",
  "jacu",
  "piquia",
  "vila-bom-jardim",
  "bom-jardim",
  "laranjeiras",
  "vila-sao-francisco",
  "vila-tancredo-neves",
  "capelosa",
  "vila-uniao",
  "massaranduba",
  "plano-da-serra",
];

// ==============================================
// TIPOS DE IMÓVEIS
// ==============================================
const tipos = [
  "casas",
  "apartamentos",
  "terrenos",
  "pontos-comerciais",
  "sitios",
  "galpoes",
];

// ==============================================
// REGIÕES
// ==============================================
const regioes = ["nobre", "central", "novos-loteamentos", "populares"];

// ==============================================
// 🎯 MAPEAMENTO REALISTA DE IMÓVEIS POR BAIRRO
// ==============================================
// ALTERE ESTE MAPA DE ACORDO COM A REALIDADE DE AÇAILÂNDIA
// true = existem imóveis deste tipo no bairro
// false = não existem (não vai gerar URL)
const imoveisPorBairro = {
  // BAIRROS CENTRAIS
  centro: {
    casas: true,
    apartamentos: true, // ✅ Centro tem apartamentos
    terrenos: false, // ⚠️ Poucos ou nenhum terreno
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "vila-ildemar": {
    casas: true,
    apartamentos: false, // ❌ Sem apartamentos
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "vila-sarney-filho": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "joao-paulo": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  entroncamento: {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true, // Entroncamento tem comércio forte
    sitios: false,
    galpoes: true, // Possui galpões
  },
  "vila-maranhao": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "vila-ipiranga": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  getat: {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },

  // JARDINS E ÁREAS NOBRES
  "jardim-america": {
    casas: true,
    apartamentos: true, // ✅ Jardim América tem apartamentos
    terrenos: false,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "jardim-gloria": {
    casas: true,
    apartamentos: true, // ✅ Tem apartamentos
    terrenos: false,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "jardim-gloria-ii": {
    casas: true,
    apartamentos: false, // ❌ Predominantemente casas
    terrenos: false,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "jardim-gloria-iii": {
    casas: true,
    apartamentos: false,
    terrenos: true, // Pode ter terrenos por ser novo
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "jardim-de-alah": {
    casas: true,
    apartamentos: false,
    terrenos: false,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "jardim-brasil": {
    casas: true,
    apartamentos: false,
    terrenos: false,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "jardim-aulidia": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "park-jardins": {
    casas: true,
    apartamentos: false,
    terrenos: false,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "parque-planalto": {
    casas: true,
    apartamentos: true, // ✅ Tem apartamentos
    terrenos: false,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "parque-da-lagoa": {
    casas: true,
    apartamentos: true, // ✅ Tem apartamentos
    terrenos: false,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "parque-das-nacoes": {
    casas: true,
    apartamentos: true, // ✅ Tem apartamentos
    terrenos: false,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "parque-novo-horizonte": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },

  // NOVOS LOTEAMENTOS
  "nova-acailandia": {
    casas: true,
    apartamentos: false, // ❌ Sem apartamentos (só casas)
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "nova-acailandia-ii": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "residencial-tropical": {
    casas: true,
    apartamentos: false,
    terrenos: false,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "residencial-ouro-verde": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "valle-do-acai": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "colinas-park": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "porto-seguro": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "porto-seguro-ii": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "novo-bacabal": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "brasil-novo": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "barra-azul": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },

  // BAIRROS POPULARES
  jacu: {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: true, // Pode ter galpões
  },
  piquia: {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: true, // Área mais industrial
  },
  "vila-bom-jardim": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "bom-jardim": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  laranjeiras: {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  "vila-sao-francisco": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  "vila-tancredo-neves": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: false,
    galpoes: false,
  },
  capelosa: {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: true, // Pode ter sítios/chácaras
    galpoes: false,
  },
  "vila-uniao": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": true,
    sitios: false,
    galpoes: false,
  },
  massaranduba: {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: true, // Região mais afastada
    galpoes: false,
  },
  "plano-da-serra": {
    casas: true,
    apartamentos: false,
    terrenos: true,
    "pontos-comerciais": false,
    sitios: true, // Região serrana com sítios
    galpoes: false,
  },
};

// ==============================================
// GERAR TODAS AS ROTAS (COM MAPEAMENTO REALISTA)
// ==============================================
function gerarRotas() {
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

  // Páginas de bairros (sempre gerar, independente dos tipos)
  bairros.forEach((b) => rotas.push(`/imoveis-${b}-acailandia`));

  // 🎯 Páginas de tipo + bairro (SÓ ONDE REALMENTE EXISTEM!)
  Object.keys(imoveisPorBairro).forEach((bairro) => {
    const tiposNoBairro = imoveisPorBairro[bairro];

    Object.keys(tiposNoBairro).forEach((tipo) => {
      if (tiposNoBairro[tipo]) {
        // Só gera URL se for true
        rotas.push(`/${tipo}-${bairro}-acailandia`);
      }
    });
  });

  // Páginas de região (mantém como está, mas podemos ajustar depois)
  regioes.forEach((r) => {
    rotas.push(`/imoveis-regiao-${r}-acailandia`);
    tipos.forEach((t) => rotas.push(`/${t}-regiao-${r}-acailandia`));
  });

  return [...new Set(rotas)]; // Remove duplicatas
}

// ==============================================
// GERAR O SITEMAP.XML
// ==============================================
const rotas = gerarRotas();
const hostname = "https://adventusimobiliaria.com.br";
const dataAtual = new Date().toISOString();

let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

rotas.forEach((rota) => {
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${hostname}${rota}</loc>\n`;
  sitemap += `    <lastmod>${dataAtual}</lastmod>\n`;
  sitemap += `    <changefreq>daily</changefreq>\n`;
  sitemap += `    <priority>0.7</priority>\n`;
  sitemap += `  </url>\n`;
});

sitemap += "</urlset>";

// Garante que a pasta dist existe
if (!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist");
}

fs.writeFileSync("./dist/sitemap.xml", sitemap);

// Estatísticas
const totalBairroTipo = Object.keys(imoveisPorBairro).reduce((acc, bairro) => {
  return acc + Object.values(imoveisPorBairro[bairro]).filter((v) => v).length;
}, 0);

console.log(`✅ Sitemap gerado com ${rotas.length} URLs`);
console.log(`📊 Detalhamento:`);
console.log(`   - Páginas principais: 15`);
console.log(`   - Páginas de bairros: ${bairros.length}`);
console.log(`   - Páginas de tipo + bairro (realistas): ${totalBairroTipo}`);
console.log(`   - Páginas de região: 28`);
console.log(`   - TOTAL: ${rotas.length} páginas`);
console.log(`\n🎯 URLs geradas apenas onde os imóveis realmente existem!`);
