import React, { useState, useEffect } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckIcon,
  XMarkIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

const Bairros = () => {
  const { isDark } = useTheme();

  const [bairros, setBairros] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [bairroEditando, setBairroEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cidade_id: "",
  });

  // ===== GERAR SLUG (SÓ USADO NA HORA DE SALVAR) =====
  const gerarSlug = (nome, cidadeNome) => {
    return (
      nome
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim() +
      `-${cidadeNome?.toLowerCase().replace(/\s+/g, "-") || "sem-cidade"}`
    );
  };

  // ===== BUSCAR CIDADES DO SUPABASE =====
  const fetchCidades = async () => {
    try {
      const { data, error } = await supabase
        .from("cidades")
        .select("id, nome, uf")
        .eq("ativo", true)
        .order("nome");

      if (error) throw error;
      setCidades(data || []);
    } catch (error) {
      console.error("Erro ao buscar cidades:", error);
    }
  };

  // ===== BUSCAR BAIRROS DO SUPABASE COM JOIN =====
  const fetchBairros = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bairros")
        .select(
          `
          *,
          cidades (
            nome,
            uf
          )
        `,
        )
        .order("nome");

      if (error) throw error;
      setBairros(data || []);
    } catch (error) {
      console.error("Erro ao buscar bairros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCidades();
    fetchBairros();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Pegar nome da cidade para o slug
      const cidadeSelecionada = cidades.find(
        (c) => c.id === formData.cidade_id,
      );
      const slug = gerarSlug(formData.nome, cidadeSelecionada?.nome);

      if (bairroEditando) {
        const { error } = await supabase
          .from("bairros")
          .update({
            nome: formData.nome,
            cidade_id: formData.cidade_id,
            slug: slug,
          })
          .eq("id", bairroEditando.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("bairros").insert([
          {
            nome: formData.nome,
            cidade_id: formData.cidade_id,
            slug: slug,
            ativo: true,
          },
        ]);

        if (error) throw error;
      }

      await fetchBairros();
      handleResetModal();
      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao salvar bairro:", error);
      alert(`Erro ao salvar bairro: ${error.message}`);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este bairro?")) return;
    try {
      const { error } = await supabase.from("bairros").delete().eq("id", id);
      if (error) throw error;
      await fetchBairros();
    } catch (error) {
      console.error("Erro ao excluir bairro:", error);
      alert(`Erro ao excluir bairro: ${error.message}`);
    }
  };

  const handleToggleAtivo = async (id, ativoAtual) => {
    try {
      const { error } = await supabase
        .from("bairros")
        .update({ ativo: !ativoAtual })
        .eq("id", id);
      if (error) throw error;
      await fetchBairros();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleEditar = (bairro) => {
    setBairroEditando(bairro);
    setFormData({
      nome: bairro.nome,
      cidade_id: bairro.cidade_id,
    });
    setModalAberto(true);
  };

  const handleNovoBairro = () => {
    setBairroEditando(null);
    setFormData({ nome: "", cidade_id: "" });
    setModalAberto(true);
  };

  const handleResetModal = () => {
    setFormData({ nome: "", cidade_id: "" });
    setBairroEditando(null);
  };

  // ===== FILTROS =====
  const bairrosFiltrados = bairros.filter((bairro) => {
    const buscaMatch =
      bairro.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      bairro.cidades?.nome?.toLowerCase().includes(busca.toLowerCase());

    const cidadeMatch =
      filtroCidade === "todas" || bairro.cidade_id === filtroCidade;

    return buscaMatch && cidadeMatch;
  });

  // Cidades únicas para filtro
  const cidadesUnicas = cidades;

  if (loading) {
    return (
      <div
        className={`min-h-screen p-6 flex items-center justify-center ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#D4A24D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Carregando bairros...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Bairros
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Gerencie os bairros das cidades
          </p>
        </div>
        <Button variant="primary" onClick={handleNovoBairro}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Bairro
        </Button>
      </div>

      <div
        className={`rounded-lg border p-4 mb-6 ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon
                className={`w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 ${
                  isDark ? "text-gray-500" : "text-gray-400"
                }`}
              />
              <input
                type="text"
                placeholder="Buscar por bairro ou cidade..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                }`}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon
              className={`w-5 h-5 ${isDark ? "text-gray-500" : "text-gray-400"}`}
            />
            <select
              className={`border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 ${
                isDark
                  ? "border-gray-600 bg-gray-700 text-gray-200"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
              value={filtroCidade}
              onChange={(e) => setFiltroCidade(e.target.value)}
            >
              <option
                value="todas"
                className={isDark ? "bg-gray-700" : "bg-white"}
              >
                Todas as cidades
              </option>
              {cidadesUnicas.map((cidade) => (
                <option
                  key={cidade.id}
                  value={cidade.id}
                  className={isDark ? "bg-gray-700" : "bg-white"}
                >
                  {cidade.nome} - {cidade.uf}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg border overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          <div
            className={`grid grid-cols-6 gap-0 border-b ${
              isDark
                ? "bg-gray-700 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div
              className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              ID
            </div>
            <div
              className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Bairro
            </div>
            <div
              className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Cidade
            </div>
            <div
              className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              UF
            </div>
            <div
              className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Status
            </div>
            <div
              className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Ações
            </div>
          </div>

          <div
            className={
              isDark ? "divide-y divide-gray-700" : "divide-y divide-gray-200"
            }
          >
            {bairrosFiltrados.length > 0 ? (
              bairrosFiltrados.map((bairro) => (
                <div
                  key={bairro.id}
                  className={`grid grid-cols-6 gap-0 ${
                    isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`p-4 flex items-center justify-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-sm font-mono ${isDark ? "text-gray-300" : "text-gray-600"}`}
                    >
                      {bairro.id.substring(0, 8)}...
                    </span>
                  </div>
                  <div
                    className={`p-4 flex items-center justify-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-sm font-medium ${isDark ? "text-gray-200" : "text-gray-900"}`}
                    >
                      {bairro.nome}
                    </span>
                  </div>
                  <div
                    className={`p-4 flex items-center justify-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}
                    >
                      {bairro.cidades?.nome}
                    </span>
                  </div>
                  <div
                    className={`p-4 flex items-center justify-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <span
                      className={`text-sm font-semibold ${isDark ? "text-gray-200" : "text-gray-900"}`}
                    >
                      {bairro.cidades?.uf}
                    </span>
                  </div>
                  <div
                    className={`p-4 flex items-center justify-center border-r ${
                      isDark ? "border-gray-700" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => handleToggleAtivo(bairro.id, bairro.ativo)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        bairro.ativo
                          ? isDark
                            ? "bg-green-900/30 text-green-400 border border-green-800"
                            : "bg-green-100 text-green-800"
                          : isDark
                            ? "bg-red-900/30 text-red-400 border border-red-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {bairro.ativo ? "Ativo" : "Inativo"}
                    </button>
                  </div>
                  <div className="p-4 flex items-center justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditar(bairro)}
                        className="p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#D4A24D]/90 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExcluir(bairro.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div
                className={`p-8 text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                Nenhum bairro encontrado.
              </div>
            )}
          </div>
        </div>

        <div
          className={`px-6 py-4 border-t ${
            isDark
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-700"}`}
          >
            Mostrando {bairrosFiltrados.length} de {bairros.length} bairros
          </div>
        </div>
      </div>

      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-lg shadow-xl w-full max-w-md ${
              isDark ? "bg-gray-800 border border-gray-700" : "bg-white"
            }`}
          >
            <div
              className={`flex items-center justify-between p-6 border-b ${
                isDark ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h2
                className={`text-lg font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}
              >
                {bairroEditando ? "Editar Bairro" : "Novo Bairro"}
              </h2>
              <button
                onClick={() => {
                  setModalAberto(false);
                  handleResetModal();
                }}
                className="p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#D4A24D]/90 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Nome do Bairro *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Centro"
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 ${
                      isDark
                        ? "border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-500"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${isDark ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Cidade *
                  </label>
                  <div className="relative">
                    <select
                      name="cidade_id"
                      value={formData.cidade_id}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 appearance-none ${
                        isDark
                          ? "border-gray-600 bg-gray-700 text-gray-200"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                      required
                    >
                      <option
                        value=""
                        className={isDark ? "bg-gray-700" : "bg-white"}
                      >
                        Selecione uma cidade
                      </option>
                      {cidades.map((cidade) => (
                        <option
                          key={cidade.id}
                          value={cidade.id}
                          className={isDark ? "bg-gray-700" : "bg-white"}
                        >
                          {cidade.nome} - {cidade.uf}
                        </option>
                      ))}
                    </select>
                    <ChevronUpDownIcon
                      className={`w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>
                </div>

                {/* 🚨 SLUG REMOVIDO DO MODAL! NÃO APARECE MAIS! */}
              </div>

              <div
                className={`p-6 border-t flex justify-end gap-3 ${
                  isDark
                    ? "border-gray-700 bg-gray-800"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setModalAberto(false);
                    handleResetModal();
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary">
                  <CheckIcon className="w-4 h-4 mr-2" />
                  {bairroEditando ? "Atualizar" : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bairros;
