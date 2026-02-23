import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/account';

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
      toast.error(msg);
    }
  };

  return (
    <>
      <Helmet><title>Login — KNOVO</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img src="/logo.png" alt="KNOVO" className="h-10 w-auto mx-auto mb-6" />
            <h1 className="font-serif text-3xl text-[#0B1F3B]">Welcome Back</h1>
            <p className="text-gray-400 text-sm mt-2">Sign in to your KNOVO account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs tracking-widest uppercase text-gray-500">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#C6A75E] hover:underline">Forgot password?</Link>
              </div>
              <input
                {...register('password')}
                type="password"
                autoComplete="current-password"
                className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0B1F3B] text-white py-4 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#C6A75E] hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </>
  );
}
