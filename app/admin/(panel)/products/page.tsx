import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  Sparkles,
} from 'lucide-react'
import { deleteProduct, toggleProductStatus } from '@/app/actions/product'

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

// ==================== Main ====================
export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div dir="rtl" className="relative">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <DecorativeCircle
              size={22}
              className="text-[#e6b741]/60 hidden sm:block"
            />
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              مدیریت محصولات
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 font-medium">
            {products.length.toLocaleString('fa-IR')} محصول ثبت شده
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="group inline-flex items-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5 active:translate-y-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          افزودن محصول
        </Link>
      </div>

      {/* ===== Empty State ===== */}
      {products.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-12 sm:p-16 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Package className="w-6 h-6 text-stone-300" />
          </div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 mb-2">
            هنوز محصولی ثبت نشده است
          </h2>
          <p className="text-xs text-stone-400 font-medium mb-6">
            برای شروع اولین محصول خود را اضافه کنید
          </p>
          <Link
            href="/admin/products/new"
            className="group inline-flex items-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 py-3 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            افزودن اولین محصول
          </Link>
        </div>
      ) : (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-right min-w-[800px]">
              <thead>
                <tr className="text-[10px] text-stone-400 font-bold bg-stone-50/50">
                  <th className="p-4 font-bold">تصویر</th>
                  <th className="p-4 font-bold">نام</th>
                  <th className="p-4 font-bold">دسته‌بندی</th>
                  <th className="p-4 font-bold">قیمت</th>
                  <th className="p-4 font-bold">وضعیت</th>
                  <th className="p-4 font-bold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-stone-100/80 hover:bg-emerald-50/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="w-14 h-14 relative rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="56px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          unoptimized
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-xs text-stone-800 mb-0.5 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-stone-400 line-clamp-1 max-w-xs font-medium">
                        {product.description}
                      </p>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1e5d3f] bg-emerald-50 px-2.5 py-1 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" />
                        {product.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-xs text-[#153f2b]">
                          {product.price.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">
                          تومان
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          product.isActive
                            ? 'bg-emerald-50 text-[#1e5d3f]'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            product.isActive
                              ? 'bg-[#1e5d3f]'
                              : 'bg-stone-400'
                          }`}
                        />
                        {product.isActive ? 'فعال' : 'غیرفعال'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-emerald-50 flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] transition-all active:scale-95"
                          title="ویرایش"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <form
                          action={async () => {
                            'use server'
                            await toggleProductStatus(
                              product.id,
                              product.isActive
                            )
                          }}
                        >
                          <button
                            type="submit"
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all active:scale-95 ${
                              product.isActive
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-600'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-[#1e5d3f]'
                            }`}
                            title={
                              product.isActive
                                ? 'غیرفعال کردن'
                                : 'فعال کردن'
                            }
                          >
                            {product.isActive ? (
                              <EyeOff className="w-3.5 h-3.5" />
                            ) : (
                              <Eye className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </form>

                        <form
                          action={async () => {
                            'use server'
                            await deleteProduct(product.id)
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}