import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQS = [
  {
    category: 'Orders & Shipping',
    items: [
      { q: 'How long does shipping take?', a: 'Standard shipping within Canada takes 3–7 business days. Express options are available at checkout. Free shipping on orders over CAD $150.' },
      { q: 'Do you ship outside Canada?', a: 'Currently, KNOVO ships exclusively within Canada. We are working on expanding internationally.' },
      { q: 'Can I track my order?', a: 'Yes. Once your order ships, you will receive a tracking number via email.' },
    ],
  },
  {
    category: 'Returns & Exchanges',
    items: [
      { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unworn, in original packaging with all tags attached. Sale items are final sale.' },
      { q: 'How do I initiate a return?', a: 'Contact us at hello@knovo.ca with your order number and reason for return. We will provide a prepaid return label.' },
      { q: 'When will I receive my refund?', a: 'Refunds are processed within 5–7 business days of receiving the returned item.' },
    ],
  },
  {
    category: 'Products',
    items: [
      { q: 'Are your products authentic?', a: 'Absolutely. Every KNOVO product is sourced directly from reputable manufacturers and ateliers. We guarantee the authenticity and quality of all items.' },
      { q: 'How should I care for my silk tie?', a: 'Silk ties should be dry cleaned only. Untie after each wear and hang loosely to allow the fabric to recover. Avoid contact with water and perfume.' },
      { q: 'What is the standard tie length?', a: 'Our ties are standard length (approximately 147cm / 58 inches), suitable for most heights. Width is 8cm, a classic business width.' },
    ],
  },
  {
    category: 'Account & Payment',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, Mastercard, American Express) via Stripe. All transactions are secured with SSL encryption.' },
      { q: 'Is my payment information secure?', a: 'Yes. We use Stripe for payment processing. Your card details are never stored on our servers.' },
      { q: 'Do I need an account to order?', a: 'No. You can checkout as a guest. However, creating an account allows you to track orders, save a wishlist, and access your order history.' },
    ],
  },
];

export default function FAQPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <Helmet><title>FAQ — KNOVO</title></Helmet>

      <section className="bg-[#0B1F3B] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-4">Help Centre</p>
            <h1 className="font-serif text-5xl text-white">Frequently Asked Questions</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {FAQS.map((section) => (
            <div key={section.category}>
              <h2 className="font-serif text-2xl text-[#0B1F3B] mb-6 pb-3 border-b border-gray-100">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item) => {
                  const key = `${section.category}-${item.q}`;
                  const isOpen = open === key;
                  return (
                    <div key={key} className="border border-gray-100">
                      <button
                        onClick={() => setOpen(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-sm font-medium text-[#0B1F3B] pr-4">{item.q}</span>
                        {isOpen ? (
                          <Minus size={16} className="text-[#C6A75E] flex-shrink-0" />
                        ) : (
                          <Plus size={16} className="text-[#C6A75E] flex-shrink-0" />
                        )}
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <p className="px-5 pb-5 text-sm text-gray-500 leading-relaxed">{item.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
