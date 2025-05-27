'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient'; // Importa tu cliente de Supabase
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
    isAuthenticated: boolean;
    user: any; // Puedes tipar esto mejor con el tipo de usuario de Supabase
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
        if (session) {
            setIsAuthenticated(true);
            setUser(session.user);
            if (window.location.pathname === '/') { // Solo redirige si está en la página de login
                router.push('/dashboard');
            }
        } else {
            setIsAuthenticated(false);
            setUser(null);
            if (window.location.pathname.startsWith('/dashboard')) { // Solo redirige si está en el dashboard
                router.push('/');
            }
        }
        setLoading(false);
    }, [router]);

    useEffect(() => {
        // Escuchar cambios en el estado de autenticación de Supabase
        const { data: authListener } = supabase.auth.onAuthStateChange(handleAuthStateChange);

        // Intentar obtener la sesión actual al cargar la aplicación
        const getInitialSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session) {
                setIsAuthenticated(true);
                setUser(session.user);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setLoading(false);
        };

        getInitialSession();

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [handleAuthStateChange]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        setLoading(false);
        if (error) {
            console.error('Error during login:', error);
            return { success: false, error: error.message };
        }
        // handleAuthStateChange ya manejará la actualización del estado y la redirección
        return { success: true };
    };

    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);
        if (error) {
            console.error('Error during logout:', error);
            // Podrías mostrar un mensaje de error si el logout falla
        }
        // handleAuthStateChange ya manejará la actualización del estado y la redirección
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};