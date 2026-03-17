import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [sessionUser, setSessionUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // Um único loading para simplificar a barreira das rotas

  const lastProfileRequest = useRef(0);

  // Padronização do objeto de usuário para evitar erros no ProtectedRoute
  const formatUserObject = (session, prof) => {
    if (!session) return null;
    return {
      id: session.id,
      email: session.email,
      nome: prof?.nome || session.nome || "Usuário",
      // AQUI: Garantimos que role seja sempre o que o ProtectedRoute espera
      role: prof?.cargo || session.perfil || session.role || "corretor",
      tipo: session.tipo || "corretor",
      avatar: prof?.avatar_url || session.avatar || null,
    };
  };

  const login = async (email, password) => {
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      const { data: corretor } = await supabase
        .from("corretores")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      const userData = {
        id: authData.user.id,
        email: authData.user.email,
        nome:
          corretor?.nome ||
          authData.user.user_metadata?.nome ||
          email.split("@")[0],
        perfil:
          corretor?.perfil || authData.user.user_metadata?.perfil || "corretor",
        tipo: "corretor",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      setSessionUser(userData);
      setProfile({ nome: userData.nome, cargo: userData.perfil });

      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    localStorage.removeItem("user");
    setSessionUser(null);
    setProfile(null);
    window.location.replace("/login");
  };

  useEffect(() => {
    const initAuth = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setSessionUser(userData);
          setProfile({
            nome: userData.nome,
            cargo: userData.perfil,
          });
        } catch (e) {
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const contextValue = {
    user: formatUserObject(sessionUser, profile),
    loading,
    login,
    logout,
    isAuthenticated: !!sessionUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
