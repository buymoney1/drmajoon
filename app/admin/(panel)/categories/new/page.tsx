'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowRight,
  Save,
  FolderTree,
  Image as ImageIcon,
  Loader2,
  Palette,
  Sparkles,
  Check,
} from 'lucide-react'
import { createCategory } from '@/app/actions/category'

// ==================== Constants ====================
const colorOptions = [
  { value: 'primary', label: 'سبز اصلی', color: '#1e5d3f' },
  { value: 'amber', label: 'کهربایی', color: '#d97706' },
  { value: 'red', label: 'قرمز', color: '#dc2626' },
  { value: 'blue', label: 'آبی', color: '#2563eb' },
  { value: 'purple', label: 'بنفش', color: '#9333ea' },
  { value: 'pink', label: 'صورتی', color: '#db2777' },
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

// ==================== Color Picker ====================
function ColorPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
      {colorOptions.map((color) => {
        const isActive = value === color.value
        return (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={`group relative p-2.5 rounded-2xl transition-all duration-300 ${
              isActive
                ? 'bg-emerald-50/60 shadow-[0_4px_16px_-6px_rgba(30,93,63,0.2)]'
                : 'hover:bg-stone-50/80'
            }`}
          >
            <div
              className={`relative w-full h-10 rounded-xl mb-2 transition-transform duration-300 ${
                isActive ? 'scale-105' : 'group-hover:scale-105'
              }`}
              style={{
                backgroundColor: color.color,
                boxShadow: isActive
                  ? `0 6px 16px -4px ${color.color}80`
                  : 'none',
              }}
            >
              {isActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-sm">
                    <Check
                      className="w-3 h-3"
                      strokeWidth={4}
                      style={{ color: color.color }}
                    />
                  </div>
                </div>
              )}
            </div>
            <p
              className={`text-[10px] font-bold text-center transition-colors ${
                isActive ? 'text-[#153f2b]' : 'text-stone-500'
              }`}
            >
              {color.label}
            </p>
          </button>
        )
      })}
    </div>
  )
}

// ==================== Main ====================
export default function NewCategoryPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [selectedColor, setSelectedColor] = useState('primary')

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await createCategory(formData)
      if (result?.error) {
        toast.error(result.error)
        setIsSubmitting(false)
      } else {
        toast.success('دسته‌بندی با موفقیت اضافه شد')
      }
    } catch {
      toast.error('خطا در افزودن دسته‌بندی')
      setIsSubmitting(false)
    }
  }

  return (
    <div dir="rtl" className="max-w-3xl">
      {/* ==================== Header ==================== */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link
          href="/admin/categories"
          className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] hover:bg-white transition-all shadow-sm"
          title="بازگشت"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-sm">
              <FolderTree className="w-5 h-5 text-[#1e5d3f]" />
            </div>
            <DecorativeCircle
              size={20}
              className="absolute -top-1.5 -right-2 text-[#e6b741]/60"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              افزودن دسته‌بندی جدید
            </h1>
            <p className="text-[11px] sm:text-xs text-stone-400 font-medium">
              دسته‌بندی برای سازماندهی محصولات
            </p>
          </div>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* ==================== Main Info ==================== */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6 space-y-5">
          <h2 className="font-black text-sm text-stone-800 pb-3 border-b border-stone-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            اطلاعات اصلی
          </h2>

          {/* Name */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-2">
              نام دسته‌بندی <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="مثلاً: قارچ‌های دارویی"
              className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-2">
              توضیحات
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="توضیح کوتاه درباره این دسته‌بندی..."
              className="w-full px-4 py-3 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {/* Order */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-2">
                ترتیب نمایش
              </label>
              <input
                name="order"
                type="number"
                defaultValue={0}
                min={0}
                placeholder="0"
                className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm font-mono"
                dir="ltr"
              />
              <p className="text-[10px] text-stone-400 mt-2 font-medium">
                عدد کوچکتر = نمایش زودتر
              </p>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-2">
                آیکون{' '}
                <span className="text-stone-400 font-medium">(اختیاری)</span>
              </label>
              <input
                name="icon"
                type="text"
                placeholder="مثلاً: Leaf"
                className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm font-mono"
                dir="ltr"
              />
              <p className="text-[10px] text-stone-400 mt-2 font-medium">
                نام آیکون از Lucide React
              </p>
            </div>
          </div>
        </div>

        {/* ==================== Color Theme ==================== */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6">
          <h2 className="font-black text-sm text-stone-800 pb-3 border-b border-stone-100 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            رنگ تم
          </h2>

          <input type="hidden" name="color" value={selectedColor} />
          <ColorPicker value={selectedColor} onChange={setSelectedColor} />
        </div>

        {/* ==================== Image ==================== */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6">
          <h2 className="font-black text-sm text-stone-800 pb-3 border-b border-stone-100 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            تصویر دسته‌بندی
          </h2>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-2">
              آدرس تصویر (URL)
            </label>
            <input
              name="image"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm font-mono"
              dir="ltr"
            />

            {imageUrl && (
              <div className="mt-4 relative w-full h-48 sm:h-56 rounded-[20px] overflow-hidden bg-stone-100 shadow-sm">
                <img
                  src={imageUrl}
                  alt="پیش‌نمایش"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}

            <div className="flex items-center gap-2 mt-3 text-[10px] text-stone-400 font-medium">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>اگر خالی باشد، از آیکون پیش‌فرض استفاده می‌شود.</span>
            </div>
          </div>
        </div>

        {/* ==================== Actions ==================== */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative inline-flex items-center gap-2 overflow-hidden text-white px-6 py-3 rounded-full text-xs font-bold transition-all active:scale-[0.98] bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)] hover:shadow-[0_10px_25px_-8px_rgba(30,93,63,0.7)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                <span className="relative z-10">در حال ذخیره...</span>
              </>
            ) : (
              <>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <Save className="w-4 h-4 relative z-10" />
                <span className="relative z-10">ذخیره دسته‌بندی</span>
              </>
            )}
          </button>

          <Link
            href="/admin/categories"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            انصراف
          </Link>
        </div>
      </form>
    </div>
  )
}