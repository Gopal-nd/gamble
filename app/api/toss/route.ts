import { NextResponse } from 'next/server';
import prisma from '@/utils/db';

export async function POST(request: Request) {
  const { userEmail, betAmount } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user || user.balance < betAmount) {
      return NextResponse.json({ message: 'Insufficient balance or User not found' }, { status: 400 });
    }

    const tossResult = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const win = Math.random() < 0.5;
    const outcome = win ? 'Win' : 'Lose';

    const newBalance = win ? user.balance + betAmount : user.balance - betAmount;

    await prisma.game.create({
      data: {
        email: userEmail,
        result: tossResult,
        betAmount,
        outcome,
      },
    });

    const res = await prisma.user.update({
      where: { email: userEmail },
      data: { balance: newBalance },
    });

    console.log(res);
    
    return NextResponse.json({ result: tossResult, outcome, balance: newBalance }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
