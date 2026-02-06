import { create } from 'zustand';

interface CartItem {
  product: any;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity) =>
    set((state) => {
      const existingItem = state.items.find(item => item.product._id === product._id);
      if (existingItem) {
        return {
          items: state.items.map(item =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        };
      }
      return { items: [...state.items, { product, quantity }] };
    }),
  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter(item => item.product._id !== productId)
    })),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map(item =>
        item.product._id === productId ? { ...item, quantity } : item
      )
    })),
  clearCart: () => set({ items: [] }),
  getTotal: () => {
    const { items } = get();
    return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}));
