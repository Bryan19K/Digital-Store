import { create } from 'zustand';
import api from '../config/axios';
import { Product } from '../types/Product';

interface ProductState {
    products: Product[];
    loading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
    addProduct: (product: FormData) => Promise<boolean>; // Use FormData for file upload if needed, or JSON
    updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
    deleteProduct: (id: string) => Promise<boolean>;
}

export const useProductStore = create<ProductState>((set, get) => ({
    products: [], // Start empty
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/products');
            set({ products: response.data, loading: false });
        } catch (error: any) {
            console.error('Failed to fetch products:', error);
            set({ error: error.message, loading: false });
        }
    },

    addProduct: async (productData) => {
        set({ loading: true });
        try {
            // Check if productData is FormData or Object. For now assuming Object as per previous impl
            // But if we want image upload later we need FormData.
            // keeping it JSON for migration of current simple structure
            const response = await api.post('/products', productData);
            set(state => ({
                products: [...state.products, response.data],
                loading: false
            }));
            return true;
        } catch (error: any) {
            console.error('Failed to add product:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    },

    updateProduct: async (id, updatedData) => {
        set({ loading: true });
        try {
            const response = await api.put(`/products/${id}`, updatedData);
            set(state => ({
                products: state.products.map(p => p._id === id ? response.data : p),
                loading: false
            }));
            return true;
        } catch (error: any) {
            console.error('Failed to update product:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    },

    deleteProduct: async (id) => {
        set({ loading: true });
        try {
            await api.delete(`/products/${id}`);
            set(state => ({
                products: state.products.filter(p => p._id !== id),
                loading: false
            }));
            return true;
        } catch (error: any) {
            console.error('Failed to delete product:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    }
}));
