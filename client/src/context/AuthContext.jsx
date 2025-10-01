import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Vérifier le token au chargement
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  const fetchUser = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const responseText = await res.text();
      if (!responseText) {
        throw new Error('Empty response from server');
      }
      
      const data = JSON.parse(responseText);
      
      if (data?.user) {
        setUser(data.user);
      } else {
        throw new Error('Invalid user data in response');
      }
    } catch (error) {
      console.error('Erreur récupération utilisateur:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const responseText = await res.text();
    let data;
    
    if (!responseText) {
      throw new Error('Empty response from server');
    }

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      throw new Error('Invalid response format from server');
    }

    if (!res.ok) {
      throw new Error(data?.error || 'Erreur de connexion');
    }

    if (!data?.token || !data?.user) {
      throw new Error('Données utilisateur manquantes dans la réponse');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    return data;
  };

  const register = async (email, password, name) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });

    const responseText = await res.text();
    let data;
    
    if (!responseText) {
      throw new Error('Empty response from server');
    }

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      throw new Error('Invalid response format from server');
    }

    if (!res.ok) {
      throw new Error(data?.error || 'Erreur d\'inscription');
    }

    if (!data?.token || !data?.user) {
      throw new Error('Données utilisateur manquantes dans la réponse');
    }

    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('token', data.token);
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
