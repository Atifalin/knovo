import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Minimum 8 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser({ email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName });
      toast.success('Account created!');
      navigate('/account');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <>
      <Helmet><title>Create Account — KNOVO</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <img src="/logo.png" alt="KNOVO" className="h-10 w-auto mx-auto mb-6" />
            <h1 className="font-serif text-3xl text-[#0B1F3B]">Create Account</h1>
            <p className="text-gray-400 text-sm mt-2">Join KNOVO for exclusive access</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Email</label>
              <input {...register('email')} type="email" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Password</label>
              <input {...register('password')} type="password" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase text-gray-500 mb-1.5">Confirm Password</label>
              <input {...register('confirmPassword')} type="password" className="w-full border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#C6A75E] transition-colors" />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0B1F3B] text-white py-4 text-xs tracking-widest uppercase font-semibold hover:bg-[#162d52] transition-colors disabled:opacity-60"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#C6A75E] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}
