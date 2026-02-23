import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle, Package } from 'lucide-react';
import { ordersApi } from '../lib/orders';
import type { Order } from '../types';

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!id) return;
    ordersApi.getOrder(id).then((res) => setOrder(res.data.data)).catch(() => {});
  }, [id]);

  return (
    <>
      <Helmet><title>Order Confirmed — KNOVO</title></Helmet>
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <CheckCircle size={64} className="text-[#C6A75E] mx-auto mb-6" />
          <h1 className="font-serif text-4xl text-[#0B1F3B] mb-3">Order Confirmed</h1>
          {order && (
            <p className="text-gray-500 text-sm mb-2">Order <strong className="text-[#0B1F3B]">{order.orderNumber}</strong></p>
          )}
          <p className="text-gray-500 text-sm mb-10">
            Thank you for your order. A confirmation has been sent to {order?.email || 'your email'}.
          </p>

          {order && (
            <div className="bg-gray-50 text-left p-6 mb-10 space-y-4">
              <h2 className="font-serif text-lg text-[#0B1F3B] flex items-center gap-2">
                <Package size={18} className="text-[#C6A75E]" /> Order Details
              </h2>
              <div className="space-y-3">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.product.name} × {item.quantity}</span>
                    <span className="text-[#0B1F3B] font-medium">CAD ${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-3 space-y-1.5">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Subtotal</span><span>CAD ${Number(order.subtotal).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{Number(order.shippingCost) === 0 ? 'Free' : `CAD $${Number(order.shippingCost).toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Tax</span><span>CAD ${Number(order.taxAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#0B1F3B] pt-1 border-t border-gray-200">
                  <span>Total</span><span>CAD ${Number(order.total).toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 text-sm text-gray-500">
                <p>Shipping to: {order.address}, {order.city}, {order.province} {order.postalCode}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/shop"
              className="bg-[#0B1F3B] text-white px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/account"
              className="border border-[#0B1F3B] text-[#0B1F3B] px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#0B1F3B] hover:text-white transition-colors"
            >
              View Orders
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
