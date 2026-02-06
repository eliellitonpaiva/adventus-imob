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

const Cidades = () => {
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

  // TODOS OS ESTADOS BRASILEIROS
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
    console.log(`Campo ${name} alterado para: ${value}`); // Para debug
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulário submetido:", formData); // Para debug

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
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Cidades</h1>
          <p className="text-gray-600">Gerencie as cidades brasileiras</p>
        </div>
        <Button variant="primary" onClick={handleNovaCidade}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Nova Cidade
        </Button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Buscar por nome da cidade..."
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
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos os estados</option>
              {estadosUnicos.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela - NOVO LAYOUT COM CSS GRID (igual Estados) */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {/* Cabeçalho da tabela com grid - 6 COLUNAS */}
          <div className="grid grid-cols-6 gap-0 bg-gray-50 border-b border-gray-200">
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              ID
            </div>
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Cidade
            </div>
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Estado
            </div>
            <div className="p-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              População
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
            {cidadesFiltradas.map((cidade) => (
              <div
                key={cidade.id}
                className="grid grid-cols-6 gap-0 hover:bg-gray-50"
              >
                {/* ID */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <div className="text-sm font-medium text-gray-900">
                    {cidade.id}
                  </div>
                </div>

                {/* Cidade */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <div className="text-sm font-medium text-gray-900 text-center">
                    {cidade.nome}
                  </div>
                </div>

                {/* Estado */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <div className="text-sm font-semibold text-gray-900">
                    {cidade.estado}
                  </div>
                </div>

                {/* População */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <div className="text-sm text-gray-900 text-center">
                    {cidade.populacao}
                  </div>
                </div>

                {/* Status */}
                <div className="p-4 flex items-center justify-center border-r border-gray-200">
                  <button
                    onClick={() => handleToggleAtivo(cidade.id)}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      cidade.ativo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {cidade.ativo ? "Ativa" : "Inativa"}
                  </button>
                </div>

                {/* Ações */}
                <div className="p-4 flex items-center justify-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botão Editar com tooltip */}
                    <div className="relative group">
                      <button
                        onClick={() => handleEditar(cidade)}
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
                        onClick={() => handleExcluir(cidade.id)}
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

        {/* Total de registros */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">{cidadesFiltradas.length}</span> de{" "}
            <span className="font-medium">{cidades.length}</span> cidades
          </div>
        </div>
      </div>

      {/* Modal de cadastro/edição */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                {cidadeEditando ? "Editar Cidade" : "Nova Cidade"}
              </h3>
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
                    Nome da Cidade *
                  </label>
                  {/* CORREÇÃO: Input simplificado para testar */}
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Ex: Açailândia"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado *
                  </label>
                  <div className="relative">
                    {/* CORREÇÃO: Select simplificado */}
                    <select
                      name="estado"
                      value={formData.estado}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30"
                      required
                    >
                      <option value="">Selecione um estado</option>
                      {estados.map((estado) => (
                        <option key={estado.uf} value={estado.uf}>
                          {estado.nome} ({estado.uf})
                        </option>
                      ))}
                    </select>
                    <ChevronUpDownIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    População
                  </label>
                  {/* CORREÇÃO: Input simplificado para testar */}
                  <input
                    type="text"
                    name="populacao"
                    value={formData.populacao}
                    onChange={handleInputChange}
                    placeholder="Ex: 108 MIL PESSOAS"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30"
                  />
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
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
