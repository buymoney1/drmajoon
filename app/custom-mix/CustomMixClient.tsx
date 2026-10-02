'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import {
  Check,
  ShoppingCart,
  ArrowLeft,
  Leaf,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Scale,
  FlaskConical,
  Info,
  TrendingUp,
  Plus,
} from 'lucide-react'
import { toast } from 'sonner'

// ==================== Price Calculation ====================
function calculatePrice(basePrice: number, userWeight: number): number {
  return Math.round(((basePrice / 1000) * userWeight) / 1000) * 1000
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

// ==================== Weight Selector ====================
function WeightSelector({
  weight,
  setWeight,
  compact = false,
}: {
  weight: number
  setWeight: (w: number) => void
  compact?: boolean
}) {
  return (
    <div
      className={`bg-stone-100/70 ${
        compact ? 'p-0.5' : 'p-1 sm:p-1.5'
      } rounded-2xl flex items-center w-full gap-1`}
    >
      {[250, 500, 1000].map((w) => (
        <button
          key={w}
          type="button"
          onClick={() => setWeight(w)}
          className={`flex-1 ${
            compact ? 'py-1.5' : 'py-2 sm:py-2.5'
          } rounded-xl text-[10px] sm:text-xs font-bold transition-all duration-300 ${
            weight === w
              ? 'bg-white text-[#1e5d3f] shadow-sm'
              : 'text-stone-500 hover:text-stone-700'
          }`}
        >
          {w} گرم
        </button>
      ))}
    </div>
  )
}

// ==================== Mobile Item Card (Minimal) ====================
function MobileItemCard({
  item,
  isSelected,
  isActive,
  price,
  onClick,
}: {
  item: any
  isSelected: boolean
  isActive: boolean
  price: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex-shrink-0 w-[90px] rounded-2xl overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/60 shadow-[0_6px_18px_-6px_rgba(30,93,63,0.35)] ring-2 ring-[#1e5d3f]'
          : isActive
          ? 'bg-white shadow-[0_4px_12px_-4px_rgba(30,93,63,0.15)] ring-2 ring-[#1e5d3f]/25'
          : 'bg-white shadow-[0_2px_10px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_14px_-4px_rgba(30,93,63,0.15)]'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-stone-50 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="100px"
          className={`object-cover transition-transform duration-500 ${
            isSelected ? 'scale-105' : 'group-hover:scale-105'
          }`}
          unoptimized
        />

        {/* Selected overlay */}
        {isSelected && <div className="absolute inset-0 bg-[#1e5d3f]/10" />}

        {/* Check badge */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-[#1e5d3f] rounded-full flex items-center justify-center shadow-md shadow-emerald-900/30 animate-in fade-in zoom-in duration-200">
            <Check className="w-3 h-3 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2">
        <p
          className={`font-bold text-[10px] line-clamp-1 leading-tight mb-0.5 ${
            isSelected ? 'text-[#153f2b]' : 'text-stone-700'
          }`}
        >
          {item.name}
        </p>
        <p
          className={`text-[9px] font-bold leading-tight ${
            isSelected ? 'text-[#1e5d3f]' : 'text-stone-400'
          }`}
        >
          {price.toLocaleString('fa-IR')} ت
        </p>
      </div>
    </button>
  )
}

// ==================== Item Row (Desktop) ====================
function ItemRow({
  item,
  isSelected,
  isActive,
  price,
  onClick,
}: {
  item: any
  isSelected: boolean
  isActive: boolean
  price: number
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full flex items-center gap-3 p-2.5 rounded-2xl text-right transition-all duration-300 overflow-hidden ${
        isSelected
          ? 'bg-gradient-to-l from-emerald-50 to-emerald-50/40 shadow-[0_4px_20px_-8px_rgba(30,93,63,0.25)]'
          : 'bg-white hover:bg-stone-50/80'
      } ${isActive && !isSelected ? 'bg-stone-50/60' : ''}`}
    >
      <span
        className={`absolute right-0 top-1/2 -translate-y-1/2 h-8 w-1 rounded-l-full bg-[#1e5d3f] transition-all duration-300 ${
          isSelected ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
        }`}
      />

      <div
        className={`relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100 transition-all duration-300 ${
          isSelected
            ? 'ring-2 ring-[#1e5d3f]/30 ring-offset-1'
            : 'ring-1 ring-stone-100/60'
        }`}
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="48px"
          className={`object-cover transition-transform duration-500 ${
            isSelected ? 'scale-110' : 'group-hover:scale-105'
          }`}
          unoptimized
        />
      </div>

      <div className="flex-1 min-w-0">
        <p
          className={`font-bold text-xs truncate transition-colors ${
            isSelected
              ? 'text-[#153f2b]'
              : 'text-stone-700 group-hover:text-[#153f2b]'
          }`}
        >
          {item.name}
        </p>
        <p
          className={`text-[10px] mt-0.5 font-bold transition-colors ${
            isSelected ? 'text-[#1e5d3f]' : 'text-stone-400'
          }`}
        >
          {price.toLocaleString('fa-IR')} تومان
        </p>
      </div>

      <span
        className={`relative flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
          isSelected
            ? 'bg-[#1e5d3f] shadow-[0_4px_10px_-2px_rgba(30,93,63,0.5)] scale-100'
            : 'bg-stone-100 scale-90 group-hover:bg-stone-200/80 group-hover:scale-100'
        }`}
      >
        <Check
          className={`w-3.5 h-3.5 transition-all duration-300 ${
            isSelected
              ? 'text-white opacity-100 scale-100'
              : 'text-stone-400 opacity-0 scale-50 group-hover:opacity-40 group-hover:scale-75'
          }`}
          strokeWidth={3}
        />
      </span>
    </button>
  )
}

// ==================== Thumbnail (Desktop) ====================
function Thumbnail({
  item,
  isActive,
  isSelected,
  onClick,
}: {
  item: any
  isActive: boolean
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-[60px] h-[60px] sm:w-[68px] sm:h-[68px] rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-300 ${
        isActive
          ? 'ring-2 ring-[#1e5d3f] ring-offset-2 opacity-100 shadow-md'
          : isSelected
          ? 'ring-2 ring-[#1e5d3f]/40 ring-offset-1 opacity-100'
          : 'opacity-60 hover:opacity-100'
      }`}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        sizes="68px"
        className="object-cover"
        unoptimized
      />
      {isSelected && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-[#1e5d3f] rounded-full flex items-center justify-center shadow-md">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  )
}

// ==================== Main ====================
export default function CustomMixClient({ items }: { items: any[] }) {
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [weight, setWeight] = useState(500)
  const [activeIndex, setActiveIndex] = useState(0)
  const { addToCart } = useCart()
  const router = useRouter()

  // ===== Empty State =====
  if (!items || items.length === 0) {
    return (
      <div
        dir="rtl"
        className="min-h-screen bg-[#FBFBF9] flex flex-col selection:bg-[#1e5d3f]/20"
      >
      
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-10 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] max-w-md">
            <div className="w-16 h-16 bg-stone-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FlaskConical
                className="w-7 h-7 text-stone-300"
                strokeWidth={1.5}
              />
            </div>
            <h1 className="text-lg font-black text-stone-800 mb-2">
              هنوز آیتمی برای معجون اضافه نشده
            </h1>
            <p className="text-stone-400 text-xs">لطفاً بعداً مراجعه کنید</p>
          </div>
        </div>

      </div>
    )
  }

  const activeItem = items[activeIndex]

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const selectItemAndActivate = (item: any, idx: number) => {
    toggleItem(item.id)
    setActiveIndex(idx)
  }

  const getItemPrice = (item: any) => calculatePrice(item.price, weight)

  const totalPrice = useMemo(() => {
    return selectedItems.reduce((sum, id) => {
      const item = items.find((i) => i.id === id)
      if (!item) return sum
      return sum + getItemPrice(item)
    }, 0)
  }, [selectedItems, weight, items])

  const activeItemPrice = getItemPrice(activeItem)

  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      toast.error('حداقل یک آیتم برای ساخت معجون انتخاب کنید')
      return
    }

    const selectedData = selectedItems.map((id) => {
      const item = items.find((i) => i.id === id)!
      return {
        id: item.id,
        name: item.name,
        price: getItemPrice(item),
        basePrice: item.price,
      }
    })

    const names = selectedData.map((i) => i.name).join(' + ')
    const firstImage =
      items.find((i) => i.id === selectedItems[0])?.image || ''

    addToCart({
      type: 'mix',
      name: `معجون اختصاصی (${names})`,
      image: firstImage,
      price: totalPrice,
      quantity: 1,
      items: selectedData,
      weight: weight.toString(),
    })

    toast.success('معجون اختصاصی شما به سبد اضافه شد 🌿', {
      description: `وزن: ${weight.toLocaleString('fa-IR')} گرم | مبلغ: ${totalPrice.toLocaleString('fa-IR')} تومان`,
      action: {
        label: 'مشاهده سبد',
        onClick: () => router.push('/cart'),
      },
    })

    setSelectedItems([])
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FBFBF9] selection:bg-[#1e5d3f]/20 selection:text-[#0F1F18] relative overflow-hidden"
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



      {/* ==================== Hero (Compact) ==================== */}
      <section className="relative pt-3 sm:pt-5 pb-2 sm:pb-3 px-4 z-10">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-stone-500 hover:text-[#1e5d3f] text-[10px] sm:text-[11px] font-bold mb-3 transition-colors group bg-white/70 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm"
          >
            <ArrowLeft className="w-3 h-3 rotate-180 group-hover:-translate-x-1 transition-transform" />
            بازگشت
          </Link>

          <h1 className="text-lg sm:text-2xl md:text-4xl font-black text-stone-900 tracking-tight mb-1.5 sm:mb-2 leading-[1.2]">
            معجون اختصاصی{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#1e5d3f]">خودت</span>
              <DecorativeCircle
                size={60}
                className="absolute -top-2 -right-4 text-[#e6b741]/50 hidden sm:block"
              />
            </span>{' '}
            رو بساز
          </h1>

          <p className="text-stone-500 text-[11px] sm:text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
            ترکیبات مورد نظرت رو انتخاب کن، وزن نهایی رو مشخص کن و قیمت رو
            لحظه‌ای ببین.
          </p>
        </div>
      </section>

      {/* ==================== Mobile/Tablet: Compact Items Selector ==================== */}
      <section className="xl:hidden relative z-10 px-4 pb-3">
        <div className="max-w-6xl mx-auto space-y-2.5">
          {/* Weight + Count Row */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[18px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2.5">
            <div className="flex items-center justify-between mb-2 px-0.5">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-stone-700">
                <Scale className="w-3 h-3 text-[#1e5d3f]" />
                وزن نهایی
              </div>
              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                  selectedItems.length > 0
                    ? 'bg-emerald-50 text-[#1e5d3f]'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {selectedItems.length.toLocaleString('fa-IR')} آیتم
              </span>
            </div>
            <WeightSelector weight={weight} setWeight={setWeight} compact />
          </div>

          {/* Horizontal Items Scroller (Minimal) */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[18px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-2.5">
            {/* Header */}
            <div className="flex items-center justify-between mb-2 px-0.5">
              <div className="flex items-center gap-1.5">
                <FlaskConical className="w-3 h-3 text-[#1e5d3f]" />
                <p className="text-[10px] font-black text-stone-700">
                  ترکیبات رو انتخاب کن
                </p>
              </div>
              <span className="text-[9px] text-stone-400 font-medium">
                {items.length.toLocaleString('fa-IR')} مورد
              </span>
            </div>

            {/* Horizontal scroll with slim scrollbar */}
            <div className="flex gap-2 overflow-x-auto slim-scrollbar pb-2 -mx-0.5 px-0.5">
              {items.map((item, idx) => (
                <MobileItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  isActive={activeIndex === idx}
                  price={getItemPrice(item)}
                  onClick={() => selectItemAndActivate(item, idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== Main Content ==================== */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-36 xl:pb-16 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6">
          {/* ================= LEFT: Details & Image ================= */}
          <div className="xl:col-span-8 flex flex-col gap-4 sm:gap-5">
            <div className="bg-white/85 backdrop-blur-xl rounded-[20px] sm:rounded-[28px] p-3.5 sm:p-5 lg:p-7 shadow-[0_8px_30px_rgb(0,0,0,0.03)]">
              {/* Image Banner */}
              <div className="relative w-full h-[240px] sm:h-[320px] md:h-[420px] rounded-[16px] sm:rounded-[24px] overflow-hidden mb-4 sm:mb-6 group bg-stone-100">
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent z-10" />

                <span className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-md px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-stone-800 z-20 flex items-center gap-1.5 shadow-sm">
                  <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1e5d3f]" />
                  {activeItem.name}
                </span>

                {selectedItems.includes(activeItem.id) && (
                  <span className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-[#1e5d3f] text-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold z-20 flex items-center gap-1 sm:gap-1.5 shadow-lg shadow-emerald-900/30 animate-in fade-in zoom-in duration-300">
                    <Check
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                      strokeWidth={3}
                    />
                    انتخاب شده
                  </span>
                )}

                <Image
                  src={activeItem.image}
                  alt={activeItem.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />

                <div className="absolute bottom-3.5 right-3.5 sm:bottom-5 sm:right-5 z-20">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white drop-shadow-md mb-1">
                    {activeItem.name}
                  </h2>
                  {activeItem.category && (
                    <p className="text-stone-200 text-[10px] sm:text-xs font-medium drop-shadow">
                      {activeItem.category}
                    </p>
                  )}
                </div>
              </div>

              {/* Mobile: Toggle button for current item */}
              <div className="xl:hidden mb-5">
                <button
                  type="button"
                  onClick={() => toggleItem(activeItem.id)}
                  className={`w-full flex items-center justify-between gap-3 p-3 rounded-2xl transition-all active:scale-[0.98] ${
                    selectedItems.includes(activeItem.id)
                      ? 'bg-[#1e5d3f] text-white shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)]'
                      : 'bg-gradient-to-r from-emerald-50 to-emerald-100/60 text-[#1e5d3f] hover:shadow-[0_8px_20px_-8px_rgba(30,93,63,0.3)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        selectedItems.includes(activeItem.id)
                          ? 'bg-white/20'
                          : 'bg-white shadow-sm'
                      }`}
                    >
                      {selectedItems.includes(activeItem.id) ? (
                        <Check
                          className="w-4 h-4 text-white"
                          strokeWidth={3}
                        />
                      ) : (
                        <Plus className="w-4 h-4 text-[#1e5d3f]" />
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-black text-[11px]">
                        {selectedItems.includes(activeItem.id)
                          ? 'انتخاب شده'
                          : 'این ترکیب رو اضافه کن'}
                      </p>
                      <p
                        className={`text-[10px] font-medium ${
                          selectedItems.includes(activeItem.id)
                            ? 'text-white/70'
                            : 'text-[#1e5d3f]/70'
                        }`}
                      >
                        {activeItemPrice.toLocaleString('fa-IR')} تومان
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                      selectedItems.includes(activeItem.id)
                        ? 'bg-white/20 text-white'
                        : 'bg-white text-[#1e5d3f]'
                    }`}
                  >
                    {selectedItems.includes(activeItem.id) ? 'حذف' : 'افزودن'}
                  </span>
                </button>
              </div>

              {/* Thumbnails (Desktop) */}
              <div className="hidden xl:flex items-center gap-2.5 mb-7 bg-emerald-50/40 p-2.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(
                      (prev) => (prev - 1 + items.length) % items.length
                    )
                  }
                  className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] transition-all flex-shrink-0"
                  aria-label="قبلی"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="flex gap-2.5 flex-1 overflow-x-auto slim-scrollbar py-1 px-0.5">
                  {items.map((item, idx) => (
                    <Thumbnail
                      key={item.id}
                      item={item}
                      isActive={activeIndex === idx}
                      isSelected={selectedItems.includes(item.id)}
                      onClick={() => selectItemAndActivate(item, idx)}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex((prev) => (prev + 1) % items.length)
                  }
                  className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] transition-all flex-shrink-0"
                  aria-label="بعدی"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              {/* Description */}
              <div className="mb-5 sm:mb-7">
                <h3 className="text-sm sm:text-base font-black text-stone-900 mb-3 flex items-center gap-2">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#1e5d3f]" />
                  </div>
                  درباره این ترکیب
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-loose text-justify font-medium">
                  {activeItem.description}
                </p>
              </div>

              {/* Price Card */}
              <div className="bg-gradient-to-br from-emerald-50/80 to-emerald-50/30 rounded-2xl sm:rounded-[20px] p-4 sm:p-5 mb-5 sm:mb-7">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-4 sm:mb-5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <TrendingUp className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-[#1e5d3f]" />
                  </div>
                  <div>
                    <p className="font-black text-[#153f2b] text-xs sm:text-sm">
                      قیمت این آیتم
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium">
                      بر اساس وزن انتخابی شما
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-sm">
                  <div className="flex items-center justify-between text-[11px] sm:text-xs mb-2.5 pb-2.5 border-b border-stone-100/80">
                    <span className="text-stone-500 font-medium">
                      قیمت ۱ کیلوگرم
                    </span>
                    <span className="font-bold text-stone-800">
                      {activeItem.price.toLocaleString('fa-IR')} تومان
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] sm:text-xs mb-3 pb-3 border-b border-stone-100/80">
                    <span className="text-stone-500 font-medium">
                      وزن انتخابی
                    </span>
                    <span className="font-bold text-[#1e5d3f]">
                      {weight.toLocaleString('fa-IR')} گرم
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-black text-stone-800 text-xs sm:text-sm">
                      قیمت نهایی
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-lg sm:text-xl text-[#153f2b]">
                        {activeItemPrice.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-[10px] font-medium text-stone-400">
                        تومان
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-stone-400 text-center mt-3 font-medium">
                  قیمت هر گرم ={' '}
                  {Math.round(activeItem.price / 1000).toLocaleString('fa-IR')}{' '}
                  تومان
                </p>
              </div>

              {/* Benefits */}
              {activeItem.benefits && activeItem.benefits.length > 0 && (
                <div className="bg-emerald-50/40 rounded-2xl sm:rounded-[20px] p-4 sm:p-5 lg:p-6">
                  <h3 className="flex items-center gap-2.5 font-black text-xs sm:text-sm text-[#153f2b] mb-4 sm:mb-5">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e6b741]" />
                    </div>
                    خواص و فواید شگفت‌انگیز
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3">
                    {activeItem.benefits.map((benefit: string) => (
                      <div
                        key={benefit}
                        className="flex items-start gap-2.5 sm:gap-3 bg-white p-3 sm:p-3.5 rounded-2xl shadow-sm transition-all hover:-translate-y-0.5"
                      >
                        <div className="w-5 h-5 bg-gradient-to-br from-[#2a7d57] to-[#1e5d3f] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-[11px] sm:text-xs font-semibold text-stone-600 leading-relaxed">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ================= RIGHT: Cart Sidebar (Desktop) ================= */}
          <div className="hidden xl:block xl:col-span-4 relative">
            <div className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] sticky top-24 flex flex-col overflow-hidden max-h-[calc(100vh-7rem)]">
              <div className="p-5 border-b border-stone-100/80">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="flex items-center gap-2.5 font-black text-base text-stone-800">
                    <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-[#1e5d3f]" />
                    </div>
                    سبد معجون
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                      selectedItems.length > 0
                        ? 'bg-emerald-50 text-[#1e5d3f]'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {selectedItems.length.toLocaleString('fa-IR')} آیتم
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600 mb-2.5">
                    <Scale className="w-3.5 h-3.5 text-stone-400" />
                    وزن نهایی
                  </div>
                  <WeightSelector weight={weight} setWeight={setWeight} />
                </div>
              </div>

              <div className="p-5 overflow-y-auto slim-scrollbar space-y-2 flex-1">
                {items.map((item, idx) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItems.includes(item.id)}
                    isActive={activeIndex === idx}
                    price={getItemPrice(item)}
                    onClick={() => selectItemAndActivate(item, idx)}
                  />
                ))}
              </div>

              <div className="bg-gradient-to-t from-emerald-50/60 to-emerald-50/20 p-5 border-t border-emerald-100/50">
                <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-2 font-medium">
                    <span>تعداد آیتم‌ها</span>
                    <span className="font-bold text-[#153f2b]">
                      {selectedItems.length.toLocaleString('fa-IR')} عدد
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 mb-3 pb-3 border-b border-stone-100/80 font-medium">
                    <span>وزن نهایی</span>
                    <span className="font-bold text-[#153f2b]">
                      {weight.toLocaleString('fa-IR')} گرم
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-700">
                      مبلغ قابل پرداخت
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-lg text-[#153f2b]">
                        {totalPrice.toLocaleString('fa-IR')}
                      </span>
                      <span className="text-stone-400 text-[10px] font-medium">
                        تومان
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={selectedItems.length === 0}
                  className={`w-full relative group overflow-hidden text-white py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] ${
                    selectedItems.length === 0
                      ? 'bg-stone-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)] hover:shadow-[0_10px_25px_-8px_rgba(30,93,63,0.7)]'
                  }`}
                >
                  {selectedItems.length > 0 && (
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                  )}
                  <ShoppingCart className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">
                    {selectedItems.length === 0
                      ? 'ابتدا آیتم انتخاب کنید'
                      : `افزودن به سبد (${selectedItems.length.toLocaleString('fa-IR')})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== Mobile Bottom Sticky Bar ==================== */}
      <div className="xl:hidden fixed bottom-0 inset-x-0 z-40 px-3 pb-3 pointer-events-none">
        <div className="max-w-6xl mx-auto pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-xl rounded-[20px] shadow-2xl shadow-black/10 border border-stone-200/60 overflow-hidden">
            <div className="p-2.5 flex items-center gap-2">
              {/* Summary */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                  <ShoppingCart className="w-4.5 h-4.5 text-[#1e5d3f]" />
                  {selectedItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-[1.1rem] px-1 bg-[#e6b741] text-[#0F1F18] text-[9px] rounded-full flex items-center justify-center font-black shadow-sm">
                      {selectedItems.length.toLocaleString('fa-IR')}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] text-stone-400 font-medium truncate">
                    {selectedItems.length > 0
                      ? `${selectedItems.length.toLocaleString('fa-IR')} آیتم • ${weight.toLocaleString('fa-IR')} گرم`
                      : 'هنوز آیتمی انتخاب نشده'}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="font-black text-sm text-[#153f2b]">
                      {totalPrice.toLocaleString('fa-IR')}
                    </p>
                    <span className="text-[9px] text-stone-400 font-medium">
                      تومان
                    </span>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectedItems.length === 0}
                className={`group relative overflow-hidden flex-shrink-0 text-white px-4 h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] ${
                  selectedItems.length === 0
                    ? 'bg-stone-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)]'
                }`}
              >
                {selectedItems.length > 0 && (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                )}
                <span className="relative z-10">
                  {selectedItems.length === 0 ? 'انتخاب کن' : 'افزودن'}
                </span>
                {selectedItems.length > 0 && (
                  <ChevronLeft className="w-3.5 h-3.5 relative z-10" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}