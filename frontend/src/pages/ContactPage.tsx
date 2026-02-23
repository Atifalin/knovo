import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, MapPin, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  subject: z.string().min(1, 'Required'),
  message: z.string().min(10, 'Message too short'),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Message sent! We\'ll be in touch within 24 hours.');
    reset();
  };

  return (
    <>
      <Helmet><title>Contact — KNOVO</title></Helmet>

      <section className="bg-[#0B1F3B] py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-4">Get in Touch</p>
            <h1 className="font-serif text-5xl text-white">Contact Us</h1>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <p className="text-[#C6A75E] text-xs tracking-[0.3em] uppercase mb-4">Contact Information</p>
                <h2 className="font-serif text-3xl text-[#0B1F3B] mb-6">We'd love to hear from you</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Whether you have a question about a product, need styling advice, or want to discuss a corporate order — our team is here to help.
                </p>
              </div>
              <div className="space-y-5">
                {[
                  { icon: Mail, label: 'Email', value: 'hello@knovo.ca' },
                  { icon: MapPin, label: 'Location', value: 'Toronto, Ontario, Canada' },
                  { icon: Clock, label: 'Response Time', value: 'Within 24 business hours' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#0B1F3B] flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-[#C6A75E]" />
                    </div>
                    <div>
                      <p className="text-xs tracking-widest uppercase text-gray-400 mb-0.5">{label}</p>
                      <p className="text-sm text-[#0B1F3B]">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Name</label>
                    <input {...register('name')} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Email</label>
                    <input {...register('email')} type="email" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Subject</label>
                  <input {...register('subject')} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Message</label>
                  <textarea {...register('message')} rows={6} className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors resize-none" />
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0B1F3B] text-white px-10 py-4 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors disabled:opacity-60"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
