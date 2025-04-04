'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

type User = {
  id: number;
  username: string;
  role: 'admin' | 'user';
};

type LoginResponse = {
  token: string;
  user: User;
  error?: string;
};


export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data: LoginResponse = await res.json();
      

      if (!res.ok) throw new Error(data.error || 'Innskráning mistókst');

      login(data.token, data.user);

  
      if (data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }

    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error(err);
        setError(err.message || 'Villa við innskráningu');
      } else {
        setError('Óþekkt villa við innskráningu');
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Innskráning</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <input
        type="text"
        placeholder="Notandanafn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        type="password"
        placeholder="Lykilorð"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 mb-4 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Skrá inn
      </button>
    </form>
  );
}
