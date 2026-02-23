import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Package, Heart, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useWishlistStore } from '../store/wishlistStore';
import { ordersApi } from '../lib/orders';
import type { Order } from '../types';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  PAID: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-purple-50 text-purple-700',
  COMPLETED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

export default function AccountPage() {
  const { user, logout } = useAuthStore();
  const { items: wishlistItems } = useWishlistStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login', { state: { from: '/account' } }); return; }
    ordersApi.getMyOrders()
      .then((res) => setOrders(res.data.data))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [user, navigate]);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    navigate('/');
  };

  if (!user) return null;

  return (
    <>
      <Helmet><title>My Account — KNOVO</title></Helmet>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-2">Account</p>
          <h1 className="font-serif text-4xl text-[#0B1F3B]">Welcome, {user.firstName}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-gray-50 p-6 space-y-1">
              <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-[#0B1F3B] rounded-full flex items-center justify-center">
                  <User size={18} className="text-[#C6A75E]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0B1F3B]">{user.firstName} {user.lastName}</p>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <Link to="/account" className="flex items-center gap-2 text-sm text-[#0B1F3B] py-2 hover:text-[#C6A75E] transition-colors">
                <Package size={15} /> Orders
              </Link>
              <Link to="/account/wishlist" className="flex items-center gap-2 text-sm text-[#0B1F3B] py-2 hover:text-[#C6A75E] transition-colors">
                <Heart size={15} /> Wishlist ({wishlistItems.length})
              </Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" className="flex items-center gap-2 text-sm text-[#C6A75E] py-2 font-medium">
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-gray-400 py-2 hover:text-red-500 transition-colors w-full text-left"
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </aside>

          {/* Orders */}
          <div className="lg:col-span-3">
            <h2 className="font-serif text-2xl text-[#0B1F3B] mb-6">Order History</h2>
            {loadingOrders ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="animate-pulse border border-gray-100 p-5">
                    <div className="h-4 bg-gray-100 w-1/3 mb-3" />
                    <div className="h-3 bg-gray-100 w-1/4" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-gray-200">
                <Package size={40} className="text-gray-200 mx-auto mb-4" />
                <p className="font-serif text-xl text-[#0B1F3B] mb-2">No orders yet</p>
                <p className="text-gray-400 text-sm mb-6">Your order history will appear here.</p>
                <Link to="/shop" className="text-xs tracking-widest uppercase text-[#C6A75E] border border-[#C6A75E] px-6 py-2.5 hover:bg-[#C6A75E] hover:text-white transition-colors">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border border-gray-100 p-5 hover:border-[#C6A75E] transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-[#0B1F3B] text-sm">{order.orderNumber}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full tracking-widest uppercase ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                        <p className="font-semibold text-[#0B1F3B] text-sm">CAD ${Number(order.total).toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {order.items?.slice(0, 3).map((item) => (
                        <div key={item.id} className="w-12 h-12 bg-gray-50 overflow-hidden">
                          <img
                            src={item.product.images?.[0] || 'https://picsum.photos/48'}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {(order.items?.length || 0) > 3 && (
                        <div className="w-12 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-500">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
