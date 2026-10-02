'use client'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { updateOrderStatus } from '@/app/actions/order'

const statuses = [
  { value: 'PENDING', label: 'در انتظار پرداخت' },
  { value: 'PAID', label: 'پرداخت شده' },
  { value: 'SHIPPED', label: 'ارسال شده' },
  { value: 'DELIVERED', label: 'تحویل داده شده' },
]

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string
  currentStatus: string
}) {
  const [isPending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    startTransition(async () => {
      try {
        await updateOrderStatus(orderId, newStatus)
        toast.success('وضعیت سفارش به‌روزرسانی شد')
      } catch {
        toast.error('خطا در به‌روزرسانی')
      }
    })
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:border-primary focus:outline-none disabled:opacity-50"
    >
      {statuses.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  )
}