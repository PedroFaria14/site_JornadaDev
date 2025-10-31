import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; 
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import PaginaInicial from "./pages/paginaInicial";
import ProtectedRoute from "./components/protectedRoute";
import ForgotPasswordPage from "./pages/forgotPassword/index"
import ResetPasswordPage from "./pages/resetPassword/index"
import Paginamenu from "./pages/PaginaModulo/index"
import PaginaPerfil from "./pages/perfil/index"
import PaginaEditarPerfil from "./pages/editar/index";
import PaginaConfiguracoes from "./pages/config/index"
import PaginaDicas from "./pages/dicas/index"
import PaginaQuiz from "./pages/quiz/index"
import PaginaExercicios from "./pages/exercicios/index";
import PaginaNivelamento from "./pages/teste_nivelamento/index"

export default function App() {
  return (
    <Router>
      <Routes>
      
        {/* --- ROTAS PÚBLICAS --- */}
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} /> 
        <Route path="/reset-password" element={<ResetPasswordPage />} /> 

        
        {/* --- ROTAS PROTEGIDAS --- */}
      
          <Route element={<ProtectedRoute />}>

          <Route path="/" element={<PaginaInicial />} />
          <Route path="/menu/" element={<Paginamenu />} />
          <Route path="/perfil" element={<PaginaPerfil />} />
          <Route path="/perfil/editar" element={<PaginaEditarPerfil/>} />
          <Route path="/configuracoes" element={<PaginaConfiguracoes />} /> 
          <Route path="/dicas" element={<PaginaDicas />} /> 
          <Route path="/teste-nivelamento" element={<PaginaNivelamento />} />
          <Route path="/quiz/:moduleName/:levelId" element={<PaginaQuiz />} /> 
          <Route path="/exercicios" element={<PaginaExercicios />} />
        </Route>
        
      </Routes>
    </Router>
  );
}