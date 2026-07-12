const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

export function setToken(token: string) {
  localStorage.setItem('token', token);
}

export function clearToken() {
  localStorage.removeItem('token');
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }

  return res.json();
}

export function apiGet<T>(endpoint: string) {
  return apiClient<T>(endpoint);
}

export function apiPost<T>(endpoint: string, body: unknown) {
  return apiClient<T>(endpoint, { method: 'POST', body: JSON.stringify(body) });
}

export function apiPatch<T>(endpoint: string, body: unknown) {
  return apiClient<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) });
}

export function apiDelete<T>(endpoint: string) {
  return apiClient<T>(endpoint, { method: 'DELETE' });
}
