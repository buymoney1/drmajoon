import type { Metadata } from 'next'
import { Vazirmatn } from 'next/font/google'
import { Toaster } from 'sonner'
import { Providers } from './providers'
import ConditionalHeader from '@/components/ConditionalHeader'
import ConditionalFooter from '@/components/ConditionalFooter'
import './globals.css'

const vazir = Vazirmatn({
  subsets: ['arabic'],
  variable: '--font-vazirmatn',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'دکتر معجون | طبیعت، سلامت، زندگی',
  description: 'سفارش آنلاین معجون‌های گیاهی',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body className="font-sans antialiased">
        <Providers>
          <ConditionalHeader />
          <main className="min-h-[calc(100vh-10rem)]">{children}</main>
          <ConditionalFooter />
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  )
}