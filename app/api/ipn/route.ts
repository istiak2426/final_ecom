// app/api/ipn/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    // SSLCommerz sends IPN data as form-urlencoded
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const tran_id = data.tran_id as string;
    const status = data.status as string;
    const bank_txn_id = data.bank_txn_id as string;

    if (!tran_id) {
      return NextResponse.json({ error: 'Missing tran_id' }, { status: 400 });
    }

    // Update order based on payment status
    if (status === 'VALID') {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: 'paid',
          transaction_id: bank_txn_id,
          payment_details: data,
        })
        .eq('order_id', tran_id);

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
      }
    } else {
      // Optionally mark as failed
      await supabase
        .from('orders')
        .update({ payment_status: 'failed', payment_details: data })
        .eq('order_id', tran_id);
    }

    // SSLCommerz expects a simple response
    return new NextResponse('OK', { status: 200 });
  } catch (error) {
    console.error('IPN handling error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Optional: Handle GET requests if SSLCommerz uses GET (unlikely, but safe)
export async function GET() {
  return NextResponse.json({ message: 'IPN endpoint only accepts POST' }, { status: 405 });
}
