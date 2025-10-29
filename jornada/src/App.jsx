import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import PaginaInicial from "./pages/paginaInicial";
import ProtectedRoute from "./components/protectedRoute";
import ForgotPasswordPage from "./pages/forgotPassword/index"
import ResetPasswordPage from "./pages/resetPassword/index"

export default function App() {
  return (
    <Router>
      <Routes>
     
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

      
        <Route element={<ProtectedRoute />}>
          
        
          <Route path="/" element={<PaginaInicial />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
          <Route path="/reset-password" element={<ResetPasswordPage />} /> 
          
      
        </Route>
        
      </Routes>
    </Router>
  );
}