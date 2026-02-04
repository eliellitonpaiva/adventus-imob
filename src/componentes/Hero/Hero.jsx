import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("alugar");

  const [formValues, setFormValues] = useState({
    city: "",
    neighborhood: "",
    propertyType: "",
    priceRange: "",
    bedrooms: "",
    parking: "",
  });

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (activeTab === "alugar") {
      localStorage.setItem(
        "hero_filters",
        JSON.stringify({
          tipo: "alugar",
          filtros: formValues,
        }),
      );

      navigate("/alugar", {
        state: {
          tipo: "alugar",
          filtros: formValues,
        },
      });
      return;
    }

    if (!formValues.city) {
      alert("Selecione uma cidade para continuar.");
      return;
    }

    localStorage.setItem(
      "hero_filters",
      JSON.stringify({
        tipo: "comprar",
        filtros: formValues,
      }),
    );

    navigate("/comprar", {
      state: {
        tipo: "comprar",
        filtros: formValues,
      },
    });
  };

  const hasValue = (field) => formValues[field] !== "";

  return (
    <>
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
      `}</style>

      {/* SEÇÃO HERO - ALTURA EXATA: 600px */}
      <section className="relative min-h-[600px] flex items-center px-0 overflow-hidden bg-black">
        {/* Background */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-10"
          style={{
            backgroundImage:
              "url('https://adventusimobiliaria.com.br/img/banner/image/20/Equipe.jpg')",
            backgroundPosition: "center 30%",
          }}
        ></div>

        {/* Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-20"></div>

        {/* Container - EXATAMENTE IGUAL */}
        <div className="relative z-30 w-full max-w-7xl mx-auto px-4 py-8 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* BOX COM LARGURA REDUZIDA NO DESKTOP - COMO ARRASTAR BORDA DIREITA NO ILLUSTRATOR */}
            <div className="w-full lg:w-[calc(100%-40px)] lg:max-w-[580px]">
              {/* CARD - REDUZIDO HORIZONTALMENTE (8px de cada lado = 16px total) */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-[30px] lg:px-[22px] lg:py-[30px] shadow-xl border border-white/20">
                {/* TÍTULO - CENTRALIZADO EM TODAS AS TELAS */}
                <h2 className="text-[28px] md:text-[36px] lg:text-[40px] font-bold text-[#1a365d] text-center mb-6 whitespace-nowrap leading-tight">
                  Encontre seu{" "}
                  <span className="text-[#1a365d] font-bold">lar ideal</span>
                </h2>

                {/* TABS - AGORA MAIS COMPACTAS HORIZONTALMENTE */}
                <div className="flex bg-gray-100 rounded-xl p-1 mb-6 lg:px-0">
                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-3 py-[14px] px-5 lg:px-4 rounded-lg border-none transition-all duration-300 ${
                      activeTab === "alugar"
                        ? "bg-[#D4A24D] text-white shadow-md shadow-[#D4A24D]/30"
                        : "bg-transparent text-gray-600 hover:text-[#1a365d] hover:bg-[#1a365d]/5"
                    }`}
                    onClick={() => setActiveTab("alugar")}
                  >
                    <i className="fas fa-key text-[18px]"></i>
                    <span className="font-semibold text-[16px]">Alugar</span>
                  </button>

                  <button
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-3 py-[14px] px-5 lg:px-4 rounded-lg border-none transition-all duration-300 ${
                      activeTab === "comprar"
                        ? "bg-[#D4A24D] text-white shadow-md shadow-[#D4A24D]/30"
                        : "bg-transparent text-gray-600 hover:text-[#1a365d] hover:bg-[#1a365d]/5"
                    }`}
                    onClick={() => setActiveTab("comprar")}
                  >
                    <i className="fas fa-home text-[18px]"></i>
                    <span className="font-semibold text-[16px]">Comprar</span>
                  </button>
                </div>

                {/* FORMULÁRIO - GAP REDUZIDO HORIZONTALMENTE */}
                <form
                  onSubmit={handleSearch}
                  className="space-y-4 lg:space-y-4"
                >
                  {/* LINHA 1 - GAP REDUZIDO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-3">
                    {/* CIDADE - MESMO PADDING VERTICAL, REDUZIDO HORIZONTALMENTE */}
                    <div className="relative">
                      <i
                        className={`fas fa-city absolute left-4 lg:left-3 top-1/2 transform -translate-y-1/2 text-[18px] transition-colors duration-300 z-10 ${
                          hasValue("city") ? "text-[#D4A24D]" : "text-gray-400"
                        }`}
                      ></i>
                      <select
                        className="w-full pl-[52px] lg:pl-[44px] pr-10 lg:pr-9 py-[16px] border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium form-select-identical focus:outline-none focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/10 transition-all duration-300 cursor-pointer"
                        value={formValues.city}
                        onChange={(e) =>
                          handleInputChange("city", e.target.value)
                        }
                      >
                        <option value="">Selecione a cidade</option>
                        <option value="Açailândia">Açailândia</option>
                        <option value="Imperatriz">Imperatriz</option>
                        <option value="São Luís">São Luís</option>
                      </select>
                    </div>

                    {/* BAIRRO */}
                    <div className="relative">
                      <i
                        className={`fas fa-map-marker-alt absolute left-4 lg:left-3 top-1/2 transform -translate-y-1/2 text-[18px] transition-colors duration-300 z-10 ${
                          hasValue("neighborhood")
                            ? "text-[#D4A24D]"
                            : "text-gray-400"
                        }`}
                      ></i>
                      <select
                        className="w-full pl-[52px] lg:pl-[44px] pr-10 lg:pr-9 py-[16px] border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium form-select-identical focus:outline-none focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/10 transition-all duration-300 cursor-pointer"
                        value={formValues.neighborhood}
                        onChange={(e) =>
                          handleInputChange("neighborhood", e.target.value)
                        }
                      >
                        <option value="">Selecione o bairro</option>
                        <option value="Centro">Centro</option>
                        <option value="Barra Azul">Barra Azul</option>
                        <option value="Jardim Glória">Jardim Glória</option>
                      </select>
                    </div>
                  </div>

                  {/* LINHA 2 - GAP REDUZIDO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-3">
                    {/* TIPO */}
                    <div className="relative">
                      <i
                        className={`fas fa-building absolute left-4 lg:left-3 top-1/2 transform -translate-y-1/2 text-[18px] transition-colors duration-300 z-10 ${
                          hasValue("propertyType")
                            ? "text-[#D4A24D]"
                            : "text-gray-400"
                        }`}
                      ></i>
                      <select
                        className="w-full pl-[52px] lg:pl-[44px] pr-10 lg:pr-9 py-[16px] border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium form-select-identical focus:outline-none focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/10 transition-all duration-300 cursor-pointer"
                        value={formValues.propertyType}
                        onChange={(e) =>
                          handleInputChange("propertyType", e.target.value)
                        }
                      >
                        <option value="">Tipo de imóvel</option>
                        <option value="casa">Casa</option>
                        <option value="apartamento">Apartamento</option>
                        <option value="comercial">Comercial</option>
                      </select>
                    </div>

                    {/* PREÇO */}
                    <div className="relative">
                      <i
                        className={`fas fa-tag absolute left-4 lg:left-3 top-1/2 transform -translate-y-1/2 text-[18px] transition-colors duration-300 z-10 ${
                          hasValue("priceRange")
                            ? "text-[#D4A24D]"
                            : "text-gray-400"
                        }`}
                      ></i>
                      <select
                        className="w-full pl-[52px] lg:pl-[44px] pr-10 lg:pr-9 py-[16px] border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium form-select-identical focus:outline-none focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/10 transition-all duration-300 cursor-pointer"
                        value={formValues.priceRange}
                        onChange={(e) =>
                          handleInputChange("priceRange", e.target.value)
                        }
                      >
                        <option value="">Faixa de preço</option>
                        <option value="0-100000">Até R$ 100.000</option>
                        <option value="100000-200000">
                          R$ 100.000 – R$ 200.000
                        </option>
                        <option value="200000-300000">
                          R$ 200.000 – R$ 300.000
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* LINHA 3 - GAP REDUZIDO */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-3">
                    {/* QUARTOS */}
                    <div className="relative">
                      <i
                        className={`fas fa-bed absolute left-4 lg:left-3 top-1/2 transform -translate-y-1/2 text-[18px] transition-colors duration-300 z-10 ${
                          hasValue("bedrooms")
                            ? "text-[#D4A24D]"
                            : "text-gray-400"
                        }`}
                      ></i>
                      <select
                        className="w-full pl-[52px] lg:pl-[44px] pr-10 lg:pr-9 py-[16px] border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium form-select-identical focus:outline-none focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/10 transition-all duration-300 cursor-pointer"
                        value={formValues.bedrooms}
                        onChange={(e) =>
                          handleInputChange("bedrooms", e.target.value)
                        }
                      >
                        <option value="">Quartos</option>
                        <option value="1">1 quarto</option>
                        <option value="2">2 quartos</option>
                        <option value="3">3 quartos</option>
                        <option value="4+">4+ quartos</option>
                      </select>
                    </div>

                    {/* VAGAS */}
                    <div className="relative">
                      <i
                        className={`fas fa-car absolute left-4 lg:left-3 top-1/2 transform -translate-y-1/2 text-[18px] transition-colors duration-300 z-10 ${
                          hasValue("parking")
                            ? "text-[#D4A24D]"
                            : "text-gray-400"
                        }`}
                      ></i>
                      <select
                        className="w-full pl-[52px] lg:pl-[44px] pr-10 lg:pr-9 py-[16px] border-2 border-gray-300 rounded-xl bg-white text-gray-800 font-medium form-select-identical focus:outline-none focus:border-[#D4A24D] focus:ring-2 focus:ring-[#D4A24D]/10 transition-all duration-300 cursor-pointer"
                        value={formValues.parking}
                        onChange={(e) =>
                          handleInputChange("parking", e.target.value)
                        }
                      >
                        <option value="">Vagas</option>
                        <option value="1">1 vaga</option>
                        <option value="2">2 vagas</option>
                        <option value="3+">3+ vagas</option>
                      </select>
                    </div>
                  </div>

                  {/* BOTÃO - MESMA ALTURA, LARGURA REDUZIDA */}
                  <button
                    type="submit"
                    className="w-full py-[18px] px-[30px] lg:px-[24px] bg-gradient-to-r from-[#D4A24D] to-[#E6B85C] text-white text-[18px] font-bold rounded-xl flex items-center justify-center gap-3 cursor-pointer transition-all duration-300 mt-6 shadow-lg shadow-[#D4A24D]/30 hover:shadow-xl hover:shadow-[#D4A24D]/40 hover:translate-y-[-2px] active:translate-y-0 hover:bg-gradient-to-r hover:from-[#C4933E] hover:to-[#D4A24D]"
                  >
                    <i className="fas fa-search text-[18px]"></i>
                    <span>Buscar imóvel</span>
                  </button>
                </form>
              </div>
            </div>

            <div className="hidden lg:block"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
