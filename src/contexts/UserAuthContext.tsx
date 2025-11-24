import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 
  | 'super-admin'
  | 'admin' 
  | 'staff'
  | 'volunteer'
  | 'guest'
  | 'external-agent'
  | 'hotel-manager' 
  | 'tour-operator' 
  | 'hr-team' 
  | 'finance-officer' 
  | 'support-staff'
  | 'Mannat-Finance'
  | 'Mannat-User'
  | 'facility-staff'


export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

// Mock database of users - In production, this would be in a secure backend
export const mockUsers: User[] = [
  { id: '1', name: 'Super Administrator', email: 'superadmin@fhims.com', role: 'super-admin', isActive: true },
  { id: '2', name: 'System Administrator', email: 'admin@fhims.com', role: 'admin', isActive: true },
  { id: '3', name: 'Ahmed Khan', email: 'ahmed.khan@fhims.com', role: 'tour-operator', department: 'Operations', isActive: true },
  { id: '4', name: 'Sarah Ahmed', email: 'sarah.ahmed@fhims.com', role: 'hotel-manager', department: 'Accommodation', isActive: true },
  { id: '5', name: 'Fatima Ali', email: 'fatima.ali@fhims.com', role: 'hr-team', department: 'Human Resources', isActive: true },
  { id: '6', name: 'Hassan Raza', email: 'hassan.raza@fhims.com', role: 'finance-officer', department: 'Finance', isActive: true },
  { id: '7', name: 'Ali Hussain', email: 'ali.hussain@fhims.com', role: 'support-staff', department: 'Support', isActive: true },
  { id: '8', name: 'Zainab Hassan', email: 'zainab@fhims.com', role: 'tour-operator', department: 'Operations', isActive: true },
  { id: '9', name: 'Mohammed Abbas', email: 'mohammed@fhims.com', role: 'hotel-manager', department: 'Accommodation', isActive: true },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    // Simulate API call - in production, this would validate against a backend
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Find user by email (in production, backend would validate email + password)
    const foundUser = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!foundUser) {
      setError('Invalid email or password. Please try again.');
      throw new Error('Invalid credentials');
    }
    
    // In production, password would be validated on backend
    // For demo purposes, we accept any password if email exists
    setUser(foundUser);
  };

  const logout = () => {
    setUser(null);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, error }}>
      {children}
    </AuthContext.Provider>
  );
};
