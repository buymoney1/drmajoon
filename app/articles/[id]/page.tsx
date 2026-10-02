// src/app/articles/[id]/page.tsx

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

import {
  ArrowRight,
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Share2,
  Hash,
  BookOpen,
} from 'lucide-react'

// ==================== Types ====================
interface Props {
  params: Promise<{ id: string }>
}

// ==================== Decorative SVG ====================
function DecorativeCircle({
  className = '',
  size = 24,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="4 3"
        className="opacity-40"
      />
      <circle
        cx="20"
        cy="20"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="opacity-60"
      />
    </svg>
  )
}

// ==================== Helper ====================
function formatPersianDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// ==================== Metadata ====================
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })

  if (!article) {
    return { title: 'مقاله یافت نشد | دکتر معجون' }
  }

  return {
    title: article.title,
    description: article.content.slice(0, 160),
    openGraph: {
      title: article.title,
      description: article.content.slice(0, 160),
      type: 'article',
      images: article.image ? [article.image] : [],
    },
    alternates: {
      canonical: `/articles/${article.id}`,
    },
  }
}

// ==================== Main Page ====================
export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params
  const article = await prisma.article.findUnique({ where: { id } })

  if (!article) notFound()

  // Related articles
  const relatedArticles = await prisma.article.findMany({
    where: { NOT: { id: article.id } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  })

  const readingTime = estimateReadingTime(article.content)

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: new Date(article.createdAt).toISOString(),
    author: { '@type': 'Organization', name: 'دکتر معجون' },
    publisher: { '@type': 'Organization', name: 'دکتر معجون' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div
        dir="rtl"
        className="min-h-screen bg-[#FBFBF9] selection:bg-[#2D6A4F]/20 selection:text-[#0F1F18] relative"
      >
        {/* Background Texture */}
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.01]"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, #2D6A4F 1px, transparent 1px),
                              radial-gradient(circle at 80% 70%, #166534 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />

        {/* Background Blurs */}
        <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#2D6A4F]/[0.03] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#e6b741]/[0.03] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

   

        <div className="max-w-6xl mx-auto px-4 pt-8">
          <div className="flex gap-8">
            {/* ========== Sidebar (Desktop) ========== */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl border border-stone-200/80 p-4 shadow-sm">
                  <h4 className="text-[11px] font-bold text-stone-500 mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    اطلاعات مقاله
                  </h4>
                  <ul className="space-y-2.5 text-[11px] text-stone-500">
                    <li className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-stone-300" />
                      {formatPersianDate(article.createdAt)}
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-stone-300" />
                      {readingTime} دقیقه مطالعه
                    </li>
                    <li className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-300" />
                      تیم دکتر معجون
                    </li>
                  </ul>
                </div>

                <div className="flex justify-center">
                  <DecorativeCircle size={24} className="text-[#2D6A4F]/30" />
                </div>
              </div>
            </aside>

            {/* ========== Main Content ========== */}
            <article className="flex-1 min-w-0 pb-12 max-w-3xl mx-auto lg:mx-0">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-6 flex-wrap">
                <Link href="/" className="hover:text-[#2D6A4F] transition-colors">
                  خانه
                </Link>
                <span className="text-stone-300">/</span>
                <Link
                  href="/articles"
                  className="hover:text-[#2D6A4F] transition-colors"
                >
                  مقالات
                </Link>
                <span className="text-stone-300">/</span>
                <span className="text-stone-500 truncate max-w-[200px]">
                  {article.title}
                </span>
              </nav>

              {/* Category Badge */}
              <div className="flex items-center gap-2 mb-5">
                <DecorativeCircle size={20} className="text-[#2D6A4F]/40" />
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#2D6A4F] bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-200/50">
                  <Hash className="w-3 h-3" />
                  مقاله
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-stone-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-5 text-[11px] text-stone-400 py-3 border-y border-stone-100 mb-8">
                <span className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center text-[10px] font-bold text-emerald-700 shadow-sm">
                    د
                  </div>
                  تیم دکتر معجون
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-300" />
                  {formatPersianDate(article.createdAt)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-300" />
                  {readingTime} دقیقه مطالعه
                </span>
              </div>

              {/* Cover Image */}
              {article.image && (
                <div className="relative w-full h-64 md:h-96 rounded-[24px] overflow-hidden mb-8 bg-stone-50 shadow-lg shadow-black/[0.03]">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 896px"
                    className="object-cover"
                    unoptimized
                    priority
                  />
                </div>
              )}

              {/* Content */}
              <div
                className="prose prose-stone max-w-none leading-loose text-justify whitespace-pre-line
                  prose-headings:font-black prose-headings:text-stone-900
                  prose-a:text-[#2D6A4F] prose-a:no-underline hover:prose-a:text-[#1e4a37]
                  prose-img:rounded-2xl prose-img:shadow-md
                  prose-blockquote:border-[#2D6A4F] prose-blockquote:bg-emerald-50/30
                  prose-blockquote:rounded-l-xl prose-blockquote:py-1 prose-blockquote:px-4
                  prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5
                  prose-code:rounded-md prose-code:text-xs"
              >
                {article.content}
              </div>

              {/* Mobile Share */}
              <div className="lg:hidden mt-10 pt-6 border-t border-stone-200">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <Share2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    اشتراک‌گذاری:
                  </span>
                </div>
              </div>

              {/* Back Link */}
              <div className="mt-10 pt-6 border-t border-stone-200">
                <Link
                  href="/articles"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#2D6A4F] hover:text-[#1e4a37] bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-full transition-all"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  بازگشت به لیست مقالات
                </Link>
              </div>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <section className="mt-14 pt-10 border-t border-stone-200">
                  <div className="flex items-center gap-3 mb-6">
                    <DecorativeCircle size={24} className="text-[#2D6A4F]/30" />
                    <h2 className="text-lg font-black text-stone-900">
                      مقالات مرتبط
                    </h2>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {relatedArticles.map((a) => (
                      <Link
                        key={a.id}
                        href={`/articles/${a.id}`}
                        className="group bg-white rounded-2xl border border-stone-200/80 hover:border-[#2D6A4F]/30 hover:shadow-lg hover:shadow-emerald-100/20 transition-all hover:-translate-y-1 overflow-hidden"
                      >
                        {a.image && (
                          <div className="relative h-40 bg-stone-50 overflow-hidden">
                            <Image
                              src={a.image}
                              alt={a.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              unoptimized
                            />
                          </div>
                        )}
                        <div className="p-5">
                          <h3 className="text-sm font-bold text-stone-800 mb-2 group-hover:text-[#2D6A4F] transition-colors line-clamp-2 leading-relaxed">
                            {a.title}
                          </h3>
                          <p className="text-[11px] text-stone-400 line-clamp-2 mb-4 leading-relaxed">
                            {a.content}
                          </p>
                          <div className="flex items-center justify-between text-[10px] pt-3 border-t border-stone-100">
                            <span className="text-stone-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {estimateReadingTime(a.content)} دقیقه
                            </span>
                            <span className="text-[#2D6A4F] flex items-center gap-1 font-bold">
                              مطالعه
                              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </div>

        
      </div>
    </>
  )
}