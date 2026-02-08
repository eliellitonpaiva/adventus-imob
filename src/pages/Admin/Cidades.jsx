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
import { useTheme } from "../../contexts/ThemeContext"; // Importando o contexto de tema

const Cidades = () => {
  const { isDark } = useTheme(); // Hook para verificar se está no modo escuro

  // Dados de exemplo (seus dados)
  const [cidades, setCidades] = useState([
    {
      id: 1,
      nome: "Açailândia",
      estado: "MA",
      populacao: "108 MIL PESSOAS",
      ativo: true,
    },
    {
      id: 2,
      nome: "Imperatriz",
      estado: "MA",
      populacao: "300 MIL PESSOAS",
      ativo: true,
    },
    {
      id: 3,
      nome: "Itinga",
      estado: "MA",
      populacao: "50 MIL PESSOAS",
      ativo: true,
    },
  ]);

  const [busca, setBusca] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [cidadeEditando, setCidadeEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    estado: "",
    populacao: "",
  });

  // TODOS OS ESTADOS BRASILEIROS (26 estados + Distrito Federal)
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

  // Filtrar cidades
  const cidadesFiltradas = cidades.filter((cidade) => {
    const buscaMatch = cidade.nome.toLowerCase().includes(busca.toLowerCase());

    const estadoMatch =
      filtroEstado === "todos" || cidade.estado === filtroEstado;

    return buscaMatch && estadoMatch;
  });

  // CORREÇÃO: Função mais simples para manipular input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cidadeEditando) {
      // Editar cidade existente
      setCidades((prev) =>
        prev.map((cidade) =>
          cidade.id === cidadeEditando.id
            ? { ...cidade, ...formData, ativo: cidade.ativo }
            : cidade,
        ),
      );
    } else {
      // Adicionar nova cidade
      const novaCidade = {
        id: Math.max(...cidades.map((c) => c.id)) + 1,
        ...formData,
        ativo: true,
      };
      setCidades((prev) => [...prev, novaCidade]);
    }

    // Limpar e fechar modal
    handleResetModal();
    setModalAberto(false);
  };

  const handleEditar = (cidade) => {
    setCidadeEditando(cidade);
    setFormData({
      nome: cidade.nome,
      estado: cidade.estado,
      populacao: cidade.populacao,
    });
    setModalAberto(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta cidade?")) {
      setCidades((prev) => prev.filter((cidade) => cidade.id !== id));
    }
  };

  const handleToggleAtivo = (id) => {
    setCidades((prev) =>
      prev.map((cidade) =>
        cidade.id === id ? { ...cidade, ativo: !cidade.ativo } : cidade,
      ),
    );
  };

  const handleNovaCidade = () => {
    setCidadeEditando(null);
    handleResetModal();
    setModalAberto(true);
  };

  // FUNÇÃO PARA RESETAR O MODAL
  const handleResetModal = () => {
    setFormData({
      nome: "",
      estado: "",
      populacao: "",
    });
    setCidadeEditando(null);
  };

  // Estados únicos para filtro
  const estadosUnicos = [...new Set(cidades.map((c) => c.estado))].sort();

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Cidades
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Gerencie as cidades brasileiras
          </p>
        </div>
        <Button variant="primary" onClick={handleNovaCidade}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nova Cidade
        </Button>
      </div>

      {/* Filtros - CORRIGIDO: Input substituído por input nativo */}
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
              {/* CORREÇÃO: Input nativo com tema adequado */}
              <input
                type="text"
                placeholder="Buscar por nome da cidade..."
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
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option
                value="todos"
                className={isDark ? "bg-gray-800" : "bg-white"}
              >
                Todos os estados
              </option>
              {estadosUnicos.map((estado) => (
                <option
                  key={estado}
                  value={estado}
                  className={isDark ? "bg-gray-800" : "bg-white"}
                >
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela - NOVO LAYOUT COM CSS GRID */}
      <div
        className={`rounded-lg border overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          {/* Cabeçalho da tabela com grid - 6 COLUNAS */}
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
              População
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

          {/* Corpo da tabela */}
          <div
            className={
              isDark ? "divide-y divide-gray-700" : "divide-y divide-gray-200"
            }
          >
            {cidadesFiltradas.map((cidade) => (
              <div
                key={cidade.id}
                className={`grid grid-cols-6 gap-0 ${
                  isDark ? "hover:bg-gray-700/50" : "hover:bg-gray-50"
                }`}
              >
                {/* ID */}
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
                    {cidade.id}
                  </div>
                </div>

                {/* Cidade */}
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
                    {cidade.nome}
                  </div>
                </div>

                {/* Estado */}
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
                    {cidade.estado}
                  </div>
                </div>

                {/* População */}
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
                    {cidade.populacao}
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`p-4 flex items-center justify-center border-r ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <button
                    onClick={() => handleToggleAtivo(cidade.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      cidade.ativo
                        ? isDark
                          ? "bg-green-900/30 text-green-400 border border-green-800"
                          : "bg-green-100 text-green-800"
                        : isDark
                          ? "bg-red-900/30 text-red-400 border border-red-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cidade.ativo ? "Ativa" : "Inativa"}
                  </button>
                </div>

                {/* Ações */}
                <div className="p-4 flex items-center justify-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botão Editar */}
                    <button
                      onClick={() => handleEditar(cidade)}
                      className="p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#D4A24D]/90 transition-colors"
                      aria-label="Editar"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>

                    {/* Botão Excluir */}
                    <button
                      onClick={() => handleExcluir(cidade.id)}
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

        {/* Total de registros */}
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
            Mostrando{" "}
            <span
              className={`font-medium ${
                isDark ? "text-gray-300" : "text-gray-900"
              }`}
            >
              {cidadesFiltradas.length}
            </span>{" "}
            de{" "}
            <span
              className={`font-medium ${
                isDark ? "text-gray-300" : "text-gray-900"
              }`}
            >
              {cidades.length}
            </span>{" "}
            cidades
          </div>
        </div>
      </div>

      {/* Modal de cadastro/edição */}
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
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {cidadeEditando ? "Editar Cidade" : "Nova Cidade"}
              </h3>
              {/* CORREÇÃO: Botão de fechar amarelo com X branco */}
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
                    Nome da Cidade *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Açailândia"
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

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    População
                  </label>
                  <input
                    type="text"
                    name="populacao"
                    value={formData.populacao}
                    onChange={handleInputChange}
                    placeholder="Ex: 108 MIL PESSOAS"
                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 ${
                      isDark
                        ? "border-gray-600 bg-gray-800 text-gray-200 placeholder-gray-500"
                        : "border-gray-300 bg-white text-gray-900 placeholder-gray-500"
                    }`}
                  />
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
                  {cidadeEditando ? "Atualizar" : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cidades;
