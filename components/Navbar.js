'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
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
    setIsProfileOpen(false);
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

          {/* Desktop Menu */}
          <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/rooms" className="nav-link">Rooms</Link>
            
            {isLoggedIn && (
              <>
                <Link href="/my-bookings" className="nav-link">Bookings</Link>
                <Link href="/owner-dashboard" className="nav-link">Dashboard</Link>
              </>
            )}
          </div>

          {/* Right Side: Auth or Profile */}
          <div className="navbar-right">
            {isLoggedIn ? (
              <div className="profile-dropdown">
                <button 
                  className="profile-btn"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  👤 {userName}
                </button>
                
                {isProfileOpen && (
                  <div className="dropdown-menu">
                    <button 
                      onClick={handleLogout}
                      className="dropdown-item logout-item"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="nav-link login-btn">Login</Link>
                <Link href="/register" className="nav-link register-btn">Register</Link>
              </>
            )}
          </div>

          {/* Menu Toggle for Mobile */}
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
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
          flex-shrink: 0;
        }

        .navbar-logo:hover {
          color: #93c5fd;
        }

        .navbar-menu {
          display: flex;
          gap: 2rem;
          align-items: center;
          flex: 1;
          margin: 0 2rem;
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

        .navbar-right {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        /* Profile Dropdown */
        .profile-dropdown {
          position: relative;
        }

        .profile-btn {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .profile-btn:hover {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
          transform: translateY(-2px);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          border-radius: 8px;
          min-width: 200px;
          margin-top: 0.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
          overflow: hidden;
          z-index: 2000;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-item {
          display: block;
          width: 100%;
          padding: 0.75rem 1rem;
          color: #cbd5e1;
          text-decoration: none;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          font-size: 0.95rem;
          transition: all 0.3s;
          border-bottom: 1px solid #334155;
        }

        .dropdown-item:hover {
          background: rgba(96, 165, 250, 0.1);
          color: #60a5fa;
          padding-left: 1.2rem;
        }

        .dropdown-item:last-child {
          border-bottom: none;
        }

        .logout-item:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #fca5a5;
        }

        .dropdown-divider {
          height: 1px;
          background: #334155;
          margin: 0;
        }

        .login-btn {
          color: #60a5fa;
          border: 1px solid #60a5fa;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          transition: all 0.3s;
          display: inline-block;
        }

        .login-btn:hover {
          background: #60a5fa;
          color: #0f172a;
        }

        .register-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          padding: 0.6rem 1rem;
          border-radius: 6px;
          transition: all 0.3s;
          display: inline-block;
        }

        .register-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
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
            flex-wrap: wrap;
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
            margin: 0;
          }

          .navbar-menu.active {
            display: flex;
          }

          .nav-link {
            width: 100%;
          }

          .navbar-logo {
            flex: 1;
          }

          .navbar-right {
            position: absolute;
            top: 100%;
            right: 0;
            width: 100%;
            padding: 1rem;
            background: #1e293b;
            border-top: 1px solid #334155;
            flex-direction: column;
            gap: 0.5rem;
          }

          .profile-dropdown {
            width: 100%;
          }

          .profile-btn {
            width: 100%;
            justify-content: center;
          }

          .dropdown-menu {
            position: static;
            border: none;
            background: #0f172a;
            box-shadow: none;
            margin-top: 0.5rem;
          }

          .dropdown-item {
            padding: 0.5rem 1rem;
          }

          .login-btn,
          .register-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </>
  );
}