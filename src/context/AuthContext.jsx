import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../api/supabase';

const AuthContext = createContext(null);
const DEMO_AUTH_STORAGE_KEY = 'tui_blue_demo_admin_auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoAdmin, setIsDemoAdmin] = useState(false);

  useEffect(() => {
    // Check for demo admin session first
    try {
      const storedDemo = localStorage.getItem(DEMO_AUTH_STORAGE_KEY);
      if (storedDemo) {
        const demoUser = JSON.parse(storedDemo);
        setUser(demoUser);
        setIsDemoAdmin(true);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn('Error reading demo auth storage:', e);
    }

    // If Supabase is configured, initialize listener
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      setLoading(false);
    }
  }, []);

  // Standard Email/Password Sign In
  const signIn = async (email, password) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      setUser(data.user);
      setSession(data.session);
      return data;
    }

    // Offline / Demo fallback authentication
    if (
      (email === 'admin@tuiblue.com' || email === 'admin@sensatori.com' || email === 'admin') &&
      (password === 'admin123' || password === 'admin' || password === 'tui2026')
    ) {
      return signInDemoAdmin(email);
    }

    throw new Error('Invalid credentials. In demo mode, use admin@tuiblue.com / admin123');
  };

  // 1-Click Instant Demo Admin Sign In
  const signInDemoAdmin = (customEmail = 'admin@tuiblue.com') => {
    const demoUser = {
      id: 'demo-admin-uuid-001',
      email: customEmail,
      role: 'authenticated',
      app_metadata: { provider: 'demo', roles: ['admin', 'bar_manager'] },
      user_metadata: { full_name: 'TUI Blue Bar Manager' },
    };
    try {
      localStorage.setItem(DEMO_AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    } catch (e) {
      console.warn('Failed to persist demo auth:', e);
    }
    setUser(demoUser);
    setIsDemoAdmin(true);
    return { user: demoUser, session: null };
  };

  // Sign Out
  const signOut = async () => {
    try {
      localStorage.removeItem(DEMO_AUTH_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear demo auth:', e);
    }
    setIsDemoAdmin(false);
    setUser(null);
    setSession(null);

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAuthenticated: Boolean(user),
        isDemoAdmin,
        signIn,
        signInDemoAdmin,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
