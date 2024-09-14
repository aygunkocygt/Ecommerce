"use server";
import db from "@/db/db";
import { redirect } from "next/navigation";
import {generateOrderNumber} from '@/lib/generateOrderNumber'
import { BasketItem } from '@/lib/types'

export async function handlePaymentSuccess(data: { email: string, basket: any, billingInfo: any }) {
  // Create or find the user
  let user = await db.user.findUnique({ where: { email: data.email } });
  if (!user) {
    user = await db.user.create({ data: { email: data.email } });
  }

  // Create the billing info
  const { termsAccepted, ...billingInfoData } = data.billingInfo; // termsAccepted'i çıkarıyoruz
  const billingInfo = await db.billingInfo.create({
    data: { ...billingInfoData },
  });

  const orderNumber = generateOrderNumber()
  const order = await db.order.create({
    data: {
      userId: user.id,
      totalPriceInCents: data.basket.reduce((total:number, item:BasketItem) => total + (item.priceInCents * item.count), 0),
      billingInfoId: billingInfo.id,
      orderNumber:orderNumber
    },
  });

  // Create order items
  const orderItems = data.basket.map((item:BasketItem )=> ({
    orderId: order.id,
    productId: item.id,
    quantity: item.count,
  }));

  await db.orderItem.createMany({ data: orderItems });

  // Redirect to a success page
  redirect('/success');
}
