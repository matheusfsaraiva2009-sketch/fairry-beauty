import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartProductItem {
  id: string; // product id
  name: string;
  price: number;
  image?: string | null;
  fragrance?: string | null;
  quantity: number;
}

export interface CartMassageItem {
  id: string; // massage id
  name: string;
  price: number;
  duration?: number | null;
  image?: string | null;
  date?: string;
  time?: string;
}

interface CartStore {
  products: CartProductItem[];
  massages: CartMassageItem[];
  isOpen: boolean;
  
  // Actions
  addProduct: (product: { id: string; name: string; price: number; image?: string | null; fragrance?: string | null }, quantity?: number) => void;
  removeProduct: (productId: string) => void;
  updateProductQuantity: (productId: string, quantity: number) => void;
  
  addMassage: (massage: { id: string; name: string; price: number; duration?: number | null; image?: string | null }, date?: string, time?: string) => void;
  removeMassage: (massageId: string) => void;
  updateMassageSchedule: (massageId: string, date: string, time: string) => void;
  
  clearCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
  
  // Computed helpers
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      products: [],
      massages: [],
      isOpen: false,

      addProduct: (product, quantity = 1) => {
        set((state) => {
          const existingIndex = state.products.findIndex((p) => p.id === product.id);
          if (existingIndex > -1) {
            const updated = [...state.products];
            updated[existingIndex].quantity += quantity;
            return { products: updated };
          }
          return {
            products: [...state.products, { ...product, quantity }],
          };
        });
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      updateProductQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeProduct(productId);
          return;
        }
        set((state) => ({
          products: state.products.map((p) =>
            p.id === productId ? { ...p, quantity } : p
          ),
        }));
      },

      addMassage: (massage, date, time) => {
        set((state) => {
          const filtered = state.massages.filter((m) => m.id !== massage.id);
          return {
            massages: [...filtered, { ...massage, date, time }],
          };
        });
      },

      removeMassage: (massageId) => {
        set((state) => ({
          massages: state.massages.filter((m) => m.id !== massageId),
        }));
      },

      updateMassageSchedule: (massageId, date, time) => {
        set((state) => ({
          massages: state.massages.map((m) =>
            m.id === massageId ? { ...m, date, time } : m
          ),
        }));
      },

      clearCart: () => {
        set({ products: [], massages: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      setCartOpen: (open) => {
        set({ isOpen: open });
      },

      getTotalItems: () => {
        const { products, massages } = get();
        const productCount = products.reduce((acc, item) => acc + item.quantity, 0);
        return productCount + massages.length;
      },

      getTotalPrice: () => {
        const { products, massages } = get();
        const productsTotal = products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        const massagesTotal = massages.reduce((acc, item) => acc + (item.price || 0), 0);
        return productsTotal + massagesTotal;
      },
    }),
    {
      name: "aura-essencia-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        products: state.products,
        massages: state.massages,
      }),
    }
  )
);
