import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, ChevronLeft, ChevronRight, Package, Tag, Palette, Layers } from 'lucide-react';
import { productsApi } from '../lib/products';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';
import type { Product } from '../types';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    productsApi
      .getBySlug(slug)
      .then((res) => setProduct(res.data.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 animate-pulse">
          <div className="aspect-square bg-gray-100" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-100 w-1/4" />
            <div className="h-8 bg-gray-100 w-3/4" />
            <div className="h-6 bg-gray-100 w-1/4" />
            <div className="h-24 bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h1 className="font-serif text-3xl text-[#0B1F3B] mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-[#C6A75E] text-sm tracking-widest uppercase">← Back to Shop</Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addItem(product, quantity);
    openCart();
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = () => {
    if (inWishlist) removeFromWishlist(product.id);
    else addToWishlist(product.id);
  };

  const images = product.images.length > 0 ? product.images : ['https://picsum.photos/800/800'];

  return (
    <>
      <Helmet>
        <title>{product.name} — KNOVO</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-400 mb-10 tracking-widest uppercase">
          <Link to="/" className="hover:text-[#C6A75E] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#C6A75E] transition-colors">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category.slug}`} className="hover:text-[#C6A75E] transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[#0B1F3B]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div className="space-y-4">
            <div className="product-img-zoom relative aspect-square bg-gray-50 overflow-hidden">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-20 overflow-hidden border-2 transition-colors ${
                      i === selectedImage ? 'border-[#C6A75E]' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {product.importedBrand && (
              <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase">{product.importedBrand}</p>
            )}
            <h1 className="font-serif text-3xl lg:text-4xl text-[#0B1F3B] leading-tight">{product.name}</h1>
            <p className="font-serif text-2xl text-[#0B1F3B]">CAD ${Number(product.price).toFixed(2)}</p>

            {/* Stock */}
            {product.stock === 0 ? (
              <span className="inline-block bg-gray-100 text-gray-500 text-xs tracking-widest uppercase px-3 py-1.5">Out of Stock</span>
            ) : product.stock <= product.lowStockThreshold ? (
              <span className="inline-block bg-amber-50 text-amber-700 text-xs tracking-widest uppercase px-3 py-1.5">
                Only {product.stock} left
              </span>
            ) : (
              <span className="inline-block bg-green-50 text-green-700 text-xs tracking-widest uppercase px-3 py-1.5">In Stock</span>
            )}

            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>

            {/* Attributes */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-gray-100">
              {product.material && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Layers size={14} className="text-[#C6A75E]" />
                  <span>Material: <strong className="text-[#0B1F3B]">{product.material}</strong></span>
                </div>
              )}
              {product.color && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Palette size={14} className="text-[#C6A75E]" />
                  <span>Color: <strong className="text-[#0B1F3B]">{product.color}</strong></span>
                </div>
              )}
              {product.pattern && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Tag size={14} className="text-[#C6A75E]" />
                  <span>Pattern: <strong className="text-[#0B1F3B]">{product.pattern}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Package size={14} className="text-[#C6A75E]" />
                <span>SKU: <strong className="text-[#0B1F3B]">{product.sku}</strong></span>
              </div>
            </div>

            {/* Quantity + Actions */}
            {product.stock > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-200">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-[#0B1F3B]"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors text-[#0B1F3B]"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-[#0B1F3B] text-white py-4 text-xs tracking-widest uppercase font-semibold flex items-center justify-center gap-2 hover:bg-[#162d52] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={16} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleWishlist}
                className="w-14 h-14 border border-gray-200 flex items-center justify-center hover:border-[#C6A75E] transition-colors"
                aria-label="Wishlist"
              >
                <Heart
                  size={18}
                  className={inWishlist ? 'fill-[#C6A75E] text-[#C6A75E]' : 'text-[#0B1F3B]'}
                />
              </button>
            </div>

            {/* Shipping note */}
            <p className="text-xs text-gray-400 leading-relaxed">
              Free shipping on orders over CAD $150. Canadian taxes calculated at checkout.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
