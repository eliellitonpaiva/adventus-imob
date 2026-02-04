import React from "react";
import { FaPhone, FaWhatsapp, FaCalendarAlt } from "react-icons/fa";

const CTAPageDetalhe = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 p-8 md:p-12 text-center border border-white/10 shadow-2xl">
        {/* Efeitos de fundo */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400/50 to-transparent"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/20 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-blue-600/20 rounded-full mix-blend-screen filter blur-3xl opacity-30"></div>

        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-amber-300 via-white to-blue-400 bg-clip-text text-transparent">
            Interessado neste imóvel?
          </h2>

          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Entre em contato agora mesmo e agende uma visita com nossa equipe
            especializada!
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-6">
            <button className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-full font-bold text-lg flex items-center justify-center space-x-3 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg">
              <FaPhone />
              <span>Falar com Corretor</span>
            </button>

            <button className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-full font-bold text-lg flex items-center justify-center space-x-3 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg">
              <FaWhatsapp />
              <span>WhatsApp</span>
            </button>

            <button className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-400 text-white rounded-full font-bold text-lg flex items-center justify-center space-x-3 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-lg">
              <FaCalendarAlt />
              <span>Agendar Visita</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTAPageDetalhe;
