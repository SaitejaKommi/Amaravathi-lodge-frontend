'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRoomById } from '@/lib/api';

export default function RoomDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoom();
  }, [params.id]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const data = await getRoomById(params.id);
      setRoom(data);
      setError('');
    } catch (err) {
      setError('Failed to load room details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading room details...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!room) return <div className="error-message">Room not found</div>;

  return (
    <div className="room-details-container">
      <Link href="/rooms" className="back-link">← Back to Rooms</Link>

      <div className="room-details">
        <div className="room-details-header">
          <div className="header-content">
            <h1>{room.roomNumber}</h1>
            <span className={`type-badge ${room.type.toLowerCase()}`}>
              {room.type}
            </span>
          </div>
          <div className={`status ${room.isAvailable ? 'available' : 'unavailable'}`}>
            {room.isAvailable ? '✓ Available' : '✗ Currently Booked'}
          </div>
        </div>

        <div className="room-details-content">
          <div className="details-left">
            <div className="description-box">
              <h3>About This Room</h3>
              <p>{room.description || 'No description available'}</p>
            </div>

            <div className="features-box">
              <h3>Features & Amenities</h3>
              <div className="features-list">
                <div className="feature-item">
                  {room.type === 'AC' ? '❄️' : '🌡️'} {room.type === 'AC' ? 'Air Conditioning' : 'No Air Conditioning'}
                </div>
                {room.description?.includes('WiFi') && (
                  <div className="feature-item">📶 Free High-Speed WiFi</div>
                )}
                {room.description?.includes('Parking') && (
                  <div className="feature-item">🅿️ Parking Available</div>
                )}
                {room.description?.includes('water') && (
                  <div className="feature-item">💧 24/7 Hot Water</div>
                )}
                <div className="feature-item">🛏️ Comfortable Beds</div>
                <div className="feature-item">🧹 Clean & Well-Maintained</div>
              </div>
            </div>
          </div>

          <div className="details-right">
            <div className="price-box">
              <div className="price-label">Price Per Night</div>
              <div className="price">₹{room.price}</div>
              <p className="price-note">One-time payment during checkout</p>
            </div>

            {room.isAvailable ? (
              <Link href={`/booking/${room.id}`} className="btn btn-primary btn-large">
                Book Now
              </Link>
            ) : (
              <button disabled className="btn btn-disabled btn-large">
                Currently Unavailable
              </button>
            )}

            <div className="info-box">
              <h4>📞 Need Help?</h4>
              <p>Contact us at +91-XXXXXXXXXX</p>
              <p>Email: info@amaravathi.com</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .room-details-container {
          padding: 2rem 0;
        }

        .back-link {
          color: #60a5fa;
          text-decoration: none;
          font-weight: 600;
          margin-bottom: 2rem;
          display: inline-block;
          transition: all 0.3s;
        }

        .back-link:hover {
          color: #93c5fd;
          transform: translateX(-5px);
        }

        .room-details {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          border-radius: 12px;
          overflow: hidden;
        }

        .room-details-header {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          padding: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .room-details-header h1 {
          color: white;
          margin: 0;
          font-size: 2.5rem;
        }

        .type-badge {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
        }

        .type-badge.ac {
          background: #10b981;
          color: white;
        }

        .type-badge.non-ac {
          background: #f59e0b;
          color: white;
        }

        .status {
          font-size: 1.1rem;
          font-weight: 600;
        }

        .status.available {
          color: #10b981;
        }

        .status.unavailable {
          color: #ef4444;
        }

        .room-details-content {
          padding: 2rem;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .description-box,
        .features-box,
        .price-box,
        .info-box {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid #334155;
          padding: 1.5rem;
          border-radius: 8px;
        }

        h3, h4 {
          color: #60a5fa;
          margin-bottom: 1rem;
        }

        .description-box p,
        .info-box p {
          color: #cbd5e1;
          line-height: 1.6;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .feature-item {
          color: #cbd5e1;
          padding: 0.75rem;
          background: rgba(96, 165, 250, 0.05);
          border-left: 3px solid #60a5fa;
          border-radius: 4px;
        }

        .price-box {
          text-align: center;
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          border: none;
        }

        .price-label {
          color: #cbd5e1;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .price {
          color: #60a5fa;
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }

        .price-note {
          color: #94a3b8;
          font-size: 0.85rem;
        }

        .btn-large {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        .btn-disabled {
          background: #64748b;
          color: #cbd5e1;
          cursor: not-allowed;
        }

        .info-box {
          text-align: center;
        }

        .info-box h4 {
          margin-bottom: 0.75rem;
        }

        .info-box p {
          margin: 0.5rem 0;
        }

        @media (max-width: 768px) {
          .room-details-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .room-details-header h1 {
            font-size: 1.8rem;
          }

          .header-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .room-details-content {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}