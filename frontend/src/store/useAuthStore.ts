import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../config/axios';

export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
    id: string; // MongoDB _id
    name: string;
    email: string;
    role: UserRole;
    token?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password?: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,

            login: async (email, password) => {
                try {
                    const response = await api.post('/auth/login', { email, password });
                    const { _id, name, role, token } = response.data;

                    set({
                        isAuthenticated: true,
                        user: { id: _id, name, email, role, token }
                    });
                    return true;
                } catch (error) {
                    console.error('Login failed:', error);
                    return false;
                }
            },

            logout: () => {
                set({ isAuthenticated: false, user: null });
                localStorage.removeItem('auth-storage'); // Optional clean up
            },

            register: async (name, email, password) => {
                try {
                    const response = await api.post('/auth/register', { name, email, password });
                    const { _id, role, token } = response.data;

                    set({
                        isAuthenticated: true,
                        user: { id: _id, name, email, role, token }
                    });
                    return true;
                } catch (error: any) {
                    console.error('Registration failed:', error.response?.data || error.message);
                    // We could return the error string but for now let's keep boolean and rely on console
                    return false;
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
