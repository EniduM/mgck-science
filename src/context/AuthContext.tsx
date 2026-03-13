/**
 * Firebase Authentication Context
 * Provides auth state and functions throughout the app
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  AuthError,
} from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError.code));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError.code));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setError(null);
      setIsLoading(true);
      await signOut(auth);
      setUser(null);
    } catch (err) {
      const authError = err as AuthError;
      setError(getErrorMessage(authError.code));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    signup,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Helper function to get user-friendly error messages
function getErrorMessage(code: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address',
    'auth/user-disabled': 'This user account has been disabled',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/email-already-in-use': 'Email is already in use',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/operation-not-allowed': 'Operation not allowed',
    'auth/too-many-requests': 'Too many login attempts. Please try again later',
  };

  return errorMessages[code] || 'An authentication error occurred';
}
