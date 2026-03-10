import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
// CONFIGURAÇÃO PRINCIPAL DO VITE (SEM SITEMAP!)
// ==============================================
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
