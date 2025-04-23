'use client';

import { SignInForm } from '@/components/partials/auth/sign-in-form';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const { session } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (session.user) {
      router.push('/');
    }
  }, [session]);

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <SignInForm />
      </div>
    </div>
  );
};

export default LoginPage;
