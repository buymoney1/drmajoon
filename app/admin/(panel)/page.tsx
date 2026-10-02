import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Package,
  FileText,
  ShoppingCart,
  TrendingUp,
  FlaskConical,
  FolderTree,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Truck,
  Sparkles,
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

// ==================== Status Card ====================
function StatusCard({
  icon: Icon,
  label,
  value,
}: {
  icon: any
  label: string
  value: number
}) {
  return (
    <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-4 flex items-center gap-3.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_-10px_rgba(30,93,63,0.12)]">
      <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-[#1e5d3f]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-stone-400 font-medium mb-0.5">
          {label}
        </p>
        <p className="text-lg font-black text-stone-800">
          {value.toLocaleString('fa-IR')}
        </p>
      </div>
    </div>
  )
}

// ==================== Order Status Badge ====================
function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: 'در انتظار پرداخت',
      className: 'bg-amber-50 text-amber-700',
    },
    PAID: {
      label: 'پرداخت شده',
      className: 'bg-emerald-50 text-[#1e5d3f]',
    },
    SHIPPED: {
      label: 'ارسال شده',
      className: 'bg-sky-50 text-sky-700',
    },
    DELIVERED: {
      label: 'تحویل داده شده',
      className: 'bg-stone-100 text-stone-600',
    },
  }
  const info = map[status] || map.PENDING
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${info.className}`}
    >
      {info.label}
    </span>
  )
}

// ==================== Main Dashboard ====================
export default async function AdminDashboard() {
  const [
    productsCount,
    ordersCount,
    articlesCount,
    mixItemsCount,
    categoriesCount,
    pendingOrders,
    paidOrders,
    shippedOrders,
    recentOrders,
    totalRevenue,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.article.count(),
    prisma.mixItem.count(),
    prisma.category.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.count({ where: { status: 'PAID' } }),
    prisma.order.count({ where: { status: 'SHIPPED' } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.order.aggregate({
      where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      _sum: { totalPrice: true },
    }),
  ])

  const stats = [
    {
      label: 'کل محصولات',
      value: productsCount,
      icon: Package,
      href: '/admin/products',
    },
    {
      label: 'دسته‌بندی‌ها',
      value: categoriesCount,
      icon: FolderTree,
      href: '/admin/categories',
    },
    {
      label: 'آیتم‌های معجون',
      value: mixItemsCount,
      icon: FlaskConical,
      href: '/admin/mix-items',
    },
    {
      label: 'کل سفارشات',
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

  return (
    <div dir="rtl" className="relative">
      {/* ===== Header ===== */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <DecorativeCircle
            size={22}
            className="text-[#e6b741]/60 hidden sm:block"
          />
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            داشبورد مدیریت
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-400 font-medium">
          خلاصه‌ای از وضعیت فروشگاه شما
        </p>
      </div>

      {/* ===== Stats Grid ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-10px_rgba(30,93,63,0.15)] overflow-hidden"
            >
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/0 to-emerald-50/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="relative">
                <div className="flex items-start justify-between mb-3.5">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-emerald-50 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105">
                    <Icon className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-[#1e5d3f]" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-[#1e5d3f] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium mb-1">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-2xl font-black text-stone-800">
                  {stat.value.toLocaleString('fa-IR')}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ===== Revenue & Status ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {/* Revenue Card */}
        <div className="lg:col-span-2 relative bg-gradient-to-br from-[#1e5d3f] to-[#153f2b] text-white rounded-[24px] p-6 sm:p-8 overflow-hidden shadow-[0_8px_30px_-8px_rgba(30,93,63,0.4)]">
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-56 h-56 bg-[#e6b741]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-emerald-100/70 text-[11px] font-medium mb-1">
                  درآمد کل
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl sm:text-4xl font-black">
                    {(totalRevenue._sum.totalPrice || 0).toLocaleString(
                      'fa-IR'
                    )}
                  </p>
                  <span className="text-sm text-emerald-100/70 font-medium">
                    تومان
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-md">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-5 border-t border-white/15">
              <div>
                <p className="text-emerald-100/60 text-[10px] font-medium mb-1">
                  در انتظار
                </p>
                <p className="text-xl sm:text-2xl font-black">
                  {pendingOrders.toLocaleString('fa-IR')}
                </p>
              </div>
              <div>
                <p className="text-emerald-100/60 text-[10px] font-medium mb-1">
                  پرداخت شده
                </p>
                <p className="text-xl sm:text-2xl font-black">
                  {paidOrders.toLocaleString('fa-IR')}
                </p>
              </div>
              <div>
                <p className="text-emerald-100/60 text-[10px] font-medium mb-1">
                  ارسال شده
                </p>
                <p className="text-xl sm:text-2xl font-black">
                  {shippedOrders.toLocaleString('fa-IR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="space-y-3">
          <StatusCard
            icon={Clock}
            label="در انتظار پرداخت"
            value={pendingOrders}
          />
          <StatusCard
            icon={CheckCircle2}
            label="پرداخت شده"
            value={paidOrders}
          />
          <StatusCard icon={Truck} label="ارسال شده" value={shippedOrders} />
        </div>
      </div>

      {/* ===== Recent Orders ===== */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-stone-100">
          <div>
            <h2 className="font-black text-sm sm:text-base text-stone-800">
              آخرین سفارشات
            </h2>
            <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium mt-0.5">
              ۵ سفارش اخیر
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="group inline-flex items-center gap-1.5 text-[11px] font-bold text-[#1e5d3f] hover:text-[#153f2b] bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-full transition-all"
          >
            مشاهده همه
            <ArrowUpRight className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-6 h-6 text-stone-300" />
            </div>
            <p className="text-xs text-stone-400 font-medium">
              هنوز سفارشی ثبت نشده است
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-right min-w-[600px]">
              <thead>
                <tr className="text-[10px] text-stone-400 font-bold bg-stone-50/50">
                  <th className="py-3 px-5 font-bold">مشتری</th>
                  <th className="py-3 px-5 font-bold">شماره تماس</th>
                  <th className="py-3 px-5 font-bold">مبلغ</th>
                  <th className="py-3 px-5 font-bold">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-stone-100/80 hover:bg-emerald-50/30 transition-colors"
                  >
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-xs text-stone-800">
                        {order.customerName}
                      </p>
                    </td>
                    <td
                      className="py-3.5 px-5 text-xs text-stone-500 font-medium"
                      dir="ltr"
                    >
                      {order.phone}
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-xs text-[#153f2b]">
                          {order.totalPrice.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          تومان
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5">
                      <OrderStatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}