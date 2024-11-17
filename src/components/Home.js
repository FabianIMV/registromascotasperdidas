import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseConfig';
import Navbar from './Navbar';

const Home = () => {
  const [search, setSearch] = useState('');
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPublicaciones();
  }, []);

  const fetchPublicaciones = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mascotas_perdidas')
        .select('*')
        .order('fecha_publicacion', { ascending: false });

      if (error) throw error;

      setPublicaciones(data);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filteredPublicaciones = publicaciones.filter((publicacion) =>
    publicacion.nombre.toLowerCase().includes(search) ||
    publicacion.descripcion.toLowerCase().includes(search) ||
    publicacion.tipo_mascota.toLowerCase().includes(search) ||
    publicacion.ubicacion.toLowerCase().includes(search)
  );

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-8">
          <div className="text-red-600 text-center">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Mascotas Perdidas</h1>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar por nombre, tipo, ubicación o descripción"
            value={search}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPublicaciones.length === 0 ? (
          <div className="text-center text-gray-500">
            No se encontraron publicaciones
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredPublicaciones.map((publicacion) => (
              <div key={publicacion.id} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-blue-600">{publicacion.nombre}</h2>
                  <span className="text-sm text-gray-500">
                    {formatDate(publicacion.fecha_publicacion)}
                  </span>
                </div>
                
                <div className="mb-2">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                    {publicacion.tipo_mascota}
                  </span>
                  {publicacion.raza && (
                    <span className="inline-block bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full ml-2">
                      {publicacion.raza}
                    </span>
                  )}
                </div>

                <img 
                  src={publicacion.foto_url} 
                  alt={`Foto de ${publicacion.nombre}`} 
                  className="w-full h-48 object-cover rounded-md mb-3"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-pet.jpg'; // Asegúrate de tener una imagen por defecto
                  }}
                />
                
                <p className="text-gray-600 mb-3">{publicacion.descripcion}</p>
                
                <div className="border-t pt-3">
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Ubicación:</span> {publicacion.ubicacion}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Contacto:</span> {publicacion.contacto}
                  </p>
                  <p className="text-sm text-gray-500">
                    <span className="font-semibold">Estado:</span>{' '}
                    <span className={`
                      inline-block px-2 py-1 rounded-full text-xs
                      ${publicacion.estado === 'perdido' ? 'bg-red-100 text-red-800' : 
                        publicacion.estado === 'encontrado' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'}
                    `}>
                      {publicacion.estado.charAt(0).toUpperCase() + publicacion.estado.slice(1)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;