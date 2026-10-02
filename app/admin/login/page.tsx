'use client'

import { useState } from 'react'
import { loginAdmin } from '@/app/actions/auth'
import { toast } from 'sonner'
import { Leaf, Lock, User, Loader2, ShieldCheck } from 'lucide-react'

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

export default function AdminLogin() {
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    const res = await loginAdmin(formData)
    if (res?.error) {
      setError(res.error)
      toast.error(res.error)
      setIsSubmitting(false)
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex items-center justify-center bg-[#FBFBF9] p-4 relative overflow-hidden selection:bg-[#1e5d3f]/20"
    >
      {/* ===== Background Texture ===== */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.012]"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 35%, #1e5d3f 1px, transparent 1px),
                            radial-gradient(circle at 75% 65%, #2a7d57 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }}
      />

      {/* ===== Background Blurs ===== */}
      <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#1e5d3f]/[0.04] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#e6b741]/[0.03] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      {/* ===== Card ===== */}
      <div className="relative bg-white/85 backdrop-blur-xl rounded-[28px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] w-full max-w-md p-6 sm:p-8 z-10">
        {/* Header */}
        <div className="text-center mb-7 relative">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
              <Leaf className="w-7 h-7 text-[#1e5d3f]" />
            </div>
            <DecorativeCircle
              size={24}
              className="absolute -top-2 -right-3 text-[#e6b741]/50"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 mb-1">
            ورود به پنل مدیریت
          </h1>
          <p className="text-[11px] text-stone-400 font-medium">
            دکتر معجون — پنل ادمین
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-2">
              نام کاربری
            </label>
            <div className="relative">
              <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 pointer-events-none" />
              <input
                name="username"
                type="text"
                required
                placeholder="admin"
                className="w-full h-11 pr-10 pl-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
                dir="ltr"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-2">
              رمز عبور
            </label>
            <div className="relative">
              <Lock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 pointer-events-none" />
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full h-11 pr-10 pl-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
                dir="ltr"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-[11px] font-bold p-3 rounded-2xl text-center">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="group relative w-full overflow-hidden text-white py-3.5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)] hover:shadow-[0_10px_25px_-8px_rgba(30,93,63,0.7)] disabled:opacity-70 mt-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                <span className="relative z-10">در حال ورود...</span>
              </>
            ) : (
              <>
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
                <ShieldCheck className="w-4 h-4 relative z-10" />
                <span className="relative z-10">ورود به پنل</span>
              </>
            )}
          </button>
        </form>

        {/* Footer note */}
        <div className="mt-6 pt-5 border-t border-stone-100 flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-medium">
          <Lock className="w-3 h-3" />
          ورود شما امن و رمزنگاری شده است
        </div>
      </div>
    </div>
  )
}