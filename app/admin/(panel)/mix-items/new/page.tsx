import { prisma } from '@/lib/prisma'
import NewMixItemPage from './NewMixItemPage'

export default async function Page() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, url: true, originalName: true },
  })

  return <NewMixItemPage media={media} />
}