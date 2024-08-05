"use client"

import { Nav,NavLink } from '@/components/Nav'
import { ShoppingCart } from "lucide-react";
import { useBasket } from '@/context/BasketContext';
import { Category } from '@prisma/client';

export default function NavbarComponent({categories} : {categories?:Category | null}){
   

    return(
        <Nav>
        {categories?.map((category: Category) => (
            <NavLink key={category.name} href={`/categories/${category.id}`}>{category.name}</NavLink>
        ))}
    </Nav>
    )
}