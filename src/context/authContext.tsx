'use client';

import { createContext, useContext, useEffect, useState, ReactNode, } from 'react';
import { loginRequest, registerRequest } from '@/api/auth';
import { useRouter } from 'next/navigation';
import {
    AuthContextType, UserLoginDTO, UserRegisterDTO, User,
} from '@/interface/auth-interface';

// Inicialización del contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Hook para acceder al contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

// Provider
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const signup = async (user: UserRegisterDTO) => {
        try {
            const res = await registerRequest(user);
            if (res && res.status === 201) {
                setUser(res.data.user);
                setIsAuthenticated(true);
                return res;
            }
        } catch (error: any) {
            const message = error.response?.data?.error?.message
            setErrors([message]);
            console.log("> Error sign up :", error);
        }
    };

    const signin = async (user: UserLoginDTO) => {
        try {
            const res = await loginRequest(user)
            if (res && res.status === 200) {
                const { user, token } = res.data
                localStorage.setItem("token", token)
                setUser(user)
                setIsAuthenticated(true);
                return res
            }
        } catch (error: any) {
            const message = error.response?.data?.error?.message
            setErrors([message]);
            console.log("> Error sign in :", error);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            setIsAuthenticated(true)
        }
        setLoading(false)
    }, [])

    useEffect(() => {
        if (errors.length > 0) {
            const timer = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [errors]);

    return (
        <AuthContext.Provider
            value={{
                user,
                signup,
                signin,
                isAuthenticated,
                errors,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );

};

export default AuthContext;
