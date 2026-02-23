import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Menu, X, Search } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, openCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/shop', label: 'Shop' },
    { to: '/shop?category=ties', label: 'Ties' },
    { to: '/shop?category=pocket-squares', label: 'Pocket Squares' },
    { to: '/shop?category=cufflinks', label: 'Cufflinks' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-sm' : 'bg-white/95 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo.png" alt="KNOVO" className="h-10 lg:h-14 w-auto max-w-[160px] object-contain" />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `text-xs tracking-widest uppercase font-medium transition-colors duration-200 ${
                      isActive ? 'text-[#C6A75E]' : 'text-[#0B1F3B] hover:text-[#C6A75E]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#0B1F3B] hover:text-[#C6A75E] transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              <Link
                to={user ? '/account/wishlist' : '/login'}
                className="text-[#0B1F3B] hover:text-[#C6A75E] transition-colors hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart size={20} />
              </Link>

              <Link
                to={user ? '/account' : '/login'}
                className="text-[#0B1F3B] hover:text-[#C6A75E] transition-colors hidden sm:block"
                aria-label="Account"
              >
                <User size={20} />
              </Link>

              <button
                onClick={openCart}
                className="relative text-[#0B1F3B] hover:text-[#C6A75E] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={20} />
                {totalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C6A75E] text-white text-[10px] font-semibold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems()}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-[#0B1F3B] hover:text-[#C6A75E] transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 bg-white overflow-hidden"
            >
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-4 flex gap-3">
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ties, pocket squares, cufflinks..."
                  className="flex-1 border border-gray-200 px-4 py-2 text-sm text-[#0B1F3B] outline-none focus:border-[#C6A75E] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#0B1F3B] text-white px-6 py-2 text-xs tracking-widest uppercase hover:bg-[#162d52] transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 right-0 z-40 w-72 bg-white shadow-2xl lg:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <img src="/logo.png" alt="KNOVO" className="h-10 w-auto max-w-[140px] object-contain" />
              <button onClick={() => setMobileOpen(false)} className="text-[#0B1F3B]">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `text-sm tracking-widest uppercase font-medium ${
                      isActive ? 'text-[#C6A75E]' : 'text-[#0B1F3B]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
                <Link
                  to={user ? '/account' : '/login'}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-widest uppercase text-[#0B1F3B]"
                >
                  {user ? 'My Account' : 'Login'}
                </Link>
                <Link
                  to={user ? '/account/wishlist' : '/login'}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm tracking-widest uppercase text-[#0B1F3B]"
                >
                  Wishlist
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Spacer */}
      <div className="h-16 lg:h-20" />
    </>
  );
}
