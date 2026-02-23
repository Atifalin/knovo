import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '../lib/api';
import toast from 'react-hot-toast';

const schema = z.object({ email: z.string().email('Invalid email') });
type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/auth/forgot-password', data);
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <Helmet><title>Forgot Password — KNOVO</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img src="/logo.png" alt="KNOVO" className="h-10 w-auto mx-auto mb-6" />
            <h1 className="font-serif text-3xl text-[#0B1F3B]">Reset Password</h1>
            <p className="text-gray-400 text-sm mt-2">Enter your email to receive a reset link</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-[#0B1F3B] font-medium">Check your inbox</p>
              <p className="text-gray-400 text-sm">If that email is registered, a reset link has been sent.</p>
              <Link to="/login" className="inline-block mt-4 text-xs tracking-widest uppercase text-[#C6A75E] hover:underline">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#0B1F3B] text-white py-4 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors disabled:opacity-60"
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </button>
              <p className="text-center text-sm text-gray-400">
                <Link to="/login" className="text-[#C6A75E] hover:underline">Back to Login</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
