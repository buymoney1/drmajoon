import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowRight,
  User,
  Phone,
  MapPin,
  Building2,
  Users,
  Sparkles,
  ShoppingCart,
  TrendingUp,
  Calendar,
  ChevronLeft,
} from 'lucide-react'

function DecorativeCircle({ className = '', size = 24 }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" className="opacity-40" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" className="opacity-60" />
    </svg>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: { label: 'در انتظار', className: 'bg-amber-50 text-amber-700' },
    PAID: { label: 'پرداخت شده', className: 'bg-emerald-50 text-[#1e5d3f]' },
    SHIPPED: { label: 'ارسال شده', className: 'bg-sky-50 text-sky-700' },
    DELIVERED: { label: 'تحویل داده شده', className: 'bg-stone-100 text-stone-600' },
  }
  const info = map[status] || map.PENDING
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${info.className}`}>
      {info.label}
    </span>
  )
}

function InfoRow({ icon: Icon, label, value, mono = false, dir }: any) {
  return (
    <div className="flex items-start gap-2.5 py-2">
      {Icon && (
        <div className="w-7 h-7 rounded-lg bg-stone-50 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon className="w-3.5 h-3.5 text-stone-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-stone-400 font-medium mb-0.5">{label}</p>
        <p className={`text-xs font-bold text-stone-700 break-words ${mono ? 'font-mono' : ''}`} dir={dir}>
          {value}
        </p>
      </div>
    </div>
  )
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      },
    },
  })

  if (!customer) notFound()

  const avgOrderValue = customer.totalOrders > 0
    ? Math.round(customer.totalSpent / customer.totalOrders)
    : 0

  return (
    <div dir="rtl" className="relative max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link
          href="/admin/customers"
          className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] hover:bg-white transition-all shadow-sm flex-shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center shadow-sm">
              <span className="font-black text-base text-[#1e5d3f]">{customer.name[0]}</span>
            </div>
            <DecorativeCircle size={18} className="absolute -top-1 -right-1 text-[#e6b741]/60" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900 line-clamp-1">{customer.name}</h1>
            <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium flex items-center gap-1.5 mt-0.5" dir="ltr">
              <Phone className="w-3 h-3" />
              {customer.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-3.5 h-3.5 text-[#1e5d3f]" />
            </div>
            <p className="text-[10px] text-stone-400 font-medium">سفارشات</p>
          </div>
          <p className="text-lg font-black text-stone-800">{customer.totalOrders.toLocaleString('fa-IR')}</p>
        </div>

        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-[#1e5d3f]" />
            </div>
            <p className="text-[10px] text-stone-400 font-medium">خرید کل</p>
          </div>
          <p className="text-sm font-black text-stone-800 truncate">
            {customer.totalSpent.toLocaleString('fa-IR')}
          </p>
        </div>

        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#1e5d3f]" />
            </div>
            <p className="text-[10px] text-stone-400 font-medium">میانگین سفارش</p>
          </div>
          <p className="text-sm font-black text-stone-800 truncate">
            {avgOrderValue.toLocaleString('fa-IR')}
          </p>
        </div>

        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-[#1e5d3f]" />
            </div>
            <p className="text-[10px] text-stone-400 font-medium">آخرین خرید</p>
          </div>
          <p className="text-xs font-black text-stone-800 truncate">
            {customer.lastOrderAt
              ? new Date(customer.lastOrderAt).toLocaleDateString('fa-IR', {
                  month: 'short',
                  day: 'numeric',
                })
              : '—'}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 mb-5">
        <h2 className="font-black text-sm text-stone-800 pb-3 border-b border-stone-100 mb-3 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
          اطلاعات تماس
        </h2>
        <InfoRow icon={Phone} label="شماره تماس" value={customer.phone} mono dir="ltr" />
        <InfoRow icon={MapPin} label="استان / شهر" value={`${customer.province} — ${customer.city}`} />
        <InfoRow icon={Building2} label="آدرس" value={customer.address} />
        {customer.postalCode && (
          <InfoRow icon={Building2} label="کد پستی" value={customer.postalCode} mono dir="ltr" />
        )}
        {customer.note && (
          <div className="mt-3 pt-3 border-t border-stone-100">
            <p className="text-[10px] font-black text-stone-700 mb-1">یادداشت</p>
            <p className="text-[11px] text-stone-500 leading-relaxed bg-amber-50/60 rounded-xl p-3">
              {customer.note}
            </p>
          </div>
        )}
      </div>

      {/* Orders History */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h2 className="font-black text-sm text-stone-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            تاریخچه سفارشات
          </h2>
          <span className="text-[10px] font-bold text-[#1e5d3f] bg-emerald-50 px-2.5 py-1 rounded-full">
            {customer.orders.length.toLocaleString('fa-IR')} سفارش
          </span>
        </div>

        {customer.orders.length === 0 ? (
          <p className="text-center text-xs text-stone-400 py-8">هنوز سفارشی ثبت نشده</p>
        ) : (
          <div className="space-y-2.5">
            {customer.orders.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="group flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-stone-50/70 hover:bg-emerald-50/60 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <ShoppingCart className="w-4 h-4 text-[#1e5d3f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-800 mb-0.5">
                      {order.items.length.toLocaleString('fa-IR')} آیتم •{' '}
                      {order.totalPrice.toLocaleString('fa-IR')} تومان
                    </p>
                    <p className="text-[10px] text-stone-400 font-medium">
                      {new Date(order.createdAt).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <OrderStatusBadge status={order.status} />
                  <ChevronLeft className="w-3.5 h-3.5 text-stone-400 group-hover:text-[#1e5d3f] group-hover:-translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}