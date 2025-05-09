'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import React, { useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Loader2 } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: Readonly<MainLayoutProps>) => {
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    if (!session?.user && !session.loading && !session.refetching) {
      router.push('/auth/sign-in');
    }
  }, [session, router]);

  if (session.loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="px-4 md:px-6 lg:px-8 @container">
          <div className="w-full max-w-6xl mx-auto">
            <div className="overflow-hidden">{children}</div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default MainLayout;
