// src/app/admin/articles/page.tsx

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  Calendar,
  ArrowLeft,
  Sparkles,
} from 'lucide-react'
import { deleteArticle } from '@/app/actions/article'

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

// ==================== Page ====================
export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div dir="rtl" className="relative max-w-6xl mx-auto">
      {/* ==================== Header ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative hidden sm:block">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
                <FileText className="w-4 h-4 text-[#1e5d3f]" />
              </div>
              <DecorativeCircle
                size={18}
                className="absolute -top-1 -right-1.5 text-[#e6b741]/60"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              مدیریت مقالات
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 font-medium">
            {articles.length.toLocaleString('fa-IR')} مقاله ثبت شده
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="group inline-flex items-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          افزودن مقاله
        </Link>
      </div>

      {/* ==================== Empty State ==================== */}
      {articles.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-12 sm:p-16 text-center">
          <div className="relative inline-block mb-5">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6 text-stone-300" />
            </div>
            <DecorativeCircle
              size={20}
              className="absolute -top-1.5 -right-2 text-[#e6b741]/60"
            />
          </div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 mb-2">
            هنوز مقاله‌ای ثبت نشده است
          </h2>
          <p className="text-xs text-stone-400 font-medium mb-6 max-w-sm mx-auto">
            اولین مقاله‌ت رو بنویس و با مخاطبینت به اشتراک بذار
          </p>
          <Link
            href="/admin/articles/new"
            className="group inline-flex items-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            افزودن اولین مقاله
          </Link>
        </div>
      ) : (
        /* ==================== Cards Grid ==================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {articles.map((article) => (
            <div
              key={article.id}
              className="group bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)] transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col"
            >
              {/* ===== Image ===== */}
              <div className="relative aspect-[16/10] bg-stone-50 overflow-hidden">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-amber-50/50 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-emerald-300/60 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1e5d3f] shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" />
                    مقاله
                  </span>
                </div>
              </div>

              {/* ===== Content ===== */}
              <div className="flex-1 flex flex-col p-5">
                {/* Date */}
                <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-medium mb-2.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(article.createdAt).toLocaleDateString('fa-IR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </div>

                {/* Title */}
                <h3 className="font-bold text-sm text-stone-800 mb-2 line-clamp-2 leading-relaxed group-hover:text-[#1e5d3f] transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-[11px] text-stone-400 line-clamp-2 mb-4 leading-relaxed font-medium flex-1">
                  {article.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-auto">
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1e5d3f] hover:text-[#153f2b] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full transition-all active:scale-95"
                  >
                    <Edit className="w-3 h-3" />
                    ویرایش
                  </Link>

                  <form
                    action={async () => {
                      'use server'
                      await deleteArticle(article.id)
                    }}
                  >
                    <button
                      type="submit"
                      className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-red-50 flex items-center justify-center text-stone-500 hover:text-red-500 transition-all active:scale-95"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}