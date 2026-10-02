// src/app/cart/page.tsx

import { prisma } from '@/lib/prisma'
import CartClient from './CartClient'

export const dynamic = 'force-dynamic'

export default async function CartPage() {
  const [products, mixItems] = await Promise.all([
    prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        category: true,
      },
    }),
    prisma.mixItem.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        category: true,
      },
    }),
  ])

  return <CartClient products={products} mixItems={mixItems} />
}