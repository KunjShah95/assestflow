import { apiPost, apiGet } from '@/lib/api-client';
import type { User } from '@/types/common';

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login(email: string, password: string) {
    return apiPost<LoginResponse>('/auth/login', { email, password });
  },

  signup(data: { email: string; password: string; name: string }) {
    return apiPost<LoginResponse>('/auth/signup', data);
  },

  me() {
    return apiGet<User>('/auth/me');
  },
};
