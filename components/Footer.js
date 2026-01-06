'use client';
export default function Footer() {
  return (
    <>
      <footer className="footer">
        <div className="footer-container">
          {/* About */}
          <div className="footer-section">
            <h3>Amaravathi Lodge</h3>
            <p>Your perfect destination for comfortable and affordable lodging in Bengaluru.</p>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>📍 Bengaluru, Karnataka</p>
            <p>📱 +91-XXXXXXXXXX</p>
            <p>✉️ info@amaravathi.com</p>
          </div>

          {/* Social */}
          <div className="footer-section">
            <h3>Follow Us</h3>
            <div className="social-links">
              <a href="#">Facebook</a>
              <a href="#">Twitter</a>
              <a href="#">Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2026 Amaravathi Lodge. All rights reserved.</p>
        </div>
      </footer>

      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #cbd5e1;
          margin-top: 4rem;
          border-top: 1px solid #334155;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          padding: 3rem 2rem;
        }

        .footer-section h3 {
          font-size: 1.25rem;
          margin-bottom: 1rem;
          color: #60a5fa;
        }

        .footer-section p {
          color: #94a3b8;
          margin-bottom: 0.5rem;
          line-height: 1.8;
        }

        .social-links {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .social-links a {
          color: #60a5fa;
          text-decoration: none;
          transition: all 0.3s;
        }

        .social-links a:hover {
          color: #93c5fd;
          text-decoration: underline;
        }

        .footer-bottom {
          text-align: center;
          padding: 2rem;
          border-top: 1px solid #334155;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}