import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    const user = await prisma.user.findUnique({
      where: {
        username
      }
    })

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 })
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword)

    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 })
    }

    const { hashedPassword: _, ...userWithoutPassword } = user

    return new Response(JSON.stringify(userWithoutPassword), { status: 200 })
  } catch (error) {
    console.error(error) // Log the error for debugging
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 })
  }
} 