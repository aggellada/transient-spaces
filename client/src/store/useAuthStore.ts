import { create } from "zustand";
import api from "../lib/utils";
import type { AuthUser, LoginData } from "../types/auth.types";
import type { CreateUserDTO } from "../types/user.types";

interface AuthState {
  authUser: AuthUser | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isLoggingOut: boolean;
  loginError: string | null;
  login: (loginData: LoginData) => Promise<void>;
  signup: (loginData: CreateUserDTO) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isLoggingOut: false,
  loginError: null,

  login: async (loginData: LoginData) => {
    set({ isLoggingIn: true });
    try {
      const response = await api.post("/auth/login", loginData);
      set({ authUser: response.data.data });
      set({ loginError: null });
    } catch (error) {
      console.error("Error in login store", error);
      set({ loginError: "Invalid credentials" });
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (signupData: CreateUserDTO) => {
    set({ isSigningUp: true });
    try {
      const response = await api.post("/auth/signup", signupData);
      set({ authUser: response.data.data });
    } catch (error) {
      console.error("Error in signup store", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await api.get("/auth/logout");
      set({ authUser: null });
    } catch (error) {
      console.error("Error in signup store", error);
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
