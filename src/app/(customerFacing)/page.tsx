import { Product } from "@prisma/client";
import { cache } from "@/lib/cache";
import db from "@/db/db";
import ProductGridSection from "@/components/ProductGridSection";

const getMostPopularProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { orders: { _count: "desc" } },
    take: 6,
  });
}, ["/", "getMostPopularProducts"], { revalidate: 60 * 60 * 24 });

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}, ["/", "getNewestProducts"]);

export default async function HomePage() {
  const popularProducts = await getMostPopularProducts();
  const newestProducts = await getNewestProducts();

  return (
    <main className="space-y-12">
      <ProductGridSection title="Most Popular" products={popularProducts} />
      <ProductGridSection title="Newest" products={newestProducts} />
    </main>
  );
}
