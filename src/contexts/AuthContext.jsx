import React, { createContext, useState, useContext, useEffect } from "react";

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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("authToken");

        if (token) {
          // Em produção, aqui faríamos uma requisição para validar o token
          // Por enquanto, mockamos um usuário baseado no token
          setIsAuthenticated(true);

          // Mock user data - em produção viria da API
          const mockUser = {
            id: "1",
            email: localStorage.getItem("userEmail") || "admin@imobi.com",
            name: "Administrador",
            role: "admin",
            avatar: null,
          };

          setUser(mockUser);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        setIsAuthenticated(false);
        setUser(null);

        // Limpar token inválido
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Função de login
   * @param {string} email
   * @param {string} password
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = async (email, password) => {
    try {
      setLoading(true);

      // Em produção, substituir por chamada à API
      // Simulação de validação
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Credenciais mockadas - em produção seria validação na API
      const validCredentials =
        (email === "admin@imobi.com" && password === "admin123") ||
        (email === "user@imobi.com" && password === "user123");

      if (!validCredentials) {
        throw new Error("Credenciais inválidas");
      }

      // Gerar token mockado
      const token = `imobi-auth-${Date.now()}-${Math.random().toString(36).substr(2)}`;

      // Persistir dados
      localStorage.setItem("authToken", token);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("lastLogin", new Date().toISOString());

      // Atualizar estado
      setIsAuthenticated(true);
      setUser({
        id: email === "admin@imobi.com" ? "1" : "2",
        email,
        name: email === "admin@imobi.com" ? "Administrador" : "Usuário",
        role: email === "admin@imobi.com" ? "admin" : "user",
        avatar: null,
      });

      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: error.message || "Erro ao fazer login. Tente novamente.",
      };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Função de logout
   */
  const logout = () => {
    try {
      // Limpar localStorage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");

      // Atualizar estado
      setIsAuthenticated(false);
      setUser(null);

      // Em produção, poderia fazer uma chamada à API para invalidar token
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  /**
   * Atualizar dados do usuário
   */
  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }));
  };

  // Valor do contexto
  const contextValue = {
    isAuthenticated,
    loading,
    user,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Exportar o contexto para uso direto (caso necessário)
export default AuthContext;
