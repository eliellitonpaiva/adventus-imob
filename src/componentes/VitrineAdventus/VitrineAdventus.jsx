// components/VitrineAdventus/VitrineAdventus.jsx
import React, { useState, useEffect, useRef } from "react";
import "./VitrineAdventus.css";

const VitrineAdventus = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const trackRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Dados dos imóveis da vitrine
  const properties = [
    {
      id: 1,
      title: "Mansão Contemporânea",
      location: "Barra Azul",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/29/WhatsApp%20Image%202022-09-26%20at%2018.36.42.jpeg",
      badgeType: "new",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Mansão Contemporânea na Barra Azul.",
    },
    {
      id: 2,
      title: "Sobrado Executivo",
      location: "Jardim Glória",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/53/WhatsApp%20Image%202022-11-18%20at%2013.09.45%20(2).jpeg",
      badgeType: "price-drop",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Sobrado Executivo no Jardim Glória.",
    },
    {
      id: 3,
      title: "Casa Moderna",
      location: "Parque das Nações",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/127/fcc8e0e6-8837-4ed3-b287-5e6334926e32.jpg",
      badgeType: "week",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Casa Moderna no Parque das Nações.",
    },
    {
      id: 4,
      title: "Residência Premium",
      location: "Centro",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/198/f6d972a5-47b1-4976-8f0d-06c25fa69b84.jpeg",
      badgeType: "new",
      financiable: false,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Residência Premium no Centro.",
    },
    {
      id: 5,
      title: "Apartamento de Luxo",
      location: "Parque da Lagoa",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/222/WhatsApp%20Image%202025-03-11%20at%2010.45.44.jpeg",
      badgeType: "price-drop",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Apartamento de Luxo no Parque da Lagoa.",
    },
    {
      id: 6,
      title: "Mansão com Piscina",
      location: "Bom Jardim",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/242/CAPA%200.jpg",
      badgeType: "week",
      financiable: false,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Mansão com Piscina no Bom Jardim.",
    },
    {
      id: 7,
      title: "Sobrado Moderno",
      location: "Laranjeiras",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/266/1%20(4).jpeg",
      badgeType: "new",
      financiable: true,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Sobrado Moderno no Laranjeiras.",
    },
    {
      id: 8,
      title: "Casa Espaçosa",
      location: "Jacu",
      image:
        "https://adventusimobiliaria.com.br/img/imovei/filename/201/CAPA.jpg",
      badgeType: "price-drop",
      financiable: false,
      whatsappMessage:
        "Olá! Vim pelo site da Adventus.%0AInteresse: saber mais sobre Casa Espaçosa no Jacu.",
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

  // CORREÇÃO: Funções de touch corrigidas
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;

    // CORREÇÃO: Verificar se podemos prevenir o comportamento padrão
    if (e.cancelable && e.type.includes("touch")) {
      e.preventDefault();
    }

    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    const cardWidth = getCardWidth();
    const newTranslate = prevTranslate + diff;

    // Limitar arraste
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

  // Funções para mouse (desktop)
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

  // CORREÇÃO: Event listeners com passive: false
  useEffect(() => {
    const trackElement = trackRef.current;

    if (trackElement) {
      // Adicionar event listeners com passive: false para touch
      trackElement.addEventListener("touchstart", handleTouchStart, {
        passive: false,
      });
      trackElement.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      trackElement.addEventListener("touchend", handleTouchEnd);

      // Event listeners para mouse
      trackElement.addEventListener("mousedown", handleMouseDown);
      trackElement.addEventListener("mousemove", handleMouseMove);
      trackElement.addEventListener("mouseup", handleMouseUp);
      trackElement.addEventListener("mouseleave", handleMouseLeave);

      return () => {
        // Remover event listeners
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

    // Pausar autoplay ao interagir
    const trackElement = trackRef.current;
    if (trackElement) {
      trackElement.addEventListener("mouseenter", stopAutoplay);
      trackElement.addEventListener("mouseleave", startAutoplay);
      trackElement.addEventListener("touchstart", stopAutoplay);
      trackElement.addEventListener("touchend", startAutoplay);
    }

    // Limpar intervalo ao desmontar
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

  // Atualizar posição do slide quando currentSlide ou cardsPerView mudar
  useEffect(() => {
    updateSlidePosition(currentSlide);
  }, [currentSlide, cardsPerView]);

  // Calcular indicadores
  const totalIndicators = Math.ceil(properties.length / cardsPerView);
  const activeIndicator = Math.floor(currentSlide / cardsPerView);

  return (
    <section className="showcase-premium-section" id="vitrineAdventus">
      <div className="showcase-premium-container">
        {/* Cabeçalho */}
        <div className="showcase-premium-header">
          <h2 className="showcase-premium-title mobile-heading">
            Vitrine Adventus
          </h2>
          <p className="showcase-premium-subtitle mobile-text">
            Vitrine de Vendas
          </p>
        </div>

        {/* Carrossel Container */}
        <div className="showcase-premium-carousel">
          {/* Controles de navegação desktop */}
          <div className="showcase-premium-controls">
            <button
              className="showcase-premium-nav"
              onClick={prevSlide}
              aria-label="Slide anterior"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="showcase-premium-nav"
              onClick={nextSlide}
              aria-label="Próximo slide"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          {/* Track com os cards */}
          <div
            className="showcase-premium-track"
            ref={trackRef}
            style={{ cursor: isDragging ? "grabbing" : "grab" }}
            aria-live="polite"
            aria-atomic="true"
            aria-label="Vitrine de imóveis"
          >
            {properties.map((property, index) => (
              <a
                key={property.id}
                href={`https://wa.me/5599988087867?text=${encodeURIComponent(property.whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="showcase-premium-card card-hover block no-underline"
                aria-label={`${property.title} em ${property.location}`}
              >
                <div className="showcase-premium-badge">
                  {renderBadge(property.badgeType)}
                </div>

                {/* Selo Financiável */}
                {property.financiable && (
                  <div className="financiable-badge-container">
                    {renderFinanciableBadge((index % 3) + 1)}
                  </div>
                )}

                <img
                  src={property.image}
                  alt={property.title}
                  className="showcase-premium-image"
                  loading="lazy"
                  width="400"
                  height="533"
                />

                <div className="showcase-premium-overlay">
                  <div className="showcase-premium-content">
                    <h3 className="showcase-premium-card-title mobile-text">
                      {property.title}
                    </h3>
                    <div className="showcase-premium-card-location">
                      <i
                        className="fas fa-map-marker-alt"
                        aria-hidden="true"
                      ></i>
                      <span>{property.location}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Indicadores do carrossel */}
        <div className="showcase-premium-indicators">
          {Array.from({ length: totalIndicators }).map((_, index) => (
            <button
              key={index}
              className={`showcase-premium-indicator ${index === activeIndicator ? "active" : ""}`}
              onClick={() => goToSlide(index * cardsPerView)}
              aria-label={`Ir para slide ${index + 1}`}
              aria-current={index === activeIndicator}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default VitrineAdventus;
