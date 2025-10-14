'use client';
import { createContext, useContext, useEffect, useState, ReactNode, useCallback, } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, UserLoginDTO, UserRegisterDTO, User, } from '@/interface/auth-interface';
import { toast } from 'react-toastify';
import { AuthService } from '@/services/auth/AuthService';
import { decodeToken, isTokenNearExpiry } from '@/utils/tokenUtils';
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

    // Función para limpiar el estado de autenticación
    const clearAuthState = useCallback(() => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('invoice');
    }, []);

    // Función para registrar usuario
    const signup = async (userData: UserRegisterDTO) => {
        try {
            return await AuthService.registerRequest(userData);
        } catch (error: any) {
            const message = error.response?.data?.error?.message
            setErrors([message]);
            console.log("> Error sign up :", error);
        }
    };

    // función para iniciar sesión
    const signin = async (userData: UserLoginDTO) => {
        try {
            const res = await AuthService.loginRequest(userData)
            if (res && res.status === 200) {
                const { accessToken, refreshToken } = res.data
                localStorage.setItem("accessToken", accessToken)
                localStorage.setItem("refreshToken", refreshToken)
                setIsAuthenticated(true);
                return res
            }
        } catch (error: any) {
            const message = error.response?.data?.error?.message
            setErrors([message]);
            console.log("> Error sign in :", error);
        }
    }

    // función logout
    const logout = async () => {
        clearAuthState()
        router.replace('/');
    };

    // Función para refrescar el token (verificar estado actual)
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            logout()
            return
        }
        try {
            const response = await AuthService.refreshTokenRequest({refreshToken});
            const { token: newToken } = response.data;
            localStorage.setItem('accessToken', newToken);
            const result = decodeToken(newToken);
            if (result.isValid && result.user) {
                setUser(result.user);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (error: any) {
            console.error('>Error renovando token: ', error);
            logout();
        }
    };

    // Verificar token al cargar la aplicación
    const checkToken = useCallback(() => {
        const token = localStorage.getItem('accessToken'); // clave corregida
        if (token) {
            const tokenResult = decodeToken(token);
            if (tokenResult.isValid && tokenResult.user) {
                setUser(tokenResult.user);
                setIsAuthenticated(true);
                if (isTokenNearExpiry(token)) {
                    console.warn('Token próximo a expirar');
                    refreshToken();
                }
            } else {
                if (tokenResult.isExpired) {
                    toast.info('Tu sesión ha expirado. Inicia sesión nuevamente.');
                }
                logout();
            }
        } else {
            logout();
        }
        setLoading(false);
    }, [clearAuthState, logout, refreshToken]);

    // Verificar token al montar el componente
    useEffect(() => {
        checkToken();
    }, []);

    // Verificar token periódicamente (cada 5 minutos)
    useEffect(() => {
        if (isAuthenticated) {
            const interval = setInterval(() => {
                refreshToken();
            }, 1 * 60 * 1000); // 1 minutos
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, refreshToken]);

    // Limpiar errores después de 5 segundos
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
                logout,
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
