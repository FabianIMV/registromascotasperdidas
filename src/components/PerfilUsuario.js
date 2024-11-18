import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseConfig';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { FiUser, FiMail, FiEdit2, FiLogOut } from 'react-icons/fi';

const PerfilUsuario = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nombre: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [stats, setStats] = useState({
    publicaciones: 0,
    encontradas: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      try {
        // Intentar cargar el perfil existente
        let { data: profileData, error: profileError } = await supabase
          .from('perfiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
    
        // Si no hay perfil, crear uno nuevo
        if (!profileData && !profileError) {
          const { data: newProfile, error: insertError } = await supabase
            .from('perfiles')
            .insert([
              {
                id: user.id,
                nombre: '',
                email: user.email
              }
            ])
            .select()
            .single();
    
          if (insertError) throw insertError;
          profileData = newProfile;
        } else if (profileError) {
          throw profileError;
        }
    
        // Actualizar el formulario con los datos del perfil
        setForm({
          nombre: profileData?.nombre || '',
          email: user.email || ''
        });
    
        // Cargar estadísticas de mascotas - Corregido para usar user_id
        const { data: mascotasData, error: mascotasError } = await supabase
          .from('mascotas_perdidas')
          .select('estado')
          .eq('user_id', user.id);
    
        if (mascotasError) {
          console.error('Error al cargar mascotas:', mascotasError);
        } else {
          const encontradas = mascotasData?.filter(m => m.estado === 'encontrado').length || 0;
          setStats({
            publicaciones: mascotasData?.length || 0,
            encontradas
          });
        }
    
      } catch (err) {
        console.error('Error al cargar datos:', err);
        setError('Error al cargar los datos del perfil');
      }
    };

    loadProfile();
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: upsertError } = await supabase
        .from('perfiles')
        .upsert({
          id: user.id,
          nombre: form.nombre,
          email: form.email
        });

      if (upsertError) throw upsertError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-xl pb-8">
            {/* Banner */}
            <div className="w-full h-[250px]">
              <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
            </div>

            {/* Perfil Header */}
            <div className="flex flex-col items-center -mt-20">
              <div className="w-40 h-40 border-4 border-white rounded-full bg-white shadow-lg flex items-center justify-center">
                <FiUser className="w-20 h-20 text-blue-500" />
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <p className="text-2xl font-bold">{form.nombre || 'Usuario'}</p>
                {user.email_confirmed_at && (
                  <span className="bg-blue-500 rounded-full p-1 text-white text-xs px-2">
                    Verificado
                  </span>
                )}
              </div>
              <p className="text-gray-700">{form.email}</p>
            </div>

            {/* Estadísticas */}
            <div className="flex justify-center items-center mt-6 px-4">
              <div className="flex space-x-8">
                <div className="text-center">
                  <p className="font-bold text-2xl text-blue-500">{stats.publicaciones}</p>
                  <p className="text-gray-600">Mascotas Publicadas</p>
                </div>
                <div className="text-center">
                  <p className="font-bold text-2xl text-green-500">{stats.encontradas}</p>
                  <p className="text-gray-600">Mascotas Encontradas</p>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <div className="mt-8 px-8">
              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                  Perfil actualizado exitosamente
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                  <FiUser className="text-blue-500 text-xl" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg shadow-sm">
                  <FiMail className="text-blue-500 text-xl" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 p-2"
                      disabled={true}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-sm"
                    disabled={loading}
                  >
                    <FiEdit2 />
                    <span>{loading ? 'Actualizando...' : 'Actualizar Perfil'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200 shadow-sm"
                  >
                    <FiLogOut />
                    <span>Cerrar Sesión</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PerfilUsuario;