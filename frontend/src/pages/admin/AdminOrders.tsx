import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { ordersApi } from '../../lib/orders';
import type { Order } from '../../types';
import toast from 'react-hot-toast';

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'];

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-50 text-yellow-700',
  PAID: 'bg-blue-50 text-blue-700',
  SHIPPED: 'bg-purple-50 text-purple-700',
  COMPLETED: 'bg-green-50 text-green-700',
  CANCELLED: 'bg-red-50 text-red-700',
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersApi.getAllOrders();
      setOrders(res.data.data);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await ordersApi.updateStatus(orderId, status);
      toast.success('Order status updated');
      fetchOrders();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <>
      <Helmet><title>Orders — Admin | KNOVO</title></Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-3xl text-[#0B1F3B]">Orders</h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="animate-pulse h-16 bg-gray-50" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200">
            <p className="text-gray-400 text-sm">No orders yet.</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-100 overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Order</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Customer</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Date</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Total</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Status</th>
                  <th className="text-left px-4 py-3 text-xs tracking-widest uppercase text-gray-400 font-normal">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#0B1F3B]">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.items?.length || 0} item(s)</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-[#0B1F3B]">{order.firstName} {order.lastName}</p>
                      <p className="text-xs text-gray-400">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-CA', {
                        year: 'numeric', month: 'short', day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0B1F3B]">
                      CAD ${Number(order.total).toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full tracking-widest uppercase font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-xs border border-gray-200 px-2 py-1.5 outline-none focus:border-[#C6A75E] bg-white disabled:opacity-50"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
