'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export default function Deposit() {
  const [amount, setAmount] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const userEmail = useSession().data?.user?.email;
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Cleanup the script on unmount
    };
  }, []);

  const handlePayment = async () => {
    setError('');
    setLoading(true);

    const res = await fetch('/api/deposit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail: 'test@example.com', amount }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      // Invoke Razorpay payment modal
      const options = {
        key: data.key, // Razorpay key from server
        amount: data.amount,
        currency: data.currency,
        name: 'Gambling App',
        description: 'Deposit',
        order_id: data.orderId, // Order ID from Razorpay
        handler: async function (response: any) {
          // Payment successful, handle post-payment actions
          const result = await fetch('/api/payment-success', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              userEmail,
              amount,
            }),
          });

          const paymentData = await result.json();
          if (result.ok) {
            alert('Payment successful and deposit recorded.');
          } else {
            alert('Payment successful, but deposit failed to record.');
          }
        },
        theme: {
          color: '#3399cc',
        },
      };

      // Check if Razorpay is available
      if (typeof window !== 'undefined' && (window as any).Razorpay && ((window as any).window).Razorpay) {
        const razorpay = new ((window as any).window).Razorpay(options);
        razorpay.open();
      } else {
        setError('Razorpay SDK not loaded.');
      }
    } else {
      setError(data.message || 'Failed to initiate payment.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Deposit</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 w-full"
        placeholder="Amount"
      />
      <button
        onClick={handlePayment}
        className="bg-blue-500 text-white p-2 mt-4 w-full"
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Deposit'}
      </button>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
}
