import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../../lib/api';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#0B1F3B] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <img src="/logo.png" alt="KNOVO" className="h-12 w-auto max-w-[160px] object-contain mb-4 brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed mt-4">
              Premium men's accessories crafted for the refined Canadian gentleman. Imported luxury, delivered with distinction.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-[#C6A75E] text-xs tracking-widest uppercase font-semibold mb-6">Shop</h4>
            <ul className="space-y-3">
              {[
                { to: '/shop', label: 'All Products' },
                { to: '/shop?category=ties', label: 'Ties' },
                { to: '/shop?category=pocket-squares', label: 'Pocket Squares' },
                { to: '/shop?category=cufflinks', label: 'Cufflinks' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 text-sm hover:text-[#C6A75E] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[#C6A75E] text-xs tracking-widest uppercase font-semibold mb-6">Company</h4>
            <ul className="space-y-3">
              {[
                { to: '/about', label: 'About Us' },
                { to: '/contact', label: 'Contact' },
                { to: '/faq', label: 'FAQ' },
                { to: '/shipping', label: 'Shipping & Returns' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 text-sm hover:text-[#C6A75E] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-[#C6A75E] text-xs tracking-widest uppercase font-semibold mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Exclusive offers and new arrivals, delivered to your inbox.</p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-2.5 text-sm outline-none focus:border-[#C6A75E] transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#C6A75E] text-[#0B1F3B] px-4 py-2.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#d4bc80] transition-colors disabled:opacity-60"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} KNOVO. All rights reserved. Canada.
          </p>
          <div className="flex gap-6">
            {[
              { to: '/privacy', label: 'Privacy Policy' },
              { to: '/terms', label: 'Terms & Conditions' },
              { to: '/refund', label: 'Refund Policy' },
            ].map((link) => (
              <Link key={link.to} to={link.to} className="text-gray-500 text-xs hover:text-[#C6A75E] transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
