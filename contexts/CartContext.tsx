'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

// ==================== Types ====================
export type CartItem = {
  id: string
  name: string
  image: string
  price: number
  quantity: number
  type: 'product' | 'mix'
  productId?: string | null
  weight?: string | null
  items?: any[]
}

type CartContextType = {
  cart: CartItem[]
  addToCart: (
    item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }
  ) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateItemPrice: (id: string, newPrice: number) => void
  getTotalPrice: () => number
  getTotalCount: () => number
  clearCart: () => void
  isLoaded: boolean
}

// ==================== Context ====================
const CartContext = createContext<CartContextType | undefined>(undefined)

const STORAGE_KEY = 'cart'

// ==================== Helper ====================
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// ==================== Provider ====================
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // ===== بارگذاری از localStorage =====
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setCart(parsed)
        }
      }
    } catch (error) {
      console.error('Failed to load cart:', error)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // ===== ذخیره در localStorage =====
  useEffect(() => {
    if (!isLoaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch (error) {
      console.error('Failed to save cart:', error)
    }
  }, [cart, isLoaded])

  // ==================== Actions ====================

  // افزودن به سبد
  const addToCart = (
    item: Omit<CartItem, 'quantity' | 'id'> & { quantity?: number }
  ) => {
    setCart((prev) => {
      const quantity = item.quantity ?? 1

      // بررسی: آیا محصولی با همین مشخصات قبلاً اضافه شده؟
      const existingIndex = prev.findIndex((i) => {
        if (item.type === 'product') {
          return i.type === 'product' && i.productId === item.productId
        }
        // برای mix: مقایسه بر اساس نام (چون هر میکس یهتا نیست)
        return i.type === 'mix' && i.name === item.name && i.weight === item.weight
      })

      if (existingIndex !== -1) {
        // افزایش تعداد
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      }

      // آیتم جدید
      return [
        ...prev,
        {
          id: generateId(),
          name: item.name,
          image: item.image,
          price: item.price,
          quantity,
          type: item.type,
          productId: item.productId ?? null,
          weight: item.weight ?? null,
          items: item.items ?? [],
        },
      ]
    })
  }

  // حذف از سبد
  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  // به‌روزرسانی تعداد
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  // 🔥 به‌روزرسانی قیمت (برای همگام‌سازی با قیمت‌های تازه)
  const updateItemPrice = (id: string, newPrice: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price: newPrice } : item
      )
    )
  }

  // جمع کل
  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  // تعداد کل
  const getTotalCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  // خالی کردن سبد
  const clearCart = () => {
    setCart([])
  }

  // ==================== Value ====================
  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateItemPrice,
    getTotalPrice,
    getTotalCount,
    clearCart,
    isLoaded,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// ==================== Hook ====================
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}