// app/api/user/[email]/route.ts
import prisma from '@/utils/db';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { email: string } }) {
  const { email } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ balance: user.balance }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
