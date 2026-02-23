import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function AboutPage() {
  return (
    <>
      <Helmet><title>About Us — KNOVO</title></Helmet>

      {/* Hero */}
      <section className="relative bg-[#0B1F3B] py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-4">Our Story</p>
            <h1 className="font-serif text-5xl text-white mb-6">Crafted for the<br /><em className="text-[#C6A75E]">Refined Gentleman</em></h1>
            <p className="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
              KNOVO was founded on a singular belief: that the details define the man.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80"
                  alt="KNOVO craftsmanship"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
              <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase">The KNOVO Philosophy</p>
              <h2 className="font-serif text-3xl text-[#0B1F3B]">Where Tradition Meets Modern Elegance</h2>
              <p className="text-gray-600 leading-relaxed">
                KNOVO was born in Canada with a vision to bring the finest imported accessories to the discerning Canadian gentleman. We source exclusively from the most respected ateliers in Italy, France, England, and Scotland — places where the art of fine accessory-making has been perfected over generations.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every tie, pocket square, and pair of cufflinks in our collection is chosen with exacting standards. We believe that true luxury lies not in ostentation, but in the quiet confidence of a perfectly chosen accessory.
              </p>
              <div className="w-10 h-px bg-[#C6A75E]" />
              <p className="text-gray-600 leading-relaxed italic font-serif">
                "Dress well. It is a form of good manners."
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-3">What We Stand For</p>
            <h2 className="font-serif text-4xl text-[#0B1F3B]">Our Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Uncompromising Quality', desc: 'We accept nothing less than the finest materials — pure silk, fine wool, sterling silver, and genuine gemstones. Every piece is inspected before it reaches you.' },
              { title: 'Imported Provenance', desc: 'Our accessories are sourced from the world\'s most respected production centres: Como for silk, Edinburgh for wool, Birmingham for silver, and Florence for fine jewellery.' },
              { title: 'Canadian Commitment', desc: 'We are proudly Canadian. We understand the Canadian gentleman — his climate, his occasions, his understated elegance. Every collection is curated with him in mind.' },
            ].map((val, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="space-y-4"
              >
                <div className="w-10 h-px bg-[#C6A75E]" />
                <h3 className="font-serif text-xl text-[#0B1F3B]">{val.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{val.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
