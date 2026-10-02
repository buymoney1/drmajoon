'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { toast } from 'sonner'
import { createOrder } from '@/app/actions/order'
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Building2,
  Truck,
  ShieldCheck,
  Loader2,
  Check,
  Sparkles,
  Copy,
  ShoppingCart,
  Lock,
  BadgeCheck,
  Award,
  Send,
  MessageCircle,
  Headphones,
  CreditCard,
  Info,
} from 'lucide-react'
import Image from 'next/image'

// ==================== Data ====================
const PROVINCES = [
  'تهران', 'البرز', 'اصفهان', 'خراسان رضوی', 'فارس', 'آذربایجان شرقی',
  'آذربایجان غربی', 'خوزستان', 'گیلان', 'مازندران', 'کرمان', 'یزد',
  'قم', 'قزوین', 'مرکزی', 'همدان', 'کرمانشاه', 'لرستان', 'گلستان',
  'اردبیل', 'زنجان', 'سمنان', 'بوشهر', 'هرمزگان', 'سیستان و بلوچستان',
  'کردستان', 'چهارمحال و بختیاری', 'کهگیلویه و بویراحمد', 'ایلام',
  'خراسان شمالی', 'خراسان جنوبی',
]

const CARD_INFO = {
  number: '6037 9975 1234 5678',
  rawNumber: '6037997512345678',
  holder: 'دکتر معجون (شرکت گیاهان دارویی)',
  bank: 'بانک ملی ایران',
}

const SUPPORT_PHONE = {
  display: '۰۲۱-۱۲۳۴۵۶۷۸',
  raw: '02112345678',
  whatsapp: '09123456789',
  whatsappDisplay: '۰۹۱۲۳۴۵۶۷۸۹',
}

// ==================== Decorative ====================
function DecorativeCircle({
  className = '',
  size = 24,
}: {
  className?: string
  size?: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3" className="opacity-40" />
      <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="2" className="opacity-60" />
    </svg>
  )
}

// ==================== Copy Button ====================
function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success(`${label} کپی شد`)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('کپی نشد، لطفاً دستی وارد کنید')
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="p-2 rounded-lg bg-white/60 hover:bg-white text-stone-500 hover:text-[#1e5d3f] transition-all active:scale-95"
      title="کپی"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-[#1e5d3f]" strokeWidth={3} />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  )
}

// ==================== Summary Item ====================
function SummaryItem({ item }: { item: any }) {
  const isMix = item.type === 'mix'
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-stone-50/70">
      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
        <Image src={item.image} alt={item.name} fill sizes="48px" className="object-cover" unoptimized />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-[11px] sm:text-xs text-stone-700 line-clamp-1">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isMix ? 'bg-emerald-50 text-[#1e5d3f]' : 'bg-amber-50 text-[#b45309]'}`}>
            {isMix ? 'میکس' : 'محصول'}
          </span>
          <span className="text-[10px] text-stone-400 font-medium">{item.quantity.toLocaleString('fa-IR')} عدد</span>
        </div>
      </div>
      <div className="text-left flex-shrink-0">
        <p className="font-black text-xs text-[#153f2b]">{(item.price * item.quantity).toLocaleString('fa-IR')}</p>
        <p className="text-[9px] text-stone-400 font-medium">تومان</p>
      </div>
    </div>
  )
}

// ==================== Trust Badge ====================
function TrustBadge({ icon: Icon, title }: any) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm">
        <Icon className="w-5 h-5 text-[#1e5d3f]" />
      </div>
      <span className="text-[9px] sm:text-[10px] font-bold text-stone-500 text-center leading-tight">{title}</span>
    </div>
  )
}

