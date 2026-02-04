import React from "react";

const NossosNumeros = () => {
  return (
    <section className="py-16 md:py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Título Principal - EXATAMENTE IGUAL AO ORIGINAL */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-12 md:mb-16 relative">
          Nossa história em{" "}
          <span className="bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent">
            números
          </span>
          <span className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-1.5 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-full"></span>
        </h2>

        {/* Grid de 3 colunas - ESPAÇAMENTO IDÊNTICO AO ORIGINAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Item 1: Anos de Atuação */}
          <div className="text-center p-6 md:p-8 relative">
            {/* Ícone - EXATAMENTE IGUAL AO ORIGINAL */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-[#d97706]/20 hover:scale-105 transition-transform duration-300">
              <i className="fas fa-house text-2xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
            </div>

            {/* Número */}
            <p className="text-5xl md:text-6xl font-bold text-[#f59e0b] mb-3">
              10
            </p>

            {/* Título */}
            <p className="text-lg md:text-xl font-semibold text-gray-800 mb-2 uppercase">
              ANOS DE ATUAÇÃO
            </p>

            {/* Subtítulo */}
            <p className="text-sm text-gray-600">no mercado imobiliário</p>

            {/* Linha Divisória APENAS DESKTOP - Primeiro item */}
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-[#d97706]/30 to-transparent"></div>
          </div>

          {/* Item 2: Sonhos da Casa Própria */}
          <div className="text-center p-6 md:p-8 relative">
            {/* Ícone */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-[#d97706]/20 hover:scale-105 transition-transform duration-300">
              <i className="fas fa-users text-2xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
            </div>

            {/* Número */}
            <p className="text-5xl md:text-6xl font-bold text-[#f59e0b] mb-3">
              +300
            </p>

            {/* Título */}
            <p className="text-lg md:text-xl font-semibold text-gray-800 mb-2 uppercase">
              SONHOS DA CASA PRÓPRIA
            </p>

            {/* Subtítulo */}
            <p className="text-sm text-gray-600">foram realizados</p>

            {/* Linha Divisória APENAS DESKTOP - Segundo item */}
            <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-16 w-px bg-gradient-to-b from-transparent via-[#d97706]/30 to-transparent"></div>

            {/* REMOVIDO: Linha Divisória Mobile */}
          </div>

          {/* Item 3: Processos de Financiamento */}
          <div className="text-center p-6 md:p-8">
            {/* Ícone */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-[#d97706]/20 hover:scale-105 transition-transform duration-300">
              <i className="fas fa-money-bill-wave text-2xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
            </div>

            {/* Número */}
            <p className="text-5xl md:text-6xl font-bold text-[#f59e0b] mb-3">
              +200
            </p>

            {/* Título */}
            <p className="text-lg md:text-xl font-semibold text-gray-800 mb-2 uppercase">
              PROCESSOS DE FINANCIAMENTO
            </p>

            {/* Subtítulo */}
            <p className="text-sm text-gray-600">realizados com sucesso</p>

            {/* REMOVIDO: Linha Divisória Mobile */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NossosNumeros;
