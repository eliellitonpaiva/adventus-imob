// src/componentes/ImovelMetaTags/ImovelMetaTags.jsx
import { Helmet } from "react-helmet-async";
import { useEffect } from "react";

function ImovelMetaTags({ imovel, fotos }) {
  if (!imovel) return null;

  const siteUrl = "https://adventus-imob-vdlz.vercel.app";

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
    }

    let descricao = caracteristicas.join(" • ");
    descricao += ` no ${imovel.bairro || "Colinas Park"}, Açailândia.`;

    return descricao;
  };

  // ==========================================================================
  // SELECIONAR A IMAGEM CORRETA
  // ==========================================================================
  let imagemUrl = siteUrl + "/img/adventusimobiliaria.png"; // padrão

  if (fotos && fotos.length > 0) {
    const primeiraFoto = fotos[0];

    if (typeof primeiraFoto === "string") {
      imagemUrl = primeiraFoto;
    } else if (primeiraFoto && primeiraFoto.url) {
      imagemUrl = primeiraFoto.url;
    } else if (primeiraFoto && typeof primeiraFoto === "object") {
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
  }

  // ==========================================================================
  // 🔥 FORÇAR ATUALIZAÇÃO IMEDIATA NO DOM (PARA O FACEBOOK)
  // ==========================================================================
  useEffect(() => {
    if (imovel) {
      console.log("🔥 Forçando atualização das meta tags no DOM...");

      // Atualiza title
      document.title = gerarTitulo();

      // Atualiza meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", gerarDescricao());
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        metaDesc.content = gerarDescricao();
        document.head.appendChild(metaDesc);
      }

      // Atualiza og:title
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute("content", gerarTitulo());
      } else {
        ogTitle = document.createElement("meta");
        ogTitle.setAttribute("property", "og:title");
        ogTitle.content = gerarTitulo();
        document.head.appendChild(ogTitle);
      }

      // Atualiza og:description
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute("content", gerarDescricao());
      } else {
        ogDesc = document.createElement("meta");
        ogDesc.setAttribute("property", "og:description");
        ogDesc.content = gerarDescricao();
        document.head.appendChild(ogDesc);
      }

      // Atualiza og:image
      let ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute("content", imagemUrl);
      } else {
        ogImage = document.createElement("meta");
        ogImage.setAttribute("property", "og:image");
        ogImage.content = imagemUrl;
        document.head.appendChild(ogImage);
      }

      // Atualiza og:image:width
      let ogWidth = document.querySelector('meta[property="og:image:width"]');
      if (!ogWidth) {
        ogWidth = document.createElement("meta");
        ogWidth.setAttribute("property", "og:image:width");
        ogWidth.content = "1200";
        document.head.appendChild(ogWidth);
      }

      // Atualiza og:image:height
      let ogHeight = document.querySelector('meta[property="og:image:height"]');
      if (!ogHeight) {
        ogHeight = document.createElement("meta");
        ogHeight.setAttribute("property", "og:image:height");
        ogHeight.content = "630";
        document.head.appendChild(ogHeight);
      }

      // Atualiza og:url
      let ogUrl = document.querySelector('meta[property="og:url"]');
      if (!ogUrl) {
        ogUrl = document.createElement("meta");
        ogUrl.setAttribute("property", "og:url");
        ogUrl.content = window.location.href;
        document.head.appendChild(ogUrl);
      }

      console.log("✅ Meta tags atualizadas manualmente!");
    }
  }, [imovel, fotos]);

  // ==========================================================================
  // RENDERIZAÇÃO DO HELMET (BACKUP)
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
