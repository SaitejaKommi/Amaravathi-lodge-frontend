'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    roomNumber: '',
    type: 'AC',
    price: '',
    description: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is owner (you can add role-based check later)
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/rooms');
      const data = await response.json();
      setRooms(data);
      setError('');
    } catch (err) {
      setError('Failed to load rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.roomNumber || !formData.price || !formData.description) {
      setError('All fields are required');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/api/rooms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomNumber: formData.roomNumber,
          type: formData.type,
          price: parseFloat(formData.price),
          description: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create room');
      }

      const newRoom = await response.json();
      setRooms([...rooms, newRoom]);
      setFormData({
        roomNumber: '',
        type: 'AC',
        price: '',
        description: '',
      });
      setShowForm(false);
      alert('Room created successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:8081/api/rooms/${roomId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete room');
      }

      setRooms(rooms.filter(room => room.id !== roomId));
      alert('Room deleted successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>🏢 Room Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add New Room'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Create Room Form */}
      {showForm && (
        <div className="form-card">
          <h2>Create New Room</h2>
          <form onSubmit={handleCreateRoom}>
            <div className="form-group">
              <label>Room Number</label>
              <input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                placeholder="e.g., 101, 202"
              />
            </div>

            <div className="form-group">
              <label>Room Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
              >
                <option value="AC">AC</option>
                <option value="NON-AC">NON-AC</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price Per Night (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 2500"
              />
            </div>

            <div className="form-group">
              <label>Description & Amenities</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g., Hot water, Parking, Free WiFi, AC"
                rows="4"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full">
              Create Room
            </button>
          </form>
        </div>
      )}

      {/* Rooms List */}
      {loading ? (
        <div className="loading">Loading rooms...</div>
      ) : (
        <div className="rooms-table-container">
          <table className="rooms-table">
            <thead>
              <tr>
                <th>Room #</th>
                <th>Type</th>
                <th>Price</th>
                <th>Amenities</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map(room => (
                  <tr key={room.id}>
                    <td className="room-number">{room.roomNumber}</td>
                    <td>
                      <span className={`type-badge ${room.type.toLowerCase()}`}>
                        {room.type}
                      </span>
                    </td>
                    <td className="price">₹{room.price}</td>
                    <td className="amenities">{room.description}</td>
                    <td>
                      <span className={`status-badge ${room.isAvailable ? 'available' : 'booked'}`}>
                        {room.isAvailable ? '✓ Available' : '✗ Booked'}
                      </span>
                    </td>
                    <td className="actions">
                      <button 
                        className="btn-small btn-danger"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No rooms created yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <style jsx>{`
        .admin-container {
          padding: 2rem 0;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          padding: 2rem;
          border-radius: 12px;
          border: 1px solid #334155;
        }

        .admin-header h1 {
          color: #60a5fa;
          margin: 0;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .form-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        .form-card h2 {
          color: #60a5fa;
          margin-top: 0;
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

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 0.75rem;
          background-color: #0f172a;
          border: 1px solid #334155;
          color: #e2e8f0;
          border-radius: 8px;
          font-family: inherit;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }

        .btn-full {
          width: 100%;
        }

        .rooms-table-container {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          border-radius: 12px;
          overflow: hidden;
        }

        .rooms-table {
          width: 100%;
          border-collapse: collapse;
        }

        .rooms-table thead {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
        }

        .rooms-table th {
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
        }

        .rooms-table td {
          padding: 1rem;
          border-bottom: 1px solid #334155;
          color: #cbd5e1;
        }

        .rooms-table tbody tr:hover {
          background: rgba(96, 165, 250, 0.05);
        }

        .room-number {
          font-weight: 600;
          color: #60a5fa;
        }

        .type-badge {
          padding: 0.4rem 0.8rem;
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

        .price {
          font-weight: 600;
          color: #60a5fa;
        }

        .amenities {
          font-size: 0.9rem;
          max-width: 300px;
        }

        .status-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .status-badge.available {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .status-badge.booked {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .actions {
          text-align: center;
        }

        .btn-small {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          transition: all 0.3s;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .no-data {
          text-align: center;
          color: #94a3b8;
          padding: 2rem !important;
        }

        .loading {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
        }

        @media (max-width: 768px) {
          .admin-header {
            flex-direction: column;
            gap: 1rem;
            align-items: flex-start;
          }

          .rooms-table {
            font-size: 0.9rem;
          }

          .rooms-table th,
          .rooms-table td {
            padding: 0.75rem 0.5rem;
          }

          .amenities {
            max-width: 150px;
          }
        }
      `}</style>
    </div>
  );
}