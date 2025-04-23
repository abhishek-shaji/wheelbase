'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useAuth } from '@/context/auth-context';
import { LoginFormValues, loginSchema } from '@/schemas/auth';

const SignInForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    return login.mutate(data.email, data.password, () => router.push('/'));
  };

  return (
    <div className="rounded-lg p-6 shadow-md">
      <div className="flex w-full flex-col space-y-6">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-white">Login to WheelBase</h1>
          <p className="mt-2 text-gray-400">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {login.error && (
          <div className="rounded-md bg-red-900/30 border border-red-700 p-4 text-sm text-red-400">
            {login.error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              {...register('email')}
              aria-invalid={errors.email ? 'true' : 'false'}
              className="mt-1"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register('password')}
              aria-invalid={errors.password ? 'true' : 'false'}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-sm text-red-400">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full mt-3"
            disabled={login.loading}
          >
            {login.loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-400">
            Don&apos;t have an account?{' '}
            <Link href="/auth/sign-up" className="font-medium text-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignInForm };
