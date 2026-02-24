import React from "react";

const ServicosAdventus = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] relative overflow-hidden">
      {/* Efeitos de Fundo - IDÊNTICOS AO ORIGINAL */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.05) 0%, transparent 50%)
            `,
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Cabeçalho - TÍTULO COM INICIAL MAIÚSCULA + SEO LOCAL + SUBTÍTULO UMA LINHA */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white relative inline-block">
            <span className="bg-gradient-to-r from-white via-[#fbbf24] to-white bg-clip-text text-transparent">
              Soluções imobiliárias em Açailândia
            </span>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-full"></span>
          </h2>

          <p className="text-[15px] md:text-[17px] text-white/70 max-w-2xl mx-auto">
            Estratégia, segurança e resultados para comprar, locar, vender ou
            investir na região.
          </p>
        </div>

        {/* Grid de Serviços - ALTURA UNIFORME PARA TODOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Card 1: Comprar com Assessoria */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: compra de imóvel com assessoria em Açailândia."
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline h-full"
          >
            <div className="service-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-[#f59e0b]/30 hover:shadow-2xl hover:shadow-black/40 h-full flex flex-col min-h-[420px]">
              {/* Linha Superior Sutil */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent"></div>

              {/* Container do Ícone - REFINADO */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-[#f59e0b]/10 to-[#fbbf24]/5 border border-[#f59e0b]/15 group-hover:scale-105 transition-all duration-400">
                <i className="fas fa-home text-2xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
              </div>

              {/* Título */}
              <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
                <span className="bg-gradient-to-r from-white to-[#fbbf24] bg-clip-text text-transparent">
                  Comprar com Assessoria
                </span>
              </h3>

              {/* Texto - ATUALIZADO */}
              <p className="text-white/70 text-center mb-8 text-sm md:text-base flex-grow">
                Da busca à assinatura. Cuidamos da negociação, documentação e
                orientação financeira com segurança e estratégia.
              </p>

              {/* CTA - ATUALIZADO */}
              <div className="flex justify-center mt-auto">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/5 text-[#fbbf24] font-semibold text-sm group-hover:bg-[#fbbf24]/10 group-hover:border-[#fbbf24]/50 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
                  <span>Falar com especialista</span>
                  <i className="fab fa-whatsapp text-sm"></i>
                </div>
              </div>
            </div>
          </a>

          {/* Card 2: Gestão de Locação */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: gestão de locação em Açailândia."
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline h-full"
          >
            <div className="service-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-[#f59e0b]/30 hover:shadow-2xl hover:shadow-black/40 h-full flex flex-col min-h-[420px]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent"></div>

              {/* Container do Ícone - REFINADO */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-[#f59e0b]/10 to-[#fbbf24]/5 border border-[#f59e0b]/15 group-hover:scale-105 transition-all duration-400">
                <i className="fas fa-key text-2xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
              </div>

              {/* Título */}
              <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
                <span className="bg-gradient-to-r from-white to-[#fbbf24] bg-clip-text text-transparent">
                  Gestão de Locação
                </span>
              </h3>

              {/* Texto - ATUALIZADO */}
              <p className="text-white/70 text-center mb-8 text-sm md:text-base flex-grow">
                Seleção criteriosa, contratos seguros e acompanhamento completo
                durante toda a locação.
              </p>

              {/* CTA - ATUALIZADO */}
              <div className="flex justify-center mt-auto">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/5 text-[#fbbf24] font-semibold text-sm group-hover:bg-[#fbbf24]/10 group-hover:border-[#fbbf24]/50 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
                  <span>Falar com especialista</span>
                  <i className="fab fa-whatsapp text-sm"></i>
                </div>
              </div>
            </div>
          </a>

          {/* Card 3: Avaliação e Estratégia de Venda - DESTAQUE PERMANENTE */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: avaliação e estratégia de venda em Açailândia."
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline h-full"
          >
            <div className="service-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-[#f59e0b]/60 rounded-2xl p-8 relative overflow-hidden transition-all duration-400 -translate-y-2 hover:-translate-y-3 hover:border-[#f59e0b]/80 hover:shadow-2xl hover:shadow-[#f59e0b]/20 h-full flex flex-col min-h-[420px]">
              {/* Linha Superior DESTACADA */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f59e0b] via-[#fbbf24] via-[#f59e0b] to-transparent"></div>

              {/* Container do Ícone DESTACADO - REFINADO */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-[#f59e0b]/20 to-[#fbbf24]/10 border-2 border-[#f59e0b]/50 scale-110 group-hover:scale-115 transition-all duration-400">
                <i className="fas fa-chart-line text-2xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
              </div>

              {/* Título DESTACADO */}
              <h3 className="text-xl md:text-2xl font-extrabold text-white text-center mb-4">
                <span className="bg-gradient-to-r from-white via-[#f59e0b] via-[#fbbf24] to-white bg-clip-text text-transparent">
                  Avaliação e Estratégia de Venda
                </span>
              </h3>

              {/* Texto DESTACADO - ATUALIZADO */}
              <p className="text-white/90 text-center mb-8 text-sm md:text-base font-medium flex-grow">
                Precificação inteligente, posicionamento estratégico e marketing
                direcionado para máxima valorização.
              </p>

              {/* CTA DESTACADO - ATUALIZADO */}
              <div className="flex justify-center mt-auto">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#fbbf24]/70 bg-[#fbbf24]/20 text-[#fef08a] font-bold text-sm -translate-y-1 group-hover:-translate-y-2 group-hover:bg-[#fbbf24]/30 group-hover:border-[#fbbf24]/90 group-hover:shadow-lg group-hover:shadow-[#f59e0b]/30 transition-all duration-300 whitespace-nowrap">
                  <span>Falar com especialista</span>
                  <i className="fab fa-whatsapp text-sm"></i>
                </div>
              </div>
            </div>
          </a>

          {/* Card 4: Consultoria Imobiliária */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: consultoria imobiliária em Açailândia."
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline h-full"
          >
            <div className="service-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-[#f59e0b]/30 hover:shadow-2xl hover:shadow-black/40 h-full flex flex-col min-h-[420px]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent"></div>

              {/* Container do Ícone - REFINADO */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-[#f59e0b]/10 to-[#fbbf24]/5 border border-[#f59e0b]/15 group-hover:scale-105 transition-all duration-400">
                <i className="fas fa-bullseye text-2xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
              </div>

              {/* Título */}
              <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
                <span className="bg-gradient-to-r from-white to-[#fbbf24] bg-clip-text text-transparent">
                  Consultoria Imobiliária
                </span>
              </h3>

              {/* Texto - ATUALIZADO */}
              <p className="text-white/70 text-center mb-8 text-sm md:text-base flex-grow">
                Inteligência de mercado e planejamento patrimonial para decisões
                sólidas e rentáveis.
              </p>

              {/* CTA - ATUALIZADO */}
              <div className="flex justify-center mt-auto">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/5 text-[#fbbf24] font-semibold text-sm group-hover:bg-[#fbbf24]/10 group-hover:border-[#fbbf24]/50 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
                  <span>Falar com especialista</span>
                  <i className="fab fa-whatsapp text-sm"></i>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      {/* CSS para efeitos específicos */}
      <style>{`
        .service-card {
          position: relative;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .service-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.03),
            transparent
          );
          transition: left 0.6s ease;
        }

        .service-card:hover::after {
          left: 100%;
        }

        /* Efeito de brilho nos cards normais */
        .service-card:not(:nth-child(3)):hover {
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(245, 158, 11, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        /* Efeito de brilho no card destacado */
        .service-card:nth-child(3) {
          box-shadow:
            0 25px 50px rgba(0, 0, 0, 0.3),
            0 0 0 2px rgba(245, 158, 11, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .service-card:nth-child(3):hover {
          box-shadow:
            0 30px 60px rgba(0, 0, 0, 0.35),
            0 0 0 3px rgba(245, 158, 11, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </section>
  );
};

export default ServicosAdventus;
