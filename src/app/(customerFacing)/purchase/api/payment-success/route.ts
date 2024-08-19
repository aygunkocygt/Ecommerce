import type { NextRequest, NextResponse } from 'next/server';
import { handlePaymentSuccess } from '@/app/(customerFacing)/_actions/payment';

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const formData = await req.formData();

    // Call your server-side function to handle payment success
    const result = await handlePaymentSuccess(formData);

    if (result) {
      return NextResponse.json({ success: false, message: 'Validation failed' }, { status: 400 });
    } else {
      return NextResponse.json({ success: true }, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
