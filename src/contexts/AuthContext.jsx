// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { supabase } from "../lib/supabase";
import bcrypt from "bcryptjs";

// Criar o contexto
const AuthContext = createContext({});

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Estados separados: sessão (rápida) e perfil (lento)
  const [sessionUser, setSessionUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // isAuthenticated baseado SOMENTE na sessão
  const isAuthenticated = !!sessionUser;

  // ============================================
  // CONTROLE DE CONCORRÊNCIA PROFISSIONAL (useRef)
  // ============================================
  const lastProfileRequest = useRef(0);

  // ============================================
  // FUNÇÃO PROFISSIONAL - BUSCAR PERFIL EM BACKGROUND
  // ============================================
  const fetchProfileInBackground = async (userId) => {
    if (!userId) return;

    const requestId = ++lastProfileRequest.current; // identifica esta requisição
    setLoadingProfile(true);

    try {
      const { data, error } = await supabase
        .from("perfis")
        .select("nome, cargo, avatar_url")
        .eq("id", userId)
        .maybeSingle();

      // 🚫 Se não for a requisição mais recente → ignora
      if (requestId !== lastProfileRequest.current) return;

      if (!error && data) {
        setProfile(data);
      }
    } catch (error) {
      if (requestId === lastProfileRequest.current) {
        console.warn(
          "Erro ao buscar perfil (ignorado):",
          error?.message || error,
        );
      }
    } finally {
      if (requestId === lastProfileRequest.current) {
        setLoadingProfile(false);
      }
    }
  };

  // ============================================
  // LOGIN - Verifica corretores E usuarios
  // ============================================
  const login = async (email, password) => {
    try {
      // 1️⃣ Login no Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      if (!authData.user) {
        return { success: false, error: "Usuário não encontrado" };
      }

      // 2️⃣ Busca dados complementares na tabela corretores
      const { data: corretor, error: perfilError } = await supabase
        .from("corretores")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      // Dados do usuário para o frontend
      const userData = {
        id: authData.user.id,
        email: authData.user.email,
        nome:
          authData.user.user_metadata?.nome ||
          corretor?.nome ||
          email.split("@")[0],
        perfil:
          authData.user.user_metadata?.perfil || corretor?.perfil || "corretor",
        tipo: "corretor",
        avatar: corretor?.avatar_url || null,
        metadata: authData.user.user_metadata,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setSessionUser(userData);

      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    }
  };

  // ============================================
  // LOGOUT ATUALIZADO
  // ============================================
  const logout = async () => {
    try {
      // Remove do localStorage
      localStorage.removeItem("user");

      // Limpa os estados
      setSessionUser(null);
      setProfile(null);

      // Redireciona para login
      window.location.replace("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // ============================================
  // MONTA OBJETO DO USUÁRIO
  // ============================================
  const user = sessionUser
    ? {
        id: sessionUser.id,
        email: sessionUser.email,
        name:
          profile?.nome ||
          sessionUser.nome ||
          sessionUser.email?.split("@")[0] ||
          "Usuário",
        role: profile?.cargo || sessionUser.perfil || "corretor",
        tipo: sessionUser.tipo || "usuario",
        avatar: profile?.avatar_url || null,
        // Dados extras dependendo do tipo
        ...(sessionUser.tipo === "corretor" && { creci: sessionUser.creci }),
        ...(sessionUser.cargo && { cargo: sessionUser.cargo }),
        // Expõe metadados para debug
        _metadata: {
          profileLoaded: !!profile,
          profileLoading: loadingProfile,
        },
      }
    : null;

  // ============================================
  // EFEITO PRINCIPAL - VERIFICA LOCALSTORAGE
  // ============================================
  useEffect(() => {
    // Verifica se tem usuário no localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setSessionUser(userData);
      setProfile({
        nome: userData.nome,
        cargo: userData.perfil,
        avatar_url: null,
      });
    }
    setLoadingSession(false);
  }, []);

  // ============================================
  // VALOR DO CONTEXTO
  // ============================================
  const contextValue = {
    user,
    sessionUser,
    profile,
    loading: loadingSession,
    loadingProfile,
    login,
    logout,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
