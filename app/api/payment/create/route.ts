import { NextRequest, NextResponse } from 'next/server'
import { initSSLCommerzPayment } from '@/lib/sslcommerz'
import { supabase } from '@/lib/supabaseClient'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest) {
  const { items, total, customer } = await req.json()

  // Generate unique transaction id
  const tran_id = `ORDER_${Date.now()}_${randomBytes(4).toString('hex')}`

  // Save order in Supabase with status 'pending'
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      order_id: tran_id,
      customer_name: customer.name,
      customer_email: customer.email,
      customer_phone: customer.phone,
      customer_address: customer.address,
      total_amount: total,
      payment_status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }

  // Save order items (optional but recommended)
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price: item.price,
  }))
  await supabase.from('order_items').insert(orderItems)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  const sslResponse = await initSSLCommerzPayment({
    total_amount: total,
    currency: 'BDT',
    tran_id: tran_id,
    success_url: `${baseUrl}/api/payment/success`,
    fail_url: `${baseUrl}/api/payment/fail`,
    cancel_url: `${baseUrl}/api/payment/cancel`,
    cus_name: customer.name,
    cus_email: customer.email,
    cus_phone: customer.phone,
    cus_add1: customer.address,
  })

  if (sslResponse.status === 'SUCCESS') {
    return NextResponse.json({ redirectUrl: sslResponse.GatewayPageURL })
  } else {
    // Update order payment_status to failed
    await supabase.from('orders').update({ payment_status: 'failed' }).eq('id', order.id)
    return NextResponse.json({ error: 'SSLCommerz init failed' }, { status: 500 })
  }
}