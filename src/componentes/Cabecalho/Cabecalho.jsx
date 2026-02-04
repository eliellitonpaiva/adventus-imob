import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Cabecalho.css";

const Cabecalho = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="cabecalho-adventus">
      <div className="cabecalho-container">
        <div className="cabecalho-grid">
          {/* Logo */}
          <div className="cabecalho-logo">
            <Link to="/">
              <img
                src="https://adventusimobiliaria.com.br/img/adventusimobiliaria.png"
                alt="Adventus Imobiliária"
                className="logo-img"
              />
            </Link>
          </div>

          {/* Menu desktop */}
          <nav className="cabecalho-nav-desktop">
            <div className="nav-links">
              <Link to="/" className="nav-link" onClick={closeMenu}>
                <i className="fas fa-home nav-icon"></i>
                <span>Home</span>
              </Link>
              <Link
                to="/institucional"
                className="nav-link"
                onClick={closeMenu}
              >
                <i className="fas fa-building nav-icon"></i>
                <span>Institucional</span>
              </Link>
              <Link to="/comprar" className="nav-link" onClick={closeMenu}>
                <i className="fas fa-hand-holding-usd nav-icon"></i>
                <span>Comprar</span>
              </Link>
              <Link to="/alugar" className="nav-link" onClick={closeMenu}>
                <i className="fas fa-key nav-icon"></i>
                <span>Alugar</span>
              </Link>
              <Link to="/contato" className="nav-link" onClick={closeMenu}>
                <i className="fas fa-headset nav-icon"></i>
                <span>Contato</span>
              </Link>
            </div>
          </nav>

          {/* Redes sociais e WhatsApp - DESKTOP */}
          <div className="cabecalho-direita-desktop">
            <a href="#" className="rede-social">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="rede-social">
              <i className="fab fa-facebook-f"></i>
            </a>
            {/* WhatsApp Header Button */}
            <a
              href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: falar com um corretor."
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-btn-desktop"
            >
              <span className="whatsapp-text">Chama no ZAP!</span>
              <span className="whatsapp-icon-wrapper">
                <i className="fab fa-whatsapp"></i>
              </span>
            </a>
          </div>

          {/* Botão hambúrguer - MOBILE */}
          <div className="cabecalho-hamburguer">
            <button
              className="hamburguer-btn"
              onClick={toggleMenu}
              aria-label="Menu"
            >
              <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          className={`cabecalho-nav-mobile ${menuOpen ? "mobile-menu-open" : ""}`}
        >
          <Link to="/" className="mobile-link" onClick={closeMenu}>
            <i className="fas fa-home mobile-icon"></i>
            <span>Home</span>
          </Link>
          <Link to="/institucional" className="mobile-link" onClick={closeMenu}>
            <i className="fas fa-building mobile-icon"></i>
            <span>Institucional</span>
          </Link>
          <Link to="/comprar" className="mobile-link" onClick={closeMenu}>
            <i className="fas fa-hand-holding-usd mobile-icon"></i>
            <span>Comprar</span>
          </Link>
          <Link to="/alugar" className="mobile-link" onClick={closeMenu}>
            <i className="fas fa-key mobile-icon"></i>
            <span>Alugar</span>
          </Link>
          <Link to="/contato" className="mobile-link" onClick={closeMenu}>
            <i className="fas fa-headset mobile-icon"></i>
            <span>Contato</span>
          </Link>

          {/* Redes sociais no mobile menu */}
          <div className="mobile-redes-sociais">
            <a href="#" className="mobile-rede-social">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="mobile-rede-social">
              <i className="fab fa-facebook-f"></i>
            </a>
          </div>

          {/* WhatsApp no mobile menu */}
          <a
            href="https://wa.me/5599988087867?text=Olá! Vim pelo site da Adventus.%0AInteresse: falar com um corretor."
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-btn-mobile"
            onClick={closeMenu}
          >
            <span>Chama no WhatsApp</span>
            <span className="whatsapp-icon-wrapper-mobile">
              <i className="fab fa-whatsapp"></i>
            </span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default Cabecalho;
