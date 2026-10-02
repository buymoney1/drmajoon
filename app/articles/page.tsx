// src/app/articles/page.tsx

import { prisma } from '@/lib/prisma'
import ArticlesClient from './ArticlesClient'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'مقالات آموزشی | دکتر معجون',
  description:
    'جدیدترین مقالات علمی و کاربردی در زمینه گیاهان دارویی، طب سنتی و سلامتی',
}

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <ArticlesClient articles={JSON.parse(JSON.stringify(articles))} />
}