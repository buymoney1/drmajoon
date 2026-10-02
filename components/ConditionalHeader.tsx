'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

export default function ConditionalHeader() {
  const pathname = usePathname()

  // پنل ادمین هدر عمومی نداره
  if (pathname?.startsWith('/admin')) {
    return null
  }

  return <Header />
}