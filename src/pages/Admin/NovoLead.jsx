// src/pages/Admin/NovoLead.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  GlobeAltIcon,
  FlagIcon,
  CalendarIcon,
  ClockIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

const NovoLead = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [buscandoImovel, setBuscandoImovel] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });
  const [imovelEncontrado, setImovelEncontrado] = useState(null);

  // Estado do formulário
  const [formData, setFormData] = useState({
    nome: "",
    telefone: "",
    email: "",
    imovel_codigo: "",
    imovel_slug: "",
    origem: "site",
    prioridade: "alta",
    status: "novo",
    melhor_dia: "",
    melhor_horario: "",
    observacoes: "",
  });

  // =============== BUSCAR IMÓVEL PELO CÓDIGO ===============
  const buscarImovelPorCodigo = async (codigo) => {
    if (!codigo || codigo.length < 5) {
      setImovelEncontrado(null);
      return;
    }

    setBuscandoImovel(true);
    try {
      const { data, error } = await supabase
        .from("imoveis")
        .select("id, codigo, slug, titulo")
        .eq("codigo", codigo)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setImovelEncontrado(data);
        setFormData((prev) => ({
          ...prev,
          imovel_slug: data.slug,
        }));
      } else {
        setImovelEncontrado(null);
        setFormData((prev) => ({
          ...prev,
          imovel_slug: "",
        }));
      }
    } catch (error) {
      console.error("Erro ao buscar imóvel:", error);
      setImovelEncontrado(null);
    } finally {
      setBuscandoImovel(false);
    }
  };

  // Opções para selects
  const origemOpcoes = [
    { value: "site", label: "Site" },
    { value: "whatsapp", label: "WhatsApp" },
    { value: "telefone", label: "Telefone" },
    { value: "indicacao", label: "Indicação" },
    { value: "outro", label: "Outro" },
  ];

  const prioridadeOpcoes = [
    { value: "alta", label: "Alta", color: "red" },
    { value: "media", label: "Média", color: "yellow" },
    { value: "baixa", label: "Baixa", color: "green" },
  ];

  const diasSemanaOpcoes = [
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
  ];

  const horarioOpcoes = [
    { value: "manha", label: "Manhã (8h às 12h)" },
    { value: "tarde", label: "Tarde (14h às 18h)" },
  ];

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Se for o campo de código do imóvel, busca o slug
    if (name === "imovel_codigo") {
      buscarImovelPorCodigo(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage({ type: "", text: "" });

    // Validação básica
    if (!formData.nome || !formData.telefone) {
      setSubmitMessage({
        type: "error",
        text: "Nome e telefone são obrigatórios",
      });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("leads")
        .insert([formData])
        .select();

      if (error) throw error;

      setSubmitMessage({
        type: "success",
        text: "Lead cadastrado com sucesso!",
      });

      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate("/admin/leads");
      }, 2000);
    } catch (error) {
      console.error("Erro ao cadastrar lead:", error);
      setSubmitMessage({
        type: "error",
        text: error.message || "Erro ao cadastrar lead. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Deseja cancelar? As informações não serão salvas.")) {
      navigate("/admin/leads");
    }
  };

  // Funções de cor (tema)
  const getBgClass = () => (isDark ? "bg-gray-900" : "bg-white");
  const getBorderClass = () => (isDark ? "border-gray-700" : "border-gray-200");
  const getTextClass = () => (isDark ? "text-gray-100" : "text-gray-900");
  const getTextSecondaryClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  const getInputBgClass = () => (isDark ? "bg-gray-800" : "bg-white");
  const getInputBorderClass = () =>
    isDark ? "border-gray-700" : "border-gray-300";
  const getInputTextClass = () => (isDark ? "text-gray-200" : "text-gray-900");
  const getPlaceholderClass = () =>
    isDark ? "placeholder-gray-500" : "placeholder-gray-400";
  const getIconBgClass = () => (isDark ? "bg-[#D4A24D]/20" : "bg-[#D4A24D]/10");
  const getIconColorClass = () =>
    isDark ? "text-[#D4A24D]" : "text-[#D4A24D]";
  const getLabelClass = () => (isDark ? "text-gray-300" : "text-gray-700");

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDark ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b px-4 py-4 transition-colors duration-200 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/leads")}
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
                Novo Lead
              </h1>
              <p
                className={`text-sm transition-colors ${getTextSecondaryClass()}`}
              >
                Cadastre um novo lead manualmente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mensagem de feedback */}
          {submitMessage.text && (
            <div
              className={`p-4 rounded-lg border ${
                submitMessage.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center">
                {submitMessage.type === "success" ? (
                  <CheckCircleIcon className="w-5 h-5 mr-2 text-green-600" />
                ) : (
                  <svg
                    className="w-5 h-5 mr-2 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <p className="font-medium">{submitMessage.text}</p>
              </div>
            </div>
          )}

          {/* Card do formulário */}
          <div
            className={`rounded-xl border p-8 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex items-center space-x-3 mb-8">
              <div className={`p-3 rounded-lg ${getIconBgClass()}`}>
                <UserIcon className={`w-6 h-6 ${getIconColorClass()}`} />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold transition-colors ${getTextClass()}`}
                >
                  Informações do Lead
                </h2>
                <p
                  className={`text-sm transition-colors ${getTextSecondaryClass()}`}
                >
                  Dados básicos para contato
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Nome */}
              <div className="lg:col-span-2">
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  Nome completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    placeholder="Digite o nome do lead"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  WhatsApp/Telefone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    placeholder="(99) 99999-9999"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@exemplo.com"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                </div>
              </div>

              {/* Código do Imóvel - COM BUSCA AUTOMÁTICA */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  Código do Imóvel
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HomeIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <input
                    type="text"
                    name="imovel_codigo"
                    value={formData.imovel_codigo}
                    onChange={handleChange}
                    placeholder="Ex: APT-001"
                    className={`w-full pl-10 pr-10 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                  {buscandoImovel && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-[#D4A24D]"></div>
                    </div>
                  )}
                </div>
                {imovelEncontrado && (
                  <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center">
                    <CheckCircleIcon className="w-3 h-3 mr-1" />
                    Imóvel encontrado: {imovelEncontrado.titulo}
                  </p>
                )}
                {formData.imovel_codigo &&
                  !buscandoImovel &&
                  !imovelEncontrado &&
                  formData.imovel_codigo.length >= 5 && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      Imóvel não encontrado
                    </p>
                  )}
              </div>

              {/* Origem */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  Origem
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <GlobeAltIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <select
                    name="origem"
                    value={formData.origem}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors appearance-none text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                  >
                    {origemOpcoes.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Prioridade */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  Prioridade
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FlagIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <select
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors appearance-none text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                  >
                    {prioridadeOpcoes.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Divisor - Preferências de Contato */}
              <div className="lg:col-span-3">
                <div className="border-t border-gray-300 dark:border-gray-700 my-4"></div>
                <h3
                  className={`text-lg font-semibold mt-6 mb-4 ${getTextClass()}`}
                >
                  📅 Preferências de Contato
                </h3>
              </div>

              {/* Melhor dia */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  Melhor dia
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <select
                    name="melhor_dia"
                    value={formData.melhor_dia}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors appearance-none text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                  >
                    <option value="">Selecione um dia</option>
                    {diasSemanaOpcoes.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Melhor horário */}
              <div>
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  Melhor horário
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ClockIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <select
                    name="melhor_horario"
                    value={formData.melhor_horario}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors appearance-none text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()}`}
                  >
                    <option value="">Selecione um horário</option>
                    {horarioOpcoes.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Espaço reservado */}
              <div></div>

              {/* Observações */}
              <div className="lg:col-span-3">
                <label
                  className={`block text-sm font-medium mb-2 transition-colors ${getLabelClass()}`}
                >
                  Observações
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <ChatBubbleLeftIcon
                      className={`w-5 h-5 ${getTextSecondaryClass()}`}
                    />
                  </div>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Informações adicionais sobre o lead..."
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] transition-colors text-base ${getInputBgClass()} ${getInputBorderClass()} ${getInputTextClass()} ${getPlaceholderClass()}`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div
            className={`rounded-xl border p-8 transition-colors duration-200 ${getBgClass()} ${getBorderClass()}`}
          >
            <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg border border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-base"
              >
                Cancelar
              </button>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="px-10 py-4 text-base"
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
                      <span>Salvar Lead</span>
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

export default NovoLead;
