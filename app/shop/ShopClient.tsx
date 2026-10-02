'use client'

import { useState, useMemo } from 'react'
import ProductCard from '@/components/ProductCard'
import {
  Search,
  X,
  PackageSearch,
  Hash,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react'

// ==================== Types ====================
type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
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

// ==================== Main ====================
export default function ShopClient({
  products,
  categories,
}: {
  products: Product[]
  categories: string[]
}) {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'cheapest' | 'expensive'>(
    'newest'
  )

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory)
    }

    if (sortBy === 'cheapest') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'expensive') {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, search, selectedCategory, sortBy])

  const hasActiveFilter = !!(search || selectedCategory)

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

      {/* ==================== Hero (Compact) ==================== */}
      <section className="pt-5 sm:pt-8 pb-3 sm:pb-5 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-stone-900 mb-2 sm:mb-3 leading-[1.15] tracking-tight">
            فروشگاه{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-[#1e5d3f]">دکتر معجون</span>
              <DecorativeLine className="absolute -bottom-1 sm:-bottom-2 right-0 text-[#1e5d3f] w-16 sm:w-20" />
            </span>
          </h1>

          <p className="hidden sm:block text-stone-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            محصولات طبیعی و گیاهان دارویی اصل، مستقیم از دل طبیعت به خانه شما
          </p>
        </div>
      </section>

      {/* ==================== Search + Sort Bar (Compact) ==================== */}
      <section className="px-4 pb-3 sm:pb-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/85 backdrop-blur-xl rounded-[18px] sm:rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-1.5 sm:p-2 flex flex-row items-center gap-1.5 sm:gap-2">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="جستجو..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 sm:h-11 pr-10 sm:pr-11 pl-9 sm:pl-11 bg-stone-50/70 rounded-full text-xs sm:text-sm outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-red-400 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="پاک کردن"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="relative flex-shrink-0">
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-stone-400 pointer-events-none hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none h-10 sm:h-11 pr-3.5 sm:pr-10 pl-7 sm:pl-4 bg-stone-50/70 hover:bg-stone-100 rounded-full text-[10px] sm:text-xs font-bold text-stone-600 outline-none cursor-pointer transition-colors"
              >
                <option value="newest">جدیدترین</option>
                <option value="cheapest">ارزان‌ترین</option>
                <option value="expensive">گران‌ترین</option>
              </select>
              <ChevronDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 text-stone-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== Category Chips (Compact) ==================== */}
      <section className="px-4 pb-4 sm:pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto slim-scrollbar pb-1">
            {/* All */}
            <button
              onClick={() => setSelectedCategory(null)}
              className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold transition-all duration-300 whitespace-nowrap ${
                !selectedCategory
                  ? 'bg-[#1e5d3f] text-white shadow-[0_4px_12px_-4px_rgba(30,93,63,0.4)]'
                  : 'bg-white/85 backdrop-blur-sm text-stone-500 hover:bg-white hover:text-[#1e5d3f] shadow-sm'
              }`}
            >
              <Hash className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              همه
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  !selectedCategory
                    ? 'bg-white/20'
                    : 'bg-stone-100 text-stone-500'
                }`}
              >
                {products.length.toLocaleString('fa-IR')}
              </span>
            </button>

            {/* Categories */}
            {categories.map((cat) => {
              const count = products.filter((p) => p.category === cat).length
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-[11px] font-bold transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-[#1e5d3f] text-white shadow-[0_4px_12px_-4px_rgba(30,93,63,0.4)]'
                      : 'bg-white/85 backdrop-blur-sm text-stone-500 hover:bg-white hover:text-[#1e5d3f] shadow-sm'
                  }`}
                >
                  {cat}
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {count.toLocaleString('fa-IR')}
                  </span>
                </button>
              )
            })}

            {/* Clear filter chip */}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-[10px] font-bold text-red-400 hover:text-red-500 bg-red-50/70 hover:bg-red-50 transition-colors whitespace-nowrap"
              >
                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                پاک کردن
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ==================== Products Grid ==================== */}
      <section className="px-4 pb-12">
        <div className="max-w-6xl mx-auto">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
                <PackageSearch className="w-5 h-5 sm:w-6 sm:h-6 text-stone-300" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-stone-800 mb-2">
                محصولی یافت نشد
              </h2>
              <p className="text-stone-400 text-[11px] sm:text-xs mb-5 sm:mb-6">
                فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید.
              </p>
              {hasActiveFilter && (
                <button
                  onClick={() => {
                    setSearch('')
                    setSelectedCategory(null)
                  }}
                  className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-bold text-[#1e5d3f] hover:text-[#153f2b] bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full transition-all"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Count + Active chips */}
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4 px-0.5">
                <p className="text-[10px] sm:text-xs text-stone-400 font-medium flex-shrink-0">
                  نمایش{' '}
                  <span className="text-stone-700 font-bold">
                    {filteredProducts.length.toLocaleString('fa-IR')}
                  </span>{' '}
                  محصول
                </p>

                {hasActiveFilter && (
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1e5d3f] bg-emerald-50 px-2 py-0.5 sm:py-1 rounded-full">
                        <Hash className="w-2.5 h-2.5" />
                        {selectedCategory}
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                    {search && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-100 px-2 py-0.5 sm:py-1 rounded-full">
                        "{search}"
                        <button
                          onClick={() => setSearch('')}
                          className="hover:text-red-400 transition-colors"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}