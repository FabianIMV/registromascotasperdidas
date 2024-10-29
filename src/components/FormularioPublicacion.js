import React, { useState } from 'react';
import Navbar from './Navbar';

const FormularioPublicacion = () => {
  const [form, setForm] = useState({ nombrePerro: '', descripcion: '', foto: null });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, foto: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Publicar:', form);
  };

  return (
    <>
      <Navbar />
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Publicar Perro Perdido</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Nombre del Perro:</label>
          <input
            type="text"
            name="nombrePerro"
            value={form.nombrePerro}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Descripción:</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Foto:</label>
          <input
            type="file"
            name="foto"
            onChange={handleFileChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
          Publicar
        </button>
      </form>
    </div>
    </>
  );
};

export default FormularioPublicacion;