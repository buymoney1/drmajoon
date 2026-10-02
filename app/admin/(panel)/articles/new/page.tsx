// src/app/admin/(panel)/articles/new/page.tsx

import { prisma } from '@/lib/prisma'
import NewArticlePage from './NewArticlePage'

export default async function Page() {
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      url: true,
      originalName: true,
    },
  })

  return <NewArticlePage media={media} />
}