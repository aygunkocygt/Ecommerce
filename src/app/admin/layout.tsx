import { Nav,NavLink } from '@/components/Nav'

export const dynamic = "force-dynamic"

export default function AdminLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <>
 
    <div className="container my-6">
        {children}
    </div>
    </>
  }