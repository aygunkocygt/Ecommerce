import { PageHeader } from "../_components/PageHeader";
import db from "@/db/db";
import TableComponent from "./_components/TableComponent";
import { ExtendedOrder } from "@/lib/types";

export default async function AdminProductsPage() {
  const orders: ExtendedOrder[] = await db.order.findMany({
    include: {
      billingInfo: true,
      items: {
        include: {
          product: true, // Ensure product details are included
        },
      },
      _count: {
        select: {
          items: true,
        },
      },
    },
    orderBy:{ createdAt: "asc"}
  });

  console.log("orders:", orders);

  return (
    <>
      <div className="flex justify-between items-center gap-4">
        <PageHeader>Orders</PageHeader>
      </div>
      <TableComponent orders={orders} />
    </>
  );
}
