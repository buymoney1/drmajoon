'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileText,
  LogOut,
  Home,
  FlaskConical,
  FolderTree,
  Leaf,
  ChevronLeft,
  ImageIcon,
  Users,
} from 'lucide-react'
import { logoutAdmin } from '@/app/actions/auth'

const menuItems = [
  { href: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { href: '/admin/products', label: 'محصولات', icon: Package },
  { href: '/admin/categories', label: 'دسته‌بندی‌ها', icon: FolderTree },
  { href: '/admin/mix-items', label: 'آیتم‌های معجون', icon: FlaskConical },
  { href: '/admin/orders', label: 'سفارشات', icon: ShoppingCart },
  { href: '/admin/articles', label: 'مقالات', icon: FileText },
  { href: '/admin/customers', label: 'مشتریان (CRM)', icon: Users },
  { href: '/admin/media', label: 'کتابخانه رسانه', icon: ImageIcon },
]

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

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-72 flex-shrink-0 min-h-screen flex flex-col sticky top-0 h-screen p-3">
      <div className="flex-1 flex flex-col bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
        {/* ===== Logo ===== */}
        <div className="p-5 border-b border-stone-100/80">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                <Leaf className="w-5 h-5 text-[#1e5d3f]" />
              </div>
              <DecorativeCircle
                size={18}
                className="absolute -top-1.5 -right-2 text-[#e6b741]/60"
              />
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
        </div>

        {/* ===== Nav ===== */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-bold text-stone-400 px-3 mb-2 mt-1">
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
                  className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-l from-emerald-50 to-emerald-50/40 shadow-[0_4px_16px_-6px_rgba(30,93,63,0.2)]'
                      : 'hover:bg-stone-50/80'
                  }`}
                >
                  {/* Active accent bar */}
                  <span
                    className={`absolute right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l-full bg-[#1e5d3f] transition-all duration-300 ${
                      isActive
                        ? 'opacity-100 scale-y-100'
                        : 'opacity-0 scale-y-0'
                    }`}
                  />

                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      isActive
                        ? 'bg-[#1e5d3f] shadow-[0_4px_10px_-2px_rgba(30,93,63,0.4)]'
                        : 'bg-stone-50 group-hover:bg-white'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 transition-colors ${
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
                    <ChevronLeft className="w-3 h-3 text-[#1e5d3f] mr-auto" />
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* ===== Logout ===== */}
        <div className="p-3 border-t border-stone-100/80">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-red-500 hover:bg-red-50/70 transition-all duration-300"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-50 group-hover:bg-red-100 transition-colors">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs">خروج از حساب</span>
            </button>
          </form>
        </div>
      </div>
    </aside>
  )
}