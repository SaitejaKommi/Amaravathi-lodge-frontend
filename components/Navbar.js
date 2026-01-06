'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    
    if (userId && name) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserName('');
    router.push('/');
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            🏠 Amaravathi
          </Link>

          {/* Menu Toggle */}
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>

          {/* Desktop Menu */}
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/rooms" className="nav-link">Rooms</Link>
            
            {isLoggedIn ? (
              <>
                <span className="user-greeting">👤 {userName}</span>
                <Link href="/my-bookings" className="nav-link">Bookings</Link>
                <Link href="/owner-dashboard" className="nav-link">Dashboard</Link>
                <button 
                  onClick={handleLogout}
                  className="nav-link logout-btn"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-link login-btn">Login</Link>
                <Link href="/register" className="nav-link register-btn">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          color: #e2e8f0;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid #334155;
        }

        .navbar-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
        }

        .navbar-logo {
          font-size: 1.5rem;
          font-weight: bold;
          text-decoration: none;
          color: #60a5fa;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .navbar-logo:hover {
          color: #93c5fd;
        }

        .navbar-menu {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: #cbd5e1;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s;
          font-weight: 500;
        }

        .nav-link:hover {
          color: #60a5fa;
        }

        .user-greeting {
          color: #60a5fa;
          font-weight: 600;
          padding: 0.5rem 1rem;
          background: rgba(96, 165, 250, 0.1);
          border-radius: 6px;
        }

        .login-btn {
          color: #60a5fa;
          border: 1px solid #60a5fa;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .login-btn:hover {
          background: #60a5fa;
          color: #0f172a;
        }

        .register-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }

        .logout-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: #60a5fa;
          font-size: 1.5rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .navbar-container {
            padding: 1rem;
          }

          .navbar-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #0f172a;
            border-bottom: 1px solid #334155;
            flex-direction: column;
            gap: 1rem;
            padding: 2rem;
          }

          .navbar-menu.active {
            display: flex;
          }

          .nav-link {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}