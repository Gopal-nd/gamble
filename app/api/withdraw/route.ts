import prisma from '@/utils/db';
import { NextResponse } from 'next/server';


export async function POST(request: Request) {
  const { userEmail, amount, upiId } = await request.json();

  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user || user.balance < amount) {
      return NextResponse.json({ message: 'Insufficient balance or User not found' }, { status: 400 });
    }

    await prisma.transaction.create({
      data: {
        email: userEmail,
        amount,
        type: 'withdrawal',
        status: 'pending',
        upiId,
      },
    });

    await prisma.user.update({
      where: { email: userEmail },
      data: { balance: user.balance - amount },
    });

    return NextResponse.json({ message: 'Withdrawal initiated' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
