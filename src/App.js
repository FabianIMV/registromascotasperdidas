import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext.js';
import Login from './components/Login';
import Registro from './components/Registro';
import PerfilUsuario from './components/PerfilUsuario';
import FormularioPublicacion from './components/FormularioPublicacion';
import Home from './components/Home';
import { useAuth } from './AuthContext.js';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/perfil" element={
          <ProtectedRoute>
            <PerfilUsuario />
          </ProtectedRoute>
        } />
        <Route path="/publicar" element={
          <ProtectedRoute>
            <FormularioPublicacion />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;