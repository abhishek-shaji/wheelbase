import { client } from '@/lib/openapi-fetch';
import { User } from '@/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createContext, useContext } from 'react';

export const AuthContext = createContext<{
  session: {
    loading: boolean;
    error: string | null;
    user: User | null;
  };
  login: {
    loading: boolean;
    error: string | null;
    mutate: (
      email: string,
      password: string,
      onSuccess?: () => void
    ) => Promise<void>;
  };
  logout: {
    loading: boolean;
    error: string | null;
    mutate: () => Promise<void>;
  };
} | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const session = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data, response } = await client.GET('/auth/session');

      if (response.status === 401) {
        return null;
      }

      return data;
    },
    refetchInterval: 5 * 60 * 1000,
  });

  const login = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, response } = await client.POST('/auth/login', {
        body: { email, password },
      });

      if (response.status === 401) {
        throw new Error('Invalid credentials');
      }

      return data;
    },
  });

  const logout = useMutation({
    mutationFn: async () => {
      const { response } = await client.POST('/auth/logout');

      if (response.status !== 200) {
        throw new Error('Failed to logout');
      }
    },
  });

  return (
    <AuthContext.Provider
      value={{
        session: {
          loading: session.isLoading,
          error: session.error?.message ?? null,
          user: session.data ?? null,
        },
        login: {
          loading: login.isPending,
          error: login.error?.message ?? null,
          mutate: async (
            email: string,
            password: string,
            onSuccess?: () => void
          ) => {
            return login.mutate({ email, password }, { onSuccess });
          },
        },
        logout: {
          loading: logout.isPending,
          error: logout.error?.message ?? null,
          mutate: async () => {
            return logout.mutate();
          },
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
