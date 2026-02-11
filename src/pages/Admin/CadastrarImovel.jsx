// src/pages/CadastrarImovel.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  HomeIcon,
  MapPinIcon,
  TagIcon,
  WrenchScrewdriverIcon,
  PaintBrushIcon,
  CheckCircleIcon,
  SunIcon,
  ShieldCheckIcon,
  BuildingStorefrontIcon,
  BoltIcon,
  SparklesIcon,
  HeartIcon,
  CubeTransparentIcon,
  BeakerIcon,
  LightBulbIcon,
  BuildingOfficeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

const CadastrarImovel = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // =============== BUSCAR EMPREENDIMENTOS ===============
  const [empreendimentos, setEmpreendimentos] = useState([]);

  useEffect(() => {
    const fetchEmpreendimentos = async () => {
      const { data } = await supabase
        .from("edificios")
        .select("id, nome, tipo, bairro, cidade")
        .order("nome");
      setEmpreendimentos(data || []);
    };
    fetchEmpreendimentos();
  }, []);

  // =============== TESTE DE CONEXÃO ===============
  useEffect(() => {
    console.log("🔍 Testando conexão com Supabase...");

    const testarConexao = async () => {
      try {
        const { data, error } = await supabase
          .from("imoveis")
          .select("count", { count: "exact", head: true });

        if (error) {
          if (error.code === "42P01") {
            console.log(
              "✅ CONEXÃO COM SUPABASE OK! Tabela 'imoveis' ainda não criada.",
            );
          } else {
            console.error("❌ Erro na conexão:", error.message);
          }
        } else {
          console.log("✅✅ Conexão perfeita!");
        }
      } catch (err) {
        console.error("❌ Erro inesperado:", err);
      }
    };

    testarConexao();
  }, []);

  // =============== ESTADO DO FORMULÁRIO ===============
  const [formData, setFormData] = useState({
    // Seção 1: Informações Gerais
    codigo: "",
    titulo: "",
    finalidade: { venda: true, aluguel: false },
    tipo: "",
    preco: "",
    status: "disponivel",
    financiado: false,
    emCondominio: false,
    proprietarioId: "",
    corretorId: "",
    ocultarPreco: false,

    // 🆕 VÍNCULO COM EMPREENDIMENTO
    empreendimento_id: "",
    unidade: "",
    andar: "",
    lote: "",

    // NOVA SEÇÃO: Dependências do Imóvel
    dependencias: {
      dormitorios: "",
      banheiros: "",
      suites: "",
      vagas: "",
      area_total: "",
      area_construida: "",
    },

    // Seção 2: Localização Aprimorada
    cep: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    ocultarNumero: false,
    ocultarEndereco: false,

    // Seção 3: Etiquetas
    etiquetas: {
      destaqueSemana: false,
      novoSite: false,
      baixouPreco: false,
      financiável: false,
    },

    // ============ ACCORDION 1: CARACTERÍSTICAS DO IMÓVEL ============
    caracteristicas: {
      // 📐 Medidas e Dimensões
      areaUtil: "",
      areaPrivativa: "",
      frenteTerreno: "",
      fundo: "",
      lateralEsquerda: "",
      lateralDireita: "",
      peDireito: "",
      // Lote específico
      topografia: "",
      esquina: false,

      // 🏗 Estrutura do Imóvel
      tipoConstrucao: "",
      anoConstrucao: "",
      reformadoRecentemente: false,
      numeroPavimentos: "",
      imovelAverbado: false,
      financiavel: false,
      aceitaPermuta: false,

      // ⚡ Infraestrutura interna
      tipoIluminacao: "",
      tipoTelhado: "",
      forroLaje: false,
      sistemaEletricoNovo: false,
      caixaDAgua: "",
      sistemaEsgoto: "",
      aquecimentoAgua: "",

      // 🏘 Informações estratégicas
      posicaoSolar: "",
      ventilacaoCruzada: false,
      vistaLivre: false,
      vistaPermanente: false,
      ruaSemSaida: false,
      esquinaInfo: false,
      condominioTaxaMensal: "",
    },

    // ============ INFRAESTRUTURA (ANTIGO) - MANTIDO PARA COMPATIBILIDADE ============
    infraestrutura: {
      agua: false,
      energia: false,
      esgoto: false,
      internet: false,
      gas: false,
      piscina: false,
      churrasqueira: false,
      academia: false,
      salaoFestas: false,
      playground: false,
      portaoEletronico: false,
      interfone: false,
      cameraSeguranca: false,
      alarme: false,
    },

    // ============ ACCORDION 2: ACABAMENTOS ============
    acabamentos: {
      // 🔹 Pisos
      pisoPorcelanato: false,
      pisoCeramica: false,
      pisoLaminado: false,
      pisoVinilico: false,
      pisoMadeiraMaciça: false,
      pisoTaco: false,
      pisoCimentoQueimado: false,
      pisoMarmore: false,
      pisoGranito: false,
      pisoFrio: false,

      // 🔹 Revestimentos de parede
      revestimentoAzulejo: false,
      revestimentoPastilha: false,
      revestimentoPorcelanato: false,
      revestimentoPedraNatural: false,
      revestimentoPapelParede: false,
      revestimento3D: false,

      // 🔹 Teto e forro
      tetoGessoRebaixado: false,
      tetoSancaGesso: false,
      tetoForroPVC: false,
      tetoLaje: false,

      // 🔹 Esquadrias e portas
      portaMadeiraMaciça: false,
      portaLaqueada: false,
      esquadriaAluminio: false,
      esquadriaPVC: false,
      portaPivotante: false,

      // 🔹 Bancadas
      bancadaGranito: false,
      bancadaMarmore: false,
      bancadaQuartzo: false,
      bancadaNanoglass: false,

      // Campos antigos (mantidos para compatibilidade)
      piso: "",
      azulejo: "",
      porta: "",
      janela: "",
      forro: "",
      armarioCozinha: false,
      armarioBanheiro: false,
      banheira: false,
      boxVidro: false,
      varanda: false,
      sacada: false,
      lavabo: false,
      dependenciaEmpregada: false,
    },

    // ============ ACCORDION 3: ÁREA DE LAZER ============
    areaLazer: {
      piscina: false,
      churrasqueira: false,
      espacoGourmet: false,
      salaoFestas: false,
      salaoJogos: false,
      academia: false,
      playground: false,
      quadraPoliesportiva: false,
      campoSociety: false,
      areaVerde: false,
      jardim: false,
      deck: false,
      rooftop: false,
      sauna: false,
      espacoPet: false,
      brinquedoteca: false,
    },

    // ============ ACCORDION 4: LOCALIZAÇÃO E VIZINHANÇA ============
    localizacaoVizinhanca: {
      proximoCentro: false,
      proximoSupermercado: false,
      proximoEscola: false,
      proximoHospital: false,
      proximoFarmacia: false,
      proximoOnibus: false,
      proximoShopping: false,
      proximoFaculdade: false,
      bairroResidencial: false,
      bairroComercial: false,
      ruaAsfaltada: false,
      ruaTranquila: false,
      regiaoValorizada: false,
    },

    // ============ ACCORDION 5: SEGURANÇA ============
    seguranca: {
      portaoEletronico: false,
      interfone: false,
      cercaEletrica: false,
      sistemaCameras: false,
      alarme: false,
      portaria24h: false,
      vigilancia24h: false,
      controleAcesso: false,
      fechaduraDigital: false,
      condominioFechado: false,
      murosAltos: false,
    },

    // ============ ACCORDION 6: ARMÁRIOS E ARMAZENAMENTO ============
    armariosArmazenamento: {
      armarioCozinhaPlanejado: false,
      armariosEmbutidos: false,
      armariosQuarto: false,
      armariosBanheiro: false,
      closet: false,
      despensa: false,
      deposito: false,
      roupeiro: false,
      maleiro: false,
    },

    // ============ ACCORDION 7: SERVIÇOS E UTILIDADES ============
    servicosUtilidades: {
      aguaEncanada: false,
      energiaEletrica: false,
      pocoArtesiano: false,
      aquecimentoGas: false,
      aquecimentoSolar: false,
      gasEncanado: false,
      arCondicionadoInstalado: false,
      infraArCondicionado: false,
      internetFibra: false,
      iluminacaoLED: false,
      energiaSolar: false,
      elevador: false,
      coletaLixo: false,
    },

    // ============ ACCORDION 8: DIFERENCIAIS DO IMÓVEL ============
    diferenciais: {
      varanda: false,
      sacada: false,
      lavabo: false,
      banheira: false,
      boxVidro: false,
      dependenciaEmpregada: false,
      escritorio: false,
      peDireitoDuplo: false,
      mezanino: false,
      vistaPanoramica: false,
    },
  });

  // =============== CONTROLE DOS ACCORDIONS ===============
  const [accordionOpen, setAccordionOpen] = useState({
    caracteristicas: false,
    acabamentos: false,
    areaLazer: false,
    localizacaoVizinhanca: false,
    seguranca: false,
    armariosArmazenamento: false,
    servicosUtilidades: false,
    diferenciais: false,
  });

  // =============== ESTADOS DE CARREGAMENTO ===============
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

  // =============== OPÇÕES PARA SELECTS ===============
  const tiposImovel = [
    { value: "casa", label: "Casa" },
    { value: "apartamento", label: "Apartamento" },
    { value: "terreno", label: "Terreno" },
    { value: "comercial", label: "Comercial" },
    { value: "sobrado", label: "Sobrado" },
    { value: "kitnet", label: "Kitnet" },
    { value: "fazenda", label: "Fazenda" },
    { value: "galpao", label: "Galpão" },
  ];

  const estadosBrasil = [
    { value: "AC", label: "Acre" },
    { value: "AL", label: "Alagoas" },
    { value: "AP", label: "Amapá" },
    { value: "AM", label: "Amazonas" },
    { value: "BA", label: "Bahia" },
    { value: "CE", label: "Ceará" },
    { value: "DF", label: "Distrito Federal" },
    { value: "ES", label: "Espírito Santo" },
    { value: "GO", label: "Goiás" },
    { value: "MA", label: "Maranhão" },
    { value: "MT", label: "Mato Grosso" },
    { value: "MS", label: "Mato Grosso do Sul" },
    { value: "MG", label: "Minas Gerais" },
    { value: "PA", label: "Pará" },
    { value: "PB", label: "Paraíba" },
    { value: "PR", label: "Paraná" },
    { value: "PE", label: "Pernambuco" },
    { value: "PI", label: "Piauí" },
    { value: "RJ", label: "Rio de Janeiro" },
    { value: "RN", label: "Rio Grande do Norte" },
    { value: "RS", label: "Rio Grande do Sul" },
    { value: "RO", label: "Rondônia" },
    { value: "RR", label: "Roraima" },
    { value: "SC", label: "Santa Catarina" },
    { value: "SP", label: "São Paulo" },
    { value: "SE", label: "Sergipe" },
    { value: "TO", label: "Tocantins" },
  ];

  const topografiaOpcoes = [
    { value: "plano", label: "Plano" },
    { value: "aclive", label: "Aclive" },
    { value: "declive", label: "Declive" },
  ];

  const tipoConstrucaoOpcoes = [
    { value: "alvenaria_estrutural", label: "Alvenaria Estrutural" },
    { value: "concreto_armado", label: "Concreto Armado" },
    { value: "steel_frame", label: "Steel Frame" },
    { value: "wood_frame", label: "Wood Frame" },
    { value: "container", label: "Container" },
  ];

  const sistemaEsgotoOpcoes = [
    { value: "rede_publica", label: "Rede Pública" },
    { value: "fossa_septica", label: "Fossa Séptica" },
    { value: "fossa_filtro", label: "Fossa e Filtro" },
  ];

  const aquecimentoAguaOpcoes = [
    { value: "gas", label: "Gás" },
    { value: "solar", label: "Solar" },
    { value: "eletrico", label: "Elétrico" },
    { value: "central", label: "Central" },
  ];

  const posicaoSolarOpcoes = [
    { value: "nascente", label: "Nascente" },
    { value: "poente", label: "Poente" },
    { value: "norte", label: "Norte" },
    { value: "sul", label: "Sul" },
  ];

  // Dados de exemplo
  const proprietarios = [
    { id: "1", nome: "Maria Silva" },
    { id: "2", nome: "João Santos" },
    { id: "3", nome: "Ana Oliveira" },
  ];

  const corretores = [
    { id: "101", nome: "Carlos Souza" },
    { id: "102", nome: "Ana Pereira" },
    { id: "103", nome: "Roberto Lima" },
  ];

  // =============== FUNÇÕES DE BUSCA CEP ===============
  const buscarCep = async (cep) => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) {
      setCepError("CEP deve ter 8 dígitos");
      return;
    }
    setCepLoading(true);
    setCepError("");
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`,
      );
      if (!response.ok) throw new Error("Erro na resposta da API");
      const data = await response.json();
      if (data.erro) {
        setCepError("CEP não encontrado");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        endereco: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        estado: data.uf || "",
        complemento: data.complemento || prev.complemento,
      }));
    } catch (error) {
      setCepError("Erro ao buscar CEP. Verifique a conexão.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleCepChange = (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, cep: value }));
    const cepLimpo = value.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      buscarCep(value);
    } else {
      setCepError("");
    }
  };

  // =============== HANDLERS ===============
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const toggleAccordion = (section) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // =============== SUBMIT ===============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage({ type: "", text: "" });

    const dadosParaSupabase = {
      // Seção 1: Informações Gerais
      codigo: formData.codigo,
      titulo: formData.titulo,
      finalidade_venda: formData.finalidade.venda,
      finalidade_aluguel: formData.finalidade.aluguel,
      tipo: formData.tipo,
      preco: formData.preco ? parseFloat(formData.preco) : null,
      status: formData.status,
      financiado: formData.financiado,
      em_condominio: formData.emCondominio,
      proprietario_id: formData.proprietarioId || null,
      corretor_id: formData.corretorId || null,
      ocultar_preco: formData.ocultarPreco,

      // 🆕 Vínculo com empreendimento
      edificio_id: formData.empreendimento_id || null,
      unidade: formData.unidade || null,
      andar: formData.andar || null,
      lote: formData.lote || null,

      // NOVA SEÇÃO: Dependências
      dependencias: formData.dependencias,

      // Seção 2: Localização
      cep: formData.cep,
      endereco: formData.endereco,
      numero: formData.numero,
      complemento: formData.complemento,
      bairro: formData.bairro,
      cidade: formData.cidade,
      estado: formData.estado,
      ocultar_numero: formData.ocultarNumero,
      ocultar_endereco: formData.ocultarEndereco,

      // Seção 3: Etiquetas
      etiquetas: formData.etiquetas,

      // Accordions
      caracteristicas: formData.caracteristicas,
      infraestrutura: formData.infraestrutura,
      acabamentos: formData.acabamentos,
      area_lazer: formData.areaLazer,
      localizacao_vizinhanca: formData.localizacaoVizinhanca,
      seguranca: formData.seguranca,
      armarios_armazenamento: formData.armariosArmazenamento,
      servicos_utilidades: formData.servicosUtilidades,
      diferenciais: formData.diferenciais,
    };

    try {
      const { data, error } = await supabase
        .from("imoveis")
        .insert([dadosParaSupabase])
        .select();

      if (error) throw error;

      setSubmitMessage({
        type: "success",
        text: `Imóvel "${formData.titulo}" cadastrado com sucesso! Código: ${formData.codigo}`,
      });

      setTimeout(() => {
        navigate("/admin/imoveis");
      }, 3000);
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: error.message || "Ocorreu um erro inesperado.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Tem certeza que deseja cancelar? As alterações serão perdidas.",
      )
    ) {
      navigate("/admin/imoveis");
    }
  };

  const formatPrice = (price) => {
    if (!price) return "";
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // =============== FUNÇÕES DE CORES (TEMA) ===============
  const getBgClass = () => (isDark ? "bg-gray-900" : "bg-white");
  const getBorderClass = () => (isDark ? "border-gray-700" : "border-gray-200");
  const getTextClass = () => (isDark ? "text-gray-100" : "text-gray-900");
  const getTextSecondaryClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  const getHoverBgClass = () =>
    isDark ? "hover:bg-gray-800" : "hover:bg-white";
  const getInputBgClass = () => (isDark ? "bg-gray-800" : "bg-white");
  const getInputBorderClass = () =>
    isDark ? "border-gray-700" : "border-gray-300";
  const getInputTextClass = () => (isDark ? "text-gray-200" : "text-gray-900");
  const getPlaceholderClass = () =>
    isDark ? "placeholder-gray-500" : "placeholder-gray-500";
  const getCheckboxBorderClass = () =>
    isDark ? "border-gray-600" : "border-gray-300";
  const getIconBgClass = () => (isDark ? "bg-[#D4A24D]/20" : "bg-[#D4A24D]/10");
  const getIconColorClass = () =>
    isDark ? "text-[#D4A24D]" : "text-[#D4A24D]";
  const getAccordionTitleClass = () =>
    isDark ? "text-gray-100" : "text-gray-800";
  const getAccordionSubtitleClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  const getCounterButtonClass = () =>
    isDark
      ? "bg-gray-900 border-gray-600 hover:bg-gray-700 text-gray-300"
      : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700";
  const getCounterInputClass = () =>
    isDark
      ? "bg-gray-800 border-gray-700 text-gray-200"
      : "bg-white border-gray-300 text-gray-900";
  const getStatusColor = (status) => {
    const baseColors = {
      disponivel: {
        light: "bg-green-100 text-green-800",
        dark: "bg-green-900/30 text-green-300 border border-green-800",
      },
      reservado: {
        light: "bg-yellow-100 text-yellow-800",
        dark: "bg-yellow-900/30 text-yellow-300 border border-yellow-800",
      },
      vendido: {
        light: "bg-gray-100 text-gray-800",
        dark: "bg-gray-800 text-gray-300 border border-gray-700",
      },
      alugado: {
        light: "bg-blue-100 text-blue-800",
        dark: "bg-blue-900/30 text-blue-300 border border-blue-800",
      },
    };
    return isDark
      ? baseColors[status]?.dark || "bg-gray-800 text-gray-300"
      : baseColors[status]?.light || "bg-gray-100 text-gray-800";
  };
  const getFinanciavelColor = () =>
    isDark
      ? "bg-blue-900/30 text-blue-300 border border-blue-800"
      : "bg-blue-100 text-blue-800";
  const getCheckboxClass = () =>
    `appearance-none h-5 w-5 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/50 focus:ring-offset-2 ${
      isDark ? "bg-gray-800" : "bg-white"
    } ${getCheckboxBorderClass()} checked:bg-[#D4A24D] checked:border-[#D4A24D] relative checked:after:absolute checked:after:content-[''] checked:after:h-[0.625rem] checked:after:w-[0.3125rem] checked:after:rotate-45 checked:after:translate-x-[0.375rem] checked:after:translate-y-[0.125rem] checked:after:border-solid checked:after:border-white checked:after:border-width-0 checked:after:border-r-2 checked:after:border-b-2`;
  const getOptionBgClass = () => (isDark ? "bg-gray-800" : "bg-white");

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark
          ? "bg-gray-900"
          : "bg-gradient-to-b from-[#D4A24D]/5 to-[#31353E]/5"
      }`}
    >
      {/* Header da Página */}
      <div
        className={`border-b px-4 py-4 transition-colors duration-200 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/imoveis")}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-300"
                    : "hover:bg-gray-100 text-gray-600"
                }`}
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
              <div>
                <h1
                  className={`text-2xl font-bold transition-colors ${getTextClass()}`}
                >
                  Cadastrar Imóvel
                </h1>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Preencha todos os campos para cadastrar um novo imóvel no
                  sistema
                </p>
              </div>
            </div>
            {/* Status Preview */}
            <div className="flex items-center space-x-4">
              <div
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(formData.status)}`}
              >
                {formData.status === "disponivel" && "Disponível"}
                {formData.status === "reservado" && "Reservado"}
                {formData.status === "vendido" && "Vendido"}
                {formData.status === "alugado" && "Alugado"}
              </div>
              {formData.etiquetas.financiável && (
                <div
                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${getFinanciavelColor()}`}
                >
                  Financiável
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* ========== SEÇÃO 1: INFORMAÇÕES GERAIS ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <HomeIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Informações Gerais do Imóvel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Dados para identificação, comercialização e gestão
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Código do Imóvel */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Código do Imóvel *
                </label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: IMV-001"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
              {/* Título do Anúncio */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Título do Anúncio *
                </label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Casa moderna com piscina no Jardins"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
              {/* Finalidade */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Finalidade *
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="finalidade.venda"
                      checked={formData.finalidade.venda}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <span
                      className={`ml-2 transition-colors ${getTextClass()}`}
                    >
                      Venda
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="finalidade.aluguel"
                      checked={formData.finalidade.aluguel}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <span
                      className={`ml-2 transition-colors ${getTextClass()}`}
                    >
                      Aluguel
                    </span>
                  </label>
                </div>
              </div>
              {/* Tipo do Imóvel */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Tipo do Imóvel *
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecione o tipo
                  </option>
                  {tiposImovel.map((tipo) => (
                    <option
                      key={tipo.value}
                      value={tipo.value}
                      className={getOptionBgClass()}
                    >
                      {tipo.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Proprietário */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Proprietário
                </label>
                <select
                  name="proprietarioId"
                  value={formData.proprietarioId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecionar proprietário
                  </option>
                  {proprietarios.map((proprietario) => (
                    <option
                      key={proprietario.id}
                      value={proprietario.id}
                      className={getOptionBgClass()}
                    >
                      {proprietario.nome}
                    </option>
                  ))}
                </select>
              </div>
              {/* Corretor Responsável */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Corretor Responsável
                </label>
                <select
                  name="corretorId"
                  value={formData.corretorId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecionar corretor
                  </option>
                  {corretores.map((corretor) => (
                    <option
                      key={corretor.id}
                      value={corretor.id}
                      className={getOptionBgClass()}
                    >
                      {corretor.nome}
                    </option>
                  ))}
                </select>
              </div>
              {/* Preço */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Preço *
                </label>
                <div className="space-y-2">
                  <div className="relative">
                    <span
                      className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                    >
                      R$
                    </span>
                    <input
                      type="number"
                      name="preco"
                      value={formData.preco}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="0,00"
                      className={`w-full pl-12 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                    />
                  </div>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="ocultarPreco"
                      checked={formData.ocultarPreco}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <span
                      className={`text-sm transition-colors ${getTextClass()}`}
                    >
                      Ocultar preço na vitrine
                    </span>
                  </label>
                </div>
                {formData.preco && !formData.ocultarPreco && (
                  <p
                    className={`mt-2 text-sm transition-colors ${getTextSecondaryClass()}`}
                  >
                    {formatPrice(formData.preco)}
                  </p>
                )}
                {formData.ocultarPreco && (
                  <p
                    className={`mt-2 text-sm ${isDark ? "text-yellow-400" : "text-yellow-600"}`}
                  >
                    Preço não será exibido publicamente.
                  </p>
                )}
              </div>
              {/* Status */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="disponivel" className={getOptionBgClass()}>
                    Disponível
                  </option>
                  <option value="reservado" className={getOptionBgClass()}>
                    Reservado
                  </option>
                  <option value="vendido" className={getOptionBgClass()}>
                    Vendido
                  </option>
                  <option value="alugado" className={getOptionBgClass()}>
                    Alugado
                  </option>
                </select>
              </div>
              {/* Financiável */}
              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="financiado"
                  name="financiado"
                  checked={formData.financiado}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <label
                  htmlFor="financiado"
                  className={`text-sm transition-colors ${getTextClass()}`}
                >
                  Imóvel financiável
                </label>
              </div>
              {/* Em Condomínio */}
              <div className="flex items-center space-x-3 pt-6">
                <input
                  type="checkbox"
                  id="emCondominio"
                  name="emCondominio"
                  checked={formData.emCondominio}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <label
                  htmlFor="emCondominio"
                  className={`text-sm transition-colors ${getTextClass()}`}
                >
                  Imóvel em condomínio
                </label>
              </div>
            </div>

            {/* ========== 🆕 BLOCO VÍNCULO COM EMPREENDIMENTO ========== */}
            {formData.emCondominio && (
              <div className="col-span-3 mt-6 p-5 border rounded-lg bg-gray-50/50">
                <div className="flex items-center space-x-2 mb-4">
                  <BuildingOfficeIcon className="w-5 h-5 text-[#D4A24D]" />
                  <h3 className={`font-medium ${getTextClass()}`}>
                    Vínculo com Empreendimento
                  </h3>
                  {formData.tipo === "apartamento" && (
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
                      Edifício obrigatório
                    </span>
                  )}
                  {formData.tipo === "casa" && (
                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-700">
                      Condomínio/Residencial
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* SELECT DE EMPREENDIMENTOS */}
                  <div className="lg:col-span-2">
                    <label
                      className={`block text-xs font-medium mb-1 ${getTextSecondaryClass()}`}
                    >
                      Nome do Empreendimento *
                    </label>
                    <select
                      name="empreendimento_id"
                      value={formData.empreendimento_id}
                      onChange={handleChange}
                      required={formData.emCondominio}
                      className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                    >
                      <option value="" className={getOptionBgClass()}>
                        Selecione um empreendimento...
                      </option>

                      {/* Filtra conforme o tipo do imóvel */}
                      {empreendimentos
                        .filter((emp) => {
                          if (formData.tipo === "apartamento")
                            return emp.tipo === "edificio";
                          if (formData.tipo === "casa")
                            return (
                              emp.tipo === "condominio" ||
                              emp.tipo === "residencial"
                            );
                          return true; // outros tipos
                        })
                        .map((emp) => (
                          <option
                            key={emp.id}
                            value={emp.id}
                            className={getOptionBgClass()}
                          >
                            {emp.nome} - {emp.bairro}/{emp.cidade}
                            {emp.tipo === "edificio"
                              ? " 🏢"
                              : emp.tipo === "condominio"
                                ? " 🏘️"
                                : " 🏡"}
                          </option>
                        ))}
                    </select>
                    <p className="text-[10px] mt-1.5 text-gray-500">
                      <a
                        href="/admin/edificios/cadastrar"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#D4A24D] hover:underline inline-flex items-center"
                      >
                        <PlusIcon className="w-3 h-3 mr-1" />
                        Cadastrar novo empreendimento
                      </a>
                    </p>
                  </div>

                  {/* UNIDADE (só para apartamentos) */}
                  {formData.tipo === "apartamento" && (
                    <>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${getTextSecondaryClass()}`}
                        >
                          Unidade/Apartamento
                        </label>
                        <input
                          type="text"
                          name="unidade"
                          value={formData.unidade}
                          onChange={handleChange}
                          placeholder="Ex: 101, 1203"
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1 ${getTextSecondaryClass()}`}
                        >
                          Andar
                        </label>
                        <input
                          type="text"
                          name="andar"
                          value={formData.andar}
                          onChange={handleChange}
                          placeholder="Ex: 1º, 12º, Cobertura"
                          className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                        />
                      </div>
                    </>
                  )}

                  {/* LOTE (só para casas em condomínio) */}
                  {formData.tipo === "casa" && (
                    <div>
                      <label
                        className={`block text-xs font-medium mb-1 ${getTextSecondaryClass()}`}
                      >
                        Lote/Número
                      </label>
                      <input
                        type="text"
                        name="lote"
                        value={formData.lote}
                        onChange={handleChange}
                        placeholder="Ex: Lote 23, Quadra 5"
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                      />
                    </div>
                  )}
                </div>

                {/* MENSAGENS DE VALIDAÇÃO */}
                {formData.tipo === "apartamento" &&
                  !formData.empreendimento_id && (
                    <p className="text-xs text-amber-600 mt-3 flex items-center">
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      Apartamento precisa estar vinculado a um Edifício.
                    </p>
                  )}
                {formData.tipo === "casa" &&
                  formData.emCondominio &&
                  !formData.empreendimento_id && (
                    <p className="text-xs text-amber-600 mt-3 flex items-center">
                      <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                      Casa em condomínio precisa estar vinculada a um
                      Condomínio/Residencial.
                    </p>
                  )}
              </div>
            )}
          </div>

          {/* ========== NOVA SEÇÃO: DEPENDÊNCIAS DO IMÓVEL ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <CubeTransparentIcon
                  className={`w-6 h-6 ${getIconColorClass()}`}
                />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Dependências do Imóvel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Quantidade de cômodos, vagas e áreas do imóvel
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Dormitórios */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Dormitórios
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          dormitorios: Math.max(
                            0,
                            (parseInt(prev.dependencias.dormitorios) || 0) - 1,
                          ),
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependencias.dormitorios"
                    value={formData.dependencias.dormitorios}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          dormitorios:
                            (parseInt(prev.dependencias.dormitorios) || 0) + 1,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Banheiros */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Banheiros
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          banheiros: Math.max(
                            0,
                            (parseInt(prev.dependencias.banheiros) || 0) - 1,
                          ),
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependencias.banheiros"
                    value={formData.dependencias.banheiros}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          banheiros:
                            (parseInt(prev.dependencias.banheiros) || 0) + 1,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Suíte */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Suíte
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          suites: Math.max(
                            0,
                            (parseInt(prev.dependencias.suites) || 0) - 1,
                          ),
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependencias.suites"
                    value={formData.dependencias.suites}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          suites: (parseInt(prev.dependencias.suites) || 0) + 1,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Vagas */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Vagas
                </label>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          vagas: Math.max(
                            0,
                            (parseInt(prev.dependencias.vagas) || 0) - 1,
                          ),
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    name="dependencias.vagas"
                    value={formData.dependencias.vagas}
                    onChange={handleChange}
                    min="0"
                    placeholder="0"
                    className={`w-full px-4 py-2 text-center border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getCounterInputClass()}`}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        dependencias: {
                          ...prev.dependencias,
                          vagas: (parseInt(prev.dependencias.vagas) || 0) + 1,
                        },
                      }))
                    }
                    className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Área Total */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Área Total (m²)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="dependencias.area_total"
                    value={formData.dependencias.area_total}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                  <span
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    m²
                  </span>
                </div>
              </div>

              {/* Área Construída */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Área Construída (m²)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="dependencias.area_construida"
                    value={formData.dependencias.area_construida}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                  <span
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    m²
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ========== SEÇÃO 2: LOCALIZAÇÃO APRIMORADA ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <MapPinIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Localização Aprimorada
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Endereço completo e configurações de privacidade
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* CEP */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  CEP *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleCepChange}
                    required
                    placeholder="00000-000"
                    maxLength="9"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                  {cepLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#D4A24D]"></div>
                    </div>
                  )}
                </div>
                {cepError && (
                  <p
                    className={`mt-1 text-sm ${isDark ? "text-red-400" : "text-red-600"}`}
                  >
                    {cepError}
                  </p>
                )}
                {!cepError &&
                  !cepLoading &&
                  formData.cep.replace(/\D/g, "").length === 8 && (
                    <p
                      className={`mt-1 text-sm ${isDark ? "text-green-400" : "text-green-600"}`}
                    >
                      CEP válido. Endereço preenchido automaticamente.
                    </p>
                  )}
              </div>
              {/* Endereço */}
              <div className="md:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Endereço *
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Rua das Flores"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
              {/* Número */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Número *
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    required
                    placeholder="123"
                    className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                </div>
              </div>
              {/* Complemento */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Complemento
                </label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  placeholder="Ex: Apto 101, Bloco B"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
              {/* Bairro */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Bairro *
                </label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Centro"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
              {/* Cidade */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Cidade *
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  placeholder="Ex: São Paulo"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                />
              </div>
              {/* Estado */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                >
                  Estado *
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors duration-200 ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                >
                  <option value="" className={getOptionBgClass()}>
                    Selecione o estado
                  </option>
                  {estadosBrasil.map((estado) => (
                    <option
                      key={estado.value}
                      value={estado.value}
                      className={getOptionBgClass()}
                    >
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
              {/* Privacidade */}
              <div className="md:col-span-3 space-y-4 p-4 border rounded-lg">
                <h3
                  className={`font-medium transition-colors ${getTextClass()}`}
                >
                  Configurações de Privacidade
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="ocultarNumero"
                      checked={formData.ocultarNumero}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <div>
                      <div
                        className={`font-medium transition-colors ${getTextClass()}`}
                      >
                        Ocultar número na vitrine
                      </div>
                      <div
                        className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                      >
                        Só exibe o endereço sem número
                      </div>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      name="ocultarEndereco"
                      checked={formData.ocultarEndereco}
                      onChange={handleChange}
                      className={getCheckboxClass()}
                    />
                    <div>
                      <div
                        className={`font-medium transition-colors ${getTextClass()}`}
                      >
                        Ocultar endereço completo
                      </div>
                      <div
                        className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                      >
                        Só exibe bairro e cidade
                      </div>
                    </div>
                  </label>
                </div>
                <div
                  className={`mt-4 p-3 rounded-lg ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
                >
                  <h4
                    className={`text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                  >
                    Como será exibido na vitrine:
                  </h4>
                  <p className={`text-sm transition-colors ${getTextClass()}`}>
                    {formData.ocultarEndereco
                      ? `${formData.bairro || "Bairro"}, ${formData.cidade || "Cidade"}`
                      : `${formData.endereco || "Endereço"}${
                          !formData.ocultarNumero && formData.numero
                            ? `, ${formData.numero}`
                            : ""
                        }, ${formData.bairro || "Bairro"}`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========== SEÇÃO 3: ETIQUETAS ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <TagIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Etiquetas do Imóvel
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Configure as etiquetas que aparecerão na vitrine da homepage
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <label
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getBorderClass()} ${getHoverBgClass()} ${
                  isDark
                    ? "hover:border-[#D4A24D]/50"
                    : "hover:border-[#D4A24D]"
                }`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.destaqueSemana"
                  checked={formData.etiquetas.destaqueSemana}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div>
                  <div
                    className={`font-medium transition-colors ${getTextClass()}`}
                  >
                    Destaque da Semana
                  </div>
                  <div
                    className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                  >
                    Exibir na seção de destaques
                  </div>
                </div>
              </label>
              <label
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getBorderClass()} ${getHoverBgClass()} ${
                  isDark
                    ? "hover:border-[#D4A24D]/50"
                    : "hover:border-[#D4A24D]"
                }`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.novoSite"
                  checked={formData.etiquetas.novoSite}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div>
                  <div
                    className={`font-medium transition-colors ${getTextClass()}`}
                  >
                    Novo no Site
                  </div>
                  <div
                    className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                  >
                    Recém cadastrado
                  </div>
                </div>
              </label>
              <label
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getBorderClass()} ${getHoverBgClass()} ${
                  isDark
                    ? "hover:border-[#D4A24D]/50"
                    : "hover:border-[#D4A24D]"
                }`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.baixouPreco"
                  checked={formData.etiquetas.baixouPreco}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div>
                  <div
                    className={`font-medium transition-colors ${getTextClass()}`}
                  >
                    Baixou o Preço
                  </div>
                  <div
                    className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                  >
                    Redução recente no valor
                  </div>
                </div>
              </label>
              <label
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getBorderClass()} ${getHoverBgClass()} ${
                  isDark
                    ? "hover:border-[#D4A24D]/50"
                    : "hover:border-[#D4A24D]"
                }`}
              >
                <input
                  type="checkbox"
                  name="etiquetas.financiável"
                  checked={formData.etiquetas.financiável}
                  onChange={handleChange}
                  className={getCheckboxClass()}
                />
                <div>
                  <div
                    className={`font-medium transition-colors ${getTextClass()}`}
                  >
                    Financiável
                  </div>
                  <div
                    className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                  >
                    Exibir badge financiável
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* ========== SEÇÃO 4: ACCORDIONS ========== */}
          <div className="space-y-4">
            {/* ===== ACCORDION 1: CARACTERÍSTICAS DO IMÓVEL ===== */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("caracteristicas")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <CubeTransparentIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Características do Imóvel
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Medidas, estrutura, infraestrutura e informações
                      estratégicas
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.caracteristicas ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.caracteristicas && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="space-y-8">
                    {/* 📐 Medidas e Dimensões */}
                    <div>
                      <div className="flex items-center space-x-2 mb-4">
                        <CubeTransparentIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          📐 Medidas e Dimensões
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Área útil (m²)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.areaUtil"
                            value={formData.caracteristicas.areaUtil}
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Área privativa (m²)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.areaPrivativa"
                            value={formData.caracteristicas.areaPrivativa}
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Frente do terreno (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.frenteTerreno"
                            value={formData.caracteristicas.frenteTerreno}
                            onChange={handleChange}
                            placeholder="Ex: 10m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Fundo (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.fundo"
                            value={formData.caracteristicas.fundo}
                            onChange={handleChange}
                            placeholder="Ex: 25m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Lateral esquerda (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.lateralEsquerda"
                            value={formData.caracteristicas.lateralEsquerda}
                            onChange={handleChange}
                            placeholder="Ex: 30m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Lateral direita (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.lateralDireita"
                            value={formData.caracteristicas.lateralDireita}
                            onChange={handleChange}
                            placeholder="Ex: 30m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Pé direito (m)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.peDireito"
                            value={formData.caracteristicas.peDireito}
                            onChange={handleChange}
                            placeholder="Ex: 3,20m"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                      </div>

                      {/* Se for lote */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Topografia
                          </label>
                          <select
                            name="caracteristicas.topografia"
                            value={formData.caracteristicas.topografia}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            {topografiaOpcoes.map((opcao) => (
                              <option
                                key={opcao.value}
                                value={opcao.value}
                                className={getOptionBgClass()}
                              >
                                {opcao.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center pt-6">
                          <label className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              name="caracteristicas.esquina"
                              checked={formData.caracteristicas.esquina}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              Esquina
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* 🏗 Estrutura do Imóvel */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <HomeIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          🏗 Estrutura do Imóvel
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Tipo de construção
                          </label>
                          <select
                            name="caracteristicas.tipoConstrucao"
                            value={formData.caracteristicas.tipoConstrucao}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            {tipoConstrucaoOpcoes.map((opcao) => (
                              <option
                                key={opcao.value}
                                value={opcao.value}
                                className={getOptionBgClass()}
                              >
                                {opcao.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Ano de construção
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.anoConstrucao"
                            value={formData.caracteristicas.anoConstrucao}
                            onChange={handleChange}
                            placeholder="Ex: 2020"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Número de pavimentos
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.numeroPavimentos"
                            value={formData.caracteristicas.numeroPavimentos}
                            onChange={handleChange}
                            min="0"
                            placeholder="0"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.reformadoRecentemente"
                            checked={
                              formData.caracteristicas.reformadoRecentemente
                            }
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Reformado recentemente?
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.imovelAverbado"
                            checked={formData.caracteristicas.imovelAverbado}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Imóvel averbado?
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.financiavel"
                            checked={formData.caracteristicas.financiavel}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Financiável?
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.aceitaPermuta"
                            checked={formData.caracteristicas.aceitaPermuta}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Aceita permuta?
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* ⚡ Infraestrutura interna */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <LightBulbIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          ⚡ Infraestrutura interna
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Tipo de iluminação
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.tipoIluminacao"
                            value={formData.caracteristicas.tipoIluminacao}
                            onChange={handleChange}
                            placeholder="Ex: LED, Fluorescente"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Tipo de telhado
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.tipoTelhado"
                            value={formData.caracteristicas.tipoTelhado}
                            onChange={handleChange}
                            placeholder="Ex: Cerâmica, Metálico"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Caixa d'água (litros)
                          </label>
                          <input
                            type="number"
                            name="caracteristicas.caixaDAgua"
                            value={formData.caracteristicas.caixaDAgua}
                            onChange={handleChange}
                            placeholder="0"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Sistema de esgoto
                          </label>
                          <select
                            name="caracteristicas.sistemaEsgoto"
                            value={formData.caracteristicas.sistemaEsgoto}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            {sistemaEsgotoOpcoes.map((opcao) => (
                              <option
                                key={opcao.value}
                                value={opcao.value}
                                className={getOptionBgClass()}
                              >
                                {opcao.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Aquecimento de água
                          </label>
                          <select
                            name="caracteristicas.aquecimentoAgua"
                            value={formData.caracteristicas.aquecimentoAgua}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            {aquecimentoAguaOpcoes.map((opcao) => (
                              <option
                                key={opcao.value}
                                value={opcao.value}
                                className={getOptionBgClass()}
                              >
                                {opcao.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.forroLaje"
                            checked={formData.caracteristicas.forroLaje}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Forro em laje?
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.sistemaEletricoNovo"
                            checked={
                              formData.caracteristicas.sistemaEletricoNovo
                            }
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Sistema elétrico novo?
                          </span>
                        </label>
                      </div>
                    </div>

                    {/* 🏘 Informações estratégicas */}
                    <div className="pt-4 border-t">
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPinIcon
                          className={`w-5 h-5 ${getIconColorClass()}`}
                        />
                        <h4
                          className={`text-md font-semibold ${getTextClass()}`}
                        >
                          🏘 Informações estratégicas
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Posição solar
                          </label>
                          <select
                            name="caracteristicas.posicaoSolar"
                            value={formData.caracteristicas.posicaoSolar}
                            onChange={handleChange}
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                          >
                            <option value="" className={getOptionBgClass()}>
                              Selecione
                            </option>
                            {posicaoSolarOpcoes.map((opcao) => (
                              <option
                                key={opcao.value}
                                value={opcao.value}
                                className={getOptionBgClass()}
                              >
                                {opcao.label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label
                            className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                          >
                            Condomínio com taxa mensal (R$)
                          </label>
                          <input
                            type="text"
                            name="caracteristicas.condominioTaxaMensal"
                            value={
                              formData.caracteristicas.condominioTaxaMensal
                            }
                            onChange={handleChange}
                            placeholder="0,00"
                            className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.ventilacaoCruzada"
                            checked={formData.caracteristicas.ventilacaoCruzada}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Ventilação cruzada
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.vistaLivre"
                            checked={formData.caracteristicas.vistaLivre}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Vista livre
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.vistaPermanente"
                            checked={formData.caracteristicas.vistaPermanente}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Vista permanente
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.ruaSemSaida"
                            checked={formData.caracteristicas.ruaSemSaida}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Rua sem saída
                          </span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}">
                          <input
                            type="checkbox"
                            name="caracteristicas.esquinaInfo"
                            checked={formData.caracteristicas.esquinaInfo}
                            onChange={handleChange}
                            className={getCheckboxClass()}
                          />
                          <span
                            className={`transition-colors ${getTextClass()}`}
                          >
                            Esquina
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACCORDION 2: ACABAMENTOS ===== */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("acabamentos")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <PaintBrushIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Acabamentos
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Pisos, revestimentos, teto, esquadrias e bancadas
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.acabamentos ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.acabamentos && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="space-y-8">
                    {/* 🔹 Pisos */}
                    <div>
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Pisos
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "pisoPorcelanato", label: "Porcelanato" },
                          { key: "pisoCeramica", label: "Cerâmica" },
                          { key: "pisoLaminado", label: "Piso laminado" },
                          { key: "pisoVinilico", label: "Piso vinílico" },
                          { key: "pisoMadeiraMaciça", label: "Madeira maciça" },
                          { key: "pisoTaco", label: "Taco" },
                          {
                            key: "pisoCimentoQueimado",
                            label: "Cimento queimado",
                          },
                          { key: "pisoMarmore", label: "Mármore" },
                          { key: "pisoGranito", label: "Granito" },
                          { key: "pisoFrio", label: "Piso frio" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 🔹 Revestimentos de parede */}
                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Revestimentos de parede
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "revestimentoAzulejo", label: "Azulejo" },
                          { key: "revestimentoPastilha", label: "Pastilha" },
                          {
                            key: "revestimentoPorcelanato",
                            label: "Porcelanato em parede",
                          },
                          {
                            key: "revestimentoPedraNatural",
                            label: "Pedra natural",
                          },
                          {
                            key: "revestimentoPapelParede",
                            label: "Papel de parede",
                          },
                          { key: "revestimento3D", label: "Revestimento 3D" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 🔹 Teto e forro */}
                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Teto e forro
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          {
                            key: "tetoGessoRebaixado",
                            label: "Gesso rebaixado",
                          },
                          { key: "tetoSancaGesso", label: "Sanca de gesso" },
                          { key: "tetoForroPVC", label: "Forro de PVC" },
                          { key: "tetoLaje", label: "Laje" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 🔹 Esquadrias e portas */}
                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Esquadrias e portas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          {
                            key: "portaMadeiraMaciça",
                            label: "Porta de madeira maciça",
                          },
                          { key: "portaLaqueada", label: "Porta laqueada" },
                          {
                            key: "esquadriaAluminio",
                            label: "Esquadrias de alumínio",
                          },
                          { key: "esquadriaPVC", label: "Esquadrias de PVC" },
                          { key: "portaPivotante", label: "Porta pivotante" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 🔹 Bancadas */}
                    <div className="pt-4 border-t">
                      <h4
                        className={`text-md font-semibold mb-4 ${getTextClass()}`}
                      >
                        🔹 Bancadas
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {[
                          { key: "bancadaGranito", label: "Granito" },
                          { key: "bancadaMarmore", label: "Mármore" },
                          { key: "bancadaQuartzo", label: "Quartzo" },
                          { key: "bancadaNanoglass", label: "Nanoglass" },
                        ].map(({ key, label }) => (
                          <label
                            key={key}
                            className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                          >
                            <input
                              type="checkbox"
                              name={`acabamentos.${key}`}
                              checked={formData.acabamentos[key]}
                              onChange={handleChange}
                              className={getCheckboxClass()}
                            />
                            <span
                              className={`transition-colors ${getTextClass()}`}
                            >
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACCORDION 3: ÁREA DE LAZER ===== */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("areaLazer")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <SunIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Área de Lazer
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Instalações de lazer e entretenimento
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.areaLazer ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.areaLazer && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "piscina", label: "Piscina" },
                      { key: "churrasqueira", label: "Churrasqueira" },
                      { key: "espacoGourmet", label: "Espaço gourmet" },
                      { key: "salaoFestas", label: "Salão de festas" },
                      { key: "salaoJogos", label: "Salão de jogos" },
                      { key: "academia", label: "Academia" },
                      { key: "playground", label: "Playground" },
                      {
                        key: "quadraPoliesportiva",
                        label: "Quadra poliesportiva",
                      },
                      { key: "campoSociety", label: "Campo society" },
                      { key: "areaVerde", label: "Área verde" },
                      { key: "jardim", label: "Jardim" },
                      { key: "deck", label: "Deck" },
                      { key: "rooftop", label: "Rooftop" },
                      { key: "sauna", label: "Sauna" },
                      { key: "espacoPet", label: "Espaço pet" },
                      { key: "brinquedoteca", label: "Brinquedoteca" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`areaLazer.${key}`}
                          checked={formData.areaLazer[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACCORDION 4: LOCALIZAÇÃO E VIZINHANÇA ===== */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("localizacaoVizinhanca")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <MapPinIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Localização e Vizinhança
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Proximidade de serviços e características do entorno
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.localizacaoVizinhanca ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.localizacaoVizinhanca && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "proximoCentro", label: "Próximo ao centro" },
                      {
                        key: "proximoSupermercado",
                        label: "Próximo a supermercado",
                      },
                      { key: "proximoEscola", label: "Próximo a escola" },
                      { key: "proximoHospital", label: "Próximo a hospital" },
                      { key: "proximoFarmacia", label: "Próximo a farmácia" },
                      {
                        key: "proximoOnibus",
                        label: "Próximo a ponto de ônibus",
                      },
                      { key: "proximoShopping", label: "Próximo a shopping" },
                      { key: "proximoFaculdade", label: "Próximo a faculdade" },
                      { key: "bairroResidencial", label: "Bairro residencial" },
                      { key: "bairroComercial", label: "Bairro comercial" },
                      { key: "ruaAsfaltada", label: "Rua asfaltada" },
                      { key: "ruaTranquila", label: "Rua tranquila" },
                      { key: "regiaoValorizada", label: "Região valorizada" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`localizacaoVizinhanca.${key}`}
                          checked={formData.localizacaoVizinhanca[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACCORDION 5: SEGURANÇA ===== */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("seguranca")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <ShieldCheckIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Segurança
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Sistemas de segurança e proteção patrimonial
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.seguranca ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.seguranca && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "portaoEletronico", label: "Portão eletrônico" },
                      { key: "interfone", label: "Interfone" },
                      { key: "cercaEletrica", label: "Cerca elétrica" },
                      { key: "sistemaCameras", label: "Sistema de câmeras" },
                      { key: "alarme", label: "Alarme" },
                      { key: "portaria24h", label: "Portaria 24h" },
                      { key: "vigilancia24h", label: "Vigilância 24h" },
                      { key: "controleAcesso", label: "Controle de acesso" },
                      { key: "fechaduraDigital", label: "Fechadura digital" },
                      { key: "condominioFechado", label: "Condomínio fechado" },
                      { key: "murosAltos", label: "Muros altos" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`seguranca.${key}`}
                          checked={formData.seguranca[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACCORDION 6: ARMÁRIOS E ARMAZENAMENTO ===== */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("armariosArmazenamento")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <BuildingStorefrontIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Armários e Armazenamento
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Móveis planejados e soluções de armazenamento
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.armariosArmazenamento ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.armariosArmazenamento && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      {
                        key: "armarioCozinhaPlanejado",
                        label: "Armário de cozinha planejado",
                      },
                      { key: "armariosEmbutidos", label: "Armários embutidos" },
                      { key: "armariosQuarto", label: "Armários no quarto" },
                      {
                        key: "armariosBanheiro",
                        label: "Armários no banheiro",
                      },
                      { key: "closet", label: "Closet" },
                      { key: "despensa", label: "Despensa" },
                      { key: "deposito", label: "Depósito" },
                      { key: "roupeiro", label: "Roupeiro" },
                      { key: "maleiro", label: "Maleiro" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`armariosArmazenamento.${key}`}
                          checked={formData.armariosArmazenamento[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACCORDION 7: SERVIÇOS E UTILIDADES ===== */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("servicosUtilidades")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <BoltIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Serviços e Utilidades
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Serviços coletivos, utilidades e infraestrutura urbana
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.servicosUtilidades ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.servicosUtilidades && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "aguaEncanada", label: "Água encanada" },
                      { key: "energiaEletrica", label: "Energia elétrica" },
                      { key: "pocoArtesiano", label: "Poço artesiano" },
                      { key: "aquecimentoGas", label: "Aquecimento a gás" },
                      { key: "aquecimentoSolar", label: "Aquecimento solar" },
                      { key: "gasEncanado", label: "Gás encanado" },
                      {
                        key: "arCondicionadoInstalado",
                        label: "Ar-condicionado instalado",
                      },
                      {
                        key: "infraArCondicionado",
                        label: "Infra para ar-condicionado",
                      },
                      {
                        key: "internetFibra",
                        label: "Internet fibra disponível",
                      },
                      { key: "iluminacaoLED", label: "Iluminação em LED" },
                      {
                        key: "energiaSolar",
                        label: "Sistema de energia solar",
                      },
                      { key: "elevador", label: "Elevador" },
                      { key: "coletaLixo", label: "Coleta de lixo regular" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`servicosUtilidades.${key}`}
                          checked={formData.servicosUtilidades[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ===== ACCORDION 8: DIFERENCIAIS DO IMÓVEL ===== */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("diferenciais")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <HeartIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Diferenciais do Imóvel
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Características especiais que valorizam o imóvel
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.diferenciais ? "rotate-180" : ""}`}
                >
                  <svg
                    className={`w-6 h-6 transition-colors ${getTextSecondaryClass()}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>
              {accordionOpen.diferenciais && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                      { key: "varanda", label: "Varanda" },
                      { key: "sacada", label: "Sacada" },
                      { key: "lavabo", label: "Lavabo" },
                      { key: "banheira", label: "Banheira" },
                      { key: "boxVidro", label: "Box de vidro" },
                      {
                        key: "dependenciaEmpregada",
                        label: "Dependência de empregada",
                      },
                      { key: "escritorio", label: "Escritório" },
                      { key: "peDireitoDuplo", label: "Pé direito duplo" },
                      { key: "mezanino", label: "Mezanino" },
                      { key: "vistaPanoramica", label: "Vista panorâmica" },
                    ].map(({ key, label }) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`diferenciais.${key}`}
                          checked={formData.diferenciais[key]}
                          onChange={handleChange}
                          className={getCheckboxClass()}
                        />
                        <span className={`transition-colors ${getTextClass()}`}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== BLOCO DE FEEDBACK ========== */}
          {submitMessage.text && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                submitMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {submitMessage.type === "success" ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 text-red-600" />
                )}
                <p className="font-medium">{submitMessage.text}</p>
              </div>
              {submitMessage.type === "success" && (
                <p className="mt-1 text-sm opacity-80">
                  Você será redirecionado para a lista de imóveis em alguns
                  segundos...
                </p>
              )}
            </div>
          )}

          {/* ========== SEÇÃO 5: AÇÕES ========== */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="px-8"
                disabled={loading}
              >
                <div className="flex items-center space-x-2">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      <span>Salvar Imóvel</span>
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastrarImovel;
