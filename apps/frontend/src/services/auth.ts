import apiClient from '../lib/api';

export interface UserCreate {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

const authService = {
  register: async (userData: UserCreate): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(
      '/auth/register',
      userData
    );

    return response.data;
  },

  login: async (credentials: UserLogin): Promise<UserResponse> => {
    const response = await apiClient.post<UserResponse>(
      '/auth/login',
      credentials
    );

    return response.data;
  },

  logout: async (): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>('/auth/logout');

    return response.data;
  },

  getCurrentUser: async (): Promise<UserResponse | null> => {
    try {
      const response = await apiClient.get<UserResponse>('/auth/session');
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

export default authService;
