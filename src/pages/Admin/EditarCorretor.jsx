import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import Button from "../../componentes/ui/Button";

// Ícones
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  RocketLaunchIcon,
  CalendarIcon,
  DocumentTextIcon,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";

const EditarCorretor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erros, setErros] = useState({});
  const [tipoCadastro, setTipoCadastro] = useState("candidato");

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    creci: "",
    creci_validade: "",
    creci_desde: "",
    experiencia_anos: "",
    formacao: "",
    origem: "site",
    observacoes: "",
    nivel_experiencia: "pleno",
    especialidades: [],
    imoveis: 0,
    leads: 0,
    vendas_mes: 0,
    pontuacao: 0,
    meta: 1000,
    rating: 4.8,
    comissao_base: "",
    perfil: "corretor",
    senha: "",
    periodoExperiencia: false,
    treinamento_conclusao: "",
    data_ativacao: "", // 🆕 CAMPO ADICIONADO
    data_experiencia_fim: "",
  });

  // Carrega dados do corretor
  useEffect(() => {
    const carregarCorretor = async () => {
      try {
        const { data, error } = await supabase
          .from("corretores")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (data) {
          setFormData(data);
          // Define o tipo baseado nos dados
          if (data.periodoExperiencia) {
            setTipoCadastro("candidato");
          } else if (data.treinamento_conclusao && !data.periodoExperiencia) {
            setTipoCadastro("candidato");
          } else {
            setTipoCadastro("direto");
          }
        }
      } catch (error) {
        console.error("Erro ao carregar corretor:", error);
        alert("Erro ao carregar dados do corretor");
        navigate("/admin/corretores");
      } finally {
        setLoading(false);
      }
    };

    carregarCorretor();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (erros[name]) setErros((prev) => ({ ...prev, [name]: null }));
  };

  const handleEspecialidadeToggle = (esp) => {
    setFormData((prev) => ({
      ...prev,
      especialidades: prev.especialidades?.includes(esp)
        ? prev.especialidades.filter((e) => e !== esp)
        : [...(prev.especialidades || []), esp],
    }));
  };

  const validarFormulario = () => {
    const novosErros = {};

    if (!formData.nome) novosErros.nome = "Nome é obrigatório";
    if (!formData.email) novosErros.email = "Email é obrigatório";
    if (!formData.telefone) novosErros.telefone = "Telefone é obrigatório";
    if (!formData.creci) novosErros.creci = "CRECI é obrigatório";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      novosErros.email = "Email inválido";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    setSaving(true);
    try {
      // Prepara os dados para atualização
      const dadosAtualizacao = {
        ...formData,
        updated_at: new Date().toISOString(),
        telefone: formData.telefone.replace(/\D/g, ""),
      };

      // Remove campos que não devem ser atualizados
      delete dadosAtualizacao.senha; // Não atualiza senha aqui

      const { error } = await supabase
        .from("corretores")
        .update(dadosAtualizacao)
        .eq("id", id);

      if (error) throw error;

      // Se uma nova senha foi fornecida, atualiza no Auth
      if (formData.senha) {
        const { error: authError } = await supabase.auth.admin.updateUserById(
          id,
          { password: formData.senha },
        );
        if (authError) console.warn("Erro ao atualizar senha:", authError);
      }

      alert("✅ Corretor atualizado com sucesso!");
      navigate("/admin/corretores");
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      alert("Erro ao atualizar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A24D]"></div>
          <p className="mt-4 text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header com botão Voltar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Editar Corretor
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {formData.nome} • {formData.creci}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/corretores")}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
              isDark
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
            }`}
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Voltar
          </button>
        </div>

        {/* Tipo de Cadastro (só leitura) */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">
            Tipo de Cadastro
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`
                p-4 rounded-xl border-2 text-left opacity-75
                ${
                  tipoCadastro === "candidato"
                    ? isDark
                      ? "border-amber-500 bg-amber-900/20"
                      : "border-amber-500 bg-amber-50"
                    : isDark
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-gray-100"
                }
              `}
            >
              <AcademicCapIcon
                className={`w-8 h-8 mb-2 ${
                  tipoCadastro === "candidato"
                    ? isDark
                      ? "text-amber-400"
                      : "text-amber-600"
                    : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              />
              <div className="font-semibold">Candidato</div>
              <div className="text-xs mt-1 opacity-70">
                Passará por entrevista e treinamento
              </div>
            </div>

            <div
              className={`
                p-4 rounded-xl border-2 text-left opacity-75
                ${
                  tipoCadastro === "direto"
                    ? isDark
                      ? "border-green-500 bg-green-900/20"
                      : "border-green-500 bg-green-50"
                    : isDark
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-gray-100"
                }
              `}
            >
              <RocketLaunchIcon
                className={`w-8 h-8 mb-2 ${
                  tipoCadastro === "direto"
                    ? isDark
                      ? "text-green-400"
                      : "text-green-600"
                    : isDark
                      ? "text-gray-500"
                      : "text-gray-400"
                }`}
              />
              <div className="font-semibold">Corretor Direto</div>
              <div className="text-xs mt-1 opacity-70">
                Já experiente, ativação imediata
              </div>
            </div>
          </div>
          <p className="text-xs mt-2 opacity-60">
            * O tipo de cadastro não pode ser alterado
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção 1: Dados Básicos */}
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <UserIcon className="w-5 h-5" />
              Dados Básicos
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nome completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    ${erros.nome ? "border-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
                {erros.nome && (
                  <p className="mt-1 text-xs text-red-500">{erros.nome}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    ${erros.email ? "border-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
                {erros.email && (
                  <p className="mt-1 text-xs text-red-500">{erros.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Telefone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  placeholder="(11) 99999-9999"
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    ${erros.telefone ? "border-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
                {erros.telefone && (
                  <p className="mt-1 text-xs text-red-500">{erros.telefone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  CRECI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="creci"
                  value={formData.creci}
                  onChange={handleChange}
                  placeholder="Ex: 123456"
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    ${erros.creci ? "border-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
                {erros.creci && (
                  <p className="mt-1 text-xs text-red-500">{erros.creci}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Validade do CRECI
                </label>
                <input
                  type="date"
                  name="creci_validade"
                  value={formData.creci_validade || ""}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Perfil de acesso
                </label>
                <select
                  name="perfil"
                  value={formData.perfil}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                >
                  <option value="corretor">Corretor</option>
                  <option value="gerente">Gerente</option>
                  <option value="master">Master</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção 2: Perfil Profissional */}
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <BriefcaseIcon className="w-5 h-5" />
              Perfil Profissional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  CRECI desde
                </label>
                <input
                  type="date"
                  name="creci_desde"
                  value={formData.creci_desde || ""}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Anos de experiência
                </label>
                <input
                  type="number"
                  name="experiencia_anos"
                  value={formData.experiencia_anos || ""}
                  onChange={handleChange}
                  min="0"
                  max="50"
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium mb-1">
                  Formação
                </label>
                <select
                  name="formacao"
                  value={formData.formacao || ""}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                >
                  <option value="">Selecione</option>
                  <option value="ensino_medio">Ensino Médio</option>
                  <option value="superior_incompleto">
                    Superior Incompleto
                  </option>
                  <option value="superior_completo">Superior Completo</option>
                  <option value="pos_graduacao">Pós-graduação</option>
                  <option value="mestrado">Mestrado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Seção específica para cada tipo */}
          {tipoCadastro === "candidato" && (
            <div
              className={`p-6 rounded-xl border ${
                isDark
                  ? "border-amber-800 bg-amber-900/10"
                  : "border-amber-200 bg-amber-50/50"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDark ? "text-amber-400" : "text-amber-700"
                }`}
              >
                <AcademicCapIcon className="w-5 h-5" />
                Informações do Processo Seletivo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Origem
                  </label>
                  <select
                    name="origem"
                    value={formData.origem || "site"}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  >
                    <option value="site">Site da imobiliária</option>
                    <option value="indicacao">Indicação</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Observações
                  </label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes || ""}
                    onChange={handleChange}
                    rows="3"
                    className={`
                      w-full px-3 py-2 rounded-lg border resize-none
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                    placeholder="Informações relevantes sobre o candidato..."
                  />
                </div>
              </div>
            </div>
          )}

          {tipoCadastro === "direto" && (
            <div
              className={`p-6 rounded-xl border ${
                isDark
                  ? "border-green-800 bg-green-900/10"
                  : "border-green-200 bg-green-50/50"
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                  isDark ? "text-green-400" : "text-green-700"
                }`}
              >
                <RocketLaunchIcon className="w-5 h-5" />
                Configuração Profissional
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nível
                  </label>
                  <select
                    name="nivel_experiencia"
                    value={formData.nivel_experiencia || "pleno"}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  >
                    <option value="junior">Júnior (1-3 anos)</option>
                    <option value="pleno">Pleno (3-7 anos)</option>
                    <option value="senior">Sênior (7+ anos)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Imóveis
                  </label>
                  <input
                    type="number"
                    name="imoveis"
                    value={formData.imoveis || 0}
                    onChange={handleChange}
                    min="0"
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Leads
                  </label>
                  <input
                    type="number"
                    name="leads"
                    value={formData.leads || 0}
                    onChange={handleChange}
                    min="0"
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                </div>

                {/* 🆕 NOVO CAMPO: Data de Ativação */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data de Ativação
                  </label>
                  <input
                    type="date"
                    name="data_ativacao"
                    value={formData.data_ativacao || ""}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                  <p className="text-xs mt-1 opacity-60">
                    Data que o corretor entrou na imobiliária
                  </p>
                </div>

                <div className="lg:col-span-3">
                  <label className="block text-sm font-medium mb-2">
                    Especialidades
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Residencial",
                      "Comercial",
                      "Alto Padrão",
                      "Lançamentos",
                      "Rural",
                    ].map((esp) => (
                      <button
                        key={esp}
                        type="button"
                        onClick={() => handleEspecialidadeToggle(esp)}
                        className={`
                            px-3 py-1.5 rounded-full text-xs font-medium transition-colors
                            ${
                              formData.especialidades?.includes(esp)
                                ? isDark
                                  ? "bg-green-900/30 text-green-300 border border-green-800"
                                  : "bg-green-100 text-green-800 border border-green-300"
                                : isDark
                                  ? "bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700"
                                  : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                            }
                          `}
                      >
                        {esp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seção 3: Acesso */}
          <div
            className={`p-6 rounded-xl border ${
              isDark
                ? "border-gray-700 bg-gray-800"
                : "border-gray-200 bg-white"
            }`}
          >
            <h3
              className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              <DocumentTextIcon className="w-5 h-5" />
              Dados de Acesso
            </h3>

            <div className="max-w-md">
              <label className="block text-sm font-medium mb-1">
                Nova senha
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="senha"
                  value={formData.senha || ""}
                  onChange={handleChange}
                  placeholder="Deixe em branco para manter"
                  className={`
                    flex-1 px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      senha: Math.random().toString(36).slice(-8),
                    }))
                  }
                  className={`px-3 py-2 rounded-lg text-sm ${
                    isDark
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Gerar
                </button>
              </div>
              <p className="text-xs mt-1 opacity-60">
                Só preencha se quiser alterar a senha atual
              </p>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/corretores")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarCorretor;
