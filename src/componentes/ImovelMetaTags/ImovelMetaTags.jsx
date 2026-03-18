// E:\DEV\react\adventus-imob\src\componentes\ImovelMetaTags\ImovelMetaTags.jsx
import { Helmet } from "react-helmet-async";

function ImovelMetaTags({ imovel }) {
  if (!imovel) return null;

  // Domínio do seu site
  const siteUrl =
    "https://adventus-imob-vdlz-hm8o07h0w-eliellitonpaivas-projects.vercel.app";

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

  const gerarDescricao = () => {
    const caracteristicas = [];

    if (imovel.dormitorios) {
      caracteristicas.push(
        `${imovel.dormitorios} quarto${imovel.dormitorios > 1 ? "s" : ""}`,
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
    descricao += ` no ${imovel.bairro || imovel.cidade || "Açailândia"}.`;

    return descricao;
  };

  // URL da imagem
  const imagemUrl = imovel.imagem_principal
    ? imovel.imagem_principal.startsWith("http")
      ? imovel.imagem_principal
      : `${siteUrl}${imovel.imagem_principal}`
    : `${siteUrl}/img/adventusimobiliaria.png`;

  // URL do imóvel
  const urlImovel = `${siteUrl}/imovel/${imovel.slug || imovel.id}/${imovel.codigo || ""}`;

  return (
    <Helmet>
      <title>{gerarTitulo()}</title>
      <meta name="description" content={gerarDescricao()} />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={urlImovel} />
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

      <link rel="canonical" href={urlImovel} />
    </Helmet>
  );
}

export default ImovelMetaTags;
