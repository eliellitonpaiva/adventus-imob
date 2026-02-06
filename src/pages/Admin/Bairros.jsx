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
import Input from "../../componentes/ui/Input";

const Bairros = () => {
  // Dados de exemplo
  const [bairros, setBairros] = useState([
    {
      id: 1,
      nome: "Centro",
      cidade: "Açailândia",
      estado: "MA",
      ativo: true,
    },
    {
      id: 2,
      nome: "Vila Ildemar",
      cidade: "Açailândia",
      estado: "MA",
      ativo: true,
    },
    {
      id: 3,
      nome: "Pequiá",
      cidade: "Açailândia",
      estado: "MA",
      ativo: true,
    },
    {
      id: 4,
      nome: "Centro",
      cidade: "Imperatriz",
      estado: "MA",
      ativo: true,
    },
    {
      id: 5,
      nome: "Bequimão",
      cidade: "Imperatriz",
      estado: "MA",
      ativo: true,
    },
    {
      id: 6,
      nome: "Centro",
      cidade: "Itinga",
      estado: "MA",
      ativo: true,
    },
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

  const estados = ["MA", "SP", "RJ", "MG", "RS", "PR", "BA", "PE", "CE"];

  // Filtrar bairros
  const bairrosFiltrados = bairros.filter((bairro) => {
    const buscaMatch =
      bairro.nome.toLowerCase().includes(busca.toLowerCase()) ||
      bairro.cidade.toLowerCase().includes(busca.toLowerCase());

    const cidadeMatch =
      filtroCidade === "todas" || bairro.cidade === filtroCidade;

    return buscaMatch && cidadeMatch;
  });

  // Manipular formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (bairroEditando) {
      // Editar bairro existente
      setBairros((prev) =>
        prev.map((bairro) =>
          bairro.id === bairroEditando.id ? { ...bairro, ...formData } : bairro,
        ),
      );
    } else {
      // Adicionar novo bairro
      const novoBairro = {
        id: Math.max(...bairros.map((b) => b.id)) + 1,
        ...formData,
        ativo: true,
      };
      setBairros((prev) => [...prev, novoBairro]);
    }

    // Limpar e fechar modal
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

  // FUNÇÃO PARA RESETAR O MODAL
  const handleResetModal = () => {
    setFormData({
      nome: "",
      cidade: "",
      estado: "",
    });
    setBairroEditando(null);
  };

  // Cidades únicas para filtro
  const cidadesUnicas = [...new Set(bairros.map((b) => b.cidade))].sort();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bairros</h1>
          <p className="text-gray-600">Gerencie os bairros das cidades</p>
        </div>
        <Button variant="primary" onClick={handleNovoBairro}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Bairro
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por bairro ou cidade..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <FunnelIcon className="w-5 h-5 text-gray-400" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30"
              value={filtroCidade}
              onChange={(e) => setFiltroCidade(e.target.value)}
            >
              <option value="todas">Todas as cidades</option>
              {cidadesUnicas.map((cidade) => (
                <option key={cidade} value={cidade}>
                  {cidade}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela - NOVO LAYOUT COM CSS GRID (igual Estados e Cidades) */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* Cabeçalho da tabela com grid - 6 COLUNAS */}
          <div className="grid grid-cols-6 gap-0 bg-gray-50 border-b border-gray-200">
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              ID
            </div>
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Bairro
            </div>
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cidade
            </div>
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Estado
            </div>
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Status
            </div>
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Ações
            </div>
          </div>

          {/* Corpo da tabela */}
          <div className="divide-y divide-gray-200">
            {bairrosFiltrados.map((bairro) => (
              <div
                key={bairro.id}
                className="grid grid-cols-6 gap-0 hover:bg-gray-50"
              >
                {/* ID */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <div className="text-sm font-medium text-gray-900">
                    {bairro.id}
                  </div>
                </div>

                {/* Bairro */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <div className="text-sm font-medium text-gray-900 text-center">
                    {bairro.nome}
                  </div>
                </div>

                {/* Cidade */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <div className="text-sm text-gray-900 text-center">
                    {bairro.cidade}
                  </div>
                </div>

                {/* Estado */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <div className="text-sm font-semibold text-gray-900">
                    {bairro.estado}
                  </div>
                </div>

                {/* Status */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <button
                    onClick={() => handleToggleAtivo(bairro.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      bairro.ativo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {bairro.ativo ? "Ativo" : "Inativo"}
                  </button>
                </div>

                {/* Ações - ÍCONES IDÊNTICOS AOS DAS CIDADES */}
                <div className="p-4 flex items-center justify-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botão Editar com tooltip */}
                    <div className="relative group">
                      <button
                        onClick={() => handleEditar(bairro)}
                        className="p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#D4A24D]/90 transition-colors"
                        aria-label="Editar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Editar
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>

                    {/* Botão Excluir com tooltip */}
                    <div className="relative group">
                      <button
                        onClick={() => handleExcluir(bairro.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        aria-label="Excluir"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                        Excluir
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé da tabela */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-gray-700">
              Mostrando{" "}
              <span className="font-medium">{bairrosFiltrados.length}</span> de{" "}
              <span className="font-medium">{bairros.length}</span> bairros
            </div>
            <div className="mt-2 sm:mt-0">
              <div className="flex items-center text-sm text-gray-700">
                <span className="mr-2">Cidades:</span>
                <span className="font-medium">
                  {new Set(bairros.map((b) => b.cidade)).size}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal para adicionar/editar bairro */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {bairroEditando ? "Editar Bairro" : "Novo Bairro"}
              </h2>
              <button
                onClick={() => {
                  setModalAberto(false);
                  handleResetModal();
                }}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Bairro *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do bairro"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade *
                  </label>
                  <div className="relative">
                    <select
                      name="cidade"
                      value={formData.cidade}
                      onChange={(e) => handleCidadeChange(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30"
                      required
                    >
                      <option value="">Selecione uma cidade</option>
                      {cidades.map((cidade) => (
                        <option key={cidade.nome} value={cidade.nome}>
                          {cidade.nome} - {cidade.estado}
                        </option>
                      ))}
                    </select>
                    <ChevronUpDownIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <div className="relative">
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30"
                      required
                    >
                      <option value="">Selecione um estado</option>
                      {estados.map((estado) => (
                        <option key={estado} value={estado}>
                          {estado}
                        </option>
                      ))}
                    </select>
                    <ChevronUpDownIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
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
