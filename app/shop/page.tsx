import { prisma } from '@/lib/prisma'
import ShopClient from './ShopClient'

export default async function ShopPage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  // استخراج دسته‌بندی‌های یکتا
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  )

  return (
    <ShopClient
      products={JSON.parse(JSON.stringify(products))}
      categories={categories}
    />
  )
}