// ==================== Main ====================
export default function CheckoutClient() {
  const { cart, getTotalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [form, setForm] = useState({
    name: '',
    phone: '',
    province: '',
    city: '',
    address: '',
    postalCode: '',
    note: '',
  })

  const total = getTotalPrice()
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0)

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart')
    }
  }, [cart.length, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.phone || !form.province || !form.city || !form.address) {
      toast.error('لطفاً تمام فیلدهای اجباری را پر کنید')
      return
    }

    if (!/^09\d{9}$/.test(form.phone)) {
      toast.error('شماره تلفن نامعتبر است (مثال: ۰۹۱۲۳۴۵۶۷۸۹)')
      return
    }

    if (form.postalCode && form.postalCode.length !== 10) {
      toast.error('کد پستی باید ۱۰ رقم باشد')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createOrder({
        customerName: form.name,
        phone: form.phone,
        province: form.province,
        city: form.city,
        address: form.address,
        postalCode: form.postalCode || undefined,
        note: form.note || undefined,
        paymentMethod: 'transfer',
        totalPrice: total,
        items: cart.map((item) => ({
          productId: item.productId || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          weight: item.weight || null,
          type: item.type,
        })),
      })

      if (result?.error) {
        toast.error(result.error)
        setIsSubmitting(false)
        return
      }

      toast.success('سفارش شما با موفقیت ثبت شد! 🎉', {
        description: 'لطفاً فیش واریزی را به پشتیبانی ارسال کنید تا سفارش شما تایید شود',
        duration: 6000,
      })

      clearCart()
      setTimeout(() => router.push('/'), 3000)
    } catch (error) {
      console.error(error)
      toast.error('خطا در ثبت سفارش')
      setIsSubmitting(false)
    }
  }

  if (cart.length === 0) return null

  return (
    <div dir="rtl" className="min-h-screen bg-[#FBFBF9] relative">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.012]" style={{ backgroundImage: `radial-gradient(circle at 25% 35%, #1e5d3f 1px, transparent 1px), radial-gradient(circle at 75% 65%, #2a7d57 1px, transparent 1px)`, backgroundSize: '64px 64px' }} />
      <div className="fixed top-0 right-0 w-[60%] h-[60%] bg-[#1e5d3f]/[0.04] rounded-full blur-[150px] pointer-events-none -translate-y-1/4 translate-x-1/4" />
      <div className="fixed bottom-0 left-0 w-[50%] h-[50%] bg-[#e6b741]/[0.03] rounded-full blur-[130px] pointer-events-none translate-y-1/4 -translate-x-1/4" />

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-4 pt-6 pb-12 relative z-10">
        {/* Header */}
        <div className="mb-6">
          <Link href="/cart" className="inline-flex items-center gap-2 text-stone-500 hover:text-[#1e5d3f] text-[11px] font-bold mb-3 bg-white/70 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            بازگشت به سبد خرید
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mb-1">تکمیل خرید</h1>
          <p className="text-xs text-stone-400 font-medium">اطلاعات خود را وارد کنید تا سفارش شما ثبت شود</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 lg:gap-6">
          {/* ==================== Right Column ==================== */}
          <div className="lg:col-span-3 space-y-5">
            {/* ===== Customer Info ===== */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6">
              <h2 className="flex items-center gap-2.5 font-black text-sm text-stone-800 mb-5">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <User className="w-4 h-4 text-[#1e5d3f]" />
                </div>
                اطلاعات خریدار
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-2">
                    نام و نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="نام خود را وارد کنید"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full h-11 pr-10 pl-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-2">
                    شماره تلفن <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 pointer-events-none" />
                    <input
                      type="tel"
                      placeholder="09123456789"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
                      className="w-full h-11 pr-10 pl-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>

                {/* Province */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-2">
                    استان <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 pointer-events-none" />
                    <select
                      value={form.province}
                      onChange={(e) => setForm({ ...form, province: e.target.value })}
                      className="w-full h-11 pr-10 pl-8 bg-stone-50/70 rounded-2xl text-xs outline-none text-stone-700 appearance-none cursor-pointer focus:bg-white focus:shadow-sm"
                      required
                    >
                      <option value="">انتخاب استان...</option>
                      {PROVINCES.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-2">
                    شهر <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="نام شهر"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full h-11 pr-10 pl-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-600 mb-2">
                    آدرس کامل <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="خیابان، کوچه، پلاک، واحد"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm resize-none leading-relaxed"
                    required
                  />
                </div>

                {/* Postal Code */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-600 mb-2">
                    کد پستی <span className="text-stone-400 font-medium">(اختیاری)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="کد پستی ۱۰ رقمی"
                    value={form.postalCode}
                    onChange={(e) => setForm({ ...form, postalCode: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    className="w-full h-11 px-4 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm font-mono tracking-wider"
                    dir="ltr"
                  />
                </div>

                {/* Note */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-stone-600 mb-2">
                    توضیحات سفارش <span className="text-stone-400 font-medium">(اختیاری)</span>
                  </label>
                  <textarea
                    placeholder="اگر نکته‌ای برای ارسال یا بسته‌بندی دارید..."
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 bg-stone-50/70 rounded-2xl text-xs outline-none placeholder:text-stone-300 text-stone-700 transition-all focus:bg-white focus:shadow-sm resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* ===== Payment Method (Card to Card Only) ===== */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6">
              <h2 className="flex items-center gap-2.5 font-black text-sm text-stone-800 mb-5">
                <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-[#1e5d3f]" />
                </div>
                روش پرداخت
              </h2>

              {/* Info Alert */}
              <div className="flex items-start gap-2.5 bg-emerald-50/60 rounded-2xl p-3.5 mb-4">
                <Info className="w-4 h-4 text-[#1e5d3f] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-black text-[11px] text-[#153f2b] mb-1">
                    پرداخت فقط از طریق کارت به کارت
                  </p>
                  <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
                    مبلغ سفارش را به شماره کارت زیر واریز کنید و سپس فیش واریزی را به پشتیبانی ارسال کنید.
                  </p>
                </div>
              </div>

              {/* Card Info Card */}
              <div className="bg-gradient-to-br from-emerald-50/80 to-emerald-50/40 rounded-[20px] p-4 sm:p-5 space-y-4">
                {/* Bank + Holder */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-[#1e5d3f] to-[#2a7d57] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-900/20">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-stone-400 font-medium mb-0.5">
                      {CARD_INFO.bank}
                    </p>
                    <p className="font-black text-xs text-[#153f2b] line-clamp-1">
                      {CARD_INFO.holder}
                    </p>
                  </div>
                </div>

                {/* Card Number */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-[10px] text-stone-400 font-bold mb-2">
                    شماره کارت
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="font-mono font-black text-base sm:text-lg text-[#153f2b] tracking-wider"
                      dir="ltr"
                    >
                      {CARD_INFO.number}
                    </p>
                    <CopyButton text={CARD_INFO.rawNumber} label="شماره کارت" />
                  </div>
                </div>

                {/* Amount to pay */}
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <p className="text-[10px] text-stone-400 font-bold mb-2">
                    مبلغ قابل واریز
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="font-black text-xl text-[#153f2b]">
                      {total.toLocaleString('fa-IR')}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">تومان</span>
                  </div>
                </div>
              </div>

              {/* Support Contact Section */}
              <div className="mt-5 pt-5 border-t border-stone-100">
                <div className="flex items-start gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Send className="w-4 h-4 text-[#e6b741]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-xs text-stone-800 mb-1">
                      پس از واریز، فیش را به پشتیبانی ارسال کنید
                    </p>
                    <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
                      برای پیگیری و تایید سفارش، تصویر فیش واریزی را از طریق راه‌های زیر برای ما بفرستید
                    </p>
                  </div>
                </div>

                {/* Contact Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Phone */}
                  <a
                    href={`tel:${SUPPORT_PHONE.raw}`}
                    className="group flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50/70 hover:bg-emerald-50/60 transition-all active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Headphones className="w-4 h-4 text-[#1e5d3f]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-stone-400 font-medium mb-0.5">
                        تماس با پشتیبانی
                      </p>
                      <p
                        className="font-black text-xs text-stone-800"
                        dir="ltr"
                      >
                        {SUPPORT_PHONE.display}
                      </p>
                    </div>
                    <CopyButton text={SUPPORT_PHONE.raw} label="شماره پشتیبانی" />
                  </a>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/98${SUPPORT_PHONE.whatsapp.slice(1)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50/70 hover:bg-emerald-50/60 transition-all active:scale-[0.98]"
                  >
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-stone-400 font-medium mb-0.5">
                        ارسال فیش در واتساپ
                      </p>
                      <p
                        className="font-black text-xs text-stone-800"
                        dir="ltr"
                      >
                        {SUPPORT_PHONE.whatsappDisplay}
                      </p>
                    </div>
                    <CopyButton
                      text={SUPPORT_PHONE.whatsapp}
                      label="شماره واتساپ"
                    />
                  </a>
                </div>

                {/* Reminder */}
                <div className="flex items-start gap-2 bg-amber-50/70 rounded-xl p-3 mt-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#e6b741] flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-stone-600 font-medium leading-relaxed">
                    پس از ارسال فیش، کارشناسان ما با شما تماس می‌گیرند تا سفارش شما را تایید کنند.
                  </p>
                </div>
              </div>
            </div>

            {/* ===== Trust ===== */}
            <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-5 sm:p-6">
              <div className="flex items-center gap-2.5 mb-5">
                <DecorativeCircle size={22} className="text-[#e6b741]/60 hidden sm:block" />
                <h2 className="flex items-center gap-2.5 font-black text-sm text-stone-800">
                  <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-[#1e5d3f]" />
                  </div>
                  تضمین خرید امن
                </h2>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-5">
                <TrustBadge icon={ShieldCheck} title="پرداخت امن" />
                <TrustBadge icon={BadgeCheck} title="ضمانت اصالت" />
                <TrustBadge icon={Award} title="کیفیت برتر" />
                <TrustBadge icon={Truck} title="ارسال سریع" />
              </div>

              <div className="flex items-center gap-3 bg-emerald-50/50 rounded-2xl p-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                  <Lock className="w-5 h-5 text-[#1e5d3f]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-xs text-[#153f2b] mb-0.5">نماد اعتماد الکترونیکی</p>
                  <p className="text-[10px] text-stone-500 font-medium leading-relaxed">
                    دارای مجوز رسمی از وزارت صنعت، معدن و تجارت
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================== Left Column: Order Summary ==================== */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24 space-y-5">
              <div className="bg-white/85 backdrop-blur-xl rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] overflow-hidden">
                <div className="p-5 border-b border-stone-100 flex items-center justify-between">
                  <h2 className="flex items-center gap-2.5 font-black text-sm text-stone-800">
                    <div className="w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center">
                      <ShoppingCart className="w-3.5 h-3.5 text-[#1e5d3f]" />
                    </div>
                    سفارش شما
                  </h2>
                  <span className="text-[10px] font-bold text-[#1e5d3f] bg-emerald-50 px-2.5 py-1 rounded-full">
                    {totalItems.toLocaleString('fa-IR')} آیتم
                  </span>
                </div>

                <div className="p-4 max-h-[320px] overflow-y-auto slim-scrollbar space-y-2">
                  {cart.map((item) => (
                    <SummaryItem key={item.id} item={item} />
                  ))}
                </div>

                <div className="p-5 bg-emerald-50/40 border-t border-emerald-100/50 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-stone-500">جمع سبد</span>
                    <span className="font-bold text-stone-800">{total.toLocaleString('fa-IR')} تومان</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-medium">
                    <span className="text-stone-500">هزینه ارسال</span>
                    <span className="font-bold text-stone-400 text-[10px]">پس از تایید</span>
                  </div>
                  <div className="pt-3 border-t border-emerald-100/60 flex items-center justify-between">
                    <span className="text-xs font-black text-stone-700">مبلغ قابل پرداخت</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-black text-lg text-[#153f2b]">{total.toLocaleString('fa-IR')}</span>
                      <span className="text-[10px] text-stone-400 font-medium">تومان</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] bg-gradient-to-r from-[#2a7d57] to-[#1e5d3f] shadow-[0_8px_20px_-8px_rgba(30,93,63,0.6)] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin relative z-10" />
                    <span className="relative z-10">در حال ثبت سفارش...</span>
                  </>
                ) : (
                  <>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <ShieldCheck className="w-4 h-4 relative z-10" />
                    <span className="relative z-10">ثبت سفارش</span>
                  </>
                )}
              </button>

              {/* Reminder box */}
              <div className="flex items-start gap-2.5 bg-emerald-50/60 rounded-2xl p-3.5">
                <Sparkles className="w-4 h-4 text-[#e6b741] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
                  بعد از ثبت سفارش، فیش واریزی را به پشتیبانی ارسال کنید. کارشناسان ما با شما تماس می‌گیرند. 🌿
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}