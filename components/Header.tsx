'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Leaf, ShoppingBag, User, Search, Menu, X } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useState, useEffect } from 'react'

export default function Header() {
  const { getTotalCount } = useCart()
  const totalCount = getTotalCount()
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'خانه' },
    { href: '/shop', label: 'فروشگاه' },
    { href: '/custom-mix', label: 'معجون اختصاصی' },
    { href: '/articles', label: 'مقالات' },
  ]

  // بستن منو در تغییر مسیر
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // بستن با Escape + قفل اسکرول
  useEffect(() => {
    if (!mobileOpen) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-4 py-3 sm:py-4">
      <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] rounded-[20px] sm:rounded-full border border-stone-200/50 overflow-hidden">
        {/* ===== Main Bar ===== */}
        <div className="px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
            {/* ===== Logo ===== */}
            <Link
              href="/"
              className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0 group min-w-0"
              onClick={() => setMobileOpen(false)}
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl flex items-center justify-center border border-emerald-100 shadow-sm transition-transform group-hover:scale-105 flex-shrink-0">
                <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e5d3f]" />
              </div>
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-black text-xs sm:text-sm text-[#1e5d3f] whitespace-nowrap">
                  دکتر معجون
                </span>
                <span className="hidden sm:block text-[9px] sm:text-[10px] text-stone-400 font-medium whitespace-nowrap">
                  طبیعت، سلامت، زندگی
                </span>
              </div>
            </Link>

            {/* ===== Desktop Nav (md+) ===== */}
            <nav className="hidden md:flex items-center gap-1 bg-stone-50/70 rounded-full px-1.5 py-1 border border-stone-100">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3.5 lg:px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                      isActive
                        ? 'bg-[#1e5d3f] text-white shadow-sm'
                        : 'text-stone-600 hover:text-[#1e5d3f] hover:bg-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </nav>

            {/* ===== Actions ===== */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <button
                className="hidden sm:flex items-center justify-center w-9 h-9 text-stone-500 hover:text-[#1e5d3f] hover:bg-emerald-50 rounded-full transition-colors"
                aria-label="جستجو"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link
                href="/cart"
                className="relative flex items-center justify-center w-9 h-9 text-stone-500 hover:text-[#1e5d3f] hover:bg-emerald-50 rounded-full transition-colors"
                aria-label="سبد خرید"
              >
                <ShoppingBag className="w-4 h-4" />
                {totalCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[1.1rem] h-[1.1rem] px-1 bg-[#e6b741] text-[#0F1F18] text-[9px] rounded-full flex items-center justify-center font-black shadow-sm">
                    {totalCount.toLocaleString('fa-IR')}
                  </span>
                )}
              </Link>

              <Link
                href="/admin/login"
                className="hidden sm:flex items-center justify-center w-9 h-9 text-stone-500 hover:text-[#1e5d3f] hover:bg-emerald-50 rounded-full transition-colors"
                aria-label="حساب کاربری"
              >
                <User className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden flex items-center justify-center w-9 h-9 text-stone-500 hover:text-[#1e5d3f] hover:bg-emerald-50 rounded-full transition-colors"
                aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'}
                aria-expanded={mobileOpen}
              >
                {mobileOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ===== Mobile Nav Dropdown ===== */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-stone-100 px-2 py-2 flex flex-col gap-0.5 animate-in slide-in-from-top-2 fade-in duration-200">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-[#1e5d3f]'
                      : 'text-stone-600 hover:text-[#1e5d3f] hover:bg-emerald-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1e5d3f]" />
                  )}
                </Link>
              )
            })}

            <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center gap-1">
              <Link
                href="/admin/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-[#1e5d3f] hover:bg-emerald-50 transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                حساب کاربری
              </Link>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-stone-600 hover:text-[#1e5d3f] hover:bg-emerald-50 transition-colors"
                aria-label="جستجو"
              >
                <Search className="w-3.5 h-3.5" />
                جستجو
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}