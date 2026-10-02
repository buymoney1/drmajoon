'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// تبدیل نام فارسی به slug انگلیسی
function generateSlug(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u0600-\u06FF-]/g, '')
    .toLowerCase()
}

export async function createCategory(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const image = formData.get('image') as string
  const icon = formData.get('icon') as string
  const color = formData.get('color') as string || 'primary'
  const order = parseInt(formData.get('order') as string) || 0

  if (!name) {
    return { error: 'نام دسته‌بندی الزامی است' }
  }

  // بررسی تکراری نبودن
  const existing = await prisma.category.findUnique({ where: { name } })
  if (existing) {
    return { error: 'دسته‌بندی با این نام قبلاً وجود دارد' }
  }

  const slug = generateSlug(name)

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
  revalidatePath('/')
  redirect('/admin/categories')
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const image = formData.get('image') as string
  const icon = formData.get('icon') as string
  const color = formData.get('color') as string
  const order = parseInt(formData.get('order') as string) || 0

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: generateSlug(name),
      description: description || null,
      image: image || null,
      icon: icon || null,
      color,
      order,
    },
  })

  revalidatePath('/admin/categories')
  revalidatePath('/shop')
  revalidatePath('/')
  redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
  // بررسی: آیا محصولی با این دسته‌بندی وجود دارد؟
  const category = await prisma.category.findUnique({ where: { id } })
  if (!category) return

  const productsCount = await prisma.product.count({
    where: { category: category.name },
  })

  if (productsCount > 0) {
    return {
      error: `نمی‌توان این دسته‌بندی را حذف کرد. ${productsCount} محصول با این دسته‌بندی وجود دارد.`,
    }
  }

  await prisma.category.delete({ where: { id } })
  revalidatePath('/admin/categories')
  revalidatePath('/shop')
  revalidatePath('/')
}

export async function toggleCategoryStatus(id: string, isActive: boolean) {
  await prisma.category.update({
    where: { id },
    data: { isActive: !isActive },
  })
  revalidatePath('/admin/categories')
  revalidatePath('/shop')
  revalidatePath('/')
}