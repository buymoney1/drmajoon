// src/app/admin/categories/page.tsx

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  FolderTree,
  Package,
  Sparkles,
} from 'lucide-react'
import { deleteCategory, toggleCategoryStatus } from '@/app/actions/category'

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
export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  const categoriesWithCount = await Promise.all(
    categories.map(async (cat) => {
      const count = await prisma.product.count({
        where: { category: cat.name },
      })
      return { ...cat, productsCount: count }
    })
  )

  return (
    <div dir="rtl" className="relative max-w-6xl mx-auto">
      {/* ==================== Header ==================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative hidden sm:block">
              <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
                <FolderTree className="w-4 h-4 text-[#1e5d3f]" />
              </div>
              <DecorativeCircle
                size={18}
                className="absolute -top-1 -right-1.5 text-[#e6b741]/60"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              مدیریت دسته‌بندی‌ها
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 font-medium">
            {categories.length.toLocaleString('fa-IR')} دسته‌بندی ثبت شده
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="group inline-flex items-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          افزودن دسته‌بندی
        </Link>
      </div>

      {/* ==================== Empty State ==================== */}
      {categories.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-12 sm:p-16 text-center">
          <div className="relative inline-block mb-5">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto">
              <FolderTree className="w-6 h-6 text-stone-300" />
            </div>
            <DecorativeCircle
              size={20}
              className="absolute -top-1.5 -right-2 text-[#e6b741]/60"
            />
          </div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 mb-2">
            هنوز دسته‌بندی‌ای ثبت نشده است
          </h2>
          <p className="text-xs text-stone-400 font-medium mb-6 max-w-sm mx-auto">
            دسته‌بندی‌ها به سازماندهی محصولات فروشگاه شما کمک می‌کنند.
          </p>
          <Link
            href="/admin/categories/new"
            className="group inline-flex items-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            افزودن اولین دسته‌بندی
          </Link>
        </div>
      ) : (
        /* ==================== Table ==================== */
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-right min-w-[900px]">
              <thead>
                <tr className="text-[10px] text-stone-400 font-bold bg-stone-50/50">
                  <th className="p-4 font-bold">تصویر</th>
                  <th className="p-4 font-bold">نام</th>
                  <th className="p-4 font-bold">توضیحات</th>
                  <th className="p-4 font-bold">تعداد محصول</th>
                  <th className="p-4 font-bold">ترتیب</th>
                  <th className="p-4 font-bold">وضعیت</th>
                  <th className="p-4 font-bold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {categoriesWithCount.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-t border-stone-100/80 hover:bg-emerald-50/30 transition-colors group"
                  >
                    {/* Image */}
                    <td className="p-4">
                      <div className="w-14 h-14 relative rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            sizes="56px"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100/50">
                            <FolderTree className="w-5 h-5 text-[#1e5d3f]/60" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name + Slug */}
                    <td className="p-4">
                      <p className="font-bold text-xs text-stone-800 mb-0.5">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono" dir="ltr">
                        {cat.slug}
                      </p>
                    </td>

                    {/* Description */}
                    <td className="p-4">
                      <p className="text-xs text-stone-500 line-clamp-1 max-w-[200px] font-medium">
                        {cat.description || '—'}
                      </p>
                    </td>

                    {/* Products Count */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-[#1e5d3f] px-2.5 py-1 rounded-full text-[10px] font-bold">
                        <Package className="w-3 h-3" />
                        {cat.productsCount.toLocaleString('fa-IR')}
                      </span>
                    </td>

                    {/* Order */}
                    <td className="p-4">
                      <span className="inline-flex items-center justify-center min-w-[32px] h-8 text-[11px] font-bold bg-stone-100 text-stone-600 rounded-xl px-2.5">
                        {cat.order.toLocaleString('fa-IR')}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          cat.isActive
                            ? 'bg-emerald-50 text-[#1e5d3f]'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            cat.isActive ? 'bg-[#1e5d3f]' : 'bg-stone-400'
                          }`}
                        />
                        {cat.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/categories/${cat.id}/edit`}
                          className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-emerald-50 flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] transition-all active:scale-95"
                          title="ویرایش"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <form
                          action={async () => {
                            'use server'
                            await toggleCategoryStatus(cat.id, cat.isActive)
                          }}
                        >
                          <button
                            type="submit"
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                              cat.isActive
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-[#1e5d3f]'
                            }`}
                            title={
                              cat.isActive ? 'غیرفعال کردن' : 'فعال کردن'
                            }
                          >
                            {cat.isActive ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </form>

                        {cat.productsCount === 0 ? (
                          <form
                            action={async () => {
                              'use server'
                              await deleteCategory(cat.id)
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
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-8 h-8 rounded-xl bg-stone-50 flex items-center justify-center text-stone-300 cursor-not-allowed"
                            title={`قابل حذف نیست (${cat.productsCount} محصول)`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== Hint Note ==================== */}
      <div className="mt-5 flex items-start gap-3 bg-amber-50/60 rounded-2xl p-4">
        <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#e6b741]" />
        </div>
        <div className="text-[11px] text-stone-600 pt-1">
          <p className="font-black mb-0.5 text-stone-700">نکته</p>
          <p className="leading-relaxed font-medium">
            برای حذف یک دسته‌بندی، ابتدا باید تمام محصولات مربوط به آن
            دسته‌بندی را حذف یا به دسته دیگری منتقل کنید.
          </p>
        </div>
      </div>
    </div>
  )
}