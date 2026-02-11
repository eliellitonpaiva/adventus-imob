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

  // REMOVI: Estados complexos de paginação
  // REMOVI: isFilteredSearch, paginaAtual, totalImoveis, imoveisPorPagina

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

  // FUNÇÃO SIMPLIFICADA: Busca TODOS os imóveis de uma vez
  const fetchImoveis = async (filtros) => {
    setLoading(true);
    setError(null);

    try {
      console.log("🟡 Buscando imóveis com filtros:", filtros);

      // 1. Consulta SIMPLES no Supabase
      let query = supabase
        .from("imoveis")
        .select("*")
        .order("created_at", { ascending: false });

      // 2. Aplicar filtros básicos
      if (filtros.city !== "all") {
        query = query.eq("cidade", filtros.city);
      }
      if (filtros.neighborhood !== "all") {
        query = query.eq("bairro", filtros.neighborhood);
      }
      if (filtros.propertyType !== "all") {
        query = query.eq("tipo", filtros.propertyType);
      }
      if (filtros.bedrooms !== "all") {
        const quartosNum = parseInt(filtros.bedrooms);
        query = query.gte("caracteristicas->quartos", quartosNum.toString());
      }
      if (filtros.priceRange !== "all") {
        const [min, max] = filtros.priceRange.split("-").map(Number);
        if (min) query = query.gte("preco", min);
        if (max) query = query.lte("preco", max);
      }

      // 3. Executar consulta - SEM LIMITE, SEM RANGE
      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      console.log(`✅ ${data?.length || 0} imóveis encontrados`);
      setImoveis(data || []);
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

  // Determinar status
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
            <p>Buscando imóveis...</p>
          </div>
        )}

        {error && !loading && (
          <div style={{ textAlign: "center", padding: "3rem", color: "red" }}>
            <p>{error}</p>
            <button
              onClick={() => fetchImoveis(filtrosAtivos)}
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#1a365d",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
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
                  const caracteristicas = imovel.caracteristicas || {};
                  const quartos = caracteristicas.quartos || "0";
                  const suites = caracteristicas.suites || "0";
                  const banheiros = caracteristicas.banheiros || "0";
                  const vagas = caracteristicas.vagas || "0";

                  return (
                    <CardImovel
                      key={imovel.id}
                      status={getStatus(imovel)}
                      tipo={imovel.tipo?.toUpperCase() || "CASA"}
                      finalidade="VENDA"
                      preco={formatPrice(imovel.preco)}
                      titulo={imovel.titulo || "Imóvel sem título"}
                      localizacao={`${imovel.bairro || ""} • ${imovel.cidade || ""}${imovel.estado ? ` / ${imovel.estado}` : ""}`}
                      quartos={quartos}
                      suites={suites}
                      banheiros={banheiros}
                      vagas={vagas}
                      // ✅ IMPORTANTE: Agora busca o campo em_condominio do banco!
                      emCondominio={imovel.em_condominio || false}
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
                  }}
                >
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
                      backgroundColor: "#1a365d",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "1rem",
                      fontWeight: "500",
                    }}
                  >
                    Limpar filtros
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {/* ✅ PAGINAÇÃO FIXA RESTAURADA (como estava antes) */}
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

      {/* ESTILOS (mantidos iguais) */}
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
      `}</style>
    </>
  );
};

export default ComprarImovel;
