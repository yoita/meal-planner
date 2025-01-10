import { PrismaClient } from '@prisma/client'
declare global {
  var prisma: PrismaClient | undefined
}

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma 