import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const { userId, mealId, liked } = await request.json();

  try {
    // Upsert the like/dislike
    const mealLike = await prisma.mealLike.upsert({
      where: {
        userId_mealId: {
          userId,
          mealId,
        },
      },
      update: { liked },
      create: { userId, mealId, liked },
    });

    return NextResponse.json(mealLike, { status: 200 });
  } catch (error) {
    console.error('Error liking meal:', error);
    return NextResponse.json({ error: 'Error liking meal' }, { status: 500 });
  }
} 