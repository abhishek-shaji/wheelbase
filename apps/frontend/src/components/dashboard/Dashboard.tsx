'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import Button from '../ui/button';
import authService from '@/services/auth';
import { useMutation } from '@tanstack/react-query';

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      logout();
      router.push('/login');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="py-10">
      <header className="mb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  User Profile
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Personal details
                </p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                isLoading={logoutMutation.isPending}
              >
                Logout
              </Button>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Email address
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h2 className="text-lg font-medium text-gray-900">
                Welcome to Wheelbase
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                This is a simple dashboard placeholder. Add your content here.
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-500">
                You are now logged in and can access protected features of the
                application.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
