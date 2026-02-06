import React, { useState } from "react";
import {
  PlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  StarIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Button from "../../componentes/ui/Button";
import Input from "../../componentes/ui/Input";
import { useNavigate } from "react-router-dom"; // ADICIONE ESTE IMPORT

const Corretores = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // ADICIONE ESTA LINHA

  const corretores = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao@imob.com",
      telefone: "(11) 99999-9999",
      status: "Ativo",
      imoveis: 12,
      rating: 4.8,
      creci: "123456-MA",
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@imob.com",
      telefone: "(11) 98888-8888",
      status: "Ativo",
      imoveis: 8,
      rating: 4.9,
      creci: "654321-MA",
    },
    {
      id: 3,
      nome: "Carlos Oliveira",
      email: "carlos@imob.com",
      telefone: "(11) 97777-7777",
      status: "Férias",
      imoveis: 5,
      rating: 4.5,
      creci: "789012-MA",
    },
    {
      id: 4,
      nome: "Ana Pereira",
      email: "ana@imob.com",
      telefone: "(11) 96666-6666",
      status: "Ativo",
      imoveis: 15,
      rating: 4.7,
      creci: "345678-MA",
    },
    {
      id: 5,
      nome: "Pedro Costa",
      email: "pedro@imob.com",
      telefone: "(11) 95555-5555",
      status: "Inativo",
      imoveis: 0,
      rating: 4.2,
      creci: "901234-MA",
    },
  ];

  const statusColors = {
    Ativo: "bg-green-100 text-green-800",
    Inativo: "bg-red-100 text-red-800",
    Férias: "bg-yellow-100 text-yellow-800",
  };

  const handleDelete = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este corretor?")) {
      console.log("Excluir corretor:", id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Corretores</h1>
          <p className="text-gray-600 mt-2">Gerencie a equipe de corretores</p>
        </div>

        {/* BOTÕES LADO A LADO - ATUALIZADOS */}
        <div className="flex space-x-3 mt-4 sm:mt-0">
          {/* BOTÃO "VER CANDIDATOS" - VERDE E CORRIGIDO */}
          <Button
            variant="primary"
            onClick={() => navigate("/admin/candidatos")} // ← CORRIGIDO AQUI
          >
            <UserIcon className="w-5 h-5 mr-2" />
            Ver Candidatos
          </Button>

          {/* BOTÃO "NOVO CORRETOR" - MANTIDO */}
          <Button
            variant="outline"
            onClick={() => navigate("/admin/corretores/novo")} // ← TAMBÉM CORRIGIDO
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Novo Corretor
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <Input
              placeholder="Buscar por nome, email ou CRECI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3">
            <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A24D]/30 focus:border-[#D4A24D]">
              <option value="">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="ferias">Férias</option>
            </select>
            <Button variant="outline">Exportar Lista</Button>
          </div>
        </div>
      </div>

      {/* Corretores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {corretores.map((corretor) => (
          <div
            key={corretor.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {corretor.nome}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium mt-2 inline-block ${statusColors[corretor.status]}`}
                  >
                    {corretor.status}
                  </span>
                </div>
                <div className="flex items-center bg-[#D4A24D]/10 text-[#D4A24D] px-3 py-1 rounded-lg">
                  <StarIcon className="w-4 h-4 mr-1" />
                  <span className="font-semibold">{corretor.rating}</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="truncate">{corretor.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span>{corretor.telefone}</span>
                </div>
                <div className="text-sm text-gray-500">
                  CRECI: {corretor.creci}
                </div>
              </div>

              {/* Stats - MODIFICADO COM DIVISÓRIA */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  {/* IMÓVEIS */}
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700">
                      {corretor.imoveis}
                    </div>
                    <div className="text-sm text-gray-500">Imóveis</div>
                  </div>

                  {/* DIVISÓRIA VERTICAL */}
                  <div className="h-12 w-px bg-gray-200"></div>

                  {/* VENDAS */}
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700">
                      R$ 2.5M
                    </div>
                    <div className="text-sm text-gray-500">Vendas (mês)</div>
                  </div>

                  {/* DIVISÓRIA VERTICAL */}
                  <div className="h-12 w-px bg-gray-200"></div>

                  {/* LEADS */}
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-700">
                      15
                    </div>
                    <div className="text-sm text-gray-500">Leads</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() =>
                  navigate(`/admin/corretores/editar/${corretor.id}`)
                } // ← CORRIGIDO
                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                title="Editar"
              >
                <PencilIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(corretor.id)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Excluir"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/corretores/${corretor.id}`)} // ← CORRIGIDO
              >
                Ver Perfil
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Summary */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Desempenho da Equipe
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600">3</div>
            <div className="text-sm text-blue-800 mt-1">Corretores Ativos</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-600">156</div>
            <div className="text-sm text-green-800 mt-1">Imóveis Ativos</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-3xl font-bold text-purple-600">89</div>
            <div className="text-sm text-purple-800 mt-1">Leads/Mês</div>
          </div>
          <div className="text-center p-4 bg-[#D4A24D]/10 rounded-lg">
            <div className="text-3xl font-bold text-[#D4A24D]">R$ 5.2M</div>
            <div className="text-sm text-[#c1923e] mt-1">Vendas (mês)</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Corretores;
