// ============================================================================
// DETALHE DO IMÓVEL - VERSÃO FINAL COM CARROSSEL EM TELA CHEIA
// E PROTEÇÃO CONTRA ENVIOS DUPLICADOS
// ============================================================================
// Arquivo: src/pages/DetalheImovel.jsx
// ============================================================================

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import { visitasService } from "../lib/visitasService";
import { useNotifications } from "../contexts/NotificationContext";
import ImovelMetaTags from "../componentes/ImovelMetaTags/ImovelMetaTags.jsx";

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const DetalheImovel = () => {
  // 🔥 AGORA RECEBE SLUG E CÓDIGO DA URL
  const { slug, codigo } = useParams();
  const navigate = useNavigate();
  const { incrementarContador } = useNotifications();

  // ==========================================================================
  // ESTADOS DO COMPONENTE
  // ==========================================================================
  const [imovel, setImovel] = useState(null);
  const [finalidades, setFinalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visualizacoes, setVisualizacoes] = useState(0);
  const [seoAplicado, setSeoAplicado] = useState(false);

  // =============== NOVO ESTADO PARA FOTOS ===============
  const [fotos, setFotos] = useState([]);

  // Estados do carrossel e modal
  const [imagemAtual, setImagemAtual] = useState(0);
  const [modalAberto, setModalAberto] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    mensagem: "",
    horarioPreferencia: "",
    diaSemana: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // ==========================================================================
  // NOVOS ESTADOS PARA PROTEÇÃO CONTRA DUPLICIDADE
  // ==========================================================================
  const [ultimoEnvio, setUltimoEnvio] = useState(null);
  const [mostrarAvisoDuplicado, setMostrarAvisoDuplicado] = useState(false);
  const [dadosDuplicados, setDadosDuplicados] = useState(null);

  // Estado para controle dos acordeões
  const [acordeoesAbertos, setAcordeoesAbertos] = useState({});

  // Refs
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const seoAplicadoRef = useRef(false);

  // Constantes
  const whatsappNumber = "5599988087867";

  // ==========================================================================
  // FUNÇÕES DE RASTREAMENTO
  // ==========================================================================

  const registrarVisualizacao = useCallback(async (imovelId) => {
    try {
      const { data: existingStats, error: selectError } = await supabase
        .from("imovel_estatisticas")
        .select("visualizacoes")
        .eq("imovel_id", imovelId)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingStats) {
        const { error: updateError } = await supabase
          .from("imovel_estatisticas")
          .update({
            visualizacoes: (existingStats.visualizacoes || 0) + 1,
            updated_at: new Date(),
          })
          .eq("imovel_id", imovelId);

        if (updateError) throw updateError;
        setVisualizacoes((existingStats.visualizacoes || 0) + 1);
      } else {
        const { error: insertError } = await supabase
          .from("imovel_estatisticas")
          .insert({
            imovel_id: imovelId,
            visualizacoes: 1,
            cliques_whatsapp: 0,
            solicitacoes_visita: 0,
            interessados_ativos: 0,
            engajamento: 0,
            created_at: new Date(),
            updated_at: new Date(),
          });

        if (insertError) throw insertError;
        setVisualizacoes(1);
      }
    } catch (error) {
      console.error("❌ Erro ao registrar visualização:", error);
    }
  }, []);

  const buscarVisualizacoes = useCallback(async (imovelId) => {
    try {
      const { data, error } = await supabase
        .from("imovel_estatisticas")
        .select("visualizacoes")
        .eq("imovel_id", imovelId)
        .maybeSingle();

      if (error) throw error;
      setVisualizacoes(data?.visualizacoes || 0);
    } catch (error) {
      console.error("❌ Erro ao buscar visualizações:", error);
      setVisualizacoes(0);
    }
  }, []);

  const registrarCliqueWhatsApp = useCallback(async (imovelId) => {
    try {
      const { data: existingStats, error: selectError } = await supabase
        .from("imovel_estatisticas")
        .select("cliques_whatsapp")
        .eq("imovel_id", imovelId)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingStats) {
        const { error: updateError } = await supabase
          .from("imovel_estatisticas")
          .update({
            cliques_whatsapp: (existingStats.cliques_whatsapp || 0) + 1,
            updated_at: new Date(),
          })
          .eq("imovel_id", imovelId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("imovel_estatisticas")
          .insert({
            imovel_id: imovelId,
            visualizacoes: 0,
            cliques_whatsapp: 1,
            solicitacoes_visita: 0,
            interessados_ativos: 0,
            engajamento: 0,
            created_at: new Date(),
            updated_at: new Date(),
          });

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error("❌ Erro ao registrar clique WhatsApp:", error);
    }
  }, []);

  const registrarSolicitacaoVisita = useCallback(
    async (imovelId, dadosVisita, visitaId) => {
      try {
        const { data: existingStats, error: selectError } = await supabase
          .from("imovel_estatisticas")
          .select("solicitacoes_visita, interessados_ativos")
          .eq("imovel_id", imovelId)
          .maybeSingle();

        if (selectError) throw selectError;

        if (existingStats) {
          const { error: updateError } = await supabase
            .from("imovel_estatisticas")
            .update({
              solicitacoes_visita: (existingStats.solicitacoes_visita || 0) + 1,
              interessados_ativos: (existingStats.interessados_ativos || 0) + 1,
              updated_at: new Date(),
            })
            .eq("imovel_id", imovelId);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from("imovel_estatisticas")
            .insert({
              imovel_id: imovelId,
              visualizacoes: 0,
              cliques_whatsapp: 0,
              solicitacoes_visita: 1,
              interessados_ativos: 1,
              engajamento: 0,
              created_at: new Date(),
              updated_at: new Date(),
            });

          if (insertError) throw insertError;
        }

        const { error: interessadoError } = await supabase
          .from("interessados_ativos")
          .insert({
            imovel_id: imovelId,
            nome: dadosVisita.nome,
            email: dadosVisita.email,
            telefone: dadosVisita.telefone,
            solicitacao_visita_id: visitaId,
            tipo_interesse: "visita_agendada",
            status: "aguardando_contato",
            data_interesse: new Date(),
          });

        if (interessadoError) throw interessadoError;
      } catch (error) {
        console.error("❌ Erro ao registrar solicitação de visita:", error);
      }
    },
    [],
  );

  // ==========================================================================
  // FUNÇÕES PARA DESLIZE NO MOBILE
  // ==========================================================================
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const diffX = touchStartX.current - touchEndX.current;
    const sensibilidade = 50;

    if (Math.abs(diffX) > sensibilidade) {
      if (diffX > 0) {
        mudarImagem(1);
      } else {
        mudarImagem(-1);
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // ==========================================================================
  // FUNÇÃO PARA CARREGAR FOTOS DO IMÓVEL
  // ==========================================================================
  const carregarFotos = useCallback(async (imovelId) => {
    try {
      const { data, error } = await supabase
        .from("fotos_imovel")
        .select("*")
        .eq("imovel_id", imovelId)
        .order("ordem", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const fotosUrls = data.map((foto) => foto.url);
        setFotos(fotosUrls);
        console.log(
          `✅ ${fotosUrls.length} fotos carregadas para o imóvel ${imovelId}`,
        );
      } else {
        setFotos([
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&h=800&q=80",
        ]);
      }
    } catch (error) {
      console.error("❌ Erro ao carregar fotos:", error);
      setFotos([
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&h=800&q=80",
      ]);
    }
  }, []);

  // ==========================================================================
  // FUNÇÕES DE FORMATAÇÃO
  // ==========================================================================

  const formatPrice = useCallback((price) => {
    if (!price || price === "0" || price === "0.00")
      return "Preço sob consulta";

    let valorNumerico;
    if (typeof price === "string") {
      const stringLimpa = price
        .replace(/[^\d,.-]/g, "")
        .replace(".", "")
        .replace(",", ".");
      valorNumerico = parseFloat(stringLimpa);
    } else {
      valorNumerico = Number(price);
    }

    if (isNaN(valorNumerico) || !isFinite(valorNumerico))
      return "Preço sob consulta";

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valorNumerico);
  }, []);

  const calcularDesconto = (anterior, atual) => {
    if (!anterior || !atual || anterior <= 0 || atual <= 0) return 0;
    const desconto = ((anterior - atual) / anterior) * 100;
    return Math.round(desconto);
  };

  // 🔥 NOVA FUNÇÃO: determinar finalidade baseada nas finalidades carregadas
  const formatarFinalidade = useCallback(() => {
    const temVenda = finalidades.some((f) => f.tipo === "venda");
    const temAluguel = finalidades.some((f) => f.tipo === "aluguel");

    if (temVenda && temAluguel) return "Venda e Aluguel";
    if (temVenda) return "Venda";
    if (temAluguel) return "Aluguel";
    return "Venda";
  }, [finalidades]);

  // 🔥 NOVA FUNÇÃO: obter preço de venda
  const getPrecoVenda = useCallback(() => {
    const venda = finalidades.find((f) => f.tipo === "venda");
    return venda?.preco || null;
  }, [finalidades]);

  // 🔥 NOVA FUNÇÃO: obter preço de aluguel
  const getPrecoAluguel = useCallback(() => {
    const aluguel = finalidades.find((f) => f.tipo === "aluguel");
    return aluguel?.preco || null;
  }, [finalidades]);

  const gerarTituloSEO = useCallback((dados) => {
    if (!dados) return "Imóvel em Açailândia – Adventus Imóveis";

    const partes = [];

    let tipoParte = dados.tipo || "Imóvel";
    if (dados.quartos > 0) {
      tipoParte += ` com ${dados.quartos} ${dados.quartos === 1 ? "dormitório" : "dormitórios"}`;
    }
    partes.push(tipoParte);

    const caracteristicas = [];

    if (dados.suites > 0) {
      caracteristicas.push(
        `${dados.suites} ${dados.suites === 1 ? "suíte" : "suítes"}`,
      );
    }

    if (dados.vagas > 0) {
      caracteristicas.push(
        `${dados.vagas} ${dados.vagas === 1 ? "vaga" : "vagas"}`,
      );
    }

    if (dados.areaConstruida > 0) {
      caracteristicas.push(`${dados.areaConstruida}m²`);
    } else if (dados.areaTotal > 0) {
      caracteristicas.push(`${dados.areaTotal}m²`);
    }

    if (caracteristicas.length > 0) {
      partes.push(`, ${caracteristicas.join(", ")}`);
    } else {
      partes.push(`,`);
    }

    const localizacao = [];
    if (dados.bairro) localizacao.push(dados.bairro);
    if (dados.cidade) {
      const cidadeUF = dados.estado
        ? `${dados.cidade}/${dados.estado}`
        : dados.cidade;
      localizacao.push(cidadeUF);
    }

    if (localizacao.length > 0) {
      partes.push(` – ${localizacao.join(" – ")}`);
    }

    return partes.join(" ");
  }, []);

  const gerarSlugSEO = useCallback(
    (dados) => {
      if (!dados) return "imovel";

      const partes = [];

      if (dados.tipo) partes.push(dados.tipo.toLowerCase());
      if (dados.quartos > 0) partes.push(`${dados.quartos}-dormitorios`);

      // 🔥 Usar finalidades carregadas
      const temVenda = finalidades.some((f) => f.tipo === "venda");
      const temAluguel = finalidades.some((f) => f.tipo === "aluguel");

      if (temVenda && !temAluguel) {
        partes.push("venda");
      } else if (temAluguel && !temVenda) {
        partes.push("aluguel");
      } else if (temVenda && temAluguel) {
        partes.push("venda-aluguel");
      }

      if (dados.bairro)
        partes.push(dados.bairro.toLowerCase().replace(/\s+/g, "-"));
      if (dados.cidade)
        partes.push(dados.cidade.toLowerCase().replace(/\s+/g, "-"));
      if (dados.estado) partes.push(dados.estado.toLowerCase());

      return partes.join("-");
    },
    [finalidades],
  );

  const gerarMetaDescription = useCallback(
    (dados) => {
      if (!dados)
        return "Imóveis em Açailândia e região. Compre ou alugue com a Adventus Imóveis.";

      const descricao = [];
      descricao.push(
        `${dados.tipo || "Imóvel"} com ${dados.quartos || 0} ${dados.quartos === 1 ? "quarto" : "quartos"}`,
      );

      if (dados.suites > 0) {
        descricao.push(
          `${dados.suites} ${dados.suites === 1 ? "suíte" : "suítes"}`,
        );
      }

      if (dados.areaConstruida > 0) {
        descricao.push(`${dados.areaConstruida}m²`);
      }

      const localParts = [];
      if (dados.bairro) localParts.push(dados.bairro);
      if (dados.cidade) localParts.push(dados.cidade);
      if (dados.estado) localParts.push(dados.estado);

      descricao.push(`no ${localParts.join(" - ")}`);

      // 🔥 Usar preços das finalidades
      const precoVenda = getPrecoVenda();
      const precoAluguel = getPrecoAluguel();
      const temVenda = finalidades.some((f) => f.tipo === "venda");
      const temAluguel = finalidades.some((f) => f.tipo === "aluguel");

      if (temVenda) {
        descricao.push(
          `à venda por ${precoVenda ? formatPrice(precoVenda) : "valor sob consulta"}`,
        );
      } else if (temAluguel) {
        descricao.push(
          `para alugar por ${precoAluguel ? formatPrice(precoAluguel) : "valor sob consulta"}/mês`,
        );
      }

      const baseDesc = descricao.join(" ");
      return `${baseDesc}. Agende sua visita com a Adventus Imóveis!`.slice(
        0,
        155,
      );
    },
    [finalidades, getPrecoVenda, getPrecoAluguel, formatPrice],
  );

  const gerarAltImagem = useCallback((dados, index = 0) => {
    if (!dados) return "Imóvel em Açailândia - Adventus Imóveis";

    const tipos = [
      "Fachada",
      "Sala",
      "Cozinha",
      "Quarto",
      "Banheiro",
      "Área externa",
      "Vista",
      "Detalhe",
      "Detalhe",
      "Detalhe",
    ];
    const tipo = index < tipos.length ? tipos[index] : "Detalhe";

    return `${tipo} do ${dados.tipo || "imóvel"} com ${dados.quartos || 0} quartos no ${dados.bairro || ""} em ${dados.cidade || "Açailândia"} - Adventus Imóveis`;
  }, []);

  // ==========================================================================
  // FUNÇÃO DE SEO - MANIPULAÇÃO DIRETA DO DOM
  // ==========================================================================
  const atualizarTagsSEO = useCallback((dados) => {
    if (!dados || seoAplicadoRef.current) return;

    document.title = `${dados.tituloSEO} | Adventus Imóveis`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", dados.metaDescription);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.setAttribute(
      "href",
      `https://adventusimobiliaria.com.br/imovel/${dados.slugSEO}`,
    );

    const ogTags = {
      "og:title": dados.tituloSEO,
      "og:description": dados.metaDescription,
      "og:image": dados.imagens[0],
      "og:url": `https://adventusimobiliaria.com.br/imovel/${dados.slugSEO}`,
      "og:type": "product",
      "og:site_name": "Adventus Imóveis",
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("property", property);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    const twitterTags = {
      "twitter:card": "summary_large_image",
      "twitter:title": dados.tituloSEO,
      "twitter:description": dados.metaDescription,
      "twitter:image": dados.imagens[0],
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    });

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: dados.tituloSEO,
      description: dados.metaDescription,
      image: dados.imagens[0],
      offers: {
        "@type": "Offer",
        price: dados.preco || dados.precoAluguel,
        priceCurrency: "BRL",
        availability:
          dados.status === "Disponível"
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
        url: `https://adventusimobiliaria.com.br/imovel/${dados.slugSEO}`,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: dados.cidade,
        addressRegion: dados.estado,
        addressCountry: "BR",
      },
    };

    let schemaTag = document.querySelector(
      'script[type="application/ld+json"]',
    );
    if (!schemaTag) {
      schemaTag = document.createElement("script");
      schemaTag.type = "application/ld+json";
      document.head.appendChild(schemaTag);
    }
    schemaTag.textContent = JSON.stringify(schema);

    seoAplicadoRef.current = true;
    setSeoAplicado(true);
  }, []);

  // ==========================================================================
  // FUNÇÃO DE EXTRAÇÃO DE DADOS (ATUALIZADA)
  // ==========================================================================
  const getImovelData = useCallback(() => {
    if (!imovel) return null;

    const caracteristicas = imovel.caracteristicas || {};
    const acabamentos = imovel.acabamentos || {};
    const areaLazer = imovel.area_lazer || {};
    const localizacaoVizinhanca = imovel.localizacao_vizinhanca || {};
    const seguranca = imovel.seguranca || imovel.seguranca_utilidades || {};
    const armariosArmazenamento = imovel.armarios_armazenamento || {};
    const servicosUtilidades = imovel.servicos_utilidades || {};
    const diferenciais = imovel.diferenciais || {};
    const etiquetas = imovel.etiquetas || {};

    // 🔥 Obter preços das finalidades
    const precoVenda = getPrecoVenda();
    const precoAluguel = getPrecoAluguel();
    const temVenda = finalidades.some((f) => f.tipo === "venda");
    const temAluguel = finalidades.some((f) => f.tipo === "aluguel");

    let financiavel = false;

    // Prioridade 1: Campo financiado
    if (imovel.financiado !== undefined && imovel.financiado !== null) {
      if (typeof imovel.financiado === "boolean") {
        financiavel = imovel.financiado;
      } else if (typeof imovel.financiado === "string") {
        financiavel = ["true", "sim", "1", "on"].includes(
          imovel.financiado.toLowerCase(),
        );
      } else if (typeof imovel.financiado === "number") {
        financiavel = imovel.financiado === 1;
      }
    }

    if (!financiavel && imovel.etiquetas?.financiavel !== undefined) {
      if (typeof imovel.etiquetas.financiavel === "boolean") {
        financiavel = imovel.etiquetas.financiavel;
      }
    }

    if (!financiavel && caracteristicas.financiavel !== undefined) {
      if (typeof caracteristicas.financiavel === "boolean") {
        financiavel = caracteristicas.financiavel;
      }
    }

    const dados = {
      id: imovel.id,
      slug: imovel.slug,
      codigo: imovel.codigo || "Sem código",
      titulo: imovel.titulo || "Imóvel em Açailândia",
      // 🔥 Usar preços das finalidades
      preco: precoVenda,
      precoFormatado: formatPrice(precoVenda),
      etiquetas: imovel.etiquetas || {},
      precoAnterior: imovel.preco_anterior,
      precoAnteriorFormatado: formatPrice(imovel.preco_anterior),
      precoAluguel: precoAluguel,
      precoAluguelFormatado: formatPrice(precoAluguel),
      finalidade: formatarFinalidade(),
      status: imovel.status,
      tipo: imovel.tipo,
      // 🔥 Usar finalidades carregadas
      finalidade_venda: temVenda,
      finalidade_aluguel: temAluguel,
      empreendimento: imovel.edificios || null,
      endereco: imovel.endereco || "",
      numero: imovel.numero || "",
      complemento: imovel.complemento || "",
      bairro: imovel.bairro || "",
      cidade: imovel.cidade || "Açailândia",
      estado: imovel.estado || "MA",
      exibir_endereco_site: imovel.exibir_endereco_site || false,
      localizacaoCompleta: `${imovel.bairro || ""}, ${imovel.cidade || "Açailândia"}${imovel.estado ? ` - ${imovel.estado}` : ""}`,
      enderecoCompleto: `${imovel.endereco || ""}${imovel.numero ? `, ${imovel.numero}` : ""}${imovel.complemento ? ` - ${imovel.complemento}` : ""}`,

      // 🔥 CORREÇÃO: Usar os campos diretos do imóvel
      quartos: imovel.quartos || 0,
      suites: imovel.suites || 0,
      banheiros: imovel.banheiros || 0,
      vagas: imovel.vagas || 0,
      areaTotal: imovel.area_total || 0,
      areaConstruida: imovel.area_construida || 0,

      // 🔥 ADICIONAR ESTAS LINHAS AQUI
      destaque_semana: etiquetas.destaque_semana || false,
      novo_site: etiquetas.novo_site || false,
      baixou_preco: etiquetas.baixou_preco || false,
      financiavelEtiqueta: etiquetas.financiavel || false,

      destaqueSemana: etiquetas.destaqueSemana || false,
      financiavel: financiavel,
      emCondominio: imovel.em_condominio || false,
      ocultarPreco: imovel.ocultar_preco || false,
      caracteristicas,
      acabamentos,
      areaLazer,
      localizacaoVizinhanca,
      seguranca,
      armariosArmazenamento,
      servicosUtilidades,
      diferenciais,
      imagens:
        fotos.length > 0
          ? fotos
          : [
              "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&h=800&q=80",
            ],
    };

    dados.tituloSEO = gerarTituloSEO(dados);
    dados.slugSEO = gerarSlugSEO(dados);
    dados.metaDescription = gerarMetaDescription(dados);

    return dados;
  }, [
    imovel,
    fotos,
    finalidades,
    formatPrice,
    formatarFinalidade,
    gerarTituloSEO,
    gerarSlugSEO,
    gerarMetaDescription,
    getPrecoVenda,
    getPrecoAluguel,
  ]);

  // ==========================================================================
  // FUNÇÃO PARA GERAR OS ACORDEÕES
  // ==========================================================================
  const gerarDadosAcordeao = useCallback(
    (dados) => {
      if (!dados || !imovel) return [];

      const acordeoes = [];

      /// ===== 1. CARACTERÍSTICAS DO IMÓVEL =====
      const itensCaracteristicas = [];
      const caracteristicas = dados.caracteristicas || {};
      const dependencias = dados.dependencias || {};

      if (caracteristicas.frenteTerreno) {
        itensCaracteristicas.push(
          `Frente do terreno: ${caracteristicas.frenteTerreno}`,
        );
      }
      if (caracteristicas.fundo) {
        itensCaracteristicas.push(`Fundo: ${caracteristicas.fundo}`);
      }
      if (caracteristicas.lateralEsquerda) {
        itensCaracteristicas.push(
          `Lateral esquerda: ${caracteristicas.lateralEsquerda}`,
        );
      }
      if (caracteristicas.lateralDireita) {
        itensCaracteristicas.push(
          `Lateral direita: ${caracteristicas.lateralDireita}`,
        );
      }
      if (caracteristicas.peDireito) {
        itensCaracteristicas.push(`Pé direito: ${caracteristicas.peDireito}`);
      }
      if (caracteristicas.topografia) {
        itensCaracteristicas.push(`Topografia: ${caracteristicas.topografia}`);
      }
      if (caracteristicas.esquinaInfo) {
        itensCaracteristicas.push(`Esquina: Sim`);
      }
      if (caracteristicas.tipoConstrucao) {
        itensCaracteristicas.push(
          `Tipo de construção: ${caracteristicas.tipoConstrucao}`,
        );
      }
      if (caracteristicas.anoConstrucao) {
        itensCaracteristicas.push(
          `Ano de construção: ${caracteristicas.anoConstrucao}`,
        );
      }
      if (caracteristicas.reformadoRecentemente) {
        itensCaracteristicas.push(`Reformado recentemente`);
      }
      if (caracteristicas.imovelAverbado) {
        itensCaracteristicas.push(`Imóvel averbado`);
      }
      if (caracteristicas.aceitaPermuta) {
        itensCaracteristicas.push(`Aceita permuta`);
      }
      if (caracteristicas.tipoIluminacao) {
        itensCaracteristicas.push(
          `Iluminação: ${caracteristicas.tipoIluminacao}`,
        );
      }
      if (caracteristicas.tipoTelhado) {
        itensCaracteristicas.push(`Telhado: ${caracteristicas.tipoTelhado}`);
      }
      if (caracteristicas.caixaDAgua) {
        itensCaracteristicas.push(
          `Caixa d'água: ${caracteristicas.caixaDAgua} litros`,
        );
      }
      if (caracteristicas.sistemaEsgoto) {
        const labelsEsgoto = {
          rede_publica: "Rede Pública",
          fossa_septica: "Fossa Séptica",
          fossa_filtro: "Fossa e Filtro",
          sumidouro: "Sumidouro",
          fossa_ecologica: "Fossa Ecológica/Biodigestor",
          inexistente: "Inexistente",
        };
        itensCaracteristicas.push(
          `Sistema de esgoto: ${labelsEsgoto[caracteristicas.sistemaEsgoto] || caracteristicas.sistemaEsgoto}`,
        );
      }
      if (caracteristicas.aquecimentoAgua) {
        const labelsAquecimento = {
          gas: "Gás",
          solar: "Solar",
          eletrico: "Elétrico",
          central: "Central",
          lenha: "Lenha",
        };
        itensCaracteristicas.push(
          `Aquecimento de água: ${labelsAquecimento[caracteristicas.aquecimentoAgua] || caracteristicas.aquecimentoAgua}`,
        );
      }

      if (itensCaracteristicas.length > 0) {
        acordeoes.push({
          titulo: "Características do Imóvel",
          icone: "fas fa-home",
          itens: itensCaracteristicas,
        });
      }

      // ===== 2. ACABAMENTOS =====
      const itensAcabamentos = [];
      const acabamentos = dados.acabamentos || {};

      const labelsAcabamentos = {
        pisoPorcelanato: "Piso porcelanato",
        pisoCeramica: "Piso cerâmica",
        pisoLaminado: "Piso laminado",
        pisoMadeira: "Piso de madeira",
        revestimentoAzulejo: "Revestimento em azulejo",
        revestimentoPastilha: "Revestimento em pastilha",
        revestimentoPedra: "Revestimento em pedra",
        tetoGessoRebaixado: "Teto em gesso rebaixado",
        tetoForroMadeira: "Forro de madeira",
        bancadaGranito: "Bancada de granito",
        bancadaMarmore: "Bancada de mármore",
        bancadaQuartzo: "Bancada de quartzo",
        armariosPlanejados: "Armários planejados",
        pinturaAcoramento: "Pintura acrílica",
        esquadriasAluminio: "Esquadrias de alumínio",
        vidrosTemperados: "Vidros temperados",
      };

      Object.entries(acabamentos)
        .filter(([_, value]) => value === true)
        .forEach(([key]) => {
          itensAcabamentos.push(
            labelsAcabamentos[key] ||
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
          );
        });

      if (itensAcabamentos.length > 0) {
        acordeoes.push({
          titulo: "Acabamentos",
          icone: "fas fa-paint-roller",
          itens: itensAcabamentos,
        });
      }

      // ===== 3. ÁREA DE LAZER =====
      const itensAreaLazer = [];
      const areaLazer = dados.areaLazer || {};

      const labelsAreaLazer = {
        piscina: "Piscina",
        churrasqueira: "Churrasqueira",
        fornoPizza: "Forno a lenha",
        espacoGourmet: "Espaço gourmet",
        salaoFestas: "Salão de festas",
        academia: "Academia",
        playground: "Playground",
        quadraPoliesportiva: "Quadra poliesportiva",
        quadraTenis: "Quadra de tênis",
        campoFutebol: "Campo de futebol",
        sauna: "Sauna",
        espacoKids: "Espaço kids",
        jardim: "Jardim",
        horta: "Horta",
        pomar: "Pomar",
      };

      Object.entries(areaLazer)
        .filter(([_, value]) => value === true)
        .forEach(([key]) => {
          itensAreaLazer.push(
            labelsAreaLazer[key] ||
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
          );
        });

      if (itensAreaLazer.length > 0) {
        acordeoes.push({
          titulo: "Área de Lazer",
          icone: "fas fa-swimming-pool",
          itens: itensAreaLazer,
        });
      }

      // ===== 4. LOCALIZAÇÃO E VIZINHANÇA =====
      const itensLocalizacao = [];
      const localizacao = dados.localizacaoVizinhanca || {};

      const labelsLocalizacao = {
        proximoCentro: "Próximo ao centro",
        proximoSupermercado: "Próximo a supermercado",
        proximoEscola: "Próximo a escola",
        proximoHospital: "Próximo a hospital",
        proximoFarmacia: "Próximo a farmácia",
        proximoBanco: "Próximo a banco",
        proximoTransporte: "Próximo a transporte público",
        bairroResidencial: "Bairro residencial",
        bairroComercial: "Bairro comercial",
        ruaAsfaltada: "Rua asfaltada",
        ruaArborizada: "Rua arborizada",
        vistaPanoramica: "Vista panorâmica",
        regiaoValorizada: "Região valorizada",
      };

      Object.entries(localizacao)
        .filter(([_, value]) => value === true)
        .forEach(([key]) => {
          itensLocalizacao.push(
            labelsLocalizacao[key] ||
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
          );
        });

      if (itensLocalizacao.length > 0) {
        acordeoes.push({
          titulo: "Localização & Vizinhança",
          icone: "fas fa-map-marker-alt",
          itens: itensLocalizacao,
        });
      }

      // ===== 5. SEGURANÇA =====
      const itensSeguranca = [];
      const seguranca = dados.seguranca || {};

      const labelsSeguranca = {
        portaoEletronico: "Portão eletrônico",
        interfone: "Interfone",
        cercaEletrica: "Cerca elétrica",
        sistemaCameras: "Sistema de câmeras",
        alarme: "Alarme",
        portaria24h: "Portaria 24h",
        vigilanciaNoturna: "Vigilância noturna",
        circuitoFechado: "Circuito fechado",
        sensoresMovimento: "Sensores de movimento",
        gradeProtecao: "Grade de proteção",
        condominioFechado: "Condomínio fechado",
      };

      Object.entries(seguranca)
        .filter(([_, value]) => value === true)
        .forEach(([key]) => {
          itensSeguranca.push(
            labelsSeguranca[key] ||
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
          );
        });

      if (itensSeguranca.length > 0) {
        acordeoes.push({
          titulo: "Segurança",
          icone: "fas fa-shield-alt",
          itens: itensSeguranca,
        });
      }

      // ===== 6. ARMÁRIOS E ARMAZENAMENTO =====
      const itensArmarios = [];
      const armarios = dados.armariosArmazenamento || {};

      const labelsArmarios = {
        armarioCozinhaPlanejado: "Cozinha planejada",
        armariosEmbutidos: "Armários embutidos",
        closet: "Closet",
        despensa: "Despensa",
        armarioLavanderia: "Armário na lavanderia",
        prateleiras: "Prateleiras",
        estantes: "Estantes",
        deposito: "Depósito",
        adega: "Adega",
        armarioQuarto: "Armário no quarto",
        armarioBanheiro: "Armário no banheiro",
      };

      Object.entries(armarios)
        .filter(([_, value]) => value === true)
        .forEach(([key]) => {
          itensArmarios.push(
            labelsArmarios[key] ||
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
          );
        });

      if (itensArmarios.length > 0) {
        acordeoes.push({
          titulo: "Armários e Armazenamento",
          icone: "fas fa-boxes",
          itens: itensArmarios,
        });
      }

      // ===== 7. SERVIÇOS E UTILIDADES =====
      const itensServicos = [];
      const servicos = dados.servicosUtilidades || {};

      const labelsServicos = {
        aguaEncanada: "Água encanada",
        energiaEletrica: "Energia elétrica",
        esgotoSanitario: "Esgoto sanitário",
        gasEncanado: "Gás encanado",
        internetFibra: "Internet fibra óptica",
        coletaLixo: "Coleta de lixo",
        iluminacaoPublica: "Iluminação pública",
        transportePublico: "Transporte público próximo",
        pavimentacao: "Pavimentação",
        calçada: "Calçada",
      };

      Object.entries(servicos)
        .filter(([_, value]) => value === true)
        .forEach(([key]) => {
          itensServicos.push(
            labelsServicos[key] ||
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
          );
        });

      if (itensServicos.length > 0) {
        acordeoes.push({
          titulo: "Serviços e Utilidades",
          icone: "fas fa-tools",
          itens: itensServicos,
        });
      }

      // ===== 8. DIFERENCIAIS DO IMÓVEL =====
      const itensDiferenciais = [];
      const diferenciais = dados.diferenciais || {};

      const labelsDiferenciais = {
        varanda: "Varanda",
        sacada: "Sacada",
        lavabo: "Lavabo",
        banheira: "Banheira",
        escritorio: "Escritório / Home office",
        closetMaster: "Closet master",
        lareira: "Lareira",
        aquecimentoCentral: "Aquecimento central",
        arCondicionado: "Ar condicionado central",
        painelSolar: "Painel solar",
        geradorEnergia: "Gerador de energia",
        automacaoResidencial: "Automação residencial",
        elevadorSocial: "Elevador social",
        elevadorServico: "Elevador de serviço",
        vistaMar: "Vista para o mar",
        vistaMontanha: "Vista para montanha",
        vistaCidade: "Vista para a cidade",
        frentePraia: "Frente para a praia",
      };

      Object.entries(diferenciais)
        .filter(([_, value]) => value === true)
        .forEach(([key]) => {
          itensDiferenciais.push(
            labelsDiferenciais[key] ||
              key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase()),
          );
        });

      if (itensDiferenciais.length > 0) {
        acordeoes.push({
          titulo: "Diferenciais do Imóvel",
          icone: "fas fa-star",
          itens: itensDiferenciais,
        });
      }

      return acordeoes;
    },
    [imovel],
  );

  // ==========================================================================
  // BUSCAR DADOS DO IMÓVEL (CORRIGIDO - USA SLUG E CÓDIGO)
  // ==========================================================================
  useEffect(() => {
    let isMounted = true;

    const fetchImovel = async () => {
      try {
        setLoading(true);

        console.log("🔵 [1] Iniciando fetchImovel");
        console.log("🟡 SLUG RECEBIDO:", slug);
        console.log("🟡 CÓDIGO RECEBIDO:", codigo);

        // 🔥 NOVA LÓGICA: Busca combinando slug E código (quando ambos existem)
        let query = supabase.from("imoveis").select("*");
        console.log("🔵 [2] Query criada");

        if (slug && codigo) {
          // Caso 1: Temos slug E código na URL (formato ideal)
          console.log("🔎 [3] Buscando por SLUG + CÓDIGO:", { slug, codigo });
          query = query.eq("slug", slug).eq("codigo", codigo);
        } else if (slug) {
          // Caso 2: Apenas slug (URL antiga)
          console.log("🔎 [3] Buscando apenas por SLUG:", slug);
          query = query.eq("slug", slug);
        } else if (codigo) {
          // Caso 3: Apenas código (fallback)
          console.log("🔎 [3] Buscando apenas por CÓDIGO:", codigo);
          query = query.eq("codigo", codigo);
        } else {
          throw new Error("Parâmetros inválidos");
        }

        console.log("🔵 [4] Executando query no Supabase...");
        const { data: imovelData, error: imovelError } =
          await query.maybeSingle();
        console.log("🔵 [5] Query executada");

        console.log(
          "📦 [6] Resultado da busca:",
          imovelData ? "Encontrado" : "Não encontrado",
        );

        if (imovelError) {
          console.error("🔴 [7] Erro na query:", imovelError);
          throw imovelError;
        }

        if (!imovelData) {
          console.warn("🟡 [8] Imóvel não encontrado");
          throw new Error("Imóvel não encontrado");
        }

        console.log("🟢 [9] Imóvel encontrado, ID:", imovelData.id);
        console.log("🟢 [9.1] Dados do imóvel:", {
          id: imovelData.id,
          titulo: imovelData.titulo,
          tipo: imovelData.tipo,
          slug: imovelData.slug,
          codigo: imovelData.codigo,
        });

        // 🔥 VERIFICAÇÃO DE SEGURANÇA: Se buscamos por slug+codigo, confere se o código bate
        if (slug && codigo && imovelData.codigo !== codigo) {
          console.warn(
            "⚠️ [10] Código não corresponde ao slug! Redirecionando...",
          );
          navigate(`/imovel/${imovelData.slug}/${imovelData.codigo}`, {
            replace: true,
          });
          return;
        }

        console.log("🟢 [11] Buscando finalidades do imóvel...");
        // 🔥 Buscar finalidades do imóvel
        const { data: finalidadesData, error: finalidadesError } =
          await supabase
            .from("imovel_finalidades")
            .select("tipo, preco")
            .eq("imovel_id", imovelData.id)
            .eq("status", "ativo");

        if (finalidadesError) {
          console.error(
            "🔴 [12] Erro ao buscar finalidades:",
            finalidadesError,
          );
          throw finalidadesError;
        }

        console.log(
          "🟢 [13] Finalidades carregadas:",
          finalidadesData?.length || 0,
        );

        if (imovelData.id_edificios && isMounted) {
          console.log("🟢 [14] Buscando dados do edifício...");
          const { data: edificioData } = await supabase
            .from("edificios")
            .select("id, nome, tipo")
            .eq("id", imovelData.id_edificios)
            .maybeSingle();

          if (edificioData) {
            imovelData.edificios = edificioData;
            console.log("🟢 [15] Edifício encontrado:", edificioData.nome);
          }
        }

        if (isMounted) {
          console.log("🟢 [16] Atualizando estados...");
          setImovel(imovelData);
          setFinalidades(finalidadesData || []);

          if (
            imovelData.status === "vendido" ||
            imovelData.status === "alugado"
          ) {
            console.log("🟡 [17] Imóvel vendido/alugado, redirecionando...");
            navigate("/comprar");
            return;
          }

          console.log("🟢 [18] Carregando fotos...");
          await carregarFotos(imovelData.id);

          console.log("🟢 [19] Registrando visualização...");
          await registrarVisualizacao(imovelData.id);

          console.log("🟢 [20] Buscando estatísticas...");
          await buscarVisualizacoes(imovelData.id);

          console.log("🟢 [21] TUDO CARREGADO COM SUCESSO!");
        }
      } catch (err) {
        console.error("🔴 [ERRO] Detalhado:", err);
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) {
          console.log("🟢 [22] Finalizando loading");
          setLoading(false);
        }
      }
    };

    if (slug || codigo) fetchImovel();

    return () => {
      isMounted = false;
    };
  }, [
    slug,
    codigo,
    registrarVisualizacao,
    buscarVisualizacoes,
    carregarFotos,
    navigate,
  ]);
  // ==========================================================================
  // EFEITO PARA GARANTIR QUE AS META TAGS SEJAM ESCRITAS NO DOM (CORREÇÃO FACEBOOK)
  // ==========================================================================
  useEffect(() => {
    // Só executa quando os dados do imóvel (dados) estiverem prontos
    if (dados) {
      console.log("🔥 Escrevendo meta tags diretamente no DOM...");

      // --- Funções para gerar o conteúdo das tags ---
      const gerarTituloParaMeta = () => {
        const emoji = dados.tipo?.toLowerCase().includes("casa") ? "🏠" : "🏢";
        let titulo = `${emoji} ${dados.tipo || "Imóvel"}`;
        if (dados.bairro) titulo += ` no ${dados.bairro}`;
        if (dados.preco) {
          const preco = new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 0,
          }).format(dados.preco);
          titulo += ` - ${preco}`;
        }
        return `${titulo} | Adventus Imobiliária`;
      };

      const gerarDescricaoParaMeta = () => {
        const caracs = [];
        if (dados.quartos)
          caracs.push(`${dados.quartos} quarto${dados.quartos > 1 ? "s" : ""}`);
        if (dados.suites)
          caracs.push(`${dados.suites} suíte${dados.suites > 1 ? "s" : ""}`);
        if (dados.vagas)
          caracs.push(`${dados.vagas} vaga${dados.vagas > 1 ? "s" : ""}`);
        if (dados.area_construida)
          caracs.push(`${dados.area_construida}m² construídos`);
        let desc = caracs.join(" • ");
        desc += ` no ${dados.bairro || "Colinas Park"}, Açailândia.`;
        return desc;
      };

      const tituloCompleto = gerarTituloParaMeta();
      const descricaoCompleta = gerarDescricaoParaMeta();

      // --- Função auxiliar para criar ou atualizar meta tags ---
      const setMetaTag = (selector, attributes) => {
        let tag = document.querySelector(selector);
        if (!tag) {
          tag = document.createElement("meta");
          for (let [key, value] of Object.entries(attributes)) {
            tag.setAttribute(key, value);
          }
          document.head.appendChild(tag);
        } else {
          for (let [key, value] of Object.entries(attributes)) {
            tag.setAttribute(key, value);
          }
        }
      };

      // --- URL da imagem ---
      let imagemUrl =
        "https://adventus-imob-vdlz.vercel.app/img/adventusimobiliaria.png";
      if (fotos && fotos.length > 0) {
        if (typeof fotos[0] === "string") {
          imagemUrl = fotos[0];
        } else if (fotos[0]?.url) {
          imagemUrl = fotos[0].url;
        }
      }

      // --- Atualizar TÍTULO da página ---
      document.title = tituloCompleto;

      // --- Atualizar meta description padrão ---
      setMetaTag('meta[name="description"]', {
        name: "description",
        content: descricaoCompleta,
      });

      // --- Atualizar todas as tags Open Graph ---
      setMetaTag('meta[property="og:title"]', {
        property: "og:title",
        content: tituloCompleto,
      });
      setMetaTag('meta[property="og:description"]', {
        property: "og:description",
        content: descricaoCompleta,
      });
      setMetaTag('meta[property="og:image"]', {
        property: "og:image",
        content: imagemUrl,
      });
      setMetaTag('meta[property="og:image:width"]', {
        property: "og:image:width",
        content: "1200",
      });
      setMetaTag('meta[property="og:image:height"]', {
        property: "og:image:height",
        content: "630",
      });
      setMetaTag('meta[property="og:url"]', {
        property: "og:url",
        content: window.location.href,
      });
      setMetaTag('meta[property="og:type"]', {
        property: "og:type",
        content: "website",
      });
      setMetaTag('meta[property="og:locale"]', {
        property: "og:locale",
        content: "pt_BR",
      });
      setMetaTag('meta[property="og:site_name"]', {
        property: "og:site_name",
        content: "Adventus Imobiliária",
      });

      // --- Atualizar todas as tags Twitter ---
      setMetaTag('meta[name="twitter:card"]', {
        name: "twitter:card",
        content: "summary_large_image",
      });
      setMetaTag('meta[name="twitter:title"]', {
        name: "twitter:title",
        content: tituloCompleto,
      });
      setMetaTag('meta[name="twitter:description"]', {
        name: "twitter:description",
        content: descricaoCompleta,
      });
      setMetaTag('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: imagemUrl,
      });

      console.log("✅ Meta tags escritas no DOM com sucesso!");
      console.log("📸 Imagem usada:", imagemUrl);
    }
  }, [dados, fotos]);
  // ==========================================================================
  // DADOS PROCESSADOS
  // ==========================================================================
  const dados = useMemo(() => getImovelData(), [getImovelData]);
  const dadosAcordeao = useMemo(
    () => (dados ? gerarDadosAcordeao(dados) : []),
    [dados, gerarDadosAcordeao],
  );
  const imagens = useMemo(() => dados?.imagens || [], [dados]);

  // ==========================================================================
  // FUNÇÕES PARA PROTEÇÃO CONTRA ENVIOS DUPLICADOS
  // ==========================================================================
  // ⚠️ IMPORTANTE: Estas funções devem vir DEPOIS da declaração de 'dados'

  /**
   * Verifica se o envio atual é duplicado
   * @param {Object} novosDados - Dados do formulário atual
   * @returns {boolean} - true se for duplicado, false caso contrário
   */
  const isEnvioDuplicado = useCallback(
    (novosDados) => {
      // Se não tem dados do imóvel ainda, não pode ser duplicado
      if (!dados?.id) {
        return false;
      }

      try {
        // Recupera o último envio do localStorage para este imóvel
        const ultimoEnvioStorage = localStorage.getItem(
          `ultimo_envio_${dados.id}`,
        );

        if (!ultimoEnvioStorage) {
          return false; // Primeiro envio para este imóvel
        }

        const ultimoEnvio = JSON.parse(ultimoEnvioStorage);

        // Verifica se os dados do lead são os mesmos
        const mesmoLead =
          ultimoEnvio.nome?.trim().toLowerCase() ===
            novosDados.nome?.trim().toLowerCase() &&
          ultimoEnvio.email?.trim().toLowerCase() ===
            novosDados.email?.trim().toLowerCase() &&
          ultimoEnvio.telefone?.trim() === novosDados.telefone?.trim();

        if (!mesmoLead) {
          return false; // Lead diferente, permite novo envio
        }

        // Verifica se o envio foi há menos de 24 horas
        const agora = Date.now();
        const diferencaHoras =
          (agora - ultimoEnvio.timestamp) / (1000 * 60 * 60);

        if (diferencaHoras < 24) {
          // Guarda os dados do envio duplicado para exibir no aviso
          setDadosDuplicados({
            ...ultimoEnvio,
            diferencaHoras: Math.round(diferencaHoras * 10) / 10,
          });
          return true; // É duplicado (mesmo lead, mesmo imóvel, menos de 24h)
        }

        // Se passou mais de 24h, permite novo envio
        return false;
      } catch (error) {
        console.error("❌ Erro ao verificar duplicidade:", error);
        return false; // Em caso de erro, permite o envio
      }
    },
    [dados?.id],
  );

  /**
   * Salva os dados do envio no localStorage
   * @param {Object} dadosEnvio - Dados do envio realizado
   */
  const salvarEnvio = useCallback(
    (dadosEnvio) => {
      // Se não tem dados do imóvel ainda, não salva
      if (!dados?.id) {
        console.warn(
          "⚠️ Não foi possível salvar envio: dados do imóvel não disponíveis",
        );
        return;
      }

      try {
        const dadosParaSalvar = {
          nome: dadosEnvio.nome,
          email: dadosEnvio.email,
          telefone: dadosEnvio.telefone,
          imovelId: dados.id,
          imovelCodigo: dados.codigo,
          timestamp: Date.now(),
        };

        localStorage.setItem(
          `ultimo_envio_${dados.id}`,
          JSON.stringify(dadosParaSalvar),
        );

        setUltimoEnvio(dadosParaSalvar);
        console.log("✅ Envio salvo no localStorage:", dadosParaSalvar);
      } catch (error) {
        console.error("❌ Erro ao salvar envio:", error);
      }
    },
    [dados?.id, dados?.codigo],
  );

  /**
   * Limpa envios antigos do localStorage (mais de 7 dias)
   */
  const limparEnviosAntigos = useCallback(() => {
    try {
      const agora = Date.now();
      const limite = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos

      // Percorre todas as chaves do localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const chave = localStorage.key(i);

        // Verifica se é uma chave de envio (começa com "ultimo_envio_")
        if (chave?.startsWith("ultimo_envio_")) {
          try {
            const dados = JSON.parse(localStorage.getItem(chave));

            // Se o envio for mais antigo que o limite, remove
            if (dados.timestamp && agora - dados.timestamp > limite) {
              localStorage.removeItem(chave);
              console.log(`🗑️ Envio antigo removido: ${chave}`);
            }
          } catch (e) {
            // Se não conseguir parsear, remove
            localStorage.removeItem(chave);
          }
        }
      }
    } catch (error) {
      console.error("❌ Erro ao limpar envios antigos:", error);
    }
  }, []);

  /**
   * Verifica se já existe um envio para este imóvel ao abrir o modal
   */
  const verificarEnvioExistenteAoAbrirModal = useCallback(() => {
    // Se não tem dados do imóvel ainda, não faz nada
    if (!dados?.id) {
      return;
    }

    try {
      const ultimoEnvioStorage = localStorage.getItem(
        `ultimo_envio_${dados.id}`,
      );

      if (ultimoEnvioStorage) {
        const ultimoEnvio = JSON.parse(ultimoEnvioStorage);
        const agora = Date.now();
        const diferencaHoras =
          (agora - ultimoEnvio.timestamp) / (1000 * 60 * 60);

        if (diferencaHoras < 24) {
          // Pré-preencher o formulário com os dados do último envio
          setFormData((prev) => ({
            ...prev,
            nome: ultimoEnvio.nome || "",
            email: ultimoEnvio.email || "",
            telefone: ultimoEnvio.telefone || "",
          }));

          // Guarda info para mostrar aviso se tentar enviar novamente
          setDadosDuplicados({
            ...ultimoEnvio,
            diferencaHoras: Math.round(diferencaHoras * 10) / 10,
          });
        }
      }
    } catch (error) {
      console.error("❌ Erro ao verificar envio existente:", error);
    }
  }, [dados?.id]);

  // ==========================================================================
  // APLICAR SEO (UMA ÚNICA VEZ)
  // ==========================================================================
  useEffect(() => {
    if (dados && !seoAplicadoRef.current) {
      const timer = setTimeout(() => {
        atualizarTagsSEO(dados);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [dados, atualizarTagsSEO]);

  // ==========================================================================
  // LIMPAR ENVIOS ANTIGOS AO INICIAR
  // ==========================================================================
  useEffect(() => {
    limparEnviosAntigos();
  }, [limparEnviosAntigos]);

  // ==========================================================================
  // ATUALIZAR MENSAGEM DO MODAL
  // ==========================================================================
  useEffect(() => {
    if (dados && !formData.mensagem) {
      setFormData((prev) => ({
        ...prev,
        mensagem: `Tenho interesse no imóvel ${dados.codigo} - ${dados.tituloSEO}. Aguardo informações.`,
      }));
    }
  }, [dados, formData.mensagem]);

  // ==========================================================================
  // CONTROLES DO MODAL
  // ==========================================================================
  useEffect(() => {
    document.body.style.overflow = modalAberto ? "hidden" : "unset";
  }, [modalAberto]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (overlayRef.current === event.target) fecharModal();
    };

    if (modalAberto) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [modalAberto]);

  // ==========================================================================
  // AUTO-PLAY DO CARROSSEL
  // ==========================================================================
  useEffect(() => {
    if (!imagens.length) return;

    const intervalo = setInterval(() => {
      setImagemAtual((prev) => (prev + 1) % imagens.length);
    }, 5000);

    return () => clearInterval(intervalo);
  }, [imagens.length]);

  const mudarImagem = useCallback(
    (direcao) => {
      if (!imagens.length) return;
      setImagemAtual(
        (prev) => (prev + direcao + imagens.length) % imagens.length,
      );
    },
    [imagens.length],
  );

  const abrirModal = useCallback(() => {
    setModalAberto(true);
    setMostrarAvisoDuplicado(false);
    verificarEnvioExistenteAoAbrirModal();
  }, [verificarEnvioExistenteAoAbrirModal]);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setEnviado(false);
    setMostrarAvisoDuplicado(false);
    setDadosDuplicados(null);
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      mensagem: dados?.tituloSEO
        ? `Tenho interesse no imóvel ${dados.codigo} - ${dados.tituloSEO}. Aguardo informações.`
        : "",
      horarioPreferencia: "",
      diaSemana: "",
    });
  }, [dados]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // ==========================================================================
  // FUNÇÃO DO ACORDEÃO - SEM SALTO
  // ==========================================================================
  const toggleAcordeao = useCallback((index, event) => {
    if (event) {
      event.preventDefault();
    }

    const buttonElement = event.currentTarget;
    const scrollPosition = window.scrollY;

    setAcordeoesAbertos((prev) => {
      if (prev[index]) {
        return {};
      }
      return { [index]: true };
    });

    setTimeout(() => {
      if (buttonElement) {
        const rect = buttonElement.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        const offset = 84;

        window.scrollTo({
          top: absoluteTop - offset,
          behavior: "smooth",
        });
      } else {
        window.scrollTo({
          top: scrollPosition,
          behavior: "auto",
        });
      }
    }, 100);
  }, []);

  // ==========================================================================
  // HANDLE SUBMIT DO MODAL
  // ==========================================================================
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      // 🚫 BLOQUEIO DESATIVADO TEMPORARIAMENTE
      // Verifica se é um envio duplicado ANTES de tentar enviar
      // if (isEnvioDuplicado(formData)) {
      //   setMostrarAvisoDuplicado(true);
      //   // Rola o modal para mostrar o aviso
      //   setTimeout(() => {
      //     if (modalRef.current) {
      //       modalRef.current.scrollTop = 0;
      //     }
      //   }, 100);
      //   return; // Interrompe o envio
      // }

      setEnviando(true);
      setMostrarAvisoDuplicado(false);

      try {
        if (
          !formData.nome ||
          !formData.telefone ||
          !formData.email ||
          !formData.diaSemana ||
          !formData.horarioPreferencia
        ) {
          throw new Error("Por favor, preencha todos os campos obrigatórios");
        }

        const dataVisita = new Date();
        dataVisita.setDate(dataVisita.getDate() + 7);

        // ==========================================================================
        // 1️⃣ PRIMEIRO: CRIAR O LEAD
        // ==========================================================================
        const { data: leadData, error: leadError } = await supabase
          .from("leads")
          .insert({
            nome: formData.nome,
            telefone: formData.telefone,
            email: formData.email,
            origem: "site",
            status: "novo",
            imovel_codigo: dados.codigo,
            melhor_dia: formData.diaSemana,
            melhor_horario: formData.horarioPreferencia,
            created_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (leadError) throw leadError;

        // ==========================================================================
        // 2️⃣ DEPOIS: CRIAR A VISITA (VINCULADA AO LEAD)
        // ==========================================================================
        const { data, error } = await visitasService.criarVisita({
          imovel_id: dados.id,
          lead_id: leadData.id,
          nome_cliente: formData.nome,
          telefone: formData.telefone,
          email: formData.email,
          dia_preferencia: formData.diaSemana,
          horario_preferencia: formData.horarioPreferencia,
          status: "solicitada",
          created_at: new Date().toISOString(),
        });

        if (error) throw error;

        if (data && data.id) {
          await registrarSolicitacaoVisita(
            dados.id,
            {
              nome: formData.nome,
              email: formData.email,
              telefone: formData.telefone,
            },
            data.id,
          );
        }

        // Salva os dados do envio no localStorage
        salvarEnvio(formData);

        incrementarContador("visitas");
        setEnviado(true);
        setEnviando(false);
        setTimeout(fecharModal, 3000);
      } catch (error) {
        console.error("❌ [VISITA] Erro:", error);
        setEnviando(false);
        alert(error.message || "Erro ao enviar. Tente novamente.");
      }
    },
    [
      formData,
      dados,
      registrarSolicitacaoVisita,
      incrementarContador,
      fecharModal,
      isEnvioDuplicado,
      salvarEnvio,
    ],
  );

  // ==========================================================================
  // LOADING STATE
  // ==========================================================================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4A24D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando informações do imóvel...</p>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // ERROR STATE
  // ==========================================================================
  if (error || !dados) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Imóvel não encontrado
          </h2>
          <p className="text-gray-600 mb-6">
            O imóvel que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={() => navigate("/comprar")}
            className="px-6 py-3 bg-[#31353E] text-white rounded-lg hover:bg-[#D4A24D] transition-colors"
          >
            Ver outros imóveis
          </button>
        </div>
      </div>
    );
  }

  // ==========================================================================
  // RENDERIZAÇÃO - MANTIDA IGUAL
  // ==========================================================================
  return (
    <>
      {/* PASSA O IMOVEL E AS FOTOS */}
      <ImovelMetaTags imovel={dados} fotos={fotos} />

      {/* =============== CARROSSEL DE FOTOS EM TELA CHEIA =============== */}
      <section className="relative w-full pt-[65px] md:pt-20">
        {/* Container do carrossel com altura responsiva */}
        <div className="relative w-full h-[50vh] md:h-[calc(100vh-80px)] overflow-hidden bg-gray-900">
          {imagens.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={gerarAltImagem(dados, index)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                index === imagemAtual ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
          {/* Overlay escuro sutil para melhor contraste */}
          <div className="absolute inset-0 bg-black/10"></div>

          {/* CONTADOR - ajustado para mobile */}
          <div className="absolute top-4 left-4 md:top-28 md:left-8 z-20 backdrop-blur-md rounded-full bg-black/40">
            <div className="flex items-center justify-center px-2 py-1 md:px-4 md:py-2 space-x-1 md:space-x-2">
              <i className="fas fa-camera text-[#D4A24D] text-[10px] md:text-xs"></i>
              <span className="text-white font-medium text-xs md:text-sm">
                {imagemAtual + 1}/{imagens.length}
              </span>
            </div>
          </div>

          {/* PONTINHOS - ajustado para mobile */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 md:space-x-2 z-20">
            {imagens.map((_, index) => (
              <button
                key={index}
                onClick={() => setImagemAtual(index)}
                className="rounded-full transition-all duration-300 focus:outline-none focus:ring-0"
                style={{
                  width: imagemAtual === index ? "8px" : "6px",
                  height: imagemAtual === index ? "8px" : "6px",
                  backgroundColor:
                    imagemAtual === index ? "#D4A24D" : "rgba(255,255,255,0.6)",
                  boxShadow:
                    imagemAtual === index
                      ? "0 0 8px rgba(212,162,77,0.8)"
                      : "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  outline: "none",
                }}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>

          {/* SETAS (APENAS DESKTOP) */}
          {imagens.length > 1 && (
            <>
              <button
                onClick={() => mudarImagem(-1)}
                className="hidden md:flex absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full items-center justify-center shadow-lg transition-all hover:scale-110 z-20 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-0"
                style={{
                  width: "44px",
                  height: "44px",
                }}
              >
                <i className="fas fa-chevron-left text-lg"></i>
              </button>
              <button
                onClick={() => mudarImagem(1)}
                className="hidden md:flex absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full items-center justify-center shadow-lg transition-all hover:scale-110 z-20 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-0"
                style={{
                  width: "44px",
                  height: "44px",
                }}
              >
                <i className="fas fa-chevron-right text-lg"></i>
              </button>
            </>
          )}

          {/* SCROLL INDICATOR PREMIUM - TEXTO COM GRADIENTE E BORDA ANIMADA */}
          <div className="absolute bottom-12 md:bottom-8 left-1/2 transform -translate-x-1/2 z-30">
            <div className="relative group cursor-pointer">
              {/* Borda animada com glow - escondida no mobile */}
              <div className="hidden md:block absolute -inset-4 bg-gradient-to-r from-[#D4A24D]/0 via-[#D4A24D]/50 to-[#D4A24D]/0 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse"></div>

              {/* Círculo externo animado - reduzido no mobile */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 md:w-12 md:h-12 border border-white/20 rounded-full animate-ping"></div>
                <div className="absolute w-7 h-7 md:w-10 md:h-10 border border-white/30 rounded-full animate-pulse"></div>

                {/* Círculo interno com ícone - reduzido no mobile */}
                <div className="relative w-10 h-10 md:w-14 md:h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:border-[#D4A24D] transition-colors duration-500 group">
                  <div className="flex flex-col items-center">
                    <i className="fas fa-chevron-down text-white text-sm md:text-lg animate-bounce"></i>
                  </div>
                </div>
              </div>

              {/* Texto com gradiente - APENAS NO DESKTOP */}
              <div className="absolute -bottom-8 md:-bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                <span className="text-white md:text-transparent md:bg-clip-text md:bg-gradient-to-r md:from-white md:via-[#D4A24D] md:to-white text-[10px] md:text-[10px] font-medium md:font-light tracking-[0.2em] md:tracking-[0.3em] uppercase drop-shadow-lg">
                  Role para ver detalhes
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#D4A24D] to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CABEÇALHO DO IMÓVEL - AJUSTADO NO MOBILE */}
      <section className="bg-[#31353E] text-white pt-5 md:pt-10 md:pb-14 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col justify-center">
              {/* DESTAQUE SEMANA */}
              {dados.destaqueSemana && (
                <div className="self-start mb-6">
                  <div className="inline-flex items-center bg-gradient-to-r from-[#D4A24D] to-[#E6B85C] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    <i className="fas fa-star mr-1.5 text-[10px]"></i>
                    <span className="text-[11px] tracking-tight">
                      EXCLUSIVIDADE ADVENTUS
                    </span>
                  </div>
                </div>
              )}

              {/* EMPREENDIMENTO */}
              {dados.empreendimento?.nome && (
                <div className="self-start mb-4">
                  <div className="inline-flex items-center bg-[#D4A24D]/20 text-[#D4A24D] border border-[#D4A24D]/30 px-4 py-2 rounded-full text-sm font-semibold">
                    <i className="fas fa-building mr-2"></i>
                    <span>{dados.empreendimento.nome}</span>
                  </div>
                </div>
              )}

              {/* TÍTULO */}
              <h1 className="text-[22px] md:text-2xl font-bold mb-3 text-white">
                {dados.tituloSEO}
              </h1>

              {/* CÓDIGO + FINANCIÁVEL */}
              <div className="flex items-center gap-3 mb-1">
                <div className="text-xs text-gray-300">
                  Código: {dados.codigo}
                </div>
                {dados.financiavel && (
                  <div className="inline-flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-[10px] font-semibold">
                    <i className="fas fa-hand-holding-usd mr-1 text-[8px]"></i>
                    FINANCIÁVEL
                  </div>
                )}
              </div>

              {/* ENDEREÇO */}
              {dados.exibir_endereco_site && dados.endereco && (
                <div className="flex items-center space-x-2 text-white mb-1">
                  <i className="fas fa-map-marker-alt text-[#D4A24D] text-sm"></i>
                  <span className="text-sm md:text-base">
                    <strong>{dados.localizacaoCompleta}</strong>
                    {dados.endereco && ` - ${dados.enderecoCompleto}`}
                  </span>
                </div>
              )}

              {/* LINHA DIVISÓRIA */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A24D]/30 to-transparent my-2"></div>

              {/* PREÇO */}
              <div className="mb-6">
                {dados.baixou_preco === true &&
                dados.precoAnterior &&
                dados.precoAnterior > 0 ? (
                  // CASO 1: Imóvel com desconto (baixou o preço)
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-400 line-through text-lg md:text-xl">
                        {dados.precoAnteriorFormatado}
                      </span>
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        -{calcularDesconto(dados.precoAnterior, dados.preco)}%
                        OFF
                      </span>
                    </div>
                    <div className="text-3xl md:text-4xl font-black text-white">
                      {dados.precoFormatado}
                    </div>
                    <p className="text-green-400 text-xs md:text-sm mt-2">
                      🎉 Você economiza{" "}
                      {formatPrice(dados.precoAnterior - dados.preco)}!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* CASO 2: Apenas venda - mostra apenas o preço de venda */}
                    {dados.finalidade_venda &&
                      !dados.finalidade_aluguel &&
                      !dados.ocultarPreco && (
                        <div className="text-3xl md:text-4xl font-black text-white">
                          {dados.precoFormatado}
                        </div>
                      )}

                    {/* CASO 3: Apenas aluguel - mostra apenas o preço do aluguel com /mês */}
                    {!dados.finalidade_venda &&
                      dados.finalidade_aluguel &&
                      !dados.ocultarPreco && (
                        <div className="text-3xl md:text-4xl font-black text-white">
                          {dados.precoAluguelFormatado}/mês
                        </div>
                      )}

                    {/* CASO 4: Venda e aluguel - mostra o preço de venda e o de aluguel como opção */}
                    {dados.finalidade_venda &&
                      dados.finalidade_aluguel &&
                      !dados.ocultarPreco && (
                        <>
                          <div className="text-3xl md:text-4xl font-black text-white">
                            {dados.precoFormatado}
                          </div>
                          <div className="text-lg md:text-xl text-gray-300 mt-3">
                            ou{" "}
                            <span className="font-bold text-white">
                              {dados.precoAluguelFormatado}/mês
                            </span>{" "}
                            para aluguel
                          </div>
                        </>
                      )}

                    {/* CASO 5: Preço oculto ou nenhum preço definido - mostra "Preço sob consulta" */}
                    {(dados.ocultarPreco ||
                      (!dados.preco && !dados.precoAluguel)) && (
                      <div className="text-3xl md:text-4xl font-black text-white">
                        Preço sob consulta
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* ÍCONES DE CARACTERÍSTICAS */}
              <div className="grid grid-cols-3 md:flex md:flex-wrap justify-center md:justify-start gap-3 md:gap-4 text-white">
                {dados.quartos > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-bed text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="text-base font-light">
                      {dados.quartos}{" "}
                      {dados.quartos === 1 ? "Quarto" : "Quartos"}
                    </div>
                  </div>
                )}
                {dados.suites > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-crown text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="text-base font-light">
                      {dados.suites} {dados.suites === 1 ? "Suíte" : "Suítes"}
                    </div>
                  </div>
                )}
                {dados.banheiros > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-bath text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="text-base font-light">
                      {dados.banheiros}{" "}
                      {dados.banheiros === 1 ? "Banheiro" : "Banheiros"}
                    </div>
                  </div>
                )}
                {dados.vagas > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-car text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="text-base font-light">
                      {dados.vagas} {dados.vagas === 1 ? "Vaga" : "Vagas"}
                    </div>
                  </div>
                )}
                {dados.areaConstruida > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-arrows-alt text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="text-base font-light">
                      {dados.areaConstruida} m²
                    </div>
                    <div className="text-[10px] text-gray-300 mt-1">
                      Área construída
                    </div>
                  </div>
                )}
                {dados.areaTotal > 0 &&
                  dados.areaTotal !== dados.areaConstruida && (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                        <i className="fas fa-arrows-alt text-[#D4A24D] text-lg"></i>
                      </div>
                      <div className="text-base font-light">
                        {dados.areaTotal} m²
                      </div>
                      <div className="text-[10px] text-gray-300 mt-1">
                        Área total
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* COLUNA VISUALIZAÇÕES + BOTÃO */}
            <div className="relative flex items-center justify-center">
              <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-px">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              </div>
              <div className="lg:pl-8 w-full max-w-xs">
                <div className="bg-gradient-to-br from-[#2a2e36]/60 via-[#2a2e36]/50 to-[#D4A24D]/5 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-[#D4A24D]/10 shadow-lg relative overflow-hidden">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <i className="fas fa-eye text-white text-xl md:text-2xl"></i>
                      <span className="text-4xl md:text-5xl font-black text-white">
                        {visualizacoes.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#E6B85C] tracking-wider">
                      VISUALIZAÇÕES
                    </div>
                    <p className="text-xs text-white/70 mt-3 max-w-xs mx-auto font-light">
                      Desde sua publicação
                    </p>
                  </div>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4A24D] to-transparent my-4"></div>

                {/* BOTÃO SOLICITAR VISITA - AUMENTADO NO MOBILE */}
                <button
                  onClick={abrirModal}
                  className="w-full py-4 px-5 md:py-3 md:px-4 bg-gradient-to-r from-[#D4A24D] to-[#E6B85C] hover:from-[#C4933E] hover:to-[#D4A24D] text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-base md:text-sm relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <i className="fas fa-calendar-check relative z-10 text-lg md:text-base"></i>
                  <span className="relative z-10">Solicitar uma visita</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPAÇAMENTO ENTRE CABEÇALHO E ACORDEÕES - AJUSTADO +3px */}
      <div className="py-5 md:py-8"></div>

      {/* ACORDEÕES */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="w-full bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          {dadosAcordeao.length > 0 ? (
            dadosAcordeao.map((acordeao, index) => {
              const isAberto = acordeoesAbertos[index];

              return (
                <div
                  key={index}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  <button
                    onClick={(e) => toggleAcordeao(index, e)}
                    className={`w-full px-6 py-5 text-left flex justify-between items-center transition-all duration-300 focus:outline-none focus:ring-0 ${
                      isAberto ? "bg-gray-900" : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-[#D4A24D]/10 flex items-center justify-center">
                        <i
                          className={`${acordeao.icone} text-lg text-[#D4A24D]`}
                        ></i>
                      </div>
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          isAberto ? "text-white" : "text-gray-700"
                        }`}
                      >
                        {acordeao.titulo}
                      </span>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isAberto ? "bg-[#D4A24D]" : "bg-[#D4A24D]/10"
                      }`}
                    >
                      <i
                        className={`fas fa-chevron-down text-sm transition-all duration-300 ${
                          isAberto ? "text-white rotate-180" : "text-[#D4A24D]"
                        }`}
                      ></i>
                    </div>
                  </button>
                  {isAberto && (
                    <div className="bg-white px-6 pb-6">
                      <div className="border-t border-gray-200 pt-4"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                        {acordeao.itens.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-center space-x-3 py-3 px-4 rounded-lg bg-gray-50 border border-gray-100 hover:border-[#D4A24D]/30 hover:bg-white transition-all duration-200 group"
                          >
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#D4A24D] to-green-500 flex items-center justify-center shadow-lg shadow-[#D4A24D]/20 relative overflow-hidden group-hover:shadow-xl group-hover:scale-110 transition-all duration-200">
                              <div className="absolute inset-0 bg-gradient-to-t from-white/30 to-transparent"></div>
                              <svg
                                className="w-3 h-3 text-white relative z-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-gray-700 text-sm group-hover:text-[#D4A24D] transition-colors">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-info-circle text-gray-400 text-2xl"></i>
              </div>
              <p className="text-gray-500">
                Nenhuma característica adicional cadastrada para este imóvel.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ESPAÇAMENTO ENTRE ACORDEÕES E CTA - AJUSTADO +3px */}
      <div className="py-5 md:py-8"></div>

      {/* CALL-TO-ACTION */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#31353E] text-white rounded-xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#D4A24D]/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="p-10 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-0 lg:gap-x-12">
                {/* COLUNA ESQUERDA - WHATSAPP */}
                <div className="flex flex-col items-center text-center pb-12 lg:pb-0 border-b border-gray-500/60 lg:border-b-0 lg:border-r lg:border-gray-600/50 lg:pr-12">
                  <h2 className="text-2xl md:text-3xl font-bold mb-1 text-[#D4A24D]">
                    Dúvida rápida?
                  </h2>
                  <p className="text-gray-300 mb-8 text-sm md:text-base font-light opacity-90 max-w-xs">
                    Resolva suas dúvidas em poucos minutos!
                  </p>
                  <div className="mt-auto">
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                        `Olá! Tenho interesse no imóvel ${dados.codigo} - ${dados.tituloSEO} e gostaria de mais informações.`,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => registrarCliqueWhatsApp(dados.id)}
                      className="btn-whatsapp-premium inline-flex items-center justify-center px-7 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm md:text-base font-semibold rounded-lg hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 space-x-2 shadow-md relative overflow-hidden group whitespace-nowrap"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <i className="fab fa-whatsapp text-base"></i>
                      <span>Chamar no WhatsApp</span>
                    </a>
                  </div>
                </div>

                {/* COLUNA DIREITA - VISITA */}
                <div className="flex flex-col items-center text-center pt-12 lg:pt-0">
                  <h2 className="text-2xl md:text-3xl font-bold mb-1 text-white">
                    Atendimento personalizado
                  </h2>
                  <p className="text-gray-300 mb-8 text-sm md:text-base font-light opacity-90 max-w-xs">
                    Conheça todos os detalhes do imóvel pessoalmente
                  </p>
                  <div className="mt-auto">
                    <button
                      onClick={abrirModal}
                      className="btn-visita-premium inline-flex items-center justify-center px-7 py-3 bg-gradient-to-r from-[#D4A24D] to-[#E6B85C] text-white text-sm md:text-base font-semibold rounded-lg hover:from-[#C4933E] hover:to-[#D4A24D] hover:shadow-lg transition-all duration-300 space-x-2 shadow-md relative overflow-hidden group whitespace-nowrap"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                      <i className="fas fa-calendar-alt text-base"></i>
                      <span>Solicitar uma visita</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full h-[0.5px] bg-gradient-to-r from-transparent via-[#D4A24D] to-transparent"></div>

            <div className="bg-white p-4 md:p-5 rounded-b-xl">
              <div className="text-center">
                <div className="text-[#31353E] text-sm font-light">
                  <i className="far fa-clock text-[#D4A24D] mr-1"></i>
                  Atendimento de segunda a sexta, das 8h às 18h
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESPAÇAMENTO FINAL - AJUSTADO +3px */}
      <div className="py-5 md:py-8"></div>

      {/* MODAL DE VISITA - COM PROTEÇÃO CONTRA DUPLICIDADE */}
      {modalAberto && (
        <>
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/50 z-[9998]"
            onClick={fecharModal}
          ></div>
          <div
            ref={modalRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-6 pointer-events-none"
          >
            <div className="w-full max-w-md mx-auto pointer-events-auto">
              <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
                <div className="bg-[#D4A24D] text-white p-5">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 pr-3 min-w-0">
                      <h3 className="text-base md:text-lg font-semibold">
                        Agendar visita - {dados.codigo}
                      </h3>
                    </div>
                    <button
                      onClick={fecharModal}
                      className="bg-white/20 hover:bg-white/30 text-white text-lg md:text-xl transition-colors rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shadow-md flex-shrink-0 ml-2"
                    >
                      <span className="font-bold">×</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 md:p-6 max-h-[70vh] md:max-h-none overflow-y-auto bg-white">
                  {enviado ? (
                    <div className="text-center py-6 md:py-8">
                      <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-check text-green-600 text-2xl md:text-3xl"></i>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-2">
                        Solicitação Enviada!
                      </h4>
                      <p className="text-gray-600 text-sm md:text-base">
                        Em breve nosso corretor entrará em contato.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      {/* AVISO DE ENVIO DUPLICADO */}
                      {mostrarAvisoDuplicado && dadosDuplicados && (
                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-4">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <i className="fas fa-exclamation-triangle text-yellow-400"></i>
                            </div>
                            <div className="ml-3">
                              <p className="text-sm text-yellow-700 font-medium">
                                Você já solicitou uma visita para este imóvel
                              </p>
                              <p className="text-xs text-yellow-600 mt-1">
                                Enviado em{" "}
                                {new Date(
                                  dadosDuplicados.timestamp,
                                ).toLocaleDateString("pt-BR")}{" "}
                                às{" "}
                                {new Date(
                                  dadosDuplicados.timestamp,
                                ).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                              <p className="text-xs text-yellow-600 mt-2">
                                Sua solicitação de visita foi recebida! Um
                                corretor entrará em contato em breve para
                                confirmar o melhor horário.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none bg-white text-gray-900"
                        placeholder="Nome completo *"
                      />
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none bg-white text-gray-900"
                        placeholder="WhatsApp com DDD *"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none bg-white text-gray-900"
                        placeholder="Email *"
                      />
                      <select
                        name="diaSemana"
                        value={formData.diaSemana}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none bg-white text-gray-900"
                      >
                        <option value="" className="text-gray-900">
                          Melhor dia *
                        </option>
                        <option value="segunda" className="text-gray-900">
                          Segunda
                        </option>
                        <option value="terca" className="text-gray-900">
                          Terça
                        </option>
                        <option value="quarta" className="text-gray-900">
                          Quarta
                        </option>
                        <option value="quinta" className="text-gray-900">
                          Quinta
                        </option>
                        <option value="sexta" className="text-gray-900">
                          Sexta
                        </option>
                      </select>
                      <select
                        name="horarioPreferencia"
                        value={formData.horarioPreferencia}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none bg-white text-gray-900"
                      >
                        <option value="" className="text-gray-900">
                          Melhor horário *
                        </option>
                        <option value="manha" className="text-gray-900">
                          Manhã (8h-12h)
                        </option>
                        <option value="tarde" className="text-gray-900">
                          Tarde (14h-18h)
                        </option>
                      </select>
                      <textarea
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none bg-white text-gray-900"
                        placeholder="Mensagem (opcional)"
                      />
                      <button
                        type="submit"
                        disabled={enviando}
                        className="w-full py-3 bg-[#D4A24D] hover:bg-[#C4933E] text-white rounded-lg font-medium transition-colors disabled:bg-gray-400"
                      >
                        {enviando ? "Enviando..." : "Solicitar Visita"}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== ESTILOS GLOBAIS ===== */}
      <style jsx="true" global={true}>{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

        body {
          font-family: "Montserrat", sans-serif;
          background: #f8f9fa;
          color: #333;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: #d4a24d;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #b38f3a;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #d4a24d #f1f1f1;
        }

        .light-sweep-premium {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            45deg,
            transparent 0%,
            rgba(255, 255, 255, 0.15) 25%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.15) 75%,
            transparent 100%
          );
          opacity: 0;
          animation: lightSweepPremium 8s ease-in-out infinite;
          z-index: 1;
        }

        @keyframes lightSweepPremium {
          0%,
          90%,
          100% {
            opacity: 0;
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          5% {
            opacity: 0.2;
          }
          10% {
            opacity: 0.6;
            transform: translateX(0%) translateY(0%) rotate(45deg);
          }
          15% {
            opacity: 0.2;
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
          20%,
          89% {
            opacity: 0;
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        .pulse-wave {
          animation: wavePulse 3s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        .pulse-wave::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border-radius: 50%;
          border: 2px solid rgba(212, 162, 77, 0.3);
          animation: waveExpand 3s ease-out infinite;
          z-index: -1;
        }

        @keyframes wavePulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              inset 0 0 8px rgba(212, 162, 77, 0.1),
              0 0 8px rgba(212, 162, 77, 0.1);
          }
          50% {
            transform: scale(1.03);
            box-shadow:
              inset 0 0 12px rgba(212, 162, 77, 0.2),
              0 0 15px rgba(212, 162, 77, 0.2);
          }
        }

        @keyframes waveExpand {
          0% {
            transform: scale(1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        /* ===== ANIMAÇÕES PREMIUM DO SCROLL INDICATOR ===== */
        @keyframes gradientFlow {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradientFlow {
          background-size: 200% auto;
          animation: gradientFlow 3s linear infinite;
        }

        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .animate-ping {
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
          50% {
            transform: translateY(-5px);
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }

        .animate-bounce {
          animation: bounce 1.5s infinite;
        }

        button:focus {
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }

        button:focus-visible {
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }

        .carousel-arrow:focus,
        .carousel-dot:focus {
          outline: none !important;
          box-shadow: none !important;
          border-color: transparent !important;
        }

        .focus\:ring-0:focus,
        .focus\:ring:focus {
          --tw-ring-color: transparent !important;
          --tw-ring-shadow: 0 0 #0000 !important;
        }
      `}</style>
    </>
  );
};

export default DetalheImovel;
