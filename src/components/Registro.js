import React, { useState } from 'react';
import { supabase } from './supabaseConfig';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Registro = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      // 1. Registrar el usuario
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // 2. Iniciar sesión inmediatamente después del registro
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (signInError) throw signInError;

        // 3. Crear el perfil
        const { error: profileError } = await supabase
          .from('perfiles')
          .insert({
            id: authData.user.id,
            nombre: form.nombre,
            email: form.email
          });

        if (profileError) throw profileError;

        alert('Registro exitoso. Por favor verifica tu correo electrónico.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Error detallado:', err);
      setError(err.message || 'Error durante el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700">Email:</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700">Contraseña:</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-gray-700">Confirmar Contraseña:</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <a href="/login" className="text-blue-500 hover:text-blue-600">
                Inicia sesión
              </a>
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default Registro;