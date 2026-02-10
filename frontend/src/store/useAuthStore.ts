import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import api from '../config/axios';

export type UserRole = 'admin' | 'user';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    token?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    _hasHydrated: boolean;
    _setHasHydrated: (v: boolean) => void;
    login: (email: string, password?: string) => Promise<boolean>;
    logout: () => void;
    register: (name: string, email: string, password?: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            _hasHydrated: false,

            _setHasHydrated: (v: boolean) => {
                set({ _hasHydrated: v });
            },

            login: async (email, password) => {
                try {
                    const response = await api.post('/auth/login', { email, password });
                    const { _id, name, role, token } = response.data;
                    set({
                        isAuthenticated: true,
                        user: { id: _id, name, email, role: (role || 'user').trim().toLowerCase() as UserRole, token }
                    });
                    return true;
                } catch (error) {
                    console.error('Login failed:', error);
                    return false;
                }
            },

            logout: () => {
                set({ isAuthenticated: false, user: null });
                localStorage.removeItem('auth-storage');
            },

            register: async (name, email, password) => {
                try {
                    const response = await api.post('/auth/register', { name, email, password });
                    const { _id, role, token } = response.data;
                    set({
                        isAuthenticated: true,
                        user: { id: _id, name, email, role: (role || 'user').trim().toLowerCase() as UserRole, token }
                    });
                    return true;
                } catch (error: any) {
                    console.error('Registration failed:', error.response?.data || error.message);
                    return false;
                }
            }
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => {
                return (state, error) => {
                    // Use the action to call set() — this triggers a proper React re-render
                    if (state) {
                        if (state.user?.role) {
                            state.user.role = (state.user.role as string).trim().toLowerCase() as UserRole;
                        }
                        state._setHasHydrated(true);
                    }
                };
            },
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
