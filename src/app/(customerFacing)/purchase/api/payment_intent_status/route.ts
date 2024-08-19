// app/api/payment_intent_status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2022-11-15' });

export async function POST(req: NextRequest) {
  try {
    const { clientSecret } = await req.json();
    const paymentIntent = await stripe.paymentIntents.retrieve(clientSecret);

    return NextResponse.json({ status: paymentIntent.status });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
