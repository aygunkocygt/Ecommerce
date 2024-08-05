import ProductGridScroller from "@/components/ProductGridScroller";
import { Product } from "@prisma/client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

type ProductGridSectionProps = {
  title: string;
  products: Product[];
};

export default function ProductGridSection({ title, products }: ProductGridSectionProps) {
  return (
    <div className="space-y-4 bg-[#FFFAF6] rounded-[5px] p-4">
      <div className="flex flex-row justify-between">
        <h1 className="text-lg font-bold text-[#333333]">{title}</h1>
        <Link href="/products" className="flex items-center space-x-2">
          <span className="text-xs text-[#333333]">Tüm Ürünler</span>
          <ChevronRight className="size-4" />
        </Link>
      </div>
      <ProductGridScroller products={products} />
    </div>
  );
}
