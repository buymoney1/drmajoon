import { prisma } from '@/lib/prisma'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CustomMixClient from './CustomMixClient'

export default async function CustomMixPage() {
  const items = await prisma.mixItem.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  })

  return <CustomMixClient items={JSON.parse(JSON.stringify(items))} />
}