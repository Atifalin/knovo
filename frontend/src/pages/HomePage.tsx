import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Shield, Truck, Star, Award } from 'lucide-react';
import ProductCard from '../components/ui/ProductCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { productsApi } from '../lib/products';
import api from '../lib/api';
import toast from 'react-hot-toast';
import type { Product } from '../types';

const categories = [
  {
    name: 'Ties',
    slug: 'ties',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80',
    desc: 'Silk & woven masterpieces',
    count: '6 styles',
  },
  {
    name: 'Pocket Squares',
    slug: 'pocket-squares',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
    desc: 'The finishing touch',
    count: '4 styles',
  },
  {
    name: 'Cufflinks',
    slug: 'cufflinks',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',
    desc: 'Crafted to perfection',
    count: '4 styles',
  },
];

const values = [
  {
    icon: Award,
    title: 'Imported Craftsmanship',
    desc: 'Every piece sourced from the finest ateliers in Italy, France, and England.',
  },
  {
    icon: Star,
    title: 'Premium Materials',
    desc: 'Pure silk, fine wool, sterling silver — no compromises on quality.',
  },
  {
    icon: Truck,
    title: 'Canadian Delivery',
    desc: 'Free shipping on orders over CAD $150. Delivered with care.',
  },
  {
    icon: Shield,
    title: '30-Day Returns',
    desc: 'Shop with confidence. Easy returns on all unworn items.',
  },
];

