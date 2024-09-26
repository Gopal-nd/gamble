import prisma from '@/utils/db';
import { serverSession } from '@/utils/getserverSession';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const { userEmail, amount, upiId } = await request.json();
  const user = await serverSession();
  const email:string = user?.user?.email
  console.log(userEmail, amount, upiId)
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `${userEmail}_deposit_${Date.now()}`,
    });
    console.log(order)

    const res =await prisma.transaction.create({
      data: {
        email: user.email,
        amount:amount,
        type: 'deposit',
        status: 'pending',
        razorpayOrderId: order.id,
      },
    });

    console.log(res)

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
