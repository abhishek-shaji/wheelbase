'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { useEffect } from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: Readonly<LayoutProps>) {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (!session?.user && !session.loading && !session.refetching) {
      router.push('/auth/sign-in');
    }
  }, [session, router]);

  return (
    <div className="flex w-full min-h-screen">
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <Image
          src="/images/174571.jpg"
          alt="Login Visual"
          width={4000}
          height={2250}
          className="w-full h-full object-cover min-h-screen"
        />
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  );
}
