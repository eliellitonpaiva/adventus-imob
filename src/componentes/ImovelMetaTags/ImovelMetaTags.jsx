// src/componentes/ImovelMetaTags/ImovelMetaTags.jsx
import { Helmet } from "react-helmet-async";

function ImovelMetaTags({ imovel, fotos }) {
  if (!imovel) return null;

  // Domínio do seu site
  const siteUrl =
    "https://adventus-imob-vdlz-atcbo9e5z-eliellitonpaivas-projects.vercel.app";

  // ==========================================================================
  // FUNÇÃO PARA GERAR O TÍTULO
  // ==========================================================================
  const gerarTitulo = () => {
    const emoji = imovel.tipo?.toLowerCase().includes("casa") ? "🏠" : "🏢";
    let titulo = `${emoji} ${imovel.tipo || "Imóvel"}`;

    if (imovel.bairro) {
      titulo += ` no ${imovel.bairro}`;
    }

    if (imovel.preco) {
      const preco = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(imovel.preco);
      titulo += ` - ${preco}`;
    }

    return `${titulo} | Adventus Imobiliária`;
  };

  // ==========================================================================
  // FUNÇÃO PARA GERAR A DESCRIÇÃO
  // ==========================================================================
  const gerarDescricao = () => {
    const caracteristicas = [];

    if (imovel.quartos) {
      caracteristicas.push(
        `${imovel.quartos} quarto${imovel.quartos > 1 ? "s" : ""}`,
      );
    }

    if (imovel.suites) {
      caracteristicas.push(
        `${imovel.suites} suíte${imovel.suites > 1 ? "s" : ""}`,
      );
    }

    if (imovel.vagas) {
      caracteristicas.push(
        `${imovel.vagas} vaga${imovel.vagas > 1 ? "s" : ""}`,
      );
    }

    if (imovel.banheiros) {
      caracteristicas.push(
        `${imovel.banheiros} banheiro${imovel.banheiros > 1 ? "s" : ""}`,
      );
    }

    if (imovel.area_construida) {
      caracteristicas.push(`${imovel.area_construida}m² construídos`);
    } else if (imovel.area_util) {
      caracteristicas.push(`${imovel.area_util}m² úteis`);
    }

    let descricao = caracteristicas.join(" • ");
    descricao += ` no ${imovel.bairro || imovel.cidade || "Açailândia"}.`;

    return descricao;
  };

  // ==========================================================================
  // PEGAR A IMAGEM CORRETA (DA TABELA FOTOS_IMOVEL)
  // ==========================================================================
  let imagemUrl = siteUrl + "/img/adventusimobiliaria.png"; // imagem padrão

  if (fotos && fotos.length > 0) {
    console.log("📸 Total de fotos:", fotos.length);
    console.log("📸 Primeira foto crua:", fotos[0]);

    // 1️⃣ Primeiro tenta encontrar uma foto que seja capa
    const fotoCapa = fotos.find((foto) => foto.is_capa === true);

    if (fotoCapa && fotoCapa.url) {
      imagemUrl = fotoCapa.url;
      console.log("✅ Usando foto CAPA:", imagemUrl);
    }
    // 2️⃣ Se não tem capa, usa a primeira foto
    else if (fotos[0] && fotos[0].url) {
      imagemUrl = fotos[0].url;
      console.log("✅ Usando primeira foto:", imagemUrl);
    }
  } else {
    console.log("⚠️ Nenhuma foto encontrada, usando imagem padrão");
  }

  console.log("🖼️ URL final da imagem:", imagemUrl);

  // ==========================================================================
  // RENDERIZAÇÃO DAS TAGS
  // ==========================================================================
  return (
    <Helmet>
      {/* Título da página */}
      <title>{gerarTitulo()}</title>
      <meta name="description" content={gerarDescricao()} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={gerarTitulo()} />
      <meta property="og:description" content={gerarDescricao()} />
      <meta property="og:image" content={imagemUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Adventus Imobiliária" />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={gerarTitulo()} />
      <meta name="twitter:description" content={gerarDescricao()} />
      <meta name="twitter:image" content={imagemUrl} />

      {/* Canonical URL */}
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}

export default ImovelMetaTags;
