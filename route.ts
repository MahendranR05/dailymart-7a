import { NextResponse } from 'next/server'
import crypto from 'node:crypto'

export async function POST(request: Request) {
  try {
    const { orderId, paymentId, signature } = await request.json()
    if (!orderId || !paymentId || !signature || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ verified: false, error: 'Missing payment verification data.' }, { status: 400 })
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex')
    const received = String(signature)
    const verified = expected.length === received.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))
    return NextResponse.json({ verified })
  } catch { return NextResponse.json({ verified: false, error: 'Could not verify payment.' }, { status: 400 }) }
}
