import React, { useState } from "react";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import Input from "../../componentes/ui/Input";

const Imoveis = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const imoveis = [
    {
      id: 1,
      codigo: "APT-001",
      tipo: "Apartamento",
      endereco: "Av. Paulista, 1000",
      bairro: "Bela Vista",
      cidade: "São Paulo",
      status: "Disponível",
      preco: "R$ 850.000",
      area: "85m²",
      quartos: 3,
      banheiros: 2,
    },
    {
      id: 2,
      codigo: "CS-002",
      tipo: "Casa",
      endereco: "Rua das Flores, 123",
      bairro: "Jardins",
      cidade: "São Paulo",
      status: "Vendido",
      preco: "R$ 1.200.000",
      area: "150m²",
      quartos: 4,
      banheiros: 3,
    },
    {
      id: 3,
      codigo: "APT-003",
      tipo: "Apartamento",
      endereco: "Rua Augusta, 500",
      bairro: "Consolação",
      cidade: "São Paulo",
      status: "Alugado",
      preco: "R$ 3.500/mês",
      area: "65m²",
      quartos: 2,
      banheiros: 1,
    },
  ];

  const statusColors = {
    Disponível: "bg-green-100 text-green-800",
    Vendido: "bg-blue-100 text-blue-800",
    Alugado: "bg-yellow-100 text-yellow-800",
  };

  const tipoColors = {
    Apartamento: "bg-blue-50 text-blue-700",
    Casa: "bg-green-50 text-green-700",
    Terreno: "bg-amber-50 text-amber-700",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Imóveis</h1>
          <p className="text-gray-600 mt-2">
            Gerencie todos os imóveis cadastrados
          </p>
        </div>
        <Button variant="primary" className="mt-4 sm:mt-0">
          <PlusIcon className="w-5 h-5 mr-2" />
          Novo Imóvel
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por código, endereço, bairro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]">
              <option value="">Todos os Tipos</option>
              <option value="apartamento">Apartamento</option>
              <option value="casa">Casa</option>
              <option value="terreno">Terreno</option>
            </select>
            <Button variant="ghost">
              <FunnelIcon className="w-5 h-5 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Endereço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {imoveis.map((imovel) => (
                <tr
                  key={imovel.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                        <BuildingOfficeIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <span className="font-medium text-gray-900">
                        {imovel.codigo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${tipoColors[imovel.tipo] || "bg-gray-100 text-gray-800"}`}
                    >
                      {imovel.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-gray-900">{imovel.endereco}</div>
                      <div className="text-sm text-gray-500">
                        <MapPinIcon className="w-4 h-4 inline-block mr-1" />
                        {imovel.bairro}, {imovel.cidade}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[imovel.status]}`}
                    >
                      {imovel.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900">
                      {imovel.preco}
                    </div>
                    <div className="text-sm text-gray-500">
                      {imovel.area} • {imovel.quartos} quartos
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1.5 text-gray-400 hover:text-[#D4A24D] transition-colors"
                        title="Visualizar"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Editar"
                      >
                        <PencilIcon className="w-5 h-5" />
                      </button>
                      <button
                        className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                        title="Excluir"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Imoveis;
