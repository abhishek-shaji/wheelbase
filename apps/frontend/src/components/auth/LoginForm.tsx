'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import authService, { UserLogin } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { Label } from '../ui/label';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

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

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setUser(data);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.detail || 'Login failed. Please try again.'
      );
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setServerError('');
    loginMutation.mutate(data as UserLogin);
  };

  return (
    <div className="rounded-lg p-6 shadow-md">
      <div className="flex w-full flex-col space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white">Login to WheelBase</h1>
          <p className="mt-2 text-gray-400">
            Welcome back! Please sign in to your account.
          </p>
        </div>

        {serverError && (
          <div className="rounded-md bg-red-900/30 border border-red-700 p-4 text-sm text-red-400">
            {serverError}
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

          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="text-blue-400 hover:text-blue-300"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-400">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
