import React from "react";
import { ThemeProvider } from "./contexts/ThemeContext";
import AppRoutes from "./routes";

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
