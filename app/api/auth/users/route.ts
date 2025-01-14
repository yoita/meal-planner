import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(users, { status: 200 })
  } catch (error) {
    console.error(error); // Log the error for debugging
    return NextResponse.json({ error: 'Error fetching users' }, { status: 500 })
  }
} 