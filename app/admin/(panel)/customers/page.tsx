import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  Users,
  Sparkles,
  ChevronLeft,
  Phone,
  MapPin,
  TrendingUp,
  UserPlus,
} from 'lucide-react'

function DecorativeCircle({ className = '', size = 24 }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" className="opacity-40" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" className="opacity-60" />
    </svg>
  )
}

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { lastOrderAt: 'desc' },
  })

  const totalCustomers = customers.length
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const activeCustomers = customers.filter((c) => c.totalOrders > 1).length

  return (
    <div dir="rtl" className="relative max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative hidden sm:block">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
              <Users className="w-4 h-4 text-[#1e5d3f]" />
            </div>
            <DecorativeCircle size={18} className="absolute -top-1 -right-1.5 text-[#e6b741]/60" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">مشتریان (CRM)</h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-400 font-medium">
          مدیریت ارتباط با مشتریان و پیگیری سفارشات
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5">
        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-[#1e5d3f]" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 font-medium mb-0.5">کل مشتریان</p>
            <p className="text-lg font-black text-stone-800">{totalCustomers.toLocaleString('fa-IR')}</p>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-[#1e5d3f]" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 font-medium mb-0.5">کل فروش</p>
            <p className="text-lg font-black text-stone-800">
              {totalRevenue.toLocaleString('fa-IR')}
            </p>
          </div>
        </div>

        <div className="bg-white/85 backdrop-blur-xl rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-4 flex items-center gap-3">
          <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-[#1e5d3f]" />
          </div>
          <div>
            <p className="text-[11px] text-stone-400 font-medium mb-0.5">مشتریان وفادار</p>
            <p className="text-lg font-black text-stone-800">{activeCustomers.toLocaleString('fa-IR')}</p>
          </div>
        </div>
      </div>

      {customers.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-12 text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <UserPlus className="w-6 h-6 text-stone-300" />
          </div>
          <h2 className="text-base font-black text-stone-800 mb-2">هنوز مشتری‌ای ثبت نشده</h2>
          <p className="text-xs text-stone-400 font-medium">
            با ثبت اولین سفارش، مشتری خودکار اینجا اضافه می‌شود
          </p>
        </div>
      ) : (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto slim-scrollbar">
            <table className="w-full text-right min-w-[800px]">
              <thead>
                <tr className="text-[10px] text-stone-400 font-bold bg-stone-50/50">
                  <th className="p-4 font-bold">نام</th>
                  <th className="p-4 font-bold">تماس</th>
                  <th className="p-4 font-bold">موقعیت</th>
                  <th className="p-4 font-bold">سفارشات</th>
                  <th className="p-4 font-bold">خرید کل</th>
                  <th className="p-4 font-bold">آخرین خرید</th>
                  <th className="p-4 font-bold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-t border-stone-100/80 hover:bg-emerald-50/30 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 flex items-center justify-center flex-shrink-0">
                          <span className="font-black text-xs text-[#1e5d3f]">{customer.name[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-stone-800 line-clamp-1">{customer.name}</p>
                          {customer.tags.length > 0 && (
                            <div className="flex gap-1 mt-0.5">
                              {customer.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="text-[9px] font-bold text-[#1e5d3f] bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 font-mono" dir="ltr">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {customer.phone}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-medium">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{customer.province} — {customer.city}</span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1e5d3f] bg-emerald-50 px-2.5 py-1 rounded-full">
                        {customer.totalOrders.toLocaleString('fa-IR')} سفارش
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex items-baseline gap-1">
                        <span className="font-black text-xs text-[#153f2b]">
                          {customer.totalSpent.toLocaleString('fa-IR')}
                        </span>
                        <span className="text-[10px] text-stone-400 font-medium">تومان</span>
                      </div>
                    </td>

                    <td className="p-4">
                      {customer.lastOrderAt ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-full">
                          {new Date(customer.lastOrderAt).toLocaleDateString('fa-IR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400 font-medium">—</span>
                      )}
                    </td>

                    <td className="p-4">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="group/btn inline-flex items-center gap-1.5 bg-stone-50 hover:bg-emerald-50 text-stone-500 hover:text-[#1e5d3f] px-3 py-2 rounded-full text-[10px] font-bold transition-all active:scale-95"
                      >
                        پروفایل
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