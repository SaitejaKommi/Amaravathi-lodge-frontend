'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('userId'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link href="/" className="navbar-logo">
            🏠 Amaravathi Lodge
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
                <Link href="/my-bookings" className="nav-link">My Bookings</Link>
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
                <Link href="/login" className="nav-link">Login</Link>
                <Link href="/register" className="nav-link register-btn">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          background: linear-gradient(135deg, #9393f4ff 0%, #220f2eff 100%);
          color: white;
          padding: 0;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
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
          color: white;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .navbar-menu {
          display: flex;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          transition: opacity 0.3s;
        }

        .nav-link:hover {
          opacity: 0.8;
        }

        .register-btn {
          background: #040505ff;
          padding: 0.5rem 1rem;
          border-radius: 5px;
        }

        .logout-btn {
          background: #ef4444;
          padding: 0.5rem 1rem;
          border-radius: 5px;
        }

        .menu-toggle {
          display: none;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .menu-toggle {
            display: block;
          }

          .navbar-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            flex-direction: column;
            gap: 1rem;
            padding: 2rem;
          }

          .navbar-menu.active {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}