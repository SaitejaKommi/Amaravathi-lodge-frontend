'use client';

import Link from 'next/link';

export default function RoomCard({ room }) {
  return (
    <>
      <Link href={`/rooms/${room.id}`}>
        <div className="room-card">
          <div className="room-header">
            <h3>{room.roomNumber}</h3>
            <span className={`type-badge ${room.type.toLowerCase()}`}>
              {room.type}
            </span>
          </div>

          <div className="room-body">
            <p className="description">{room.description || 'No description'}</p>
            
            <div className="features">
              {room.description?.includes('WiFi') && <span className="feature">📶 WiFi</span>}
              {room.description?.includes('Parking') && <span className="feature">🅿️ Parking</span>}
              {room.description?.includes('water') && <span className="feature">💧 Hot Water</span>}
              {room.type === 'AC' && <span className="feature">❄️ AC</span>}
            </div>

            <div className="room-footer">
              <div className="price">
                <span className="amount">₹{room.price}</span>
                <span className="period">/night</span>
              </div>
              {room.isAvailable ? (
                <span className="available">✓ Available</span>
              ) : (
                <span className="unavailable">✗ Booked</span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <style jsx>{`
      a {
        text-decoration: none;
      }

      .room-card {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border: 1px solid #334155;
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s;
        cursor: pointer;
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .room-card:hover {
        border-color: #60a5fa;
        box-shadow: 0 8px 24px rgba(96, 165, 250, 0.2);
        transform: translateY(-8px);
      }

      .room-header {
        background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .room-header h3 {
        color: white;
        margin: 0;
        font-size: 1.5rem;
      }

      .type-badge {
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.85rem;
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

      .room-body {
        padding: 1.5rem;
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .description {
        color: #cbd5e1;
        margin-bottom: 1rem;
        line-height: 1.5;
      }

      .features {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        margin-bottom: 1rem;
      }

      .feature {
        background: rgba(96, 165, 250, 0.1);
        color: #60a5fa;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        font-size: 0.85rem;
      }

      .room-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid #334155;
      }

      .price {
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
      }

      .amount {
        color: #60a5fa;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .period {
        color: #94a3b8;
        font-size: 0.85rem;
      }

      .available {
        color: #10b981;
        font-weight: 600;
      }

      .unavailable {
        color: #ef4444;
        font-weight: 600;
      }

      @media (max-width: 600px) {
        .room-header h3 {
          font-size: 1.2rem;
        }

        .amount {
          font-size: 1.25rem;
        }
      }
    `}</style>
    </>
  );
}