import Link from 'next/link'
import { Leaf,  Send, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#153f2b] text-white mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* برند */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-7 h-7" />
              <span className="font-bold text-xl">دکتر معجون</span>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              طبیعت، سلامت، زندگی. با ما سلامتی را به خانه خود بیاورید.
            </p>
          </div>

          {/* لینک‌ها */}
          <div>
            <h4 className="font-bold mb-4">دسترسی سریع</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/about" className="hover:text-white">درباره ما</Link></li>
              <li><Link href="/shop" className="hover:text-white">فروشگاه</Link></li>
              <li><Link href="/articles" className="hover:text-white">مقالات</Link></li>
              <li><Link href="/contact" className="hover:text-white">تماس با ما</Link></li>
            </ul>
          </div>

          {/* خدمات مشتریان */}
          <div>
            <h4 className="font-bold mb-4">خدمات مشتریان</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link href="/faq" className="hover:text-white">سوالات متداول</Link></li>
              <li><Link href="/shipping" className="hover:text-white">رویه ارسال</Link></li>
              <li><Link href="/returns" className="hover:text-white">بازگشت کالا</Link></li>
              <li><Link href="/privacy" className="hover:text-white">حریم خصوصی</Link></li>
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h4 className="font-bold mb-4">تماس با ما</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                ۰۲۱-۱۲۳۴۵۶۷۸
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                info@drmajoon.ir
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                تهران، خیابان ولیعصر
              </li>
            </ul>
            <div className="flex gap-3 mt-4">
          
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition">
                <Send className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-6 text-center text-sm text-white/50">
          © ۱۴۰۳ دکتر معجون. تمامی حقوق محفوظ است.
        </div>
      </div>
    </footer>
  )
}