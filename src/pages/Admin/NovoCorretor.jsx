import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const NovoCorretor = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [tipoCadastro, setTipoCadastro] = useState("candidato");
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState({});

  const [formData, setFormData] = useState({
    // Campos comuns
    nome: "",
    email: "",
    telefone: "",
    creci: "",
    creci_validade: "",

    // Campos profissionais
    creci_desde: "",
    experiencia_anos: "",
    formacao: "",

    // Específico candidato
    origem: "site",
    observacoes: "",

    // Específico corretor direto
    nivel_experiencia: "pleno",
    especialidades: [],
    comissao_base: "",
    data_ativacao: "", // 🆕 NOVO CAMPO!

    // Perfil de acesso
    perfil: "corretor",
    senha: Math.random().toString(36).slice(-8),
  });

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
      especialidades: prev.especialidades.includes(esp)
        ? prev.especialidades.filter((e) => e !== esp)
        : [...prev.especialidades, esp],
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

    const telefoneLimpo = formData.telefone?.replace(/\D/g, "");
    if (telefoneLimpo && telefoneLimpo.length < 10) {
      novosErros.telefone = "Telefone inválido";
    }

    if (formData.creci && formData.creci.length < 4) {
      novosErros.creci = "CRECI inválido";
    }

    if (tipoCadastro === "candidato") {
      if (!formData.creci_validade) {
        novosErros.creci_validade = "Validade do CRECI é obrigatória";
      }
    } else {
      if (!formData.experiencia_anos) {
        novosErros.experiencia_anos = "Anos de experiência são obrigatórios";
      }
      if (formData.experiencia_anos && formData.experiencia_anos < 0) {
        novosErros.experiencia_anos = "Anos de experiência inválidos";
      }
      // 🆕 VALIDAÇÃO: Data de ativação é obrigatória para corretor direto
      if (!formData.data_ativacao) {
        novosErros.data_ativacao = "Data de ativação é obrigatória";
      }
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴");
    console.log("🚀 HANDLE SUBMIT EXECUTOU!");
    console.log("🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴🔴");

    e.preventDefault();
    console.log("1️⃣ handleSubmit iniciou");

    const valido = validarFormulario();
    console.log("2️⃣ validação:", valido);

    if (!valido) return;

    console.log("3️⃣ passou validação");
    setLoading(true);
    console.log("4️⃣ loading true");

    try {
      console.log("5️⃣ dentro do try, formData:", formData);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
        options: {
          data: {
            nome: formData.nome,
            perfil: formData.perfil,
            telefone: formData.telefone,
            creci: formData.creci,
            tipo_cadastro: tipoCadastro,
            ...(tipoCadastro === "direto" && {
              nivel_experiencia: formData.nivel_experiencia,
              especialidades: formData.especialidades,
              comissao_base: formData.comissao_base,
            }),
          },
        },
      });

      console.log("6️⃣ resposta signUp:", { authData, authError });

      if (authError) throw authError;
      console.log("7️⃣ sem erro, usuário criado:", authData.user?.id);

      // Se for corretor direto, atualiza etapa
      if (tipoCadastro === "direto" && authData.user) {
        console.log("8️⃣ atualizando etapa para corretor direto");

        // 🆕 USA A DATA DO FORMULÁRIO OU HOJE COMO FALLBACK
        const dataAtivacao =
          formData.data_ativacao || new Date().toISOString().split("T")[0];
        console.log("📅 Data de ativação:", dataAtivacao);

        const { error: updateError } = await supabase
          .from("corretores")
          .update({
            etapa: "ativos",
            periodoExperiencia: false, // Já ativo direto
            data_ativacao: dataAtivacao, // 👈 SALVA A DATA INFORMADA
            imoveis: 0,
            leads: 0,
            vendas_mes: 0,
            pontuacao:
              formData.nivel_experiencia === "senior"
                ? 1000
                : formData.nivel_experiencia === "pleno"
                  ? 800
                  : 600,
            meta: 1000,
            rating: 4.8,
            // Campos profissionais
            creci_desde: formData.creci_desde || null,
            experiencia_anos: formData.experiencia_anos || null,
            formacao: formData.formacao || null,
          })
          .eq("id", authData.user.id);

        if (updateError) {
          console.warn(
            "9️⃣ erro ao atualizar etapa (não crítico):",
            updateError,
          );
        } else {
          console.log("🔟 etapa atualizada com sucesso");
        }
      }

      // Se for candidato, salva os dados profissionais também
      if (tipoCadastro === "candidato" && authData.user) {
        const { error: updateError } = await supabase
          .from("corretores")
          .update({
            creci_desde: formData.creci_desde || null,
            experiencia_anos: formData.experiencia_anos || null,
            formacao: formData.formacao || null,
            origem: formData.origem,
            observacoes: formData.observacoes,
          })
          .eq("id", authData.user.id);

        if (updateError) {
          console.warn("Erro ao salvar dados do candidato:", updateError);
        }
      }

      alert(
        tipoCadastro === "direto"
          ? "✅ Corretor cadastrado e ativado com sucesso!"
          : "✅ Candidato cadastrado com sucesso! Aguardando análise.",
      );

      navigate("/admin/corretores");
    } catch (error) {
      console.error("❌ erro capturado:", error);
      alert("Erro ao cadastrar: " + error.message);
    } finally {
      console.log("🔚 finally");
      setLoading(false);
    }
  };

  return (
    <div
      className={
        isDark ? "bg-gray-900 min-h-screen" : "bg-gray-50 min-h-screen"
      }
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header com botão Voltar */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/corretores")}
            className={`
              p-2 rounded-lg transition-all duration-200
              ${
                isDark
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
              }
            `}
            title="Voltar"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h1
              className={`text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              Novo Corretor
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Cadastre um novo corretor ou candidato
            </p>
          </div>
        </div>

        {/* Tipo de Cadastro - SWITCH */}
        <div className="mb-8">
          <label className="block text-sm font-medium mb-3">
            Tipo de Cadastro
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTipoCadastro("candidato")}
              className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${
                  tipoCadastro === "candidato"
                    ? isDark
                      ? "border-amber-500 bg-amber-900/20"
                      : "border-amber-500 bg-amber-50"
                    : isDark
                      ? "border-gray-700 hover:border-gray-600"
                      : "border-gray-200 hover:border-gray-300"
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
            </button>

            <button
              type="button"
              onClick={() => setTipoCadastro("direto")}
              className={`
                p-4 rounded-xl border-2 transition-all text-left
                ${
                  tipoCadastro === "direto"
                    ? isDark
                      ? "border-green-500 bg-green-900/20"
                      : "border-green-500 bg-green-50"
                    : isDark
                      ? "border-gray-700 hover:border-gray-600"
                      : "border-gray-200 hover:border-gray-300"
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
            </button>
          </div>
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
                  {tipoCadastro === "candidato" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="date"
                  name="creci_validade"
                  value={formData.creci_validade}
                  onChange={handleChange}
                  className={`
                    w-full px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }
                    ${erros.creci_validade ? "border-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
                {erros.creci_validade && (
                  <p className="mt-1 text-xs text-red-500">
                    {erros.creci_validade}
                  </p>
                )}
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
                  value={formData.creci_desde}
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
                  {tipoCadastro === "direto" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  type="number"
                  name="experiencia_anos"
                  value={formData.experiencia_anos}
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
                    ${erros.experiencia_anos ? "border-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-amber-500/30
                  `}
                />
                {erros.experiencia_anos && (
                  <p className="mt-1 text-xs text-red-500">
                    {erros.experiencia_anos}
                  </p>
                )}
              </div>

              <div className="lg:col-span-1">
                <label className="block text-sm font-medium mb-1">
                  Formação
                </label>
                <select
                  name="formacao"
                  value={formData.formacao}
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

          {/* Seção 3: Específica para Candidato */}
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
                Processo Seletivo
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Origem
                  </label>
                  <select
                    name="origem"
                    value={formData.origem}
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
                    value={formData.observacoes}
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

          {/* Seção 4: Específica para Corretor Direto */}
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
                    Nível <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="nivel_experiencia"
                    value={formData.nivel_experiencia}
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
                    Comissão base (%)
                  </label>
                  <input
                    type="number"
                    name="comissao_base"
                    value={formData.comissao_base}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    max="100"
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
                    Data de Ativação <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="data_ativacao"
                    value={formData.data_ativacao}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      ${erros.data_ativacao ? "border-red-500" : ""}
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                  {erros.data_ativacao && (
                    <p className="mt-1 text-xs text-red-500">
                      {erros.data_ativacao}
                    </p>
                  )}
                  <p className="text-xs mt-1 opacity-60">
                    Data que o corretor começou na imobiliária
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
                              formData.especialidades.includes(esp)
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

          {/* Seção 5: Acesso */}
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
                Senha inicial
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className={`
                    flex-1 px-3 py-2 rounded-lg border
                    ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
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
                  className={`
                    px-3 py-2 rounded-lg text-sm
                    ${
                      isDark
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }
                  `}
                >
                  Gerar
                </button>
              </div>
              <p className="text-xs mt-1 opacity-60">
                O usuário poderá alterar a senha depois do primeiro acesso
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
            <Button type="submit" disabled={loading}>
              {loading
                ? "Cadastrando..."
                : tipoCadastro === "direto"
                  ? "Cadastrar Corretor"
                  : "Iniciar Processo Seletivo"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovoCorretor;
