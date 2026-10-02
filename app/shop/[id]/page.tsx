import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id } })

  if (!product || !product.isActive) notFound()

  const relatedProducts = await prisma.product.findMany({
    where: {
      category: product.category,
      isActive: true,
      NOT: { id: product.id },
    },
    take: 4,
  })

  return (
    <ProductDetailClient
      product={JSON.parse(JSON.stringify(product))}
      relatedProducts={JSON.parse(JSON.stringify(relatedProducts))}
    />
  )
}