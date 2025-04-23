'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserResponse } from '../services/auth';

interface AuthState {
  user: UserResponse | null;
  isAuthenticated: boolean;
  setUser: (user: UserResponse | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
