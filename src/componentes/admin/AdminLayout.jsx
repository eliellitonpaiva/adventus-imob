import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Detecta páginas que podem ter conteúdo horizontal extenso
  const hasWideContent =
    location.pathname.includes("/admin/leads") ||
    location.pathname.includes("/admin/imoveis");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar onLogout={handleLogout} userName="Adventus Imobiliária" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName="Adventus Imobiliária" userRole="Administrador" />

        <main className="flex-1 overflow-hidden">
          {/* Container de scroll ADAPTATIVO: horizontal apenas quando necessário */}
          <div
            className={`h-full ${hasWideContent ? "overflow-y-auto overflow-x-auto" : "overflow-y-auto overflow-x-hidden"}`}
          >
            {/* Container do conteúdo */}
            <div className="p-4 md:p-6">
              <div
                className={`${hasWideContent ? "min-w-[1024px]" : "max-w-7xl mx-auto"}`}
              >
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Estilos otimizados */}
      <style jsx="true" global="true">{`
        html,
        body,
        #root {
          height: 100%;
          overflow: hidden;
        }

        /* Scrollbar personalizada para toda a aplicação */
        * {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e1 #f1f5f9;
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
