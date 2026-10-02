// src/components/ProductCard.tsx

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Leaf, ArrowLeft } from 'lucide-react'

// ==================== Types ====================
type Product = {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
}

// ==================== Component ====================
export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.18)] transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* ==================== Image ==================== */}
      <Link href={`/shop/${product.id}`} className="block">
        <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            unoptimized
          />

          {/* Category Badge */}
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1e5d3f] shadow-sm">
            <Leaf className="w-2.5 h-2.5" />
            {product.category}
          </span>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </Link>

      {/* ==================== Content ==================== */}
      <div className="p-4 sm:p-5">
        {/* Title */}
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-bold text-xs sm:text-sm mb-2 text-stone-800 group-hover:text-[#1e5d3f] transition-colors line-clamp-1 leading-relaxed">
            {product.name}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-[10px] sm:text-[11px] text-stone-400 line-clamp-2 mb-4 min-h-[2.4rem] leading-relaxed font-medium">
          {product.description}
        </p>

        {/* ==================== Footer ==================== */}
        <div className="flex items-center justify-between pt-3.5 border-t border-stone-100">
          {/* Price */}
          <div className="min-w-0">
            <p className="text-[10px] text-stone-400 font-medium mb-0.5">
              قیمت
            </p>
            <div className="flex items-baseline gap-1">
              <p className="font-black text-xs sm:text-sm text-[#153f2b] truncate">
                {product.price.toLocaleString('fa-IR')}
              </p>
              <span className="text-[10px] text-stone-400 font-medium flex-shrink-0">
                تومان
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={`/shop/${product.id}`}
            className="group/btn relative flex items-center justify-center gap-1.5 bg-[#1e5d3f] hover:bg-[#153f2b] text-white h-9 sm:h-10 px-3 sm:px-3.5 rounded-full text-[10px] sm:text-[11px] font-bold transition-all duration-300 shadow-[0_4px_12px_-4px_rgba(30,93,63,0.4)] hover:shadow-[0_6px_16px_-4px_rgba(30,93,63,0.5)] active:scale-95 overflow-hidden flex-shrink-0"
            title="مشاهده و خرید"
          >
            {/* Shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-out" />
            <ShoppingCart className="w-3.5 h-3.5 relative z-10" />
            <span className="hidden sm:inline relative z-10">خرید</span>
          </Link>
        </div>
      </div>
    </div>
  )
}