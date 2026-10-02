import { prisma } from '@/lib/prisma'
import ShopClient from './ShopClient'

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  // ✅ تایپ صریح روی آرایه + filter با type guard
  const categories: string[] = Array.from(
    new Set(
      products
        .map((p: { category: string }) => p.category)
        .filter((c): c is string => Boolean(c))
    )
  )

  return (
    <ShopClient
      products={JSON.parse(JSON.stringify(products))}
      categories={categories}
    />
  )
}