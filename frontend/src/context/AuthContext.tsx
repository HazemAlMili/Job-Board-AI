import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/auth.service';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (full_name: string, email: string, password: string, role?: 'applicant' | 'hr') => Promise<void>;
  updateUser: (user: User) => void;
  logout: () => void;
  isHR: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // onAuthStateChange handles EVERYTHING:
    // - INITIAL_SESSION: restores session on page refresh
    // - SIGNED_OUT: clears the user
    // We do NOT call getCurrentUser() here to avoid double fetchUserRole during login.
    // login() and register() set the user directly from their response.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        if (!session) {
          setUser(null);
        }
        // Always resolve loading on first event (INITIAL_SESSION)
        setIsLoading(false);
      }
    );

    // For page refresh: if there's an existing session, fetch user with role
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const currentUser = await authService.getCurrentUser();
          if (mounted) setUser(currentUser);
        }
      } catch {
        // no valid session
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    // login() fetches the role itself and sets user directly — no double fetch
    const response = await authService.login({ email, password });
    setUser(response.user);
    return response.user;
  };

  const register = async (full_name: string, email: string, password: string, role?: 'applicant' | 'hr') => {
    const response = await authService.register({ email, password, full_name, role });
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const isHR = React.useCallback(() => {
    return user?.role === 'hr';
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        updateUser,
        logout,
        isHR,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
