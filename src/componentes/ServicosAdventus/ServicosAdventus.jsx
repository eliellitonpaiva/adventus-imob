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
        {/* Cabeçalho - EXATAMENTE IGUAL AO ORIGINAL */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 text-white relative inline-block">
            <span className="bg-gradient-to-r from-white via-[#fbbf24] to-white bg-clip-text text-transparent">
              NOSSOS SERVIÇOS
            </span>
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] rounded-full"></span>
          </h2>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
            Soluções completas e personalizadas para todas as suas necessidades
            imobiliárias. Com a Adventus, você tem mais que um serviço, tem uma
            parceria estratégica.
          </p>
        </div>

        {/* Grid de Serviços - ALTURA UNIFORME PARA TODOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Card 1: Alugar - MESMA ALTURA QUE COMPRAR */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: aluguel de imóvel."
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline h-full"
          >
            <div className="service-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-[#f59e0b]/30 hover:shadow-2xl hover:shadow-black/40 h-full flex flex-col min-h-[420px]">
              {/* Linha Superior Sutil */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent"></div>

              {/* Container do Ícone */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-[#f59e0b]/10 to-[#fbbf24]/5 border border-[#f59e0b]/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400">
                <i className="fas fa-key text-3xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
              </div>

              {/* Título */}
              <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
                <span className="bg-gradient-to-r from-white to-[#fbbf24] bg-clip-text text-transparent">
                  Alugar
                </span>
              </h3>

              {/* Texto - ALTURA FIXA */}
              <p className="text-white/70 text-center mb-8 text-sm md:text-base flex-grow">
                Encontre o imóvel perfeito para morar agora. Avaliação
                criteriosa, contrato seguro e todo suporte durante a locação.
              </p>

              {/* CTA - CHAMA NO WHATSAPP (SEM QUEBRAR) */}
              <div className="flex justify-center mt-auto">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/5 text-[#fbbf24] font-semibold text-sm group-hover:bg-[#fbbf24]/10 group-hover:border-[#fbbf24]/50 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
                  <span>Chama no WhatsApp</span>
                  <i className="fab fa-whatsapp text-sm"></i>
                </div>
              </div>
            </div>
          </a>

          {/* Card 2: Comprar - ALTURA REFERÊNCIA */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: compra de imóvel."
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline h-full"
          >
            <div className="service-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-[#f59e0b]/30 hover:shadow-2xl hover:shadow-black/40 h-full flex flex-col min-h-[420px]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent"></div>

              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-[#f59e0b]/10 to-[#fbbf24]/5 border border-[#f59e0b]/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400">
                <i className="fas fa-home text-3xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
                <span className="bg-gradient-to-r from-white to-[#fbbf24] bg-clip-text text-transparent">
                  Comprar
                </span>
              </h3>

              <p className="text-white/70 text-center mb-8 text-sm md:text-base flex-grow">
                Realize o sonho da casa própria com assessoria completa: busca,
                negociação, documentação e financiamento.
              </p>

              {/* CTA - CHAMA NO WHATSAPP (SEM QUEBRAR) */}
              <div className="flex justify-center mt-auto">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/5 text-[#fbbf24] font-semibold text-sm group-hover:bg-[#fbbf24]/10 group-hover:border-[#fbbf24]/50 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
                  <span>Chama no WhatsApp</span>
                  <i className="fab fa-whatsapp text-sm"></i>
                </div>
              </div>
            </div>
          </a>

          {/* Card 3: ANUNCIAR - COM DESTAQUE PERMANENTE E MESMA ALTURA */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: anunciar meu imóvel."
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline h-full"
          >
            <div className="service-card bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border-2 border-[#f59e0b]/60 rounded-2xl p-8 relative overflow-hidden transition-all duration-400 -translate-y-2 hover:-translate-y-3 hover:border-[#f59e0b]/80 hover:shadow-2xl hover:shadow-[#f59e0b]/20 h-full flex flex-col min-h-[420px]">
              {/* Linha Superior DESTACADA */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#f59e0b] via-[#fbbf24] via-[#f59e0b] to-transparent"></div>

              {/* Container do Ícone DESTACADO */}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-[#f59e0b]/20 to-[#fbbf24]/10 border-2 border-[#f59e0b]/50 scale-110 rotate-3 group-hover:scale-115 group-hover:rotate-6 transition-all duration-400">
                <i className="fas fa-bullhorn text-3xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
              </div>

              {/* Título DESTACADO */}
              <h3 className="text-xl md:text-2xl font-extrabold text-white text-center mb-4">
                <span className="bg-gradient-to-r from-white via-[#f59e0b] via-[#fbbf24] to-white bg-clip-text text-transparent">
                  Anunciar
                </span>
              </h3>

              {/* Texto DESTACADO */}
              <p className="text-white/90 text-center mb-8 text-sm md:text-base font-medium flex-grow">
                Venda ou alugue seu imóvel com máxima visibilidade. Avaliação
                profissional, marketing estratégico e negociação especializada.
              </p>

              {/* CTA DESTACADO - CHAMA NO WHATSAPP (SEM QUEBRAR) */}
              <div className="flex justify-center mt-auto">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#fbbf24]/70 bg-[#fbbf24]/20 text-[#fef08a] font-bold text-sm -translate-y-1 group-hover:-translate-y-2 group-hover:bg-[#fbbf24]/30 group-hover:border-[#fbbf24]/90 group-hover:shadow-lg group-hover:shadow-[#f59e0b]/30 transition-all duration-300 whitespace-nowrap">
                  <span>Chama no WhatsApp</span>
                  <i className="fab fa-whatsapp text-sm"></i>
                </div>
              </div>
            </div>
          </a>

          {/* Card 4: Consultoria - MESMA ALTURA QUE COMPRAR */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: orientação imobiliária."
            target="_blank"
            rel="noopener noreferrer"
            className="group block no-underline h-full"
          >
            <div className="service-card bg-gradient-to-br from-white/5 to-white/2 backdrop-blur-sm border border-white/10 rounded-2xl p-8 relative overflow-hidden transition-all duration-400 hover:-translate-y-2 hover:border-[#f59e0b]/30 hover:shadow-2xl hover:shadow-black/40 h-full flex flex-col min-h-[420px]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#f59e0b]/30 to-transparent"></div>

              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-gradient-to-br from-[#f59e0b]/10 to-[#fbbf24]/5 border border-[#f59e0b]/15 group-hover:scale-110 group-hover:rotate-3 transition-all duration-400">
                <i className="fas fa-chart-line text-3xl bg-gradient-to-r from-[#f59e0b] to-[#fbbf24] bg-clip-text text-transparent"></i>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-white text-center mb-4">
                <span className="bg-gradient-to-r from-white to-[#fbbf24] bg-clip-text text-transparent">
                  Consultoria Estratégica
                </span>
              </h3>

              <p className="text-white/70 text-center mb-8 text-sm md:text-base flex-grow">
                Análise de mercado, planejamento de investimentos e assessoria
                jurídica. Tome decisões imobiliárias com confiança e dados
                reais.
              </p>

              {/* CTA - CHAMA NO WHATSAPP (SEM QUEBRAR) */}
              <div className="flex justify-center mt-auto">
                <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/5 text-[#fbbf24] font-semibold text-sm group-hover:bg-[#fbbf24]/10 group-hover:border-[#fbbf24]/50 group-hover:-translate-y-1 transition-all duration-300 whitespace-nowrap">
                  <span>Chama no WhatsApp</span>
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
