import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/40 cart-overlay"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.35 }}
            className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#C6A75E]" />
                <h2 className="font-serif text-lg text-[#0B1F3B]">Your Cart</h2>
                {items.length > 0 && (
                  <span className="text-xs text-gray-400">({items.length} {items.length === 1 ? 'item' : 'items'})</span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="text-gray-400 hover:text-[#0B1F3B] transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBag size={48} className="text-gray-200" />
                  <p className="font-serif text-xl text-[#0B1F3B]">Your cart is empty</p>
                  <p className="text-sm text-gray-400">Add some premium pieces to get started.</p>
                  <button
                    onClick={closeCart}
                    className="mt-2 text-xs tracking-widest uppercase text-[#C6A75E] border border-[#C6A75E] px-6 py-2.5 hover:bg-[#C6A75E] hover:text-white transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0 bg-gray-50 overflow-hidden">
                        <img
                          src={item.product.images[0] || 'https://picsum.photos/80/80'}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0B1F3B] truncate">{item.product.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{item.product.category?.name}</p>
                        <p className="text-sm font-semibold text-[#C6A75E] mt-1">
                          CAD ${(Number(item.product.price) * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-200 hover:border-[#C6A75E] transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-sm w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product.stock}
                            className="w-6 h-6 flex items-center justify-center border border-gray-200 hover:border-[#C6A75E] transition-colors disabled:opacity-40"
                          >
                            <Plus size={12} />
                          </button>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Subtotal</span>
                  <span className="font-semibold text-[#0B1F3B]">CAD ${subtotal().toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-400">Shipping and taxes calculated at checkout.</p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-[#0B1F3B] text-white text-center py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full text-center text-xs tracking-widest uppercase text-gray-400 hover:text-[#0B1F3B] transition-colors py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
