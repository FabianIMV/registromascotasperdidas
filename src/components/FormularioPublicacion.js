import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseConfig';
import Navbar from './Navbar';

const FormularioPublicacion = () => {
  const [form, setForm] = useState({ 
    tipoMascota: '',
    nombreMascota: '', 
    raza: '',
    descripcion: '', 
    foto: null,
    ubicacion: '',
    contacto: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const tiposMascota = [
    'Perro',
    'Gato',
    'Ave',
    'Conejo',
    'Hamster',
    'Otro'
  ];

  // Limpiar la URL de vista previa cuando el componente se desmonte
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Limpiar mensajes de error cuando el usuario hace cambios
    if (error) setError(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size <= 5 * 1024 * 1024) { // 5MB máximo
          setForm({ ...form, foto: file });
          // Crear URL para vista previa
          if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
          }
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
          if (error) setError(null);
        } else {
          setError('La imagen no debe superar los 5MB');
        }
      } else {
        setError('Por favor selecciona una imagen válida (JPG, PNG)');
      }
    }
  };

  const resetForm = () => {
    setForm({
      tipoMascota: '',
      nombreMascota: '', 
      raza: '',
      descripcion: '', 
      foto: null,
      ubicacion: '',
      contacto: ''
    });
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Subir la imagen
      const fileExt = form.foto.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`; // Ya que el bucket se llama 'images'

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, form.foto);

      if (uploadError) throw uploadError;

      // 2. Obtener la URL pública de la imagen
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      // 3. Guardar los datos en la base de datos
      const { error: insertError } = await supabase
        .from('mascotas_perdidas')
        .insert([
          {
            tipo_mascota: form.tipoMascota,
            nombre: form.nombreMascota,
            raza: form.raza,
            descripcion: form.descripcion,
            foto_url: publicUrl,
            ubicacion: form.ubicacion,
            contacto: form.contacto,
            fecha_publicacion: new Date().toISOString(),
            estado: 'perdido'
          }
        ]);

      if (insertError) throw insertError;

      // Limpiar el formulario y mostrar mensaje de éxito
      resetForm();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
      
    } catch (err) {
      setError(err.message || 'Error al publicar. Por favor, intenta nuevamente.');
      console.error('Error detallado:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto my-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Publicar Mascota Perdida</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            Publicación realizada con éxito
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Tipo de Mascota:</label>
            <select
              name="tipoMascota"
              value={form.tipoMascota}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
            >
              <option value="">Selecciona un tipo</option>
              {tiposMascota.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Nombre de la Mascota:</label>
            <input
              type="text"
              name="nombreMascota"
              value={form.nombreMascota}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              placeholder="Nombre de la mascota"
            />
          </div>

          <div>
            <label className="block text-gray-700">Raza:</label>
            <input
              type="text"
              name="raza"
              value={form.raza}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Raza (opcional)"
            />
          </div>

          <div>
            <label className="block text-gray-700">Descripción:</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              placeholder="Color, tamaño, características distintivas, circunstancias de la pérdida..."
              rows="4"
            />
          </div>

          <div>
            <label className="block text-gray-700">Ubicación:</label>
            <input
              type="text"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              placeholder="Barrio, calle, sector..."
            />
          </div>

          <div>
            <label className="block text-gray-700">Contacto:</label>
            <input
              type="text"
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              placeholder="Teléfono o correo electrónico"
            />
          </div>

          <div>
            <label className="block text-gray-700">Foto:</label>
            <input
              type="file"
              name="foto"
              onChange={handleFileChange}
              className="mt-1 p-2 w-full border rounded-md focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading}
              accept="image/jpeg,image/png,image/webp"
            />
            {previewUrl && (
              <div className="mt-2">
                <img 
                  src={previewUrl} 
                  alt="Vista previa" 
                  className="max-w-xs rounded-md mx-auto"
                />
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publicando...
              </span>
            ) : 'Publicar'}
          </button>
        </form>
      </div>
    </>
  );
};

export default FormularioPublicacion;