const testimonials = [
  {
    name: 'James R.',
    city: 'Toronto, ON',
    text: 'The quality of the silk ties is exceptional. I\'ve received more compliments wearing KNOVO than any other brand.',
    rating: 5,
  },
  {
    name: 'Michael T.',
    city: 'Vancouver, BC',
    text: 'Fast shipping, beautiful packaging, and the cufflinks are absolutely stunning. My go-to for gifts.',
    rating: 5,
  },
  {
    name: 'David K.',
    city: 'Calgary, AB',
    text: 'Finally a Canadian brand that understands luxury menswear. The pocket squares are works of art.',
    rating: 5,
  },
];

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi
      .getAll({ featured: 'true', limit: 4 })
      .then((res) => setFeatured(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Helmet>
        <title>KNOVO — Premium Men's Accessories | Canada</title>
        <meta name="description" content="Shop premium imported ties, pocket squares, and cufflinks. Luxury men's accessories delivered across Canada." />
      </Helmet>

      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center bg-[#0B1F3B] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1800&q=80')",
            opacity: 0.25,
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3B] via-[#0B1F3B]/80 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[#C6A75E] text-xs tracking-[0.4em] uppercase mb-6"
            >
              Premium Imported Accessories
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-6"
            >
              Dress with
              <br />
              <em className="text-[#C6A75E] not-italic">distinction.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-300 text-lg leading-relaxed mb-10 max-w-lg"
            >
              Curated luxury accessories for the refined Canadian gentleman. Imported silk ties, pocket squares, and handcrafted cufflinks.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-[#C6A75E] text-[#0B1F3B] px-8 py-4 text-xs tracking-widest uppercase font-bold hover:bg-[#d4bc80] transition-colors"
              >
                Shop Collection <ArrowRight size={14} />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 border border-white/40 text-white px-8 py-4 text-xs tracking-widest uppercase font-semibold hover:border-[#C6A75E] hover:text-[#C6A75E] transition-colors"
              >
                Our Story
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex gap-10 mt-16 pt-10 border-t border-white/10"
            >
              {[
                { value: '14+', label: 'Curated Pieces' },
                { value: '3', label: 'Collections' },
                { value: '100%', label: 'Imported' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl text-[#C6A75E]">{stat.value}</p>
                  <p className="text-gray-400 text-xs tracking-widest uppercase mt-1">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-gray-500 text-[10px] tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-[#C6A75E] to-transparent"
          />
        </motion.div>
      </section>

      {/* ── ANNOUNCEMENT STRIP ── */}
      <div className="bg-[#C6A75E] py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-8 text-[#0B1F3B] text-xs tracking-widest uppercase font-semibold">
          <span>Free Shipping Over CAD $150</span>
          <span className="hidden sm:block">·</span>
          <span className="hidden sm:block">Imported from Italy, France & England</span>
          <span className="hidden md:block">·</span>
          <span className="hidden md:block">30-Day Returns</span>
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">Collections</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-[#0B1F3B]">Shop by Category</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group block relative overflow-hidden"
                  style={{ aspectRatio: '4/5' }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3B]/90 via-[#0B1F3B]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <p className="text-[#C6A75E] text-[10px] tracking-[0.3em] uppercase mb-1">{cat.desc}</p>
                    <h3 className="font-serif text-3xl text-white mb-1">{cat.name}</h3>
                    <p className="text-gray-400 text-xs mb-4">{cat.count}</p>
                    <span className="inline-flex items-center gap-2 text-white text-xs tracking-widest uppercase border-b border-white/40 pb-0.5 group-hover:border-[#C6A75E] group-hover:text-[#C6A75E] transition-colors">
                      Explore <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="py-24 bg-[#f8f7f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-16"
          >
            <div>
              <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">Handpicked</p>
              <h2 className="font-serif text-4xl lg:text-5xl text-[#0B1F3B]">Featured Pieces</h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#0B1F3B] hover:text-[#C6A75E] transition-colors border-b border-current pb-0.5"
            >
              View All <ArrowRight size={12} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>

          <div className="text-center mt-12 sm:hidden">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#0B1F3B] border border-[#0B1F3B] px-8 py-3 hover:bg-[#0B1F3B] hover:text-white transition-colors"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── BRAND STORY BANNER ── */}
      <section className="relative py-32 bg-[#0B1F3B] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=1600&q=80')" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#C6A75E] text-xs tracking-[0.4em] uppercase mb-6">The KNOVO Standard</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-white leading-tight mb-8">
              "Every detail tells a story.<br />Make yours worth telling."
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10 text-lg">
              KNOVO was founded on a single belief: that Canadian men deserve access to the same quality of accessories worn by the world's most distinguished gentlemen. We source directly from the finest ateliers in Italy, France, and England.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 border border-[#C6A75E] text-[#C6A75E] px-8 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-[#C6A75E] hover:text-[#0B1F3B] transition-colors"
            >
              Our Story <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">Why KNOVO</p>
            <h2 className="font-serif text-4xl text-[#0B1F3B]">The Difference</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {values.map((val, i) => (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center space-y-4"
              >
                <div className="w-12 h-12 bg-[#f8f7f4] rounded-full flex items-center justify-center mx-auto">
                  <val.icon size={20} className="text-[#C6A75E]" />
                </div>
                <h3 className="font-serif text-lg text-[#0B1F3B]">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-[#f8f7f4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">Reviews</p>
            <h2 className="font-serif text-4xl text-[#0B1F3B]">What Gentlemen Say</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-8 border border-gray-100"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={14} className="fill-[#C6A75E] text-[#C6A75E]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-[#0B1F3B] text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.city}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="py-24 bg-[#0B1F3B]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[#C6A75E] text-xs tracking-[0.4em] uppercase mb-4">Stay Informed</p>
            <h2 className="font-serif text-4xl lg:text-5xl text-white mb-4">Join the Inner Circle</h2>
            <p className="text-gray-400 mb-10 leading-relaxed">
              Exclusive offers, new arrivals, and style notes for the discerning gentleman.
            </p>
            <NewsletterForm />
          </motion.div>
        </div>
      </section>
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      toast.success('Welcome to the inner circle!');
      setEmail('');
      setDone(true);
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-4">
        <p className="text-[#C6A75E] font-serif text-xl mb-2">Thank you for joining.</p>
        <p className="text-gray-400 text-sm">Expect style notes in your inbox soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        required
        className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3.5 text-sm outline-none focus:border-[#C6A75E] transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-[#C6A75E] text-[#0B1F3B] px-8 py-3.5 text-xs tracking-widest uppercase font-bold hover:bg-[#d4bc80] transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {loading ? 'Joining...' : 'Join Now'}
      </button>
    </form>
  );
}
