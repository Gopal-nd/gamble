// components/Withdraw.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function Withdraw() {
  const [amount, setAmount] = useState(0);
  const [upiId, setUpiId] = useState('');
  const [message, setMessage] = useState('');
  const userEmail = useSession().data?.user?.email;

  const handleWithdraw = async () => {
    setMessage(''); // Clear any previous message

    const res = await fetch('/api/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, amount, upiId }),
    });

    const data = await res.json();

    if (res.ok) {
      setMessage('Withdrawal initiated successfully!');
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Withdraw</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="border p-2 w-full"
        placeholder="Amount"
      />
      <input
        type="text"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        className="border p-2 w-full mt-4"
        placeholder="UPI ID"
      />
      <button onClick={handleWithdraw} className="bg-red-500 text-white p-2 mt-4 w-full">
        Withdraw
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}
