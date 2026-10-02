'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ==================== Create ====================
export async function createProduct(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string)
    const image = formData.get('image') as string
    const category = formData.get('category') as string

    if (!name || !price || !image || !category) {
      return { error: 'لطفاً تمام فیلدهای اجباری را پر کنید' }
    }

    await prisma.product.create({
      data: {
        name,
        description: description || '',
        price,
        image,
        category,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('createProduct error:', error)
    return { error: error?.message || 'خطا در افزودن محصول' }
  }
}

// ==================== Update ====================
export async function updateProduct(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string)
    const image = formData.get('image') as string
    const category = formData.get('category') as string

    if (!name || !price || !image || !category) {
      return { error: 'لطفاً تمام فیلدهای اجباری را پر کنید' }
    }

    await prisma.product.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price,
        image,
        category,
      },
    })

    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath(`/shop/${id}`)
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('updateProduct error:', error)
    return { error: error?.message || 'خطا در ویرایش محصول' }
  }
}

// ==================== Delete ====================
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } })
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error?.message || 'خطا در حذف محصول' }
  }
}

// ==================== Toggle Status ====================
export async function toggleProductStatus(id: string, isActive: boolean) {
  try {
    await prisma.product.update({
      where: { id },
      data: { isActive: !isActive },
    })
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    return { error: error?.message || 'خطا در تغییر وضعیت' }
  }
}