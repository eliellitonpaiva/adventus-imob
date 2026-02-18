// src/pages/DetalheImovel.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import { visitasService } from "../lib/visitasService";
import { useNotifications } from "../contexts/NotificationContext"; // 👈 ADICIONADO

const DetalheImovel = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { incrementarContador, carregarNotificacoes } = useNotifications(); // 👈 ADICIONADO

  // Estados
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const modalRef = useRef(null);

  const overlayRef = useRef(null);
  const whatsappNumber = "5599988087867";

  // ===== BUSCAR IMÓVEL POR SLUG =====
  useEffect(() => {
    const fetchImovel = async () => {
      try {
        setLoading(true);
        console.log("🟡 Buscando imóvel com slug:", slug);

        // 1º - Busca o imóvel
        const { data: imovelData, error: imovelError } = await supabase
          .from("imoveis")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        // 👇 COLOQUE AQUI
        console.log("Slug recebido:", slug);
        console.log("Imóvel retornado:", imovelData);
        console.log("Erro:", imovelError);

        if (imovelError) throw imovelError;
        if (!imovelData) throw new Error("Imóvel não encontrado");

        // 2º - Se tiver empreendimento, busca separadamente
        if (imovelData.id_edificios) {
          const { data: edificioData } = await supabase
            .from("edificios")
            .select("id, nome, tipo")
            .eq("id", imovelData.id_edificios)
            .maybeSingle();

          if (edificioData) {
            imovelData.edificios = edificioData;
          }
        }

        setImovel(imovelData);
        setFormData((prev) => ({
          ...prev,
          mensagem: `Tenho interesse no imóvel ${imovelData.codigo || ""} - ${imovelData.titulo || ""}. Aguardo informações.`,
        }));
      } catch (err) {
        console.error("❌ Erro:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchImovel();
  }, [slug]);

  // ===== FORMATAR PREÇO =====
  const formatPrice = (price) => {
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
  };

  // ===== FORMATAR FINALIDADE =====
  const formatarFinalidade = (imovel) => {
    if (imovel.finalidade_venda && imovel.finalidade_aluguel) {
      return "Venda e Aluguel";
    }
    if (imovel.finalidade_venda) return "Venda";
    if (imovel.finalidade_aluguel) return "Aluguel";
    return "Venda";
  };

  // ===== EXTRAIR DADOS DO IMÓVEL =====
  const getImovelData = () => {
    if (!imovel) return null;

    const caracteristicas = imovel.caracteristicas || {};
    const dependencias = imovel.dependencias || {};
    const acabamentos = imovel.acabamentos || {};
    const areaLazer = imovel.area_lazer || {};
    const localizacaoVizinhanca = imovel.localizacao_vizinhanca || {};
    const seguranca = imovel.seguranca || imovel.seguranca_utilidades || {};
    const armariosArmazenamento = imovel.armarios_armazenamento || {};
    const servicosUtilidades = imovel.servicos_utilidades || {};
    const diferenciais = imovel.diferenciais || {};
    const etiquetas = imovel.etiquetas || {};

    // 🔥 TÍTULO COMPLETO PARA SEO E CONVERSÃO
    const tituloDetalhe = gerarTituloDetalhe(
      imovel,
      dependencias,
      caracteristicas,
    );

    // 🔥 META TITLE (para SEO)
    const metaTitle = gerarMetaTitle(imovel, dependencias);

    return {
      id: imovel.id,
      slug: imovel.slug,
      codigo: imovel.codigo || "Sem código",
      titulo: imovel.titulo || "Imóvel sem título",
      tituloDetalhe, // 🔥 Título completo para exibição
      metaTitle, // 🔥 Meta title para SEO
      preco: imovel.preco,
      precoFormatado: formatPrice(imovel.preco),
      precoAluguel: imovel.preco_aluguel,
      precoAluguelFormatado: formatPrice(imovel.preco_aluguel),
      finalidade: formatarFinalidade(imovel),
      status: imovel.status,
      tipo: imovel.tipo,
      tipoLabel:
        imovel.tipo?.charAt(0).toUpperCase() + imovel.tipo?.slice(1) || "Casa",
      finalidade_venda: imovel.finalidade_venda,
      finalidade_aluguel: imovel.finalidade_aluguel,
      empreendimento: imovel.edificios || null,
      empreendimento_id: imovel.id_edificios || null,
      endereco: imovel.endereco || "",
      numero: imovel.numero || "",
      complemento: imovel.complemento || "",
      bairro: imovel.bairro || "",
      cidade: imovel.cidade || "",
      estado: imovel.estado || "",
      localizacaoCompleta: `${imovel.bairro || ""}, ${imovel.cidade || ""}${imovel.estado ? ` - ${imovel.estado}` : ""}`,
      enderecoCompleto: `${imovel.endereco || ""}${imovel.numero ? `, ${imovel.numero}` : ""}${imovel.complemento ? ` - ${imovel.complemento}` : ""}`,
      quartos: dependencias.dormitorios || caracteristicas.quartos || 0,
      suites: dependencias.suites || caracteristicas.suites || 0,
      banheiros: dependencias.banheiros || caracteristicas.banheiros || 0,
      vagas: dependencias.vagas || caracteristicas.vagas || 0,
      areaTotal: dependencias.area_total || caracteristicas.areaTotal || 0,
      areaConstruida:
        dependencias.area_construida || caracteristicas.areaConstruida || 0,
      areaUtil: caracteristicas.areaUtil || 0,
      areaPrivativa: caracteristicas.areaPrivativa || 0,
      frenteTerreno: caracteristicas.frenteTerreno || "",
      fundo: caracteristicas.fundo || "",
      lateralEsquerda: caracteristicas.lateralEsquerda || "",
      lateralDireita: caracteristicas.lateralDireita || "",
      peDireito: caracteristicas.peDireito || "",
      topografia: caracteristicas.topografia || "",
      tipoConstrucao: caracteristicas.tipoConstrucao || "",
      anoConstrucao: caracteristicas.anoConstrucao || "",
      numeroPavimentos: caracteristicas.numeroPavimentos || "",
      reformadoRecentemente: caracteristicas.reformadoRecentemente || false,
      imovelAverbado: caracteristicas.imovelAverbado || false,
      financiavel: caracteristicas.financiavel || false,
      aceitaPermuta: caracteristicas.aceitaPermuta || false,
      tipoIluminacao: caracteristicas.tipoIluminacao || "",
      tipoTelhado: caracteristicas.tipoTelhado || "",
      forroLaje: caracteristicas.forroLaje || false,
      sistemaEletricoNovo: caracteristicas.sistemaEletricoNovo || false,
      caixaDAgua: caracteristicas.caixaDAgua || "",
      sistemaEsgoto: caracteristicas.sistemaEsgoto || "",
      aquecimentoAgua: caracteristicas.aquecimentoAgua || "",
      posicaoSolar: caracteristicas.posicaoSolar || "",
      ventilacaoCruzada: caracteristicas.ventilacaoCruzada || false,
      vistaLivre: caracteristicas.vistaLivre || false,
      vistaPermanente: caracteristicas.vistaPermanente || false,
      ruaSemSaida: caracteristicas.ruaSemSaida || false,
      esquinaInfo:
        caracteristicas.esquinaInfo || caracteristicas.esquina || false,
      condominioTaxaMensal: caracteristicas.condominioTaxaMensal || "",
      emCondominio: imovel.em_condominio || false,
      financiado: imovel.financiado || false,
      ocultarPreco: imovel.ocultar_preco || false,
      destaqueSemana: etiquetas.destaqueSemana || false,
      novoSite: etiquetas.novoSite || false,
      baixouPreco: etiquetas.baixouPreco || false,
      financiavelEtiqueta: etiquetas.financiável || false,
      descricao: imovel.descricao || "",
      iptu_anual: imovel.iptu_anual || "",
      caracteristicas,
      acabamentos,
      areaLazer,
      localizacaoVizinhanca,
      seguranca,
      armariosArmazenamento,
      servicosUtilidades,
      diferenciais,
      imagens: [
        imovel.imagem_url ||
          "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1560184897-502a475f7a0d?auto=format&fit=crop&w=1200&h=800&q=80",
        "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=1200&h=800&q=80",
      ],
    };
  };

  // =============== 🎯 GERAR TÍTULO COMPLETO DO DETALHE ===============
  const gerarTituloDetalhe = (imovel, dependencias, caracteristicas) => {
    if (!imovel) return "Imóvel para compra ou aluguel";

    const tipo = imovel.tipo
      ? imovel.tipo.charAt(0).toUpperCase() + imovel.tipo.slice(1)
      : "Imóvel";

    const quartos = parseInt(
      dependencias.dormitorios || caracteristicas.quartos || 0,
    );
    const areaTotal = parseFloat(
      dependencias.area_total || caracteristicas.areaTotal || 0,
    );
    const bairro = imovel.bairro || "";
    const cidade = imovel.cidade || "";
    const estado = imovel.estado || "";

    // Formata a finalidade
    let finalidadeTexto = "";
    if (imovel.finalidade_venda && imovel.finalidade_aluguel) {
      finalidadeTexto = `venda por ${formatPrice(imovel.preco)} ou aluguel por ${formatPrice(imovel.preco_aluguel)}/mês`;
    } else if (imovel.finalidade_venda) {
      finalidadeTexto = `venda por ${formatPrice(imovel.preco)}`;
    } else if (imovel.finalidade_aluguel) {
      finalidadeTexto = `aluguel por ${formatPrice(imovel.preco)}/mês`;
    } else {
      finalidadeTexto = `venda por ${formatPrice(imovel.preco)}`;
    }

    // 🔥 TÍTULO COMPLETO E RICO EM PALAVRAS-CHAVE
    let titulo = `${tipo}`;

    if (quartos > 0) {
      titulo += ` com ${quartos} ${quartos === 1 ? "dormitório" : "dormitórios"}`;
    }

    if (areaTotal > 0) {
      titulo += `, ${areaTotal} m²`;
    }

    titulo += ` - ${finalidadeTexto}`;

    if (bairro && cidade) {
      titulo += ` - ${bairro} - ${cidade}/${estado}`;
    } else if (cidade) {
      titulo += ` - ${cidade}/${estado}`;
    }

    return titulo;
  };

  // =============== 🎯 GERAR META TITLE PARA SEO ===============
  const gerarMetaTitle = (imovel, dependencias) => {
    if (!imovel) return "Imóvel à venda - Adventus Imóveis";

    const tipo = imovel.tipo || "imóvel";
    const bairro = imovel.bairro || "";
    const cidade = imovel.cidade || "";
    const estado = imovel.estado || "";
    const quartos = parseInt(dependencias.dormitorios || 0);

    let titulo = "";

    // Formato: "Casa à venda em Jardim de Alah, Açailândia - 3 quartos | Adventus"
    if (imovel.finalidade_venda && imovel.finalidade_aluguel) {
      titulo = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} à venda e aluguel em`;
    } else if (imovel.finalidade_venda) {
      titulo = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} à venda em`;
    } else if (imovel.finalidade_aluguel) {
      titulo = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} para aluguel em`;
    } else {
      titulo = `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} à venda em`;
    }

    if (bairro) {
      titulo += ` ${bairro},`;
    }

    titulo += ` ${cidade}/${estado}`;

    if (quartos > 0) {
      titulo += ` - ${quartos} ${quartos === 1 ? "quarto" : "quartos"}`;
    }

    titulo += ` | Adventus Imóveis`;

    return titulo;
  };

  // =============== 🎯 GERAR BREADCRUMB ===============
  const gerarBreadcrumb = (dados) => {
    if (!dados) return [];

    const items = [
      { label: "Home", url: "/" },
      {
        label: dados.finalidade_venda ? "Comprar" : "Alugar",
        url: dados.finalidade_venda ? "/comprar" : "/alugar",
      },
    ];

    if (dados.cidade) {
      items.push({
        label: dados.cidade,
        url: dados.finalidade_venda
          ? `/comprar?cidade=${dados.cidade}`
          : `/alugar?cidade=${dados.cidade}`,
      });
    }

    if (dados.bairro) {
      items.push({
        label: dados.bairro,
        url: dados.finalidade_venda
          ? `/comprar?cidade=${dados.cidade}&bairro=${dados.bairro}`
          : `/alugar?cidade=${dados.cidade}&bairro=${dados.bairro}`,
      });
    }

    items.push({ label: dados.codigo, url: "#", active: true });

    return items;
  };

  // ===== GERAR ITENS DOS ACORDEÕES =====
  const gerarDadosAcordeao = (dados) => {
    if (!dados || !imovel) return [];

    const caracteristicas = dados.caracteristicas || {};
    const acabamentos = dados.acabamentos || {};
    const areaLazer = dados.areaLazer || {};
    const localizacaoVizinhanca = dados.localizacaoVizinhanca || {};
    const seguranca = dados.seguranca || {};
    const armariosArmazenamento = dados.armariosArmazenamento || {};
    const servicosUtilidades = dados.servicosUtilidades || {};
    const diferenciais = dados.diferenciais || {};

    const acordeoes = [];

    // CARACTERÍSTICAS DO IMÓVEL
    const itensCaracteristicas = [];
    if (dados.areaUtil > 0)
      itensCaracteristicas.push(`Área útil: ${dados.areaUtil} m²`);
    if (dados.areaPrivativa > 0)
      itensCaracteristicas.push(`Área privativa: ${dados.areaPrivativa} m²`);
    if (dados.areaTotal > 0)
      itensCaracteristicas.push(`Área total: ${dados.areaTotal} m²`);
    if (dados.areaConstruida > 0)
      itensCaracteristicas.push(`Área construída: ${dados.areaConstruida} m²`);
    if (dados.frenteTerreno)
      itensCaracteristicas.push(`Frente do terreno: ${dados.frenteTerreno}`);
    if (dados.fundo) itensCaracteristicas.push(`Fundo: ${dados.fundo}`);
    if (dados.lateralEsquerda)
      itensCaracteristicas.push(`Lateral esquerda: ${dados.lateralEsquerda}`);
    if (dados.lateralDireita)
      itensCaracteristicas.push(`Lateral direita: ${dados.lateralDireita}`);
    if (dados.peDireito)
      itensCaracteristicas.push(`Pé direito: ${dados.peDireito}`);
    if (dados.topografia)
      itensCaracteristicas.push(`Topografia: ${dados.topografia}`);
    if (dados.esquinaInfo) itensCaracteristicas.push(`Esquina: Sim`);
    if (dados.tipoConstrucao)
      itensCaracteristicas.push(`Tipo de construção: ${dados.tipoConstrucao}`);
    if (dados.anoConstrucao)
      itensCaracteristicas.push(`Ano de construção: ${dados.anoConstrucao}`);
    if (dados.numeroPavimentos > 0)
      itensCaracteristicas.push(
        `${dados.numeroPavimentos} pavimento${dados.numeroPavimentos !== 1 ? "s" : ""}`,
      );
    if (dados.reformadoRecentemente)
      itensCaracteristicas.push(`Reformado recentemente`);
    if (dados.imovelAverbado) itensCaracteristicas.push(`Imóvel averbado`);
    if (dados.financiavel) itensCaracteristicas.push(`Financiável`);
    if (dados.aceitaPermuta) itensCaracteristicas.push(`Aceita permuta`);
    if (dados.tipoIluminacao)
      itensCaracteristicas.push(`Iluminação: ${dados.tipoIluminacao}`);
    if (dados.tipoTelhado)
      itensCaracteristicas.push(`Telhado: ${dados.tipoTelhado}`);
    if (dados.forroLaje) itensCaracteristicas.push(`Forro em laje`);
    if (dados.sistemaEletricoNovo)
      itensCaracteristicas.push(`Sistema elétrico novo`);
    if (dados.caixaDAgua)
      itensCaracteristicas.push(`Caixa d'água: ${dados.caixaDAgua} litros`);
    if (dados.sistemaEsgoto) {
      const labels = {
        rede_publica: "Rede pública",
        fossa_septica: "Fossa séptica",
        fossa_filtro: "Fossa e filtro",
      };
      itensCaracteristicas.push(
        `Esgoto: ${labels[dados.sistemaEsgoto] || dados.sistemaEsgoto}`,
      );
    }
    if (dados.aquecimentoAgua) {
      const labels = {
        gas: "Gás",
        solar: "Solar",
        eletrico: "Elétrico",
        central: "Central",
      };
      itensCaracteristicas.push(
        `Aquecimento: ${labels[dados.aquecimentoAgua] || dados.aquecimentoAgua}`,
      );
    }
    if (dados.posicaoSolar) {
      const labels = {
        nascente: "Nascente",
        poente: "Poente",
        norte: "Norte",
        sul: "Sul",
      };
      itensCaracteristicas.push(
        `Posição solar: ${labels[dados.posicaoSolar] || dados.posicaoSolar}`,
      );
    }
    if (dados.ventilacaoCruzada)
      itensCaracteristicas.push(`Ventilação cruzada`);
    if (dados.vistaLivre) itensCaracteristicas.push(`Vista livre`);
    if (dados.vistaPermanente) itensCaracteristicas.push(`Vista permanente`);
    if (dados.ruaSemSaida) itensCaracteristicas.push(`Rua sem saída`);
    if (dados.condominioTaxaMensal)
      itensCaracteristicas.push(
        `Taxa de condomínio: R$ ${dados.condominioTaxaMensal}`,
      );

    if (itensCaracteristicas.length > 0) {
      acordeoes.push({
        titulo: "Características do Imóvel",
        icone: "fas fa-home",
        itens: itensCaracteristicas,
      });
    }

    // ACABAMENTOS
    const itensAcabamentos = [];
    Object.entries(acabamentos)
      .filter(([key, value]) => value === true && key.startsWith("piso"))
      .forEach(([key]) => {
        const labels = {
          pisoPorcelanato: "Porcelanato",
          pisoCeramica: "Cerâmica",
          pisoLaminado: "Piso laminado",
          pisoVinilico: "Piso vinílico",
          pisoMadeiraMaciça: "Madeira maciça",
          pisoTaco: "Taco",
          pisoCimentoQueimado: "Cimento queimado",
          pisoMarmore: "Mármore",
          pisoGranito: "Granito",
          pisoFrio: "Piso frio",
        };
        itensAcabamentos.push(`Piso: ${labels[key] || key}`);
      });
    Object.entries(acabamentos)
      .filter(
        ([key, value]) => value === true && key.startsWith("revestimento"),
      )
      .forEach(([key]) => {
        const labels = {
          revestimentoAzulejo: "Azulejo",
          revestimentoPastilha: "Pastilha",
          revestimentoPorcelanato: "Porcelanato em parede",
          revestimentoPedraNatural: "Pedra natural",
          revestimentoPapelParede: "Papel de parede",
          revestimento3D: "Revestimento 3D",
        };
        itensAcabamentos.push(`Revestimento: ${labels[key] || key}`);
      });
    Object.entries(acabamentos)
      .filter(([key, value]) => value === true && key.startsWith("teto"))
      .forEach(([key]) => {
        const labels = {
          tetoGessoRebaixado: "Gesso rebaixado",
          tetoSancaGesso: "Sanca de gesso",
          tetoForroPVC: "Forro de PVC",
          tetoLaje: "Laje",
        };
        itensAcabamentos.push(`Teto/forro: ${labels[key] || key}`);
      });
    Object.entries(acabamentos)
      .filter(
        ([key, value]) =>
          value === true &&
          (key.startsWith("porta") || key.startsWith("esquadria")),
      )
      .forEach(([key]) => {
        const labels = {
          portaMadeiraMaciça: "Porta de madeira maciça",
          portaLaqueada: "Porta laqueada",
          esquadriaAluminio: "Esquadrias de alumínio",
          esquadriaPVC: "Esquadrias de PVC",
          portaPivotante: "Porta pivotante",
        };
        itensAcabamentos.push(labels[key] || key);
      });
    Object.entries(acabamentos)
      .filter(([key, value]) => value === true && key.startsWith("bancada"))
      .forEach(([key]) => {
        const labels = {
          bancadaGranito: "Bancada de granito",
          bancadaMarmore: "Bancada de mármore",
          bancadaQuartzo: "Bancada de quartzo",
          bancadaNanoglass: "Bancada de nanoglass",
        };
        itensAcabamentos.push(labels[key] || key);
      });
    if (itensAcabamentos.length > 0) {
      acordeoes.push({
        titulo: "Acabamentos",
        icone: "fas fa-paint-roller",
        itens: itensAcabamentos,
      });
    }

    // ÁREA DE LAZER
    const itensAreaLazer = Object.entries(areaLazer)
      .filter(([_, value]) => value === true)
      .map(([key]) => {
        const labels = {
          piscina: "Piscina",
          churrasqueira: "Churrasqueira",
          espacoGourmet: "Espaço gourmet",
          salaoFestas: "Salão de festas",
          salaoJogos: "Salão de jogos",
          academia: "Academia",
          playground: "Playground",
          quadraPoliesportiva: "Quadra poliesportiva",
          campoSociety: "Campo society",
          areaVerde: "Área verde",
          jardim: "Jardim",
          deck: "Deck",
          rooftop: "Rooftop",
          sauna: "Sauna",
          espacoPet: "Espaço pet",
          brinquedoteca: "Brinquedoteca",
        };
        return labels[key] || key;
      });
    if (itensAreaLazer.length > 0) {
      acordeoes.push({
        titulo: "Área de Lazer",
        icone: "fas fa-swimming-pool",
        itens: itensAreaLazer,
      });
    }

    // LOCALIZAÇÃO E VIZINHANÇA
    const itensLocalizacao = Object.entries(localizacaoVizinhanca)
      .filter(([_, value]) => value === true)
      .map(([key]) => {
        const labels = {
          proximoCentro: "Próximo ao centro",
          proximoSupermercado: "Próximo a supermercado",
          proximoEscola: "Próximo a escola",
          proximoHospital: "Próximo a hospital",
          proximoFarmacia: "Próximo a farmácia",
          proximoOnibus: "Próximo a ponto de ônibus",
          proximoShopping: "Próximo a shopping",
          proximoFaculdade: "Próximo a faculdade",
          bairroResidencial: "Bairro residencial",
          bairroComercial: "Bairro comercial",
          ruaAsfaltada: "Rua asfaltada",
          ruaTranquila: "Rua tranquila",
          regiaoValorizada: "Região valorizada",
        };
        return labels[key] || key;
      });
    if (itensLocalizacao.length > 0) {
      acordeoes.push({
        titulo: "Localização & Vizinhança",
        icone: "fas fa-map-marker-alt",
        itens: itensLocalizacao,
      });
    }

    // SEGURANÇA
    const itensSeguranca = Object.entries(seguranca)
      .filter(([_, value]) => value === true)
      .map(([key]) => {
        const labels = {
          portaoEletronico: "Portão eletrônico",
          interfone: "Interfone",
          cercaEletrica: "Cerca elétrica",
          sistemaCameras: "Sistema de câmeras",
          alarme: "Alarme",
          portaria24h: "Portaria 24h",
          vigilancia24h: "Vigilância 24h",
          controleAcesso: "Controle de acesso",
          fechaduraDigital: "Fechadura digital",
          condominioFechado: "Condomínio fechado",
          murosAltos: "Muros altos",
        };
        return labels[key] || key;
      });
    if (itensSeguranca.length > 0) {
      acordeoes.push({
        titulo: "Segurança",
        icone: "fas fa-shield-alt",
        itens: itensSeguranca,
      });
    }

    // ARMÁRIOS E ARMAZENAMENTO
    const itensArmarios = Object.entries(armariosArmazenamento)
      .filter(([_, value]) => value === true)
      .map(([key]) => {
        const labels = {
          armarioCozinhaPlanejado: "Armário de cozinha planejado",
          armariosEmbutidos: "Armários embutidos",
          armariosQuarto: "Armários no quarto",
          armariosBanheiro: "Armários no banheiro",
          closet: "Closet",
          despensa: "Despensa",
          deposito: "Depósito",
          roupeiro: "Roupeiro",
          maleiro: "Maleiro",
        };
        return labels[key] || key;
      });
    if (itensArmarios.length > 0) {
      acordeoes.push({
        titulo: "Armários e Armazenamento",
        icone: "fas fa-boxes",
        itens: itensArmarios,
      });
    }

    // SERVIÇOS E UTILIDADES
    const itensServicos = Object.entries(servicosUtilidades)
      .filter(([_, value]) => value === true)
      .map(([key]) => {
        const labels = {
          aguaEncanada: "Água encanada",
          energiaEletrica: "Energia elétrica",
          pocoArtesiano: "Poço artesiano",
          aquecimentoGas: "Aquecimento a gás",
          aquecimentoSolar: "Aquecimento solar",
          gasEncanado: "Gás encanado",
          arCondicionadoInstalado: "Ar-condicionado instalado",
          infraArCondicionado: "Infra para ar-condicionado",
          internetFibra: "Internet fibra disponível",
          iluminacaoLED: "Iluminação em LED",
          energiaSolar: "Sistema de energia solar",
          elevador: "Elevador",
          coletaLixo: "Coleta de lixo regular",
        };
        return labels[key] || key;
      });
    if (itensServicos.length > 0) {
      acordeoes.push({
        titulo: "Serviços e Utilidades",
        icone: "fas fa-bolt",
        itens: itensServicos,
      });
    }

    // DIFERENCIAIS DO IMÓVEL
    const itensDiferenciais = Object.entries(diferenciais)
      .filter(([_, value]) => value === true)
      .map(([key]) => {
        const labels = {
          varanda: "Varanda",
          sacada: "Sacada",
          lavabo: "Lavabo",
          banheira: "Banheira",
          boxVidro: "Box de vidro",
          dependenciaEmpregada: "Dependência de empregada",
          escritorio: "Escritório",
          peDireitoDuplo: "Pé direito duplo",
          mezanino: "Mezanino",
          vistaPanoramica: "Vista panorâmica",
        };
        return labels[key] || key;
      });
    if (itensDiferenciais.length > 0) {
      acordeoes.push({
        titulo: "Diferenciais do Imóvel",
        icone: "fas fa-star",
        itens: itensDiferenciais,
      });
    }

    return acordeoes;
  };

  const dados = getImovelData();
  const dadosAcordeao = dados ? gerarDadosAcordeao(dados) : [];
  const breadcrumbItems = dados ? gerarBreadcrumb(dados) : [];

  // ===== CONTROLES DO MODAL =====
  useEffect(() => {
    if (modalAberto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
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

  // ===== AUTO-PLAY CARROSSEL =====
  useEffect(() => {
    if (!dados?.imagens?.length) return;
    const intervalo = setInterval(() => {
      setImagemAtual((prev) => (prev + 1) % dados.imagens.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [dados?.imagens?.length]);

  const mudarImagem = (direcao) => {
    if (!dados?.imagens?.length) return;
    setImagemAtual(
      (prev) => (prev + direcao + dados.imagens.length) % dados.imagens.length,
    );
  };

  const abrirModal = () => setModalAberto(true);

  const fecharModal = () => {
    setModalAberto(false);
    setEnviado(false);
    setFormData({
      nome: "",
      telefone: "",
      email: "",
      mensagem: dados?.titulo
        ? `Tenho interesse no imóvel ${dados.codigo} - ${dados.titulo}. Aguardo informações.`
        : "",
      horarioPreferencia: "",
      diaSemana: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ===== HANDLE SUBMIT MODIFICADO (COM NOTIFICAÇÃO) =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    try {
      // Validação dos campos obrigatórios
      if (
        !formData.nome ||
        !formData.telefone ||
        !formData.email ||
        !formData.diaSemana ||
        !formData.horarioPreferencia
      ) {
        throw new Error("Por favor, preencha todos os campos obrigatórios");
      }

      // Data da visita (7 dias após o agendamento)
      const dataVisita = new Date();
      dataVisita.setDate(dataVisita.getDate() + 7);

      // 👇 LOG DOS DADOS ENVIADOS
      console.log("📤 Enviando visita:", {
        imovel_id: dados.id,
        nome_cliente: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        data_visita: dataVisita.toISOString(),
        dia_preferencia: formData.diaSemana,
        horario_preferencia: formData.horarioPreferencia,
      });

      // 🔥 CHAMADA AO SERVIÇO DE VISITAS
      const { data, error } = await visitasService.criarVisita({
        imovel_id: dados.id,
        nome_cliente: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        data_visita: dataVisita.toISOString(),
        dia_preferencia: formData.diaSemana,
        horario_preferencia: formData.horarioPreferencia,
      });

      // 👇 LOG DA RESPOSTA
      console.log("📥 Resposta do serviço:", { data, error });

      if (error) throw error;

      // 🔥 ATUALIZA NOTIFICAÇÕES
      incrementarContador("visitas");
      console.log("✅ Visita agendada com sucesso! Notificação atualizada.");

      // Sucesso
      setEnviado(true);
      setEnviando(false);
      setTimeout(fecharModal, 3000);
    } catch (error) {
      console.error("❌ Erro ao agendar visita:", error);
      setEnviando(false);
      alert(error.message || "Erro ao enviar. Tente novamente.");
    }
  };

  // ===== ATUALIZAR TÍTULO DA PÁGINA =====
  useEffect(() => {
    if (dados) {
      document.title =
        dados.metaTitle || "Detalhes do Imóvel | Adventus Imóveis";
    }
  }, [dados]);

  // ===== LOADING =====
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

  // ===== ERROR =====
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

  const imagens = dados.imagens || [];

  return (
    <>
      {/* ===== BREADCRUMB ===== */}
      <div className="bg-gray-100 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center text-xs md:text-sm text-gray-600">
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                {item.active ? (
                  <span className="font-semibold text-[#D4A24D]">
                    {item.label}
                  </span>
                ) : (
                  <a
                    href={item.url}
                    className="hover:text-[#D4A24D] transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ===== GALERIA DE FOTOS ===== */}
      <section className="mb-0">
        <div className="relative w-full">
          <div className="relative h-[380px] md:h-[540px] lg:h-[560px] w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-500 ease-out"
              style={{
                backgroundImage: `url('${imagens[imagemAtual] || imagens[0]}')`,
              }}
            />
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {imagens.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setImagemAtual(index)}
                  className={`
                    w-3 h-3 md:w-3.5 md:h-3.5 
                    rounded-full transition-all duration-300 
                    border-2 border-white/30
                    focus:outline-none focus:ring-0
                    ${
                      imagemAtual === index
                        ? `bg-[#D4A24D] scale-110 shadow-[0_0_10px_rgba(212,162,77,0.8)] border-white`
                        : "bg-white/90 hover:bg-white hover:scale-105"
                    }
                  `}
                  aria-label={`Ir para imagem ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={() => mudarImagem(-1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#D4A24D] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-20 focus:outline-none focus:ring-0"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={() => mudarImagem(1)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-[#D4A24D] w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 z-20 focus:outline-none focus:ring-0"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      {/* ===== CABEÇALHO DO IMÓVEL ===== */}
      <section className="bg-[#31353E] text-white pt-8 pb-12 md:pt-10 md:pb-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="flex flex-col justify-center">
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

              {dados.empreendimento?.nome && (
                <div className="self-start mb-4">
                  <div className="inline-flex items-center bg-[#D4A24D]/20 text-[#D4A24D] border border-[#D4A24D]/30 px-4 py-2 rounded-full text-sm font-semibold">
                    <i className="fas fa-building mr-2"></i>
                    <span>{dados.empreendimento.nome}</span>
                  </div>
                </div>
              )}

              {dados.emCondominio && !dados.empreendimento?.nome && (
                <div className="self-start mb-4">
                  <div className="inline-flex items-center bg-[#D4A24D]/20 text-[#D4A24D] border border-[#D4A24D]/30 px-3 py-1 rounded-full text-xs font-semibold">
                    <i className="fas fa-building mr-1.5 text-[10px]"></i>
                    <span>Em condomínio</span>
                  </div>
                </div>
              )}

              {/* 🔥🔥🔥 TÍTULO COMPLETO OTIMIZADO! */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                {dados.tituloDetalhe}
              </h1>

              <div className="text-sm text-gray-300 mb-2 flex flex-wrap items-center gap-2">
                <span>Código: {dados.codigo}</span>
                {dados.financiavel && (
                  <span className="bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded-full text-xs border border-blue-500/50">
                    <i className="fas fa-check-circle mr-1 text-[10px]"></i>
                    Financiável
                  </span>
                )}
                {dados.aceitaPermuta && (
                  <span className="bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full text-xs border border-purple-500/50">
                    <i className="fas fa-exchange-alt mr-1 text-[10px]"></i>
                    Aceita permuta
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 text-white mb-5">
                <i className="fas fa-map-marker-alt text-[#D4A24D] text-sm"></i>
                <span className="text-sm md:text-base">
                  <strong>{dados.localizacaoCompleta}</strong>
                  {dados.endereco && ` - ${dados.enderecoCompleto}`}
                </span>
              </div>

              <div className="mb-6">
                <div className="text-3xl md:text-4xl font-black text-white">
                  {dados.ocultarPreco
                    ? "Preço sob consulta"
                    : dados.precoFormatado}
                </div>

                {/* 🔥 Se tiver aluguel, mostra também */}
                {dados.finalidade_aluguel &&
                  dados.precoAluguel &&
                  !dados.ocultarPreco && (
                    <div className="text-lg md:text-xl text-gray-300 mt-1">
                      ou{" "}
                      <span className="font-bold text-white">
                        {dados.precoAluguelFormatado}/mês
                      </span>{" "}
                      para aluguel
                    </div>
                  )}

                <div className="my-4">
                  <div className="w-full border-t border-dashed border-[#D4A24D]/40"></div>
                </div>
              </div>

              {/* ÍCONES DE CARACTERÍSTICAS - ORIGINAL */}
              <div className="grid grid-cols-3 md:flex md:flex-wrap justify-center md:justify-start gap-3 md:gap-4 text-white">
                {dados.quartos > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-bed text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="h-[44px] flex flex-col items-center justify-center">
                      <div className="text-base font-light leading-tight">
                        {dados.quartos}{" "}
                        {dados.quartos === 1 ? "Quarto" : "Quartos"}
                      </div>
                    </div>
                  </div>
                )}

                {dados.banheiros > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-bath text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="h-[44px] flex flex-col items-center justify-center">
                      <div className="text-base font-light leading-tight">
                        {dados.banheiros}{" "}
                        {dados.banheiros === 1 ? "Banheiro" : "Banheiros"}
                      </div>
                    </div>
                  </div>
                )}

                {dados.suites > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-crown text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="h-[44px] flex flex-col items-center justify-center">
                      <div className="text-base font-light leading-tight">
                        {dados.suites} {dados.suites === 1 ? "Suíte" : "Suítes"}
                      </div>
                    </div>
                  </div>
                )}

                {dados.vagas > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-car text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="h-[44px] flex flex-col items-center justify-center">
                      <div className="text-base font-light leading-tight">
                        {dados.vagas} {dados.vagas === 1 ? "Vaga" : "Vagas"}
                      </div>
                    </div>
                  </div>
                )}

                {dados.areaTotal > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-arrows-alt text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="h-[44px] flex flex-col items-center justify-center">
                      <div className="text-base font-light leading-tight">
                        {dados.areaTotal} m²
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-300 font-light leading-tight mt-0.5">
                        Total
                      </div>
                    </div>
                  </div>
                )}

                {dados.areaConstruida > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-building text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="h-[44px] flex flex-col items-center justify-center">
                      <div className="text-base font-light leading-tight">
                        {dados.areaConstruida} m²
                      </div>
                      <div className="text-[10px] md:text-xs text-gray-300 font-light leading-tight mt-0.5">
                        Construída
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUNA DA DIREITA - PERFORMANCE */}
            <div className="relative flex items-center justify-center">
              <div className="hidden lg:block absolute -left-6 top-0 bottom-0 w-px">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
              </div>
              <div className="lg:pl-8 w-full">
                <div className="bg-gradient-to-br from-[#2a2e36]/60 via-[#2a2e36]/50 to-[#D4A24D]/5 backdrop-blur-sm rounded-xl p-6 border border-[#D4A24D]/10 shadow-lg shadow-[#D4A24D]/5 relative overflow-hidden">
                  <div className="light-sweep-premium"></div>
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                  <div className="text-center relative z-10">
                    <div className="flex justify-center mb-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-[#D4A24D]/15 to-[#E6B85C]/10 flex items-center justify-center border border-[#D4A24D]/15 shadow-inner shadow-[#D4A24D]/10 pulse-wave">
                        <i className="fas fa-exclamation-circle text-[#D4A24D]/90 text-2xl"></i>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-5xl md:text-6xl font-black text-white leading-tight">
                        1.247
                      </div>
                      <div className="text-xs font-semibold text-[#E6B85C] mt-2 tracking-wider">
                        VISUALIZAÇÕES TOTAIS
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mt-4 max-w-xs mx-auto font-light">
                      Este imóvel tem atraído muita atenção desde sua
                      publicação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 md:py-8"></div>

      {/* ===== ACORDEÕES ===== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          {dadosAcordeao.length > 0 ? (
            dadosAcordeao.map((acordeao, index) => (
              <div
                key={index}
                className="border-b border-gray-300 last:border-b-0"
              >
                <button
                  onClick={(e) => {
                    const button = e.currentTarget;
                    const content = button.nextElementSibling;
                    const arrow = button.querySelector(".fa-chevron-down");

                    document
                      .querySelectorAll(".accordion-content-tailwind")
                      .forEach(function (el) {
                        if (el !== content) {
                          el.classList.remove("!max-h-[500px]", "!p-6");
                          el.classList.add("!max-h-0", "!p-0");
                          const btn = el.previousElementSibling;
                          if (btn) {
                            const arr = btn.querySelector(".fa-chevron-down");
                            if (arr) arr.style.transform = "rotate(0deg)";
                          }
                        }
                      });

                    if (content.classList.contains("!max-h-[500px]")) {
                      content.classList.remove("!max-h-[500px]", "!p-6");
                      content.classList.add("!max-h-0", "!p-0");
                      arrow.style.transform = "rotate(0deg)";
                    } else {
                      content.classList.remove("!max-h-0", "!p-0");
                      content.classList.add("!max-h-[500px]", "!p-6");
                      arrow.style.transform = "rotate(180deg)";
                    }
                  }}
                  className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-0 focus:border-transparent focus:shadow-none outline-none ring-0 border-0"
                >
                  <span className="flex items-center space-x-3">
                    <i
                      className={`${acordeao.icone} text-[#D4A24D] text-xl`}
                    ></i>
                    <span className="font-semibold text-gray-800">
                      {acordeao.titulo}
                    </span>
                  </span>
                  <i className="fas fa-chevron-down text-[#D4A24D] transition-transform duration-300"></i>
                </button>

                <div className="accordion-content-tailwind overflow-hidden transition-all duration-400 !max-h-0 !p-0 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {acordeao.itens.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center space-x-2 py-1.5"
                      >
                        <span className="text-green-600 font-bold">✓</span>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-500">
              Nenhuma característica adicional cadastrada para este imóvel.
            </div>
          )}
        </div>
      </section>

      <div className="py-6 md:py-8"></div>

      {/* ===== CTA SECTION ===== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#31353E] text-white rounded-xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#D4A24D]/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="p-10 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
                <div className="pb-10 lg:pb-0 lg:pr-8 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-gray-600">
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#D4A24D]">
                      Dúvida rápida?
                    </h2>
                    <p className="text-gray-300 mb-6 text-sm md:text-base font-light leading-relaxed max-w-md">
                      Resolva suas dúvidas em poucos minutos!
                    </p>
                    <div className="relative mb-8">
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel ${dados.codigo} - ${dados.titulo} e gostaria de mais informações.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-whatsapp-premium inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm md:text-base font-semibold rounded-lg hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 space-x-2 shadow-md relative overflow-hidden group whitespace-nowrap focus:outline-none focus:ring-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <i className="fab fa-whatsapp text-base"></i>
                        <span>Falar agora no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-2/3">
                  <div className="h-full w-[0.5px] bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
                </div>
                <div className="pt-10 lg:pt-0 lg:pl-8 flex flex-col justify-center">
                  <div className="flex flex-col items-center text-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                      Atendimento personalizado
                    </h2>
                    <p className="text-gray-300 mb-6 text-sm md:text-base font-light leading-relaxed max-w-md">
                      Conheça todos os detalhes do imóvel pessoalmente
                    </p>
                    <div className="relative">
                      <button
                        onClick={abrirModal}
                        className="btn-visita-premium inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#D4A24D] to-[#E6B85C] text-white text-sm md:text-base font-semibold rounded-lg hover:from-[#C4933E] hover:to-[#D4A24D] hover:shadow-lg transition-all duration-300 space-x-2 shadow-md relative overflow-hidden group whitespace-nowrap focus:outline-none focus:ring-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <i className="fas fa-calendar-alt text-base"></i>
                        <span>Solicitar visita ao imóvel</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-[0.5px] bg-gradient-to-r from-transparent via-[#D4A24D] to-transparent"></div>
            <div className="bg-white p-4 md:p-5 rounded-b-xl">
              <div className="text-center">
                <p className="text-[#31353E] text-sm font-light flex items-center justify-center">
                  <i
                    className="far fa-clock text-[#D4A24D] mr-2 text-sm relative"
                    style={{ top: "-1px" }}
                  ></i>
                  <span className="relative" style={{ top: "0px" }}>
                    Atendimento de segunda a sexta, das 8h às 18h
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 md:py-8"></div>

      {/* ===== MODAL ===== */}
      {modalAberto && (
        <>
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
            onClick={fecharModal}
            style={{ cursor: "pointer" }}
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
                      <h3 className="text-base md:text-lg font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                        Agendar visita - {dados.codigo}
                      </h3>
                    </div>
                    <button
                      onClick={fecharModal}
                      className="bg-white/20 hover:bg-white/30 text-white text-lg md:text-xl transition-colors rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center shadow-md flex-shrink-0 ml-2 focus:outline-none focus:ring-0"
                      aria-label="Fechar"
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
                        Em breve nosso corretor entrará em contato para combinar
                        o melhor horário.
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 mt-4">
                        Esta janela será fechada automaticamente...
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-user text-gray-400"></i>
                        </div>
                        <input
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Digite seu nome completo *"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-phone text-gray-400"></i>
                        </div>
                        <input
                          type="tel"
                          name="telefone"
                          value={formData.telefone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base bg-white text-gray-900 placeholder-gray-500"
                          placeholder="WhatsApp com DDD *"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-envelope text-gray-400"></i>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Seu melhor Email *"
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-calendar-day text-gray-400"></i>
                        </div>
                        <select
                          name="diaSemana"
                          value={formData.diaSemana}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base appearance-none bg-white text-gray-900"
                        >
                          <option value="" className="text-gray-500">
                            Selecione o melhor dia para visita *
                          </option>
                          <option value="segunda" className="text-gray-900">
                            Segunda-feira
                          </option>
                          <option value="terca" className="text-gray-900">
                            Terça-feira
                          </option>
                          <option value="quarta" className="text-gray-900">
                            Quarta-feira
                          </option>
                          <option value="quinta" className="text-gray-900">
                            Quinta-feira
                          </option>
                          <option value="sexta" className="text-gray-900">
                            Sexta-feira
                          </option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <i className="fas fa-chevron-down text-gray-400"></i>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="fas fa-clock text-gray-400"></i>
                        </div>
                        <select
                          name="horarioPreferencia"
                          value={formData.horarioPreferencia}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base appearance-none bg-white text-gray-900"
                        >
                          <option value="" className="text-gray-500">
                            Selecione o melhor horário *
                          </option>
                          <option value="manha" className="text-gray-900">
                            Manhã (8h às 12h)
                          </option>
                          <option value="tarde" className="text-gray-900">
                            Tarde (14h às 18h)
                          </option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <i className="fas fa-chevron-down text-gray-400"></i>
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute top-3 left-3">
                          <i className="fas fa-comment text-gray-400"></i>
                        </div>
                        <textarea
                          name="mensagem"
                          value={formData.mensagem}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none transition text-sm md:text-base bg-white text-gray-900 placeholder-gray-500"
                          placeholder="Mensagem adicional (opcional)"
                        />
                      </div>

                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={enviando}
                          className={`w-full py-3 rounded-lg font-medium text-base transition-all duration-300 flex items-center justify-center space-x-2 ${
                            enviando
                              ? "bg-gray-400 cursor-not-allowed text-white"
                              : "bg-[#D4A24D] hover:bg-[#C4933E] text-white hover:shadow-md shadow-sm focus:outline-none focus:ring-0"
                          }`}
                        >
                          {enviando ? (
                            <>
                              <i className="fas fa-spinner fa-spin text-sm"></i>
                              <span>Enviando...</span>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-calendar-check text-sm"></i>
                              <span>Solicitar Visita Agendada</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== ESTILOS GLOBAIS ===== */}
      <style jsx="true" global="true">{`
        @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap");
        @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");

        body {
          font-family: "Montserrat", sans-serif;
          background: #f8f9fa;
          color: #333;
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

        .btn-whatsapp-premium:hover,
        .btn-visita-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2) !important;
        }
      `}</style>
    </>
  );
};

export default DetalheImovel;
