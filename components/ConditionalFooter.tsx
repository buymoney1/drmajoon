'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()

  // پنل ادمین فوتر عمومی نداره
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return <Footer />
}