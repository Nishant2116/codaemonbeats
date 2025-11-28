import { createContext, useState, useEffect, useContext } from 'react';
import api from './api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        if (token && username) {
            setUser({ username });
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post('login/', { username, password });
            localStorage.setItem('token', res.data.token);
            // Since obtain_auth_token only returns token, we might need to fetch user details or store username if we had it
            // But for now let's assume we can store the username we sent
            localStorage.setItem('username', username);
            setUser({ username });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const register = async (username, email, password) => {
        try {
            const res = await api.post('register/', { username, email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('username', res.data.username);
            setUser({ username: res.data.username });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
