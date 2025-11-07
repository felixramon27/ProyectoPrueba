import React, { useState, useEffect } from 'react';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import UserDetail from './components/UserDetail';
import { getUsers } from './services/userServices';
import { Toaster } from 'react-hot-toast';

function App() {
  const [currentView, setCurrentView] = useState('list');
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    page: 1,
    totalPages: 1
  });

  // Cargar usuarios al iniciar
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await getUsers(filters);
      setUsers(data.users);
      // Actualizar información de paginación
      setPaginationInfo({
        total: data.total,
        page: data.page,
        totalPages: data.totalPages
      });
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      // Resetear en caso de error
      setUsers([]);
      setPaginationInfo({
        total: 0,
        page: 1,
        totalPages: 1
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setCurrentView('create');
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setCurrentView('edit');
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setCurrentView('detail');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    loadUsers();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Toaster con estilos personalizados */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'font-sans',
          style: {
            background: '#ffffff',
            color: '#1f2937',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
            style: {
              background: '#f0fdf4',
              color: '#065f46',
              border: '1px solid #a7f3d0',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
            },
          },
          loading: {
            style: {
              background: '#f3f4f6',
              color: '#374151',
              border: '1px solid #d1d5db',
            },
          },
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Sistema de Gestión de Usuarios
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Administra y organiza los usuarios de la compañía de manera eficiente y segura
          </p>
        </header>

        {currentView === 'list' && (
          <UserList
            users={users}
            loading={loading}
            paginationInfo={paginationInfo}
            onReload={loadUsers}
            onCreate={handleCreate}
            onEdit={handleEdit}
            onView={handleView}
          />
        )}

        {currentView === 'create' && (
          <UserForm
            onSave={handleBackToList}
            onCancel={handleBackToList}
          />
        )}

        {currentView === 'edit' && (
          <UserForm
            user={selectedUser}
            onSave={handleBackToList}
            onCancel={handleBackToList}
          />
        )}

        {currentView === 'detail' && (
          <UserDetail
            user={selectedUser}
            onEdit={handleEdit}
            onBack={handleBackToList}
          />
        )}
      </div>

      <footer className="text-center py-8 text-gray-500 text-sm">
        <p>© 2025 Compañía N - Sistema de Gestión de Usuarios</p>
      </footer>
    </div>
  );
}

export default App;