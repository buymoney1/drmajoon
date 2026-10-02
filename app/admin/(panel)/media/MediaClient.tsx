'use client'

import { useState, useRef, useMemo } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  X,
  Image as ImageIcon,
  Edit3,
  Save,
  AlertCircle,
  Loader2,
  Grid3x3,
  List,
  Sparkles,
} from 'lucide-react'
import { uploadMedia, deleteMedia, updateMedia } from '@/app/actions/media'

// ==================== Types ====================
type Media = {
  id: string
  filename: string
  originalName: string
  url: string
  mimeType: string
  size: number
  alt: string | null
  createdAt: string
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

// ==================== Helper ====================
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ==================== Main ====================
export default function MediaClient({
  initialMedia,
}: {
  initialMedia: Media[]
}) {
  const [media, setMedia] = useState<Media[]>(initialMedia)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragOver, setIsDragOver] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAlt, setEditAlt] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ===== Filter =====
  const filteredMedia = useMemo(() => {
    if (!search.trim()) return media
    const q = search.toLowerCase()
    return media.filter(
      (m) =>
        m.originalName.toLowerCase().includes(q) ||
        (m.alt && m.alt.toLowerCase().includes(q))
    )
  }, [media, search])

  // ===== Upload =====
  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', '')

      try {
        const result = await uploadMedia(formData)
        if (result.success && result.media) {
          successCount++
          setMedia((prev) => [
            {
              id: result.media!.id,
              filename: result.media!.filename,
              originalName: result.media!.originalName,
              url: result.media!.url,
              mimeType: file.type,
              size: result.media!.size,
              alt: null,
              createdAt: new Date().toISOString(),
            },
            ...prev,
          ])
        } else {
          errorCount++
          toast.error(result.error || 'خطا در آپلود')
        }
      } catch {
        errorCount++
      }

      setUploadProgress(Math.round(((i + 1) / files.length) * 100))
    }

    setIsUploading(false)
    setUploadProgress(0)

    if (successCount > 0) {
      toast.success(`${successCount} فایل با موفقیت آپلود شد`)
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} فایل آپلود نشد`)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    handleUpload(e.dataTransfer.files)
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  // ===== Copy Link =====
  async function copyLink(item: Media) {
    const fullUrl = `${window.location.origin}${item.url}`
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopiedId(item.id)
      toast.success('لینک تصویر کپی شد')
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      toast.error('خطا در کپی لینک')
    }
  }

  // ===== Delete =====
  async function handleDelete(id: string) {
    try {
      const result = await deleteMedia(id)
      if (result.error) {
        toast.error(result.error)
        return
      }
      setMedia((prev) => prev.filter((m) => m.id !== id))
      setSelectedIds((prev) => prev.filter((i) => i !== id))
      setDeleteConfirm(null)
      toast.success('تصویر حذف شد')
    } catch {
      toast.error('خطا در حذف')
    }
  }

  // ===== Bulk Delete =====
  async function handleBulkDelete() {
    if (selectedIds.length === 0) return
    if (!confirm(`آیا از حذف ${selectedIds.length} تصویر مطمئن هستید؟`)) return

    let successCount = 0
    for (const id of selectedIds) {
      try {
        const result = await deleteMedia(id)
        if (result.success) successCount++
      } catch {}
    }

    setMedia((prev) => prev.filter((m) => !selectedIds.includes(m.id)))
    setSelectedIds([])
    toast.success(`${successCount} تصویر حذف شد`)
  }

  // ===== Save Alt =====
  async function saveAlt(id: string) {
    const formData = new FormData()
    formData.append('alt', editAlt)

    const result = await updateMedia(id, formData)
    if (result.success) {
      setMedia((prev) =>
        prev.map((m) => (m.id === id ? { ...m, alt: editAlt } : m))
      )
      setEditingId(null)
      toast.success('ذخیره شد')
    } else {
      toast.error('خطا در ذخیره')
    }
  }

  function toggleSelectAll() {
    if (selectedIds.length === filteredMedia.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredMedia.map((m) => m.id))
    }
  }

  return (
    <div dir="rtl" className="relative max-w-6xl mx-auto">
      {/* ==================== Header ==================== */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="relative hidden sm:block">
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center shadow-sm">
              <ImageIcon className="w-4 h-4 text-[#1e5d3f]" />
            </div>
            <DecorativeCircle
              size={18}
              className="absolute -top-1 -right-1.5 text-[#e6b741]/60"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            کتابخانه رسانه
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-400 font-medium">
          {media.length.toLocaleString('fa-IR')} تصویر در کتابخانه شما
        </p>
      </div>

      {/* ==================== Uploader ==================== */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`mb-5 sm:mb-6 bg-white/85 backdrop-blur-xl rounded-[24px] p-6 sm:p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'shadow-[0_12px_35px_-10px_rgba(30,93,63,0.25)] ring-2 ring-[#1e5d3f]/30 scale-[1.01]'
            : 'shadow-[0_8px_30px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleUpload(e.target.files)}
          className="hidden"
        />

        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-[#1e5d3f] animate-spin" />
            <p className="font-black text-sm text-stone-800">
              در حال آپلود... ({uploadProgress.toLocaleString('fa-IR')}٪)
            </p>
            <div className="w-full max-w-xs bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-l from-[#2a7d57] to-[#1e5d3f] h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragOver
                  ? 'bg-[#1e5d3f] scale-110 shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)]'
                  : 'bg-gradient-to-br from-emerald-50 to-emerald-100/50'
              }`}
            >
              <Upload
                className={`w-6 h-6 sm:w-7 sm:h-7 transition-colors ${
                  isDragOver ? 'text-white' : 'text-[#1e5d3f]'
                }`}
              />
              {!isDragOver && (
                <DecorativeCircle
                  size={18}
                  className="absolute -top-1.5 -right-1.5 text-[#e6b741]/60"
                />
              )}
            </div>
            <div>
              <p className="font-black text-xs sm:text-sm text-stone-800 mb-1">
                {isDragOver
                  ? 'فایل رو رها کن!'
                  : 'تصاویر را اینجا رها کنید یا کلیک کنید'}
              </p>
              <p className="text-[10px] sm:text-xs text-stone-400 font-medium">
                JPG، PNG، WebP، GIF یا SVG — حداکثر ۵ مگابایت
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ==================== Toolbar ==================== */}
      <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-3 sm:p-4 mb-5 sm:mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
          <input
            type="text"
            placeholder="جستجو در نام فایل یا Alt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pr-10 pl-10 bg-stone-50/70 rounded-full text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
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

        {/* View Mode */}
        <div className="flex items-center gap-1 bg-stone-100/80 p-1 rounded-full flex-shrink-0 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-full transition-all ${
              viewMode === 'grid'
                ? 'bg-white text-[#1e5d3f] shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
            aria-label="نمایش شبکه‌ای"
          >
            <Grid3x3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-full transition-all ${
              viewMode === 'list'
                ? 'bg-white text-[#1e5d3f] shadow-sm'
                : 'text-stone-500 hover:text-stone-700'
            }`}
            aria-label="نمایش لیستی"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-[10px] font-bold text-[#1e5d3f] bg-emerald-50 px-2.5 py-1.5 rounded-full whitespace-nowrap">
              {selectedIds.length.toLocaleString('fa-IR')} انتخاب
            </span>
            <button
              type="button"
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 text-red-500 hover:bg-red-50 px-3 py-2 rounded-full text-[10px] font-bold transition-colors whitespace-nowrap"
            >
              <Trash2 className="w-3 h-3" />
              حذف
            </button>
          </div>
        )}

        {/* Select All */}
        {filteredMedia.length > 0 && selectedIds.length === 0 && (
          <button
            type="button"
            onClick={toggleSelectAll}
            className="text-[10px] font-bold text-[#1e5d3f] hover:text-[#153f2b] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 rounded-full transition-colors whitespace-nowrap self-end sm:self-auto flex-shrink-0"
          >
            انتخاب همه
          </button>
        )}

        {selectedIds.length > 0 &&
          selectedIds.length === filteredMedia.length && (
            <button
              type="button"
              onClick={toggleSelectAll}
              className="text-[10px] font-bold text-stone-500 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-3 py-2 rounded-full transition-colors whitespace-nowrap self-end sm:self-auto flex-shrink-0"
            >
              لغو انتخاب
            </button>
          )}
      </div>

      {/* ==================== Content ==================== */}
      {filteredMedia.length === 0 ? (
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-12 sm:p-16 text-center">
          <div className="relative inline-block mb-5">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto">
              <ImageIcon className="w-6 h-6 text-stone-300" />
            </div>
            <DecorativeCircle
              size={20}
              className="absolute -top-1.5 -right-2 text-[#e6b741]/60"
            />
          </div>
          <h2 className="text-base sm:text-lg font-black text-stone-800 mb-2">
            {search ? 'تصویری یافت نشد' : 'هنوز تصویری آپلود نشده'}
          </h2>
          <p className="text-xs text-stone-400 font-medium">
            {search
              ? 'عبارت دیگری جستجو کنید'
              : 'اولین تصویر خود را آپلود کنید تا شروع کنیم'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ==================== Grid View ==================== */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {filteredMedia.map((item) => {
            const isSelected = selectedIds.includes(item.id)
            return (
              <div
                key={item.id}
                className={`group bg-white/85 backdrop-blur-xl rounded-[20px] overflow-hidden transition-all duration-300 ${
                  isSelected
                    ? 'ring-2 ring-[#1e5d3f] ring-offset-2 shadow-[0_8px_25px_-8px_rgba(30,93,63,0.3)]'
                    : 'shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)] hover:-translate-y-1'
                }`}
              >
                {/* Image */}
                <div className="relative aspect-square bg-stone-50 overflow-hidden">
                  <Image
                    src={item.url}
                    alt={item.alt || item.originalName}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    unoptimized
                  />

                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedIds((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((i) => i !== item.id)
                          : [...prev, item.id]
                      )
                    }
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? 'bg-[#1e5d3f] shadow-lg shadow-emerald-900/30'
                        : 'bg-white/80 backdrop-blur-md hover:bg-white shadow-sm'
                    }`}
                    aria-label="انتخاب"
                  >
                    {isSelected && (
                      <Check
                        className="w-3.5 h-3.5 text-white"
                        strokeWidth={3}
                      />
                    )}
                  </button>

                  {/* Action overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/70 via-stone-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center gap-2 pb-3">
                    <button
                      type="button"
                      onClick={() => copyLink(item)}
                      className="w-9 h-9 rounded-full bg-white text-[#1e5d3f] flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg"
                      title="کپی لینک"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4" strokeWidth={3} />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(item.id)}
                      className="w-9 h-9 rounded-full bg-white text-red-500 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="font-bold text-[11px] text-stone-800 mb-1 truncate">
                    {item.originalName}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-medium">
                    <span>{formatSize(item.size)}</span>
                    <span>
                      {new Date(item.createdAt).toLocaleDateString('fa-IR', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ==================== List View ==================== */
        <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-right min-w-[700px]">
              <thead>
                <tr className="text-[10px] text-stone-400 font-bold bg-stone-50/50">
                  <th className="p-4 w-12"></th>
                  <th className="p-4 font-bold">تصویر</th>
                  <th className="p-4 font-bold">نام فایل</th>
                  <th className="p-4 font-bold">حجم</th>
                  <th className="p-4 font-bold">تاریخ</th>
                  <th className="p-4 font-bold">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((item) => {
                  const isSelected = selectedIds.includes(item.id)
                  return (
                    <tr
                      key={item.id}
                      className={`border-t border-stone-100/80 hover:bg-emerald-50/30 transition-colors ${
                        isSelected ? 'bg-emerald-50/50' : ''
                      }`}
                    >
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedIds((prev) =>
                              prev.includes(item.id)
                                ? prev.filter((i) => i !== item.id)
                                : [...prev, item.id]
                            )
                          }
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isSelected
                              ? 'bg-[#1e5d3f]'
                              : 'bg-stone-100 hover:bg-stone-200'
                          }`}
                          aria-label="انتخاب"
                        >
                          {isSelected && (
                            <Check
                              className="w-3 h-3 text-white"
                              strokeWidth={3}
                            />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden bg-stone-100 relative flex-shrink-0">
                          <Image
                            src={item.url}
                            alt={item.alt || item.originalName}
                            fill
                            sizes="56px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-xs text-stone-800 truncate max-w-xs mb-0.5">
                          {item.originalName}
                        </p>
                        {item.alt && (
                          <p className="text-[10px] text-stone-400 truncate max-w-xs font-medium">
                            Alt: {item.alt}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-[11px] text-stone-500 font-medium">
                          {formatSize(item.size)}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-stone-500 bg-stone-50 px-2.5 py-1 rounded-full">
                          {new Date(item.createdAt).toLocaleDateString(
                            'fa-IR',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => copyLink(item)}
                            className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-emerald-50 flex items-center justify-center text-stone-500 hover:text-[#1e5d3f] transition-all active:scale-95"
                            title="کپی لینک"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(item.id)
                              setEditAlt(item.alt || '')
                            }}
                            className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-sky-50 flex items-center justify-center text-stone-500 hover:text-sky-600 transition-all active:scale-95"
                            title="ویرایش Alt"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteConfirm(item.id)}
                            className="w-8 h-8 rounded-xl bg-stone-50 hover:bg-red-50 flex items-center justify-center text-stone-500 hover:text-red-500 transition-all active:scale-95"
                            title="حذف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== Delete Modal ==================== */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white rounded-[24px] shadow-2xl shadow-black/10 p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-black text-sm text-stone-900 mb-0.5">
                  حذف تصویر
                </h3>
                <p className="text-[11px] text-stone-400 font-medium">
                  این عمل قابل بازگشت نیست
                </p>
              </div>
            </div>
            <p className="text-xs text-stone-500 mb-6 leading-relaxed">
              آیا مطمئن هستید که می‌خواهید این تصویر را حذف کنید؟ فایل از
              دیسک سرور هم حذف خواهد شد.
            </p>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl text-xs font-bold transition-all active:scale-[0.98]"
              >
                حذف کن
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 py-3 rounded-2xl text-xs font-bold transition-all active:scale-[0.98]"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== Edit Alt Modal ==================== */}
      {editingId && (
        <div
          className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEditingId(null)}
        >
          <div
            className="bg-white rounded-[24px] shadow-2xl shadow-black/10 p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 bg-emerald-50 rounded-2xl flex items-center justify-center">
                <Edit3 className="w-4 h-4 text-[#1e5d3f]" />
              </div>
              <div>
                <h3 className="font-black text-sm text-stone-900 mb-0.5">
                  متن جایگزین (Alt)
                </h3>
                <p className="text-[10px] text-stone-400 font-medium">
                  برای SEO و دسترسی‌پذیری
                </p>
              </div>
            </div>

            <input
              type="text"
              value={editAlt}
              onChange={(e) => setEditAlt(e.target.value)}
              placeholder="مثلاً: قارچ جاودان در طبیعت"
              className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm mb-5"
              autoFocus
            />

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => saveAlt(editingId)}
                className="group relative flex-1 overflow-hidden text-white py-3 rounded-2xl text-xs font-bold transition-all active:scale-[0.98] bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)] inline-flex items-center justify-center gap-2"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <Save className="w-3.5 h-3.5 relative z-10" />
                <span className="relative z-10">ذخیره</span>
              </button>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-600 py-3 rounded-2xl text-xs font-bold transition-all active:scale-[0.98]"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}