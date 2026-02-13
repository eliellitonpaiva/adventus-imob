// src/pages/Admin/ListaEmpreendimentos.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  BuildingOfficeIcon,
  HomeModernIcon,
  HomeIcon,
  MapPinIcon,
  CalendarIcon,
  BuildingOffice2Icon,
  Squares2X2Icon,
  TruckIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../lib/supabase";

const ListaEmpreendimentos = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // =============== ESTADOS ===============
  const [loading, setLoading] = useState(true);
  const [empreendimentos, setEmpreendimentos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroCidade, setFiltroCidade] = useState("");

  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina] = useState(9);

  // =============== FUNÇÕES DE CORES (TEMA) ===============
  const getBgClass = () => (isDark ? "bg-gray-900" : "bg-gray-50");
  const getCardBgClass = () => (isDark ? "bg-gray-800" : "bg-white");
  const getBorderClass = () => (isDark ? "border-gray-700" : "border-gray-200");
  const getTextClass = () => (isDark ? "text-gray-100" : "text-gray-900");
  const getTextSecondaryClass = () =>
    isDark ? "text-gray-400" : "text-gray-600";
  const getInputBgClass = () => (isDark ? "bg-gray-700" : "bg-white");
  const getInputBorderClass = () =>
    isDark ? "border-gray-600" : "border-gray-300";
  const getInputTextClass = () => (isDark ? "text-gray-200" : "text-gray-900");
  const getPlaceholderClass = () =>
    isDark ? "placeholder-gray-500" : "placeholder-gray-400";

  // =============== BUSCAR EMPREENDIMENTOS ===============
  const fetchEmpreendimentos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("edificios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEmpreendimentos(data || []);
    } catch (error) {
      console.error("Erro ao buscar empreendimentos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpreendimentos();
  }, []);

  // =============== DELETAR EMPREENDIMENTO ===============
  const handleDelete = async (id, nome) => {
    if (
      window.confirm(
        `Tem certeza que deseja excluir o empreendimento "${nome}"?`,
      )
    ) {
      try {
        const { error } = await supabase
          .from("edificios")
          .delete()
          .eq("id", id);

        if (error) throw error;

        // Atualizar a lista
        setEmpreendimentos(empreendimentos.filter((emp) => emp.id !== id));
      } catch (error) {
        console.error("Erro ao excluir empreendimento:", error);
        alert("Erro ao excluir empreendimento. Tente novamente.");
      }
    }
  };

  // =============== FILTRAGEM ===============
  const empreendimentosFiltrados = empreendimentos.filter((emp) => {
    const buscaMatch =
      searchTerm === "" ||
      emp.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.endereco?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.bairro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.construtora?.toLowerCase().includes(searchTerm.toLowerCase());

    const tipoMatch = filtroTipo === "" || emp.tipo === filtroTipo;
    const cidadeMatch = filtroCidade === "" || emp.cidade === filtroCidade;

    return buscaMatch && tipoMatch && cidadeMatch;
  });

  // =============== PAGINAÇÃO ===============
  const indexUltimoItem = paginaAtual * itensPorPagina;
  const indexPrimeiroItem = indexUltimoItem - itensPorPagina;
  const empreendimentosPaginados = empreendimentosFiltrados.slice(
    indexPrimeiroItem,
    indexUltimoItem,
  );
  const totalPaginas = Math.ceil(
    empreendimentosFiltrados.length / itensPorPagina,
  );

  const handlePaginaAnterior = () => {
    if (paginaAtual > 1) setPaginaAtual(paginaAtual - 1);
  };

  const handleProximaPagina = () => {
    if (paginaAtual < totalPaginas) setPaginaAtual(paginaAtual + 1);
  };

  // Resetar página quando filtrar
  useEffect(() => {
    setPaginaAtual(1);
  }, [searchTerm, filtroTipo, filtroCidade]);

  // =============== LISTA DE CIDADES PARA FILTRO ===============
  const cidades = [
    ...new Set(empreendimentos.map((emp) => emp.cidade).filter(Boolean)),
  ];

  // =============== UTILS ===============
  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case "edificio":
        return BuildingOfficeIcon;
      case "condominio":
        return HomeModernIcon;
      case "residencial":
        return HomeIcon;
      default:
        return BuildingOfficeIcon;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case "edificio":
        return "Edifício";
      case "condominio":
        return "Condomínio";
      case "residencial":
        return "Residencial";
      default:
        return tipo;
    }
  };

  const getTipoColors = (tipo) => {
    switch (tipo) {
      case "edificio":
        return isDark
          ? "bg-blue-900/30 text-blue-300 border border-blue-800"
          : "bg-blue-100 text-blue-800 border border-blue-300";
      case "condominio":
        return isDark
          ? "bg-green-900/30 text-green-300 border border-green-800"
          : "bg-green-100 text-green-800 border border-green-300";
      case "residencial":
        return isDark
          ? "bg-purple-900/30 text-purple-300 border border-purple-800"
          : "bg-purple-100 text-purple-800 border border-purple-300";
      default:
        return isDark
          ? "bg-gray-800 text-gray-300 border border-gray-700"
          : "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  const formatarArea = (area) => {
    if (!area) return "-";
    return `${area} m²`;
  };

  const formatarVagas = (vagas) => {
    if (!vagas) return "-";
    return `${vagas} vagas`;
  };

  const formatarData = (data) => {
    if (!data) return "-";
    return new Date(data).toLocaleDateString("pt-BR");
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${getBgClass()}`}
    >
      {/* HEADER FIXO */}
      <div
        className={`sticky top-0 z-10 border-b ${getBorderClass()} ${getCardBgClass()} shadow-sm`}
      >
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${getTextClass()}`}>
                Empreendimentos
              </h1>
              <p className={`text-sm ${getTextSecondaryClass()}`}>
                Gerencie todos os edifícios, condomínios e residenciais
                cadastrados
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate("/admin/cadastrar-empreendimento")}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Novo Empreendimento
            </Button>
          </div>
        </div>
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <div className="px-6 py-8">
        {/* BARRA DE FILTROS */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Busca */}
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <MagnifyingGlassIcon
                  className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <input
                  type="text"
                  placeholder="Buscar por nome, endereço, bairro, cidade ou construtora..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm transition-colors duration-200
                    ${getInputBgClass()}
                    ${getInputBorderClass()}
                    ${getInputTextClass()}
                    ${getPlaceholderClass()}
                  `}
                />
              </div>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Filtro por Tipo */}
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className={`
                  h-[42px] px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm
                  ${getInputBgClass()}
                  ${getInputBorderClass()}
                  ${getInputTextClass()}
                `}
              >
                <option value="">Todos os Tipos</option>
                <option value="edificio">Edifício</option>
                <option value="condominio">Condomínio</option>
                <option value="residencial">Residencial</option>
              </select>

              {/* Filtro por Cidade */}
              {cidades.length > 0 && (
                <select
                  value={filtroCidade}
                  onChange={(e) => setFiltroCidade(e.target.value)}
                  className={`
                    h-[42px] px-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D] shadow-sm text-sm
                    ${getInputBgClass()}
                    ${getInputBorderClass()}
                    ${getInputTextClass()}
                  `}
                >
                  <option value="">Todas as Cidades</option>
                  {cidades.map((cidade) => (
                    <option key={cidade} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
              )}

              {/* Botão Limpar Filtros */}
              {(searchTerm || filtroTipo || filtroCidade) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFiltroTipo("");
                    setFiltroCidade("");
                  }}
                  className={`
                    h-[42px] px-3 border rounded-lg transition-colors duration-200 text-sm font-medium
                    ${isDark ? "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600" : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"}
                  `}
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>

          {/* Contador de Resultados */}
          <div className="mt-4 flex items-center justify-between">
            <p className={`text-sm ${getTextSecondaryClass()}`}>
              Mostrando{" "}
              <span className={`font-semibold ${getTextClass()}`}>
                {empreendimentosFiltrados.length}
              </span>{" "}
              {empreendimentosFiltrados.length === 1
                ? "empreendimento"
                : "empreendimentos"}
            </p>

            {empreendimentosFiltrados.length > 0 && (
              <p className={`text-xs ${getTextSecondaryClass()}`}>
                Página {paginaAtual} de {totalPaginas}
              </p>
            )}
          </div>
        </div>

        {/* LISTA DE EMPREENDIMENTOS */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24D]"></div>
          </div>
        ) : empreendimentosFiltrados.length === 0 ? (
          <div
            className={`rounded-xl border p-12 ${getCardBgClass()} ${getBorderClass()} shadow-sm text-center`}
          >
            <div className="flex flex-col items-center">
              <BuildingOfficeIcon
                className={`w-16 h-16 mb-4 ${
                  isDark ? "text-gray-600" : "text-gray-400"
                }`}
              />
              <h3 className={`text-lg font-medium ${getTextClass()} mb-2`}>
                Nenhum empreendimento encontrado
              </h3>
              <p className={`text-sm ${getTextSecondaryClass()} mb-6 max-w-md`}>
                {empreendimentos.length === 0
                  ? "Você ainda não cadastrou nenhum empreendimento. Comece cadastrando seu primeiro edifício, condomínio ou residencial."
                  : "Nenhum empreendimento corresponde aos filtros aplicados."}
              </p>
              {empreendimentos.length === 0 && (
                <Button
                  variant="primary"
                  onClick={() => navigate("/admin/cadastrar-empreendimento")}
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Cadastrar Primeiro Empreendimento
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* GRID DE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {empreendimentosPaginados.map((empreendimento) => {
                const TipoIcon = getTipoIcon(empreendimento.tipo);
                const tipoColors = getTipoColors(empreendimento.tipo);

                return (
                  <div
                    key={empreendimento.id}
                    className={`
                      rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-lg
                      ${getCardBgClass()} ${getBorderClass()}
                    `}
                  >
                    {/* Cabeçalho do Card */}
                    <div className="p-5 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`
                              p-2 rounded-lg
                              ${empreendimento.tipo === "edificio" ? (isDark ? "bg-blue-900/50" : "bg-blue-100") : ""}
                              ${empreendimento.tipo === "condominio" ? (isDark ? "bg-green-900/50" : "bg-green-100") : ""}
                              ${empreendimento.tipo === "residencial" ? (isDark ? "bg-purple-900/50" : "bg-purple-100") : ""}
                            `}
                          >
                            <TipoIcon
                              className={`
                                w-6 h-6
                                ${empreendimento.tipo === "edificio" ? (isDark ? "text-blue-300" : "text-blue-600") : ""}
                                ${empreendimento.tipo === "condominio" ? (isDark ? "text-green-300" : "text-green-600") : ""}
                                ${empreendimento.tipo === "residencial" ? (isDark ? "text-purple-300" : "text-purple-600") : ""}
                              `}
                            />
                          </div>
                          <div>
                            <span
                              className={`text-xs ${getTextSecondaryClass()}`}
                            >
                              ID: {empreendimento.id}
                            </span>
                            <h3
                              className={`font-semibold text-lg ${getTextClass()}`}
                            >
                              {empreendimento.nome}
                            </h3>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${tipoColors}`}
                        >
                          {getTipoLabel(empreendimento.tipo)}
                        </span>
                      </div>
                    </div>

                    {/* Corpo do Card */}
                    <div className="p-5 space-y-4">
                      {/* Endereço */}
                      <div className="flex items-start space-x-2">
                        <MapPinIcon
                          className={`w-5 h-5 mt-0.5 ${getTextSecondaryClass()}`}
                        />
                        <div>
                          <p className={`text-sm ${getTextClass()}`}>
                            {empreendimento.endereco}
                            {empreendimento.numero &&
                              `, ${empreendimento.numero}`}
                          </p>
                          <p className={`text-xs ${getTextSecondaryClass()}`}>
                            {empreendimento.bairro &&
                              `${empreendimento.bairro} - `}
                            {empreendimento.cidade}/{empreendimento.estado}
                            {empreendimento.cep &&
                              ` - CEP: ${empreendimento.cep}`}
                          </p>
                        </div>
                      </div>

                      {/* Informações Específicas para Edifício */}
                      {empreendimento.tipo === "edificio" && (
                        <div className="space-y-3">
                          {/* Linha 1: Construtora e Ano de Lançamento */}
                          <div className="grid grid-cols-2 gap-3">
                            {empreendimento.construtora && (
                              <div className="flex items-center space-x-2">
                                <BuildingOffice2Icon
                                  className={`w-4 h-4 ${getTextSecondaryClass()}`}
                                />
                                <span className={`text-xs ${getTextClass()}`}>
                                  {empreendimento.construtora}
                                </span>
                              </div>
                            )}
                            {empreendimento.ano_lancamento && (
                              <div className="flex items-center space-x-2">
                                <CalendarIcon
                                  className={`w-4 h-4 ${getTextSecondaryClass()}`}
                                />
                                <span className={`text-xs ${getTextClass()}`}>
                                  Lançamento: {empreendimento.ano_lancamento}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Linha 2: Informações Técnicas */}
                          <div className="grid grid-cols-3 gap-2">
                            {empreendimento.ano_construcao && (
                              <div
                                className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"} text-center`}
                              >
                                <span
                                  className={`block text-xs ${getTextSecondaryClass()}`}
                                >
                                  Construção
                                </span>
                                <span
                                  className={`text-sm font-semibold ${getTextClass()}`}
                                >
                                  {empreendimento.ano_construcao}
                                </span>
                              </div>
                            )}
                            {empreendimento.numero_andares && (
                              <div
                                className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"} text-center`}
                              >
                                <span
                                  className={`block text-xs ${getTextSecondaryClass()}`}
                                >
                                  Andares
                                </span>
                                <span
                                  className={`text-sm font-semibold ${getTextClass()}`}
                                >
                                  {empreendimento.numero_andares}
                                </span>
                              </div>
                            )}
                            {empreendimento.total_unidades && (
                              <div
                                className={`p-2 rounded-lg ${isDark ? "bg-gray-700" : "bg-gray-100"} text-center`}
                              >
                                <span
                                  className={`block text-xs ${getTextSecondaryClass()}`}
                                >
                                  Unidades
                                </span>
                                <span
                                  className={`text-sm font-semibold ${getTextClass()}`}
                                >
                                  {empreendimento.total_unidades}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Linha 3: Área e Vagas */}
                          <div className="grid grid-cols-2 gap-3">
                            {empreendimento.area_terreno && (
                              <div className="flex items-center space-x-2">
                                <Squares2X2Icon
                                  className={`w-4 h-4 ${getTextSecondaryClass()}`}
                                />
                                <span className={`text-xs ${getTextClass()}`}>
                                  {formatarArea(empreendimento.area_terreno)}
                                </span>
                              </div>
                            )}
                            {empreendimento.vagas_garagem && (
                              <div className="flex items-center space-x-2">
                                <TruckIcon
                                  className={`w-4 h-4 ${getTextSecondaryClass()}`}
                                />
                                <span className={`text-xs ${getTextClass()}`}>
                                  {formatarVagas(empreendimento.vagas_garagem)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Informações para Condomínio/Residencial */}
                      {(empreendimento.tipo === "condominio" ||
                        empreendimento.tipo === "residencial") && (
                        <div
                          className={`p-3 rounded-lg ${isDark ? "bg-gray-700/50" : "bg-gray-50"} text-center`}
                        >
                          <p className={`text-xs ${getTextSecondaryClass()}`}>
                            {empreendimento.tipo === "condominio"
                              ? "🏠 Condomínio de casas - unidades serão cadastradas individualmente"
                              : "🏢 Residencial misto - unidades serão cadastradas individualmente"}
                          </p>
                        </div>
                      )}

                      {/* Data de Cadastro */}
                      <div className={`pt-3 border-t ${getBorderClass()}`}>
                        <p className={`text-xs ${getTextSecondaryClass()}`}>
                          Cadastrado em:{" "}
                          {formatarData(empreendimento.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Ações do Card */}
                    <div
                      className={`p-4 border-t ${getBorderClass()} flex justify-end space-x-2`}
                    >
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/empreendimentos/${empreendimento.id}`,
                          )
                        }
                        className={`
                          p-2 rounded-lg transition-all duration-200
                          ${isDark ? "hover:bg-gray-700 text-gray-400 hover:text-gray-200" : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"}
                        `}
                        title="Visualizar detalhes"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(
                            `/admin/empreendimentos/editar/${empreendimento.id}`,
                          )
                        }
                        className={`
                          p-2 rounded-lg transition-all duration-200
                          ${isDark ? "hover:bg-gray-700 text-blue-400" : "hover:bg-gray-100 text-blue-600"}
                        `}
                        title="Editar"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(empreendimento.id, empreendimento.nome)
                        }
                        className={`
                          p-2 rounded-lg transition-all duration-200
                          ${isDark ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-100 text-red-600"}
                        `}
                        title="Excluir"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PAGINAÇÃO */}
            {totalPaginas > 1 && (
              <div className="mt-8 flex items-center justify-center space-x-2">
                <button
                  onClick={handlePaginaAnterior}
                  disabled={paginaAtual === 1}
                  className={`
                    p-2 rounded-lg border transition-all duration-200
                    ${
                      paginaAtual === 1
                        ? isDark
                          ? "border-gray-700 text-gray-600 cursor-not-allowed"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                        : isDark
                          ? "border-gray-700 hover:bg-gray-700 text-gray-300"
                          : "border-gray-300 hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(
                  (numero) => (
                    <button
                      key={numero}
                      onClick={() => setPaginaAtual(numero)}
                      className={`
                      min-w-[40px] h-10 px-3 rounded-lg border transition-all duration-200 font-medium
                      ${
                        paginaAtual === numero
                          ? "bg-[#D4A24D] text-white border-[#D4A24D] hover:bg-[#C19137]"
                          : isDark
                            ? "border-gray-700 hover:bg-gray-700 text-gray-300"
                            : "border-gray-300 hover:bg-gray-100 text-gray-700"
                      }
                    `}
                    >
                      {numero}
                    </button>
                  ),
                )}

                <button
                  onClick={handleProximaPagina}
                  disabled={paginaAtual === totalPaginas}
                  className={`
                    p-2 rounded-lg border transition-all duration-200
                    ${
                      paginaAtual === totalPaginas
                        ? isDark
                          ? "border-gray-700 text-gray-600 cursor-not-allowed"
                          : "border-gray-200 text-gray-400 cursor-not-allowed"
                        : isDark
                          ? "border-gray-700 hover:bg-gray-700 text-gray-300"
                          : "border-gray-300 hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListaEmpreendimentos;
