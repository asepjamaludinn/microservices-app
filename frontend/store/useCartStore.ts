import { create } from "zustand";

type Menu = {
  id: number;
  name: string;
  price: string | number;
  image_url?: string;
  category?: { name: string };
};

export type CartItem = {
  menu: Menu;
  quantity: number;
  notes: string;
};

interface CartState {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (menu: Menu) => void;
  updateQuantity: (id: number, delta: number) => void;
  updateNotes: (id: number, notes: string) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: [],
  isCartOpen: false,

  setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),

  addToCart: (menu) => {
    set((state) => {
      const existing = state.cart.find((item) => item.menu.id === menu.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.menu.id === menu.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        };
      }
      return { cart: [...state.cart, { menu, quantity: 1, notes: "" }] };
    });
  },

  updateQuantity: (id, delta) => {
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.menu.id === id
            ? { ...item, quantity: item.quantity + delta }
            : item,
        )
        .filter((item) => item.quantity > 0),
    }));
  },

  updateNotes: (id, notes) => {
    set((state) => ({
      cart: state.cart.map((item) =>
        item.menu.id === id ? { ...item, notes } : item,
      ),
    }));
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.menu.id !== id),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getSubtotal: () => {
    return get().cart.reduce(
      (sum, item) => sum + Number(item.menu.price) * item.quantity,
      0,
    );
  },
}));
