// src/componentes/Layout/Layout.jsx
import React from "react";
import { Outlet } from "react-router-dom"; // ✅ TEM QUE TER ISSO
import Cabecalho from "../Cabecalho/Cabecalho";
import Rodape from "../Rodape/Rodape";
import "./Layout.css";

function Layout() {
  return (
    <div className="layout-container">
      <Cabecalho />
      <main className="layout-main">
        <Outlet /> {/* ✅ É AQUI QUE O CONTEÚDO VAI APARECER */}
      </main>
      <Rodape />
    </div>
  );
}

export default Layout;
