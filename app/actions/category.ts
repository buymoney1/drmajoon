'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ==================== Types ====================
type ActionResult = {
  success?: boolean
  error?: string
}

// ==================== Create Category ====================
export async function createCategory(
  formData: FormData
): Promise<ActionResult> {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as string
    const icon = formData.get('icon') as string
    const color = (formData.get('color') as string) || 'primary'
    const order = parseInt(formData.get('order') as string) || 0

    if (!name) {
      return { error: 'نام دسته‌بندی اجباری است' }
    }

    // ساخت slug از نام
    const slug = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')

    // چک تکراری نبودن
    const existing = await prisma.category.findFirst({
      where: {
        OR: [{ name }, { slug }],
      },
    })

    if (existing) {
      return { error: 'دسته‌بندی با این نام قبلاً وجود دارد' }
    }

    await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        icon: icon || null,
        color,
        order,
      },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/shop')

    return { success: true }
  } catch (error: any) {
    console.error('createCategory error:', error)
    return { error: error?.message || 'خطا در افزودن دسته‌بندی' }
  }
}

// ==================== Update Category ====================
export async function updateCategory(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const image = formData.get('image') as string
    const icon = formData.get('icon') as string
    const color = formData.get('color') as string
    const order = parseInt(formData.get('order') as string) || 0

    if (!name) {
      return { error: 'نام دسته‌بندی اجباری است' }
    }

    // چک تکراری نبودن (به‌جز خود این دسته)
    const existing = await prisma.category.findFirst({
      where: {
        name,
        NOT: { id },
      },
    })

    if (existing) {
      return { error: 'دسته‌بندی دیگری با این نام وجود دارد' }
    }

    await prisma.category.update({
      where: { id },
      data: {
        name,
        description: description || null,
        image: image || null,
        icon: icon || null,
        color,
        order,
      },
    })

    revalidatePath('/admin/categories')
    revalidatePath(`/admin/categories/${id}/edit`)
    revalidatePath('/shop')

    return { success: true }
  } catch (error: any) {
    console.error('updateCategory error:', error)
    return { error: error?.message || 'خطا در ویرایش دسته‌بندی' }
  }
}

// ==================== Delete Category ====================
export async function deleteCategory(id: string): Promise<ActionResult> {
  try {
    // چک: آیا محصولی در این دسته هست؟
    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) {
      return { error: 'دسته‌بندی یافت نشد' }
    }

    const productsCount = await prisma.product.count({
      where: { category: category.name },
    })

    if (productsCount > 0) {
      return {
        error: `امکان حذف نیست — ${productsCount} محصول در این دسته وجود دارد`,
      }
    }

    await prisma.category.delete({ where: { id } })

    revalidatePath('/admin/categories')
    revalidatePath('/shop')

    return { success: true }
  } catch (error: any) {
    console.error('deleteCategory error:', error)
    return { error: error?.message || 'خطا در حذف دسته‌بندی' }
  }
}

// ==================== Toggle Category Status ====================
export async function toggleCategoryStatus(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  try {
    await prisma.category.update({
      where: { id },
      data: { isActive: !isActive },
    })

    revalidatePath('/admin/categories')
    revalidatePath('/shop')

    return { success: true }
  } catch (error: any) {
    console.error('toggleCategoryStatus error:', error)
    return { error: error?.message || 'خطا در تغییر وضعیت' }
  }
}