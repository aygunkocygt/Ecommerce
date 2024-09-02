import { BasketProvider } from '@/context/BasketContext';
import Navbar from './_components/Navbar';

export const dynamic = "force-dynamic"

export default async function CustomerLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
   
    
    return (<>
    
    <BasketProvider>
    <Navbar />
    <div className="container my-8 mx-auto px-20 ">
        {children}
    </div>
    </BasketProvider>
    </>)
  }