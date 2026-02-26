// components/VitrineAdventus/VitrineAdventus.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"; // 👈 NOVO IMPORT
import { supabase } from "../../lib/supabase";

const VitrineAdventus = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const trackRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Buscar imóveis da vitrine no Supabase
  useEffect(() => {
    const fetchVitrineImoveis = async () => {
      try {
        setLoading(true);

        // Busca TODOS os imóveis (apenas disponíveis e reservados)
        let query = supabase
          .from("imoveis")
          .select(
            `
          id,
          titulo,
          bairro,
          cidade,
          estado,
          financiado,
          slug,
          etiquetas
        `,
          )
          .in("status", ["disponivel", "reservado"]) // 🔥 FILTRO ADICIONADO!
          .order("created_at", { ascending: false });

        const { data: imoveisData, error } = await query;

        if (error) throw error;

        if (!imoveisData || imoveisData.length === 0) {
          setProperties([]);
          setLoading(false);
          return;
        }

        // Filtrar apenas os que têm alguma etiqueta de vitrine = true
        const imoveisFiltrados = imoveisData.filter((imovel) => {
          const etiquetas = imovel.etiquetas || {};
          return (
            etiquetas.novoSite === true ||
            etiquetas.baixouPreco === true ||
            etiquetas.destaqueSemana === true ||
            etiquetas.financiável === true
          );
        });

        if (imoveisFiltrados.length === 0) {
          setProperties([]);
          setLoading(false);
          return;
        }
        // Para cada imóvel, buscar sua foto de capa
        const imoveisComFotos = await Promise.all(
          imoveisFiltrados.map(async (imovel) => {
            try {
              const { data: fotos, error: fotosError } = await supabase
                .from("fotos_imovel")
                .select("url, is_capa, ordem")
                .eq("imovel_id", imovel.id)
                .order("ordem", { ascending: true });

              if (fotosError) {
                return { ...imovel, fotoCapa: "/placeholder-imovel.jpg" };
              }

              let fotoCapa = null;
              if (fotos && fotos.length > 0) {
                const capa = fotos.find((f) => f.is_capa === true);
                fotoCapa = capa ? capa.url : fotos[0].url;
              }

              return {
                ...imovel,
                fotoCapa: fotoCapa || "/placeholder-imovel.jpg",
              };
            } catch {
              return { ...imovel, fotoCapa: "/placeholder-imovel.jpg" };
            }
          }),
        );

        // Mapear para o formato do componente
        const formattedProperties = imoveisComFotos.map((imovel) => {
          const etiquetas = imovel.etiquetas || {};

          let badgeType = "new";
          if (etiquetas.destaqueSemana === true) {
            badgeType = "week";
          } else if (etiquetas.novoSite === true) {
            badgeType = "new";
          } else if (etiquetas.baixouPreco === true) {
            badgeType = "price-drop";
          }

          return {
            id: imovel.id,
            title: imovel.titulo,
            slug: imovel.slug, // 👈 SLUG PARA A URL
            location: `${imovel.bairro || ""}, ${imovel.cidade || "Açailândia"} - ${imovel.estado || "MA"}`,
            image: imovel.fotoCapa,
            badgeType: badgeType,
            financiableReal: imovel.financiado === true,
            etiquetaFinanciavel: etiquetas.financiável === true,
            // 👇 WHATSAPP REMOVIDO DAQUI - AGORA VAI NA PÁGINA DE DETALHE
          };
        });

        setProperties(formattedProperties);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVitrineImoveis();
  }, []);

  // Atualizar cards por view baseado no tamanho da tela
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth <= 768) {
        setCardsPerView(1.2);
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
    if (properties.length === 0) return;
    const maxSlide = Math.max(0, properties.length - Math.floor(cardsPerView));
    const newIndex = Math.max(0, Math.min(index, maxSlide));
    setCurrentSlide(newIndex);
    updateSlidePosition(newIndex);
  };

  const nextSlide = () => {
    if (properties.length === 0) return;
    if (currentSlide < properties.length - Math.floor(cardsPerView)) {
      goToSlide(currentSlide + Math.floor(cardsPerView));
    } else {
      goToSlide(0);
    }
  };

  const prevSlide = () => {
    if (properties.length === 0) return;
    if (currentSlide > 0) {
      goToSlide(currentSlide - Math.floor(cardsPerView));
    } else {
      goToSlide(properties.length - Math.floor(cardsPerView));
    }
  };

  const updateSlidePosition = (slideIndex) => {
    if (trackRef.current) {
      const cardWidth = getCardWidth();
      const translateX = -slideIndex * cardWidth;
      trackRef.current.style.transform = `translateX(${translateX}px)`;
    }
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setIsDragging(false);
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
    }
  };

  const handleTouchMove = (e) => {
    if (!e.touches[0]) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    if (!isDragging && diffX > diffY && diffX > 5) {
      setIsDragging(true);
    }

    if (!isDragging) return;

    if (e.cancelable) {
      e.preventDefault();
    }

    const diff = currentX - startX;
    const cardWidth = getCardWidth();
    const newTranslate = prevTranslate + diff;

    const maxTranslate = 0;
    const minTranslate =
      -(properties.length - Math.floor(cardsPerView)) * cardWidth;
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
        "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";
    }

    const cardWidth = getCardWidth();
    const movedBy = currentTranslate - prevTranslate;

    if (Math.abs(movedBy) > cardWidth * 0.1) {
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
    const minTranslate =
      -(properties.length - Math.floor(cardsPerView)) * cardWidth;
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
        "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)";
      trackRef.current.style.cursor = "grab";
    }

    const cardWidth = getCardWidth();
    const movedBy = currentTranslate - prevTranslate;

    if (Math.abs(movedBy) > cardWidth * 0.1) {
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
  }, [
    isDragging,
    startX,
    startY,
    prevTranslate,
    currentTranslate,
    cardsPerView,
    properties.length,
  ]);

  useEffect(() => {
    const startAutoplay = () => {
      if (window.innerWidth > 768 && properties.length > 0) {
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
  }, [currentSlide, cardsPerView, properties.length]);

  useEffect(() => {
    updateSlidePosition(currentSlide);
  }, [currentSlide, cardsPerView]);

  const totalIndicators = Math.ceil(
    properties.length / Math.floor(cardsPerView),
  );
  const activeIndicator = Math.floor(currentSlide / Math.floor(cardsPerView));

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

  if (loading) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          padding: "calc(5rem - 40px) 1rem 5rem 1rem",
          backgroundColor: "#31353e",
        }}
      >
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#D4A24D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/70">Carregando imóveis...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          padding: "calc(5rem - 40px) 1rem 5rem 1rem",
          backgroundColor: "#31353e",
        }}
      >
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <p className="text-red-400 mb-2">Erro ao carregar imóveis</p>
            <p className="text-white/50 text-sm">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) {
    return (
      <section
        className="relative overflow-hidden"
        style={{
          padding: "calc(5rem - 40px) 1rem 5rem 1rem",
          backgroundColor: "#31353e",
        }}
      >
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "400px" }}
        >
          <div className="text-center">
            <p className="text-white/70">Nenhum imóvel na vitrine no momento</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative overflow-hidden"
      id="vitrineAdventus"
      style={{
        padding: "calc(5rem - 40px) 1rem 5rem 1rem", // Reduzi 40px do padding superior
        backgroundColor: "#31353e",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(212, 162, 77, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(212, 162, 77, 0.03) 0%, transparent 50%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 30m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0' fill='%23D4A24D' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")
          `,
        }}
      />

      <div className="relative max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2
            className="mobile-heading relative inline-block mb-2"
            style={{
              fontSize: "3.5rem",
              fontWeight: 800,
              background:
                "linear-gradient(135deg, #ffffff 0%, #D4A24D 50%, #ffffff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Vitrine Adventus
            <span
              className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-[150px] h-[1px] rounded"
              style={{
                background:
                  "linear-gradient(90deg, transparent, #D4A24D, transparent)",
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

        <div className="relative w-full overflow-hidden">
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
                e.currentTarget.style.background = "rgba(212, 162, 77, 0.2)";
                e.currentTarget.style.borderColor = "rgba(212, 162, 77, 0.5)";
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
                e.currentTarget.style.background = "rgba(212, 162, 77, 0.2)";
                e.currentTarget.style.borderColor = "rgba(212, 162, 77, 0.5)";
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

          <div className="overflow-hidden select-none">
            <div
              className="flex py-5 will-change-transform"
              ref={trackRef}
              style={{
                cursor: isDragging ? "grabbing" : "grab",
                transition: "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
              }}
            >
              {properties.map((property, index) => (
                <Link
                  key={property.id}
                  to={`/imovel/${property.slug || property.id}`} // 👈 AGORA VAI PARA A PÁGINA DE DETALHE
                  className="block no-underline relative mx-2"
                  style={{
                    flex: `0 0 calc(${window.innerWidth <= 768 ? "85%" : cardsPerView === 3 ? "33.333%" : cardsPerView === 2 ? "50%" : "85%"} - 1rem)`,
                    height: window.innerWidth <= 768 ? "500px" : "auto",
                    borderRadius: "24px",
                    aspectRatio: window.innerWidth <= 768 ? "auto" : "3/4",
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
                  {hoveredCard === property.id && (
                    <div
                      className="absolute inset-0 z-20 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(212, 162, 77, 0.1) 0%, rgba(212, 162, 77, 0.05) 50%, transparent 100%)",
                        boxShadow: "inset 0 0 50px rgba(212, 162, 77, 0.15)",
                        animation: "pulseGlow 2s infinite",
                      }}
                    />
                  )}

                  <div className="absolute top-[1.2rem] left-[1.2rem] z-30">
                    {renderBadge(property.badgeType)}
                  </div>

                  {property.etiquetaFinanciavel && (
                    <div className="absolute top-[1.2rem] right-[1.2rem] z-30">
                      {renderFinanciableBadge((index % 3) + 1)}
                    </div>
                  )}

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
                        e.target.style.backgroundColor = "#1f2937";
                        e.target.style.display = "flex";
                        e.target.style.alignItems = "center";
                        e.target.style.justifyContent = "center";
                        e.target.style.color = "#9ca3af";
                        e.target.src = "/placeholder-imovel.jpg";
                      }}
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0, 0, 0, 0.85) 20%, rgba(0, 0, 0, 0) 80%)",
                      }}
                    />
                  </div>

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

                  {hoveredCard === property.id && (
                    <div
                      className="absolute inset-0 z-10 pointer-events-none"
                      style={{
                        border: "1px solid rgba(212, 162, 77, 0.2)",
                        borderRadius: "24px",
                        boxShadow:
                          "0 0 20px rgba(212, 162, 77, 0.15), inset 0 0 20px rgba(212, 162, 77, 0.08)",
                        animation: "borderPulse 2s infinite",
                      }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "8px",
            marginTop: "32px",
            width: "100%",
          }}
        >
          {Array.from({ length: totalIndicators }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index * Math.floor(cardsPerView))}
              style={{
                width: index === activeIndicator ? "10px" : "6px",
                height: index === activeIndicator ? "10px" : "6px",
                borderRadius: "50%",
                backgroundColor:
                  index === activeIndicator
                    ? "#D4A24D"
                    : "rgba(255, 255, 255, 0.25)",
                border: "none",
                padding: 0,
                margin: 0,
                cursor: "pointer",
                transition: "all 0.2s ease",
                outline: "none",
                boxShadow: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
              }}
              onMouseEnter={(e) => {
                if (index !== activeIndicator) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.5)";
                }
              }}
              onMouseLeave={(e) => {
                if (index !== activeIndicator) {
                  e.currentTarget.style.backgroundColor =
                    "rgba(255, 255, 255, 0.25)";
                }
              }}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; box-shadow: inset 0 0 50px rgba(212, 162, 77, 0.15); }
          50% { opacity: 0.5; box-shadow: inset 0 0 70px rgba(212, 162, 77, 0.25); }
        }
        @keyframes borderPulse {
          0%, 100% { border-color: rgba(212, 162, 77, 0.2); box-shadow: 0 0 20px rgba(212, 162, 77, 0.15), inset 0 0 20px rgba(212, 162, 77, 0.08); }
          50% { border-color: rgba(212, 162, 77, 0.3); box-shadow: 0 0 25px rgba(212, 162, 77, 0.2), inset 0 0 25px rgba(212, 162, 77, 0.12); }
        }
        .premium-badge { padding: 0.25rem 0.6rem !important; border-radius: 12px !important; font-size: 0.6rem !important; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: white !important; line-height: 1.1; height: auto; min-height: 20px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.4); white-space: nowrap; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .premium-badge-week { background: #f59e0b !important; border-color: rgba(255, 255, 255, 0.5) !important; }
        .premium-badge-new { background: #10b981 !important; border-color: rgba(255, 255, 255, 0.5) !important; }
        .premium-badge-price-drop { background: #dc2626 !important; border-color: rgba(255, 255, 255, 0.5) !important; }
        a:hover .premium-badge { transform: translateY(-1px) !important; box-shadow: 0 3px 8px rgba(0, 0, 0, 0.4) !important; }
        a:hover .premium-badge-week { background: #d97706 !important; }
        a:hover .premium-badge-new { background: #0d966f !important; }
        a:hover .premium-badge-price-drop { background: #b91c1c !important; }
        .financiable-badge { padding: 0.25rem 0.6rem; border-radius: 12px; font-size: 0.6rem; font-weight: 500; letter-spacing: 0.02em; color: #1a1a1a !important; background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border: 1px solid rgba(212, 162, 77, 0.15); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(255, 255, 255, 0.6) inset; display: inline-flex; align-items: center; gap: 0.4rem; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); white-space: nowrap; }
        .financiable-badge-v2 { background: rgba(255, 255, 255, 0.95); border: 1px solid rgba(212, 162, 77, 0.3); box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18), 0 1px 2px rgba(255, 255, 255, 0.6) inset; }
        .financiable-badge-v3 { background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.97) 100%); border: 1px solid rgba(212, 162, 77, 0.2); position: relative; overflow: hidden; }
        .financiable-badge-v3::before { content: ""; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: linear-gradient(135deg, rgba(212, 162, 77, 0.03) 0%, rgba(212, 162, 77, 0.02) 100%); z-index: 0; }
        .financiable-icon { display: flex; align-items: center; justify-content: center; width: 14px; height: 14px; background: #2ecc71 !important; border-radius: 50%; flex-shrink: 0; position: relative; overflow: hidden; z-index: 1; }
        .financiable-icon::before { content: ""; position: absolute; width: 100%; height: 100%; background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4) 0%, transparent 70%); pointer-events: none; }
        .check-icon { color: white; font-size: 0.55rem; font-weight: 900; line-height: 1; display: flex; align-items: center; justify-content: center; text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2); }
        .financiable-text { font-size: 0.6rem; font-weight: 500; color: #1a1a1a; white-space: nowrap; letter-spacing: -0.01em; z-index: 1; position: relative; }
        a:hover .financiable-badge { background: rgba(255, 255, 255, 0.98); box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(255, 255, 255, 0.7) inset; transform: translateY(-1px); border-color: rgba(212, 162, 77, 0.25); }
        @media (max-width: 1024px) { h2 { font-size: 2.75rem !important; } }
        @media (max-width: 768px) { section { padding: 3rem 1rem !important; } div.text-center { margin-bottom: 2.5rem !important; } h2 { font-size: 2.25rem !important; } p.mobile-text { font-size: 1rem !important; letter-spacing: 0.2em !important; } .showcase-premium-nav { display: none !important; } }
        @media (max-width: 480px) { h2 { font-size: 1.875rem !important; } h3 { font-size: 1.25rem !important; } .showcase-premium-card-location { font-size: 0.9rem !important; } }
        .mobile-heading { font-size: 1.75rem; line-height: 1.3; font-weight: 700; }
        .mobile-text { font-size: 0.9375rem; line-height: 1.6; letter-spacing: 0.01em; }
        @media (min-width: 768px) { .mobile-heading { font-size: 3.5rem; } .mobile-text { font-size: 1rem; } }
      `}</style>
    </section>
  );
};

export default VitrineAdventus;
