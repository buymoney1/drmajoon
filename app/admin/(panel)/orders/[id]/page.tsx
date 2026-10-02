import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  User,
  Phone,
  MapPin,
  Package,
  Hash,
  Calendar,
  CreditCard,
  Building2,
  ShoppingCart,
  Scale,
  Sparkles,
  ExternalLink,
  StickyNote,
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
    PENDING: { label: 'در انتظار پرداخت', className: 'bg-amber-50 text-amber-700' },
    PAID: { label: 'پرداخت شده', className: 'bg-emerald-50 text-[#1e5d3f]' },
    SHIPPED: { label: 'ارسال شده', className: 'bg-sky-50 text-sky-700' },
    DELIVERED: { label: 'تحویل داده شده', className: 'bg-stone-100 text-stone-600' },
  }
  const info = map[status] || map.PENDING
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-[11px] font-black ${info.className}`}>
      {info.label}
    </span>
  )
}

function InfoRow({ icon: Icon, label, value, mono = false, dir }: any) {
  return (
    <div className="flex items-start gap-2.5 py-2.5">
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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true, customer: true },
  })

  if (!order) notFound()

  return (
    <div dir="rtl" className="relative max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link
          href="/admin/orders"
          className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] hover:bg-white transition-all shadow-sm flex-shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-5 h-5 text-[#1e5d3f]" />
            </div>
            <DecorativeCircle size={20} className="absolute -top-1.5 -right-2 text-[#e6b741]/60" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">جزئیات سفارش</h1>
            <p className="text-[10px] sm:text-[11px] text-stone-400 font-mono line-clamp-1">{order.id}</p>
          </div>
        </div>

        <OrderStatusBadge status={order.status} />
      </div>

      {/* Customer Alert */}
      {order.customer && (
        <Link
          href={`/admin/customers/${order.customerId}`}
          className="group flex items-center justify-between gap-3 bg-gradient-to-l from-emerald-50 to-emerald-50/40 rounded-[20px] p-4 mb-5 hover:shadow-[0_8px_25px_-8px_rgba(30,93,63,0.2)] transition-all"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="font-black text-sm text-[#1e5d3f]">{order.customer.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-xs text-[#153f2b] mb-0.5">
                مشاهده پروفایل {order.customer.name}
              </p>
              <p className="text-[10px] text-stone-500 font-medium">
                {order.customer.totalOrders.toLocaleString('fa-IR')} سفارش • {order.customer.totalSpent.toLocaleString('fa-IR')} تومان خرید کل
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#1e5d3f] bg-white px-3 py-2 rounded-full flex-shrink-0 shadow-sm">
            پروفایل
            <ExternalLink className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
          </div>
        </Link>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Customer Info */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5">
          <h2 className="font-black text-sm text-stone-800 pb-3 border-b border-stone-100 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            اطلاعات مشتری
          </h2>
          <InfoRow icon={User} label="نام و نام خانوادگی" value={order.customerName} />
          <InfoRow icon={Phone} label="شماره تماس" value={order.phone} mono dir="ltr" />
          <InfoRow icon={MapPin} label="استان / شهر" value={`${order.province} — ${order.city}`} />
          <InfoRow icon={Building2} label="آدرس" value={order.address} />
          {order.postalCode && (
            <InfoRow icon={Hash} label="کد پستی" value={order.postalCode} mono dir="ltr" />
          )}
        </div>

        {/* Order Info */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5">
          <h2 className="font-black text-sm text-stone-800 pb-3 border-b border-stone-100 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            اطلاعات سفارش
          </h2>
          <InfoRow icon={Hash} label="شناسه سفارش" value={order.id} mono dir="ltr" />
          <InfoRow
            icon={Calendar}
            label="تاریخ ثبت"
            value={new Date(order.createdAt).toLocaleDateString('fa-IR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          />
          <InfoRow
            icon={CreditCard}
            label="روش پرداخت"
            value={order.paymentMethod === 'online' ? 'پرداخت آنلاین' : 'کارت به کارت'}
          />

          {order.note && (
            <div className="mt-3 pt-3 border-t border-stone-100">
              <div className="flex items-start gap-2 bg-amber-50/60 rounded-xl p-3">
                <StickyNote className="w-3.5 h-3.5 text-[#e6b741] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] font-black text-stone-700 mb-0.5">توضیحات مشتری</p>
                  <p className="text-[10px] text-stone-500 leading-relaxed">{order.note}</p>
                </div>
              </div>
            </div>
          )}

          {/* Total */}
          <div className="mt-4 pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-stone-700">مبلغ کل سفارش</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-black text-lg text-[#153f2b]">
                  {order.totalPrice.toLocaleString('fa-IR')}
                </span>
                <span className="text-[10px] text-stone-400 font-medium">تومان</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <h2 className="font-black text-sm text-stone-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            اقلام سفارش
          </h2>
          <span className="text-[10px] font-bold text-[#1e5d3f] bg-emerald-50 px-2.5 py-1 rounded-full">
            {order.items.length.toLocaleString('fa-IR')} آیتم
          </span>
        </div>

        <div className="space-y-2.5">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-3 rounded-2xl bg-stone-50/70">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-stone-800 mb-1 line-clamp-1">{item.name}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {item.weight && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full">
                      <Scale className="w-2.5 h-2.5" />
                      {item.weight} گرم
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-white px-2 py-0.5 rounded-full">
                    × {item.quantity.toLocaleString('fa-IR')}
                  </span>
                  {item.type === 'mix' && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1e5d3f] bg-emerald-50 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />
                      میکس
                    </span>
                  )}
                </div>
              </div>
              <div className="text-left flex-shrink-0">
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="font-black text-xs text-[#153f2b]">
                    {(item.price * item.quantity).toLocaleString('fa-IR')}
                  </span>
                  <span className="text-[10px] text-stone-400 font-medium">تومان</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}