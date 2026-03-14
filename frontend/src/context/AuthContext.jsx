import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(false);

    const isAuthenticated = !!token;

    const login = async (credentials) => {
        setLoading(true);
        try {
            const { data } = await authAPI.login(credentials);
            localStorage.setItem('accessToken', data.accessToken);
            setToken(data.accessToken);
            // Decode token to get user info (basic JWT decode)
            try {
                const payload = JSON.parse(atob(data.accessToken.split('.')[1]));
                setUser({ email: payload.sub, roles: payload.roles || [] });
            } catch {
                setUser({ email: credentials.email });
            }
            return data;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (signupData) => {
        setLoading(true);
        try {
            const { data } = await authAPI.signup(signupData);
            return data;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
      const handleTokenRefresh = () => {
        setToken(localStorage.getItem("accessToken"));
      };

      window.addEventListener("tokenRefreshed", handleTokenRefresh);

      return () => window.removeEventListener("tokenRefreshed", handleTokenRefresh);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};
