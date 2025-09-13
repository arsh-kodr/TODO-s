import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "./components/ThemeProvider.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

createRoot(document.getElementById("root")).render(
  <div>
    <AuthProvider>
      <ThemeProvider>
        <App />
        <ToastContainer />
      </ThemeProvider>
    </AuthProvider>
  </div>
);
