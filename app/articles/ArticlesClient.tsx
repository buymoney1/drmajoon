'use client'

import { useState, useMemo } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import {
  Search,
  Calendar,
  ArrowLeft,
  FileText,
  Clock,
  Hash,
  X,
  BookOpen,
} from 'lucide-react'

// ==================== Types ====================
interface Article {
  id: string
  title: string
  content: string
  image: string | null
  createdAt: string | Date
}

// ==================== Helper: Persian Date ====================
function formatPersianDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// ==================== Helper: Reading Time ====================
function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// ==================== Decorative SVG ====================
function DecorativeLine({ className = '' }: { className?: string }) {
  return (
    <svg
      width="80"
      height="6"
      viewBox="0 0 80 6"
      fill="none"
      className={className}
    >
      <path
        d="M0,3 Q20,6 40,3 Q60,0 80,3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="opacity-40"
      />
    </svg>
  )
}

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

// ==================== Main Component ====================
export default function ArticlesClient({ articles }: { articles: Article[] }) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return articles
    const q = search.toLowerCase()
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.content.toLowerCase().includes(q)
    )
  }, [articles, search])

  const featured = filtered[0]
  const rest = filtered.slice(1)

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FBFBF9] selection:bg-[#2D6A4F]/20 selection:text-[#0F1F18] relative"
    >
      {/* ===== Background Texture ===== */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 35%, #2D6A4F 1px, transparent 1px),
                            radial-gradient(circle at 75% 65%, #166534 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* ===== Background Blurs ===== */}
      <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#2D6A4F]/[0.04] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#e6b741]/[0.03] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

   

      {/* ==================== Hero Section ==================== */}
      <section className="pt-10 pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
 

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 mb-4 leading-[1.15] tracking-tight">
            مقالات{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#2D6A4F]">دکتر معجون</span>
              <DecorativeLine className="absolute -bottom-2 right-0 text-[#2D6A4F]" />
            </span>
          </h1>

          <p className="text-stone-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            جدیدترین مقالات علمی و کاربردی در زمینه گیاهان دارویی، طب سنتی و
            سلامتی
          </p>
        </div>
      </section>

      {/* ==================== Search ==================== */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <form
            onSubmit={(e) => e.preventDefault()}
            className="relative flex items-center bg-white border border-stone-200/80 rounded-full overflow-hidden shadow-sm shadow-black/[0.02] transition-all focus-within:border-[#2D6A4F]/40 focus-within:shadow-md focus-within:shadow-emerald-100/30"
          >
            <Search className="absolute right-4 w-4 h-4 text-stone-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="جستجو در مقالات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pr-11 pl-11 bg-transparent text-sm outline-none placeholder:text-stone-300 text-stone-700"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute left-3 p-1.5 text-stone-400 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"
                aria-label="پاک کردن"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>
      </section>

      {/* ==================== Content ==================== */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {filtered.length === 0 ? (
            // Empty State
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <FileText className="w-6 h-6 text-stone-300" />
              </div>
              <h2 className="text-lg font-bold text-stone-800 mb-2">
                مقاله‌ای یافت نشد
              </h2>
              <p className="text-stone-400 text-xs mb-6">
                {search
                  ? `نتیجه‌ای برای "${search}" پیدا نشد`
                  : 'هنوز مقاله‌ای منتشر نشده'}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#2D6A4F] hover:text-[#1e4a37] bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-full transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  نمایش همه مقالات
                </button>
              )}
            </div>
          ) : (
            <>
              {/* ========== Featured Article ========== */}
              {featured && (
                <Link
                  href={`/articles/${featured.id}`}
                  className="group block bg-white rounded-[28px] border border-stone-200/80 overflow-hidden hover:border-[#2D6A4F]/30 hover:shadow-xl hover:shadow-emerald-100/30 transition-all duration-300 mb-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                    {featured.image && (
                      <div className="relative h-64 md:h-auto min-h-[280px] bg-stone-50 overflow-hidden">
                        <Image
                          src={featured.image}
                          alt={featured.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          unoptimized
                        />
                        {/* Featured Badge */}
                        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-[#2D6A4F] text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg shadow-emerald-900/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741] animate-pulse" />
                          مقاله ویژه
                        </span>
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    )}

                    <div className="p-7 md:p-10 flex flex-col justify-center">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-[11px] text-stone-400 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatPersianDate(featured.createdAt)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-stone-300" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {estimateReadingTime(featured.content)} دقیقه مطالعه
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-stone-900 mb-4 leading-tight group-hover:text-[#2D6A4F] transition-colors">
                        {featured.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-stone-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {featured.content}
                      </p>

                      {/* CTA */}
                      <span className="inline-flex items-center gap-2 text-[#2D6A4F] font-bold text-xs self-start bg-emerald-50 group-hover:bg-[#2D6A4F] group-hover:text-white px-4 py-2.5 rounded-full transition-all duration-300">
                        ادامه مطلب
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* ========== Rest Articles Grid ========== */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {rest.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>


    </div>
  )
}

// ==================== Article Card ====================
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.id}`}
      className="group block bg-white rounded-[24px] border border-stone-200/80 overflow-hidden hover:border-[#2D6A4F]/30 hover:shadow-xl hover:shadow-emerald-100/20 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative aspect-[16/10] bg-stone-50 overflow-hidden">
        {article.image ? (
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            unoptimized
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-amber-50/50 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-emerald-300/50 group-hover:scale-110 transition-transform duration-500" />
          </div>
        )}

        {/* Reading time badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-600 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full shadow-sm border border-stone-100">
            <Clock className="w-2.5 h-2.5" />
            {estimateReadingTime(article.content)} دقیقه
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-[10px] text-stone-400 mb-2.5">
          <Calendar className="w-3 h-3" />
          {formatPersianDate(article.createdAt)}
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-stone-800 mb-2 line-clamp-2 leading-relaxed group-hover:text-[#2D6A4F] transition-colors">
          {article.title}
        </h3>

        {/* Excerpt */}
        <p className="text-[11px] text-stone-400 line-clamp-2 mb-4 leading-relaxed">
          {article.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <span className="text-[10px] text-stone-400 flex items-center gap-1">
            <Hash className="w-3 h-3 text-[#2D6A4F]/60" />
            مقاله
          </span>
          <span className="text-[11px] text-[#2D6A4F] font-bold flex items-center gap-1 group-hover:gap-1.5 transition-all">
            مطالعه
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  )
}