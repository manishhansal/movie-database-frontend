const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:9000';

export type User = {
  id?: string;
  name: string;
  email: string;
  profilePic?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  user: User;
  token: string;
};

export async function loginApi({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/users/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }
  return res.json();
}

export async function signupApi({ name, email, password, profilePic }: { name: string; email: string; password: string; profilePic?: string }): Promise<User> {
  const res = await fetch(`${BASE_URL}/users/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, profilePic }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || 'Signup failed');
  }
  const data = await res.json();
  return data.user;
} 