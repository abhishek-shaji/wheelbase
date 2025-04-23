'use client';

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  // const { isAuthenticated } = useAuthStore();
  // const router = useRouter();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push('/dashboard');
  //   }
  // }, [isAuthenticated, router]);

  return (
    <div className="flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
