import { NextResponse } from 'next/server'
import axios from 'axios'

export async function POST(req: Request) {
  const body = await req.json()
  const { amount, orderId } = body

  try {
    const response = await axios.post('https://api.zarinpal.com/pg/v4/payment/request.json', {
      merchant_id: 'YOUR_ZARINPAL_MERCHANT_ID', // این را از زرین‌پال بگیرید
      amount: amount * 10, // زرین‌پال به ریال است (تومان * 10)
      currency: 'IRT',
      description: `پرداخت سفارش ${orderId}`,
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/verify?orderId=${orderId}`,
    }, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (response.data.data.code === 100) {
      return NextResponse.json({ url: `https://www.zarinpal.com/pg/StartPay/${response.data.data.authority}` })
    } else {
      return NextResponse.json({ error: 'خطا در ایجاد تراکنش' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 })
  }
}