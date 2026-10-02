'use client'
import { useState } from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { Stomach, Brain, Heart, Moon, Zap, Eye, ArrowLeft, ChevronLeft, Scale, Leaf, Activity, Droplet } from 'lucide-react'

const problems = [
  { id: 'male', title: 'زود انزالی', icon: '♂', bg: 'bg-blue-500' },
  { id: 'stomach', title: 'مشکلات گوارش', icon: Stomach, bg: 'bg-emerald-500' },
  { id: 'uterus', title: 'تقویت رحم', icon: '♀', bg: 'bg-purple-500' },
  { id: 'memory', title: 'فراموشی', icon: Brain, bg: 'bg-amber-500' },
  { id: 'cold', title: 'خلط پشت حلق', icon: Heart, bg: 'bg-red-500' },
  { id: 'fatigue', title: 'چاقی', icon: Scale, bg: 'bg-cyan-500' },
  { id: 'mouth', title: 'آبریزش دهان هنگام خواب', icon: Droplet, bg: 'bg-lime-500' },
  { id: 'tired', title: 'خستگی دائم', icon: Zap, bg: 'bg-pink-500' },
  { id: 'stress', title: 'استرس و اضطراب', icon: Brain, bg: 'bg-slate-500' },
]

export default function StartCustomMixPage() {
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-cream">
    

      {/* Header */}
      <div className="bg-gradient-to-b from-primary-soft to-cream py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-3">
            معجون خودتو بساز
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            برای شروع، مشکل یا هدف خودت رو انتخاب کن تا مناسب‌ترین ترکیبات بهت پیشنهاد بشه.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Problems Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {problems.map((problem) => {
                const Icon = typeof problem.icon === 'string' ? null : problem.icon
                const isSelected = selectedProblem === problem.id
                return (
                  <button
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem.id)}
                    className={`${problem.bg} ${
                      isSelected ? 'ring-4 ring-primary ring-offset-2' : ''
                    } text-white rounded-2xl p-6 flex items-center justify-between hover:scale-[1.02] transition shadow-soft`}
                  >
                    <span className="font-bold text-lg">{problem.title}</span>
                    {Icon ? (
                      <Icon className="w-10 h-10 opacity-80" />
                    ) : (
                      <span className="text-4xl opacity-80">{problem.icon}</span>
                    )}
                  </button>
                )
              })}

              {/* CTA دکمه استرس و اضطراب */}
              <div className="sm:col-span-2 bg-slate-600 text-white rounded-2xl p-6 flex items-center justify-center gap-3">
                <Brain className="w-8 h-8" />
                <span className="font-bold text-lg">استرس و اضطراب</span>
                <ChevronLeft className="w-6 h-6 opacity-70" />
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="bg-white rounded-3xl p-6 shadow-soft h-fit">
            <div className="flex items-center gap-2 mb-4">
              <Stomach className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-lg text-primary-dark">مشکلات گوارش</h3>
            </div>
            <div className="rounded-2xl overflow-hidden mb-4 h-40 relative">
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600"
                alt="herbal tea"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 text-justify">
              مشکلات گوارشی می‌توانند کیفیت زندگی را تحت تأثیر قرار دهند. در این بخش
              با علائم، دلایل و راهکارهای گیاهی برای بهبود مشکلات گوارش آشنا می‌شوید.
            </p>

            <div className="bg-primary-soft/60 rounded-xl p-4 mb-4">
              <p className="font-bold text-sm text-primary-dark mb-3">جزئیات بیشتر:</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {['علائم و نشانه‌ها', 'علت‌های احتمالی', 'درمان‌های گیاهی', 'توصیه‌های تغذیه‌ای'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
              <Eye className="w-5 h-5" />
              مشاهده جزئیات بیشتر
            </button>
          </div>
        </div>
      </div>

   
    </div>
  )
}