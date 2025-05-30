'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from './components/LoginForm';
import { useAuth } from './context/AuthContext';
import { Spin } from 'antd'; // Para un spinner

export default function Home() {
  const { isAuthenticated, loading } = useAuth(); // Obtén también 'loading' del contexto
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Si loading es true, muestra un spinner
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" fullscreen />
      </div>
    );
  }
  // Para prevenir el render del Login form si el usuario ya está autenticado
  if (isAuthenticated) {
    return null;
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
