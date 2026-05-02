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
        .update({ payment_status: 'cancelled', payment_details: data })
        .eq('order_id', tran_id);
    }

    // Redirect to cancellation page in the store
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    return NextResponse.redirect(new URL('/payment/cancel', baseUrl));
  } catch (error) {
    console.error('Cancel callback error:', error);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    return NextResponse.redirect(new URL('/payment/cancel', baseUrl));
  }
}
