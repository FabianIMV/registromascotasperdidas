import React, { useState } from 'react';
import Navbar from './Navbar';

const PerfilUsuario = () => {
  const [form, setForm] = useState({ nombre: '', email: '' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Actualizar perfil:', form);
  };

  return (
    <>
      <Navbar />
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Perfil de Usuario</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          Actualizar Perfil
        </button>
      </form>
    </div>
    </>
  );
};

export default PerfilUsuario;