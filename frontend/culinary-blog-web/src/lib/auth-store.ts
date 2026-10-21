import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { login, register } from "@/lib/api";
import type { AuthUser, LoginRequest, RegisterRequest } from "@/types/auth";

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  signIn: (request: LoginRequest) => Promise<void>;
  signUp: (request: RegisterRequest) => Promise<void>;
  setUser: (user: AuthUser) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      signIn: async (request) => {
        const response = await login(request);
        set({ accessToken: response.accessToken, user: response.user });
      },
      signUp: async (request) => {
        const response = await register(request);
        set({ accessToken: response.accessToken, user: response.user });
      },
      setUser: (user) => set({ user }),
      signOut: () => set({ accessToken: null, user: null }),
    }),
    {
      name: "culinary-blog-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user,
      }),
    },
  ),
);
