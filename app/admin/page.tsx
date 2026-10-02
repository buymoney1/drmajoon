// src/app/admin/page.tsx

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Package,
  FileText,
  ShoppingCart,
  ArrowUpRight,
  LayoutDashboard,
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

// ==================== Stat Card ====================
function StatCard({
  label,
  value,
  icon: Icon,
  href,
}: {
  label: string
  value: number
  icon: any
  href: string
}) {
  return (
    <Link
      href={href}
      className="group relative bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)] overflow-hidden"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Icon className="w-5 h-5 text-[#1e5d3f]" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-[#1e5d3f] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-300" />
        </div>

        <p className="text-[11px] text-stone-400 font-medium mb-1.5">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-black text-stone-800">
          {value.toLocaleString('fa-IR')}
        </p>
      </div>
    </Link>
  )
}

// ==================== Nav Card ====================
function NavCard({
  title,
  icon: Icon,
  href,
}: {
  title: string
  icon: any
  href: string
}) {
  return (
    <Link
      href={href}
      className="group relative bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6 flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)] overflow-hidden"
    >
      {/* Hover gradient */}
      <div className="absolute inset-0 bg-gradient-to-l from-emerald-50/0 to-emerald-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-center gap-3.5">
        <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105">
          <Icon className="w-5 h-5 text-[#1e5d3f]" />
        </div>
        <span className="font-black text-sm text-stone-800 group-hover:text-[#153f2b] transition-colors">
          {title}
        </span>
      </div>

      <ChevronLeft className="w-4 h-4 text-stone-300 group-hover:text-[#1e5d3f] group-hover:-translate-x-0.5 transition-all relative" />
    </Link>
  )
}

// ==================== Main Dashboard ====================
export default async function AdminDashboard() {
  const [productsCount, ordersCount, articlesCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.article.count(),
  ])

  const stats = [
    {
      label: 'محصولات',
      value: productsCount,
      icon: Package,
      href: '/admin/products',
    },
    {
      label: 'سفارشات',
      value: ordersCount,
      icon: ShoppingCart,
      href: '/admin/orders',
    },
    {
      label: 'مقالات',
      value: articlesCount,
      icon: FileText,
      href: '/admin/articles',
    },
  ]

  const navCards = [
    {
      title: 'مدیریت محصولات',
      icon: Package,
      href: '/admin/products',
    },
    {
      title: 'مدیریت سفارشات',
      icon: ShoppingCart,
      href: '/admin/orders',
    },
    {
      title: 'مدیریت مقالات',
      icon: FileText,
      href: '/admin/articles',
    },
  ]

  return (
    <div dir="rtl" className="relative max-w-6xl mx-auto">
      {/* ==================== Header ==================== */}
      <div className="mb-6 sm:mb-8 mt-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative hidden sm:block">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
              <LayoutDashboard className="w-4 h-4 text-[#1e5d3f]" />
            </div>
            <DecorativeCircle
              size={18}
              className="absolute -top-1 -right-1.5 text-[#e6b741]/60"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            داشبورد مدیریت
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-400 font-medium">
          خلاصه‌ای از وضعیت فروشگاه شما
        </p>
      </div>

      {/* ==================== Stats Grid ==================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* ==================== Nav Cards ==================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {navCards.map((card) => (
          <NavCard key={card.href} {...card} />
        ))}
      </div>
    </div>
  )
}