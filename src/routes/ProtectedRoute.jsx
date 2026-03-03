// src/routes/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // 🔎 DEBUG CONTROLADO (pode remover depois)
  console.log("ProtectedRoute state:", {
    loading,
    isAuthenticated,
    user,
  });

  // ⏳ Enquanto valida sessão
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
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Autenticado
  return <>{children}</>;
};

export default ProtectedRoute;
