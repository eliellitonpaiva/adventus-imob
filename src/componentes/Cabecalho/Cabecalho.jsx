import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Cabecalho = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ❌ REMOVIDO: handleClick que dava preventDefault e quebrava a navegação

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // Mantive seu CSS injetado para garantir que não apareça bordas de foco
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      *:focus, *:focus-visible, *:focus-within {
        outline: none !important;
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl py-2 shadow-lg shadow-black/5"
          : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="relative z-10">
            <img
              src="https://adventusimobiliaria.com.br/img/adventusimobiliaria.png"
              alt="Adventus Imobiliária"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* COMPRAR E ALUGAR - MOBILE */}
          <div className="lg:hidden flex items-center gap-1.5">
            <Link
              to="/comprar"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#D4A24D] text-white text-xs font-medium hover:bg-[#D4A24D]/90 transition-all duration-300 shadow-sm shadow-[#D4A24D]/30"
              onClick={closeMenu}
            >
              <i className="fas fa-hand-holding-usd text-xs"></i>
              <span>Comprar</span>
            </Link>
            <Link
              to="/alugar"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-all duration-300 ml-1"
              onClick={closeMenu}
            >
              <i className="fas fa-key text-xs text-[#D4A24D]"></i>
              <span>Alugar</span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center justify-center flex-1 max-w-3xl mx-auto">
            <div className="flex items-center justify-between w-full px-4">
              <Link
                to="/"
                className="nav-link text-gray-700 hover:text-[#D4A24D] transition-colors duration-300 text-sm font-medium flex items-center gap-2"
              >
                <i className="fas fa-home text-[#D4A24D]"></i>
                <span>Home</span>
              </Link>

              <Link
                to="/sobre-nos"
                className="nav-link text-gray-700 hover:text-[#D4A24D] transition-colors duration-300 text-sm font-medium flex items-center gap-2"
              >
                <i className="fas fa-building text-[#D4A24D]"></i>
                <span>Sobre Nós</span>
              </Link>

              <Link
                to="/comprar"
                className="nav-link text-gray-700 hover:text-[#D4A24D] transition-colors duration-300 text-sm font-medium flex items-center gap-2"
              >
                <i className="fas fa-hand-holding-usd text-[#D4A24D]"></i>
                <span>Comprar</span>
              </Link>

              <Link
                to="/alugar"
                className="nav-link text-gray-700 hover:text-[#D4A24D] transition-colors duration-300 text-sm font-medium flex items-center gap-2"
              >
                <i className="fas fa-key text-[#D4A24D]"></i>
                <span>Alugar</span>
              </Link>
            </div>
          </nav>

          {/* Área Direita Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#D4A24D] hover:bg-gray-200 transition-all duration-300"
            >
              <i className="fab fa-instagram text-sm"></i>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#D4A24D] hover:bg-gray-200 transition-all duration-300"
            >
              <i className="fab fa-facebook-f text-sm"></i>
            </a>

            <a
              href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4A24D] text-white font-medium text-sm hover:bg-[#D4A24D]/90 transition-all duration-300 hover:scale-105 shadow-md shadow-[#D4A24D]/30"
            >
              <span>Chama no ZAP!</span>
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>

          {/* Botão Hamburguer Mobile */}
          <div className="lg:hidden">
            <button
              onClick={toggleMenu}
              className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center text-[#D4A24D] hover:bg-gray-200 transition-all duration-300"
            >
              <i
                className={`fas ${menuOpen ? "fa-times" : "fa-bars"} text-sm`}
              ></i>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div
          className={`lg:hidden fixed left-0 right-0 bg-white border-t border-gray-200 shadow-xl transition-all duration-500 ease-in-out ${
            menuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          style={{
            top: "72px",
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        >
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-2">
            <Link
              to="/"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3"
              onClick={closeMenu}
            >
              <i className="fas fa-home w-4 text-[#D4A24D]"></i>
              <span>Home</span>
            </Link>
            <Link
              to="/sobre-nos"
              className="px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-3"
              onClick={closeMenu}
            >
              <i className="fas fa-building w-4 text-[#D4A24D]"></i>
              <span>Sobre nós</span>
            </Link>
            {/* ... outros links mobile seguindo o mesmo padrão ... */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Cabecalho;
