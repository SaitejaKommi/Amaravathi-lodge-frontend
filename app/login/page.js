'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8081/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          phone: '',
        }),
      });

      if (!response.ok) {
        throw new Error('User not found or login failed');
      }

      const data = await response.json();

      if (data.success) {
        // Store user data
        localStorage.setItem('userId', data.id);
        localStorage.setItem('userName', data.name);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userPhone', data.phone);
        localStorage.setItem('authToken', 'token-' + data.id);

        alert('Login successful! Welcome back ' + data.name);
        router.push('/');
        window.location.reload();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to your account</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link href="/register">Register here</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 200px);
          padding: 2rem;
        }

        .auth-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 2.5rem;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .auth-card h1 {
          color: #60a5fa;
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .auth-card p {
          color: #94a3b8;
          margin-bottom: 2rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          color: #cbd5e1;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .form-group input {
          width: 100%;
          padding: 0.75rem;
          background-color: #0f172a;
          border: 1px solid #334155;
          color: #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
        }

        .form-group input:focus {
          outline: none;
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }

        .form-group input::placeholder {
          color: #64748b;
        }

        .auth-footer {
          text-align: center;
          color: #94a3b8;
          margin-top: 1.5rem;
        }

        .auth-footer a {
          color: #60a5fa;
          font-weight: 600;
        }

        .auth-footer a:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 600px) {
          .auth-card {
            padding: 2rem;
          }

          .auth-card h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}