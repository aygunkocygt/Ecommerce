import { Order as PrismaOrder, BillingInfo as PrismaBillingInfo, Product as PrismaProduct } from "@prisma/client";

interface BillingInfo extends PrismaBillingInfo {
  // Keep the same properties as PrismaBillingInfo or add more if needed
}

interface Product extends PrismaProduct {
  // Keep the same properties as PrismaProduct or add more if needed
}

interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  product: Product; // Ensure product details are included
}

export interface ExtendedOrder extends PrismaOrder {
  billingInfo: BillingInfo;
  items: OrderItem[];
  _count: {
    items: number;
  };
}

export interface BasketItem {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  count: number; // Add count field
}

// Now you can use `ExtendedOrder` for your type checks
