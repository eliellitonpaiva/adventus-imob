// gerar-sitemap.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================================
// COPIE A LISTA DE BAIRROS DO SEU VITE.CONFIG.JS
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

const tipos = [
  "casas",
  "apartamentos",
  "terrenos",
  "pontos-comerciais",
  "sitios",
  "galpoes",
];
const regioes = ["nobre", "central", "novos-loteamentos", "populares"];

// ==============================================
// GERAR TODAS AS ROTAS
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

  // Páginas de bairros
  bairros.forEach((b) => rotas.push(`/imoveis-${b}-acailandia`));

  // Páginas de tipo + bairro
  bairros.forEach((b) => {
    tipos.forEach((t) => rotas.push(`/${t}-${b}-acailandia`));
  });

  // Páginas de região
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
console.log(`✅ Sitemap gerado com ${rotas.length} URLs`);
console.log(`📊 Total: ${rotas.length} páginas`);
