import React, { useEffect, useRef } from "react";

const Indicadores = () => {
  const sectionRef = useRef(null);
  const numberRefs = [useRef(null), useRef(null), useRef(null)];

  // Função para animar números (contagem)
  const animateNumber = (element, target, duration = 1800) => {
    if (!element) return;

    const start = 0;
    const increment = target > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / target));

    let current = start;
    const elementRef = element;

    const timer = setInterval(() => {
      current += increment;
      elementRef.textContent = current;

      if (
        (increment > 0 && current >= target) ||
        (increment < 0 && current <= target)
      ) {
        elementRef.textContent = target;
        clearInterval(timer);
      }
    }, stepTime);
  };

  // Função para ativar efeito de luz DENTRO da elipse
  const activateInnerGlow = (ellipse) => {
    if (!ellipse) return;

    // Seleciona o elemento de luz DENTRO da elipse
    const glowElement = ellipse.querySelector(".inner-glow");
    if (!glowElement) return;

    // Reinicia a animação
    glowElement.style.animation = "none";

    // Força reflow
    void glowElement.offsetWidth;

    // Aplica a animação
    glowElement.style.animation = "innerGlow 1.5s ease-out forwards";
  };

  // Animação sequencial dos indicadores
  const animatePerformanceNumbers = () => {
    // Animar números
    numberRefs.forEach((ref, index) => {
      if (ref.current) {
        const target = parseInt(ref.current.getAttribute("data-count"));
        animateNumber(ref.current, target);
      }
    });

    // Animação de luz DENTRO das elipses com delay
    const ellipses = document.querySelectorAll(".performance-number-bg");
    ellipses.forEach((ellipse, index) => {
      setTimeout(() => {
        activateInnerGlow(ellipse);
      }, index * 400);
    });
  };

  // Intersection Observer para ativar animações
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(animatePerformanceNumbers, 300);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="performance-indicators pt-16 pb-20 bg-[#31353E] relative overflow-hidden fade-in"
    >
      {/* 🔹 LINHA HORIZONTAL DISCRETA - NO TOPO DA SEÇÃO */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

      {/* Efeitos de fundo */}
      <div className="absolute inset-0">
        <div
          className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.03) 0%, transparent 50%), radial-gradient(circle at 90% 100%, rgba(245, 158, 11, 0.02) 0%, transparent 40%)",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Grid dos indicadores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 items-center">
          {/* Indicador 1 */}
          <div className="performance-item text-center p-8 relative">
            {/* Container do número com elipse */}
            <div className="performance-number-container inline-block w-[140px] h-[140px] relative mb-8">
              {/* Elipse com pulso */}
              <div
                className="performance-number-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-[100px] h-[100px] bg-white/5 backdrop-blur-sm rounded-full 
                         border border-white/10 pointer-events-none overflow-hidden"
                style={{
                  animation: "ellipsePulse 3s ease-in-out infinite",
                }}
              >
                {/* LUZ DENTRO DA ELIPSE */}
                <div
                  className="inner-glow absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 30%, rgba(251, 191, 36, 0) 40%, rgba(251, 191, 36, 0.6) 50%, rgba(251, 191, 36, 0) 60%, transparent 70%)",
                    backgroundSize: "200% 200%",
                    backgroundPosition: "-100% -100%",
                    opacity: 0,
                  }}
                ></div>
              </div>

              {/* Número */}
              <div
                ref={numberRefs[0]}
                data-count="12"
                className="performance-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         text-4xl md:text-5xl font-extrabold text-[#f59e0b] z-50 relative"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
              >
                0
              </div>
            </div>

            {/* Texto descritivo */}
            <p
              className="performance-text text-lg text-white/90 font-medium leading-relaxed 
                         max-w-[300px] mx-auto pt-4"
            >
              IMÓVEIS VENDIDOS NOS ÚLTIMOS 30 DIAS
            </p>
          </div>

          {/* 🔹 INDICADOR 2 - COM CORREÇÃO ESPECÍFICA PARA A SOMBRA/EFEITO ESTOURADO */}
          <div className="performance-item text-center p-8 relative">
            <div className="performance-number-container inline-block w-[140px] h-[140px] relative mb-8">
              {/* 🔹 CORREÇÃO: Adicionado isolate para conter efeitos */}
              <div
                className="performance-number-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-[100px] h-[100px] bg-white/5 backdrop-blur-sm rounded-full 
                         border border-white/10 pointer-events-none overflow-hidden"
                style={{
                  animation: "ellipsePulse 3s ease-in-out infinite",
                  // 🔹 CORREÇÃO: Container específico para evitar vazamentos
                  contain: "paint layout",
                  willChange: "transform",
                }}
              >
                <div
                  className="inner-glow absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 30%, rgba(251, 191, 36, 0) 40%, rgba(251, 191, 36, 0.6) 50%, rgba(251, 191, 36, 0) 60%, transparent 70%)",
                    backgroundSize: "200% 200%",
                    backgroundPosition: "-100% -100%",
                    opacity: 0,
                    // 🔹 CORREÇÃO: Clip-path para conter melhor a luz
                    clipPath: "inset(0)",
                  }}
                ></div>
              </div>

              {/* Número */}
              <div
                ref={numberRefs[1]}
                data-count="38"
                className="performance-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         text-4xl md:text-5xl font-extrabold text-[#f59e0b] z-50 relative"
                style={{
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  // 🔹 CORREÇÃO: Garantir que o número fique bem acima
                  filter: "drop-shadow(0 0 0 transparent)",
                }}
              >
                0
              </div>
            </div>

            <p
              className="performance-text text-lg text-white/90 font-medium leading-relaxed 
                         max-w-[300px] mx-auto pt-4"
            >
              IMÓVEIS VENDIDOS EM 2025
            </p>
          </div>

          {/* Indicador 3 */}
          <div className="performance-item text-center p-8 relative">
            <div className="performance-number-container inline-block w-[140px] h-[140px] relative mb-8">
              <div
                className="performance-number-bg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         w-[100px] h-[100px] bg-white/5 backdrop-blur-sm rounded-full 
                         border border-white/10 pointer-events-none overflow-hidden"
                style={{
                  animation: "ellipsePulse 3s ease-in-out infinite",
                }}
              >
                <div
                  className="inner-glow absolute inset-0 rounded-full"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent 30%, rgba(251, 191, 36, 0) 40%, rgba(251, 191, 36, 0.6) 50%, rgba(251, 191, 36, 0) 60%, transparent 70%)",
                    backgroundSize: "200% 200%",
                    backgroundPosition: "-100% -100%",
                    opacity: 0,
                  }}
                ></div>
              </div>

              <div
                ref={numberRefs[2]}
                data-count="27"
                className="performance-number absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         text-4xl md:text-5xl font-extrabold text-[#f59e0b] z-50 relative"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.3)" }}
              >
                0
              </div>
            </div>

            <p
              className="performance-text text-lg text-white/90 font-medium leading-relaxed 
                         max-w-[300px] mx-auto pt-4"
            >
              NEGOCIAÇÕES ATIVAS NO MOMENTO
            </p>
          </div>
        </div>
      </div>

      {/* CSS APENAS para as animações */}
      <style>{`
        @keyframes ellipsePulse {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            box-shadow:
              0 0 0 0 rgba(245, 158, 11, 0),
              0 0 0 0 rgba(251, 191, 36, 0);
          }
          50% {
            transform: translate(-50%, -50%) scale(1.08);
            box-shadow:
              0 0 0 8px rgba(245, 158, 11, 0.1),
              0 0 0 16px rgba(251, 191, 36, 0.05);
          }
        }

        @keyframes innerGlow {
          0% {
            background-position: -100% -100%;
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          80% {
            background-position: 200% 200%;
            opacity: 1;
          }
          100% {
            background-position: 200% 200%;
            opacity: 0;
          }
        }

        /* LINHA ABAIXO DO NÚMERO */
        .performance-number::after {
          content: "";
          position: absolute;
          bottom: -12px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, transparent, #fbbf24, transparent);
          border-radius: 1px;
          opacity: 0.5;
        }

        /* Efeito hover apenas na linha */
        .performance-item:hover .performance-number::after {
          width: 60px;
          opacity: 0.8;
        }

        /* 🔹 CORREÇÃO ESPECÍFICA PARA O INDICADOR DO MEIO */
        /* Isolar melhor os efeitos do elemento do meio */
        .performance-item:nth-child(2) .performance-number-bg {
          isolation: isolate;
        }

        .performance-item:nth-child(2) .inner-glow {
          /* Garantir que a luz fique bem contida */
          mask-image: radial-gradient(circle, black 70%, transparent 100%);
          -webkit-mask-image: radial-gradient(
            circle,
            black 70%,
            transparent 100%
          );
        }

        /* Linhas divisórias entre itens no desktop */
        @media (min-width: 768px) {
          .performance-item:not(:last-child)::after {
            content: "";
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 1px;
            height: 80px;
            background: linear-gradient(
              to bottom,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
          }
        }

        /* Linhas divisórias no mobile */
        @media (max-width: 767px) {
          .performance-item:not(:last-child)::before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 80px;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.1),
              transparent
            );
          }
        }
      `}</style>
    </section>
  );
};

export default Indicadores;
