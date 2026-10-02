import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  ShoppingCart,
  Sparkles,
  ChevronLeft,
  MapPin,
  Phone,
} from 'lucide-react'
import OrderStatusSelect from './OrderStatusSelect'

function DecorativeCircle({ className = '', size = 24 }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" className="opacity-40" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" className="opacity-60" />
    </svg>
  )
}

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { customer: true },
  })

  return (
    <div dir="rtl" className="relative max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative hidden sm:block">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
              <ShoppingCart className="w-4 h-4 text-[#1e5d3f]" />
            </div>
            <DecorativeCircle size={18} className="absolute -top-1 -right-1.5 text-[#e6b741]/60" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">مدیریت سفارشات</h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-400 font-medium">
          {orders.length.toLocaleString('fa-IR')} سفارش ثبت شده
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-12 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <ShoppingCart className="w-6 h-6 text-stone-300" />
          </div>
          <h2 className="text-base font-black text-stone-800 mb-2">هنوز سفارشی ثبت نشده</h2>
          <p className="text-xs text-stone-400 font-medium">به‌محض ثبت اولین سفارش، اینجا نمایش داده می‌شود</p>
        </div>
      ) : (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto slim-scrollbar">
            <table className="w-full text-right min-w-[900px]">
              <thead>
                <tr className="text-[10px] text-stone-400 font-bold bg-stone-50/50">
                  <th className="p-4 font-bold">مشتری</th>
                  <th className="p-4 font-bold">تماس</th>
                  <th className="p-4 font-bold">موقعیت</th>
                  <th className="p-4 font-bold">مبلغ کل</th>
                  <th className="p-4 font-bold">تاریخ</th>
                  <th className="p-4 font-bold">وضعیت</th>
                  <th className="p-4 font-bold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t border-stone-100/80 hover:bg-emerald-50/30 transition-colors group"
                  >
                    {/* Customer */}
                    <td className="p-4">
                      <Link
                        href={`/admin/customers/${order.customerId}`}
                        className="block group/name"
                      >
                        <p className="font-bold text-xs text-stone-800 mb-0.5 group-hover/name:text-[#1e5d3f] transition-colors">
                          {order.customerName}
                        </p>
                        <p className="text-[10px] text-stone-400 font-medium">
                          مشتری #{order.customer?.totalOrders || 1} — سفارش
                        </p>
                      </Link>
                    </td>

                    {/* Phone */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 font-mono" dir="ltr">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {order.phone}
                      </span>
                    </td>

                    {/* Location */}
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{order.province} — {order.city}</span>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-xs text-[#153f2b]">
                          {order.totalPrice.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">تومان</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-full">
                        {new Date(order.createdAt).toLocaleDateString('fa-IR', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="group/btn inline-flex items-center gap-1.5 bg-stone-50 hover:bg-emerald-50 text-stone-500 hover:text-[#1e5d3f] px-3 py-2 rounded-full text-[10px] font-bold transition-all active:scale-95"
                      >
                        جزئیات
                        <ChevronLeft className="w-3 h-3 group-hover/btn:-translate-x-0.5 transition-transform" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}