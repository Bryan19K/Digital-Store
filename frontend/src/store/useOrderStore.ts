import { create } from 'zustand';
import api from '../config/axios';
import { Product } from '../types/Product';

export interface OrderItem extends Product {
    quantity: number;
    productId: string; // Ensure we map _id or productId
}

export interface Order {
    _id: string; // MongoDB
    id?: string; // alias if needed
    date: string;
    items: OrderItem[];
    total: number;
    status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    customerName: string;
}

interface OrderState {
    orders: Order[];
    loading: boolean;
    error: string | null;
    fetchOrders: () => Promise<void>;
    addOrder: (order: any) => Promise<boolean>;
    updateOrderStatus: (id: string, status: Order['status']) => Promise<boolean>;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    loading: false,
    error: null,

    fetchOrders: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/orders');
            set({ orders: response.data, loading: false });
        } catch (error: any) {
            console.error('Failed to fetch orders:', error);
            set({ error: error.message, loading: false });
        }
    },

    addOrder: async (orderData) => {
        set({ loading: true });
        try {
            const response = await api.post('/orders', orderData);
            set(state => ({
                orders: [response.data, ...state.orders],
                loading: false
            }));
            return true;
        } catch (error: any) {
            console.error('Failed to create order:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    },

    updateOrderStatus: async (id, status) => {
        set({ loading: true });
        try {
            // We need to implement this route in backend
            const response = await api.put(`/orders/${id}/status`, { status });
            set(state => ({
                orders: state.orders.map(o => o._id === id ? response.data : o),
                loading: false
            }));
            return true;
        } catch (error: any) {
            console.error('Failed to update order status:', error);
            set({ error: error.message, loading: false });
            return false;
        }
    }
}));
