import React, { useState } from "react";
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

const Bairros = () => {
  const { isDark } = useTheme();

  const [bairros, setBairros] = useState([
    { id: 1, nome: "Centro", cidade: "Açailândia", estado: "MA", ativo: true },
    {
      id: 2,
      nome: "Vila Ildemar",
      cidade: "Açailândia",
      estado: "MA",
      ativo: true,
    },
    { id: 3, nome: "Pequiá", cidade: "Açailândia", estado: "MA", ativo: true },
    { id: 4, nome: "Centro", cidade: "Imperatriz", estado: "MA", ativo: true },
    {
      id: 5,
      nome: "Bequimão",
      cidade: "Imperatriz",
      estado: "MA",
      ativo: true,
    },
    { id: 6, nome: "Centro", cidade: "Itinga", estado: "MA", ativo: true },
  ]);

  const [busca, setBusca] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("todas");
  const [modalAberto, setModalAberto] = useState(false);
  const [bairroEditando, setBairroEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    cidade: "",
    estado: "",
  });

  const cidades = [
    { nome: "Açailândia", estado: "MA" },
    { nome: "Imperatriz", estado: "MA" },
    { nome: "Itinga", estado: "MA" },
  ];

  const estados = [
    { uf: "AC", nome: "Acre" },
    { uf: "AL", nome: "Alagoas" },
    { uf: "AP", nome: "Amapá" },
    { uf: "AM", nome: "Amazonas" },
    { uf: "BA", nome: "Bahia" },
    { uf: "CE", nome: "Ceará" },
    { uf: "DF", nome: "Distrito Federal" },
    { uf: "ES", nome: "Espírito Santo" },
    { uf: "GO", nome: "Goiás" },
    { uf: "MA", nome: "Maranhão" },
    { uf: "MT", nome: "Mato Grosso" },
    { uf: "MS", nome: "Mato Grosso do Sul" },
    { uf: "MG", nome: "Minas Gerais" },
    { uf: "PA", nome: "Pará" },
    { uf: "PB", nome: "Paraíba" },
    { uf: "PR", nome: "Paraná" },
    { uf: "PE", nome: "Pernambuco" },
    { uf: "PI", nome: "Piauí" },
    { uf: "RJ", nome: "Rio de Janeiro" },
    { uf: "RN", nome: "Rio Grande do Norte" },
    { uf: "RS", nome: "Rio Grande do Sul" },
    { uf: "RO", nome: "Rondônia" },
    { uf: "RR", nome: "Roraima" },
    { uf: "SC", nome: "Santa Catarina" },
    { uf: "SP", nome: "São Paulo" },
    { uf: "SE", nome: "Sergipe" },
    { uf: "TO", nome: "Tocantins" },
  ];

  const bairrosFiltrados = bairros.filter((bairro) => {
    const buscaMatch =
      bairro.nome.toLowerCase().includes(busca.toLowerCase()) ||
      bairro.cidade.toLowerCase().includes(busca.toLowerCase());
    const cidadeMatch =
      filtroCidade === "todas" || bairro.cidade === filtroCidade;
    return buscaMatch && cidadeMatch;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (bairroEditando) {
      setBairros((prev) =>
        prev.map((bairro) =>
          bairro.id === bairroEditando.id ? { ...bairro, ...formData } : bairro,
        ),
      );
    } else {
      const novoBairro = {
        id: Math.max(...bairros.map((b) => b.id)) + 1,
        ...formData,
        ativo: true,
      };
      setBairros((prev) => [...prev, novoBairro]);
    }
    handleResetModal();
    setModalAberto(false);
  };

  const handleEditar = (bairro) => {
    setBairroEditando(bairro);
    setFormData({
      nome: bairro.nome,
      cidade: bairro.cidade,
      estado: bairro.estado,
    });
    setModalAberto(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este bairro?")) {
      setBairros((prev) => prev.filter((bairro) => bairro.id !== id));
    }
  };

  const handleToggleAtivo = (id) => {
    setBairros((prev) =>
      prev.map((bairro) =>
        bairro.id === id ? { ...bairro, ativo: !bairro.ativo } : bairro,
      ),
    );
  };

  const handleNovoBairro = () => {
    setBairroEditando(null);
    handleResetModal();
    setModalAberto(true);
  };

  const handleCidadeChange = (cidadeNome) => {
    const cidadeSelecionada = cidades.find((c) => c.nome === cidadeNome);
    setFormData((prev) => ({
      ...prev,
      cidade: cidadeNome,
      estado: cidadeSelecionada?.estado || "MA",
    }));
  };

  const handleResetModal = () => {
    setFormData({ nome: "", cidade: "", estado: "" });
    setBairroEditando(null);
  };

  const cidadesUnicas = [...new Set(bairros.map((b) => b.cidade))].sort();

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

      {/* FORMULÁRIO DE BUSCA CORRIGIDO DEFINITIVAMENTE */}
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
                    ? "bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-500"
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
                  ? "border-gray-600 bg-gray-800 text-gray-200"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
              value={filtroCidade}
              onChange={(e) => setFiltroCidade(e.target.value)}
            >
              <option
                value="todas"
                className={isDark ? "bg-gray-800" : "bg-white"}
              >
                Todas as cidades
              </option>
              {cidadesUnicas.map((cidade) => (
                <option
                  key={cidade}
                  value={cidade}
                  className={isDark ? "bg-gray-800" : "bg-white"}
                >
                  {cidade}
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
              Estado
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
            {bairrosFiltrados.map((bairro) => (
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
                  <div
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {bairro.id}
                  </div>
                </div>
                <div
                  className={`p-4 flex items-center justify-center border-r ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`text-sm font-medium text-center ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {bairro.nome}
                  </div>
                </div>
                <div
                  className={`p-4 flex items-center justify-center border-r ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`text-sm text-center ${
                      isDark ? "text-gray-300" : "text-gray-900"
                    }`}
                  >
                    {bairro.cidade}
                  </div>
                </div>
                <div
                  className={`p-4 flex items-center justify-center border-r ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`text-sm font-semibold ${
                      isDark ? "text-gray-200" : "text-gray-900"
                    }`}
                  >
                    {bairro.estado}
                  </div>
                </div>
                <div
                  className={`p-4 flex items-center justify-center border-r ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => handleToggleAtivo(bairro.id)}
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
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditar(bairro)}
                      className="p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#D4A24D]/90 transition-colors"
                      aria-label="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExcluir(bairro.id)}
                      className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      aria-label="Excluir"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`px-6 py-4 border-t ${
            isDark
              ? "border-gray-700 bg-gray-800"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-700"}`}
            >
              Mostrando{" "}
              <span
                className={`font-medium ${isDark ? "text-gray-300" : "text-gray-900"}`}
              >
                {bairrosFiltrados.length}
              </span>{" "}
              de{" "}
              <span
                className={`font-medium ${isDark ? "text-gray-300" : "text-gray-900"}`}
              >
                {bairros.length}
              </span>{" "}
              bairros
            </div>
            <div className="mt-2 sm:mt-0">
              <div
                className={`flex items-center text-sm ${isDark ? "text-gray-400" : "text-gray-700"}`}
              >
                <span className="mr-2">Cidades:</span>
                <span
                  className={`font-medium ${isDark ? "text-gray-300" : "text-gray-900"}`}
                >
                  {new Set(bairros.map((b) => b.cidade)).size}
                </span>
              </div>
            </div>
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
                className={`text-lg font-semibold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
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
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Nome do Bairro *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do bairro"
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 ${
                      isDark
                        ? "border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-500"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    }`}
                    required
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Cidade *
                  </label>
                  <div className="relative">
                    <select
                      name="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleCidadeChange(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 appearance-none ${
                        isDark
                          ? "border-gray-600 bg-gray-800 text-gray-200"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                      required
                    >
                      <option
                        value=""
                        className={isDark ? "bg-gray-800" : "bg-white"}
                      >
                        Selecione uma cidade
                      </option>
                      {cidades.map((cidade) => (
                        <option
                          key={cidade.nome}
                          value={cidade.nome}
                          className={isDark ? "bg-gray-800" : "bg-white"}
                        >
                          {cidade.nome} - {cidade.estado}
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

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    Estado *
                  </label>
                  <div className="relative">
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 appearance-none ${
                        isDark
                          ? "border-gray-600 bg-gray-800 text-gray-200"
                          : "border-gray-300 bg-white text-gray-900"
                      }`}
                      required
                    >
                      <option
                        value=""
                        className={isDark ? "bg-gray-800" : "bg-white"}
                      >
                        Selecione um estado
                      </option>
                      {estados.map((estado) => (
                        <option
                          key={estado.uf}
                          value={estado.uf}
                          className={isDark ? "bg-gray-800" : "bg-white"}
                        >
                          {estado.nome} ({estado.uf})
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
                  {bairroEditando ? "Salvar Alterações" : "Criar Bairro"}
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
