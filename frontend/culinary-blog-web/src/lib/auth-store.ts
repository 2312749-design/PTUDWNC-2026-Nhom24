import { create } from "zustand";
import { login } from "@/lib/api";
import type { AuthUser, LoginRequest } from "@/types/auth";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  signIn: (request: LoginRequest) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  signIn: async (request) => {
    const response = await login(request);
    set({ accessToken: response.accessToken, user: response.user });
  },
  signOut: () => set({ accessToken: null, user: null }),
}));
