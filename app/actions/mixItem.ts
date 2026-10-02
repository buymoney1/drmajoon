'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ==================== Create ====================
export async function createMixItem(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string)
    const image = formData.get('image') as string
    const category = (formData.get('category') as string) || 'عمومی'
    const benefitsRaw = formData.get('benefits') as string

    const benefits = benefitsRaw
      ? benefitsRaw
          .split('\n')
          .map((b) => b.trim())
          .filter(Boolean)
      : []

    if (!name || !price || !image) {
      return { error: 'لطفاً فیلدهای اجباری را پر کنید' }
    }

    await prisma.mixItem.create({
      data: {
        name,
        description: description || '',
        price,
        image,
        category,
        benefits,
        // ✅ weight حذف شد (در schema نیست)
      },
    })

    revalidatePath('/admin/mix-items')
    revalidatePath('/custom-mix')

    return { success: true }
  } catch (error: any) {
    console.error('createMixItem error:', error)
    return { error: error?.message || 'خطا در افزودن آیتم' }
  }
}

// ==================== Update ====================
export async function updateMixItem(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseInt(formData.get('price') as string)
    const image = formData.get('image') as string
    const category = formData.get('category') as string
    const benefitsRaw = formData.get('benefits') as string

    const benefits = benefitsRaw
      ? benefitsRaw
          .split('\n')
          .map((b) => b.trim())
          .filter(Boolean)
      : []

    if (!name || !price || !image) {
      return { error: 'لطفاً فیلدهای اجباری را پر کنید' }
    }

    await prisma.mixItem.update({
      where: { id },
      data: {
        name,
        description: description || '',
        price,
        image,
        category,
        benefits,
        // ✅ weight حذف شد (در schema نیست)
      },
    })

    revalidatePath('/admin/mix-items')
    revalidatePath('/custom-mix')

    return { success: true }
  } catch (error: any) {
    console.error('updateMixItem error:', error)
    return { error: error?.message || 'خطا در ویرایش آیتم' }
  }
}

// ==================== Delete ====================
export async function deleteMixItem(id: string) {
  try {
    await prisma.mixItem.delete({ where: { id } })
    revalidatePath('/admin/mix-items')
    revalidatePath('/custom-mix')
    return { success: true }
  } catch (error: any) {
    return { error: error?.message || 'خطا در حذف' }
  }
}

// ==================== Toggle Status ====================
export async function toggleMixItemStatus(id: string, isActive: boolean) {
  try {
    await prisma.mixItem.update({
      where: { id },
      data: { isActive: !isActive },
    })
    revalidatePath('/admin/mix-items')
    revalidatePath('/custom-mix')
    return { success: true }
  } catch (error: any) {
    return { error: error?.message || 'خطا در تغییر وضعیت' }
  }
}