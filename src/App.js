import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import PerfilUsuario from './components/PerfilUsuario';
import FormularioPublicacion from './components/FormularioPublicacion';
import Home from './components/Home';

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/publicar" element={<FormularioPublicacion />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;