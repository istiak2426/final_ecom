import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const tran_id = data.tran_id as string;
    const bank_txn_id = data.bank_txn_id as string;
    const status = data.status;

    // Validate payment
    if (status === 'VALID') {
      await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          transaction_id: bank_txn_id,
          payment_details: data,
        })
        .eq('order_id', tran_id);
    } else {
      await supabase
        .from('orders')
        .update({
          payment_status: 'failed',
          payment_details: data,
        })
        .eq('order_id', tran_id);
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    // Redirect to success page only when valid, otherwise fail page
    if (status === 'VALID') {
      return NextResponse.redirect(new URL('/payment/success', baseUrl));
    } else {
      return NextResponse.redirect(new URL('/payment/fail', baseUrl));
    }
  } catch (error) {
    console.error('Success callback error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    return NextResponse.redirect(new URL('/payment/fail', baseUrl));
  }
}
