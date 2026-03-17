// src/App.jsx
import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AppRoutes from "./routes"; // 👈 Importa o routes.jsx

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
