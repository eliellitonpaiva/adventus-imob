import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme deve ser usado dentro de ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("app-theme");
      console.log("🎯 ThemeProvider - Tema salvo no localStorage:", saved);
      return saved || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;

    console.log("🎯 ThemeProvider - Aplicando tema:", theme);

    if (theme === "dark") {
      root.classList.add("dark");
      console.log("✅ Classe 'dark' ADICIONADA no <html>");
    } else {
      root.classList.remove("dark");
      console.log("✅ Classe 'dark' REMOVIDA do <html>");
    }

    localStorage.setItem("app-theme", theme);
    console.log("💾 Tema salvo no localStorage:", theme);

    // Verificação final
    console.log(
      "🔍 Verificação - Tem classe 'dark'?",
      root.classList.contains("dark"),
    );
  }, [theme]);

  const toggleTheme = () => {
    console.log("🔄 toggleTheme chamado! Tema atual:", theme);
    setTheme((prev) => {
      const newTheme = prev === "light" ? "dark" : "light";
      console.log("🔄 Novo tema será:", newTheme);
      return newTheme;
    });
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
