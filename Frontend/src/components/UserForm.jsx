import React, { useState, useEffect } from 'react';
import { createUser, updateUser } from '../services/userServices';

const UserForm = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    day: '',
    month: '',
    year: '',
    categoria: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const birthDate = new Date(user.fechaDeNacimiento);
      setFormData({
        nombre: user.nombre,
        email: user.email,
        day: birthDate.getDate().toString(),
        month: (birthDate.getMonth() + 1).toString(),
        year: birthDate.getFullYear().toString(),
        categoria: user.categoria
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre || formData.nombre.length < 3 || formData.nombre.length > 200) {
      newErrors.nombre = 'El nombre debe tener entre 3 y 200 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Formato de email inválido';
    } else {
      const domain = formData.email.split('@')[1];
      if (domain !== 'gmail.com' && domain !== 'hotmail.com') {
        newErrors.email = 'Solo se aceptan emails de gmail y hotmail';
      }
    }

    // Validar fecha
    const day = parseInt(formData.day);
    const month = parseInt(formData.month);
    const year = parseInt(formData.year);
    const currentYear = new Date().getFullYear();

    if (!day || day < 1 || day > 31) {
      newErrors.day = 'Día inválido (1-31)';
    }
    if (!month || month < 1 || month > 12) {
      newErrors.month = 'Mes inválido (1-12)';
    }
    if (!year || year > currentYear) {
      newErrors.year = `Año inválido (máximo ${currentYear})`;
    }

    if (!newErrors.day && !newErrors.month && !newErrors.year) {
      // Validar fecha específica
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      
      if (day > daysInMonth[month - 1]) {
        newErrors.day = `El mes ${month} no tiene ${day} días`;
      }
    }

    // Validar categoría
    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const birthDate = new Date(
        parseInt(formData.year),
        parseInt(formData.month) - 1,
        parseInt(formData.day)
      );

      const userData = {
        nombre: formData.nombre,
        email: formData.email,
        fechaDeNacimiento: birthDate.toISOString(),
        categoria: formData.categoria
      };

      if (user) {
        await updateUser(user.id, userData);
      } else {
        await createUser(userData);
      }
      
      onSave();
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header con gradiente */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">
              {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </h2>
            <p className="text-blue-100 mt-2 opacity-90">
              {user ? 'Actualiza la información del usuario' : 'Completa el formulario para registrar un nuevo usuario'}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="bg-white rounded-b-2xl shadow-xl p-8 -mt-4 relative z-10 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Campo Nombre */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Nombre completo *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none transition-all duration-200 text-lg ${
                errors.nombre 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
              placeholder="Ingrese el nombre completo"
            />
            {errors.nombre && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.nombre}
              </div>
            )}
          </div>

          {/* Campo Email */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none transition-all duration-200 text-lg ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
              placeholder="usuario@gmail.com o usuario@hotmail.com"
            />
            {errors.email && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.email}
              </div>
            )}
          </div>

          {/* Campo Fecha de Nacimiento */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Fecha de nacimiento *
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['day', 'month', 'year'].map((field) => (
                <div key={field}>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    placeholder={
                      field === 'day' ? 'DD' : 
                      field === 'month' ? 'MM' : 
                      'AAAA'
                    }
                    className={`w-full border-2 rounded-xl px-4 py-4 text-center focus:outline-none transition-all duration-200 text-lg font-medium ${
                      errors[field] 
                        ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                        : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                    }`}
                  />
                  {errors[field] && (
                    <div className="flex items-center justify-center mt-2 text-red-600 text-sm">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors[field]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Campo Categoría */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
              Categoría *
            </label>
            <select
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={`w-full border-2 rounded-xl px-4 py-4 focus:outline-none transition-all duration-200 text-lg ${
                errors.categoria 
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50' 
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
              }`}
            >
              <option value="">Seleccione una categoría</option>
              <option value="amigo">Amigo</option>
              <option value="compañero">Compañero</option>
              <option value="superAmigos">Super Amigos</option>
              <option value="bloqueados">Bloqueados</option>
            </select>
            {errors.categoria && (
              <div className="flex items-center mt-2 text-red-600 text-sm">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.categoria}
              </div>
            )}
          </div>

          {/* Mensaje de error general */}
          {errors.submit && (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="text-red-800 font-semibold">Error al guardar</h4>
                  <p className="text-red-600 mt-1">{errors.submit}</p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold text-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none disabled:hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {user ? 'Actualizar Usuario' : 'Crear Usuario'}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;