'use client';

import { useState, useEffect } from 'react';
import { getAllRooms, getRoomsByType, getAvailableRoomsByType } from '@/lib/api';
import RoomCard from '@/components/RoomCard';

export default function RoomsPage() {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedType, setSelectedType] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const data = await getAllRooms();
      setRooms(data);
      setFilteredRooms(data);
      setError('');
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (type) => {
    setSelectedType(type);
    
    if (type === 'ALL') {
      setFilteredRooms(rooms);
    } else {
      const filtered = rooms.filter(room => room.type === type);
      setFilteredRooms(filtered);
    }
  };

  const handleAvailableOnly = () => {
    const available = rooms.filter(room => room.isAvailable);
    setFilteredRooms(available);
    setSelectedType('AVAILABLE');
  };

  return (
    <div className="rooms-container">
      <div className="rooms-header">
        <h1>Our Rooms & Dormitories</h1>
        <p>Choose your perfect accommodation</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}
      <div className="filter-section">
        <h3>Filter by Type</h3>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${selectedType === 'ALL' ? 'active' : ''}`}
            onClick={() => handleFilterChange('ALL')}
          >
            All Rooms ({rooms.length})
          </button>
          <button 
            className={`filter-btn ${selectedType === 'AC' ? 'active' : ''}`}
            onClick={() => handleFilterChange('AC')}
          >
            AC Rooms ({rooms.filter(r => r.type === 'AC').length})
          </button>
          <button 
            className={`filter-btn ${selectedType === 'NON-AC' ? 'active' : ''}`}
            onClick={() => handleFilterChange('NON-AC')}
          >
            NON-AC Rooms ({rooms.filter(r => r.type === 'NON-AC').length})
          </button>
          <button 
            className={`filter-btn ${selectedType === 'AVAILABLE' ? 'active' : ''}`}
            onClick={handleAvailableOnly}
          >
            Available Only
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div className="loading">Loading rooms...</div>
      ) : filteredRooms.length > 0 ? (
        <div className="rooms-grid">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="no-rooms">
          <p>No rooms found matching your criteria</p>
        </div>
      )}

      <style jsx>{`
        .rooms-container {
          padding: 2rem 0;
        }

        .rooms-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .rooms-header h1 {
          font-size: 2.5rem;
          color: #60a5fa;
          margin-bottom: 0.5rem;
        }

        .rooms-header p {
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

        .filter-section {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 3rem;
        }

        .filter-section h3 {
          color: #60a5fa;
          margin-bottom: 1rem;
        }

        .filter-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          background: #0f172a;
          color: #cbd5e1;
          border: 1px solid #334155;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .filter-btn:hover {
          border-color: #60a5fa;
          color: #60a5fa;
        }

        .filter-btn.active {
          background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
          color: white;
          border-color: #60a5fa;
        }

        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }

        .loading,
        .no-rooms {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .loading {
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @media (max-width: 768px) {
          .rooms-header h1 {
            font-size: 1.8rem;
          }

          .filter-buttons {
            flex-direction: column;
          }

          .filter-btn {
            width: 100%;
          }

          .rooms-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}