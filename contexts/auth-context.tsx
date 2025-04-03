'use client';

import type React from 'react';

import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { UserRole } from '@/types';

interface UserWithRole extends User {
  role: UserRole;
}

interface AuthContextType {
  user: UserWithRole | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, role: UserRole) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserWithRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const setUpUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // In a real app, fetch the user role from your user_roles table or profiles
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching user role:', error);
            toast.error('Error fetching user profile');
            return;
          }

          setUser({ ...session.user, role: (data?.role as UserRole) || 'student' });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth setup error:', error);
        toast.error('Authentication error');
      } finally {
        setIsLoading(false);
      }
    };

    setUpUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUpUser();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      toast.success('Signed in successfully');
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in');
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { error };
      }

      if (data.user) {
        // Create a profile with the role
        const { error: profileError } = await supabase.from('profiles').insert({
          id: data.user.id,
          role,
          email,
        });

        if (profileError) {
          toast.error('Failed to create user profile');
          return { error: profileError };
        }
      }

      toast.success('Account created successfully');
      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account');
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
