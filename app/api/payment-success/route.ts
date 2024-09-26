// app/api/payment-success/route.ts
import prisma from '@/utils/db';
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, userEmail, amount } = await request.json();

  try {
    // Verify payment signature using Razorpay SDK
    const isValid = Razorpay.validateWebhookSignature(
      razorpayOrderId + '|' + razorpayPaymentId,
      razorpaySignature,
      process.env.RAZORPAY_KEY_SECRET!
    );

    if (!isValid) {
      return NextResponse.json({ message: 'Invalid payment signature' }, { status: 400 });
    }

    // Update the transaction status to 'completed' in the database
    await prisma.transaction.updateMany({
      where: { razorpayOrderId, email: userEmail },
      data: { status: 'completed' },
    });

    // Update the user's balance
    await prisma.user.update({
      where: { email: userEmail },
      data: { balance: { increment: amount } },
    });

    return NextResponse.json({ message: 'Payment successful and balance updated.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify payment', details: error }, { status: 500 });
  }
}
