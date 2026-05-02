import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const data = Object.fromEntries(formData)

  const tran_id = data.tran_id as string
  const bank_txn_id = data.bank_txn_id as string
  const status = data.status

  if (status === 'VALID') {
    // Update order
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        transaction_id: bank_txn_id,
        payment_details: data,
      })
      .eq('order_id', tran_id)

    // Redirect to success page
    return NextResponse.redirect(new URL('/payment/success', process.env.NEXT_PUBLIC_BASE_URL))
  } else {
    return NextResponse.redirect(new URL('/payment/fail', process.env.NEXT_PUBLIC_BASE_URL))
  }
}