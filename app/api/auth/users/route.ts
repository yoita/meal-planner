import { prisma } from '@/lib/prisma'

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

    return new Response(JSON.stringify(users), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error fetching users' }), { status: 500 })
  }
} 