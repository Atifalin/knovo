import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { TrendingUp, ShoppingBag, Package, Users } from 'lucide-react';
import api from '../../lib/api';

interface Analytics {
  totalRevenue: string;
  totalOrders: number;
  activeProducts: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    firstName: string;
    lastName: string;
    createdAt: string;
  }[];
  topProducts: {
    id: string;
    name: string;
    images: string[];
    price: number;
    totalSold: number;
  }[];
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  PAID: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-purple-50 text-purple-700',
  COMPLETED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/analytics')
      .then((res) => setAnalytics(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = analytics
    ? [
        { label: 'Total Revenue', value: `CAD $${analytics.totalRevenue}`, icon: TrendingUp, color: 'text-[#C6A75E]' },
        { label: 'Total Orders', value: analytics.totalOrders, icon: ShoppingBag, color: 'text-blue-500' },
        { label: 'Active Products', value: analytics.activeProducts, icon: Package, color: 'text-green-500' },
      ]
    : [];

  return (
    <>
      <Helmet><title>Admin Dashboard — KNOVO</title></Helmet>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-3xl text-[#0B1F3B]">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back, Admin</p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-50 p-6 h-28 rounded" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs tracking-widest uppercase text-gray-400">{stat.label}</p>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <p className="font-serif text-3xl text-[#0B1F3B]">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl text-[#0B1F3B]">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs text-[#C6A75E] tracking-widest uppercase hover:underline">View All</Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="animate-pulse h-12 bg-gray-50" />)}
              </div>
            ) : analytics?.recentOrders.length === 0 ? (
              <p className="text-gray-400 text-sm">No orders yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics?.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-[#0B1F3B]">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.firstName} {order.lastName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full tracking-widest uppercase ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-medium text-[#0B1F3B]">CAD ${Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-serif text-xl text-[#0B1F3B]">Top Products</h2>
              <Link to="/admin/products" className="text-xs text-[#C6A75E] tracking-widest uppercase hover:underline">Manage</Link>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="animate-pulse h-12 bg-gray-50" />)}
              </div>
            ) : analytics?.topProducts.length === 0 ? (
              <p className="text-gray-400 text-sm">No sales data yet.</p>
            ) : (
              <div className="space-y-3">
                {analytics?.topProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-10 h-10 bg-gray-50 overflow-hidden flex-shrink-0">
                      <img src={product.images?.[0] || 'https://picsum.photos/40'} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0B1F3B] truncate">{product.name}</p>
                      <p className="text-xs text-gray-400">CAD ${Number(product.price).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={12} className="text-gray-400" />
                      <span className="text-sm text-[#0B1F3B] font-medium">{product.totalSold}</span>
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
