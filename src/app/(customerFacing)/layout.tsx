import { BasketProvider } from '@/context/BasketContext';
import NavbarComponent from './_components/Navbar';
import db from '@/db/db';

export const dynamic = "force-dynamic"

export default async function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        isActive:true,
        _count: { select: { products: true } },
      },
      orderBy:{ name: "asc"}
    });
    
    return (<>
    <BasketProvider>
    <NavbarComponent categories={categories} />
    <div className="container my-8 mx-auto px-20 ">
        {children}
    </div>
    </BasketProvider>
    </>)
  }