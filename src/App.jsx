import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { LanguageProvider } from "./context/LanguageContext";
import { ToastProvider } from "./context/ToastContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboard } from "./pages/AdminDashboard";

export function App() {
  const baseName = import.meta.env.BASE_URL || "/";
  return (
    <BrowserRouter basename={baseName}>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              {/* Public Guest Bar Menu: Home & Dedicated Category Detail Continuous Scroll */}
              <Route path="/" element={<HomePage />} />
              <Route path="/category/:categoryId" element={<HomePage />} />

              {/* Admin Sign In */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Management Suite */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
