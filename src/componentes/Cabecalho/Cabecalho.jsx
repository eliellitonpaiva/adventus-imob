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

  // Função para remover o foco de qualquer elemento após o clique
  const handleClick = (e) => {
    e.currentTarget.blur(); // Remove o foco imediatamente após o clique
    if (
      e.currentTarget.tagName === "A" ||
      e.currentTarget.tagName === "BUTTON"
    ) {
      e.preventDefault(); // Previne comportamento padrão se necessário
    }
  };

  // Função para links que devem navegar
  const handleNavigation = (e, path) => {
    e.currentTarget.blur(); // Remove o foco
    closeMenu();
    // Navegação será feita pelo Link do React Router
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  // CSS Global injetado via style tag para garantir
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      *:focus, *:focus-visible, *:focus-within {
        outline: none !important;
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent !important;
      }
      a:focus, button:focus, Link:focus {
        outline: none !important;
        box-shadow: none !important;
      }
      a:focus-visible, button:focus-visible {
        outline: none !important;
        box-shadow: none !important;
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
          <Link
            to="/"
            className="relative z-10"
            onClick={(e) => e.currentTarget.blur()}
          >
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
              onClick={(e) => {
                e.currentTarget.blur();
                closeMenu();
              }}
            >
              <i className="fas fa-hand-holding-usd text-xs"></i>
              <span>Comprar</span>
            </Link>
            <Link
              to="/alugar"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100/80 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs font-medium hover:bg-gray-200 transition-all duration-300 ml-1"
              onClick={(e) => {
                e.currentTarget.blur();
                closeMenu();
              }}
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
                onClick={(e) => e.currentTarget.blur()}
              >
                <i className="fas fa-home text-[#D4A24D]"></i>
                <span>Home</span>
              </Link>
              <Link
                to="/sobre-nos" // ← ALTERADO: de /institucional para /sobre-nos
                className="nav-link text-gray-700 hover:text-[#D4A24D] transition-colors duration-300 text-sm font-medium flex items-center gap-2"
                onClick={(e) => e.currentTarget.blur()}
              >
                <i className="fas fa-building text-[#D4A24D]"></i>
                <span>Sobre Nós</span> {/* ← ALTERADO: texto */}
              </Link>
              <Link
                to="/comprar"
                className="nav-link text-gray-700 hover:text-[#D4A24D] transition-colors duration-300 text-sm font-medium flex items-center gap-2"
                onClick={(e) => e.currentTarget.blur()}
              >
                <i className="fas fa-hand-holding-usd text-[#D4A24D]"></i>
                <span>Comprar</span>
              </Link>
              <Link
                to="/alugar"
                className="nav-link text-gray-700 hover:text-[#D4A24D] transition-colors duration-300 text-sm font-medium flex items-center gap-2"
                onClick={(e) => e.currentTarget.blur()}
              >
                <i className="fas fa-key text-[#D4A24D]"></i>
                <span>Alugar</span>
              </Link>
              <Link
                to="/contato"
                className="nav-link text-gray-700 hover:text-[#D4A24D] transition-colors duration-300 text-sm font-medium flex items-center gap-2"
                onClick={(e) => e.currentTarget.blur()}
              >
                <i className="fas fa-headset text-[#D4A24D]"></i>
                <span>Contato</span>
              </Link>
            </div>
          </nav>

          {/* Área Direita Desktop */}
          <div className="hidden lg:flex items-center space-x-3">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#D4A24D] hover:bg-gray-200 transition-all duration-300"
              onClick={(e) => e.currentTarget.blur()}
            >
              <i className="fab fa-instagram text-sm"></i>
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#D4A24D] hover:bg-gray-200 transition-all duration-300"
              onClick={(e) => e.currentTarget.blur()}
            >
              <i className="fab fa-facebook-f text-sm"></i>
            </a>

            {/* WhatsApp Button Desktop */}
            <a
              href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: falar com um corretor."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#D4A24D] text-white font-medium text-sm hover:bg-[#D4A24D]/90 transition-all duration-300 hover:scale-105 shadow-md shadow-[#D4A24D]/30"
              onClick={(e) => e.currentTarget.blur()}
            >
              <span>Chama no ZAP!</span>
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>

          {/* Botão Hamburguer Mobile */}
          <div className="lg:hidden">
            <button
              onClick={(e) => {
                e.currentTarget.blur();
                toggleMenu();
              }}
              className="w-8 h-8 rounded-lg bg-gray-100 border border-gray-300 flex items-center justify-center text-[#D4A24D] hover:bg-gray-200 hover:border-[#D4A24D]/50 transition-all duration-300"
              aria-label="Menu"
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
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
          style={{
            top: "72px",
            maxHeight: "calc(100vh - 80px)",
            overflowY: "auto",
          }}
        >
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-2 min-h-[300px]">
            <Link
              to="/"
              className="px-4 py-3 text-gray-700 hover:text-[#D4A24D] hover:bg-gray-50 rounded-lg transition-all duration-300 flex items-center gap-3 text-sm"
              onClick={(e) => {
                e.currentTarget.blur();
                closeMenu();
              }}
            >
              <i className="fas fa-home w-4 text-[#D4A24D]"></i>
              <span>Home</span>
            </Link>
            <Link
              to="/sobre-nos"
              className="px-4 py-3 text-gray-700 hover:text-[#D4A24D] hover:bg-gray-50 rounded-lg transition-all duration-300 flex items-center gap-3 text-sm"
              onClick={(e) => {
                e.currentTarget.blur();
                closeMenu();
              }}
            >
              <i className="fas fa-building w-4 text-[#D4A24D]"></i>
              <span>Sobre nós</span>
            </Link>
            <Link
              to="/contato"
              className="px-4 py-3 text-gray-700 hover:text-[#D4A24D] hover:bg-gray-50 rounded-lg transition-all duration-300 flex items-center gap-3 text-sm"
              onClick={(e) => {
                e.currentTarget.blur();
                closeMenu();
              }}
            >
              <i className="fas fa-headset w-4 text-[#D4A24D]"></i>
              <span>Contato</span>
            </Link>

            {/* Redes Sociais Mobile */}
            <div className="flex items-center justify-center gap-3 py-4 mt-2 border-t border-gray-100">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#D4A24D] hover:bg-gray-200 transition-all duration-300"
                onClick={(e) => e.currentTarget.blur()}
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-[#D4A24D] hover:bg-gray-200 transition-all duration-300"
                onClick={(e) => e.currentTarget.blur()}
              >
                <i className="fab fa-facebook-f"></i>
              </a>
            </div>

            {/* WhatsApp Mobile */}
            <div className="flex flex-col items-center pt-2 pb-4">
              <a
                href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: falar com um corretor."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-64 mx-auto px-4 py-3 rounded-full bg-[#D4A24D] text-white font-medium text-sm hover:bg-[#D4A24D]/90 transition-all duration-300 hover:scale-[1.02] shadow-md shadow-[#D4A24D]/30"
                onClick={(e) => {
                  e.currentTarget.blur();
                  closeMenu();
                }}
              >
                <span>Chama no ZAP!</span>
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Cabecalho;
