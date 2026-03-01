import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

const AdminLayout = () => {
  const location = useLocation();
  const { toggleTheme, isDark } = useTheme();
  const { logout, user } = useAuth(); // ✅ PEGA O USUÁRIO LOGADO

  const hasWideContent =
    location.pathname.includes("/admin/leads") ||
    location.pathname.includes("/admin/imoveis");

  // Define nome e função baseado no usuário logado
  const userName = user?.name || "Adventus Imobiliária";

  // Formata a função baseado no perfil
  const getUserRole = () => {
    if (!user) return "Administrador";

    const roles = {
      master: "Administrador Master",
      gerente: "Gerente",
      rh: "RH",
      marketing: "Marketing",
      financeiro: "Financeiro",
      corretor: "Corretor",
    };

    return roles[user.role] || user.role || "Administrador";
  };

  return (
    <div
      className={`flex h-screen overflow-hidden 
        ${
          isDark ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        } transition-colors duration-200`}
    >
      <Sidebar onLogout={logout} userName={userName} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          userName={userName}
          userRole={getUserRole()}
          onToggleTheme={toggleTheme}
          isDarkMode={isDark}
          onLogout={logout}
        />

        <main className="flex-1 overflow-hidden">
          <div
            className={`h-full ${
              hasWideContent
                ? "overflow-y-auto overflow-x-auto"
                : "overflow-y-auto overflow-x-hidden"
            }`}
          >
            <div className="p-4 md:p-6">
              <div
                className={`${
                  hasWideContent ? "min-w-[1024px]" : "max-w-7xl mx-auto"
                }`}
              >
                <Outlet />
              </div>
            </div>
          </div>
        </main>
      </div>

      <style jsx="true" global="true">{`
        html,
        body,
        #root {
          height: 100%;
          overflow: hidden;
          transition:
            background-color 0.2s ease,
            color 0.2s ease;
        }

        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: ${isDark ? "#1f2937" : "#f1f5f9"};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
          background: ${isDark ? "#4b5563" : "#cbd5e1"};
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? "#6b7280" : "#94a3b8"};
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: ${isDark ? "#4b5563 #1f2937" : "#cbd5e1 #f1f5f9"};
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
