// src/app/page.tsx


import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import {
  ArrowLeft,
  Sparkles,
  Leaf,
  Award,
  Truck,
  ShieldCheck,
  Star,
  Users,
  Package,
  FlaskConical,
  Heart,
  BookOpen,
  Clock,
  ChevronDown,
  Quote,
  Check,
  Plus,
  Minus,
  MessageCircle,
  TrendingUp,
  MapPin,
} from 'lucide-react'

// ==================== Decorative SVG ====================
function DecorativeLine({ className = '' }: { className?: string }) {
  return (
    <svg
      width="80"
      height="6"
      viewBox="0 0 80 6"
      fill="none"
      className={className}
    >
      <path
        d="M0,3 Q20,6 40,3 Q60,0 80,3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        className="opacity-40"
      />
    </svg>
  )
}

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

// ==================== Section Header ====================
function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlighted,
  description,
  href,
}: {
  badge?: string
  badgeIcon?: any
  title: string
  highlighted?: string
  description?: string
  href?: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
      <div className="min-w-0">
        {badge && BadgeIcon && (
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/70 backdrop-blur-sm border border-emerald-100/60 rounded-full shadow-sm mb-3 sm:mb-4">
            <BadgeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1e5d3f]" />
            <span className="text-[10px] sm:text-[11px] font-bold text-[#1e5d3f]">
              {badge}
            </span>
          </div>
        )}
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-stone-900 mb-2 leading-tight tracking-tight">
          {title}{' '}
          {highlighted && (
            <span className="relative inline-block">
              <span className="relative z-10 text-[#1e5d3f]">
                {highlighted}
              </span>
              <DecorativeLine className="absolute -bottom-1.5 right-0 text-[#1e5d3f] w-16 sm:w-20" />
            </span>
          )}
        </h2>
        {description && (
          <p className="text-stone-500 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold text-[#1e5d3f] hover:text-[#153f2b] bg-emerald-50 hover:bg-emerald-100 px-3 py-2 sm:px-3.5 rounded-full transition-all whitespace-nowrap self-start sm:self-auto flex-shrink-0"
        >
          مشاهده همه
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
        </Link>
      )}
    </div>
  )
}

// ==================== Feature Card ====================
function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any
  title: string
  description: string
}) {
  return (
    <div className="group text-center p-5 sm:p-6 md:p-8 rounded-[20px] sm:rounded-[24px] bg-white/85 backdrop-blur-xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)] hover:-translate-y-1 transition-all duration-300">
      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 shadow-sm transition-transform group-hover:scale-105">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-[#1e5d3f]" />
      </div>
      <h3 className="font-black text-sm sm:text-base md:text-lg mb-2 text-stone-900">
        {title}
      </h3>
      <p className="text-stone-500 text-[11px] sm:text-xs md:text-sm leading-relaxed">
        {description}
      </p>
    </div>
  )
}

// ==================== Stat Card ====================
function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: any
  value: string
  label: string
}) {
  return (
    <div className="text-center">
      <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto bg-white/70 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2.5 sm:mb-3 shadow-sm">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e5d3f]" />
      </div>
      <p className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 mb-1">
        {value}
      </p>
      <p className="text-[10px] sm:text-[11px] md:text-xs text-stone-400 font-medium">
        {label}
      </p>
    </div>
  )
}

// ==================== FAQ Item ====================
function FAQItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  return (
    <details className="group bg-white/85 backdrop-blur-xl rounded-[18px] sm:rounded-[20px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] overflow-hidden transition-all duration-300 open:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)]">
      <summary className="flex items-center justify-between gap-3 p-3.5 sm:p-4 md:p-5 cursor-pointer list-none">
        <span className="font-bold text-[11px] sm:text-xs md:text-sm text-stone-800 group-open:text-[#1e5d3f] transition-colors">
          {question}
        </span>
        <span className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-emerald-50 group-open:bg-[#1e5d3f] flex items-center justify-center transition-colors">
          <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1e5d3f] group-open:text-white group-open:hidden transition-all" />
          <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white hidden group-open:block transition-all" />
        </span>
      </summary>
      <div className="px-3.5 sm:px-4 md:px-5 pb-3.5 sm:pb-4 md:pb-5 text-[10px] sm:text-[11px] md:text-xs text-stone-500 leading-relaxed">
        {answer}
      </div>
    </details>
  )
}

