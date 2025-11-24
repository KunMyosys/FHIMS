import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import "./styles/globals.css";
import App from "./App";
import { HashRouter } from "react-router-dom";  
import { AuthProvider } from "./contexts/AuthContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import { SidebarProvider } from "./contexts/SidebarContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <SidebarProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </SidebarProvider>
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);
