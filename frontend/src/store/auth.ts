import { create } from 'zustand';
import { AuthResponse } from '../models/auth';

interface AuthState {
  token: string | null;
  user: any | null; // replace with a proper type if desired
  setAuth: (auth: AuthResponse) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  setAuth: (auth) => set({ token: auth.token, user: auth.user }),
  clearAuth: () => set({ token: null, user: null }),
}));
