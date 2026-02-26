import React, { useEffect, useRef } from "react";
import { Home, TrendingUp, Handshake } from "lucide-react";

const IndicadoresPublicos = () => {
  const sectionRef = useRef(null);
  const numberRefs = [useRef(null), useRef(null), useRef(null)];

  const animateNumber = (element, target, duration = 1800) => {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start);
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateCounter);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            numberRefs.forEach((ref) => {
              const target = parseInt(ref.current.dataset.count);
              animateNumber(ref.current, target);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-[#0f172a] via-[#111827] to-black overflow-hidden"
    >
      {/* Glow de fundo sutil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D4A24D]/5 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">
        {/* Apenas título principal - subtítulo removido */}
        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16">
          Resultados que
          <span className="block md:inline md:ml-2 text-[#D4A24D]">
            Falam por Si
          </span>
        </h2>

        {/* Grid com os 3 indicadores - ajustado 4px para cima */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-0 -mt-1">
          <Indicator
            icon={<Home className="w-7 h-7 text-[#D4A24D]" strokeWidth={1.5} />}
            numberRef={numberRefs[0]}
            count="12"
            text="imóveis vendidos"
            subtext="nos últimos 30 dias"
            showDivider={false}
          />

          <Indicator
            icon={
              <TrendingUp
                className="w-7 h-7 text-[#D4A24D]"
                strokeWidth={1.5}
              />
            }
            numberRef={numberRefs[1]}
            count="38"
            text="imóveis comercializados"
            subtext="em 2025"
            showDivider
          />

          <Indicator
            icon={
              <Handshake className="w-7 h-7 text-[#D4A24D]" strokeWidth={1.5} />
            }
            numberRef={numberRefs[2]}
            count="27"
            text="negociações"
            subtext="em andamento"
            showDivider
          />
        </div>
      </div>
    </section>
  );
};

const Indicator = ({ icon, numberRef, count, text, subtext, showDivider }) => {
  return (
    <div className="relative text-center py-4 md:py-12 px-4 md:px-6">
      {/* Divisória Desktop */}
      {showDivider && (
        <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 h-32 w-px bg-gradient-to-b from-transparent via-white/15 to-transparent" />
      )}

      {/* Ícone */}
      <div className="flex justify-center mb-4 md:mb-6">
        <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          {icon}
        </div>
      </div>

      {/* Número - peso semi-bold e espaçamento entre letras */}
      <div
        ref={numberRef}
        data-count={count}
        className="text-5xl md:text-6xl font-semibold text-white tracking-wide"
      >
        0
      </div>

      {/* Linha decorativa */}
      <div className="mt-4 h-px w-16 mx-auto bg-gradient-to-r from-transparent via-[#D4A24D] to-transparent opacity-50" />

      {/* Texto em duas linhas - mais juntas */}
      <div className="mt-3 text-white/60 text-base max-w-xs mx-auto leading-tight">
        <div>{text}</div>
        <div className="text-white/40 text-sm mt-0.5">{subtext}</div>
      </div>
    </div>
  );
};

export default IndicadoresPublicos;
