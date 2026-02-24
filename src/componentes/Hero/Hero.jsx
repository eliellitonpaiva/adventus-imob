import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("comprar");
  const [formValues, setFormValues] = useState({
    priceRange: "",
    propertyType: "",
    bedrooms: "",
  });

  const handleInputChange = (field, value) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = { tipo: activeTab, ...formValues };
    localStorage.setItem("hero_filters", JSON.stringify(searchParams));
    navigate(`/${activeTab}`, { state: searchParams });
  };

  const cleanButtonStyle = {
    outline: "none",
    boxShadow: "none",
    WebkitTapHighlightColor: "transparent",
    backgroundColor: "transparent",
    border: "none",
  };

  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* CONTAINER DA IMAGEM 
          Ajustado: h-[500px] em notebooks (md) e max-h-[80vh] para nunca sumir o form 
      */}
      <div className="relative w-full h-[400px] md:h-[550px] lg:h-[650px] max-h-[85vh] overflow-hidden">
        <img
          src="https://adventusimobiliaria.com.br/img/banner/image/20/Equipe.jpg"
          alt="Imóveis Adventus"
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay gradiente mais suave para não "achatar" a imagem */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/70"></div>
      </div>

      {/* CONTAINER DO CONTEÚDO 
          Mudamos de margem negativa fixa para um posicionamento que se adapta melhor
      */}
      <div className="relative -mt-32 md:-mt-48 lg:-mt-56 z-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* TÍTULO - Ajustado para não empurrar o form muito para baixo */}
          <div className="mb-6 md:mb-10 text-center md:text-left">
            <h1 className="text-[28px] md:text-[45px] lg:text-[56px] font-bold text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-tight leading-tight">
              Encontre seu <span className="text-[#D4A24D]">lar ideal</span>
            </h1>
          </div>

          {/* BOX DO FORMULÁRIO */}
          <div className="bg-white rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] p-5 md:p-8 border border-gray-100">
            {/* SEGMENTED CONTROL - Abas Comprar/Alugar */}
            <div className="mb-6 max-w-[280px] md:max-w-xs mx-auto md:mx-0">
              <div className="relative bg-gray-100 rounded-full h-10 md:h-12 w-full p-1 flex items-center">
                <div
                  className={`absolute h-8 md:h-10 w-[calc(50%-4px)] bg-[#D4A24D] rounded-full shadow-md transition-transform duration-300 ease-in-out ${
                    activeTab === "comprar"
                      ? "translate-x-0"
                      : "translate-x-full"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setActiveTab("comprar")}
                  style={cleanButtonStyle}
                  className={`relative z-10 flex-1 h-full font-bold text-xs md:text-base transition-colors duration-300 flex items-center justify-center ${
                    activeTab === "comprar" ? "text-white" : "text-gray-600"
                  }`}
                >
                  <i className="fas fa-home mr-2"></i> Comprar
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("alugar")}
                  style={cleanButtonStyle}
                  className={`relative z-10 flex-1 h-full font-bold text-xs md:text-base transition-colors duration-300 flex items-center justify-center ${
                    activeTab === "alugar" ? "text-white" : "text-gray-600"
                  }`}
                >
                  <i className="fas fa-key mr-2"></i> Alugar
                </button>
              </div>
            </div>

            {/* FORMULÁRIO - Grid responsivo */}
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
                {/* Preço */}
                <div className="relative w-full">
                  <i
                    className={`fas fa-tag absolute left-4 top-1/2 -translate-y-1/2 text-sm z-10 ${formValues.priceRange ? "text-[#D4A24D]" : "text-gray-400"}`}
                  ></i>
                  <select
                    className="w-full h-[50px] md:h-[58px] pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-[#D4A24D] text-sm cursor-pointer"
                    value={formValues.priceRange}
                    onChange={(e) =>
                      handleInputChange("priceRange", e.target.value)
                    }
                  >
                    <option value="">Preço</option>
                    <option value="0-500k">Até R$ 500 mil</option>
                    <option value="500k-1m">R$ 500 mil a 1 Mi</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-[10px] pointer-events-none"></i>
                </div>

                {/* Tipo */}
                <div className="relative w-full">
                  <i
                    className={`fas fa-building absolute left-4 top-1/2 -translate-y-1/2 text-sm z-10 ${formValues.propertyType ? "text-[#D4A24D]" : "text-gray-400"}`}
                  ></i>
                  <select
                    className="w-full h-[50px] md:h-[58px] pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-[#D4A24D] text-sm cursor-pointer"
                    value={formValues.propertyType}
                    onChange={(e) =>
                      handleInputChange("propertyType", e.target.value)
                    }
                  >
                    <option value="">Tipo de imóvel</option>
                    <option value="casa">Casa</option>
                    <option value="apartamento">Apartamento</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-[10px] pointer-events-none"></i>
                </div>

                {/* Dormitórios */}
                <div className="relative w-full">
                  <i
                    className={`fas fa-bed absolute left-4 top-1/2 -translate-y-1/2 text-sm z-10 ${formValues.bedrooms ? "text-[#D4A24D]" : "text-gray-400"}`}
                  ></i>
                  <select
                    className="w-full h-[50px] md:h-[58px] pl-11 pr-10 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:outline-none focus:border-[#D4A24D] text-sm cursor-pointer"
                    value={formValues.bedrooms}
                    onChange={(e) =>
                      handleInputChange("bedrooms", e.target.value)
                    }
                  >
                    <option value="">Dormitórios</option>
                    <option value="1">1 Dormitório</option>
                    <option value="2">2+ Dormitórios</option>
                  </select>
                  <i className="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 text-[10px] pointer-events-none"></i>
                </div>

                {/* Botão Buscar */}
                <button
                  type="submit"
                  className="w-full bg-[#D4A24D] text-white font-bold text-base rounded-xl h-[50px] md:h-[58px] flex items-center justify-center gap-2 hover:bg-[#c0903d] transition-all shadow-md active:scale-95"
                >
                  <i className="fas fa-search"></i> Buscar
                </button>
              </div>
            </form>

            <p className="text-[10px] md:text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-2">
              <i className="fas fa-check-circle text-[#D4A24D]"></i>
              Mais de 500 imóveis disponíveis hoje
            </p>
          </div>
        </div>
      </div>

      <div className="h-12 md:h-20"></div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
    </section>
  );
};

export default Hero;
