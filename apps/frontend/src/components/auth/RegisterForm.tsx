'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import Button from '../ui/button';
import Input from '../ui/input';
import authService, { UserCreate } from '@/services/auth';
import { useAuthStore } from '@/store/auth';

export default function RegisterForm() {
  const [serverError, setServerError] = useState('');
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserCreate>({
    defaultValues: {
      email: '',
      firstname: '',
      lastname: '',
      password: '',
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setUser(data);
      router.push('/dashboard');
    },
    onError: (error: any) => {
      setServerError(
        error.response?.data?.detail || 'Registration failed. Please try again.'
      );
    },
  });

  const onSubmit = (data: UserCreate) => {
    setServerError('');
    registerMutation.mutate(data);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
        <p className="mt-1 text-gray-600">Sign up for your account</p>
      </div>

      {serverError && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstname?.message}
            fullWidth
            {...register('firstname', {
              required: 'First name is required',
              minLength: {
                value: 1,
                message: 'First name is required',
              },
              maxLength: {
                value: 50,
                message: 'First name must be less than 50 characters',
              },
            })}
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastname?.message}
            fullWidth
            {...register('lastname', {
              required: 'Last name is required',
              minLength: {
                value: 1,
                message: 'Last name is required',
              },
              maxLength: {
                value: 50,
                message: 'Last name must be less than 50 characters',
              },
            })}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="your@email.com"
          error={errors.email?.message}
          fullWidth
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          fullWidth
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters',
            },
          })}
        />

        <Button type="submit" fullWidth isLoading={registerMutation.isPending}>
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
