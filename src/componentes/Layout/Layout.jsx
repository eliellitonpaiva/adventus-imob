// src/componentes/Layout/Layout.jsx
import React from "react";
import Cabecalho from "../Cabecalho/Cabecalho";
import Rodape from "../Rodape/Rodape";
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="layout-container">
      <Cabecalho />
      <main className="layout-main">{children}</main>
      <Rodape />
    </div>
  );
}

export default Layout;
