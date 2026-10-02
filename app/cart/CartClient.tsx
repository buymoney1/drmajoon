'use client'

import { useCart } from '@/contexts/CartContext'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShoppingCart,
  Leaf,
  Scale,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Package,
  AlertCircle,
} from 'lucide-react'
import { toast } from 'sonner'

// ==================== Types ====================
type LiveProduct = {
  id: string
  name: string
  price: number
  image: string
  category: string
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

// ==================== Price Calculation ====================
function calculateMixPrice(basePrice: number, weight: number): number {
  return Math.round(((basePrice / 1000) * weight) / 1000) * 1000
}

// ==================== Cart Item ====================
function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
  priceChanged,
}: {
  item: any
  onRemove: () => void
  onUpdateQuantity: (qty: number) => void
  priceChanged?: boolean
}) {
  const isMix = item.type === 'mix'

  return (
    <div className="group bg-white rounded-[24px] p-3.5 sm:p-4 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(30,93,63,0.12)] transition-all duration-300">
      <div className="flex gap-3 sm:gap-4">
        {/* Image */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-50">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
          <span
            className={`absolute top-1.5 right-1.5 sm:hidden text-[9px] font-black px-1.5 py-0.5 rounded-full ${
              isMix ? 'bg-[#1e5d3f] text-white' : 'bg-[#e6b741] text-[#0F1F18]'
            }`}
          >
            {isMix ? 'میکس' : 'محصول'}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Row */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 flex-wrap min-w-0">
              <span
                className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isMix
                    ? 'bg-emerald-50 text-[#1e5d3f]'
                    : 'bg-amber-50 text-[#b45309]'
                }`}
              >
                {isMix ? (
                  <>
                    <Sparkles className="w-2.5 h-2.5" />
                    معجون اختصاصی
                  </>
                ) : (
                  <>
                    <Package className="w-2.5 h-2.5" />
                    محصول
                  </>
                )}
              </span>

              {item.weight && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full">
                  <Scale className="w-2.5 h-2.5" />
                  {Number(item.weight).toLocaleString('fa-IR')} گرم
                </span>
              )}
            </div>

            <button
              onClick={onRemove}
              className="p-1.5 text-stone-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0 -mt-1 -mr-1"
              title="حذف از سبد"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title */}
          <h3 className="font-bold text-stone-800 text-xs sm:text-sm line-clamp-2 leading-relaxed mb-1">
            {item.name}
          </h3>

          {/* Price change alert */}
          {priceChanged && (
            <div className="flex items-start gap-1.5 bg-amber-50/70 rounded-xl p-2 mb-2">
              <AlertCircle className="w-3 h-3 text-[#e6b741] flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-stone-600 font-medium leading-relaxed">
                قیمت این محصول به‌روز شده است
              </p>
            </div>
          )}

          {/* Mix ingredients */}
          {item.items && item.items.length > 0 && (
            <p className="text-[10px] sm:text-[11px] text-stone-400 line-clamp-1 mb-2 font-medium">
              شامل: {item.items.map((i: any) => i.name).join('، ')}
            </p>
          )}

          {/* Bottom Row */}
          <div className="flex items-end justify-between gap-2 mt-auto pt-2.5 border-t border-stone-100">
            {/* Quantity */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onUpdateQuantity(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-7 text-center font-black text-xs text-stone-800">
                {item.quantity.toLocaleString('fa-IR')}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.quantity + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-[#1e5d3f] transition-all active:scale-95"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Price */}
            <div className="text-left">
              <p className="text-[10px] text-stone-400 font-medium mb-0.5">
                {item.price.toLocaleString('fa-IR')} ×{' '}
                {item.quantity.toLocaleString('fa-IR')}
              </p>
              <div className="flex items-baseline gap-1 justify-end">
                <p className="font-black text-sm sm:text-base text-[#153f2b]">
                  {(item.price * item.quantity).toLocaleString('fa-IR')}
                </p>
                <span className="text-[10px] text-stone-400 font-medium">
                  تومان
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==================== Main ====================
export default function CartClient({
  products = [],
  mixItems = [],
}: {
  products?: LiveProduct[]
  mixItems?: LiveProduct[]
}) {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
    updateItemPrice,
  } = useCart()
  const router = useRouter()
  const [priceChanges, setPriceChanges] = useState<Record<string, boolean>>({})

  // ==================== Sync Prices with Live Data ====================
  useEffect(() => {
    if (!cart || cart.length === 0) return
    if (!Array.isArray(products) || !Array.isArray(mixItems)) return

    const changes: Record<string, boolean> = {}
    let hasChanges = false

    cart.forEach((item) => {
      if (!item) return

      let livePrice: number | null = null

      if (item.type === 'mix') {
        // محاسبه مجدد قیمت میکس
        const weight = Number(item.weight) || 500
        const mixItemsInCart = item.items || []

        if (mixItemsInCart.length === 0) return

        let newPrice = 0
        let foundAll = true

        mixItemsInCart.forEach((mixItem: any) => {
          const live = mixItems.find((m) => m.id === mixItem.id)
          if (live) {
            newPrice += calculateMixPrice(live.price, weight)
          } else {
            foundAll = false
          }
        })

        if (foundAll && newPrice > 0 && newPrice !== item.price) {
          livePrice = newPrice
        }
      } else if (item.productId) {
        // محصول ساده
        const live = products.find((p) => p.id === item.productId)
        if (live && live.price !== item.price) {
          livePrice = live.price
        }
      }

      if (livePrice !== null) {
        updateItemPrice(item.id, livePrice)
        changes[item.id] = true
        hasChanges = true
      }
    })

    if (hasChanges) {
      setPriceChanges(changes)
      toast.info('قیمت برخی محصولات به‌روز شد', {
        description: 'قیمت‌های جدید بر اساس قیمت‌های فعلی فروشگاه محاسبه شدند',
        duration: 5000,
      })

      setTimeout(() => setPriceChanges({}), 5000)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length, products.length, mixItems.length])

  // ==================== Check for Unavailable Items ====================
  useEffect(() => {
    if (!cart || cart.length === 0) return
    if (!Array.isArray(products) || !Array.isArray(mixItems)) return

    const unavailableIds: string[] = []

    cart.forEach((item) => {
      if (!item) return

      if (item.type === 'product' && item.productId) {
        const exists = products.find((p) => p.id === item.productId)
        if (!exists) unavailableIds.push(item.id)
      } else if (item.type === 'mix') {
        const mixItemsInCart = item.items || []
        if (mixItemsInCart.length === 0) return

        const allAvailable = mixItemsInCart.every((mi: any) =>
          mixItems.find((m) => m.id === mi.id)
        )
        if (!allAvailable) unavailableIds.push(item.id)
      }
    })

    if (unavailableIds.length > 0) {
      unavailableIds.forEach((id) => removeFromCart(id))
      toast.error('برخی محصولات از سبد حذف شدند', {
        description:
          'این محصولات دیگر در فروشگاه موجود نیستند و از سبد شما حذف شدند',
        duration: 6000,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.length, products.length, mixItems.length])

  const handleRemove = (id: string, name: string) => {
    removeFromCart(id)
    toast.success(`«${name}» از سبد حذف شد`)
  }

  const handleClearCart = () => {
    if (confirm('آیا مطمئن هستید که می‌خواهید کل سبد را پاک کنید؟')) {
      clearCart()
      toast.success('سبد خرید خالی شد')
    }
  }

  const handleCheckout = () => {
    if (!cart || cart.length === 0) {
      toast.error('سبد خرید خالی است')
      return
    }
    router.push('/checkout')
  }

  const totalPrice = getTotalPrice()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  // ==================== Empty State ====================
  if (!cart || cart.length === 0) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#FBFBF9] selection:bg-[#1e5d3f]/20 flex flex-col relative"
      >
        <div
          className="fixed inset-0 pointer-events-none opacity-[0.012]"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 35%, #1e5d3f 1px, transparent 1px),
                              radial-gradient(circle at 75% 65%, #2a7d57 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#1e5d3f]/[0.04] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
        <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#e6b741]/[0.03] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

        <div className="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
          <div className="max-w-md w-full text-center bg-white/85 backdrop-blur-xl rounded-[32px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-[24px] flex items-center justify-center">
                <ShoppingBag
                  className="w-9 h-9 text-[#1e5d3f]"
                  strokeWidth={1.5}
                />
              </div>
              <DecorativeCircle
                size={28}
                className="absolute -top-2 -right-2 text-[#e6b741]/50"
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-stone-900 mb-3">
              سبد خرید شما خالی است
            </h1>
            <p className="text-stone-400 text-xs sm:text-sm mb-8 leading-relaxed">
              هنوز هیچ محصولی به سبد خرید اضافه نکرده‌اید. بیایید شروع کنیم!
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-6 py-3.5 rounded-full text-xs font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:-translate-y-0.5 active:translate-y-0"
              >
                <ShoppingCart className="w-4 h-4" />
                مشاهده فروشگاه
              </Link>
              <Link
                href="/custom-mix"
                className="inline-flex items-center justify-center gap-2 bg-white text-stone-700 hover:text-[#1e5d3f] hover:bg-emerald-50/50 px-6 py-3.5 rounded-full text-xs font-bold transition-all"
              >
                <Leaf className="w-4 h-4" />
                ساخت معجون اختصاصی
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==================== Cart ====================
  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FBFBF9] selection:bg-[#1e5d3f]/20 selection:text-[#0F1F18] relative"
    >
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 35%, #1e5d3f 1px, transparent 1px),
                            radial-gradient(circle at 75% 65%, #2a7d57 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />
      <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#1e5d3f]/[0.04] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#e6b741]/[0.03] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <div className="max-w-6xl mx-auto px-4 pt-6 pb-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-stone-500 hover:text-[#1e5d3f] text-[11px] font-bold mb-3 transition-colors group bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 rotate-180 group-hover:-translate-x-1 transition-transform" />
              ادامه خرید
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-1">
              سبد خرید
            </h1>
            <p className="text-xs text-stone-400 font-medium">
              {totalItems.toLocaleString('fa-IR')} آیتم در سبد شما
            </p>
          </div>

          <button
            onClick={handleClearCart}
            className="self-start sm:self-center inline-flex items-center gap-2 text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-3.5 py-2 rounded-full transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            خالی کردن سبد
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-3">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onRemove={() => handleRemove(item.id, item.name)}
                onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                priceChanged={priceChanges[item.id]}
              />
            ))}
          </div>

          {/* Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
              <div className="p-5 border-b border-stone-100">
                <h2 className="font-black text-sm sm:text-base text-stone-800 flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-[#1e5d3f]" />
                  </div>
                  خلاصه سفارش
                </h2>
              </div>

              <div className="p-5 space-y-3.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">
                    تعداد آیتم‌ها
                  </span>
                  <span className="font-bold text-stone-800">
                    {cart.length.toLocaleString('fa-IR')} مورد
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">جمع سبد</span>
                  <span className="font-bold text-stone-800">
                    {totalPrice.toLocaleString('fa-IR')} تومان
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-medium">هزینه ارسال</span>
                  <span className="font-bold text-stone-400 text-[10px]">
                    در مرحله بعد
                  </span>
                </div>

                <div className="pt-3.5 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-stone-700">
                      مبلغ قابل پرداخت
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-lg sm:text-xl text-[#153f2b]">
                        {totalPrice.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">
                        تومان
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="group relative w-full overflow-hidden text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)] hover:shadow-[0_10px_25px_-8px_rgba(30,93,63,0.7)] mt-2"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  <ArrowRight className="w-4 h-4 rotate-180 relative z-10" />
                  <span className="relative z-10">ادامه و پرداخت</span>
                </button>

                <div className="flex items-start gap-2.5 bg-emerald-50/60 rounded-2xl p-3.5">
                  <ShieldCheck className="w-4 h-4 text-[#1e5d3f] flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                    قیمت‌ها به‌صورت لحظه‌ای از فروشگاه به‌روز می‌شوند. سفارش
                    شما پس از تایید ارسال می‌شود.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}