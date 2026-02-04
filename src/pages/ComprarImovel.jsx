import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import Filtros from "../componentes/Filtros/Filtros";
import CardImovel from "../componentes/CardImovel/CardImovel";
import "./ComprarImovel.css";

const ComprarImovel = () => {
  const location = useLocation();

  // filtros que vêm do Hero
  const [initialFilters, setInitialFilters] = useState({});

  useEffect(() => {
    // 👉 Ao montar: ler filtros do localStorage
    const loadFiltersFromStorage = () => {
      try {
        const savedFilters = localStorage.getItem("hero_filters");
        if (savedFilters) {
          const parsed = JSON.parse(savedFilters);

          // Só usar se for do tipo "comprar"
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
          }
        }
      } catch (error) {
        console.error("Erro ao ler localStorage:", error);
      }
    };

    loadFiltersFromStorage();
  }, []); // Executa apenas ao montar

  useEffect(() => {
    // 👉 Retorno de limpeza: ao desmontar, remover filtros do localStorage
    return () => {
      localStorage.removeItem("hero_filters");
    };
  }, []); // Executa apenas ao desmontar

  // imagens mock
  const imagensOtimizadas = [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=400&h=300&q=60",
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&h=300&q=60",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=400&h=300&q=60",
  ];

  return (
    <>
      {/* TÍTULO - CONTAINER COM ALTURA REDUZIDA NO MOBILE */}
      <div className="container">
        <div className="page-header-mobile-optimized">
          <h1 className="page-header-title">
            186 imóveis prontos para aluguel e venda, escolha o seu
          </h1>
        </div>
      </div>

      {/* FILTROS */}
      <section className="filters-bg">
        <div className="container">
          <Filtros initialFilters={initialFilters} />
        </div>
      </section>

      {/* LISTAGEM */}
      <main className="container">
        <div className="listings-header">
          <div className="results-count">3 imóveis encontrados</div>
        </div>

        <section className="lista-imoveis">
          <CardImovel
            status="available"
            tipo="CASA"
            finalidade="VENDA"
            preco="R$ 850.000"
            titulo="Casa moderna em condomínio fechado"
            localizacao="Centro • Açailândia / MA"
            quartos={3}
            suites={1}
            banheiros={2}
            vagas={2}
            emCondominio={true}
            imagem={imagensOtimizadas[0]}
          />

          <CardImovel
            status="price-drop"
            tipo="APARTAMENTO"
            finalidade="VENDA"
            preco="R$ 620.000"
            titulo="Apartamento com vista privilegiada"
            localizacao="Getat • Açailândia / MA"
            quartos={2}
            suites={1}
            banheiros={2}
            vagas={1}
            emCondominio={true}
            imagem={imagensOtimizadas[1]}
          />

          <CardImovel
            status="sold"
            tipo="CASA"
            finalidade="VENDA"
            preco="R$ 1.200.000"
            titulo="Casa alto padrão com piscina"
            localizacao="Centro • Açailândia / MA"
            quartos={4}
            suites={2}
            banheiros={4}
            vagas={3}
            emCondominio={true}
            imagem={imagensOtimizadas[2]}
          />
        </section>

        {/* PAGINAÇÃO — NÃO MEXIDA */}
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
      </main>

      {/* ESTILOS INLINE PARA REDUZIR ALTURA DO CONTAINER NO MOBILE */}
      <style jsx="true" global="true">{`
        /* CONTAINER DO TÍTULO OTIMIZADO PARA MOBILE */
        .page-header-mobile-optimized {
          padding: 1.5rem 0 !important; /* Reduzido de 3rem para 1.5rem */
          text-align: center;
        }

        /* TÍTULO RESPONSIVO */
        .page-header-title {
          font-size: 1.75rem !important; /* Menor em mobile */
          line-height: 1.3 !important; /* Reduz espaçamento entre linhas */
          margin: 0 !important;
          color: #1a365d;
          font-weight: 700;
        }

        /* DESKTOP: Mantém tamanho original */
        @media (min-width: 768px) {
          .page-header-mobile-optimized {
            padding: 3rem 0 !important; /* Volta ao original em desktop */
          }

          .page-header-title {
            font-size: 2.5rem !important; /* Tamanho original em desktop */
            line-height: 1.4 !important;
          }
        }

        /* MOBILE PEQUENO: Ainda mais compacto */
        @media (max-width: 480px) {
          .page-header-mobile-optimized {
            padding: 1rem 0 !important; /* Ainda mais compacto */
          }

          .page-header-title {
            font-size: 1.5rem !important; /* Menor ainda em telas pequenas */
            line-height: 1.25 !important;
          }
        }

        /* GARANTIR QUE O CONTAINER NÃO TENHA ESPAÇO EXTRA */
        .page-header-mobile-optimized * {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </>
  );
};

export default ComprarImovel;
