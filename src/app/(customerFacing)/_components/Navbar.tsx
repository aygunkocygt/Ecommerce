
import { Nav,NavLink } from '@/components/Nav'
import { ShoppingCart } from "lucide-react";
import { useBasket } from '@/context/BasketContext';
import { Category } from '@prisma/client';
import db from '@/db/db';
import { getServerSession } from "next-auth";
import authOptions  from "@/pages/api/auth/[...nextauth]";

export default async function Navbar(){

    const session = await getServerSession(authOptions);

    const categories = await db.category.findMany({
        select: {
          id: true,
          name: true,
          isActive:true,
          _count: { select: { products: true } },
        },
        orderBy:{ name: "asc"}
      });

    return(
        <Nav session={session}>
        {categories?.map((category: Category) => (
            <NavLink key={category.name} href={`/categories/${category.id}`}>{category.name}</NavLink>
        ))}
    </Nav>
    )
}