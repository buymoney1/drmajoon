import { prisma } from '@/lib/prisma'
import MediaClient from './MediaClient'

export default async function MediaPage() {
  const mediaItems = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <MediaClient initialMedia={JSON.parse(JSON.stringify(mediaItems))} />
}