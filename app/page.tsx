'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Amaravathi Lodge</h1>
          <p>Your perfect home away from home in Bengaluru</p>
          <Link href="/rooms" className="btn btn-primary btn-lg">
            Book Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📶</div>
            <h3>Free WiFi</h3>
            <p>High-speed internet in all rooms and common areas</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">❄️</div>
            <h3>AC/NON-AC Options</h3>
            <p>Choose between air-conditioned and non-AC rooms</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💧</div>
            <h3>Hot Water</h3>
            <p>24/7 hot water supply for your comfort</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🅿️</div>
            <h3>Parking</h3>
            <p>Secure parking space available for guests</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Book?</h2>
        <p>Explore our rooms and dormitories with the best prices in Bengaluru</p>
        <Link href="/rooms" className="btn btn-primary btn-lg">
          View All Rooms
        </Link>
      </section>

      <style jsx>{`
        .hero {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          padding: 6rem 2rem;
          text-align: center;
          margin: 3rem 0;
          border-radius: 12px;
          border: 1px solid #1e3a8a;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .hero-content p {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          color: #e0e7ff;
        }

        .features {
          padding: 4rem 2rem;
          text-align: center;
        }

        .features h2 {
          font-size: 2.5rem;
          margin-bottom: 3rem;
          color: #60a5fa;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }

        .feature-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          border: 1px solid #334155;
          transition: all 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          border-color: #60a5fa;
          box-shadow: 0 12px 30px rgba(96, 165, 250, 0.2);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          color: #60a5fa;
        }

        .feature-card p {
          color: #94a3b8;
          line-height: 1.6;
        }

        .cta {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 4rem 2rem;
          text-align: center;
          border-radius: 12px;
          margin: 4rem 0;
          border: 1px solid #334155;
        }

        .cta h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: #60a5fa;
        }

        .cta p {
          font-size: 1.1rem;
          margin-bottom: 2rem;
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2rem;
          }

          .features h2,
          .cta h2 {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  );
}