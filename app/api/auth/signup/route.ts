import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json()

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    })

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'User with this email or username already exists' }),
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
      },
    })

    // Remove hashedPassword from response
    const { hashedPassword: _, ...userWithoutPassword } = user

    return new Response(JSON.stringify(userWithoutPassword), { status: 201 })
  } catch (error) {
    console.error(error) // Log the error for debugging
    return new Response(JSON.stringify({ error: 'Error creating user' }), { status: 500 })
  }
} 