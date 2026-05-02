import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// fail/route.ts
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const data = Object.fromEntries(formData)
  const tran_id = data.tran_id as string

  await supabase.from('orders').update({ payment_status: 'failed' }).eq('order_id', tran_id)
  return NextResponse.redirect(new URL('/payment/fail', process.env.NEXT_PUBLIC_BASE_URL))
}