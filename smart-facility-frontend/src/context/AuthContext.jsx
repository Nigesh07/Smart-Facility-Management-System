import React, { createContext, useState, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

function loadUserFromStorage() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const validRoles = ["USER", "COORDINATOR", "TECHNICIAN", "ADMIN"];

  if (!token || !role || !validRoles.includes(role)) {
    localStorage.clear();
    return null;
  }

  return {
    token,
    userId: localStorage.getItem("userId"),
    fullName: localStorage.getItem("fullName"),
    email: localStorage.getItem("email"),
    role,
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUserFromStorage);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('fullName', data.fullName);
      localStorage.setItem('email', data.email);
      localStorage.setItem('role', data.role);
      setUser({
        token: data.token,
        userId: data.userId,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      });
      return data;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    setUser(null);
  }, []);

  const updateProfileInfo = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updates };
      if (updates.fullName) localStorage.setItem('fullName', updates.fullName);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfileInfo }}>
      {children}
    </AuthContext.Provider>
  );
}
