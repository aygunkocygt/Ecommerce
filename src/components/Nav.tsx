"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, ComponentProps, useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { Search, ShoppingCart, User } from "lucide-react";
import { useBasket } from '@/context/BasketContext';
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatText } from "@/lib/formatters";
import Image from 'next/image';
import { Button } from "@/components/ui/button";


export function Nav({ session, children }: { children: ReactNode, session:any }) {
  const { basket } = useBasket();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const  user  = session?.user;

  console.log("user:",user)

  const handleMouseEnter = () => setIsDropdownOpen(true);
  const handleMouseLeave = () => {
    if (dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const isInside =
        rect.top <= window.innerHeight &&
        rect.bottom >= 0 &&
        rect.left <= window.innerWidth &&
        rect.right >= 0;
      if (!isInside) {
        setIsDropdownOpen(false);
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="container bg-[#FEFEFE] text-black-foreground px-2 py-2 border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto">
        <div className="flex justify-around items-center space-x-4">
          <Image src="/logo.png" alt="Visa" width={60} height={40} priority />
          <div className="relative flex w-full max-w-md mx-4">
            <input
              type="text"
              placeholder="Aradığınız ürün, kategori veya markayı yazınız"
              className="w-full px-4 py-2 border-none border-gray-300 rounded-lg bg-[#F3F3F3] text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#F27A1A] w-4 h-4" />
          </div>
          <div className="flex space-x-2">
            <MenuLink href={user?.email ? "/account" : "/login"}>
              <User className="w-4 h-4" />
              <span>{user?.email ? "Hesabım" : "Giriş Yap"}</span>
            </MenuLink>
            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <MenuLink href="/basket">
                <ShoppingCart className="w-4 h-4" />
                <span>Sepetim</span>
                <Badge variant="destructive" size="small">{basket.length}</Badge>
              </MenuLink>
              {(isDropdownOpen && basket.length > 0) && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="p-2 text-sm font-semibold border-b border-gray-200">
                    Sepetim ({basket.length} Ürün)
                  </div>
                  <div className="p-2">
                    {basket.map(item => (
                      <div key={item.id} className="flex items-center mb-2">
                        <Image src={item.imagePath} alt={item.name} width={56} height={80} className="mr-2 rounded" loading="lazy"/>
                        <div className="flex flex-col">
                          <span style={{fontSize:9}}>{formatText(item.name,70)}</span>
                          <span style={{fontSize:9}} className="text-gray-500">Adet: {item.count}</span>
                          <span style={{fontSize:12}} className="text-orange-500">{formatCurrency(item.priceInCents)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center flex-row p-1 space-x-1 font-semibold border-t border-gray-200">
                    <Button variant="outline" className="w-full text-xs" size="xs">
                      Sepete Git
                    </Button>
                    <Button variant="default" className="w-full text-xs bg-[#F27A1A] text-white" size="xs">
                      <Link href={"/purchase"} >
                      Siparişi Tamamla
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-center mt-2" style={{ marginBottom: "-5px" }}>
          <NavigationMenu>
            <NavigationMenuList className="flex justify-center">
              {children}
              <NavLink href={`/products`}>Tüm Ürünlerimiz</NavLink>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </nav>
  );
}

export function MenuLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  return (
    <NavigationMenuItem className="list-none">
      <Link
        {...props}
        className={cn(
          "text-xs px-3 py-1 hover:text-[#F27A1A] rounded flex items-center justify-center space-x-1"
        )}
      />
    </NavigationMenuItem>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <NavigationMenuItem className="list-none">
      <Link
        {...props}
        className={cn(
          "relative px-4 py-2 text-xs hover:text-[#F27A1A] rounded focus:outline-none",
          pathname === props.href ? "text-[#F27A1A] after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-full after:h-[2px] after:bg-[#F27A1A]" : "",
          "hover:after:content-[''] hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:w-full hover:after:h-[2px] hover:after:bg-[#F27A1A]"
        )}
      />
    </NavigationMenuItem>
  );
}
