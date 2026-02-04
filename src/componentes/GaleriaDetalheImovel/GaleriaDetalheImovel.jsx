import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const GaleriaDetalheImovel = () => {
  const [imagemAtual, setImagemAtual] = useState(0);

  const imagens = [
    "https://www.stelaimoveis.com.br/img/slide_files/slide_63.jpg",
    "https://www.stelaimoveis.com.br/img/imoveis/42/foto_principal.jpg",
    "https://www.stelaimoveis.com.br/img/imoveis/247/foto_principal.jpg",
    "https://www.stelaimoveis.com.br/img/imoveis/68/foto_principal.jpg",
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setImagemAtual((prev) => (prev + 1) % imagens.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [imagemAtual, imagens.length]);

  const mudarImagem = (direcao) => {
    setImagemAtual(
      (prev) => (prev + direcao + imagens.length) % imagens.length,
    );
  };

  const selecionarImagem = (index) => {
    setImagemAtual(index);
  };

  return (
    <div className="pt-20">
      <div className="relative mb-8">
        {/* Imagem Principal */}
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-500"
            style={{ backgroundImage: `url('${imagens[imagemAtual]}')` }}
          />

          {/* Controles da Galeria */}
          <div className="absolute inset-0 flex items-center justify-between px-4 md:px-8">
            <button
              onClick={() => mudarImagem(-1)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-amber-500 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <FaChevronLeft className="text-lg" />
            </button>
            <button
              onClick={() => mudarImagem(1)}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-amber-500 hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg"
            >
              <FaChevronRight className="text-lg" />
            </button>
          </div>
        </div>

        {/* Miniaturas */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {imagens.map((imagem, index) => (
              <div
                key={index}
                className={`h-32 rounded-lg bg-cover bg-center cursor-pointer transition-all duration-300 border-2 ${
                  imagemAtual === index
                    ? "border-amber-500 scale-105 shadow-lg"
                    : "border-transparent hover:border-amber-300"
                }`}
                style={{ backgroundImage: `url('${imagem}')` }}
                onClick={() => selecionarImagem(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaleriaDetalheImovel;
