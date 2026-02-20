// ============================================================================
// DETALHE DO IMÓVEL
// ============================================================================
// Arquivo: src/pages/DetalheImovel.jsx
// Descrição: Página de detalhamento completo do imóvel com sistema de
//            rastreamento de interações (visualizações, WhatsApp, visitas)
// ============================================================================

import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "/src/lib/supabase";
import { visitasService } from "../lib/visitasService";
import { useNotifications } from "../contexts/NotificationContext";

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================
const DetalheImovel = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { incrementarContador, carregarNotificacoes } = useNotifications();

  // ==========================================================================
  // ESTADOS DO COMPONENTE
  // ==========================================================================
  const [imovel, setImovel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visualizacoes, setVisualizacoes] = useState(0);

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

  // Estado para controle dos acordeões
  const [acordeoesAbertos, setAcordeoesAbertos] = useState({});

  // Refs
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

  // Constantes
  const whatsappNumber = "5599988087867";

  // ==========================================================================
  // FUNÇÕES DE RASTREAMENTO - SISTEMA DE PERFORMANCE
  // ==========================================================================

  /**
   * Registra uma visualização da página do imóvel
   */
  const registrarVisualizacao = async (imovelId) => {
    try {
      console.log(
        "👁️ [RASTREAMENTO] Registrando visualização para imóvel:",
        imovelId,
      );

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

      console.log("✅ [RASTREAMENTO] Visualização registrada!");
    } catch (error) {
      console.error("❌ Erro ao registrar visualização:", error);
    }
  };

  /**
   * Busca o total de visualizações do banco
   */
  const buscarVisualizacoes = async (imovelId) => {
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
  };

  /**
   * Registra um clique no botão do WhatsApp
   */
  const registrarCliqueWhatsApp = async (imovelId) => {
    try {
      console.log(
        "📱 [RASTREAMENTO] Registrando clique WhatsApp para imóvel:",
        imovelId,
      );

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

      console.log("✅ [RASTREAMENTO] Clique WhatsApp registrado!");
    } catch (error) {
      console.error("❌ Erro ao registrar clique WhatsApp:", error);
    }
  };

  /**
   * Registra uma solicitação de visita e cria um interessado ativo
   */
  const registrarSolicitacaoVisita = async (
    imovelId,
    dadosVisita,
    visitaId,
  ) => {
    try {
      console.log(
        "🏠 [RASTREAMENTO] Registrando solicitação de visita para imóvel:",
        imovelId,
      );

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

      console.log("✅ [RASTREAMENTO] Solicitação de visita registrada!");
    } catch (error) {
      console.error("❌ Erro ao registrar solicitação de visita:", error);
    }
  };

  // ==========================================================================
  // FUNÇÕES DE BUSCA DE DADOS
  // ==========================================================================

  useEffect(() => {
    const fetchImovel = async () => {
      try {
        setLoading(true);
        console.log("🟡 Buscando imóvel com slug:", slug);

        const { data: imovelData, error: imovelError } = await supabase
          .from("imoveis")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();

        if (imovelError) throw imovelError;
        if (!imovelData) throw new Error("Imóvel não encontrado");

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

        // Rastreamento de visualização
        await registrarVisualizacao(imovelData.id);
        await buscarVisualizacoes(imovelData.id);

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

  // ==========================================================================
  // FUNÇÕES DE FORMATAÇÃO
  // ==========================================================================

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

  const formatarFinalidade = (imovel) => {
    if (imovel.finalidade_venda && imovel.finalidade_aluguel)
      return "Venda e Aluguel";
    if (imovel.finalidade_venda) return "Venda";
    if (imovel.finalidade_aluguel) return "Aluguel";
    return "Venda";
  };

  // ==========================================================================
  // FUNÇÕES DE EXTRAÇÃO DE DADOS
  // ==========================================================================

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

    return {
      id: imovel.id,
      slug: imovel.slug,
      codigo: imovel.codigo || "Sem código",
      titulo: imovel.titulo || "Imóvel sem título",
      preco: imovel.preco,
      precoFormatado: formatPrice(imovel.preco),
      precoAluguel: imovel.preco_aluguel,
      precoAluguelFormatado: formatPrice(imovel.preco_aluguel),
      finalidade: formatarFinalidade(imovel),
      status: imovel.status,
      tipo: imovel.tipo,
      finalidade_venda: imovel.finalidade_venda,
      finalidade_aluguel: imovel.finalidade_aluguel,
      empreendimento: imovel.edificios || null,
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
      destaqueSemana: etiquetas.destaqueSemana || false,
      emCondominio: imovel.em_condominio || false,
      ocultarPreco: imovel.ocultar_preco || false,

      // Objetos completos para os acordeões
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
      ],
    };
  };

  // ==========================================================================
  // FUNÇÕES PARA OS ACORDEÕES (RESTAURADAS)
  // ==========================================================================

  const toggleAcordeao = (index) => {
    setAcordeoesAbertos((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const gerarDadosAcordeao = (dados) => {
    if (!dados || !imovel) return [];

    const acordeoes = [];

    // CARACTERÍSTICAS DO IMÓVEL
    const itensCaracteristicas = [];
    const caracteristicas = dados.caracteristicas || {};
    const dependencias = imovel.dependencias || {};

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
    if (dados.reformadoRecentemente)
      itensCaracteristicas.push(`Reformado recentemente`);
    if (dados.imovelAverbado) itensCaracteristicas.push(`Imóvel averbado`);
    if (dados.financiavel) itensCaracteristicas.push(`Financiável`);
    if (dados.aceitaPermuta) itensCaracteristicas.push(`Aceita permuta`);
    if (dados.tipoIluminacao)
      itensCaracteristicas.push(`Iluminação: ${dados.tipoIluminacao}`);
    if (dados.tipoTelhado)
      itensCaracteristicas.push(`Telhado: ${dados.tipoTelhado}`);
    if (dados.caixaDAgua)
      itensCaracteristicas.push(`Caixa d'água: ${dados.caixaDAgua} litros`);

    if (itensCaracteristicas.length > 0) {
      acordeoes.push({
        titulo: "Características do Imóvel",
        icone: "fas fa-home",
        itens: itensCaracteristicas,
      });
    }

    // ACABAMENTOS
    const itensAcabamentos = [];
    const acabamentos = dados.acabamentos || {};

    Object.entries(acabamentos)
      .filter(([_, value]) => value === true)
      .forEach(([key]) => {
        const labels = {
          pisoPorcelanato: "Piso porcelanato",
          pisoCeramica: "Piso cerâmica",
          pisoLaminado: "Piso laminado",
          revestimentoAzulejo: "Azulejo",
          revestimentoPastilha: "Pastilha",
          tetoGessoRebaixado: "Teto em gesso",
          bancadaGranito: "Bancada de granito",
          bancadaMarmore: "Bancada de mármore",
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
    const itensAreaLazer = [];
    const areaLazer = dados.areaLazer || {};

    Object.entries(areaLazer)
      .filter(([_, value]) => value === true)
      .forEach(([key]) => {
        const labels = {
          piscina: "Piscina",
          churrasqueira: "Churrasqueira",
          espacoGourmet: "Espaço gourmet",
          salaoFestas: "Salão de festas",
          academia: "Academia",
          playground: "Playground",
          quadraPoliesportiva: "Quadra poliesportiva",
          jardim: "Jardim",
        };
        itensAreaLazer.push(labels[key] || key);
      });

    if (itensAreaLazer.length > 0) {
      acordeoes.push({
        titulo: "Área de Lazer",
        icone: "fas fa-swimming-pool",
        itens: itensAreaLazer,
      });
    }

    // LOCALIZAÇÃO E VIZINHANÇA
    const itensLocalizacao = [];
    const localizacao = dados.localizacaoVizinhanca || {};

    Object.entries(localizacao)
      .filter(([_, value]) => value === true)
      .forEach(([key]) => {
        const labels = {
          proximoCentro: "Próximo ao centro",
          proximoSupermercado: "Próximo a supermercado",
          proximoEscola: "Próximo a escola",
          proximoHospital: "Próximo a hospital",
          bairroResidencial: "Bairro residencial",
          ruaAsfaltada: "Rua asfaltada",
        };
        itensLocalizacao.push(labels[key] || key);
      });

    if (itensLocalizacao.length > 0) {
      acordeoes.push({
        titulo: "Localização & Vizinhança",
        icone: "fas fa-map-marker-alt",
        itens: itensLocalizacao,
      });
    }

    // SEGURANÇA
    const itensSeguranca = [];
    const seguranca = dados.seguranca || {};

    Object.entries(seguranca)
      .filter(([_, value]) => value === true)
      .forEach(([key]) => {
        const labels = {
          portaoEletronico: "Portão eletrônico",
          interfone: "Interfone",
          cercaEletrica: "Cerca elétrica",
          sistemaCameras: "Sistema de câmeras",
          alarme: "Alarme",
          portaria24h: "Portaria 24h",
        };
        itensSeguranca.push(labels[key] || key);
      });

    if (itensSeguranca.length > 0) {
      acordeoes.push({
        titulo: "Segurança",
        icone: "fas fa-shield-alt",
        itens: itensSeguranca,
      });
    }

    // ARMÁRIOS E ARMAZENAMENTO
    const itensArmarios = [];
    const armarios = dados.armariosArmazenamento || {};

    Object.entries(armarios)
      .filter(([_, value]) => value === true)
      .forEach(([key]) => {
        const labels = {
          armarioCozinhaPlanejado: "Cozinha planejada",
          armariosEmbutidos: "Armários embutidos",
          closet: "Closet",
          despensa: "Despensa",
        };
        itensArmarios.push(labels[key] || key);
      });

    if (itensArmarios.length > 0) {
      acordeoes.push({
        titulo: "Armários e Armazenamento",
        icone: "fas fa-boxes",
        itens: itensArmarios,
      });
    }

    // DIFERENCIAIS
    const itensDiferenciais = [];
    const diferenciais = dados.diferenciais || {};

    Object.entries(diferenciais)
      .filter(([_, value]) => value === true)
      .forEach(([key]) => {
        const labels = {
          varanda: "Varanda",
          sacada: "Sacada",
          lavabo: "Lavabo",
          banheira: "Banheira",
          escritorio: "Escritório",
          vistaPanoramica: "Vista panorâmica",
        };
        itensDiferenciais.push(labels[key] || key);
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

  // ==========================================================================
  // CONTROLES DO MODAL
  // ==========================================================================

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

  // ==========================================================================
  // AUTO-PLAY DO CARROSSEL
  // ==========================================================================
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

  // ==========================================================================
  // HANDLE SUBMIT DO MODAL - COM RASTREAMENTO
  // ==========================================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

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

      console.log("📤 [VISITA] Enviando solicitação:", {
        imovel_id: dados.id,
        nome_cliente: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        data_visita: dataVisita.toISOString(),
        dia_preferencia: formData.diaSemana,
        horario_preferencia: formData.horarioPreferencia,
      });

      const { data, error } = await visitasService.criarVisita({
        imovel_id: dados.id,
        nome_cliente: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        data_visita: dataVisita.toISOString(),
        dia_preferencia: formData.diaSemana,
        horario_preferencia: formData.horarioPreferencia,
      });

      console.log("🔍 DATA RECEBIDA:", data);
      console.log("📥 [VISITA] Resposta do serviço:", { data, error });

      if (error) throw error;

      if (data && data.id) {
        console.log("✅ ID da visita encontrado:", data.id);
        await registrarSolicitacaoVisita(
          dados.id,
          {
            nome: formData.nome,
            email: formData.email,
            telefone: formData.telefone,
          },
          data.id,
        );
      } else {
        console.warn("⚠️ Não foi possível obter o ID da visita", data);
      }

      incrementarContador("visitas");
      console.log("✅ [VISITA] Agendamento realizado com sucesso!");

      setEnviado(true);
      setEnviando(false);
      setTimeout(fecharModal, 3000);
    } catch (error) {
      console.error("❌ [VISITA] Erro ao agendar visita:", error);
      setEnviando(false);
      alert(error.message || "Erro ao enviar. Tente novamente.");
    }
  };

  // ==========================================================================
  // ATUALIZAR TÍTULO DA PÁGINA
  // ==========================================================================
  useEffect(() => {
    if (dados) {
      document.title = dados.titulo || "Detalhes do Imóvel | Adventus Imóveis";
    }
  }, [dados]);

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

  const imagens = dados.imagens || [];

  // ==========================================================================
  // RENDERIZAÇÃO DO COMPONENTE
  // ==========================================================================
  return (
    <>
      {/* ===== BREADCRUMB ===== */}
      <div className="bg-gray-100 border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center text-xs md:text-sm text-gray-600">
            <a href="/" className="hover:text-[#D4A24D]">
              Home
            </a>
            <span className="mx-2">/</span>
            <a
              href={dados.finalidade_venda ? "/comprar" : "/alugar"}
              className="hover:text-[#D4A24D]"
            >
              {dados.finalidade_venda ? "Comprar" : "Alugar"}
            </a>
            <span className="mx-2">/</span>
            <span className="font-semibold text-[#D4A24D]">{dados.codigo}</span>
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
                    w-3 h-3 md:w-3.5 md:h-3.5 rounded-full transition-all duration-300 border-2 border-white/30
                    focus:outline-none focus:ring-0
                    ${
                      imagemAtual === index
                        ? "bg-[#D4A24D] scale-110 shadow-[0_0_10px_rgba(212,162,77,0.8)] border-white"
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

              <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
                {dados.titulo}
              </h1>
              <div className="text-sm text-gray-300 mb-2">
                Código: {dados.codigo}
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
                {dados.areaTotal > 0 && (
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#D4A24D]/20 flex items-center justify-center mb-2">
                      <i className="fas fa-arrows-alt text-[#D4A24D] text-lg"></i>
                    </div>
                    <div className="text-base font-light">
                      {dados.areaTotal} m²
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COLUNA DA DIREITA - VISUALIZAÇÕES REAIS */}
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
                        <i className="fas fa-eye text-[#D4A24D]/90 text-2xl"></i>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-5xl md:text-6xl font-black text-white leading-tight">
                        {visualizacoes.toLocaleString()}
                      </div>
                      <div className="text-xs font-semibold text-[#E6B85C] mt-2 tracking-wider">
                        VISUALIZAÇÕES TOTAIS
                      </div>
                    </div>
                    <p className="text-xs text-white/70 mt-4 max-w-xs mx-auto font-light">
                      Este imóvel foi visualizado{" "}
                      {visualizacoes === 1 ? "1 vez" : `${visualizacoes} vezes`}{" "}
                      desde sua publicação.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 md:py-8"></div>

      {/* ===== ACORDEÕES RESTAURADOS ===== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="w-full bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
          {dadosAcordeao.length > 0 ? (
            dadosAcordeao.map((acordeao, index) => (
              <div
                key={index}
                className="border-b border-gray-300 last:border-b-0"
              >
                <button
                  onClick={() => toggleAcordeao(index)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-all duration-300 focus:outline-none focus:ring-0"
                >
                  <span className="flex items-center space-x-3">
                    <i
                      className={`${acordeao.icone} text-[#D4A24D] text-xl`}
                    ></i>
                    <span className="font-semibold text-gray-800">
                      {acordeao.titulo}
                    </span>
                  </span>
                  <i
                    className={`fas fa-chevron-down text-[#D4A24D] transition-transform duration-300 ${
                      acordeoesAbertos[index] ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-400 ${
                    acordeoesAbertos[index]
                      ? "max-h-[500px] p-6"
                      : "max-h-0 p-0"
                  } bg-gray-50`}
                >
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

      {/* ===== SEÇÃO DE CALL-TO-ACTION ===== */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#31353E] text-white rounded-xl shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#D4A24D]/5 to-transparent"></div>
          <div className="relative z-10">
            <div className="p-10 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8">
                {/* COLUNA 1 - WHATSAPP */}
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
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          `Olá! Tenho interesse no imóvel ${dados.codigo} - ${dados.titulo} e gostaria de mais informações.`,
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => registrarCliqueWhatsApp(dados.id)}
                        className="btn-whatsapp-premium inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm md:text-base font-semibold rounded-lg hover:from-green-600 hover:to-green-700 hover:shadow-lg transition-all duration-300 space-x-2 shadow-md relative overflow-hidden group whitespace-nowrap focus:outline-none focus:ring-0"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                        <i className="fab fa-whatsapp text-base"></i>
                        <span>Falar agora no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* COLUNA 2 - SOLICITAR VISITA */}
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
                  <i className="far fa-clock text-[#D4A24D] mr-2 text-sm"></i>
                  <span>Atendimento de segunda a sexta, das 8h às 18h</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="py-6 md:py-8"></div>

      {/* ===== MODAL DE SOLICITAÇÃO DE VISITA ===== */}
      {modalAberto && (
        <>
          <div
            ref={overlayRef}
            className="fixed inset-0 bg-black/50 z-[9998] transition-opacity duration-300"
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
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <input
                        type="text"
                        name="nome"
                        value={formData.nome}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
                        placeholder="Nome completo *"
                      />
                      <input
                        type="tel"
                        name="telefone"
                        value={formData.telefone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
                        placeholder="WhatsApp com DDD *"
                      />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
                        placeholder="Email *"
                      />
                      <select
                        name="diaSemana"
                        value={formData.diaSemana}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
                      >
                        <option value="">Melhor dia *</option>
                        <option value="segunda">Segunda</option>
                        <option value="terca">Terça</option>
                        <option value="quarta">Quarta</option>
                        <option value="quinta">Quinta</option>
                        <option value="sexta">Sexta</option>
                      </select>
                      <select
                        name="horarioPreferencia"
                        value={formData.horarioPreferencia}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
                      >
                        <option value="">Melhor horário *</option>
                        <option value="manha">Manhã (8h-12h)</option>
                        <option value="tarde">Tarde (14h-18h)</option>
                      </select>
                      <textarea
                        name="mensagem"
                        value={formData.mensagem}
                        onChange={handleInputChange}
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4A24D] focus:border-[#D4A24D] outline-none"
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
      `}</style>
    </>
  );
};

export default DetalheImovel;
