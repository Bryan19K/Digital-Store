import { create } from 'zustand';
import api from '../config/axios';

export interface Category {
    _id: string;
    name_es: string;
    name_en: string;
    slug: string;
    color: string;
}

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    fetchCategories: () => Promise<void>;
    addCategory: (category: Omit<Category, '_id'>) => Promise<boolean>;
    updateCategory: (id: string, category: Partial<Category>) => Promise<boolean>;
    deleteCategory: (id: string) => Promise<boolean>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: [],
    isLoading: false,

    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const response = await api.get('/categories');
            set({ categories: response.data, isLoading: false });
        } catch (error) {
            console.error('Error fetching categories:', error);
            set({ isLoading: false });
        }
    },

    addCategory: async (category) => {
        try {
            const response = await api.post('/categories', category);
            set({ categories: [...get().categories, response.data] });
            return true;
        } catch (error) {
            console.error('Error adding category:', error);
            return false;
        }
    },

    updateCategory: async (id, category) => {
        try {
            const response = await api.put(`/categories/${id}`, category);
            set({
                categories: get().categories.map((cat) =>
                    cat._id === id ? response.data : cat
                ),
            });
            return true;
        } catch (error) {
            console.error('Error updating category:', error);
            return false;
        }
    },

    deleteCategory: async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            set({
                categories: get().categories.filter((cat) => cat._id !== id),
            });
            return true;
        } catch (error) {
            console.error('Error deleting category:', error);
            return false;
        }
    },
}));
