// components/VitrineAdventus/VitrineAdventus.jsx
import React, { useState, useEffect, useRef } from "react";

const VitrineAdventus = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const trackRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Dados dos imóveis da vitrine - COM AS IMAGENS ORIGINAIS DA ADVENTUS
  const properties = [
    {
      id: 1,
      title: "Mansão Contemporânea",
      location: "Jardim Glória, Açailândia - MA",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/29/WhatsApp%20Image%202022-09-26%20at%2018.36.42.jpeg",
      badgeType: "new",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Mansão Contemporânea na Jardim Glória, Açailândia - MA.",
    },
    {
      id: 2,
      title: "Sobrado Executivo",
      location: "Laranjeiras, Açailândia - MA",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/53/WhatsApp%20Image%202022-11-18%20at%2013.09.45%20(2).jpeg",
      badgeType: "price-drop",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Sobrado Executivo no Laranjeiras, Açailândia - MA.",
    },
    {
      id: 3,
      title: "Casa Moderna",
      location: "Colinas Park, Açailândia - MA",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/127/fcc8e0e6-8837-4ed3-b287-5e6334926e32.jpg",
      badgeType: "week",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Casa Moderna no Colinas Park, Açailândia - MA.",
    },
    {
      id: 4,
      title: "Residência Premium",
      location: "Nova Açailândia, Açailândia - MA",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/198/f6d972a5-47b1-4976-8f0d-06c25fa69b84.jpeg",
      badgeType: "new",
      financiable: false,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Residência Premium no Nova Açailândia, Açailândia - MA.",
    },
    {
      id: 5,
      title: "Apartamento de Luxo",
      location: "Ouro Verde, Açailândia - MA",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/222/WhatsApp%20Image%202025-03-11%20at%2010.45.44.jpeg",
      badgeType: "price-drop",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Apartamento de Luxo no Ouro Verde, Açailândia - MA.",
    },
    {
      id: 6,
      title: "Mansão com Piscina",
      location: "Jardim de Alah, Açailândia - MA",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/242/CAPA%200.jpg",
      badgeType: "week",
      financiable: false,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Mansão com Piscina no Jardim de Alah, Açailândia - MA.",
    },
    {
      id: 7,
      title: "Sobrado Moderno",
      location: "Jardim Glória, Açailândia - MA",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/266/1%20(4).jpeg",
      badgeType: "new",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Sobrado Moderno no Jardim Glória, Açailândia - MA.",
    },
    {
      id: 8,
      title: "Casa Espaçosa",
      location: "Laranjeiras, Açailândia - MA",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/201/CAPA.jpg",
      badgeType: "price-drop",
      financiable: false,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Casa Espaçosa no Laranjeiras, Açailândia - MA.",
    },
  ];

  // Atualizar cards por view baseado no tamanho da tela
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1);
      } else if (window.innerWidth <= 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);

    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  // Funções do carrossel
  const getCardWidth = () => {
    if (!trackRef.current || !trackRef.current.firstChild) return 0;
    const card = trackRef.current.firstChild;
    const cardStyle = window.getComputedStyle(card);
    const cardWidth = card.offsetWidth;
    const marginLeft = parseFloat(cardStyle.marginLeft) || 0;
    const marginRight = parseFloat(cardStyle.marginRight) || 0;
    return cardWidth + marginLeft + marginRight;
  };

  const goToSlide = (index) => {
    const maxSlide = Math.max(0, properties.length - cardsPerView);
    const newIndex = Math.max(0, Math.min(index, maxSlide));
    setCurrentSlide(newIndex);
    updateSlidePosition(newIndex);
  };

  const nextSlide = () => {
    if (currentSlide < properties.length - cardsPerView) {
      goToSlide(currentSlide + cardsPerView);
    } else {
      goToSlide(0);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      goToSlide(currentSlide - cardsPerView);
    } else {
      goToSlide(properties.length - cardsPerView);
    }
  };

  const updateSlidePosition = (slideIndex) => {
    if (trackRef.current) {
      const cardWidth = getCardWidth();
      const translateX = -slideIndex * cardWidth;
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  // Funções de touch
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    if (e.cancelable && e.type.includes("touch")) {
      e.preventDefault();
    }

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const cardWidth = getCardWidth();
    const newTranslate = prevTranslate + diff;

    const maxTranslate = 0;
    const minTranslate = -(properties.length - cardsPerView) * cardWidth;
    const clampedTranslate = Math.max(
      minTranslate,
      Math.min(maxTranslate, newTranslate),
    );

    setCurrentTranslate(clampedTranslate);

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${clampedTranslate}px)`;
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (trackRef.current) {
      trackRef.current.style.transition =
        "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
    }

    const cardWidth = getCardWidth();
    const movedBy = currentTranslate - prevTranslate;

    if (Math.abs(movedBy) > cardWidth * 0.2) {
      if (movedBy > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else {
      updateSlidePosition(currentSlide);
    }

    setPrevTranslate(-currentSlide * cardWidth);
    setCurrentTranslate(-currentSlide * cardWidth);
  };

  // Funções para mouse
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX);

    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const diff = currentX - startX;
    const cardWidth = getCardWidth();
    const newTranslate = prevTranslate + diff;

    const maxTranslate = 0;
    const minTranslate = -(properties.length - cardsPerView) * cardWidth;
    const clampedTranslate = Math.max(
      minTranslate,
      Math.min(maxTranslate, newTranslate),
    );

    setCurrentTranslate(clampedTranslate);

    if (trackRef.current) {
      trackRef.current.style.transform = `translateX(${clampedTranslate}px)`;
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (trackRef.current) {
      trackRef.current.style.transition =
        "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      trackRef.current.style.cursor = "grab";
    }

    const cardWidth = getCardWidth();
    const movedBy = currentTranslate - prevTranslate;

    if (Math.abs(movedBy) > cardWidth * 0.2) {
      if (movedBy > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
    } else {
      updateSlidePosition(currentSlide);
    }

    setPrevTranslate(-currentSlide * cardWidth);
    setCurrentTranslate(-currentSlide * cardWidth);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Event listeners
  useEffect(() => {
    const trackElement = trackRef.current;

    if (trackElement) {
      trackElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      trackElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      trackElement.addEventListener("touchend", handleTouchEnd);

      trackElement.addEventListener("mousedown", handleMouseDown);
      trackElement.addEventListener("mousemove", handleMouseMove);
      trackElement.addEventListener("mouseup", handleMouseUp);
      trackElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        trackElement.removeEventListener("touchstart", handleTouchStart);
        trackElement.removeEventListener("touchmove", handleTouchMove);
        trackElement.removeEventListener("touchend", handleTouchEnd);

        trackElement.removeEventListener("mousedown", handleMouseDown);
        trackElement.removeEventListener("mousemove", handleMouseMove);
        trackElement.removeEventListener("mouseup", handleMouseUp);
        trackElement.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [isDragging, startX, prevTranslate, currentTranslate, cardsPerView]);

  // Autoplay
  useEffect(() => {
    const startAutoplay = () => {
      if (window.innerWidth > 768) {
        autoPlayRef.current = setInterval(() => {
          nextSlide();
        }, 5000);
      }
    };

    const stopAutoplay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };

    startAutoplay();

    const trackElement = trackRef.current;
    if (trackElement) {
      trackElement.addEventListener("mouseenter", stopAutoplay);
      trackElement.addEventListener("mouseleave", startAutoplay);
      trackElement.addEventListener("touchstart", stopAutoplay);
      trackElement.addEventListener("touchend", startAutoplay);
    }

    return () => {
      stopAutoplay();
      if (trackElement) {
        trackElement.removeEventListener("mouseenter", stopAutoplay);
        trackElement.removeEventListener("mouseleave", startAutoplay);
        trackElement.removeEventListener("touchstart", stopAutoplay);
        trackElement.removeEventListener("touchend", startAutoplay);
      }
    };
  }, [currentSlide, cardsPerView]);

  // Renderizar badges
  const renderBadge = (type) => {
    switch (type) {
      case "new":
        return (
          <span className="premium-badge premium-badge-new">Novo no site</span>
        );
      case "price-drop":
        return (
          <span className="premium-badge premium-badge-price-drop">
            Baixou o preço
          </span>
        );
      case "week":
        return (
          <span className="premium-badge premium-badge-week">
            Destaque da semana
          </span>
        );
      default:
        return null;
    }
  };

  // Renderizar selo financiável
  const renderFinanciableBadge = (version = 1) => {
    const versionClass =
      version === 1
        ? ""
        : version === 2
          ? "financiable-badge-v2"
          : "financiable-badge-v3";

    return (
      <span className={`financiable-badge ${versionClass}`}>
        <span className="financiable-icon">
          <span className="check-icon">✓</span>
        </span>
        <span className="financiable-text">Financiável</span>
      </span>
    );
  };

  // Atualizar posição do slide
  useEffect(() => {
    updateSlidePosition(currentSlide);
  }, [currentSlide, cardsPerView]);

  // Calcular indicadores
  const totalIndicators = Math.ceil(properties.length / cardsPerView);
  const activeIndicator = Math.floor(currentSlide / cardsPerView);

  return (
    <section
      className="relative overflow-hidden"
      id="vitrineAdventus"
      style={{
        padding: "5rem 1rem",
        backgroundColor: "#31353e",
      }}
    >
      {/* Background com gradientes radiais e pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(251, 191, 36, 0.03) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' fill='%23f59e0b' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")
          `,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-16">
          <h2
            className="mobile-heading relative inline-block mb-4"
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              background:
                "linear-gradient(135deg, #ffffff 0%, #fbbf24 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Vitrine Adventus
            <span
              className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-[150px] h-0.5 rounded"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #fbbf24, transparent)",
                borderRadius: "2px",
              }}
            />
          </h2>
          <p
            className="mobile-text"
            style={{
              fontSize: "1.25rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: 300,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          >
            Vitrine de Vendas
          </p>
        </div>

        {/* Carrossel Container */}
        <div className="relative w-full overflow-hidden">
          {/* Controles de navegação desktop */}
          <div className="hidden lg:flex absolute top-1/2 left-0 right-0 transform -translate-y-1/2 z-10 justify-between px-4 pointer-events-none">
            <button
              className="showcase-premium-nav w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 pointer-events-auto appearance-none focus:outline-none focus:shadow-none"
              onClick={prevSlide}
              aria-label="Slide anterior"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(251, 191, 36, 0.2)";
                e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.5)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="showcase-premium-nav w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 pointer-events-auto appearance-none focus:outline-none focus:shadow-none"
              onClick={nextSlide}
              aria-label="Próximo slide"
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                color: "white",
                boxShadow: "none",
                WebkitTapHighlightColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(251, 191, 36, 0.2)";
                e.currentTarget.style.borderColor = "rgba(251, 191, 36, 0.5)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Track com os cards */}
          <div className="overflow-hidden select-none">
            <div
              className="flex py-5 will-change-transform"
              ref={trackRef}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {properties.map((property, index) => (
                <a
                  key={property.id}
                  href={`https://wa.me/5599988087867?text=${encodeURIComponent(property.whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline relative mx-3"
                  style={{
                    flex: `0 0 calc(${cardsPerView === 3 ? "33.333%" : cardsPerView === 2 ? "50%" : "85%"} - 1.5rem)`,
                    borderRadius: "24px",
                    aspectRatio: "3/4",
                    cursor: "pointer",
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                    overflow: "hidden",
                  }}
                  onMouseEnter={() => setHoveredCard(property.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  {/* Efeito de brilho no hover */}
                  {hoveredCard === property.id && (
                    <div
                      className="absolute inset-0 z-20 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(251, 191, 36, 0.05) 50%, transparent 100%)",
                        boxShadow: "inset 0 0 50px rgba(251, 191, 36, 0.15)",
                        animation: "pulseGlow 2s infinite",
                      }}
                    />
                  )}

                  {/* Badges */}
                  <div className="absolute top-[1.2rem] left-[1.2rem] z-30">
                    {renderBadge(property.badgeType)}
                  </div>

                  {/* Selo Financiável */}
                  {property.financiable && (
                    <div className="absolute top-[1.2rem] right-[1.2rem] z-30">
                      {renderFinanciableBadge((index % 3) + 1)}
                    </div>
                  )}

                  {/* Imagem com efeito de zoom */}
                  <div className="relative w-full h-full overflow-hidden">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                      style={{
                        transition: "transform 0.6s ease",
                        transform:
                          hoveredCard === property.id
                            ? "scale(1.05)"
                            : "scale(1)",
                      }}
                      onError={(e) => {
                        console.error(
                          `Erro ao carregar imagem: ${property.image}`,
                        );
                        e.target.style.backgroundColor = "#1f2937";
                        e.target.style.display = "flex";
                        e.target.style.alignItems = "center";
                        e.target.style.justifyContent = "center";
                        e.target.style.color = "#9ca3af";
                        e.target.innerHTML =
                          '<div style="padding: 20px; text-align: center;">Imagem não disponível</div>';
                      }}
                      onLoad={(e) => {
                        console.log(`Imagem carregada: ${property.title}`);
                      }}
                    />
                    {/* Overlay gradiente na imagem - AJUSTADO: reduzi a opacidade do gradiente */}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0, 0, 0, 0.85) 20%, rgba(0, 0, 0, 0) 80%)",
                      }}
                    />
                  </div>

                  {/* Conteúdo do card */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <div className="space-y-3">
                      <h3
                        className="text-white text-2xl font-bold leading-tight"
                        style={{
                          fontSize: "1.5rem",
                          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
                        }}
                      >
                        {property.title}
                      </h3>
                      <div
                        className="flex items-center gap-2 font-medium"
                        style={{
                          color: "#fbbf24",
                          fontSize: "1rem",
                        }}
                      >
                        <i
                          className="fas fa-map-marker-alt"
                          style={{ fontSize: "0.9rem" }}
                        />
                        <span>{property.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Efeito de borda amarela no hover - mais translúcido e delicado */}
                  {hoveredCard === property.id && (
                    <div
                      className="absolute inset-0 z-10 pointer-events-none"
                      style={{
                        border: "1px solid rgba(251, 191, 36, 0.2)",
                        borderRadius: "24px",
                        boxShadow:
                          "0 0 20px rgba(251, 191, 36, 0.15), inset 0 0 20px rgba(251, 191, 36, 0.08)",
                        animation: "borderPulse 2s infinite",
                      }}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Indicadores do carrossel */}
        <div className="flex justify-center gap-3 mt-12">
          {Array.from({ length: totalIndicators }).map((_, index) => (
            <button
              key={index}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 appearance-none focus:outline-none focus:shadow-none ${
                index === activeIndicator
                  ? "bg-[#fbbf24] scale-125"
                  : "bg-white/20"
              }`}
              onClick={() => goToSlide(index * cardsPerView)}
              aria-label={`Ir para slide ${index + 1}`}
              onMouseEnter={(e) => {
                if (index !== activeIndicator) {
                  e.currentTarget.style.background = "rgba(251, 191, 36, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (index !== activeIndicator) {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* Estilos CSS para efeitos especiais */}
      <style jsx>{`
        @keyframes pulseGlow {
          0%,
          100% {
            opacity: 0.3;
            box-shadow: inset 0 0 50px rgba(251, 191, 36, 0.15);
          }
          50% {
            opacity: 0.5;
            box-shadow: inset 0 0 70px rgba(251, 191, 36, 0.25);
          }
        }

        @keyframes borderPulse {
          0%,
          100% {
            border-color: rgba(251, 191, 36, 0.2);
            box-shadow:
              0 0 20px rgba(251, 191, 36, 0.15),
              inset 0 0 20px rgba(251, 191, 36, 0.08);
          }
          50% {
            border-color: rgba(251, 191, 36, 0.3);
            box-shadow:
              0 0 25px rgba(251, 191, 36, 0.2),
              inset 0 0 25px rgba(251, 191, 36, 0.12);
          }
        }

        /* Estilos dos Badges */
        .premium-badge {
          padding: 0.25rem 0.6rem !important;
          border-radius: 12px !important;
          font-size: 0.6rem !important;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: white !important;
          line-height: 1.1;
          height: auto;
          min-height: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.4);
          white-space: nowrap;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .premium-badge-week {
          background: #f59e0b !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
        }

        .premium-badge-new {
          background: #10b981 !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
        }

        .premium-badge-price-drop {
          background: #dc2626 !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
        }

        /* Efeito hover nos badges */
        a:hover .premium-badge {
          transform: translateY(-1px) !important;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4) !important;
        }

        a:hover .premium-badge-week {
          background: #d97706 !important;
        }

        a:hover .premium-badge-new {
          background: #0d966f !important;
        }

        a:hover .premium-badge-price-drop {
          background: #b91c1c !important;
        }

        /* Estilo do selo financiável */
        .financiable-badge {
          padding: 0.25rem 0.6rem;
          border-radius: 12px;
          font-size: 0.6rem;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #1a1a1a !important;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(245, 158, 11, 0.15);
          box-shadow:
            0 2px 6px rgba(0, 0, 0, 0.15),
            0 1px 2px rgba(255, 255, 255, 0.6) inset;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        .financiable-badge-v2 {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(245, 158, 11, 0.3);
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.18),
            0 1px 2px rgba(255, 255, 255, 0.6) inset;
        }

        .financiable-badge-v3 {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.95) 0%,
            rgba(255, 255, 255, 0.97) 100%
          );
          border: 1px solid rgba(245, 158, 11, 0.2);
          position: relative;
          overflow: hidden;
        }

        .financiable-badge-v3::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(245, 158, 11, 0.03) 0%,
            rgba(251, 191, 36, 0.02) 100%
          );
          z-index: 0;
        }

        .financiable-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 14px;
          height: 14px;
          background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
          border-radius: 50%;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          z-index: 1;
        }

        .financiable-icon::before {
          content: "";
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 30% 30%,
            rgba(255, 255, 255, 0.4) 0%,
            transparent 70%
          );
          pointer-events: none;
        }

        .check-icon {
          color: white;
          font-size: 0.55rem;
          font-weight: 900;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
        }

        .financiable-text {
          font-size: 0.6rem;
          font-weight: 500;
          color: #1a1a1a;
          white-space: nowrap;
          letter-spacing: -0.01em;
          z-index: 1;
          position: relative;
        }

        /* Efeito hover no selo financiável */
        a:hover .financiable-badge {
          background: rgba(255, 255, 255, 0.98);
          box-shadow:
            0 3px 8px rgba(0, 0, 0, 0.2),
            0 1px 3px rgba(255, 255, 255, 0.7) inset;
          transform: translateY(-1px);
          border-color: rgba(245, 158, 11, 0.25);
        }

        /* Responsividade */
        @media (max-width: 1024px) {
          h2 {
            font-size: 2.75rem !important;
          }
        }

        @media (max-width: 768px) {
          section {
            padding: 3rem 1rem !important;
          }

          div.text-center {
            margin-bottom: 2.5rem !important;
          }

          h2 {
            font-size: 2.25rem !important;
          }

          p.mobile-text {
            font-size: 1rem !important;
            letter-spacing: 0.2em !important;
          }

          .showcase-premium-nav {
            display: none !important;
          }
        }

        @media (max-width: 480px) {
          h2 {
            font-size: 1.875rem !important;
          }

          h3 {
            font-size: 1.25rem !important;
          }

          .showcase-premium-card-location {
            font-size: 0.9rem !important;
          }
        }

        .mobile-heading {
          font-size: 1.75rem;
          line-height: 1.3;
          font-weight: 700;
        }

        .mobile-text {
          font-size: 0.9375rem;
          line-height: 1.6;
          letterspacing: 0.01em;
        }

        @media (min-width: 768px) {
          .mobile-heading {
            font-size: 3.5rem;
          }

          .mobile-text {
            font-size: 1rem;
          }
        }
      `}</style>
    </section>
  );
};

export default VitrineAdventus;
