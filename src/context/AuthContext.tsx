import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { getUsers, setUsers, initializeData } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userPayload: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface RequireAuthProps {
  children: ReactNode;
  roles?: Role[];
  fallback?: ReactNode;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ 
  children, 
  roles = [], 
  fallback = <div className="text-center py-8">Access denied</div> 
}) => {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    return <div className="text-center py-8">Please log in to access this page</div>;
  }
  
  if (roles.length > 0 && !roles.includes(currentUser.role)) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeData();
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user && !user.isBlocked) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (userPayload: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    const users = getUsers();
    
    // Check if email already exists
    if (users.find(u => u.email === userPayload.email)) {
      return false;
    }

    const newUser: User = {
      ...userPayload,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isApproved: userPayload.role === 'SELLER' ? false : true
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    
    // Auto-login after registration
    setCurrentUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return true;
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};