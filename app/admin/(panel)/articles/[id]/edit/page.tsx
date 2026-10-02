import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EditArticleForm from './EditArticleForm'

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [article, media] = await Promise.all([
    prisma.article.findUnique({ where: { id } }),
    prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, url: true, originalName: true },
    }),
  ])

  if (!article) notFound()

  return <EditArticleForm article={article} media={media} />
}