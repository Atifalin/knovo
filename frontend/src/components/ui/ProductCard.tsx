import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '../../types';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import toast from 'react-hot-toast';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem, openCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.stock === 0) return;
    addItem(product);
    openCart();
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="group relative"
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="product-img-zoom relative aspect-[3/4] bg-gray-50 overflow-hidden">
          <img
            src={product.images[0] || 'https://picsum.photos/400/533'}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.featured && (
              <span className="bg-[#C6A75E] text-white text-[10px] tracking-widest uppercase px-2 py-1">
                Featured
              </span>
            )}
            {product.stock === 0 && (
              <span className="bg-gray-800 text-white text-[10px] tracking-widest uppercase px-2 py-1">
                Sold Out
              </span>
            )}
            {product.stock > 0 && product.stock <= product.lowStockThreshold && (
              <span className="bg-amber-500 text-white text-[10px] tracking-widest uppercase px-2 py-1">
                Low Stock
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
            aria-label="Add to wishlist"
          >
            <Heart
              size={15}
              className={inWishlist ? 'fill-[#C6A75E] text-[#C6A75E]' : 'text-[#0B1F3B]'}
            />
          </button>

          {/* Add to Cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-[#0B1F3B] text-white py-3 text-xs tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-[#162d52] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={14} />
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          {product.importedBrand && (
            <p className="text-[10px] tracking-widest uppercase text-[#C6A75E]">
              {product.importedBrand}
            </p>
          )}
          <h3 className="font-serif text-[#0B1F3B] text-sm leading-snug group-hover:text-[#C6A75E] transition-colors">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-[#0B1F3B]">CAD ${Number(product.price).toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  );
}
