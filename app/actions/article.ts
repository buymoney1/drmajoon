'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ==================== Create ====================
export async function createArticle(formData: FormData) {
  try {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const image = formData.get('image') as string

    if (!title || !content) {
      return { error: 'عنوان و محتوا اجباری هستند' }
    }

    await prisma.article.create({
      data: {
        title,
        content,
        image: image || null,
      },
    })

    revalidatePath('/admin/articles')
    revalidatePath('/articles')
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('createArticle error:', error)
    return { error: error?.message || 'خطا در افزودن مقاله' }
  }
}

// ==================== Update ====================
export async function updateArticle(id: string, formData: FormData) {
  try {
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const image = formData.get('image') as string

    if (!title || !content) {
      return { error: 'عنوان و محتوا اجباری هستند' }
    }

    await prisma.article.update({
      where: { id },
      data: {
        title,
        content,
        image: image || null,
      },
    })

    revalidatePath('/admin/articles')
    revalidatePath('/articles')
    revalidatePath(`/articles/${id}`)
    revalidatePath('/')

    return { success: true }
  } catch (error: any) {
    console.error('updateArticle error:', error)
    return { error: error?.message || 'خطا در ویرایش مقاله' }
  }
}

// ==================== Delete ====================
export async function deleteArticle(id: string) {
  try {
    await prisma.article.delete({ where: { id } })
    revalidatePath('/admin/articles')
    revalidatePath('/articles')
    revalidatePath('/')
    return { success: true }
  } catch (error: any) {
    console.error('deleteArticle error:', error)
    return { error: error?.message || 'خطا در حذف مقاله' }
  }
}