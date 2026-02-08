import React, { useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ChevronUpDownIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext"; // Importando o contexto de tema

const Estados = () => {
  const { isDark } = useTheme(); // Hook para verificar se está no modo escuro

  // Dados de exemplo - APENAS MARANHÃO
  const [estados, setEstados] = useState([
    { id: 1, uf: "MA", nome: "Maranhão", regiao: "Nordeste" },
  ]);

  const [modalAberto, setModalAberto] = useState(false);
  const [estadoEditando, setEstadoEditando] = useState(null);
  const [formData, setFormData] = useState({
    uf: "",
    nome: "",
    regiao: "",
  });

  // TODOS os estados brasileiros (26 estados + DF)
  const estadosBrasileiros = [
    // Região Norte
    { uf: "AC", nome: "Acre", regiao: "Norte" },
    { uf: "AP", nome: "Amapá", regiao: "Norte" },
    { uf: "AM", nome: "Amazonas", regiao: "Norte" },
    { uf: "PA", nome: "Pará", regiao: "Norte" },
    { uf: "RO", nome: "Rondônia", regiao: "Norte" },
    { uf: "RR", nome: "Roraima", regiao: "Norte" },
    { uf: "TO", nome: "Tocantins", regiao: "Norte" },

    // Região Nordeste
    { uf: "AL", nome: "Alagoas", regiao: "Nordeste" },
    { uf: "BA", nome: "Bahia", regiao: "Nordeste" },
    { uf: "CE", nome: "Ceará", regiao: "Nordeste" },
    { uf: "MA", nome: "Maranhão", regiao: "Nordeste" },
    { uf: "PB", nome: "Paraíba", regiao: "Nordeste" },
    { uf: "PE", nome: "Pernambuco", regiao: "Nordeste" },
    { uf: "PI", nome: "Piauí", regiao: "Nordeste" },
    { uf: "RN", nome: "Rio Grande do Norte", regiao: "Nordeste" },
    { uf: "SE", nome: "Sergipe", regiao: "Nordeste" },

    // Região Centro-Oeste
    { uf: "DF", nome: "Distrito Federal", regiao: "Centro-Oeste" },
    { uf: "GO", nome: "Goiás", regiao: "Centro-Oeste" },
    { uf: "MT", nome: "Mato Grosso", regiao: "Centro-Oeste" },
    { uf: "MS", nome: "Mato Grosso do Sul", regiao: "Centro-Oeste" },

    // Região Sudeste
    { uf: "ES", nome: "Espírito Santo", regiao: "Sudeste" },
    { uf: "MG", nome: "Minas Gerais", regiao: "Sudeste" },
    { uf: "RJ", nome: "Rio de Janeiro", regiao: "Sudeste" },
    { uf: "SP", nome: "São Paulo", regiao: "Sudeste" },

    // Região Sul
    { uf: "PR", nome: "Paraná", regiao: "Sul" },
    { uf: "RS", nome: "Rio Grande do Sul", regiao: "Sul" },
    { uf: "SC", nome: "Santa Catarina", regiao: "Sul" },
  ];

  // Ordenar alfabeticamente por UF para facilitar a busca
  estadosBrasileiros.sort((a, b) => a.uf.localeCompare(b.uf));

  const regioes = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUfChange = (uf) => {
    const estadoSelecionado = estadosBrasileiros.find((e) => e.uf === uf);
    if (estadoSelecionado) {
      setFormData({
        uf: estadoSelecionado.uf,
        nome: estadoSelecionado.nome,
        regiao: estadoSelecionado.regiao,
      });
    }
  };

  const handleNomeChange = (nome) => {
    const estadoSelecionado = estadosBrasileiros.find((e) => e.nome === nome);
    if (estadoSelecionado) {
      setFormData({
        uf: estadoSelecionado.uf,
        nome: estadoSelecionado.nome,
        regiao: estadoSelecionado.regiao,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (estadoEditando) {
      // Editar estado existente
      setEstados((prev) =>
        prev.map((estado) =>
          estado.id === estadoEditando.id ? { ...estado, ...formData } : estado,
        ),
      );
    } else {
      // Adicionar novo estado
      const novoEstado = {
        id: Math.max(...estados.map((e) => e.id)) + 1,
        ...formData,
      };
      setEstados((prev) => [...prev, novoEstado]);
    }

    // Limpar e fechar modal
    handleResetModal();
    setModalAberto(false);
  };

  const handleEditar = (estado) => {
    setEstadoEditando(estado);
    setFormData({
      uf: estado.uf,
      nome: estado.nome,
      regiao: estado.regiao,
    });
    setModalAberto(true);
  };

  const handleExcluir = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este estado?")) {
      setEstados((prev) => prev.filter((estado) => estado.id !== id));
    }
  };

  const handleNovoEstado = () => {
    setEstadoEditando(null);
    handleResetModal();
    setModalAberto(true);
  };

  // FUNÇÃO PARA RESETAR O MODAL
  const handleResetModal = () => {
    setFormData({
      uf: "",
      nome: "",
      regiao: "",
    });
    setEstadoEditando(null);
  };

  // Funções de estilo baseadas no tema
  const getBadgeClass = () => {
    return isDark
      ? "px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-700 text-gray-300"
      : "px-3 py-1 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800";
  };

  const getTooltipClass = () => {
    return isDark
      ? "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap"
      : "absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap";
  };

  const getTooltipArrowClass = () => {
    return isDark
      ? "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-700"
      : "absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800";
  };

  const getSelectClass = () => {
    return isDark
      ? "w-full border border-gray-600 bg-gray-800 text-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 appearance-none"
      : "w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 appearance-none";
  };

  return (
    <div
      className={`min-h-screen p-6 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1
            className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}
          >
            Estados
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Gerencie os estados brasileiros
          </p>
        </div>
        <Button variant="primary" onClick={handleNovoEstado}>
          <PlusIcon className="w-4 h-4 mr-2" />
          Novo Estado
        </Button>
      </div>

      {/* Tabela - USANDO CSS GRID PARA CONTROLE PRECISO */}
      <div
        className={`rounded-lg border overflow-hidden ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="overflow-x-auto">
          {/* Cabeçalho da tabela com grid */}
          <div
            className={`grid grid-cols-5 gap-0 border-b ${
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
              UF
            </div>
            <div
              className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Nome
            </div>
            <div
              className={`p-4 text-center text-xs font-semibold uppercase tracking-wider ${
                isDark ? "text-gray-300" : "text-gray-500"
              }`}
            >
              Região
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
            {estados.map((estado) => (
              <div
                key={estado.id}
                className={`grid grid-cols-5 gap-0 ${
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
                    {estado.id}
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
                    {estado.uf}
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
                    {estado.nome}
                  </div>
                </div>

                <div
                  className={`p-4 flex items-center justify-center border-r ${
                    isDark ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <span className={getBadgeClass()}>{estado.regiao}</span>
                </div>

                <div className="p-4 flex items-center justify-center">
                  <div className="flex items-center justify-center gap-2">
                    {/* Botão Editar com tooltip */}
                    <div className="relative group">
                      <button
                        onClick={() => handleEditar(estado)}
                        className="p-2 bg-[#D4A24D] text-white rounded-lg hover:bg-[#D4A24D]/90 transition-colors"
                        aria-label="Editar"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      {/* Tooltip */}
                      <div className={getTooltipClass()}>
                        Editar
                        <div className={getTooltipArrowClass()}></div>
                      </div>
                    </div>

                    {/* Botão Excluir com tooltip */}
                    <div className="relative group">
                      <button
                        onClick={() => handleExcluir(estado.id)}
                        className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        aria-label="Excluir"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      {/* Tooltip */}
                      <div className={getTooltipClass()}>
                        Excluir
                        <div className={getTooltipArrowClass()}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal para cadastro/edição */}
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
                {estadoEditando ? "Editar Estado" : "Novo Estado"}
              </h2>
              <button
                onClick={() => {
                  setModalAberto(false);
                  handleResetModal();
                }}
                className={`p-1 rounded-lg ${
                  isDark
                    ? "hover:bg-gray-700 text-gray-400"
                    : "hover:bg-gray-100"
                }`}
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
                    UF *
                  </label>
                  <div className="relative">
                    <select
                      name="uf"
                      value={formData.uf}
                      onChange={(e) => handleUfChange(e.target.value)}
                      className={getSelectClass()}
                      required
                    >
                      <option value="" className={isDark ? "bg-gray-800" : ""}>
                        Selecione uma UF
                      </option>
                      {estadosBrasileiros.map((estado) => (
                        <option
                          key={estado.uf}
                          value={estado.uf}
                          className={isDark ? "bg-gray-800" : ""}
                        >
                          {estado.uf}
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
                    Nome do Estado *
                  </label>
                  <div className="relative">
                    <select
                      name="nome"
                      value={formData.nome}
                      onChange={(e) => handleNomeChange(e.target.value)}
                      className={getSelectClass()}
                      required
                    >
                      <option value="" className={isDark ? "bg-gray-800" : ""}>
                        Selecione um estado
                      </option>
                      {estadosBrasileiros.map((estado) => (
                        <option
                          key={estado.nome}
                          value={estado.nome}
                          className={isDark ? "bg-gray-800" : ""}
                        >
                          {estado.nome}
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
                    Região *
                  </label>
                  <div className="relative">
                    <select
                      name="regiao"
                      value={formData.regiao}
                      onChange={handleInputChange}
                      className={getSelectClass()}
                      required
                    >
                      <option value="" className={isDark ? "bg-gray-800" : ""}>
                        Selecione uma região
                      </option>
                      {regioes.map((regiao) => (
                        <option
                          key={regiao}
                          value={regiao}
                          className={isDark ? "bg-gray-800" : ""}
                        >
                          {regiao}
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
                    : "bg-gray-50 border-gray-200"
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
                  {estadoEditando ? "Salvar Alterações" : "Criar Estado"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estados;
