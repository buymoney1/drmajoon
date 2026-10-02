// app/actions/auth.ts
'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function loginAdmin(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
    // ✅ تغییر مهم: cookies() حالا async است و باید await شود
    const cookieStore = await cookies()
    
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
      sameSite: 'lax',
    })
    
    redirect('/admin')
  } else {
    return { error: 'نام کاربری یا رمز عبور اشتباه است' }
  }
}

export async function logoutAdmin() {
  // ✅ تغییر مهم: cookies() حالا async است
  const cookieStore = await cookies()
  cookieStore.delete('admin_auth')
  redirect('/admin/login')
}