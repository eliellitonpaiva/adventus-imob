// src/pages/admin/Configuracoes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";
import Button from "../../componentes/ui/Button";

// Ícones (se você usa Heroicons)
import {
  Cog6ToothIcon,
  GlobeAltIcon,
  PhotoIcon,
  PaintBrushIcon,
  DocumentTextIcon,
  ShareIcon,
  ChevronLeftIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const Configuracoes = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erros, setErros] = useState({});
  const [activeTab, setActiveTab] = useState("geral");

  // Estado único para todas as configurações
  const [configuracoes, setConfiguracoes] = useState({
    // Gerais
    site_nome: "",
    site_descricao: "",

    // Contato
    whatsapp: "",
    instagram: "",
    facebook: "",
    email_contato: "",

    // Hero
    hero_titulo: "Encontre o imóvel dos seus sonhos",
    hero_subtitulo: "As melhores oportunidades você encontra aqui",

    // Aparência
    cor_primaria: "#2563eb",
    cor_secundaria: "#10b981",

    // SEO
    meta_titulo: "",
    meta_descricao: "",
    meta_keywords: "",

    // Integrações
    google_analytics: "",
    facebook_pixel: "",
  });

  // ========== ESTADOS PARA IMAGENS DO HERO ==========
  const [heroImages, setHeroImages] = useState([]);
  const [showHeroImageModal, setShowHeroImageModal] = useState(false);
  const [editingHeroImage, setEditingHeroImage] = useState(null);
  // ========== ADICIONADO CAMPO ordem NO ESTADO ==========
  const [heroImageForm, setHeroImageForm] = useState({
    titulo: "",
    data_inicio: "",
    data_fim: "",
    imagem: null,
    ordem: 0, // 👈 CAMPO ADICIONADO
  });
  const [heroImagePreview, setHeroImagePreview] = useState("");

  // Buscar configurações ao carregar
  useEffect(() => {
    carregarConfiguracoes();
    carregarHeroImages(); // ========== CARREGA AS IMAGENS DO HERO ==========
  }, []);

  // ========== FUNÇÃO PARA CARREGAR IMAGENS DO HERO ==========
  const carregarHeroImages = async () => {
    try {
      const { data, error } = await supabase
        .from("hero_images")
        .select("*")
        .order("data_inicio", { ascending: true });

      if (error) throw error;

      // Adicionar URL pública para cada imagem
      const imagesWithUrl = (data || []).map((img) => ({
        ...img,
        url: supabase.storage.from("hero").getPublicUrl(img.image_path).data
          .publicUrl,
      }));

      setHeroImages(imagesWithUrl);
    } catch (error) {
      console.error("Erro ao carregar imagens do hero:", error);
    }
  };

  // ========== FUNÇÃO PARA UPLOAD DE IMAGEM DO HERO ==========
  const uploadHeroImage = async (file) => {
    const fileName = `hero-${Date.now()}.${file.name.split(".").pop()}`;
    const filePath = `hero/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("hero")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    return filePath;
  };

  // ========== FUNÇÃO PARA SALVAR IMAGEM DO HERO ==========
  const salvarHeroImage = async (e) => {
    e.preventDefault();

    try {
      let imagePath = editingHeroImage?.image_path;

      // Se tiver nova imagem, faz upload
      if (heroImageForm.imagem) {
        imagePath = await uploadHeroImage(heroImageForm.imagem);
      }

      // ========== ADICIONADO CAMPO ordem NO imageData ==========
      const imageData = {
        titulo: heroImageForm.titulo || null,
        image_path: imagePath,
        data_inicio: heroImageForm.data_inicio,
        data_fim: heroImageForm.data_fim,
        ordem: heroImageForm.ordem, // 👈 CAMPO ADICIONADO
      };

      if (editingHeroImage) {
        // Atualizar imagem existente
        const { error } = await supabase
          .from("hero_images")
          .update(imageData)
          .eq("id", editingHeroImage.id);

        if (error) throw error;
      } else {
        // Criar nova imagem
        const { error } = await supabase
          .from("hero_images")
          .insert([imageData]);

        if (error) throw error;
      }

      // Recarregar lista
      await carregarHeroImages();

      // Fechar modal e limpar formulário
      setShowHeroImageModal(false);
      setEditingHeroImage(null);
      setHeroImageForm({
        titulo: "",
        data_inicio: "",
        data_fim: "",
        imagem: null,
        ordem: 0, // 👈 RESETA O CAMPO
      });
      setHeroImagePreview("");
    } catch (error) {
      console.error("Erro ao salvar imagem:", error);
      alert("Erro ao salvar imagem: " + error.message);
    }
  };

  // ========== FUNÇÃO PARA EXCLUIR IMAGEM DO HERO ==========
  const excluirHeroImage = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir esta imagem?")) return;

    try {
      const { error } = await supabase
        .from("hero_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      await carregarHeroImages();
    } catch (error) {
      console.error("Erro ao excluir imagem:", error);
      alert("Erro ao excluir imagem: " + error.message);
    }
  };

  // ========== FUNÇÃO PARA EDITAR IMAGEM DO HERO ==========
  const editarHeroImage = (imagem) => {
    setEditingHeroImage(imagem);
    setHeroImageForm({
      titulo: imagem.titulo || "",
      data_inicio: imagem.data_inicio,
      data_fim: imagem.data_fim,
      imagem: null,
      ordem: imagem.ordem || 0, // 👈 CARREGA A ORDEM EXISTENTE
    });
    setHeroImagePreview(imagem.url);
    setShowHeroImageModal(true);
  };

  // ========== FUNÇÃO PARA VERIFICAR SE IMAGEM ESTÁ ATIVA ==========
  const isImageActive = (dataInicio, dataFim) => {
    const hoje = new Date().toISOString().split("T")[0];
    return hoje >= dataInicio && hoje <= dataFim;
  };

  // ========== FUNÇÃO PARA FORMATAR DATA ==========
  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase.from("settings").select("*");

      if (error) throw error;

      if (data) {
        // Converter array para objeto
        const configObj = {};
        data.forEach((item) => {
          configObj[item.key] = item.value;
        });

        setConfiguracoes((prev) => ({
          ...prev,
          ...configObj,
        }));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfiguracoes((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpar erro do campo quando começar a digitar
    if (erros[name]) {
      setErros((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validarFormulario = () => {
    const novosErros = {};

    // Validações básicas
    if (!configuracoes.site_nome) {
      novosErros.site_nome = "Nome do site é obrigatório";
    }

    if (configuracoes.whatsapp) {
      const telefoneLimpo = configuracoes.whatsapp.replace(/\D/g, "");
      if (telefoneLimpo.length < 10) {
        novosErros.whatsapp = "WhatsApp inválido";
      }
    }

    if (
      configuracoes.email_contato &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(configuracoes.email_contato)
    ) {
      novosErros.email_contato = "E-mail inválido";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) return;

    setSaving(true);

    try {
      // Preparar array de configurações para salvar
      const configuracoesArray = Object.entries(configuracoes).map(
        ([key, value]) => ({
          key,
          value: String(value),
          updated_at: new Date().toISOString(),
        }),
      );

      // Salvar no Supabase
      const { error } = await supabase
        .from("settings")
        .upsert(configuracoesArray, { onConflict: "key" });

      if (error) throw error;

      alert("✅ Configurações salvas com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("Erro ao salvar configurações: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: "geral", nome: "Geral", icone: Cog6ToothIcon },
    { id: "contato", nome: "Contato", icone: GlobeAltIcon },
    { id: "hero", nome: "Hero", icone: PhotoIcon },
    { id: "aparencia", nome: "Aparência", icone: PaintBrushIcon },
    { id: "seo", nome: "SEO", icone: DocumentTextIcon },
    { id: "integracoes", nome: "Integrações", icone: ShareIcon },
  ];

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className={`mt-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Carregando configurações...
          </p>
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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin")}
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
              Configurações
            </h1>
            <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              Gerencie as configurações do site e sistema
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 font-medium text-sm
                  border-b-2 transition-colors
                  ${
                    activeTab === tab.id
                      ? isDark
                        ? "border-amber-500 text-amber-400"
                        : "border-amber-500 text-amber-600"
                      : isDark
                        ? "border-transparent text-gray-400 hover:text-gray-300"
                        : "border-transparent text-gray-600 hover:text-gray-800"
                  }
                `}
              >
                <tab.icone className="w-5 h-5" />
                {tab.nome}
              </button>
            ))}
          </div>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ========== ABA GERAL ========== */}
          {activeTab === "geral" && (
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
                <Cog6ToothIcon className="w-5 h-5" />
                Informações Gerais
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nome do Site <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="site_nome"
                    value={configuracoes.site_nome}
                    onChange={handleChange}
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      ${erros.site_nome ? "border-red-500" : ""}
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                  {erros.site_nome && (
                    <p className="mt-1 text-xs text-red-500">
                      {erros.site_nome}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Descrição do Site
                  </label>
                  <textarea
                    name="site_descricao"
                    value={configuracoes.site_descricao}
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
                  />
                </div>
              </div>
            </div>
          )}

          {/* ========== ABA CONTATO ========== */}
          {activeTab === "contato" && (
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
                <GlobeAltIcon className="w-5 h-5" />
                Redes Sociais e Contato
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    WhatsApp
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={configuracoes.whatsapp}
                    onChange={handleChange}
                    placeholder="+5511999999999"
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      ${erros.whatsapp ? "border-red-500" : ""}
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                  {erros.whatsapp && (
                    <p className="mt-1 text-xs text-red-500">
                      {erros.whatsapp}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Instagram
                  </label>
                  <input
                    type="url"
                    name="instagram"
                    value={configuracoes.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/seuperfil"
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
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={configuracoes.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/seuperfil"
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
                    E-mail de Contato
                  </label>
                  <input
                    type="email"
                    name="email_contato"
                    value={configuracoes.email_contato}
                    onChange={handleChange}
                    placeholder="contato@imobiliaria.com"
                    className={`
                      w-full px-3 py-2 rounded-lg border
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      ${erros.email_contato ? "border-red-500" : ""}
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                  {erros.email_contato && (
                    <p className="mt-1 text-xs text-red-500">
                      {erros.email_contato}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========== ABA HERO (IMAGENS ROTATIVAS) ========== */}
          {activeTab === "hero" && (
            <div className="space-y-6">
              {/* CONFIGURAÇÕES GERAIS DO HERO */}
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
                  <PhotoIcon className="w-5 h-5" />
                  Configurações Gerais do Hero
                </h3>

                <div className="space-y-4">
                  {/* TÍTULO GERAL DO HERO */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Título Geral do Hero
                    </label>
                    <input
                      type="text"
                      name="hero_titulo"
                      value={configuracoes.hero_titulo}
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
                    <p className="text-xs text-gray-500 mt-1">
                      Este título será usado se a imagem não tiver título
                      próprio
                    </p>
                  </div>

                  {/* SUBTÍTULO DO HERO */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Subtítulo do Hero
                    </label>
                    <input
                      type="text"
                      name="hero_subtitulo"
                      value={configuracoes.hero_subtitulo}
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
                </div>
              </div>

              {/* GERENCIAMENTO DE IMAGENS ROTATIVAS */}
              <div
                className={`p-6 rounded-xl border ${
                  isDark
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3
                    className={`text-lg font-semibold flex items-center gap-2 ${
                      isDark ? "text-gray-200" : "text-gray-800"
                    }`}
                  >
                    <CalendarIcon className="w-5 h-5" />
                    Imagens Rotativas (Agendamento)
                  </h3>

                  {/* BOTÃO PARA ADICIONAR NOVA IMAGEM */}
                  <button
                    type="button"
                    onClick={() => {
                      setEditingHeroImage(null);
                      setHeroImageForm({
                        titulo: "",
                        data_inicio: "",
                        data_fim: "",
                        imagem: null,
                        ordem: 0, // 👈 RESETA O CAMPO
                      });
                      setHeroImagePreview("");
                      setShowHeroImageModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    <PlusIcon className="w-5 h-5" />
                    Nova Imagem
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-4">
                  Cadastre imagens com datas de início e fim. O sistema mostrará
                  automaticamente a imagem ativa baseada na data atual.
                </p>

                {/* LISTA DE IMAGENS CADASTRADAS */}
                {heroImages.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed rounded-lg">
                    <PhotoIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500">Nenhuma imagem cadastrada</p>
                    <p className="text-sm text-gray-400">
                      Clique em "Nova Imagem" para adicionar
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {heroImages.map((imagem) => {
                      const ativa = isImageActive(
                        imagem.data_inicio,
                        imagem.data_fim,
                      );

                      return (
                        <div
                          key={imagem.id}
                          className={`border rounded-lg overflow-hidden ${
                            ativa ? "ring-2 ring-green-500" : ""
                          }`}
                        >
                          {/* IMAGEM */}
                          <img
                            src={imagem.url}
                            alt={imagem.titulo || "Hero"}
                            className="w-full h-40 object-cover"
                          />

                          {/* INFORMAÇÕES */}
                          <div className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">
                                  {imagem.titulo || "Sem título"}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {formatarData(imagem.data_inicio)} até{" "}
                                  {formatarData(imagem.data_fim)}
                                </p>
                                {/* ========== EXIBE A ORDEM (OPCIONAL) ========== */}
                                <p className="text-xs text-gray-400 mt-1">
                                  Ordem: {imagem.ordem || 0}
                                </p>
                              </div>

                              {/* STATUS */}
                              {ativa && (
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                  Ativa
                                </span>
                              )}
                            </div>

                            {/* BOTÕES DE AÇÃO */}
                            <div className="flex justify-end gap-2 mt-3">
                              <button
                                type="button"
                                onClick={() => editarHeroImage(imagem)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <PencilIcon className="w-5 h-5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => excluirHeroImage(imagem.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========== ABA APARÊNCIA ========== */}
          {activeTab === "aparencia" && (
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
                <PaintBrushIcon className="w-5 h-5" />
                Cores do Tema
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cor Primária
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      name="cor_primaria"
                      value={configuracoes.cor_primaria}
                      onChange={handleChange}
                      className="h-10 w-20"
                    />
                    <input
                      type="text"
                      name="cor_primaria"
                      value={configuracoes.cor_primaria}
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
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cor Secundária
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="color"
                      name="cor_secundaria"
                      value={configuracoes.cor_secundaria}
                      onChange={handleChange}
                      className="h-10 w-20"
                    />
                    <input
                      type="text"
                      name="cor_secundaria"
                      value={configuracoes.cor_secundaria}
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
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========== ABA SEO ========== */}
          {activeTab === "seo" && (
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
                SEO (Otimização para Buscadores)
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Título
                  </label>
                  <input
                    type="text"
                    name="meta_titulo"
                    value={configuracoes.meta_titulo}
                    onChange={handleChange}
                    maxLength="60"
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
                    {configuracoes.meta_titulo?.length || 0}/60 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Meta Descrição
                  </label>
                  <textarea
                    name="meta_descricao"
                    value={configuracoes.meta_descricao}
                    onChange={handleChange}
                    rows="3"
                    maxLength="160"
                    className={`
                      w-full px-3 py-2 rounded-lg border resize-none
                      ${
                        isDark
                          ? "bg-gray-700 border-gray-600 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }
                      focus:outline-none focus:ring-2 focus:ring-amber-500/30
                    `}
                  />
                  <p className="text-xs mt-1 opacity-60">
                    {configuracoes.meta_descricao?.length || 0}/160 caracteres
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Palavras-chave
                  </label>
                  <input
                    type="text"
                    name="meta_keywords"
                    value={configuracoes.meta_keywords}
                    onChange={handleChange}
                    placeholder="imóveis, apartamentos, casas, aluguel, venda"
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
                  <p className="text-xs mt-1 opacity-60">Separe por vírgula</p>
                </div>
              </div>
            </div>
          )}

          {/* ========== ABA INTEGRAÇÕES ========== */}
          {activeTab === "integracoes" && (
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
                <ShareIcon className="w-5 h-5" />
                Integrações e Rastreamento
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Google Analytics ID
                  </label>
                  <input
                    type="text"
                    name="google_analytics"
                    value={configuracoes.google_analytics}
                    onChange={handleChange}
                    placeholder="G-XXXXXXXXXX"
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
                    Facebook Pixel ID
                  </label>
                  <input
                    type="text"
                    name="facebook_pixel"
                    value={configuracoes.facebook_pixel}
                    onChange={handleChange}
                    placeholder="123456789012345"
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
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin")}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </div>

      {/* ========== MODAL PARA CADASTRAR/EDITAR IMAGEM DO HERO ========== */}
      {showHeroImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`w-full max-w-2xl rounded-lg ${
              isDark ? "bg-gray-800" : "bg-white"
            } p-6`}
          >
            <h2
              className={`text-xl font-bold mb-4 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {editingHeroImage ? "Editar Imagem" : "Nova Imagem do Hero"}
            </h2>

            <form onSubmit={salvarHeroImage} className="space-y-4">
              {/* CAMPO DE UPLOAD DE IMAGEM */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Imagem <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setHeroImageForm({ ...heroImageForm, imagem: file });
                    if (file) {
                      setHeroImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className={`w-full p-2 border rounded ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300"
                  }`}
                  required={!editingHeroImage}
                />
                {editingHeroImage && (
                  <p className="text-xs text-gray-500 mt-1">
                    Deixe vazio para manter a imagem atual
                  </p>
                )}
              </div>

              {/* PREVIEW DA IMAGEM */}
              {heroImagePreview && (
                <div className="mt-2">
                  <img
                    src={heroImagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* TÍTULO DA IMAGEM (OPCIONAL) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Título da Imagem (opcional)
                </label>
                <input
                  type="text"
                  value={heroImageForm.titulo}
                  onChange={(e) =>
                    setHeroImageForm({
                      ...heroImageForm,
                      titulo: e.target.value,
                    })
                  }
                  placeholder="Se vazio, usará o título geral"
                  className={`w-full p-2 border rounded ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300"
                  }`}
                />
              </div>

              {/* ========== NOVO CAMPO: ORDEM ========== */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Ordem de Prioridade{" "}
                  <span className="text-xs text-gray-500">
                    (menor número = mais importante)
                  </span>
                </label>
                <input
                  type="number"
                  value={heroImageForm.ordem}
                  onChange={(e) =>
                    setHeroImageForm({
                      ...heroImageForm,
                      ordem: parseInt(e.target.value) || 0,
                    })
                  }
                  min="0"
                  max="999"
                  className={`w-full p-2 border rounded ${
                    isDark
                      ? "bg-gray-700 border-gray-600 text-gray-200"
                      : "bg-white border-gray-300"
                  }`}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Campanhas: 0-10 | Imagem padrão: 999
                </p>
              </div>

              {/* DATAS DE INÍCIO E FIM */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data de Início <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={heroImageForm.data_inicio}
                    onChange={(e) =>
                      setHeroImageForm({
                        ...heroImageForm,
                        data_inicio: e.target.value,
                      })
                    }
                    required
                    className={`w-full p-2 border rounded ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data de Fim <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={heroImageForm.data_fim}
                    onChange={(e) =>
                      setHeroImageForm({
                        ...heroImageForm,
                        data_fim: e.target.value,
                      })
                    }
                    required
                    className={`w-full p-2 border rounded ${
                      isDark
                        ? "bg-gray-700 border-gray-600 text-gray-200"
                        : "bg-white border-gray-300"
                    }`}
                  />
                </div>
              </div>

              {/* BOTÕES DO MODAL */}
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowHeroImageModal(false);
                    setEditingHeroImage(null);
                    setHeroImageForm({
                      titulo: "",
                      data_inicio: "",
                      data_fim: "",
                      imagem: null,
                      ordem: 0, // 👈 RESETA O CAMPO
                    });
                    setHeroImagePreview("");
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingHeroImage ? "Atualizar" : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Configuracoes;
