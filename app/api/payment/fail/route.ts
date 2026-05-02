import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    const tran_id = data.tran_id as string;

    if (tran_id) {
      await supabase
        .from('orders')
        .update({ payment_status: 'failed', payment_details: data })
        .eq('order_id', tran_id);
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    return NextResponse.redirect(new URL('/payment/fail', baseUrl));
  } catch (error) {
    console.error('Fail callback error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    return NextResponse.redirect(new URL('/payment/fail', baseUrl));
  }
}
