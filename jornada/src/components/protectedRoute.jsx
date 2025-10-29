import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Este componente é o "segurança"
const ProtectedRoute = () => {
  // 1. Ele verifica se existe "userData" no localStorage
  const isAuthenticated = localStorage.getItem('userData');

  // 2. Se existe (está logado), ele renderiza o <Outlet />
  //    (que é a página que você quer proteger, ex: PaginaInicial)
  // 3. Se NÃO existe, ele redireciona o usuário para a página de login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;