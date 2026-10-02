// lib/prisma.ts
import { PrismaClient } from '@prisma/client'

// این خط برای TypeScript است تا مطمئن شویم متغیر global به درستی تعریف شده است
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// اگر کلاینت Prisma از قبل در global وجود دارد، از آن استفاده کن
// در غیر این صورت، یک نمونه جدید بساز
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// در محیط توسعه، نمونه ساخته شده را در global ذخیره کن
// تا در Hot Reload های Next.js، اتصال جدید ساخته نشود
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma