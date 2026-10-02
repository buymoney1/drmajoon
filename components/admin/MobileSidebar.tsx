'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  LogOut,
  FlaskConical,
  FolderTree,
  Leaf,
  Menu,
  X,
  ChevronLeft,
  Users,
} from 'lucide-react'
import { logoutAdmin } from '@/app/actions/auth'

const menuItems = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: FolderTree },
  { href: '/admin/mix-items', label: 'آیتم‌های معجون', icon: FlaskConical },
  { href: '/admin/orders', label: 'سفارشات', icon: ShoppingCart },
  { href: '/admin/customers', label: 'مشتریان (CRM)', icon: Users },
  { href: '/admin/articles', label: 'مقالات', icon: FileText },
]

export default function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // بستن Drawer در تغییر مسیر
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // قفل اسکرول + بستن با Escape
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsOpen(false)
      }
      document.addEventListener('keydown', handleEsc)
      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEsc)
      }
    }
  }, [isOpen])

  return (
    <>
      {/* ==================== Top Bar (Mobile) ==================== */}
 {/* ==================== Top Bar (Mobile) ==================== */}
<header className="lg:hidden fixed top-0 inset-x-0 z-40 px-3 pt-4 pb-3">
  <div className="bg-white/85 backdrop-blur-xl rounded-full shadow-lg shadow-black/[0.03] px-3 py-2 flex items-center justify-between border border-stone-200/50">
    {/* Logo */}
    <Link
      href="/"
      className="flex items-center gap-2.5"
      onClick={() => setIsOpen(false)}
    >
      <div className="w-9 h-9 bg-gradient-to-br from-[#1e5d3f] to-[#2a7d57] rounded-xl flex items-center justify-center shadow-sm">
        <Leaf className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-black text-[11px] text-stone-900">
          دکتر معجون
        </span>
        <span className="text-[9px] text-stone-400 font-medium">
          پنل مدیریت
        </span>
      </div>
    </Link>

    {/* Menu Toggle */}
    <button
      onClick={() => setIsOpen(true)}
      className="w-9 h-9 rounded-full bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center text-[#1e5d3f] transition-colors active:scale-95"
      aria-label="منو"
    >
      <Menu className="w-4 h-4" />
    </button>
  </div>
</header>
      {/* ==================== Overlay ==================== */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
          aria-hidden
        />
      )}

      {/* ==================== Drawer ==================== */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 right-0 z-50 w-72 max-w-[85vw] p-3 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isOpen}
      >
        <div className="h-full flex flex-col bg-white/95 backdrop-blur-xl rounded-[24px] shadow-2xl shadow-black/10 overflow-hidden">
          {/* Header */}
          <div className="p-4 pb-3 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 flex-1"
              onClick={() => setIsOpen(false)}
            >
              <div className="w-11 h-11 bg-gradient-to-br from-[#1e5d3f] to-[#2a7d57] rounded-2xl flex items-center justify-center shadow-sm">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm text-stone-900 leading-tight">
                  دکتر معجون
                </p>
                <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                  پنل مدیریت
                </p>
              </div>
            </Link>

            <button
              onClick={() => setIsOpen(false)}
              className="w-9 h-9 rounded-full bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors active:scale-95 flex-shrink-0"
              aria-label="بستن"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 pb-3 overflow-y-auto scrollbar-hide">
            <p className="text-[10px] font-bold text-stone-400 px-3 mb-2 mt-3 tracking-wide">
              منوی اصلی
            </p>

            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-l from-emerald-50 to-emerald-50/30 shadow-[0_4px_16px_-6px_rgba(30,93,63,0.18)]'
                        : 'hover:bg-stone-50/70'
                    }`}
                  >
                    <span
                      className={`absolute right-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-l-full bg-[#1e5d3f] transition-all duration-300 ${
                        isActive
                          ? 'opacity-100 scale-y-100'
                          : 'opacity-0 scale-y-0'
                      }`}
                    />

                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isActive
                          ? 'bg-[#1e5d3f] shadow-[0_4px_10px_-2px_rgba(30,93,63,0.45)]'
                          : 'bg-stone-50 group-hover:bg-white group-hover:shadow-sm'
                      }`}
                    >
                      <Icon
                        className={`w-[18px] h-[18px] transition-colors ${
                          isActive
                            ? 'text-white'
                            : 'text-stone-500 group-hover:text-[#1e5d3f]'
                        }`}
                      />
                    </div>

                    <span
                      className={`font-bold text-xs transition-colors ${
                        isActive
                          ? 'text-[#153f2b]'
                          : 'text-stone-600 group-hover:text-[#153f2b]'
                      }`}
                    >
                      {item.label}
                    </span>

                    {isActive && (
                      <ChevronLeft className="w-3.5 h-3.5 text-[#1e5d3f] mr-auto" />
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-3 pt-2">
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-red-50/60 hover:bg-red-50 transition-all duration-300"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 bg-white shadow-sm">
                  <LogOut className="w-[18px] h-[18px] text-red-500" />
                </div>
                <span className="font-bold text-xs text-red-500">
                  خروج از حساب
                </span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  )
}