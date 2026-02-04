import React, { useState } from "react";
import {
  FaHome,
  FaTools,
  FaPaintRoller,
  FaSwimmingPool,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaArchive,
  FaConciergeBell,
  FaChevronDown,
  FaCheck,
} from "react-icons/fa";

const Accordion = () => {
  const [acordeoesAbertos, setAcordeoesAbertos] = useState([]);

  const alternarAcordeao = (index) => {
    setAcordeoesAbertos((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const dadosAcordeao = [
    {
      titulo: "Características do Imóvel",
      icone: <FaHome className="text-amber-500" />,
      itens: [
        "3 Dormitórios (1 suíte)",
        "2 Banheiros sociais",
        "2 Vagas de garagem",
        "Sala de estar",
        "Sala de jantar",
        "Cozinha planejada",
        "Área de serviço",
        "Quintal amplo",
      ],
    },
    {
      titulo: "Infraestrutura",
      icone: <FaTools className="text-amber-500" />,
      itens: [
        "Água encanada",
        "Esgoto tratado",
        "Energia 220V",
        "Rede de gás",
        "Internet fibra óptica",
        "TV a cabo",
        "Sistema de alarme",
        "Portão eletrônico",
      ],
    },
    {
      titulo: "Acabamentos",
      icone: <FaPaintRoller className="text-amber-500" />,
      itens: [
        "Piso porcelanato na sala",
        "Piso cerâmico nos quartos",
        "Portas de madeira maciça",
        "Janelas em alumínio",
        "Forro de gesso",
        "Iluminação em LED",
      ],
    },
    {
      titulo: "Área de Lazer",
      icone: <FaSwimmingPool className="text-amber-500" />,
      itens: [
        "Churrasqueira",
        "Área gourmet",
        "Jardim privativo",
        "Varanda frontal",
        "Quintal arborizado",
      ],
    },
    {
      titulo: "Localização & Vizinhança",
      icone: <FaMapMarkerAlt className="text-amber-500" />,
      itens: [
        "Supermercado (200m)",
        "Escola (300m)",
        "Farmácia (150m)",
        "Igreja (350m)",
      ],
    },
    {
      titulo: "Segurança",
      icone: <FaShieldAlt className="text-amber-500" />,
      itens: ["Sistema de alarme", "Portão eletrônico", "Iluminação externa"],
    },
    {
      titulo: "Armários & Armazenamento",
      icone: <FaArchive className="text-amber-500" />,
      itens: [
        "Armário de cozinha",
        "Guarda-roupa casal",
        "Armário de banheiro",
      ],
    },
    {
      titulo: "Serviços & Utilidades",
      icone: <FaConciergeBell className="text-amber-500" />,
      itens: ["Coleta seletiva", "Iluminação pública", "Segurança privada"],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
        {dadosAcordeao.map((acordeao, index) => (
          <div key={index} className="border-b border-amber-50 last:border-b-0">
            <button
              onClick={() => alternarAcordeao(index)}
              className="w-full px-6 py-5 md:px-8 md:py-6 text-left flex justify-between items-center hover:bg-amber-50 transition-colors duration-300"
            >
              <div className="flex items-center space-x-3">
                {acordeao.icone}
                <span className="font-semibold text-gray-800">
                  {acordeao.titulo}
                </span>
              </div>
              <FaChevronDown
                className={`text-amber-500 transition-transform duration-300 ${
                  acordeoesAbertos.includes(index) ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                acordeoesAbertos.includes(index)
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="px-6 md:px-8 pb-6 md:pb-8 bg-amber-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {acordeao.itens.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center space-x-3"
                    >
                      <FaCheck className="text-amber-500 font-bold flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accordion;
