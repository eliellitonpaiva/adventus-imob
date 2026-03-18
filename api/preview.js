// api/preview.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  // Pega a URL da query string
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("URL não fornecida");
  }

  try {
    // Extrai slug e código da URL
    const urlParts = new URL(url);
    const pathParts = urlParts.pathname.split("/");
    const slug = pathParts[2];
    const codigo = pathParts[3];

    // Conecta no Supabase
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY,
    );

    // Busca o imóvel
    const { data: imovel } = await supabase
      .from("imoveis")
      .select(
        `
        *,
        fotos_imovel (*)
      `,
      )
      .eq("slug", slug)
      .eq("codigo", codigo)
      .single();

    if (!imovel) {
      return res.status(404).send("Imóvel não encontrado");
    }

    // Busca as finalidades
    const { data: finalidades } = await supabase
      .from("imovel_finalidades")
      .select("tipo, preco")
      .eq("imovel_id", imovel.id)
      .eq("status", "ativo");

    const precoVenda = finalidades?.find((f) => f.tipo === "venda")?.preco;
    const precoAluguel = finalidades?.find((f) => f.tipo === "aluguel")?.preco;

    // Formata o preço
    const formatarPreco = (valor) => {
      if (!valor) return null;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
      }).format(valor);
    };

    // Pega a primeira foto
    const fotoPrincipal =
      imovel.fotos_imovel?.[0]?.url ||
      "https://adventus-imob-vdlz.vercel.app/img/adventusimobiliaria.png";

    // Gera o título e descrição
    const titulo = `🏠 ${imovel.tipo} no ${imovel.bairro}`;
    const preco = precoVenda
      ? formatarPreco(precoVenda)
      : precoAluguel
        ? `${formatarPreco(precoAluguel)}/mês`
        : "Preço sob consulta";
    const tituloCompleto = `${titulo} - ${preco} | Adventus Imobiliária`;

    const caracteristicas = [];
    if (imovel.quartos)
      caracteristicas.push(
        `${imovel.quartos} quarto${imovel.quartos > 1 ? "s" : ""}`,
      );
    if (imovel.suites)
      caracteristicas.push(
        `${imovel.suites} suíte${imovel.suites > 1 ? "s" : ""}`,
      );
    if (imovel.vagas)
      caracteristicas.push(
        `${imovel.vagas} vaga${imovel.vagas > 1 ? "s" : ""}`,
      );
    if (imovel.area_construida)
      caracteristicas.push(`${imovel.area_construida}m²`);

    const descricao =
      caracteristicas.join(" • ") + ` no ${imovel.bairro}, Açailândia.`;

    // Gera o HTML com as meta tags
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Meta tags básicas -->
  <title>${tituloCompleto}</title>
  <meta name="description" content="${descricao}">
  
  <!-- Open Graph / Facebook / WhatsApp -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${tituloCompleto}">
  <meta property="og:description" content="${descricao}">
  <meta property="og:image" content="${fotoPrincipal}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:site_name" content="Adventus Imobiliária">
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${tituloCompleto}">
  <meta name="twitter:description" content="${descricao}">
  <meta name="twitter:image" content="${fotoPrincipal}">
  
  <!-- Redirecionamento rápido (o WhatsApp não executa, mas não atrapalha) -->
  <meta http-equiv="refresh" content="0; url=${url}">
</head>
<body>
  <p>Carregando...</p>
</body>
</html>`;

    // Configura cabeçalhos para evitar cache
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.status(200).send(html);
  } catch (error) {
    console.error("Erro na preview:", error);
    res.status(500).send("Erro ao gerar preview");
  }
}
