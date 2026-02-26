import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("comprar");
  const [touchStart, setTouchStart] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Refs para os dropdowns
  const dropdownRef = useRef(null);
  const cityRef = useRef(null);
  const propertyRef = useRef(null);
  const bedroomRef = useRef(null);

  const [formValues, setFormValues] = useState({
    city: "",
    propertyType: "",
    bedrooms: "",
  });

  const cityOptions = [
    { id: "acailandia", label: "Açailândia" },
    { id: "imperatriz", label: "Imperatriz" },
  ];

  const propertyOptions = [
    { id: "apartamento", label: "Apartamento" },
    { id: "casa", label: "Casa" },
    { id: "terreno", label: "Terreno" },
    { id: "comercial", label: "Comercial" },
    { id: "sobrado", label: "Sobrado" },
    { id: "kitnet", label: "Kitnet" },
    { id: "fazenda", label: "Fazenda" },
    { id: "chacara", label: "Chácara" },
    { id: "galpao", label: "Galpão" },
  ];

  const bedroomOptions = [
    { id: "1", label: "1 Dormitório" },
    { id: "2", label: "2+ Dormitórios" },
    { id: "3", label: "3+ Dormitórios" },
    { id: "4", label: "4+ Dormitórios" },
  ];

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!openDropdown) return;

      const isOutside =
        cityRef.current &&
        !cityRef.current.contains(event.target) &&
        propertyRef.current &&
        !propertyRef.current.contains(event.target) &&
        bedroomRef.current &&
        !bedroomRef.current.contains(event.target);

      if (isOutside) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [openDropdown]);

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchEnd - touchStart;
    if (swipeDistance > 40) setActiveTab("alugar");
    else if (swipeDistance < -40) setActiveTab("comprar");
    setTouchStart(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = { tipo: activeTab, ...formValues };
    localStorage.setItem("hero_filters", JSON.stringify(searchParams));
    navigate(`/${activeTab}`, { state: searchParams });
  };

  return (
    <section className="w-full relative" style={{ backgroundColor: "#31363E" }}>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(212, 162, 77, 0.1);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #D4A24D;
          border-radius: 20px;
          transition: all 0.3s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c0903d;
        }
      `,
        }}
      />

      {/* IMAGEM: Topo e laterais preenchidos (MANTIDA IGUAL) */}
      <div className="absolute top-0 left-0 w-full h-[400px] md:h-[500px] lg:h-[580px]">
        <img
          src="https://adventusimobiliaria.com.br/img/banner/image/20/Equipe.jpg"
          alt="Equipe Adventus Imobiliária"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#31363E]"></div>
      </div>

      {/* CONTEÚDO - POSIÇÃO MANTIDA */}
      <div className="relative top-[220px] md:top-[280px] lg:top-[330px] z-20 mx-auto max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="mb-3 md:mb-4 text-center px-4">
          <h1 className="text-[28px] md:text-[42px] lg:text-[48px] font-extrabold text-white drop-shadow-[0_4px_15px_rgba(0,0,0,0.9)] tracking-tight leading-tight">
            Encontre seu lar ideal
          </h1>
        </div>

        {/* BOX DO FORMULÁRIO - AUMENTADA VERTICALMENTE (DA PÍLULA PRA BAIXO) */}
        <div className="bg-white/90 backdrop-blur-md rounded-none md:rounded-2xl p-6 md:p-7 lg:p-8 border border-white/20 shadow-md w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] md:static md:w-full md:max-w-6xl md:mx-auto">
          {/* SELETOR - PÍLULA (TAMBÉM AUMENTADA) */}
          <div className="mb-6 w-full px-0 md:px-0">
            <div className="max-w-[280px] md:max-w-[300px] mx-auto lg:mx-0">
              <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ WebkitTapHighlightColor: "transparent" }}
                className="relative bg-gray-900/95 rounded-full h-12 md:h-14 w-full p-1.5 flex items-center border border-gray-300 shadow-inner overflow-hidden cursor-pointer touch-pan-x"
              >
                <div
                  className={`absolute h-[calc(100%-12px)] w-[calc(50%-6px)] bg-[#D4A24D] rounded-full shadow-md transition-all duration-300 ease-out z-0 ${
                    activeTab === "comprar"
                      ? "translate-x-0"
                      : "translate-x-full"
                  }`}
                  style={{ left: "6px" }}
                ></div>
                <button
                  type="button"
                  onClick={() => setActiveTab("comprar")}
                  className={`relative z-10 flex-1 h-full font-bold text-sm md:text-base transition-colors duration-300 flex items-center justify-center bg-transparent border-none outline-none focus:outline-none focus:ring-0 ${
                    activeTab === "comprar" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Comprar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("alugar")}
                  className={`relative z-10 flex-1 h-full font-bold text-sm md:text-base transition-colors duration-300 flex items-center justify-center bg-transparent border-none outline-none focus:outline-none focus:ring-0 ${
                    activeTab === "alugar" ? "text-white" : "text-gray-300"
                  }`}
                >
                  Alugar
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3">
              {/* DROPDOWN CIDADE */}
              <div className="relative w-full" ref={cityRef}>
                <div
                  onClick={() => toggleDropdown("city")}
                  className={`flex items-center w-full h-[60px] md:h-[64px] px-5 bg-white/80 border ${
                    openDropdown === "city"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200"
                  } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                >
                  <i
                    className={`fas fa-map-marker-alt mr-3 text-base ${formValues.city ? "text-[#D4A24D]" : "text-gray-400"}`}
                  ></i>
                  <span
                    className={`flex-1 text-base md:text-lg font-semibold ${formValues.city ? "text-gray-700" : "text-gray-400"}`}
                  >
                    {formValues.city
                      ? cityOptions.find((opt) => opt.id === formValues.city)
                          ?.label
                      : "Cidade"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      openDropdown === "city" ? "rotate-180 text-[#D4A24D]" : ""
                    }`}
                  ></i>
                </div>

                {openDropdown === "city" && (
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden">
                    {cityOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => handleInputChange("city", opt.id)}
                        className={`flex items-center justify-between px-5 py-4 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-200 ${
                          formValues.city === opt.id ? "bg-[#D4A24D]/5" : ""
                        }`}
                      >
                        <span
                          className={`text-base md:text-lg font-medium ${
                            formValues.city === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {formValues.city === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm"></i>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* DROPDOWN TIPO IMÓVEL */}
              <div className="relative w-full" ref={propertyRef}>
                <div
                  onClick={() => toggleDropdown("propertyType")}
                  className={`flex items-center w-full h-[60px] md:h-[64px] px-5 bg-white/80 border ${
                    openDropdown === "propertyType"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200"
                  } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                >
                  <i
                    className={`fas fa-building mr-3 text-base ${formValues.propertyType ? "text-[#D4A24D]" : "text-gray-400"}`}
                  ></i>
                  <span
                    className={`flex-1 text-base md:text-lg font-semibold ${formValues.propertyType ? "text-gray-700" : "text-gray-400"}`}
                  >
                    {formValues.propertyType
                      ? propertyOptions.find(
                          (opt) => opt.id === formValues.propertyType,
                        )?.label
                      : "Tipo do imóvel"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      openDropdown === "propertyType"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  ></i>
                </div>

                {openDropdown === "propertyType" && (
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden">
                    <div
                      className={`${
                        propertyOptions.length > 3
                          ? "max-h-[220px] overflow-y-auto custom-scrollbar"
                          : ""
                      }`}
                    >
                      {propertyOptions.map((opt) => (
                        <div
                          key={opt.id}
                          onClick={() =>
                            handleInputChange("propertyType", opt.id)
                          }
                          className={`flex items-center justify-between px-5 py-4 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-200 ${
                            formValues.propertyType === opt.id
                              ? "bg-[#D4A24D]/5"
                              : ""
                          }`}
                        >
                          <span
                            className={`text-base md:text-lg font-medium ${
                              formValues.propertyType === opt.id
                                ? "text-[#D4A24D] font-semibold"
                                : "text-gray-600"
                            }`}
                          >
                            {opt.label}
                          </span>
                          {formValues.propertyType === opt.id && (
                            <i className="fas fa-check text-[#D4A24D] text-sm"></i>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DROPDOWN DORMITÓRIOS */}
              <div className="relative w-full" ref={bedroomRef}>
                <div
                  onClick={() => toggleDropdown("bedrooms")}
                  className={`flex items-center w-full h-[60px] md:h-[64px] px-5 bg-white/80 border ${
                    openDropdown === "bedrooms"
                      ? "border-[#D4A24D] ring-2 ring-[#D4A24D]/20"
                      : "border-gray-200"
                  } rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-md`}
                >
                  <i
                    className={`fas fa-bed mr-3 text-base ${formValues.bedrooms ? "text-[#D4A24D]" : "text-gray-400"}`}
                  ></i>
                  <span
                    className={`flex-1 text-base md:text-lg font-semibold ${formValues.bedrooms ? "text-gray-700" : "text-gray-400"}`}
                  >
                    {formValues.bedrooms
                      ? bedroomOptions.find(
                          (opt) => opt.id === formValues.bedrooms,
                        )?.label
                      : "Dormitórios"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-all duration-300 ${
                      openDropdown === "bedrooms"
                        ? "rotate-180 text-[#D4A24D]"
                        : ""
                    }`}
                  ></i>
                </div>

                {openDropdown === "bedrooms" && (
                  <div className="absolute top-[105%] left-0 w-full bg-white rounded-xl shadow-2xl border border-gray-100 z-[100] overflow-hidden">
                    {bedroomOptions.map((opt) => (
                      <div
                        key={opt.id}
                        onClick={() => handleInputChange("bedrooms", opt.id)}
                        className={`flex items-center justify-between px-5 py-4 hover:bg-[#D4A24D]/10 cursor-pointer border-b border-gray-50 last:border-0 transition-colors duration-200 ${
                          formValues.bedrooms === opt.id ? "bg-[#D4A24D]/5" : ""
                        }`}
                      >
                        <span
                          className={`text-base md:text-lg font-medium ${
                            formValues.bedrooms === opt.id
                              ? "text-[#D4A24D] font-semibold"
                              : "text-gray-600"
                          }`}
                        >
                          {opt.label}
                        </span>
                        {formValues.bedrooms === opt.id && (
                          <i className="fas fa-check text-[#D4A24D] text-sm"></i>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* BOTÃO BUSCAR */}
              <button
                type="submit"
                className="w-full bg-[#D4A24D] text-white font-extrabold text-base md:text-lg rounded-xl h-[60px] md:h-[64px] flex items-center justify-center gap-3 hover:bg-[#c0903d] transition-all shadow-lg active:scale-95 outline-none focus:outline-none"
              >
                <i className="fas fa-search"></i> BUSCAR IMÓVEIS
              </button>
            </div>
          </form>

          {/* TEXTO "MAIS DE 500 IMÓVEIS" - AGORA MAIS PRÓXIMO DO LIMITE INFERIOR */}
          <p className="text-sm md:text-base text-gray-700 text-center mt-8 flex items-center justify-center gap-2 font-light italic">
            <i className="fas fa-check-circle text-[#D4A24D]"></i>
            Mais de 500 imóveis disponíveis
          </p>
        </div>
      </div>

      {/* ESPAÇO PROPORCIONAL - AJUSTADO PARA COMPENSAR O AUMENTO */}
      <div className="h-[200px] md:h-[315px] lg:h-[375px]"></div>
    </section>
  );
};

export default Hero;
