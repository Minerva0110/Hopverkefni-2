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
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      
      const data: LoginResponse = await res.json();
      

      if (!res.ok) throw new Error(data.error || 'Innskráning mistókst');

      login(data.token, data.user);

  
      if (data.user.role === 'admin') {
        router.push('/');
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
    <form onSubmit={handleSubmit} className="login-form">
      <h1>Innskráning</h1>
      {error && <p className="error-message">{error}</p>}
      
      <input
        type="text"
        placeholder="Notandanafn"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      
      <input
        type="password"
        placeholder="Lykilorð"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <button type="submit">Skrá inn</button>
    </form>
  );
}
