import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../logo.png';

const Navbar = () => {
  return (
    <nav className="bg-indigo-600 p-4 fixed top-0 left-0 right-0 z-50 flex justify-between items-center h-16">
      <Link to="/" className="flex items-center h-full">
        <img src={logo} alt="Logo" className="h-full" />
      </Link>
      <div>
        <Link to="/perfil" className="text-white mr-4">Perfil</Link>
        <Link to="/publicar" className="text-white">Publicar</Link>
      </div>
    </nav>
  );
};

export default Navbar;