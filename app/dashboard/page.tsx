// app/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Deposit from '@/components/Deposit';

import CoinToss from '@/components/CoinToss';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Withdraw from '@/components/Withdraw';


export default function Dashboard() {
  const [balance, setBalance] = useState(0);
  const userEmail = useSession().data?.user?.email
  const session = useSession()
  const router = useRouter()

  if (!session.data?.user?.email) {
  router.push('/login')
  }

  const fetchBalance = async () => {
    const res = await fetch(`/api/user/${userEmail}`);
    const data = await res.json();
    if (res.ok) {
      setBalance(data.balance);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="border p-4 mb-6">
        <h2 className="text-xl font-semibold">Balance: ₹{balance}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Deposit />
        <Withdraw />
      </div>
      <div className="mt-8">
        <CoinToss />
      </div>
    </div>
  );
}
