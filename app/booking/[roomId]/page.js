'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRoomById } from '@/lib/api';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);

  const [formData, setFormData] = useState({
    checkInDate: '',
    checkOutDate: '',
    couponCode: '',
  });

  const [bookingSummary, setBookingSummary] = useState({
    nights: 0,
    roomPrice: 0,
    subtotal: 0,
    discount: 0,
    total: 0,
  });

  const [couponValidation, setCouponValidation] = useState({
    isValid: false,
    message: '',
    discount: 0,
  });

  const [isCreatingBooking, setIsCreatingBooking] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      router.push('/login');
      return;
    }
    setUserId(parseInt(storedUserId));
    fetchRoom();
  }, [params.roomId]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const data = await getRoomById(params.roomId);
      setRoom(data);
      setError('');
    } catch (err) {
      setError('Failed to load room details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    const newFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(newFormData);

    // Calculate nights and price
    if (newFormData.checkInDate && newFormData.checkOutDate) {
      calculateBooking(newFormData);
    }
  };

  const calculateBooking = (data) => {
    const checkIn = new Date(data.checkInDate);
    const checkOut = new Date(data.checkOutDate);

    if (checkOut <= checkIn) {
      setError('Check-out date must be after check-in date');
      return;
    }

    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const subtotal = room.price * nights;

    // If coupon is already validated, apply it
    const discount = couponValidation.isValid ? couponValidation.discount : 0;
    const total = subtotal - discount;

    setBookingSummary({
      nights,
      roomPrice: room.price,
      subtotal,
      discount,
      total,
    });

    setError('');
  };

  const handleValidateCoupon = async () => {
    if (!formData.couponCode.trim()) {
      setCouponValidation({
        isValid: false,
        message: 'Please enter a coupon code',
        discount: 0,
      });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/api/coupons/validate/${formData.couponCode}`
      );

      if (!response.ok) {
        throw new Error('Invalid coupon');
      }

      const data = await response.json();

      if (data.isValid) {
        setCouponValidation({
          isValid: true,
          message: `Coupon applied! ₹${data.discountAmount} discount`,
          discount: data.discountAmount,
        });

        // Recalculate with discount
        if (bookingSummary.nights > 0) {
          const newTotal = bookingSummary.subtotal - data.discountAmount;
          setBookingSummary(prev => ({
            ...prev,
            discount: data.discountAmount,
            total: newTotal > 0 ? newTotal : 0,
          }));
        }
      }
    } catch (err) {
      setCouponValidation({
        isValid: false,
        message: err.message || 'Invalid or expired coupon',
        discount: 0,
      });
    }
  };

  const handleCreateBooking = async () => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      setError('Please select check-in and check-out dates');
      return;
    }

    if (bookingSummary.nights <= 0) {
      setError('Invalid dates selected');
      return;
    }

    setIsCreatingBooking(true);

    try {
      const response = await fetch('http://localhost:8081/api/bookings/room/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          roomId: parseInt(params.roomId),
          checkInDate: formData.checkInDate,
          checkOutDate: formData.checkOutDate,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      const booking = await response.json();

      // If coupon was applied, use it
      if (couponValidation.isValid && formData.couponCode) {
        try {
          await fetch(`http://localhost:8081/api/coupons/use/${formData.couponCode}`, {
            method: 'POST',
          });
        } catch (couponErr) {
          console.error('Could not apply coupon:', couponErr);
        }
      }

      alert('Booking created! Proceeding to payment...');
      // Redirect to payment page
      router.push(`/payment/${booking.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create booking');
    } finally {
      setIsCreatingBooking(false);
    }
  };

  if (loading) return <div className="loading">Loading room details...</div>;
  if (!room) return <div className="error-message">Room not found</div>;

  return (
    <div className="booking-container">
      <Link href={`/rooms/${room.id}`} className="back-link">
        ← Back to Room
      </Link>

      <div className="booking-content">
        {/* Left Side - Booking Form */}
        <div className="booking-form-section">
          <div className="room-info-card">
            <h2>Booking Details</h2>
            <div className="room-info">
              <div className="info-item">
                <span className="label">Room Number:</span>
                <span className="value">{room.roomNumber}</span>
              </div>
              <div className="info-item">
                <span className="label">Type:</span>
                <span className={`value type-badge ${room.type.toLowerCase()}`}>
                  {room.type}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Price per Night:</span>
                <span className="value">₹{room.price}</span>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-card">
            <h3>Select Your Dates</h3>

            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="datetime-local"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleDateChange}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="datetime-local"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleDateChange}
                min={new Date().toISOString().slice(0, 16)}
              />
            </div>

            <h3 style={{ marginTop: '2rem' }}>Apply Coupon Code</h3>

            <div className="coupon-section">
              <div className="form-group">
                <label>Coupon Code (Optional)</label>
                <div className="coupon-input-group">
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={(e) =>
                      setFormData({ ...formData, couponCode: e.target.value })
                    }
                    placeholder="Enter coupon code"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleValidateCoupon}
                  >
                    Validate
                  </button>
                </div>
              </div>

              {couponValidation.message && (
                <div
                  className={`coupon-message ${
                    couponValidation.isValid ? 'valid' : 'invalid'
                  }`}
                >
                  {couponValidation.isValid ? '✓' : '✗'}{' '}
                  {couponValidation.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Booking Summary */}
        <div className="booking-summary-section">
          <div className="summary-card">
            <h2>Booking Summary</h2>

            <div className="summary-item">
              <span>Room Number</span>
              <span className="value">{room.roomNumber}</span>
            </div>

            {formData.checkInDate && (
              <div className="summary-item">
                <span>Check-in</span>
                <span className="value">
                  {new Date(formData.checkInDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {formData.checkOutDate && (
              <div className="summary-item">
                <span>Check-out</span>
                <span className="value">
                  {new Date(formData.checkOutDate).toLocaleDateString()}
                </span>
              </div>
            )}

            {bookingSummary.nights > 0 && (
              <>
                <div className="summary-divider"></div>

                <div className="summary-item">
                  <span>Number of Nights</span>
                  <span className="value">{bookingSummary.nights}</span>
                </div>

                <div className="summary-item">
                  <span>Price per Night</span>
                  <span className="value">₹{bookingSummary.roomPrice}</span>
                </div>

                <div className="summary-item">
                  <span>Subtotal</span>
                  <span className="value">₹{bookingSummary.subtotal}</span>
                </div>

                {bookingSummary.discount > 0 && (
                  <div className="summary-item discount">
                    <span>Discount</span>
                    <span className="value">-₹{bookingSummary.discount}</span>
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-total">
                  <span>Total Amount</span>
                  <span className="total-value">₹{bookingSummary.total}</span>
                </div>

                <button
                  className="btn btn-primary btn-large"
                  onClick={handleCreateBooking}
                  disabled={isCreatingBooking}
                >
                  {isCreatingBooking ? 'Creating Booking...' : 'Proceed to Payment'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .loading {
          text-align: center;
          padding: 3rem;
          color: #94a3b8;
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

        .booking-container {
          padding: 2rem 0;
        }

        .booking-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .room-info-card,
        .form-card,
        .summary-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          padding: 2rem;
          border-radius: 12px;
          margin-bottom: 2rem;
        }

        h2, h3 {
          color: #60a5fa;
          margin-top: 0;
        }

        .room-info {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(96, 165, 250, 0.05);
          border-radius: 6px;
        }

        .label {
          color: #94a3b8;
          font-weight: 600;
        }

        .value {
          color: #60a5fa;
          font-weight: 600;
        }

        .type-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.85rem;
        }

        .type-badge.ac {
          background: #10b981;
          color: white;
        }

        .type-badge.non-ac {
          background: #f59e0b;
          color: white;
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

        .coupon-input-group {
          display: flex;
          gap: 1rem;
        }

        .coupon-input-group input {
          flex: 1;
        }

        .btn-secondary {
          background: #334155;
          color: #e2e8f0;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          white-space: nowrap;
        }

        .btn-secondary:hover {
          background: #475569;
        }

        .coupon-message {
          padding: 0.75rem;
          border-radius: 6px;
          margin-top: -1rem;
          font-weight: 600;
        }

        .coupon-message.valid {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border: 1px solid #10b981;
        }

        .coupon-message.invalid {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          color: #cbd5e1;
          border-bottom: 1px solid #334155;
        }

        .summary-item.discount .value {
          color: #10b981;
        }

        .summary-divider {
          height: 1px;
          background: #334155;
          margin: 1rem 0;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          padding: 1rem 0;
          font-size: 1.25rem;
          font-weight: bold;
          color: #60a5fa;
        }

        .total-value {
          color: #10b981;
        }

        .btn-large {
          width: 100%;
          padding: 1rem;
          font-size: 1.1rem;
          margin-top: 1.5rem;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .booking-content {
            grid-template-columns: 1fr;
          }

          .coupon-input-group {
            flex-direction: column;
          }

          .coupon-input-group input {
            width: 100%;
          }

          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}