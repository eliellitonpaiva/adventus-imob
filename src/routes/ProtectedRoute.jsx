// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, allowedPerfis = [] }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#D4A24D] to-[#31353E]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="mt-4 text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  // 🔐 Não autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // 👤 Pega o perfil do usuário
  const perfilUsuario = user.role || user.tipo;

  // 🚫 VERIFICAÇÃO DE PERMISSÃO
  if (allowedPerfis.length > 0) {
    // Se não tem permissão
    if (!allowedPerfis.includes(perfilUsuario)) {
      // 🎯 REDIRECIONAMENTO INTELIGENTE:
      // Se for corretor, manda pra imóveis
      if (perfilUsuario === "corretor") {
        return <Navigate to="/admin/imoveis" replace />;
      }
      // Qualquer outro perfil sem acesso vai pro dashboard (página inicial do admin)
      return <Navigate to="/admin" replace />;
    }
  }

  // ✅ Tudo OK!
  return <>{children}</>;
};

export default ProtectedRoute;