// ==================== Page ====================
export default async function Home() {
  const [topProducts, categories, latestArticles, productsCount] =
    await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.findMany({
        where: { isActive: true },
        take: 4,
        orderBy: { order: 'asc' },
      }),
      prisma.article.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where: { isActive: true } }),
    ])

  const stats = [
    { icon: Users, value: '+۲,۰۰۰', label: 'مشتری راضی' },
    {
      icon: Package,
      value: productsCount.toLocaleString('fa-IR'),
      label: 'محصول متنوع',
    },
    { icon: FlaskConical, value: '۵۰+', label: 'ترکیب معجون' },
    { icon: Star, value: '۴.۹', label: 'امتیاز رضایت' },
  ]

  const features = [
    {
      icon: Leaf,
      title: '۱۰۰٪ طبیعی',
      description: 'تمامی ترکیبات از گیاهان دارویی اصل و بدون مواد شیمیایی',
    },
    {
      icon: Award,
      title: 'کیفیت تضمینی',
      description: 'با تاییدیه وزارت بهداشت و گواهی کیفیت بین‌المللی',
    },
    {
      icon: Truck,
      title: 'ارسال سریع',
      description: 'ارسال به تمام نقاط کشور با بسته‌بندی ویژه',
    },
  ]

  const testimonials = [
    {
      name: 'سارا محمدی',
      city: 'تهران',
      text: 'معجون اختصاصی که سفارش دادم فوق‌العاده بود. بعد از دو هفته استفاده، انرژی و تمرکزم خیلی بهتر شده.',
      rating: 5,
    },
    {
      name: 'علی رضایی',
      city: 'اصفهان',
      text: 'کیفیت قارچ‌های دارویی واقعاً باورنکردنی بود. تفاوت رو کاملاً حس کردم. بسته‌بندی هم خیلی حرفه‌ای بود.',
      rating: 5,
    },
    {
      name: 'مریم حسینی',
      city: 'شیراز',
      text: 'از اینکه می‌تونم ترکیبات معجونم رو خودم انتخاب کنم خیلی خوشم میاد. سیستم سفارش‌گذاری بسیار روانه.',
      rating: 5,
    },
  ]

  const faqs = [
    {
      question: 'معجون اختصاصی چطور ساخته می‌شه؟',
      answer:
        'شما ترکیبات مورد علاقه‌تون رو از بین ۵۰+ آیتم انتخاب می‌کنید، وزن دلخواه رو مشخص می‌کنید و ما معجون رو به‌صورت تازه براتون آماده و ارسال می‌کنیم.',
    },
    {
      question: 'ارسال چقدر طول می‌کشه؟',
      answer:
        'ارسال با پست پیشتاز انجام می‌شه و معمولاً بین ۲ تا ۵ روز کاری به دستتون می‌رسه. بسته‌بندی ویژه و محافظت‌شده‌ست.',
    },
    {
      question: 'محصولات تاییدیه دارن؟',
      answer:
        'بله، تمامی محصولات دارای تاییدیه وزارت بهداشت و گواهی کیفیت بین‌المللی هستن. اصل بودن ترکیبات تضمین شده‌ست.',
    },
    {
      question: 'امکان مرجوعی هست؟',
      answer:
        'در صورت آسیب‌دیدگی یا مغایرت با سفارش، امکان مرجوعی وجود داره. کافیه با پشتیبانی تماس بگیرید.',
    },
  ]

  const customMixSteps = [
    {
      num: '۱',
      title: 'ترکیباتت رو انتخاب کن',
      desc: 'از بین ۵۰+ آیتم طبیعی',
    },
    {
      num: '۲',
      title: 'وزن دلخواهت رو بگو',
      desc: '۲۵۰، ۵۰۰ یا ۱۰۰۰ گرم',
    },
    {
      num: '۳',
      title: 'قیمت رو لحظه‌ای ببین',
      desc: 'شفاف و بدون هزینه پنهان',
    },
    {
      num: '۴',
      title: 'درِ خونه تحویل بگیر',
      desc: 'ارسال سریع با بسته‌بندی ویژه',
    },
  ]

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#FBFBF9] selection:bg-[#1e5d3f]/20 selection:text-[#0F1F18] relative"
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

    

      {/* ==================== 1. Hero ==================== */}
      <section className="relative pt-6 pb-10 sm:pt-10 sm:pb-16 md:pt-16 md:pb-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
            {/* Text */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/70 backdrop-blur-sm border border-[#1e5d3f]/10 text-[#1e5d3f] px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold mb-5 sm:mb-6 shadow-sm">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                معجون اختصاصی خودت رو بساز
              </div>

              <h1 className="text-[1.75rem] leading-[1.2] sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-stone-900 mb-4 sm:mb-5 tracking-tight">
                سلامتی رو از دل{' '}
                <span className="relative inline-block">
                  <span className="relative z-10 text-[#1e5d3f]">طبیعت</span>
                  <DecorativeLine className="absolute -bottom-1.5 sm:-bottom-2 right-0 text-[#1e5d3f] w-16 sm:w-20" />
                </span>{' '}
                <br className="hidden sm:block" />
                به خانه‌ت بیار
              </h1>

              <p className="text-stone-500 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-lg">
                با استفاده از گیاهان دارویی اصل و ترکیبات طبیعی، معجون‌های
                اختصاصی متناسب با نیاز بدنت رو بساز و از سلامتی لذت ببر.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                <Link
                  href="/custom-mix"
                  className="group inline-flex items-center justify-center gap-2 bg-[#1e5d3f] hover:bg-[#153f2b] text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-[0_8px_20px_-6px_rgba(30,93,63,0.5)] hover:shadow-[0_10px_25px_-6px_rgba(30,93,63,0.6)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  ساخت معجون اختصاصی
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-700 hover:border-[#1e5d3f]/40 hover:text-[#1e5d3f] hover:bg-emerald-50/50 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all"
                >
                  مشاهده محصولات
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-5 mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-stone-100">
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1 space-x-reverse">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 border-2 border-white"
                      />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium mr-1">
                    +۲,۰۰۰ مشتری راضی
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#e6b741] text-[#e6b741]"
                    />
                  ))}
                  <span className="text-[10px] sm:text-[11px] text-stone-500 font-medium mr-1">
                    ۴.۹
                  </span>
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="relative aspect-[4/3] sm:aspect-[4/5] md:aspect-square max-w-md mx-auto lg:max-w-none">
                <div className="absolute -inset-4 sm:-inset-6 bg-gradient-to-br from-[#1e5d3f]/10 to-[#e6b741]/10 rounded-[2rem] sm:rounded-[3rem] blur-3xl" />

                <div className="relative w-full h-full rounded-[1.75rem] sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden border border-stone-200/80 shadow-2xl shadow-emerald-900/10 bg-stone-100">
                  <Image
                    src="/images/majoon.webp"
                    alt="گیاهان دارویی"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1F18]/30 via-transparent to-transparent" />
                </div>

                <div className="absolute top-4 right-4 sm:top-6 sm:-right-3 md:right-6 bg-white/90 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl sm:rounded-2xl shadow-lg border border-stone-100 flex items-center gap-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1e5d3f]" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-[9px] sm:text-[10px] text-stone-400 font-medium">
                      ترکیبات
                    </p>
                    <p className="text-[11px] sm:text-xs font-black text-stone-800">
                      ۱۰۰٪ طبیعی
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 2. Stats ==================== */}
      <section className="px-4 pb-10 sm:pb-12 md:pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 3. Features ==================== */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/70 backdrop-blur-sm border border-emerald-100/60 rounded-full shadow-sm mb-3 sm:mb-4">
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1e5d3f]" />
              <span className="text-[10px] sm:text-[11px] font-bold text-[#1e5d3f]">
                تعهد ما
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 mb-2 sm:mb-3">
              چرا دکتر معجون؟
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto">
              تعهد ما به سلامتی شما با کیفیت، اصالت و اعتماد
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 4. Top Products ==================== */}
      {topProducts.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="پرفروش‌ترین‌ها"
              badgeIcon={TrendingUp}
              title="محصولات"
              highlighted="پرفروش"
              description="محصولاتی که بیشترین رضایت مشتریان رو داشتن و هر روز انتخاب می‌شن"
              href="/shop"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {topProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.id}`}
                  className="group bg-white/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.18)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative aspect-[4/3] bg-stone-50 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-[#1e5d3f] shadow-sm">
                        <Leaf className="w-2.5 h-2.5" />
                        {product.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-bold text-xs sm:text-sm text-stone-800 mb-2 line-clamp-1 group-hover:text-[#1e5d3f] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-stone-400 line-clamp-2 mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                      <div className="flex items-baseline gap-1">
                        <p className="font-black text-xs sm:text-sm text-[#153f2b]">
                          {product.price.toLocaleString('fa-IR')}
                        </p>
                        <span className="text-[10px] text-stone-400 font-medium">
                          تومان
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#1e5d3f]">
                        مشاهده
                        <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 5. Categories ==================== */}
      {categories.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="دسته‌بندی‌ها"
              badgeIcon={Package}
              title="دسته‌بندی‌های"
              highlighted="محبوب"
              description="محصولات رو بر اساس دسته‌بندی مورد علاقه‌ت مرور کن"
              href="/shop"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative bg-white/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.18)] transition-all duration-300 hover:-translate-y-1 overflow-hidden p-4 sm:p-5 md:p-6"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                      <Leaf className="w-4 h-4 sm:w-5 sm:h-5 text-[#1e5d3f]" />
                    </div>
                    <DecorativeCircle
                      size={20}
                      className="text-[#e6b741]/50 hidden sm:block"
                    />
                  </div>
                  <h3 className="font-black text-xs sm:text-sm text-stone-800 mb-1 group-hover:text-[#1e5d3f] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[10px] text-stone-400 font-medium line-clamp-1">
                    {cat.description || 'مشاهده محصولات'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 6. Custom Mix Promo ==================== */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#1e5d3f] to-[#153f2b] rounded-[24px] sm:rounded-[28px] md:rounded-[32px] p-5 sm:p-8 md:p-14 overflow-hidden shadow-2xl shadow-emerald-900/20">
            {/* Decorative */}
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#e6b741]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-white/5 rounded-full blur-3xl" />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-emerald-50 px-2.5 sm:px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold mb-4 sm:mb-5">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  ساخته‌شده به دست تو
                </div>

                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4 leading-tight">
                  معجون مخصوص خودت رو بساز
                </h2>

                <p className="text-emerald-100/80 text-xs sm:text-sm md:text-base mb-5 sm:mb-7 leading-relaxed max-w-md">
                  از بین ۵۰+ ترکیب طبیعی، اون‌هایی که نیاز داری انتخاب کن، وزن
                  دلخواهت رو مشخص کن و یه معجون کاملاً منحصربه‌فرد داشته باش.
                </p>

                <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <Link
                    href="/custom-mix"
                    className="group inline-flex items-center justify-center gap-2 bg-[#e6b741] hover:bg-[#d4a635] text-[#0F1F18] px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black transition-all shadow-[0_8px_20px_-6px_rgba(230,183,65,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                  >
                    شروع کن
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all"
                  >
                    مشاهده محصولات
                  </Link>
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-2.5 sm:space-y-3">
                {customMixSteps.map((step) => (
                  <div
                    key={step.num}
                    className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 border border-white/10 transition-all hover:bg-white/15"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#e6b741] flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="font-black text-xs sm:text-sm text-[#0F1F18]">
                        {step.num}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[11px] sm:text-xs text-white mb-0.5">
                        {step.title}
                      </p>
                      <p className="text-[10px] text-emerald-100/70 font-medium">
                        {step.desc}
                      </p>
                    </div>
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#e6b741] flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== 7. Latest Articles ==================== */}
      {latestArticles.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <SectionHeader
              badge="کتابخانه یادگیری"
              badgeIcon={BookOpen}
              title="مقالات"
              highlighted="آموزشی"
              description="جدیدترین مقالات درباره گیاهان دارویی، سلامتی و سبک زندگی طبیعی"
              href="/articles"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {latestArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/articles/${article.id}`}
                  className="group bg-white/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.18)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  <div className="relative aspect-[16/10] bg-stone-50 overflow-hidden">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-emerald-50 via-emerald-100/30 to-amber-50/50 flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-emerald-300/60 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 sm:p-5">
                    <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-medium mb-2.5">
                      <Clock className="w-3 h-3" />
                      {new Date(article.createdAt).toLocaleDateString('fa-IR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-stone-800 mb-2 line-clamp-2 leading-relaxed group-hover:text-[#1e5d3f] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[10px] sm:text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                      {article.content}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ==================== 8. Testimonials ==================== */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/70 backdrop-blur-sm border border-emerald-100/60 rounded-full shadow-sm mb-3 sm:mb-4">
              <MessageCircle className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1e5d3f]" />
              <span className="text-[10px] sm:text-[11px] font-bold text-[#1e5d3f]">
                نظرات شما
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 mb-2 sm:mb-3">
              مشتریان درباره‌مون چی می‌گن؟
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto">
              هزاران نفر با دکتر معجون سلامتی‌شون رو بهبود دادن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="group relative bg-white/85 backdrop-blur-xl rounded-[20px] sm:rounded-[24px] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] p-5 sm:p-6 transition-all duration-300 hover:shadow-[0_12px_35px_-10px_rgba(30,93,63,0.15)] hover:-translate-y-1"
              >
                <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-[#e6b741]/40 mb-3 sm:mb-4" />

                <p className="text-[11px] sm:text-xs text-stone-600 leading-relaxed mb-4 sm:mb-5">
                  {t.text}
                </p>

                <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-stone-100">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="font-black text-xs sm:text-sm text-[#1e5d3f]">
                      {t.name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[11px] sm:text-xs text-stone-800 line-clamp-1">
                      {t.name}
                    </p>
                    <p className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {t.city}
                    </p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#e6b741] text-[#e6b741]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 9. FAQ ==================== */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white/70 backdrop-blur-sm border border-emerald-100/60 rounded-full shadow-sm mb-3 sm:mb-4">
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#1e5d3f]" />
              <span className="text-[10px] sm:text-[11px] font-bold text-[#1e5d3f]">
                سوالات متداول
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-stone-900 mb-2 sm:mb-3">
              هر چیزی که باید بدونی
            </h2>
            <p className="text-stone-500 text-xs sm:text-sm max-w-lg mx-auto">
              پاسخ سوالات پرتکرار مشتریان
            </p>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== 10. Final CTA ==================== */}
      <section className="py-8 sm:py-12 md:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#1e5d3f] to-[#153f2b] rounded-[24px] sm:rounded-[28px] md:rounded-[32px] p-6 sm:p-8 md:p-14 overflow-hidden shadow-2xl shadow-emerald-900/20">
            <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-[#e6b741]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 sm:w-80 h-64 sm:h-80 bg-white/5 rounded-full blur-3xl" />

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-white mb-3 sm:mb-4 leading-tight">
                آماده‌ای سلامتی‌ت رو متحول کنی؟
              </h2>
              <p className="text-emerald-100/80 text-xs sm:text-sm md:text-base mb-6 sm:mb-8 leading-relaxed">
                همین امروز شروع کن و تفاوت رو در همون هفته‌ی اول حس کن. تضمین
                کیفیت، ارسال سریع، رضایت شما.
              </p>

              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center">
                <Link
                  href="/custom-mix"
                  className="group inline-flex items-center justify-center gap-2 bg-[#e6b741] hover:bg-[#d4a635] text-[#0F1F18] px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black transition-all shadow-[0_8px_20px_-6px_rgba(230,183,65,0.5)] hover:-translate-y-0.5 active:translate-y-0"
                >
                  ساخت معجون اختصاصی
                  <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all"
                >
                  مشاهده محصولات
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

 
    </div>
  )
}