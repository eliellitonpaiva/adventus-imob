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
  const [loading, setLoading] = useState(true);

  const lastProfileRequest = useRef(0);

  // Padronização do objeto de usuário
  const formatUserObject = (session, prof) => {
    if (!session) return null;

    return {
      id: session.id,
      email: session.email,
      nome: prof?.nome || session.nome || "Usuário",
      // O ProtectedRoute espera 'role' para verificar permissões
      role: prof?.perfil || session.perfil || session.role || "corretor",
      tipo: session.tipo || "corretor",
      avatar: prof?.avatar_url || session.avatar || null,
      // Campos extras úteis
      perfil: prof?.perfil || session.perfil || "corretor", // Mantém compatibilidade
      creci: prof?.creci || null, // Para corretores
      telefone: prof?.telefone || null, // Para corretores
      genero: prof?.genero || "masculino", // <-- ADICIONADO: gênero do corretor
    };
  };

  const login = async (email, password) => {
    try {
      console.log("1. Tentando login com:", email);

      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) throw authError;

      console.log("2. Auth success - ID:", authData.user.id);

      // PRIMEIRO: Tenta buscar na tabela 'usuarios'
      console.log("3. Buscando em usuarios com ID:", authData.user.id);
      const { data: usuario, error: usuarioError } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", authData.user.id)
        .maybeSingle();

      console.log("4. Resultado da busca em usuarios:", usuario);
      if (usuarioError) console.log("4.1 Erro na busca:", usuarioError);

      // SEGUNDO: Se não encontrar em usuarios, tenta em 'corretores'
      if (!usuario) {
        console.log("5. Não encontrou em usuarios, buscando em corretores");

        const { data: corretor, error: corretorError } = await supabase
          .from("corretores")
          .select("*")
          .eq("id", authData.user.id)
          .maybeSingle();

        console.log("6. Resultado da busca em corretores:", corretor);
        if (corretorError) console.log("6.1 Erro na busca:", corretorError);

        if (corretor) {
          console.log("7. É um corretor - dados:", corretor);

          // É um corretor
          const userData = {
            id: authData.user.id,
            email: authData.user.email,
            nome: corretor.nome || email.split("@")[0],
            perfil: "corretor",
            role: "corretor",
            tipo: "corretor",
            creci: corretor.creci,
            telefone: corretor.telefone,
            genero: corretor.genero || "masculino", // <-- ADICIONADO: gênero do corretor
          };

          console.log("8. Dados do corretor formatados:", userData);

          localStorage.setItem("user", JSON.stringify(userData));
          setSessionUser(userData);
          setProfile(userData);

          return { success: true };
        }
      } else {
        console.log("5. É um usuário do CRM - dados:", usuario);
        console.log("6. Perfil encontrado:", usuario.perfil);

        // É um usuário do CRM (master, admin, gerente, etc)
        const userData = {
          id: authData.user.id,
          email: authData.user.email,
          nome: usuario.nome || email.split("@")[0],
          perfil: usuario.perfil,
          role: usuario.perfil,
          tipo: "usuario",
        };

        console.log("7. Dados do usuário formatados:", userData);

        localStorage.setItem("user", JSON.stringify(userData));
        setSessionUser(userData);
        setProfile(userData);

        return { success: true };
      }

      // Se não encontrou em nenhuma tabela
      console.log("8. USUÁRIO NÃO ENCONTRADO EM NENHUMA TABELA!");
      throw new Error("Usuário não encontrado nas tabelas do sistema");
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
          setProfile(userData);
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
