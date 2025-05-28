'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient'; // Importa tu cliente de Supabase
import { AuthError, Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: AuthError }>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
        if (session) {
            setIsAuthenticated(true);
            setUser(session.user);
        } else {
            setIsAuthenticated(false);
            setUser(null);
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
            if (authListener?.subscription) {
                authListener.subscription.unsubscribe();
            }
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
            return { success: false, error: error };
        }
        
        return { success: true };
    };

    const logout = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setLoading(false);
        if (error) {
            console.error('Error during logout:', error);
        }
        
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