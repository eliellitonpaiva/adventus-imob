import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedPerfis = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  // ⏳ Se estiver carregando, mostra um loader básico ou nada,
  // mas garanta que o AuthContext resolva o loading rapidamente.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4A24D]"></div>
      </div>
    );
  }

  // 🔐 Não autenticado: Salva a rota que ele tentou acessar para voltar depois
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 👤 Normaliza o perfil (garante que pega de role ou tipo)
  const perfilUsuario = user.role || user.tipo || "";

  // 🚫 VERIFICAÇÃO DE PERMISSÃO
  if (allowedPerfis.length > 0 && !allowedPerfis.includes(perfilUsuario)) {
    // 🎯 REDIRECIONAMENTO INTELIGENTE:
    if (perfilUsuario === "corretor") {
      // Evita loop: se já estiver em /admin/imoveis, não redireciona
      if (location.pathname === "/admin/imoveis") return <>{children}</>;
      return <Navigate to="/admin/imoveis" replace />;
    }

    // Se o cara caiu em uma rota que não pode (ex: corretor tentando ver Dashboard Master)
    // Manda para a rota padrão dele ou para o perfil
    return <Navigate to="/admin/perfil" replace />;
  }

  // ✅ Tudo OK!
  return <>{children}</>;
};

export default ProtectedRoute;
