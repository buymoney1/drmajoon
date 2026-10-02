'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowRight,
  Save,
  Image as ImageIcon,
  Package,
  AlertCircle,
  Loader2,
  Sparkles,
  Link as LinkIcon,
  Check,
  X,
  FolderOpen,
} from 'lucide-react'
import { createProduct } from '@/app/actions/product'
import MediaPicker from '@/components/admin/MediaPicker'

// ==================== Types ====================
type Category = {
  id: string
  name: string
  slug: string
  isActive: boolean
}

type Media = {
  id: string
  url: string
  originalName: string
}

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

// ==================== Image Field ====================
function ImageField({
  value,
  onChange,
  media,
}: {
  value: string
  onChange: (url: string) => void
  media: Media[]
}) {
  const [mode, setMode] = useState<'picker' | 'url'>('picker')
  const [isPickerOpen, setIsPickerOpen] = useState(false)

  return (
    <div>
      <label className="block text-[11px] font-bold text-stone-600 mb-2">
        تصویر محصول <span className="text-red-500">*</span>
      </label>

      {/* Mode Toggle */}
      <div className="flex items-center gap-2 mb-3">
        <div className="inline-flex bg-stone-100/80 p-1 rounded-full">
          <button
            type="button"
            onClick={() => setMode('picker')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              mode === 'picker'
                ? 'bg-white text-[#1e5d3f] shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            کتابخانه
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[10px] font-bold transition-all ${
              mode === 'url'
                ? 'bg-white text-[#1e5d3f] shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            <LinkIcon className="w-3 h-3" />
            لینک دستی
          </button>
        </div>
      </div>

      {/* Picker Mode */}
      {mode === 'picker' && (
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="group w-full flex items-center gap-3 p-3.5 bg-stone-50/70 hover:bg-emerald-50/60 rounded-2xl transition-all active:scale-[0.99] text-right"
        >
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 shadow-sm">
            <FolderOpen className="w-5 h-5 text-[#1e5d3f]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-xs text-stone-800 mb-0.5 group-hover:text-[#1e5d3f] transition-colors">
              انتخاب از کتابخانه رسانه
            </p>
            <p className="text-[10px] text-stone-400 font-medium">
              {media.length > 0
                ? `${media.length.toLocaleString('fa-IR')} تصویر موجود — برای انتخاب کلیک کنید`
                : 'هنوز تصویری آپلود نشده است'}
            </p>
          </div>
          {value && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-[#1e5d3f] bg-white px-2.5 py-1.5 rounded-full shadow-sm flex-shrink-0">
              <Check className="w-3 h-3" strokeWidth={3} />
              انتخاب شده
            </div>
          )}
        </button>
      )}

      {/* URL Mode */}
      {mode === 'url' && (
        <div className="relative">
          <LinkIcon className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 pointer-events-none" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full h-11 pr-10 pl-10 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm font-mono"
            dir="ltr"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-red-400 transition-colors"
              aria-label="پاک کردن"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Hidden Input */}
      <input type="hidden" name="image" value={value} required />

      {/* Preview */}
      {value && (
        <div className="mt-4 relative w-full h-48 sm:h-56 rounded-[20px] overflow-hidden bg-stone-100 shadow-sm group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="پیش‌نمایش"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              ;(e.target as HTMLImageElement).style.display = 'none'
            }}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-red-500 hover:bg-white transition-all shadow-sm"
            title="حذف تصویر"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 mt-3 text-[10px] text-stone-400 font-medium">
        <Sparkles className="w-3 h-3 text-[#e6b741]" />
        <span>
          {mode === 'picker'
            ? 'برای انتخاب تصویر، دکمه بالا را بزنید و از کتابخانه انتخاب کنید'
            : 'آدرس کامل تصویر را وارد کنید یا به حالت «کتابخانه» برگردید'}
        </span>
      </div>

      {/* Picker Modal */}
      {isPickerOpen && (
        <MediaPicker
          media={media}
          selectedUrl={value}
          onSelect={(url) => {
            onChange(url)
            setIsPickerOpen(false)
          }}
          onClose={() => setIsPickerOpen(false)}
        />
      )}
    </div>
  )
}

// ==================== Main ====================
export default function NewProductForm({
  categories,
  media = [],
}: {
  categories: Category[]
  media?: Media[]
}) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    try {
      const result = await createProduct(formData)

      if (result?.error) {
        toast.error(result.error)
        setIsSubmitting(false)
        return
      }

      toast.success('محصول با موفقیت اضافه شد')
      router.push('/admin/products')
      router.refresh()
    } catch (error: any) {
      if (error?.digest?.startsWith('NEXT_REDIRECT')) return

      console.error('createProduct error:', error)
      toast.error('خطا در افزودن محصول')
      setIsSubmitting(false)
    }
  }

  return (
    <div dir="rtl" className="max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <Link
          href="/admin/products"
          className="w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] hover:bg-white transition-all shadow-sm"
          title="بازگشت"
        >
          <ArrowRight className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-sm">
              <Package className="w-5 h-5 text-[#1e5d3f]" />
            </div>
            <DecorativeCircle
              size={20}
              className="absolute -top-1.5 -right-2 text-[#e6b741]/60"
            />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              افزودن محصول جدید
            </h1>
            <p className="text-[11px] sm:text-xs text-stone-400 font-medium">
              اطلاعات محصول را وارد کنید
            </p>
          </div>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-4 sm:space-y-5">
        {/* Main Info */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6 space-y-5">
          <h2 className="font-black text-sm text-stone-800 pb-3 border-b border-stone-100 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            اطلاعات اصلی
          </h2>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-2">
              نام محصول <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              placeholder="مثلاً: قارچ جاودان"
              className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-2">
              توضیحات
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="توضیحات کامل محصول..."
              className="w-full px-4 py-3 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm resize-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-2">
                قیمت (تومان) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                required
                min={0}
                placeholder="1500000"
                className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm font-mono tracking-wider"
                dir="ltr"
              />
              <div className="flex items-start gap-1.5 mt-2 text-[10px] text-amber-700 bg-amber-50/70 rounded-xl p-2.5">
                <Sparkles className="w-3 h-3 text-[#e6b741] flex-shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">
                  قیمت را برای <b>۱ کیلوگرم</b> وارد کنید. قیمت نهایی بر اساس
                  وزن انتخابی کاربر محاسبه می‌شود.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-2">
                دسته‌بندی <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none text-stone-700 transition-all focus:bg-white focus:shadow-sm cursor-pointer appearance-none"
              >
                <option value="">انتخاب کنید...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>

              {categories.length === 0 && (
                <div className="flex items-start gap-2 mt-2 text-[10px] text-amber-700 bg-amber-50/70 rounded-xl p-2.5">
                  <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">
                    هنوز دسته‌بندی‌ای ثبت نشده.{' '}
                    <Link
                      href="/admin/categories/new"
                      className="underline font-bold"
                    >
                      افزودن دسته‌بندی جدید
                    </Link>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Image */}
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6">
          <h2 className="font-black text-sm text-stone-800 pb-3 border-b border-stone-100 mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e6b741]" />
            تصویر محصول
          </h2>

          <ImageField value={imageUrl} onChange={setImageUrl} media={media} />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={isSubmitting || categories.length === 0 || !imageUrl}
            className="group relative inline-flex items-center gap-2 overflow-hidden text-white px-6 py-3 rounded-full text-xs font-bold transition-all active:scale-[0.98] bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)] hover:shadow-[0_10px_25px_-8px_rgba(30,93,63,0.7)] disabled:opacity-50 disabled:cursor-not-allowed"
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
                <span className="relative z-10">ذخیره محصول</span>
              </>
            )}
          </button>

          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold text-stone-500 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            انصراف
          </Link>
        </div>
      </form>
    </div>
  )
}