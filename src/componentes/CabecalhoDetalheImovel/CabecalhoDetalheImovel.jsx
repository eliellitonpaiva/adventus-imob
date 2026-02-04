import React from "react";
import {
  FaStar,
  FaBed,
  FaBath,
  FaCar,
  FaRuler,
  FaMapMarkerAlt,
} from "react-icons/fa";

const CabecalhoDetalheImovel = () => {
  return (
    <div className="bg-gradient-to-r from-amber-500 to-amber-400 text-white py-8 md:py-12 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Badge de Exclusivo */}
        <div className="inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-500 text-white px-4 py-2 rounded-full text-sm font-bold mb-4 animate-pulse shadow-lg">
          <FaStar className="mr-2" />
          EXCLUSIVO STELA IMÓVEIS
        </div>

        {/* Título do Imóvel */}
        <h1 className="text-2xl md:text-3xl font-bold mb-4">
          Casa 3 Quartos com Suíte - Centro
        </h1>

        {/* Preço em Destaque */}
        <div className="inline-block bg-gradient-to-br from-gray-800 via-black to-gray-900 text-white px-6 py-3 rounded-full text-xl md:text-2xl font-black mb-6 shadow-2xl border border-white/10 hover:-translate-y-1 transition-transform duration-300 animate-glow">
          R$ 280.000
        </div>

        {/* Características Principais */}
        <div className="flex flex-wrap gap-6 md:gap-8 mb-6">
          <div className="flex items-center space-x-2">
            <FaBed className="text-amber-200" />
            <span>
              <strong>3</strong> Quartos
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaBath className="text-amber-200" />
            <span>
              <strong>2</strong> Banheiros (1 suíte)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaCar className="text-amber-200" />
            <span>
              <strong>2</strong> Vagas
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <FaRuler className="text-amber-200" />
            <span>
              <strong>120 m²</strong> Área total
            </span>
          </div>
        </div>

        {/* Localização */}
        <div className="flex items-center space-x-2">
          <FaMapMarkerAlt className="text-amber-200" />
          <span>
            <strong>Centro, Açailândia - MA</strong> - Próximo ao Mercado
            Municipal
          </span>
        </div>
      </div>
    </div>
  );
};

export default CabecalhoDetalheImovel;
