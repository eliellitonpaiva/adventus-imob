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
      // 1️⃣ Tenta na tabela CORRETORES primeiro
      const { data: corretor, error: erroCorretor } = await supabase
        .from("corretores")
        .select("*")
        .eq("email", email)
        .single();

      if (!erroCorretor && corretor) {
        // Verifica senha do corretor
        if (!corretor.senha) {
          return { success: false, error: "Usuário sem senha cadastrada" };
        }

        const senhaValida = await bcrypt.compare(password, corretor.senha);
        if (!senhaValida) {
          return { success: false, error: "Email ou senha inválidos" };
        }

        // Dados do corretor logado
        const userData = {
          id: corretor.id,
          email: corretor.email,
          nome: corretor.nome,
          perfil: corretor.perfil || "corretor",
          tipo: "corretor",
          creci: corretor.creci,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setSessionUser(userData);
        setProfile({
          nome: corretor.nome,
          cargo: corretor.perfil || "corretor",
          avatar_url: null,
        });

        return { success: true };
      }

      // 2️⃣ Se não achou, tenta na tabela USUARIOS
      const { data: usuario, error: erroUsuario } = await supabase
        .from("usuarios")
        .select("*")
        .eq("email", email)
        .single();

      if (!erroUsuario && usuario) {
        // Verifica senha do usuario
        if (!usuario.senha) {
          return { success: false, error: "Usuário sem senha cadastrada" };
        }

        const senhaValida = await bcrypt.compare(password, usuario.senha);
        if (!senhaValida) {
          return { success: false, error: "Email ou senha inválidos" };
        }

        // Dados do usuário logado (não corretor)
        const userData = {
          id: usuario.id,
          email: usuario.email,
          nome: usuario.nome,
          perfil: usuario.perfil,
          tipo: "usuario",
          cargo: usuario.cargo,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setSessionUser(userData);
        setProfile({
          nome: usuario.nome,
          cargo: usuario.perfil,
          avatar_url: usuario.avatar_url || null,
        });

        return { success: true };
      }

      // 3️⃣ Não encontrou em nenhuma tabela
      return { success: false, error: "Email ou senha inválidos" };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, error: "Erro ao fazer login" };
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
