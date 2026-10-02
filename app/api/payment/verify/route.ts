import { NextResponse } from 'next/server'
import axios from 'axios'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const authority = searchParams.get('Authority')
  const status = searchParams.get('Status')
  const orderId = searchParams.get('orderId')

  if (status !== 'OK' || !authority) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failed`)
  }

  const order = await prisma.order.findUnique({ where: { id: orderId! } })
  if (!order) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failed`)

  try {
    const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/verify.json', {
      merchant_id: 'YOUR_ZARINPAL_MERCHANT_ID',
      amount: order.totalPrice * 10,
      authority: authority,
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.data.data.code === 100) {
      await prisma.order.update({
        where: { id: orderId! },
        data: { status: 'PAID' }
      })
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`)
    } else {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failed`)
    }
  } catch (error) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/checkout/failed`)
  }
}