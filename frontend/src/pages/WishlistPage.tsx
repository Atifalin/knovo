import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Heart, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlistStore } from '../store/wishlistStore';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const { user } = useAuthStore();
  const { items, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/account/wishlist' } }); return; }
    fetchWishlist();
  }, [user, navigate, fetchWishlist]);

  const handleAddToCart = (item: typeof items[0]) => {
    addItem(item.product);
    openCart();
    toast.success(`${item.product.name} added to cart`);
  };

  if (!user) return null;

  return (
    <>
      <Helmet><title>My Wishlist — KNOVO</title></Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-2">Saved Items</p>
          <h1 className="font-serif text-4xl text-[#0B1F3B]">My Wishlist</h1>
          {items.length > 0 && <p className="text-gray-400 text-sm mt-2">{items.length} {items.length === 1 ? 'item' : 'items'}</p>}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-200">
            <Heart size={48} className="text-gray-200 mx-auto mb-4" />
            <p className="font-serif text-2xl text-[#0B1F3B] mb-2">Your wishlist is empty</p>
            <p className="text-gray-400 text-sm mb-8">Save pieces you love for later.</p>
            <Link to="/shop" className="text-xs tracking-widest uppercase text-[#C6A75E] border border-[#C6A75E] px-6 py-3 hover:bg-[#C6A75E] hover:text-white transition-colors">
              Browse Collection
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="group relative"
              >
                <Link to={`/products/${item.product.slug}`} className="block">
                  <div className="product-img-zoom aspect-[3/4] bg-gray-50 overflow-hidden relative">
                    <img
                      src={item.product.images[0] || 'https://picsum.photos/400/533'}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => { e.preventDefault(); removeFromWishlist(item.productId); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs text-[#C6A75E] tracking-widest uppercase">{item.product.category?.name}</p>
                    <h3 className="font-serif text-sm text-[#0B1F3B] leading-snug">{item.product.name}</h3>
                    <p className="text-sm font-medium text-[#0B1F3B]">CAD ${Number(item.product.price).toFixed(2)}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.product.stock === 0}
                  className="mt-3 w-full border border-[#0B1F3B] text-[#0B1F3B] py-2 text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#0B1F3B] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ShoppingBag size={12} />
                  {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
