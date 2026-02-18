import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext"; // ← IMPORTAR
import AppRoutes from "./routes";

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        {" "}
        {/* ← ADICIONAR AQUI */}
        <AppRoutes />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
