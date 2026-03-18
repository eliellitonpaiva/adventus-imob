// src/componentes/ImovelMetaTags/ImovelMetaTags.jsx
import { Helmet } from "react-helmet-async";

function ImovelMetaTags({ imovel, fotos }) {
  if (!imovel) return null;

  const siteUrl =
    "https://adventus-imob-vdlz-atcbo9e5z-eliellitonpaivas-projects.vercel.app";

  // ==========================================================================
  // FUNÇÃO PARA GERAR O TÍTULO (igual)
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
  // FUNÇÃO PARA GERAR A DESCRIÇÃO (igual)
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
    }

    let descricao = caracteristicas.join(" • ");
    descricao += ` no ${imovel.bairro || "Colinas Park"}, Açailândia.`;

    return descricao;
  };

  // ==========================================================================
  // 🔥 CORREÇÃO: PEGAR A IMAGEM CORRETAMENTE
  // ==========================================================================
  let imagemUrl = siteUrl + "/img/adventusimobiliaria.png"; // padrão

  console.log("📸 Verificando fotos:", fotos);

  if (fotos && fotos.length > 0) {
    // A foto já vem como string direta? Ou como objeto?
    const primeiraFoto = fotos[0];
    console.log("🔍 Tipo da primeira foto:", typeof primeiraFoto);
    console.log("🔍 Conteúdo:", primeiraFoto);

    // Se for string (URL direta)
    if (typeof primeiraFoto === "string") {
      imagemUrl = primeiraFoto;
    }
    // Se for objeto com propriedade url
    else if (primeiraFoto && primeiraFoto.url) {
      imagemUrl = primeiraFoto.url;
    }
    // Se for objeto e a URL estiver em outro campo
    else if (primeiraFoto && typeof primeiraFoto === "object") {
      // Tenta encontrar qualquer campo que pareça uma URL
      const possiveisCampos = [
        "url",
        "imagem",
        "foto",
        "caminho",
        "path",
        "src",
      ];
      for (const campo of possiveisCampos) {
        if (
          primeiraFoto[campo] &&
          typeof primeiraFoto[campo] === "string" &&
          primeiraFoto[campo].startsWith("http")
        ) {
          imagemUrl = primeiraFoto[campo];
          break;
        }
      }
    }

    console.log("✅ URL da imagem selecionada:", imagemUrl);
  } else {
    console.log("⚠️ Nenhuma foto encontrada, usando imagem padrão");
  }

  // ==========================================================================
  // RENDERIZAÇÃO
  // ==========================================================================
  return (
    <Helmet>
      <title>{gerarTitulo()}</title>
      <meta name="description" content={gerarDescricao()} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={gerarTitulo()} />
      <meta property="og:description" content={gerarDescricao()} />
      <meta property="og:image" content={imagemUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:site_name" content="Adventus Imobiliária" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={gerarTitulo()} />
      <meta name="twitter:description" content={gerarDescricao()} />
      <meta name="twitter:image" content={imagemUrl} />

      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
}

export default ImovelMetaTags;
