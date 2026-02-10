import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
const CadastrarImovel = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  // Estados do formulário - ATUALIZADO COM NOVOS ACCORDIONS
  const [formData, setFormData] = useState({
    // Seção 1: Informações Gerais
    codigo: "",
    titulo: "",
    finalidade: { venda: true, aluguel: false },
    tipo: "",
    preco: "",
    status: "disponivel",
    financiado: false,
    proprietarioId: "",
    corretorId: "",
    ocultarPreco: false,
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
    // Seção 4: Características (Accordion)
    caracteristicas: {
      quartos: "",
      banheiros: "",
      suites: "",
      vagas: "",
      areaTotal: "",
      areaConstruida: "",
    },
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
    acabamentos: {
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
    // NOVOS ACCORDIONS
    areaLazer: {
      churrasqueira: false,
      jardimPrivativo: false,
      quintal: false,
      areaArborizada: false,
      areaGourmet: false,
      varanda: false,
      terraco: false,
      salaoJogos: false,
      spa: false,
      cinema: false,
    },
    localizacaoVizinhanca: {
      supermercadoProximo: false,
      farmaciaProximo: false,
      escolaProximo: false,
      hospitalProximo: false,
      shoppingProximo: false,
      metroProximo: false,
      onibusProximo: false,
      praiaProximo: false,
      parqueProximo: false,
      restauranteProximo: false,
    },
    segurancaUtilidades: {
      alarmeMonitorado: false,
      iluminacaoExterna: false,
      portaoEletronico: false,
      cercaEletrica: false,
      vigilancia24h: false,
      coletaSeletiva: false,
      segurancaPrivada: false,
      iluminacaoPublica: false,
      geradorEmergencia: false,
      sistemaIncendio: false,
    },
  });
  // Estados para controle dos accordions - AGORA SÓ UM PODE ESTAR ABERTO
  const [accordionOpen, setAccordionOpen] = useState({
    caracteristicas: true, // Começa aberto
    infraestrutura: false,
    acabamentos: false,
    areaLazer: false,
    localizacaoVizinhanca: false,
    segurancaUtilidades: false,
  });
  // Estado para loading do CEP
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");
  // ==============================================
  // OPÇÕES PARA SELECTS
  // ==============================================
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
  const pisos = [
    { value: "porcelanato", label: "Porcelanato" },
    { value: "ceramica", label: "Cerâmica" },
    { value: "madeira", label: "Madeira" },
    { value: "laminado", label: "Laminado" },
    { value: "cimento", label: "Cimento queimado" },
    { value: "granito", label: "Granito" },
    { value: "marmore", label: "Mármore" },
  ];
  // Dados de exemplo - substitua por chamadas à sua API
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
  // Função para buscar CEP usando fetch
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

      if (!response.ok) {
        throw new Error("Erro na resposta da API");
      }

      const data = await response.json();

      if (data.erro) {
        setCepError("CEP não encontrado");
        return;
      }
      // Preenche automaticamente os campos com os dados do CEP
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
      console.error("Erro na busca de CEP:", error);
    } finally {
      setCepLoading(false);
    }
  };
  // Handler para mudanças no CEP
  const handleCepChange = (e) => {
    const { value } = e.target;

    // Atualiza o estado
    setFormData((prev) => ({
      ...prev,
      cep: value,
    }));
    // Busca automática quando o CEP estiver completo
    const cepLimpo = value.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      buscarCep(value);
    } else {
      setCepError("");
    }
  };
  // Handlers
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
  // FUNÇÃO CORRIGIDA: UM ABRE, OUTRO FECHA
  const toggleAccordion = (section) => {
    setAccordionOpen((prev) => {
      const newState = {
        caracteristicas: false,
        infraestrutura: false,
        acabamentos: false,
        areaLazer: false,
        localizacaoVizinhanca: false,
        segurancaUtilidades: false,
      };

      // Se o accordion já está aberto, fecha todos (toggle off)
      // Se não está aberto, abre apenas este (toggle on)
      newState[section] = !prev[section];

      return newState;
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria a integração com o Supabase
    console.log("Dados para cadastro:", formData);
    alert("Imóvel cadastrado com sucesso! (Dados no console)");
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
  // Formatar preço para exibição
  const formatPrice = (price) => {
    if (!price) return "";
    return Number(price).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };
  // ==============================================
  // FUNÇÕES DE CORES - TOTALMENTE REVISADAS
  // ==============================================
  const getBgClass = () => (isDark ? "bg-gray-900" : "bg-white");
  const getBorderClass = () => (isDark ? "border-gray-700" : "border-gray-200");
  // CORREÇÃO COMPLETA: No modo claro, textos PRETOS, não cinza
  const getTextClass = () => (isDark ? "text-gray-100" : "text-gray-900");
  const getTextSecondaryClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  // CORREÇÃO CRÍTICA: No modo claro, hover deve manter bg-white (não cinza)
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
  // CORREÇÃO DEFINITIVA PARA ACCORDIONS NO MODO CLARO
  // No modo claro: cinza MUITO ESCURO para boa legibilidade
  const getAccordionTitleClass = () =>
    isDark ? "text-gray-100" : "text-gray-800";
  const getAccordionSubtitleClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  // CORREÇÃO PARA CONTADORES (+/-) - No modo claro: bordas cinza claro, texto cinza escuro
  const getCounterButtonClass = () =>
    isDark
      ? "bg-gray-900 border-gray-600 hover:bg-gray-700 text-gray-300"
      : "bg-white border-gray-300 hover:bg-gray-100 text-gray-700";
  const getCounterInputClass = () =>
    isDark
      ? "bg-gray-800 border-gray-700 text-gray-200"
      : "bg-white border-gray-300 text-gray-900";
  // Cores para status badges
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
  // Cores para etiquetas financiáveis
  const getFinanciavelColor = () =>
    isDark
      ? "bg-blue-900/30 text-blue-300 border border-blue-800"
      : "bg-blue-100 text-blue-800";
  // Nova classe para checkboxes custom
  const getCheckboxClass = () =>
    `appearance-none h-5 w-5 border rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/50 focus:ring-offset-2 ${isDark ? "bg-gray-800" : "bg-white"} ${getCheckboxBorderClass()} checked:bg-[#D4A24D] checked:border-[#D4A24D] relative checked:after:absolute checked:after:content-[''] checked:after:h-[0.625rem] checked:after:w-[0.3125rem] checked:after:rotate-45 checked:after:translate-x-[0.375rem] checked:after:translate-y-[0.125rem] checked:after:border-solid checked:after:border-white checked:after:border-width-0 checked:after:border-r-2 checked:after:border-b-2`;
  // Nova classe para radios custom
  const getRadioClass = () =>
    `appearance-none h-4 w-4 rounded-full border transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4A24D] focus:ring-offset-2 ${isDark ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"} checked:bg-[#D4A24D] checked:border-[#D4A24D] relative checked:before:content-[''] checked:before:absolute checked:before:rounded-full checked:before:bg-white checked:before:w-2 checked:before:h-2 checked:before:top-1 checked:before:left-1`;
  // Nova classe para options de select
  const getOptionBgClass = () => (isDark ? "bg-gray-800" : "bg-white");
  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${isDark ? "bg-gray-900" : "bg-gradient-to-b from-[#D4A24D]/5 to-[#31353E]/5"}`}
    >
      {/* Header da Página */}
      <div
        className={`border-b px-4 py-4 transition-colors duration-200 ${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/admin/imoveis")}
                className={`p-2 rounded-lg transition-colors ${isDark ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}`}
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
          {/* SEÇÃO 1: Informações Gerais do Imóvel */}
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
              {/* Preço e Configuração de Ocultar */}
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
            </div>
          </div>
          {/* SEÇÃO 2: Localização Aprimorada */}
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
              {/* CEP com busca automática */}
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
              {/* Endereço (preenchido automaticamente) */}
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
              {/* Bairro (preenchido automaticamente) */}
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
              {/* Cidade (preenchido automaticamente) */}
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
              {/* Estado (preenchido automaticamente) */}
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
              {/* Configurações de Privacidade */}
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
                {/* Preview da exibição na vitrine */}
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
                      : `${formData.endereco || "Endereço"}${!formData.ocultarNumero && formData.numero ? `, ${formData.numero}` : ""}, ${formData.bairro || "Bairro"}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* SEÇÃO 3: Etiquetas (Vitrine) */}
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
              {/* Destaque da Semana */}
              <label
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getBorderClass()} ${getHoverBgClass()} ${isDark ? "hover:border-[#D4A24D]/50" : "hover:border-[#D4A24D]"}`}
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
              {/* Novo no Site */}
              <label
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getBorderClass()} ${getHoverBgClass()} ${isDark ? "hover:border-[#D4A24D]/50" : "hover:border-[#D4A24D]"}`}
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
              {/* Baixou o Preço */}
              <label
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getBorderClass()} ${getHoverBgClass()} ${isDark ? "hover:border-[#D4A24D]/50" : "hover:border-[#D4A24D]"}`}
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
              {/* Financiável (Etiqueta) */}
              <label
                className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 cursor-pointer ${getBorderClass()} ${getHoverBgClass()} ${isDark ? "hover:border-[#D4A24D]/50" : "hover:border-[#D4A24D]"}`}
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
          {/* SEÇÃO 4: Accordions */}
          <div className="space-y-4">
            {/* Accordion 1: Características do Imóvel - CORES CORRIGIDAS */}
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
                    <HomeIcon className={`w-5 h-5 ${getIconColorClass()}`} />
                  </div>
                  <div className="text-left">
                    {/* CORES CORRETAS PARA MODO CLARO */}
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Características do Imóvel
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Quartos, banheiros, área, vagas...
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Quartos - CORES CORRETAS */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                      >
                        Quartos
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              caracteristicas: {
                                ...prev.caracteristicas,
                                quartos: Math.max(
                                  0,
                                  (parseInt(prev.caracteristicas.quartos) ||
                                    0) - 1,
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
                          name="caracteristicas.quartos"
                          value={formData.caracteristicas.quartos}
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
                              caracteristicas: {
                                ...prev.caracteristicas,
                                quartos:
                                  (parseInt(prev.caracteristicas.quartos) ||
                                    0) + 1,
                              },
                            }))
                          }
                          className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Banheiros - CORES CORRETAS */}
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
                              caracteristicas: {
                                ...prev.caracteristicas,
                                banheiros: Math.max(
                                  0,
                                  (parseInt(prev.caracteristicas.banheiros) ||
                                    0) - 1,
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
                          name="caracteristicas.banheiros"
                          value={formData.caracteristicas.banheiros}
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
                              caracteristicas: {
                                ...prev.caracteristicas,
                                banheiros:
                                  (parseInt(prev.caracteristicas.banheiros) ||
                                    0) + 1,
                              },
                            }))
                          }
                          className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Suítes - CORES CORRETAS */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                      >
                        Suítes
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              caracteristicas: {
                                ...prev.caracteristicas,
                                suites: Math.max(
                                  0,
                                  (parseInt(prev.caracteristicas.suites) || 0) -
                                    1,
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
                          name="caracteristicas.suites"
                          value={formData.caracteristicas.suites}
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
                              caracteristicas: {
                                ...prev.caracteristicas,
                                suites:
                                  (parseInt(prev.caracteristicas.suites) || 0) +
                                  1,
                              },
                            }))
                          }
                          className={`p-2 rounded-lg border transition-colors ${getCounterButtonClass()}`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {/* Vagas de Garagem - CORES CORRETAS */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                      >
                        Vagas de Garagem
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              caracteristicas: {
                                ...prev.caracteristicas,
                                vagas: Math.max(
                                  0,
                                  (parseInt(prev.caracteristicas.vagas) || 0) -
                                    1,
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
                          name="caracteristicas.vagas"
                          value={formData.caracteristicas.vagas}
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
                              caracteristicas: {
                                ...prev.caracteristicas,
                                vagas:
                                  (parseInt(prev.caracteristicas.vagas) || 0) +
                                  1,
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
                          name="caracteristicas.areaTotal"
                          value={formData.caracteristicas.areaTotal}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          className={`w-full pl-4 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
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
                          name="caracteristicas.areaConstruida"
                          value={formData.caracteristicas.areaConstruida}
                          onChange={handleChange}
                          min="0"
                          step="0.01"
                          placeholder="0,00"
                          className={`w-full pl-4 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
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
              )}
            </div>
            {/* Accordion 2: Infraestrutura - CORES CORRIGIDAS */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("infraestrutura")}
                className={`w-full flex items-center justify-between p-6 transition-colors duration-200 ${getBgClass()} ${getHoverBgClass()}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                    <WrenchScrewdriverIcon
                      className={`w-5 h-5 ${getIconColorClass()}`}
                    />
                  </div>
                  <div className="text-left">
                    <h3
                      className={`text-lg font-semibold transition-colors ${getAccordionTitleClass()}`}
                    >
                      Infraestrutura
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Instalações e serviços disponíveis
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.infraestrutura ? "rotate-180" : ""}`}
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
              {accordionOpen.infraestrutura && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries({
                      agua: "Água",
                      energia: "Energia Elétrica",
                      esgoto: "Esgoto",
                      internet: "Internet",
                      gas: "Gás",
                      piscina: "Piscina",
                      churrasqueira: "Churrasqueira",
                      academia: "Academia",
                      salaoFestas: "Salão de Festas",
                      playground: "Playground",
                      portaoEletronico: "Portão Eletrônico",
                      interfone: "Interfone",
                      cameraSeguranca: "Câmera de Segurança",
                      alarme: "Alarme",
                    }).map(([key, label]) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`infraestrutura.${key}`}
                          checked={formData.infraestrutura[key]}
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
            {/* Accordion 3: Acabamentos - CORES CORRIGIDAS */}
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
                      Detalhes de acabamento e mobília
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
                  <div className="space-y-6">
                    {/* Tipo de Piso */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                      >
                        Tipo de Piso
                      </label>
                      <select
                        name="acabamentos.piso"
                        value={formData.acabamentos.piso}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                      >
                        <option value="" className={getOptionBgClass()}>
                          Selecione o tipo de piso
                        </option>
                        {pisos.map((piso) => (
                          <option
                            key={piso.value}
                            value={piso.value}
                            className={getOptionBgClass()}
                          >
                            {piso.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    {/* Outros Acabamentos - Grid de Checkboxes */}
                    <div>
                      <label
                        className={`block text-sm font-medium mb-3 transition-colors ${getTextSecondaryClass()}`}
                      >
                        Outros Acabamentos
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {Object.entries({
                          armarioCozinha: "Armário de Cozinha",
                          armarioBanheiro: "Armário de Banheiro",
                          banheira: "Banheira",
                          boxVidro: "Box de Vidro",
                          varanda: "Varanda",
                          sacada: "Sacada",
                          lavabo: "Lavabo",
                          dependenciaEmpregada: "Dependência de Empregada",
                        }).map(([key, label]) => (
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
                    {/* Campos de Texto Adicionais */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                        >
                          Tipo de Azulejo
                        </label>
                        <input
                          type="text"
                          name="acabamentos.azulejo"
                          value={formData.acabamentos.azulejo}
                          onChange={handleChange}
                          placeholder="Ex: Cerâmico, Pastilha..."
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                        >
                          Tipo de Porta
                        </label>
                        <input
                          type="text"
                          name="acabamentos.porta"
                          value={formData.acabamentos.porta}
                          onChange={handleChange}
                          placeholder="Ex: Madeira, MDF, PVC..."
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                        />
                      </div>
                      <div>
                        <label
                          className={`block text-sm font-medium mb-2 transition-colors ${getTextSecondaryClass()}`}
                        >
                          Tipo de Janela
                        </label>
                        <input
                          type="text"
                          name="acabamentos.janela"
                          value={formData.acabamentos.janela}
                          onChange={handleChange}
                          placeholder="Ex: PVC, Alumínio, Madeira..."
                          className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* NOVO ACCORDION 4: Área de Lazer - CORES CORRIGIDAS */}
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
                    {Object.entries({
                      churrasqueira: "Churrasqueira",
                      jardimPrivativo: "Jardim Privativo",
                      quintal: "Quintal",
                      areaArborizada: "Área Arborizada",
                      areaGourmet: "Área Gourmet",
                      varanda: "Varanda",
                      terraco: "Terraço",
                      salaoJogos: "Salão de Jogos",
                      spa: "Spa",
                      cinema: "Sala de Cinema",
                    }).map(([key, label]) => (
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
            {/* NOVO ACCORDION 5: Localização e Vizinhança - CORES CORRIGIDAS */}
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
                      Proximidade de serviços e comércios
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
                    {Object.entries({
                      supermercadoProximo: "Supermercado próximo (até 500m)",
                      farmaciaProximo: "Farmácia próxima (até 300m)",
                      escolaProximo: "Escola próxima (até 500m)",
                      hospitalProximo: "Hospital próximo (até 1km)",
                      shoppingProximo: "Shopping próximo (até 2km)",
                      metroProximo: "Metrô próximo (até 1km)",
                      onibusProximo: "Ponto de ônibus próximo (até 300m)",
                      praiaProximo: "Praia próxima (até 5km)",
                      parqueProximo: "Parque próximo (até 1km)",
                      restauranteProximo: "Restaurantes próximos (até 500m)",
                    }).map(([key, label]) => (
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
            {/* NOVO ACCORDION 6: Segurança e Utilidades - CORES CORRIGIDAS */}
            <div
              className={`rounded-xl border overflow-hidden transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
            >
              <button
                type="button"
                onClick={() => toggleAccordion("segurancaUtilidades")}
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
                      Segurança e Utilidades
                    </h3>
                    <p
                      className={`text-sm transition-colors ${getAccordionSubtitleClass()}`}
                    >
                      Sistemas de segurança e serviços coletivos
                    </p>
                  </div>
                </div>
                <div
                  className={`transform transition-transform ${accordionOpen.segurancaUtilidades ? "rotate-180" : ""}`}
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
              {accordionOpen.segurancaUtilidades && (
                <div
                  className={`px-6 pb-6 border-t pt-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries({
                      alarmeMonitorado: "Alarme Monitorado 24h",
                      iluminacaoExterna: "Iluminação Externa",
                      portaoEletronico: "Portão Eletrônico",
                      cercaEletrica: "Cerca Elétrica",
                      vigilancia24h: "Vigilância 24 horas",
                      coletaSeletiva: "Coleta Seletiva",
                      segurancaPrivada: "Segurança Privada",
                      iluminacaoPublica: "Iluminação Pública",
                      geradorEmergencia: "Gerador de Emergência",
                      sistemaIncendio: "Sistema de Combate a Incêndio",
                    }).map(([key, label]) => (
                      <label
                        key={key}
                        className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 ${getBorderClass()} ${getHoverBgClass()}`}
                      >
                        <input
                          type="checkbox"
                          name={`segurancaUtilidades.${key}`}
                          checked={formData.segurancaUtilidades[key]}
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
          {/* SEÇÃO 5: Ações - COM BOTÃO CANCELAR VERMELHO */}
          <div
            className={`rounded-xl border p-6 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              {/* BOTÃO CANCELAR VERMELHO SÓLIDO */}
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
              >
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="w-5 h-5" />
                  <span>Salvar Imóvel</span>
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
