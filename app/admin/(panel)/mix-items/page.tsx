// src/app/admin/mix-items/page.tsx

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FlaskConical,
  Scale,
  Sparkles,
} from 'lucide-react'
import { deleteMixItem, toggleMixItemStatus } from '@/app/actions/mixItem'

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
export default async function MixItemsPage() {
  const items = await prisma.mixItem.findMany({
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
                <FlaskConical className="w-4 h-4 text-[#1e5d3f]" />
              </div>
              <DecorativeCircle
                size={18}
                className="absolute -top-1 -right-1.5 text-[#e6b741]/60"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              آیتم‌های معجون
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 font-medium">
            {items.length.toLocaleString('fa-IR')} آیتم ثبت شده برای ساخت معجون
            اختصاصی
          </p>
        </div>

        <Link
          href="/admin/mix-items/new"
          className="group inline-flex items-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          افزودن آیتم جدید
        </Link>
      </div>

      {/* ==================== Empty State ==================== */}
      {items.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-12 sm:p-16 text-center">
          <div className="relative inline-block mb-5">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto">
              <FlaskConical className="w-6 h-6 text-stone-300" />
            </div>
            <DecorativeCircle
              size={20}
              className="absolute -top-1.5 -right-2 text-[#e6b741]/60"
            />
          </div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 mb-2">
            هنوز آیتمی ثبت نشده است
          </h2>
          <p className="text-xs text-stone-400 font-medium mb-6 max-w-md mx-auto leading-relaxed">
            آیتم‌های معجون، ترکیباتی هستند که کاربران می‌توانند در ساخت معجون
            اختصاصی انتخاب کنند.
          </p>
          <Link
            href="/admin/mix-items/new"
            className="group inline-flex items-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            افزودن اولین آیتم
          </Link>
        </div>
      ) : (
        /* ==================== Cards Grid ==================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
            >
              {/* ===== Image ===== */}
              <div className="relative aspect-[16/10] bg-stone-50 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  unoptimized
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badges */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1e5d3f] shadow-sm">
                    <Sparkles className="w-2.5 h-2.5" />
                    {item.category}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                      item.isActive
                        ? 'bg-emerald-500/90 text-white'
                        : 'bg-stone-500/90 text-white'
                    }`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        item.isActive
                          ? 'bg-white animate-pulse'
                          : 'bg-white/60'
                      }`}
                    />
                    {item.isActive ? 'فعال' : 'غیرفعال'}
                  </span>
                </div>
              </div>

              {/* ===== Content ===== */}
              <div className="p-5">
                {/* Title */}
                <h3 className="font-bold text-sm text-stone-800 mb-1.5 line-clamp-1 group-hover:text-[#1e5d3f] transition-colors">
                  {item.name}
                </h3>

                {/* Description */}
                <p className="text-[11px] text-stone-400 line-clamp-2 mb-4 min-h-[2.4rem] leading-relaxed font-medium">
                  {item.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  {/* Price */}
                  <div className="min-w-0">
                    <p className="text-[10px] text-stone-400 font-medium mb-0.5">
                      قیمت هر کیلوگرم
                    </p>
                    <div className="flex items-baseline gap-1">
                      <p className="font-black text-xs text-[#153f2b] truncate">
                        {item.price.toLocaleString('fa-IR')}
                      </p>
                      <span className="text-[10px] text-stone-400 font-medium flex-shrink-0">
                        تومان
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      href={`/admin/mix-items/${item.id}/edit`}
                      className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-emerald-50 flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] transition-all active:scale-95"
                      title="ویرایش"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>

                    <form
                      action={async () => {
                        'use server'
                        await toggleMixItemStatus(item.id, item.isActive)
                      }}
                    >
                      <button
                        type="submit"
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                          item.isActive
                            ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                            : 'bg-emerald-50 hover:bg-emerald-100 text-[#1e5d3f]'
                        }`}
                        title={item.isActive ? 'غیرفعال کردن' : 'فعال کردن'}
                      >
                        {item.isActive ? (
                          <EyeOff className="w-3.5 h-3.5" />
                        ) : (
                          <Eye className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </form>

                    <form
                      action={async () => {
                        'use server'
                        await deleteMixItem(item.id)
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}