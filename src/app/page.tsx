'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './components/LoginForm';
import { useAuth } from './context/AuthContext';
import { Spin } from 'antd'; // Para un spinner

export default function Home() {
  const { isAuthenticated, loading } = useAuth(); // Obtén también 'loading' del contexto
  const router = useRouter();

  // Si loading es true, muestra un spinner
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" fullscreen />
      </div>
    );
  }

  // Si ya está autenticado, no renderizamos el login, AuthContext ya manejará la redirección
  if (isAuthenticated) {
    return null; // O podrías retornar un spinner mientras el AuthContext redirige
  }

  // Si no está autenticado y no está cargando, muestra el formulario de login
  return (
    <div  style={{ backgroundImage: 'url("/mainbackground.png")', backgroundSize: 'cover', height: '100vh' }}>
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <LoginForm />
    </div>
    </div>
  );
}
