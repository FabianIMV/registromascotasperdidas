import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';

const Home = () => {
  const [search, setSearch] = useState('');
  const [publicaciones, setPublicaciones] = useState([]);

  useEffect(() => {
    setPublicaciones([
      { id: 1, nombre: 'Firulais', descripcion: 'Perro perdido en el parque central.', foto: 'https://static.fundacion-affinity.org/cdn/farfuture/PVbbIC-0M9y4fPbbCsdvAD8bcjjtbFc0NSP3lRwlWcE/mtime:1643275542/sites/default/files/los-10-sonidos-principales-del-perro.jpg' },
      { id: 2, nombre: 'Max', descripcion: 'Perro perdido cerca del supermercado.', foto: 'https://images.ctfassets.net/denf86kkcx7r/4IPlg4Qazd4sFRuCUHIJ1T/f6c71da7eec727babcd554d843a528b8/gatocomuneuropeo-97' },
    ]);
  }, []);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredPublicaciones = publicaciones.filter((publicacion) =>
    publicacion.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Mascotas Perdidas en Macul</h1>
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={search}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPublicaciones.map((publicacion) => (
            <div key={publicacion.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold">{publicacion.nombre}</h2>
              <p>{publicacion.descripcion}</p>
              <img src={publicacion.foto} alt={`Foto de ${publicacion.nombre}`} className="mt-2 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;