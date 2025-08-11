import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin } from '../types';

interface AuthContextType {
  admin: Admin | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin credentials
const MOCK_ADMIN = {
  id: '1',
  username: 'admin',
  email: 'admin@realestate.com'
};

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'Mr733550'
};

// Simple hash function for password security
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash.toString();
};

// Store hashed password
const HASHED_PASSWORD = hashPassword(ADMIN_CREDENTIALS.password);
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const hashedInputPassword = hashPassword(password);
    if (username === ADMIN_CREDENTIALS.username && hashedInputPassword === HASHED_PASSWORD) {
      setAdmin(MOCK_ADMIN);
      localStorage.setItem('admin', JSON.stringify(MOCK_ADMIN));
      return true;
    }
    return false;
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  return (
    <AuthContext.Provider value={{
      admin,
      login,
      logout,
      isAuthenticated: !!admin
    }}>
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