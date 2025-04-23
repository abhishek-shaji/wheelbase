'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { useAuth } from '@/context/auth-context';
import { RegisterFormValues, registerSchema } from '@/schemas/auth';

const SignUpForm = () => {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      firstname: '',
      lastname: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    return registerUser.mutate(data, () => router.push('/'));
  };

  return (
    <div className="rounded-lg p-6 shadow-md">
      <div className="flex w-full flex-col space-y-6">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-white">Create an Account</h1>
          <p className="mt-2 text-gray-400">
            Sign up to start using WheelBase.
          </p>
        </div>

        {registerUser.error && (
          <div className="rounded-md bg-red-900/30 border border-red-700 p-4 text-sm text-red-400">
            {registerUser.error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="firstname">First Name</Label>
            <Input
              id="firstname"
              type="text"
              placeholder="John"
              {...register('firstname')}
              aria-invalid={errors.firstname ? 'true' : 'false'}
              className="mt-1"
            />
            {errors.firstname && (
              <p className="text-sm text-red-400">{errors.firstname.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastname">Last Name</Label>
            <Input
              id="lastname"
              type="text"
              placeholder="Doe"
              {...register('lastname')}
              aria-invalid={errors.lastname ? 'true' : 'false'}
              className="mt-1"
            />
            {errors.lastname && (
              <p className="text-sm text-red-400">{errors.lastname.message}</p>
            )}
          </div>

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
            disabled={registerUser.loading}
          >
            {registerUser.loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/sign-in" className="font-medium text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { SignUpForm };
