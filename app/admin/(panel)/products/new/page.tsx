import { prisma } from '@/lib/prisma'
import NewProductForm from './NewProductForm'

export default async function NewProductPage() {
  const [categories, media] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, url: true, originalName: true },
    }),
  ])

  return <NewProductForm categories={categories} media={media} />
}