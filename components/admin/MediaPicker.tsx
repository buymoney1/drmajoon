'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import {
  Image as ImageIcon,
  X,
  Check,
  Search,
  Sparkles,
} from 'lucide-react'

// ==================== Types ====================
type Media = {
  id: string
  url: string
  originalName: string
}

// ==================== Decorative SVG ====================
function DecorativeCircle({
  className = '',
  size = 20,
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

// ==================== Main ====================
export default function MediaPicker({
  media,
  onSelect,
  onClose,
  selectedUrl,
}: {
  media: Media[]
  onSelect: (url: string) => void
  onClose: () => void
  selectedUrl?: string
}) {
  const [search, setSearch] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEsc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted])

  const filtered = media.filter((m) =>
    m.originalName.toLowerCase().includes(search.toLowerCase())
  )

  if (!mounted) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      dir="rtl"
    >
      <div
        className="bg-white rounded-[24px] shadow-2xl shadow-black/20 max-w-4xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-sm">
                <ImageIcon className="w-4 h-4 text-[#1e5d3f]" />
              </div>
              <DecorativeCircle
                size={16}
                className="absolute -top-1 -right-1.5 text-[#e6b741]/60"
              />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900">
                کتابخانه رسانه
              </h3>
              <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                {media.length.toLocaleString('fa-IR')} تصویر موجود
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-50 hover:bg-stone-100 flex items-center justify-center text-stone-500 transition-colors active:scale-95"
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search */}
        {media.length > 0 && (
          <div className="px-5 pt-4">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
              <input
                type="text"
                placeholder="جستجو در نام فایل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pr-10 pl-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
          {media.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-6 h-6 text-stone-300" />
              </div>
              <p className="text-xs text-stone-400 font-medium">
                هنوز تصویری آپلود نشده است
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-stone-300" />
              </div>
              <p className="text-xs text-stone-400 font-medium">
                تصویری با این نام پیدا نشد
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map((item) => {
                const isSelected = selectedUrl === item.url
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelect(item.url)}
                    className={`group relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                      isSelected
                        ? 'ring-2 ring-[#1e5d3f] ring-offset-2 shadow-[0_8px_20px_-8px_rgba(30,93,63,0.4)]'
                        : 'hover:shadow-[0_8px_20px_-8px_rgba(30,93,63,0.2)]'
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt={item.originalName}
                      fill
                      sizes="150px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />

                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent transition-opacity duration-300 ${
                        isSelected
                          ? 'opacity-100'
                          : 'opacity-0 group-hover:opacity-100'
                      }`}
                    />

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#1e5d3f] rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/40">
                        <Check
                          className="w-3.5 h-3.5 text-white"
                          strokeWidth={3}
                        />
                      </div>
                    )}

                    <div className="absolute bottom-2 inset-x-2">
                      <p className="text-[9px] font-bold text-white truncate text-right">
                        {item.originalName}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[10px] text-stone-400 font-medium">
            <Sparkles className="w-3 h-3 text-[#e6b741]" />
            برای انتخاب، روی تصویر کلیک کنید
          </div>
          {selectedUrl && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#1e5d3f] bg-emerald-50 px-2.5 py-1 rounded-full">
              <Check className="w-3 h-3" strokeWidth={3} />
              تصویر انتخاب شده
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}