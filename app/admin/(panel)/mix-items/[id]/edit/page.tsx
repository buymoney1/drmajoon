import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditMixItemForm from './EditMixItemForm'

export default async function EditMixItemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [item, media] = await Promise.all([
    prisma.mixItem.findUnique({ where: { id } }),
    prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, url: true, originalName: true },
    }),
  ])

  if (!item) notFound()

  return <EditMixItemForm item={item} media={media} />
}