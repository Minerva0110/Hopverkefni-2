'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-links">
          <Link href="/">Forsíða</Link>
          <Link href="/posts">Færslur</Link>

          {user && (
            <>
              <Link href="/profile">Prófíll</Link>
              {user.role === 'admin' && <Link href="/admin">Stjórn</Link>}
            </>
          )}
        </div>

        <div className="auth-section">
          {user ? (
            <div className="user-info">
              <span>Velkomin, {user.username}</span>
              <button onClick={logout} className="logout-button">Útskrá</button>
            </div>
          ) : (
            <Link href="/login" className="login-link">Innskráning</Link>
          )}
        </div>
      </div>
    </nav>
  );
}