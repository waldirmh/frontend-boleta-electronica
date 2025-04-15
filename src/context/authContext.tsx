'use client';

import { createContext, useContext, useEffect, useState, ReactNode, } from 'react';
import { loginRequest, registerRequest } from '@/api/auth';
import { useRouter } from 'next/navigation';

import { toast } from 'react-toastify'
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
            const message = error.response?.data.error.message || "Error al registrarse"
            setErrors([message]);
            toast.info(message)
        }
    };

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
