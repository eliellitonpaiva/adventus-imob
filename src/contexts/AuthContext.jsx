// src/contexts/AuthContext.jsx
import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { supabase } from "../lib/supabase";

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

  // Monta objeto do usuário combinando sessão + perfil (quando disponível)
  const user = sessionUser
    ? {
        id: sessionUser.id,
        email: sessionUser.email,
        name: profile?.nome || sessionUser.email?.split("@")[0] || "Usuário",
        role: profile?.cargo || "corretor",
        avatar: profile?.avatar_url || null,
        // Expõe metadados para debug ou uso interno
        _metadata: {
          profileLoaded: !!profile,
          profileLoading: loadingProfile,
        },
      }
    : null;

  // Efeito principal: verificar sessão inicial
  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        // 1. Verificar sessão atual (rápido, síncrono)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (isMounted) {
          // 2. Se tiver sessão, define usuário básico IMEDIATAMENTE
          if (session?.user) {
            setSessionUser(session.user);

            // 3. Buscar perfil em background (não bloqueia)
            fetchProfileInBackground(session.user.id);
          } else {
            setSessionUser(null);
            setProfile(null);
          }

          // 4. Sempre finaliza loading da sessão
          setLoadingSession(false);
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        if (isMounted) {
          setSessionUser(null);
          setProfile(null);
          setLoadingSession(false);
        }
      }
    };

    initializeAuth();

    // Listener para mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isMounted) return;

      // Atualiza sessão IMEDIATAMENTE
      if (session?.user) {
        setSessionUser(session.user);
        // Busca perfil em background
        fetchProfileInBackground(session.user.id);
      } else {
        setSessionUser(null);
        setProfile(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: error.message || "Erro ao fazer login",
      };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: "global" });

      const { data } = await supabase.auth.getSession();
      console.log("Sessão após logout:", data.session);

      window.location.replace("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Valor do contexto
  const contextValue = {
    user, // usuário completo (sessão + perfil quando disponível)
    sessionUser, // apenas dados da sessão (raw)
    profile, // apenas dados do perfil
    loading: loadingSession, // loading apenas para a sessão (rápido)
    loadingProfile, // loading específico do perfil
    login,
    logout,
    isAuthenticated, // baseado APENAS na sessão
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
