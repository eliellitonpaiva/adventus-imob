// Filtros.jsx - VERSÃO FINAL: COM BOTÃO BUSCAR ORIGINAL E LAYOUT CORRETO
import React, { useState, useEffect, useRef } from "react";

const Filtros = ({ onFilterChange, initialFilters = {} }) => {
  // Estado inicial
  const [filters, setFilters] = useState({
    purpose: "all",
    propertyType: "all",
    city: "all",
    neighborhood: "all",
    condominium: "all",
    bedrooms: "all",
    parking: "all",
    priceRange: "all",
  });

  // Rastrear quais filtros foram inicializados pelo Hero
  const [initializedFromHero, setInitializedFromHero] = useState({
    purpose: false,
    propertyType: false,
    city: false,
    neighborhood: false,
    condominium: false,
    bedrooms: false,
    parking: false,
    priceRange: false,
  });

  // Refs para aplicar foco visual
  const cityRef = useRef(null);
  const neighborhoodRef = useRef(null);
  const propertyTypeRef = useRef(null);
  const priceRangeRef = useRef(null);
  const bedroomsRef = useRef(null);
  const parkingRef = useRef(null);
  const purposeRef = useRef(null);
  const condominiumRef = useRef(null);

  // INICIALIZAR COM OS FILTROS RECEBIDOS DO HERO
  useEffect(() => {
    if (initialFilters && Object.keys(initialFilters).length > 0) {
      console.log("Filtros recebidos:", initialFilters);

      // Identificar quais campos vieram preenchidos do Hero
      const newInitializedState = { ...initializedFromHero };
      Object.keys(initialFilters).forEach((key) => {
        if (initialFilters[key] && initialFilters[key] !== "all") {
          newInitializedState[key] = true;
        }
      });

      setInitializedFromHero(newInitializedState);
      setFilters((prev) => ({
        ...prev,
        ...initialFilters,
      }));

      // Aplicar foco visual após um pequeno delay
      setTimeout(() => {
        const refs = {
          purpose: purposeRef,
          city: cityRef,
          neighborhood: neighborhoodRef,
          propertyType: propertyTypeRef,
          priceRange: priceRangeRef,
          bedrooms: bedroomsRef,
          parking: parkingRef,
          condominium: condominiumRef,
        };

        Object.keys(refs).forEach((key) => {
          if (
            initialFilters[key] &&
            initialFilters[key] !== "all" &&
            refs[key]?.current
          ) {
            refs[key].current.classList.add("hero-initialized-active");
          }
        });
      }, 100);
    }
  }, [initialFilters]);

  const handleChange = (name, value) => {
    // Remover o estilo ativo quando o usuário mudar manualmente
    if (initializedFromHero[name]) {
      setInitializedFromHero((prev) => ({
        ...prev,
        [name]: false,
      }));

      // Remover classe de ativo
      const refs = {
        purpose: purposeRef,
        city: cityRef,
        neighborhood: neighborhoodRef,
        propertyType: propertyTypeRef,
        priceRange: priceRangeRef,
        bedrooms: bedroomsRef,
        parking: parkingRef,
        condominium: condominiumRef,
      };

      if (refs[name] && refs[name].current) {
        refs[name].current.classList.remove("hero-initialized-active");
      }
    }

    const updated = { ...filters, [name]: value };
    setFilters(updated);
    onFilterChange && onFilterChange(updated);
  };

  const handleSearch = () => {
    // Apenas notifica que os filtros foram aplicados
    onFilterChange && onFilterChange(filters);
  };

  const clearFilters = () => {
    const cleared = {
      purpose: "all",
      propertyType: "all",
      city: "all",
      neighborhood: "all",
      condominium: "all",
      bedrooms: "all",
      parking: "all",
      priceRange: "all",
    };
    setFilters(cleared);
    onFilterChange && onFilterChange(cleared);

    // Remover todos os estilos ativos
    setInitializedFromHero({
      purpose: false,
      propertyType: false,
      city: false,
      neighborhood: false,
      condominium: false,
      bedrooms: false,
      parking: false,
      priceRange: false,
    });

    // Remover classes de ativo de todos os refs
    [
      purposeRef,
      cityRef,
      neighborhoodRef,
      propertyTypeRef,
      priceRangeRef,
      bedroomsRef,
      parkingRef,
      condominiumRef,
    ].forEach((ref) => {
      if (ref.current) {
        ref.current.classList.remove("hero-initialized-active");
      }
    });
  };

  // Verifica se um filtro deve ter estilo ativo
  const shouldBeActive = (fieldName) => {
    return (
      initializedFromHero[fieldName] &&
      filters[fieldName] &&
      filters[fieldName] !== "all"
    );
  };

  // Verifica se o campo tem valor
  const hasValue = (field) => filters[field] !== "all";

  // Classes condicionais para os selects - IGUAL AO HERO
  const getSelectClass = (fieldName, ref) => {
    const baseClass =
      "w-full pl-12 pr-10 py-3.5 border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium form-select-identical focus:outline-none focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/10 transition-all duration-300 cursor-pointer";
    const heroActiveClass = shouldBeActive(fieldName)
      ? "!border-[#D4A24D] !ring-2 !ring-[#D4A24D]/10 hero-initialized-active"
      : "";

    return `${baseClass} ${heroActiveClass}`;
  };

  return (
    <>
      {/* ESTILOS GLOBAIS - IGUAIS AO HERO */}
      <style jsx="true" global="true">{`
        .form-select-identical {
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23a0aec0'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 20px center;
          background-size: 20px;
        }

        .form-select-identical:focus {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23D4A24D'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
        }

        .hero-initialized-active {
          border-color: #d4a24d !important;
          box-shadow: 0 0 0 3px rgba(212, 162, 77, 0.2) !important;
          animation: pulse-gold 2s infinite;
        }

        @keyframes pulse-gold {
          0% {
            box-shadow: 0 0 0 0 rgba(212, 162, 77, 0.4);
          }
          70% {
            box-shadow: 0 0 0 6px rgba(212, 162, 77, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(212, 162, 77, 0);
          }
        }
      `}</style>

      {/* SEÇÃO DE FILTROS - LAYOUT ORIGINAL COM BOTÃO BUSCAR */}
      <section
        className="w-full rounded-2xl bg-white/90 backdrop-blur-sm p-6 relative overflow-hidden"
        style={{
          border: "double 3px transparent",
          backgroundImage: `
            linear-gradient(white, white),
            linear-gradient(90deg, #3b82f6, #e6a400)
          `,
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxSizing: "border-box",
        }}
      >
        {/* Brilho suave nas bordas */}
        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-r from-blue-400/5 via-transparent to-amber-400/5 pointer-events-none" />

        {/* Pontos de luz sutis nos cantos */}
        <div className="absolute -top-[1px] -left-[1px] w-6 h-6 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full" />
        <div className="absolute -top-[1px] -right-[1px] w-6 h-6 bg-gradient-to-bl from-amber-400/20 to-transparent rounded-full" />

        {/* Efeito de neon nas bordas */}
        <div className="absolute inset-0 rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.1),0_0_30px_rgba(230,164,0,0.05)] pointer-events-none" />

        {/* TÍTULO */}
        <div className="flex items-center justify-center gap-3 text-[#e6a400] text-2xl font-extrabold uppercase mb-6 pb-4 border-b border-[#e6a400]/20 relative z-10">
          <i className="fas fa-search"></i>
          Buscar
        </div>

        {/* 👉 NOVO: Badge indicando que filtros foram pré-selecionados */}
        {Object.values(initializedFromHero).some((val) => val === true) && (
          <div className="absolute top-6 right-6 z-20">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#e6a400]/10 text-[#e6a400] border border-[#e6a400]/30">
              <i className="fas fa-bolt text-[10px]"></i>
              Filtro ativo
            </span>
          </div>
        )}

        {/* GRID COM LAYOUT ORIGINAL - BOTÃO BUSCAR NA MESMA LINHA */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end relative z-10">
          {/* FINALIDADE - COM ÍCONE DE CHAVE/CASA */}
          <div className="relative">
            <i
              className={`fas ${
                filters.purpose === "rent" ? "fa-key" : "fa-home"
              } absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors duration-300 z-10 ${
                hasValue("purpose") ? "text-[#D4A24D]" : "text-gray-400"
              }`}
            ></i>
            <select
              ref={purposeRef}
              className={getSelectClass("purpose", purposeRef)}
              value={filters.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
            >
              <option value="all">Finalidade</option>
              <option value="buy">Comprar</option>
              <option value="rent">Alugar</option>
            </select>
          </div>

          {/* TIPO DE IMÓVEL - COM ÍCONE DE EDIFÍCIO */}
          <div className="relative">
            <i
              className={`fas fa-building absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors duration-300 z-10 ${
                hasValue("propertyType") ? "text-[#D4A24D]" : "text-gray-400"
              }`}
            ></i>
            <select
              ref={propertyTypeRef}
              className={getSelectClass("propertyType", propertyTypeRef)}
              value={filters.propertyType}
              onChange={(e) => handleChange("propertyType", e.target.value)}
            >
              <option value="all">Tipo de imóvel</option>
              <option value="casa">Casa</option>
              <option value="apartamento">Apartamento</option>
              <option value="duplex">Duplex</option>
              <option value="comercial">Comercial</option>
            </select>
          </div>

          {/* CIDADE - COM ÍCONE DE CIDADE */}
          <div className="relative">
            <i
              className={`fas fa-city absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors duration-300 z-10 ${
                hasValue("city") ? "text-[#D4A24D]" : "text-gray-400"
              }`}
            ></i>
            <select
              ref={cityRef}
              className={getSelectClass("city", cityRef)}
              value={filters.city}
              onChange={(e) => handleChange("city", e.target.value)}
            >
              <option value="all">Cidade</option>
              <option value="Açailândia">Açailândia</option>
              <option value="Imperatriz">Imperatriz</option>
              <option value="São Luís">São Luís</option>
            </select>
          </div>

          {/* BAIRRO - COM ÍCONE DE LOCALIZAÇÃO */}
          <div className="relative">
            <i
              className={`fas fa-map-marker-alt absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors duration-300 z-10 ${
                hasValue("neighborhood") ? "text-[#D4A24D]" : "text-gray-400"
              }`}
            ></i>
            <select
              ref={neighborhoodRef}
              className={getSelectClass("neighborhood", neighborhoodRef)}
              value={filters.neighborhood}
              onChange={(e) => handleChange("neighborhood", e.target.value)}
            >
              <option value="all">Bairro</option>
              <option value="Centro">Centro</option>
              <option value="Barra Azul">Barra Azul</option>
              <option value="Jardim Glória">Jardim Glória</option>
              <option value="Getat">Getat</option>
            </select>
          </div>

          {/* CONDOMÍNIO - COM ÍCONE DE PORTA DE ENTRADA */}
          <div className="relative">
            <i
              className={`fas fa-door-closed absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors duration-300 z-10 ${
                hasValue("condominium") ? "text-[#D4A24D]" : "text-gray-400"
              }`}
            ></i>
            <select
              ref={condominiumRef}
              className={getSelectClass("condominium", condominiumRef)}
              value={filters.condominium}
              onChange={(e) => handleChange("condominium", e.target.value)}
            >
              <option value="all">Condomínio</option>
              <option value="yes">Em condomínio</option>
              <option value="no">Sem condomínio</option>
            </select>
          </div>

          {/* QUARTOS - COM ÍCONE DE CAMA */}
          <div className="relative">
            <i
              className={`fas fa-bed absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors duration-300 z-10 ${
                hasValue("bedrooms") ? "text-[#D4A24D]" : "text-gray-400"
              }`}
            ></i>
            <select
              ref={bedroomsRef}
              className={getSelectClass("bedrooms", bedroomsRef)}
              value={filters.bedrooms}
              onChange={(e) => handleChange("bedrooms", e.target.value)}
            >
              <option value="all">Quartos</option>
              <option value="1">Um quarto</option>
              <option value="2">Dois quartos</option>
              <option value="3">Três quartos</option>
              <option value="4+">Quatro ou mais quartos</option>
            </select>
          </div>

          {/* VAGAS - COM ÍCONE DE CARRO */}
          <div className="relative">
            <i
              className={`fas fa-car absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors duration-300 z-10 ${
                hasValue("parking") ? "text-[#D4A24D]" : "text-gray-400"
              }`}
            ></i>
            <select
              ref={parkingRef}
              className={getSelectClass("parking", parkingRef)}
              value={filters.parking}
              onChange={(e) => handleChange("parking", e.target.value)}
            >
              <option value="all">Vagas</option>
              <option value="1">Uma vaga</option>
              <option value="2">Duas vagas</option>
              <option value="3+">Três ou mais vagas</option>
            </select>
          </div>

          {/* FAIXA DE PREÇO - COM ÍCONE DE ETIQUETA */}
          <div className="relative">
            <i
              className={`fas fa-tag absolute left-4 top-1/2 transform -translate-y-1/2 text-lg transition-colors duration-300 z-10 ${
                hasValue("priceRange") ? "text-[#D4A24D]" : "text-gray-400"
              }`}
            ></i>
            <select
              ref={priceRangeRef}
              className={getSelectClass("priceRange", priceRangeRef)}
              value={filters.priceRange}
              onChange={(e) => handleChange("priceRange", e.target.value)}
            >
              <option value="all">Faixa de preço</option>
              <option value="0-100000">Até R$ 100.000</option>
              <option value="100000-200000">R$ 100.000 – R$ 200.000</option>
              <option value="200000-300000">R$ 200.000 – R$ 300.000</option>
              <option value="300000+">Acima de R$ 300.000</option>
            </select>
          </div>

          {/* BOTÃO DE BUSCAR - MANTIDO ORIGINAL */}
          <button
            onClick={handleSearch}
            className="h-[52px] rounded-lg font-bold uppercase flex items-center justify-center gap-2
                     bg-gradient-to-r from-white to-[#e6a400]/90
                     text-gray-900 border border-[#e6a400]/40
                     shadow hover:brightness-95 transition-all duration-300
                     hover:shadow-lg hover:translate-y-[-2px]"
          >
            <i className="fas fa-search text-[#e6a400]"></i>
            Buscar
          </button>

          {/* BOTÃO PARA LIMPAR FILTROS ATIVOS DO HERO */}
          {Object.values(initializedFromHero).some((val) => val === true) && (
            <button
              type="button"
              onClick={clearFilters}
              className="h-[52px] rounded-lg font-bold uppercase flex items-center justify-center gap-2
                       bg-gradient-to-r from-gray-100 to-gray-200
                       text-gray-700 border border-gray-300
                       shadow hover:brightness-95 transition-all duration-300
                       hover:shadow-lg hover:translate-y-[-2px]"
            >
              <i className="fas fa-times text-gray-500"></i>
              Limpar
            </button>
          )}
        </div>
      </section>
    </>
  );
};

export default Filtros;
