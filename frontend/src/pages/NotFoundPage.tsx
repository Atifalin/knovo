import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>404 — Page Not Found | KNOVO</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-4">404</p>
          <h1 className="font-serif text-5xl text-[#0B1F3B] mb-4">Page Not Found</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-10">
            The page you are looking for doesn't exist or has been moved. Let us guide you back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/"
              className="bg-[#0B1F3B] text-white px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors"
            >
              Go Home
            </Link>
            <Link
              to="/shop"
              className="border border-[#0B1F3B] text-[#0B1F3B] px-8 py-3.5 text-xs tracking-widest uppercase font-semibold hover:bg-[#0B1F3B] hover:text-white transition-colors"
            >
              Shop Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
