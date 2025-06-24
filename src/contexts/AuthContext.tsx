import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, User } from '@/types';
import { getUsers, saveUsers, getCurrentUser, setCurrentUser, generateId } from '@/lib/storage';
import { toast } from 'sonner';

const AuthContext = createContext<AuthUser | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      setCurrentUser(foundUser);
      toast.success('Login successful!');
      setIsLoading(false);
      return true;
    } else {
      toast.error('Invalid credentials');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, _password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = getUsers();
    const existingUser = users.find(u => u.email === email);
    
    if (existingUser) {
      toast.error('User with this email already exists');
      setIsLoading(false);
      return false;
    }
    
    const newUser: User = {
      id: generateId(),
      email,
      name,
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    setUser(newUser);
    setCurrentUser(newUser);
    toast.success('Registration successful!');
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCurrentUser(null);
    toast.success('Logged out successfully');
  };

  const value: AuthUser = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};