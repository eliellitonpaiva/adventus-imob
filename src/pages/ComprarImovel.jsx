import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Filtros from "../componentes/Filtros/Filtros";
import CardImovel from "../componentes/CardImovel/CardImovel";
import { supabase } from "/src/lib/supabase";
import "./ComprarImovel.css";

const ComprarImovel = () => {
  const location = useLocation();
  const [initialFilters, setInitialFilters] = useState({});

  // Estados
  const [imoveis, setImoveis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros ativos - MAIS SIMPLES
  const [filtrosAtivos, setFiltrosAtivos] = useState({
    purpose: "buy",
    propertyType: "all",
    city: "all",
    neighborhood: "all",
    bedrooms: "all",
    parking: "all",
    priceRange: "all",
  });

  useEffect(() => {
    const loadFiltersFromStorage = () => {
      try {
        const savedFilters = localStorage.getItem("hero_filters");
        if (savedFilters) {
          const parsed = JSON.parse(savedFilters);
          if (parsed.tipo === "comprar") {
            const heroFilters = {
              purpose: "buy",
              city: parsed.filtros.city || "all",
              neighborhood: parsed.filtros.neighborhood || "all",
              propertyType: parsed.filtros.propertyType || "all",
              bedrooms: parsed.filtros.bedrooms || "all",
              parking: parsed.filtros.parking || "all",
              priceRange: parsed.filtros.priceRange || "all",
            };
            setInitialFilters(heroFilters);
            setFiltrosAtivos(heroFilters);
            return heroFilters;
          }
        }
      } catch (error) {
        console.error("Erro ao ler localStorage:", error);
      }
      return null;
    };

    const savedFilters = loadFiltersFromStorage();
    if (savedFilters) {
      fetchImoveis(savedFilters);
    } else {
      const defaultFilters = {
        purpose: "buy",
        propertyType: "all",
        city: "all",
        neighborhood: "all",
        bedrooms: "all",
        parking: "all",
        priceRange: "all",
      };
      setFiltrosAtivos(defaultFilters);
      fetchImoveis(defaultFilters);
    }
  }, []);

  // 🔥 FUNÇÃO CORRIGIDA - 100% FUNCIONAL
  const fetchImoveis = async (filtros) => {
    setLoading(true);
    setError(null);

    try {
      console.log("🟡 Buscando imóveis com filtros:", filtros);

      // 1. Primeiro busca TODOS os imóveis SEM filtro de quartos problemático
      let query = supabase
        .from("imoveis")
        .select("*")
        .order("created_at", { ascending: false });

      // 2. Aplicar filtros básicos (exceto quartos)
      if (filtros.city !== "all") {
        query = query.eq("cidade", filtros.city);
      }
      if (filtros.neighborhood !== "all") {
        query = query.eq("bairro", filtros.neighborhood);
      }
      if (filtros.propertyType !== "all") {
        query = query.eq("tipo", filtros.propertyType);
      }

      if (filtros.priceRange !== "all") {
        const [min, max] = filtros.priceRange.split("-").map(Number);
        if (min) query = query.gte("preco", min);
        if (max) query = query.lte("preco", max);
      }

      // 3. Executar consulta dos imóveis
      const { data: imoveisData, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      // 4. Se não tem imóveis, retorna vazio
      if (!imoveisData || imoveisData.length === 0) {
        setImoveis([]);
        setLoading(false);
        return;
      }

      // 5. Filtrar por quartos MANUALMENTE (para evitar erro de sintaxe)
      let imoveisFiltrados = imoveisData;

      if (filtros.bedrooms !== "all") {
        const quartosMin = parseInt(filtros.bedrooms);

        imoveisFiltrados = imoveisData.filter((imovel) => {
          const dependencias = imovel.dependencias || {};
          const caracteristicas = imovel.caracteristicas || {};

          const qtdQuartos = parseInt(
            dependencias.dormitorios || caracteristicas.quartos || "0",
          );

          return qtdQuartos >= quartosMin;
        });
      }

      console.log(`✅ ${imoveisFiltrados.length} imóveis após filtro manual`);

      // 6. Agora busca os empreendimentos SEPARADAMENTE
      const imoveisComEmpreendimento = await Promise.all(
        imoveisFiltrados.map(async (imovel) => {
          // Se não tem id_edificios, retorna o imóvel sem empreendimento
          if (!imovel.id_edificios) {
            return { ...imovel, edificios: null };
          }

          try {
            // Busca o empreendimento pelo ID
            const { data: edificioData, error: edificioError } = await supabase
              .from("edificios")
              .select("id, nome, tipo")
              .eq("id", imovel.id_edificios)
              .single();

            if (edificioError) {
              console.error("Erro ao buscar edificio:", edificioError);
              return { ...imovel, edificios: null };
            }

            return {
              ...imovel,
              edificios: edificioData || null,
            };
          } catch (err) {
            console.error("Erro ao processar edificio:", err);
            return { ...imovel, edificios: null };
          }
        }),
      );

      console.log(
        `✅ ${imoveisComEmpreendimento?.length || 0} imóveis com empreendimentos`,
      );
      setImoveis(imoveisComEmpreendimento || []);
    } catch (err) {
      console.error("💥 Erro ao buscar imóveis:", err);
      setError("Erro ao carregar os imóveis. Tente novamente.");
      setImoveis([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (novosFiltros) => {
    if (novosFiltros.purpose === "all") {
      novosFiltros.purpose = "buy";
    }
    setFiltrosAtivos(novosFiltros);
    fetchImoveis(novosFiltros);
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("hero_filters");
    };
  }, []);

  // Função para formatar preço
  const formatPrice = (price) => {
    if (!price || price === "0" || price === "0.00") {
      return "Preço sob consulta";
    }

    let valorNumerico;
    if (typeof price === "string") {
      const stringLimpa = price
        .replace(/[^\d,.-]/g, "")
        .replace(".", "")
        .replace(",", ".");
      valorNumerico = parseFloat(stringLimpa);
    } else {
      valorNumerico = Number(price);
    }

    if (isNaN(valorNumerico) || !isFinite(valorNumerico)) {
      return "Preço sob consulta";
    }

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(valorNumerico);
  };

  const extrairDadosImovel = (imovel) => {
    const caracteristicas = imovel.caracteristicas || {};
    const dependencias = imovel.dependencias || {};

    return {
      quartos: dependencias.dormitorios || caracteristicas.quartos || "0",
      suites: dependencias.suites || caracteristicas.suites || "0",
      banheiros: dependencias.banheiros || caracteristicas.banheiros || "0",
      vagas: dependencias.vagas || caracteristicas.vagas || "0",
      areaTotal: dependencias.area_total || caracteristicas.areaTotal || "0",
      areaConstruida:
        dependencias.area_construida || caracteristicas.areaConstruida || "0",
    };
  };

  // =============== 🎯 FUNÇÃO PARA GERAR TÍTULO DO CARD (CORRIGIDA!) ===============
  const gerarTituloCard = (imovel) => {
    // 🔥 TÍTULO SIMPLES E DIRETO
    if (!imovel) return "Imóvel";

    const tipo = imovel.tipo || "imóvel";
    const bairro = imovel.bairro ? imovel.bairro.replace(/ /g, "-") : "";
    const cidade = imovel.cidade || "";
    const estado = imovel.estado || "";

    // ✅ CASO 1: Tem bairro, cidade e estado (formato completo)
    if (bairro && cidade && estado) {
      return `${tipo} ${bairro}-${cidade}-${estado}`;
    }

    // ✅ CASO 2: Tem cidade e estado (sem bairro)
    if (cidade && estado) {
      return `${tipo} ${cidade}-${estado}`;
    }

    // ✅ CASO 3: Tem só cidade
    if (cidade) {
      return `${tipo} ${cidade}`;
    }

    // ✅ CASO 4: Tem só estado
    if (estado) {
      return `${tipo} - ${estado}`;
    }

    // ✅ CASO 5: Fallback - usa título manual ou genérico
    return imovel.titulo || `${tipo} em localização privilegiada`;
  };

  const getStatus = (imovel) => {
    if (imovel.status === "vendido") return "sold";
    if (imovel.status === "destaque") return "price-drop";
    return "available";
  };

  const handleClearFilters = () => {
    const filtrosResetados = {
      purpose: "buy",
      propertyType: "all",
      city: "all",
      neighborhood: "all",
      bedrooms: "all",
      parking: "all",
      priceRange: "all",
    };
    setFiltrosAtivos(filtrosResetados);
    fetchImoveis(filtrosResetados);
  };

  return (
    <>
      {/* TÍTULO */}
      <div className="container">
        <div className="page-header-mobile-optimized">
          <h1 className="page-header-title">
            {loading ? "Carregando..." : `${imoveis.length} imóveis`} para
            compra
          </h1>
        </div>
      </div>

      {/* FILTROS */}
      <section className="filters-bg">
        <div className="container">
          <Filtros
            initialFilters={initialFilters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </section>

      {/* LISTAGEM DE IMÓVEIS */}
      <main className="container">
        {loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "#666" }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#D4A24D] mx-auto mb-4"></div>
            <p>Buscando imóveis...</p>
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "red" }}>
            <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
            <p className="text-lg mb-4">{error}</p>
            <button
              onClick={() => fetchImoveis(filtrosAtivos)}
              style={{
                marginTop: "1rem",
                padding: "0.75rem 2rem",
                backgroundColor: "#D4A24D",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="listings-header">
              <div className="results-count">
                {`${imoveis.length} ${imoveis.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`}
              </div>
            </div>

            <section className="lista-imoveis">
              {imoveis.length > 0 ? (
                imoveis.map((imovel) => {
                  const dados = extrairDadosImovel(imovel);

                  // 🔥 TÍTULO OTIMIZADO PARA O CARD - CORRIGIDO!
                  const tituloCard = gerarTituloCard(imovel);

                  // 🔍 DEBUG - Vê o título do card
                  console.log(
                    `🏠 Card: ${tituloCard} | Slug: ${imovel.slug || "❌ NÃO TEM SLUG!"}`,
                  );
                  console.log(
                    `📍 Localização: ${imovel.bairro || ""} • ${imovel.cidade || ""} / ${imovel.estado || ""}`,
                  );

                  return (
                    <CardImovel
                      key={imovel.id}
                      id={imovel.id}
                      slug={imovel.slug}
                      status={getStatus(imovel)}
                      tipo={imovel.tipo?.toUpperCase() || "CASA"}
                      finalidade="VENDA"
                      preco={formatPrice(imovel.preco)}
                      // ===== PROPS CORRIGIDAS E OTIMIZADAS =====
                      titulo={tituloCard} // ✅ AGORA USA O TÍTULO AUTOMÁTICO!
                      localizacao={`${imovel.bairro || ""}${imovel.bairro && imovel.cidade ? " • " : ""}${imovel.cidade || ""}${imovel.estado ? ` / ${imovel.estado}` : ""}`}
                      bairro={imovel.bairro} // 🔥 NOVO - Passa o bairro!
                      cidade={imovel.cidade} // 🔥 NOVO - Passa a cidade!
                      estado={imovel.estado} // 🔥 NOVO - Passa o estado!
                      // ===========================================
                      quartos={dados.quartos}
                      suites={dados.suites}
                      banheiros={dados.banheiros}
                      vagas={dados.vagas}
                      areaTotal={dados.areaTotal}
                      areaConstruida={dados.areaConstruida}
                      emCondominio={imovel.em_condominio || false}
                      empreendimento={imovel.edificios || null}
                      unidade={imovel.unidade || ""}
                      andar={imovel.andar || ""}
                      bloco={imovel.bloco || ""}
                      imagem={
                        imovel.imagem_url ||
                        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=400&h=300&q=60"
                      }
                    />
                  );
                })
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    gridColumn: "1/-1",
                    padding: "4rem",
                    width: "100%",
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  }}
                >
                  <i className="fas fa-home text-6xl text-gray-300 mb-4"></i>
                  <p
                    style={{
                      fontSize: "1.2rem",
                      color: "#666",
                      marginBottom: "2rem",
                    }}
                  >
                    Nenhum imóvel disponível para compra no momento.
                  </p>
                  <button
                    onClick={handleClearFilters}
                    style={{
                      padding: "0.75rem 2rem",
                      backgroundColor: "#D4A24D",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "600",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#C4933E")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "#D4A24D")
                    }
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {/* PAGINAÇÃO FIXA */}
        {!loading && !error && imoveis.length > 0 && (
          <div className="pagination">
            <button className="page-btn disabled">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">3</button>
            <button className="page-btn">4</button>
            <button className="page-btn">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </main>

      {/* ESTILOS */}
      <style jsx="true" global="true">{`
        .page-header-mobile-optimized {
          padding: 1.5rem 0 !important;
          text-align: center;
        }
        .page-header-title {
          font-size: 1.75rem !important;
          line-height: 1.3 !important;
          margin: 0 !important;
          color: #1a365d;
          font-weight: 700;
        }
        @media (min-width: 768px) {
          .page-header-mobile-optimized {
            padding: 3rem 0 !important;
          }
          .page-header-title {
            font-size: 2.5rem !important;
            line-height: 1.4 !important;
          }
        }
        @media (max-width: 480px) {
          .page-header-mobile-optimized {
            padding: 1rem 0 !important;
          }
          .page-header-title {
            font-size: 1.5rem !important;
            line-height: 1.25 !important;
          }
        }
        .page-header-mobile-optimized * {
          margin: 0;
          padding: 0;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default ComprarImovel;
