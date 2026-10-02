import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditProductForm from './EditProductForm'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [product, categories, media] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    }),
    prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, url: true, originalName: true },
    }),
  ])

  if (!product) notFound()

  return (
    <EditProductForm
      product={product}
      categories={categories}
      media={media}
    />
  )
}