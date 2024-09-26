// components/CoinToss.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function CoinToss() {
  const [betAmount, setBetAmount] = useState(0);
  const [result, setResult] = useState('');
  const [outcome, setOutcome] = useState('');
  const [balance, setBalance] = useState(0);
const userEmail = useSession().data?.user?.email
  const handleToss = async () => {
    const res = await fetch('/api/toss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, betAmount }),
    });

    const data = await res.json();
    console.log(data)
    if (res.ok) {
      setResult(data.result);
      setOutcome(data.outcome);
      setBalance(data.balance);
    } else {
      console.error('Error:', data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Coin Toss</h1>
      <input
        type="number"
        value={betAmount}
        onChange={(e) => setBetAmount(Number(e.target.value))}
        className="border p-2"
        placeholder="Bet Amount"
      />
      <button onClick={handleToss} className="bg-green-500 text-white p-2 mt-4">Toss Coin</button>

      {result && (
        <div className="mt-4">
          <p>Result: {result}</p>
          <p>Outcome: {outcome}</p>
          <p>New Balance: {balance}</p>
        </div>
      )}
    </div>
  );
}
