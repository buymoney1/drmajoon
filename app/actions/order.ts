'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ==================== Types ====================
export type CreateOrderInput = {
  customerName: string
  phone: string
  province: string
  city: string
  address: string
  postalCode?: string
  note?: string
  paymentMethod: 'online' | 'transfer'
  totalPrice: number
  items: {
    productId?: string | null
    name: string
    price: number
    quantity: number
    weight?: string | null
    type?: string
  }[]
}

// ==================== Create Order + Upsert Customer ====================
export async function createOrder(input: CreateOrderInput) {
  try {
    const {
      customerName,
      phone,
      province,
      city,
      address,
      postalCode,
      note,
      paymentMethod,
      totalPrice,
      items,
    } = input

    // اعتبارسنجی
    if (!customerName || !phone || !province || !city || !address) {
      return { error: 'لطفاً تمام فیلدهای اجباری را پر کنید' }
    }

    if (!/^09\d{9}$/.test(phone)) {
      return { error: 'شماره تلفن نامعتبر است' }
    }

    if (!items || items.length === 0) {
      return { error: 'سبد خرید خالی است' }
    }

    // 🔥 Upsert Customer (بر اساس شماره تلفن یکتا)
    const existingCustomer = await prisma.customer.findUnique({
      where: { phone },
    })

    let customer
    if (existingCustomer) {
      // به‌روزرسانی اطلاعات + افزایش شمارنده‌ها
      customer = await prisma.customer.update({
        where: { id: existingCustomer.id },
        data: {
          name: customerName,
          province,
          city,
          address,
          postalCode: postalCode || null,
          note: note || existingCustomer.note,
          totalOrders: { increment: 1 },
          totalSpent: { increment: totalPrice },
          lastOrderAt: new Date(),
        },
      })
    } else {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone,
          province,
          city,
          address,
          postalCode: postalCode || null,
          note: note || null,
          totalOrders: 1,
          totalSpent: totalPrice,
          lastOrderAt: new Date(),
          source: 'checkout',
        },
      })
    }

    // ایجاد سفارش
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        customerName,
        phone,
        province,
        city,
        address,
        postalCode: postalCode || null,
        note: note || null,
        paymentMethod,
        totalPrice,
        status: 'PENDING',
        items: {
          create: items.map((item) => ({
            productId: item.productId || null,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            weight: item.weight || null,
            type: item.type || 'product',
          })),
        },
      },
    })

    revalidatePath('/admin/orders')
    revalidatePath('/admin/customers')
    revalidatePath(`/admin/customers/${customer.id}`)

    return { success: true, orderId: order.id, customerId: customer.id }
  } catch (error: any) {
    console.error('createOrder error:', error)
    return { error: error?.message || 'خطا در ثبت سفارش' }
  }
}

// ==================== Update Order Status ====================
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status },
    })
    revalidatePath('/admin/orders')
    revalidatePath(`/admin/orders/${orderId}`)
    return { success: true }
  } catch (error: any) {
    return { error: error?.message || 'خطا در تغییر وضعیت' }
  }
}

// ==================== Delete Order ====================
export async function deleteOrder(orderId: string) {
  try {
    await prisma.orderItem.deleteMany({ where: { orderId } })
    await prisma.order.delete({ where: { id: orderId } })
    revalidatePath('/admin/orders')
    return { success: true }
  } catch (error: any) {
    return { error: error?.message || 'خطا در حذف سفارش' }
  }
}

// ==================== Update Customer ====================
export async function updateCustomer(id: string, data: {
  name?: string
  province?: string
  city?: string
  address?: string
  postalCode?: string
  note?: string
  tags?: string[]
}) {
  try {
    await prisma.customer.update({
      where: { id },
      data,
    })
    revalidatePath('/admin/customers')
    revalidatePath(`/admin/customers/${id}`)
    return { success: true }
  } catch (error: any) {
    return { error: error?.message || 'خطا در ویرایش مشتری' }
  }
}

// ==================== Delete Customer ====================
export async function deleteCustomer(id: string) {
  try {
    const ordersCount = await prisma.order.count({ where: { customerId: id } })
    if (ordersCount > 0) {
      return {
        error: `امکان حذف نیست — ${ordersCount} سفارش برای این مشتری ثبت شده`,
      }
    }
    await prisma.customer.delete({ where: { id } })
    revalidatePath('/admin/customers')
    return { success: true }
  } catch (error: any) {
    return { error: error?.message || 'خطا در حذف مشتری' }
  }
}