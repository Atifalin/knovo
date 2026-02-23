import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WishlistItem } from '../types';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface WishlistStore {
  items: WishlistItem[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async () => {
        try {
          const res = await api.get('/wishlist');
          set({ items: res.data.data });
        } catch {
          // not logged in
        }
      },

      addToWishlist: async (productId) => {
        try {
          const res = await api.post('/wishlist', { productId });
          set((state) => ({ items: [...state.items, res.data.data] }));
          toast.success('Added to wishlist');
        } catch {
          toast.error('Please log in to use wishlist');
        }
      },

      removeFromWishlist: async (productId) => {
        try {
          await api.delete(`/wishlist/${productId}`);
          set((state) => ({ items: state.items.filter((i) => i.productId !== productId) }));
          toast.success('Removed from wishlist');
        } catch {
          toast.error('Failed to remove from wishlist');
        }
      },

      isInWishlist: (productId) => get().items.some((i) => i.productId === productId),
    }),
    { name: 'knovo-wishlist', partialize: (state) => ({ items: state.items }) }
  )
);
