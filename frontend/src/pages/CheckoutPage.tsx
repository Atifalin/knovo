import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '../store/cartStore';
import { ordersApi, cartItemsToPayload } from '../lib/orders';
import type { CheckoutForm, OrderBreakdown } from '../types';
import toast from 'react-hot-toast';

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';
const stripePromise = loadStripe(STRIPE_KEY);

const PROVINCES = [
  { code: 'AB', name: 'Alberta' }, { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' }, { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' }, { code: 'NS', name: 'Nova Scotia' },
  { code: 'NT', name: 'Northwest Territories' }, { code: 'NU', name: 'Nunavut' },
  { code: 'ON', name: 'Ontario' }, { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' }, { code: 'SK', name: 'Saskatchewan' },
  { code: 'YT', name: 'Yukon' },
];

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  address: z.string().min(5, 'Enter full address'),
  city: z.string().min(1, 'Required'),
  province: z.string().min(1, 'Select province'),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, 'Invalid postal code'),
});

export default function CheckoutPage() {
  const { items } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) navigate('/shop');
  }, [items, navigate]);

  return (
    <>
      <Helmet><title>Checkout — KNOVO</title></Helmet>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-2">Secure Checkout</p>
          <h1 className="font-serif text-4xl text-[#0B1F3B]">Complete Your Order</h1>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </>
  );
}

function CheckoutForm() {
  const { items, subtotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [breakdown, setBreakdown] = useState<OrderBreakdown | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [processing, setProcessing] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
    defaultValues: { province: 'ON' },
  });

  const province = watch('province');

  useEffect(() => {
    if (!province || items.length === 0) return;
    const payload = cartItemsToPayload(items);
    ordersApi.createPaymentIntent(payload, province)
      .then((res) => {
        setBreakdown(res.data.breakdown);
        setClientSecret(res.data.clientSecret);
      })
      .catch(() => {});
  }, [province, items]);

  const onSubmit = async (data: CheckoutForm) => {
    if (!stripe || !elements || !clientSecret) {
      toast.error('Payment not ready. Please try again.');
      return;
    }
    setProcessing(true);
    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement, billing_details: { name: `${data.firstName} ${data.lastName}`, email: data.email } },
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        const orderRes = await ordersApi.createOrder({
          ...data,
          items: cartItemsToPayload(items),
          stripePaymentId: paymentIntent.id,
        });
        clearCart();
        navigate(`/order-success/${orderRes.data.data.id}`);
      }
    } catch {
      toast.error('Order failed. Please try again.');
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
        {/* Left: Form */}
        <div className="lg:col-span-3 space-y-8">
          {/* Contact */}
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-5">Contact Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">First Name</label>
                <input {...register('firstName')} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Last Name</label>
                <input {...register('lastName')} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
              <div className="col-span-2">
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Email</label>
                <input {...register('email')} type="email" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-5">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Street Address</label>
                <input {...register('address')} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">City</label>
                  <input {...register('city')} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Province</label>
                  <select {...register('province')} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] bg-white transition-colors">
                    {PROVINCES.map((p) => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                  {errors.province && <p className="text-red-500 text-xs mt-1">{errors.province.message}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Postal Code</label>
                  <input {...register('postalCode')} placeholder="A1A 1A1" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Country</label>
                  <input value="Canada" disabled className="w-full border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-400" />
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-5">Payment</h2>
            <div className="border border-gray-200 px-4 py-4 focus-within:border-[#C6A75E] transition-colors">
              <CardElement options={{ style: { base: { fontSize: '14px', color: '#0B1F3B', fontFamily: 'Inter, sans-serif', '::placeholder': { color: '#9ca3af' } } } }} />
            </div>
            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">🔒 Secured by Stripe. Your payment info is never stored.</p>
          </section>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="font-serif text-xl text-[#0B1F3B] mb-6">Order Summary</h2>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="w-16 h-16 bg-white overflow-hidden flex-shrink-0">
                    <img src={item.product.images[0] || 'https://picsum.photos/64'} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#0B1F3B] font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-[#0B1F3B] mt-0.5">
                      CAD ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span><span>CAD ${breakdown?.subtotal || subtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>{breakdown ? (breakdown.shipping === '0.00' ? 'Free' : `CAD $${breakdown.shipping}`) : '—'}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Tax (GST/HST/PST)</span><span>{breakdown ? `CAD $${breakdown.tax}` : '—'}</span>
              </div>
              <div className="flex justify-between text-base font-semibold text-[#0B1F3B] pt-2 border-t border-gray-200">
                <span>Total</span><span>CAD ${breakdown?.total || '—'}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={processing || !stripe}
              className="w-full mt-6 bg-[#0B1F3B] text-white py-4 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay CAD $${breakdown?.total || '...'}`}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              By placing your order you agree to our{' '}
              <Link to="/terms" className="underline hover:text-[#C6A75E]">Terms & Conditions</Link>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
