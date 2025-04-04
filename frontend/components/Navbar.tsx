'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-100 p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-semibold hover:underline">Forsíða</Link>
          <Link href="/posts" className="hover:underline">Færslur</Link>

          {user && (
            <>
              <Link href="/profile" className="hover:underline">Prófíll</Link>
              {user.role === 'admin' && (
                <Link href="/admin" className="hover:underline">Stjórn</Link>
              )}
            </>
          )}
        </div>

        <div>
          {user ? (
            <div className="flex items-center space-x-2">
              <span className="text-sm">Velkomin, {user.username}</span>
              <button
                onClick={logout}
                className="text-red-500 underline text-sm"
              >
                Útskrá
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
              Innskráning
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
