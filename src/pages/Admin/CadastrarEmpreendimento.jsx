// src/pages/Admin/CadastrarEmpreendimento.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  BuildingLibraryIcon,
  HomeModernIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

const CadastrarEmpreendimento = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // =============== ESTADO DO FORMULÁRIO ===============
  const [formData, setFormData] = useState({
    nome: "",
    tipo: "",
    endereco: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    ano_construcao: "",
    numero_andares: "",
    total_unidades: "",
  });

  // =============== OPÇÕES PARA SELECTS ===============
  const tiposEmpreendimento = [
    {
      value: "edificio",
      label: "Edifício",
      desc: "Prédio de apartamentos",
      icon: BuildingOfficeIcon,
      gradient: "from-blue-500 to-blue-600",
      lightBg: "bg-blue-50",
      lightBorder: "border-blue-200",
      darkBg: "bg-blue-900/20",
      darkBorder: "border-blue-800",
      textColor: "text-blue-700",
      darkTextColor: "text-blue-300",
    },
    {
      value: "condominio",
      label: "Condomínio",
      desc: "Condomínio de casas",
      icon: HomeModernIcon,
      gradient: "from-green-500 to-green-600",
      lightBg: "bg-green-50",
      lightBorder: "border-green-200",
      darkBg: "bg-green-900/20",
      darkBorder: "border-green-800",
      textColor: "text-green-700",
      darkTextColor: "text-green-300",
    },
    {
      value: "residencial",
      label: "Residencial",
      desc: "Misto ou loteamento",
      icon: HomeIcon,
      gradient: "from-purple-500 to-purple-600",
      lightBg: "bg-purple-50",
      lightBorder: "border-purple-200",
      darkBg: "bg-purple-900/20",
      darkBorder: "border-purple-800",
      textColor: "text-purple-700",
      darkTextColor: "text-purple-300",
    },
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

  // =============== FUNÇÕES DE CORES (TEMA) ===============
  const getBgClass = () => (isDark ? "bg-gray-900" : "bg-gray-50");
  const getCardBgClass = () => (isDark ? "bg-gray-800" : "bg-white");
  const getBorderClass = () => (isDark ? "border-gray-700" : "border-gray-200");
  const getTextClass = () => (isDark ? "text-gray-100" : "text-gray-900");
  const getTextSecondaryClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  const getHoverBgClass = () =>
    isDark ? "hover:bg-gray-700" : "hover:bg-gray-100";
  const getInputBgClass = () => (isDark ? "bg-gray-700" : "bg-white");
  const getInputBorderClass = () =>
    isDark ? "border-gray-600" : "border-gray-300";
  const getInputTextClass = () => (isDark ? "text-gray-200" : "text-gray-900");
  const getPlaceholderClass = () =>
    isDark ? "placeholder-gray-500" : "placeholder-gray-400";
  const getIconBgClass = () => (isDark ? "bg-[#D4A24D]/20" : "bg-[#D4A24D]/10");
  const getIconColorClass = () =>
    isDark ? "text-[#D4A24D]" : "text-[#D4A24D]";
  const getOptionBgClass = () => (isDark ? "bg-gray-700" : "bg-white");

  // =============== HANDLERS ===============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // =============== BUSCAR CEP ===============
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState("");

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

  // =============== SUBMIT ===============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage({ type: "", text: "" });

    // Validação básica
    if (
      !formData.nome ||
      !formData.tipo ||
      !formData.cidade ||
      !formData.estado
    ) {
      setSubmitMessage({
        type: "error",
        text: "Preencha todos os campos obrigatórios.",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("edificios")
        .insert([
          {
            nome: formData.nome,
            tipo: formData.tipo,
            endereco: formData.endereco,
            numero: formData.numero,
            complemento: formData.complemento,
            bairro: formData.bairro,
            cidade: formData.cidade,
            estado: formData.estado,
            cep: formData.cep,
            ano_construcao: formData.ano_construcao
              ? parseInt(formData.ano_construcao)
              : null,
            numero_andares: formData.numero_andares
              ? parseInt(formData.numero_andares)
              : null,
            total_unidades: formData.total_unidades
              ? parseInt(formData.total_unidades)
              : null,
          },
        ])
        .select();

      if (error) throw error;

      setSubmitMessage({
        type: "success",
        text: `Empreendimento "${formData.nome}" cadastrado com sucesso!`,
      });

      setTimeout(() => {
        navigate("/admin/imoveis");
      }, 2000);
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

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${getBgClass()}`}
    >
      {/* HEADER FIXO - SEMPRE VISÍVEL */}
      <div
        className={`sticky top-0 z-10 border-b ${getBorderClass()} ${getCardBgClass()} shadow-sm`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
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
                <h1 className={`text-2xl font-bold ${getTextClass()}`}>
                  Novo Empreendimento
                </h1>
                <p className={`text-sm ${getTextSecondaryClass()}`}>
                  Cadastre um edifício, condomínio ou residencial
                </p>
              </div>
            </div>

            {/* BADGE DE TIPO SELECIONADO */}
            {formData.tipo && (
              <div
                className={`
                px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2
                ${
                  formData.tipo === "edificio"
                    ? isDark
                      ? "bg-blue-900/30 text-blue-300 border border-blue-800"
                      : "bg-blue-100 text-blue-800 border border-blue-300"
                    : ""
                }
                ${
                  formData.tipo === "condominio"
                    ? isDark
                      ? "bg-green-900/30 text-green-300 border border-green-800"
                      : "bg-green-100 text-green-800 border border-green-300"
                    : ""
                }
                ${
                  formData.tipo === "residencial"
                    ? isDark
                      ? "bg-purple-900/30 text-purple-300 border border-purple-800"
                      : "bg-purple-100 text-purple-800 border border-purple-300"
                    : ""
                }
              `}
              >
                {formData.tipo === "edificio" && (
                  <>
                    <BuildingOfficeIcon className="w-4 h-4" />
                    <span>Edifício</span>
                  </>
                )}
                {formData.tipo === "condominio" && (
                  <>
                    <HomeModernIcon className="w-4 h-4" />
                    <span>Condomínio</span>
                  </>
                )}
                {formData.tipo === "residencial" && (
                  <>
                    <HomeIcon className="w-4 h-4" />
                    <span>Residencial</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTEÚDO - LARGURA TOTAL COM PADDING LATERAL MÉDIO */}
      <div className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SEÇÃO 1: TIPO DO EMPREENDIMENTO */}
          <div
            className={`rounded-xl border p-6 ${getCardBgClass()} ${getBorderClass()} shadow-sm`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <BuildingLibraryIcon
                  className={`w-6 h-6 ${getIconColorClass()}`}
                />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${getTextClass()}`}>
                  Tipo do Empreendimento
                </h2>
                <p className={`text-sm ${getTextSecondaryClass()}`}>
                  Selecione o tipo que melhor descreve o empreendimento
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {tiposEmpreendimento.map((tipo) => {
                const Icon = tipo.icon;
                const isSelected = formData.tipo === tipo.value;

                return (
                  <label
                    key={tipo.value}
                    className={`
                      relative flex flex-col p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                      ${
                        isSelected
                          ? isDark
                            ? `border-[${tipo.darkBorder}] ${tipo.darkBg}`
                            : `border-[${tipo.lightBorder}] ${tipo.lightBg}`
                          : isDark
                            ? `border-gray-700 ${getCardBgClass()} hover:border-gray-600`
                            : `border-gray-200 bg-white hover:border-gray-300`
                      }
                    `}
                    style={{
                      borderColor: isSelected
                        ? tipo.value === "edificio"
                          ? isDark
                            ? "#1E40AF"
                            : "#93C5FD"
                          : tipo.value === "condominio"
                            ? isDark
                              ? "#166534"
                              : "#86EFAC"
                            : isDark
                              ? "#6B21A8"
                              : "#D8B4FE"
                        : "",
                    }}
                  >
                    <input
                      type="radio"
                      name="tipo"
                      value={tipo.value}
                      checked={isSelected}
                      onChange={handleChange}
                      className="sr-only"
                      required
                    />

                    <div className="flex items-start space-x-4">
                      <div
                        className={`
                        p-3 rounded-xl
                        ${
                          isSelected
                            ? isDark
                              ? `bg-${tipo.value === "edificio" ? "blue" : tipo.value === "condominio" ? "green" : "purple"}-900/50`
                              : tipo.lightBg
                            : isDark
                              ? "bg-gray-700"
                              : "bg-gray-100"
                        }
                      `}
                      >
                        <Icon
                          className={`
                          w-8 h-8
                          ${
                            isSelected
                              ? tipo.value === "edificio"
                                ? isDark
                                  ? "text-blue-300"
                                  : "text-blue-600"
                                : tipo.value === "condominio"
                                  ? isDark
                                    ? "text-green-300"
                                    : "text-green-600"
                                  : isDark
                                    ? "text-purple-300"
                                    : "text-purple-600"
                              : isDark
                                ? "text-gray-400"
                                : "text-gray-500"
                          }
                        `}
                        />
                      </div>

                      <div className="flex-1">
                        <div
                          className={`font-semibold text-base ${getTextClass()}`}
                        >
                          {tipo.label}
                        </div>
                        <div
                          className={`text-xs mt-1 ${getTextSecondaryClass()}`}
                        >
                          {tipo.desc}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-3 right-3">
                        <CheckCircleIcon
                          className={`
                          w-5 h-5
                          ${
                            tipo.value === "edificio"
                              ? isDark
                                ? "text-blue-300"
                                : "text-blue-600"
                              : tipo.value === "condominio"
                                ? isDark
                                  ? "text-green-300"
                                  : "text-green-600"
                                : isDark
                                  ? "text-purple-300"
                                  : "text-purple-600"
                          }
                        `}
                        />
                      </div>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          {/* SEÇÃO 2: INFORMAÇÕES BÁSICAS */}
          <div
            className={`rounded-xl border p-6 ${getCardBgClass()} ${getBorderClass()} shadow-sm`}
          >
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                <BuildingOfficeIcon
                  className={`w-6 h-6 ${getIconColorClass()}`}
                />
              </div>
              <div>
                <h2 className={`text-lg font-semibold ${getTextClass()}`}>
                  Informações Básicas
                </h2>
                <p className={`text-sm ${getTextSecondaryClass()}`}>
                  Dados principais do empreendimento
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Nome do Empreendimento - DESTAQUE */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                >
                  Nome do Empreendimento <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Edifício Copan, Condomínio Alphaville, Residencial Parque"
                  className={`
                    w-full px-4 py-3 text-base
                    border-2 rounded-lg
                    focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                    transition-all duration-200
                    ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                  `}
                />
              </div>

              {/* Grid de 2 colunas para CEP e Endereço */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* CEP */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    CEP
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="cep"
                      value={formData.cep}
                      onChange={handleCepChange}
                      placeholder="00000-000"
                      maxLength="9"
                      className={`
                        w-full px-4 py-3
                        border-2 rounded-lg
                        focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                        transition-all duration-200
                        ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                      `}
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
                </div>

                {/* Endereço */}
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Endereço
                  </label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    placeholder="Ex: Rua das Flores"
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                    `}
                  />
                </div>
              </div>

              {/* Grid de 3 colunas para Número, Complemento e Bairro */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Número
                  </label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    placeholder="123"
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                    `}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Complemento
                  </label>
                  <input
                    type="text"
                    name="complemento"
                    value={formData.complemento}
                    onChange={handleChange}
                    placeholder="Ex: Bloco A, Torre 2"
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                    `}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Bairro
                  </label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    placeholder="Ex: Centro"
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                    `}
                  />
                </div>
              </div>

              {/* Grid de 2 colunas para Cidade e Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Cidade <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    required
                    placeholder="Ex: São Paulo"
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                    `}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    required
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200 appearance-none
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}
                    `}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: `right 0.75rem center`,
                      backgroundSize: `1.5em 1.5em`,
                      backgroundRepeat: `no-repeat`,
                      paddingRight: `2.5rem`,
                    }}
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
              </div>
            </div>
          </div>

          {/* SEÇÃO 3: DETALHES ESPECÍFICOS (só para Edifício) */}
          {formData.tipo === "edificio" && (
            <div
              className={`rounded-xl border p-6 ${getCardBgClass()} ${getBorderClass()} shadow-sm`}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-2 rounded-lg ${getIconBgClass()}`}>
                  <BuildingOfficeIcon
                    className={`w-6 h-6 ${getIconColorClass()}`}
                  />
                </div>
                <div>
                  <h2 className={`text-lg font-semibold ${getTextClass()}`}>
                    Detalhes do Edifício
                  </h2>
                  <p className={`text-sm ${getTextSecondaryClass()}`}>
                    Informações específicas para edifícios
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Ano de construção
                  </label>
                  <input
                    type="number"
                    name="ano_construcao"
                    value={formData.ano_construcao}
                    onChange={handleChange}
                    placeholder="Ex: 2020"
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                    `}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Número de andares
                  </label>
                  <input
                    type="number"
                    name="numero_andares"
                    value={formData.numero_andares}
                    onChange={handleChange}
                    placeholder="Ex: 20"
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                    `}
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-2 ${getTextSecondaryClass()}`}
                  >
                    Total de unidades
                  </label>
                  <input
                    type="number"
                    name="total_unidades"
                    value={formData.total_unidades}
                    onChange={handleChange}
                    placeholder="Ex: 120"
                    className={`
                      w-full px-4 py-3
                      border-2 rounded-lg
                      focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]
                      transition-all duration-200
                      ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}
                    `}
                  />
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: INFORMAÇÃO PARA CONDOMÍNIO */}
          {formData.tipo === "condominio" && (
            <div
              className={`rounded-xl border p-6 ${getCardBgClass()} ${getBorderClass()} shadow-sm bg-gradient-to-r ${isDark ? "from-gray-800 to-gray-900" : "from-green-50 to-white"}`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-full ${isDark ? "bg-green-900/30" : "bg-green-100"}`}
                >
                  <HomeModernIcon
                    className={`w-6 h-6 ${isDark ? "text-green-300" : "text-green-600"}`}
                  />
                </div>
                <div>
                  <h3 className={`text-base font-semibold ${getTextClass()}`}>
                    Condomínio de Casas
                  </h3>
                  <p className={`text-sm mt-1 ${getTextSecondaryClass()}`}>
                    Os detalhes de lotes, quadras e números serão cadastrados
                    individualmente em cada imóvel vinculado a este condomínio.
                  </p>
                  <div
                    className={`mt-3 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <span className="font-medium">ℹ️</span> Apenas as
                    informações gerais do condomínio são cadastradas aqui.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEÇÃO: INFORMAÇÃO PARA RESIDENCIAL */}
          {formData.tipo === "residencial" && (
            <div
              className={`rounded-xl border p-6 ${getCardBgClass()} ${getBorderClass()} shadow-sm bg-gradient-to-r ${isDark ? "from-gray-800 to-gray-900" : "from-purple-50 to-white"}`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-full ${isDark ? "bg-purple-900/30" : "bg-purple-100"}`}
                >
                  <HomeIcon
                    className={`w-6 h-6 ${isDark ? "text-purple-300" : "text-purple-600"}`}
                  />
                </div>
                <div>
                  <h3 className={`text-base font-semibold ${getTextClass()}`}>
                    Residencial Misto
                  </h3>
                  <p className={`text-sm mt-1 ${getTextSecondaryClass()}`}>
                    Este tipo pode incluir tanto casas quanto apartamentos. As
                    especificações serão definidas por imóvel.
                  </p>
                  <div
                    className={`mt-3 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}
                  >
                    <span className="font-medium">ℹ️</span> Cadastre as unidades
                    individualmente após criar o residencial.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MENSAGEM DE FEEDBACK */}
          {submitMessage.text && (
            <div
              className={`
              p-4 rounded-lg border-2
              ${
                submitMessage.type === "success"
                  ? isDark
                    ? "bg-green-900/20 border-green-800 text-green-300"
                    : "bg-green-50 border-green-300 text-green-800"
                  : isDark
                    ? "bg-red-900/20 border-red-800 text-red-300"
                    : "bg-red-50 border-red-300 text-red-800"
              }
            `}
            >
              <div className="flex items-center">
                {submitMessage.type === "success" ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                ) : (
                  <ExclamationTriangleIcon className="w-5 h-5 mr-2 flex-shrink-0" />
                )}
                <p className="font-medium">{submitMessage.text}</p>
              </div>
              {submitMessage.type === "success" && (
                <p className="mt-1 text-sm opacity-80">
                  Redirecionando para lista de imóveis...
                </p>
              )}
            </div>
          )}

          {/* AÇÕES - BOTÕES */}
          <div
            className={`rounded-xl border p-6 ${getCardBgClass()} ${getBorderClass()} shadow-sm`}
          >
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg border border-transparent transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm hover:shadow-md"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="px-6"
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
                      <BuildingOfficeIcon className="w-5 h-5" />
                      <span>Cadastrar Empreendimento</span>
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

export default CadastrarEmpreendimento;
