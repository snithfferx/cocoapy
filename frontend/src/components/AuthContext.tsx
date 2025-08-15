import React, { createContext, useContext, useState, useEffect,useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import { API_URL } from '../config/constants';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  username: string;
}

interface TokenPayload {
  sub: number; // subject (user id) - estándar JWT
  username: string;
  email: string;
  role: 'user' | 'admin';
  exp: number;
  iat: number;
}

interface LoginResponse {
  token: string;
  expiration: number;
  now: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  sessionID: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Función para validar si el token ha expirado
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch {
      return false;
    }
  };

  // Función para extraer usuario del token
  const getUserFromToken = (token: string): User | null => {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      return {
        id: decoded.sub,
        username: decoded.username,
        name: decoded.username, // Tu backend usa username, mapeamos a name
        email: decoded.email,
        role: decoded.role,
      };
    } catch(error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  };

  // Función para limpiar datos de autenticación
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
    const token = localStorage.getItem('token');
      
      if (token && isTokenValid(token)) {
        const userData = getUserFromToken(token);
        if (userData) {
          setUser(userData);
        } else {
          clearAuthData();
        }
      } else if (token) {
        // Token expirado o inválido, limpiar
        clearAuthData();
      }
      
      setLoading(false);
    };initializeAuth();
  }, [clearAuthData]);

  // Función de login
  const login = useCallback(async (credentials: { username?: string; email?: string; password: string }) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.data?.token) {
        const loginData: LoginResponse = data.data;
        
        // Guardar token
        localStorage.setItem('token', loginData.token);
        
        // Extraer y setear usuario del token
        const userData = getUserFromToken(loginData.token);
        if (userData) {
          setUser(userData);
          return { success: true };
        } else {
          return { success: false, message: 'Error al procesar datos de usuario' };
        }
      } else {
        return { 
          success: false, 
          message: data.message || 'Credenciales incorrectas' 
        };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Error de conexión' 
      };
    }
  }, []);

  // Función de logout
  const logout = useCallback(() => {
    clearAuthData();
    // Opcional: llamar al endpoint de logout del backend si existe
    // fetch(`${API_URL}/auth/logout`, { method: 'POST' }).catch(() => {});
  }, [clearAuthData]);

  // Función para refrescar perfil del usuario
  const refreshUserProfile = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token || !isTokenValid(token)) {
      logout();
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.data) {
          setUser(prev => prev ? { ...prev, ...data.data } : null);
        }
      } else if (response.status === 401) {
        // Token inválido o expirado
        logout();
      }
    } catch (error) {
      console.error('Error refrescando perfil:', error);
    }
  }, [logout]);
  // Verificar token periódicamente (cada 5 minutos)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token || !isTokenValid(token)) {
        logout();
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearInterval(interval);
  }, [user, logout]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    login,
    logout,
    refreshUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
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