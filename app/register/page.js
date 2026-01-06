'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { registerUser } from '@/lib/api';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    name: '',
    password: '',
    confirmPassword: '',
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

  const validateForm = () => {
    if (!formData.email || !formData.phone || !formData.name || !formData.password) {
      setError('All fields are required');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email format');
      return false;
    }

    // Phone validation (10 digits)
    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      setError('Phone must be 10 digits');
      return false;
    }

    if (formData.name.length < 3) {
      setError('Name must be at least 3 characters');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await registerUser(
        formData.email,
        formData.phone,
        formData.name
      );

      // Store user data and token
      localStorage.setItem('userId', response.id);
      localStorage.setItem('userName', response.name);
      localStorage.setItem('userEmail', response.email);
      localStorage.setItem('userPhone', response.phone);
      localStorage.setItem('authToken', 'token-' + response.id);

      alert('Registration successful! Welcome ' + response.name);
      router.push('/');
      window.location.reload();
    } catch (err) {
      setError(err.message || 'Registration failed. Email might already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join Amaravathi Lodge</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

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
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="10 digit phone number"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link href="/login">Login here</Link>
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