'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']

// ===== آپلود تصویر =====
export async function uploadMedia(formData: FormData) {
  try {
    const file = formData.get('file') as File | null
    const alt = (formData.get('alt') as string) || ''

    if (!file) {
      return { error: 'فایلی انتخاب نشده است' }
    }

    // بررسی حجم
    if (file.size > MAX_FILE_SIZE) {
      return { error: 'حجم فایل نباید بیشتر از ۵ مگابایت باشد' }
    }

    // بررسی نوع فایل
    if (!ALLOWED_TYPES.includes(file.type)) {
      return { error: 'فرمت فایل پشتیبانی نمی‌شود. فقط JPG، PNG، WebP، GIF و SVG مجاز هستند' }
    }

    // اطمینان از وجود پوشه
    if (!existsSync(UPLOAD_DIR)) {
      await mkdir(UPLOAD_DIR, { recursive: true })
    }

    // ساخت نام یکتا
    const ext = file.name.split('.').pop() || 'jpg'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 10)
    const filename = `${timestamp}-${randomStr}.${ext}`

    // تبدیل فایل به Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // ذخیره روی دیسک
    const filePath = path.join(UPLOAD_DIR, filename)
    await writeFile(filePath, buffer)

    // ذخیره متادیتا در دیتابیس
    const media = await prisma.media.create({
      data: {
        filename,
        originalName: file.name,
        url: `/uploads/${filename}`,
        mimeType: file.type,
        size: file.size,
        alt: alt || null,
      },
    })

    revalidatePath('/admin/media')

    return {
      success: true,
      media: {
        id: media.id,
        url: media.url,
        filename: media.filename,
        originalName: media.originalName,
        size: media.size,
      },
    }
  } catch (error) {
    console.error('Upload error:', error)
    return { error: 'خطا در آپلود فایل' }
  }
}

// ===== حذف تصویر =====
export async function deleteMedia(id: string) {
  try {
    const media = await prisma.media.findUnique({ where: { id } })
    if (!media) {
      return { error: 'فایل پیدا نشد' }
    }

    // حذف از دیسک
    const filePath = path.join(UPLOAD_DIR, media.filename)
    if (existsSync(filePath)) {
      await unlink(filePath)
    }

    // حذف از دیتابیس
    await prisma.media.delete({ where: { id } })

    revalidatePath('/admin/media')
    return { success: true }
  } catch (error) {
    console.error('Delete error:', error)
    return { error: 'خطا در حذف فایل' }
  }
}

// ===== ویرایش متادیتا =====
export async function updateMedia(id: string, formData: FormData) {
  try {
    const alt = (formData.get('alt') as string) || null

    await prisma.media.update({
      where: { id },
      data: { alt },
    })

    revalidatePath('/admin/media')
    return { success: true }
  } catch (error) {
    console.error('Update error:', error)
    return { error: 'خطا در ویرایش فایل' }
  }
}

// ===== حذف چند فایل =====
export async function deleteMultipleMedia(ids: string[]) {
  try {
    for (const id of ids) {
      const media = await prisma.media.findUnique({ where: { id } })
      if (!media) continue

      const filePath = path.join(UPLOAD_DIR, media.filename)
      if (existsSync(filePath)) {
        await unlink(filePath)
      }

      await prisma.media.delete({ where: { id } })
    }

    revalidatePath('/admin/media')
    return { success: true }
  } catch (error) {
    console.error('Bulk delete error:', error)
    return { error: 'خطا در حذف فایل‌ها' }
  }
}