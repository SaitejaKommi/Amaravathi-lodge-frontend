'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();

  const handlePayment = async () => {
    alert('Payment integration coming in Day F7!');
  };

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1>Payment</h1>
        <p>Booking ID: {params.bookingId}</p>

        <div className="info-message">
          <p>✓ Booking confirmed!</p>
          <p>Proceeding with Razorpay payment integration...</p>
          <p className="coming-soon">Coming in Day F7 🚀</p>
        </div>

        <Link href="/my-bookings" className="btn btn-primary">
          View Your Bookings
        </Link>
      </div>

      <style jsx>{`
        .payment-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: calc(100vh - 200px);
          padding: 2rem;
        }

        .payment-card {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border: 1px solid #334155;
          border-radius: 12px;
          padding: 3rem;
          max-width: 500px;
          text-align: center;
        }

        .payment-card h1 {
          color: #60a5fa;
          margin-bottom: 1rem;
        }

        .payment-card p {
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .info-message {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid #10b981;
          padding: 1.5rem;
          border-radius: 8px;
          margin: 2rem 0;
          color: #10b981;
        }

        .coming-soon {
          color: #60a5fa;
          font-weight: 600;
          margin-top: 1rem !important;
        }

        .btn {
          margin-top: 1.5rem;
        }
      `}</style>
    </div>
  );
}