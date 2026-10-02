'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import ProductCard from '@/components/ProductCard'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'
import {
  ArrowRight,
  ShoppingCart,
  Leaf,
  Check,
  Truck,
  Shield,
  Award,
  Minus,
  Plus,
  Star,
  Hash,
  ChevronLeft,
} from 'lucide-react'

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

// ==================== Feature Badge ====================
function FeatureBadge({
  icon: Icon,
  label,
}: {
  icon: any
  label: string
}) {
  return (
    <div className="group text-center">
      <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-105">
        <Icon className="w-5 h-5 text-[#1e5d3f]" />
      </div>
      <p className="text-[10px] sm:text-[11px] text-stone-500 font-bold">
        {label}
      </p>
    </div>
  )
}

// ==================== Main Component ====================
export default function ProductDetailClient({
  product,
  relatedProducts,
}: {
  product: any
  relatedProducts: any[]
}) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const router = useRouter()

  const handleAddToCart = () => {
    addToCart({
      type: 'product',
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      productId: product.id,
    })

    toast.success(
      `${quantity.toLocaleString('fa-IR')} عدد ${product.name} به سبد اضافه شد`,
      {
        description: `مبلغ: ${(product.price * quantity).toLocaleString('fa-IR')} تومان`,
        action: {
          label: 'مشاهده سبد',
          onClick: () => router.push('/cart'),
        },
      }
    )
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FBFBF9] selection:bg-[#1e5d3f]/20 selection:text-[#0F1F18] relative"
    >
      {/* ===== Background Texture ===== */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 35%, #1e5d3f 1px, transparent 1px),
                            radial-gradient(circle at 75% 65%, #2a7d57 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* ===== Background Blurs ===== */}
      <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#1e5d3f]/[0.04] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#e6b741]/[0.03] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />



      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 relative z-10">
        {/* ==================== Breadcrumb ==================== */}
        <nav className="flex items-center gap-1.5 text-[11px] text-stone-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#1e5d3f] transition-colors">
            خانه
          </Link>
          <span className="text-stone-300">/</span>
          <Link
            href="/shop"
            className="hover:text-[#1e5d3f] transition-colors"
          >
            فروشگاه
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-500 truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* ==================== Main Grid ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-8 mb-12">
          {/* ========== Image ========== */}
          <div className="bg-white/85 backdrop-blur-xl rounded-[24px] sm:rounded-[28px] p-3 sm:p-4 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            <div className="relative h-[280px] sm:h-96 md:h-[500px] rounded-[20px] sm:rounded-[24px] overflow-hidden bg-stone-50 group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized
              />

              {/* Category Badge */}
              <span className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-bold text-[#1e5d3f] flex items-center gap-1.5 shadow-sm">
                <Leaf className="w-3.5 h-3.5" />
                {product.category}
              </span>

              {/* Decorative circle */}
              <DecorativeCircle
                size={28}
                className="absolute bottom-4 left-4 text-white/40 hidden sm:block"
              />
            </div>
          </div>

          {/* ========== Info ========== */}
          <div className="bg-white/85 backdrop-blur-xl rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 lg:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-5">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3.5 h-3.5 fill-[#e6b741] text-[#e6b741]"
                  />
                ))}
              </div>
              <span className="text-[11px] text-stone-400 font-medium">
                (۵ از ۵)
              </span>
            </div>

            {/* Description */}
            <p className="text-stone-500 text-sm leading-loose mb-6 text-justify font-medium">
              {product.description}
            </p>

            {/* ===== Price Card ===== */}
            <div className="bg-gradient-to-br from-emerald-50/80 to-emerald-50/30 rounded-2xl p-5 mb-6">
              <p className="text-[11px] text-stone-400 font-medium mb-1">
                قیمت محصول
              </p>
              <div className="flex items-end gap-2">
                <p className="text-2xl sm:text-3xl font-black text-[#153f2b]">
                  {product.price.toLocaleString('fa-IR')}
                </p>
                <span className="text-xs text-stone-400 font-medium mb-1">
                  تومان
                </span>
              </div>
            </div>

            {/* ===== Quantity ===== */}
            <div className="mb-6">
              <label className="block text-xs font-black text-stone-700 mb-3">
                تعداد مورد نیاز
              </label>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 sm:w-16 text-center font-black text-lg text-stone-800">
                  {quantity.toLocaleString('fa-IR')}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-[#1e5d3f] transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Total Preview */}
            <div className="flex items-center justify-between mb-5 px-1">
              <span className="text-xs text-stone-400 font-medium">
                جمع این محصول:
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-[#153f2b] text-base">
                  {(product.price * quantity).toLocaleString('fa-IR')}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">
                  تومان
                </span>
              </div>
            </div>

            {/* ===== Add to Cart ===== */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="group relative w-full overflow-hidden text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)] hover:shadow-[0_10px_25px_-8px_rgba(30,93,63,0.7)] mb-6"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
              <ShoppingCart className="w-4 h-4 relative z-10" />
              <span className="relative z-10">افزودن به سبد خرید</span>
            </button>

            {/* ===== Features ===== */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-stone-100">
              <FeatureBadge icon={Truck} label="ارسال سریع" />
              <FeatureBadge icon={Shield} label="ضمانت اصالت" />
              <FeatureBadge icon={Award} label="کیفیت تضمینی" />
            </div>
          </div>
        </div>

        {/* ==================== Related Products ==================== */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-stone-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <DecorativeCircle
                  size={24}
                  className="text-[#1e5d3f]/30 hidden sm:block"
                />
                <h2 className="text-lg sm:text-xl font-black text-stone-900">
                  محصولات مرتبط
                </h2>
              </div>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1e5d3f] hover:text-[#153f2b] bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-full transition-all"
              >
                مشاهده همه
                <ChevronLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

    </div>
  )
}