"use client"
import { formatCurrency, formatText } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useBasket } from '@/context/BasketContext'; 
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils";

type ProductCardProps = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
};

export function ProductCard({
    id,
    name,
    priceInCents,
    imagePath,
    description,
  }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const { dispatch } = useBasket();
    const { toast } = useToast()

    const handleAddToBasket = () => {
      try{
        dispatch({ type: 'ADD_TO_BASKET', payload: {id,name,priceInCents,description,imagePath,count:1} });
        toast({
          className: cn(
            'top-10 right-0 flex fixed md:max-w-[300px] md:h-[40px] md:top-4 md:right-4'
          ),
          variant: "success",
          title: "Ürün sepetinize eklenmiştir.",
        })
      }catch(error){
        toast({
          className: cn(
            'top-0 right-0 flex fixed md:max-w-[320px] md:max-h-[80px] md:top-4 md:right-4'
          ),
          variant: "destructive",
          title: "Ürün sepetinize eklenirken bir sorun oluştu!",
        })
      }
      
    };
  
    return (
        <Card
        className="relative flex flex-col p-3 border shadow-md rounded-lg min-h-[380px] max-h-[380px] mt-2 mb-2"
        style={{ maxWidth: "200px", minWidth: "200px" }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-full h-40 flex items-center justify-center overflow-hidden rounded-lg">
          <Link href={`product/${id}`}>
            <Image src={imagePath} fill alt={name} className="object-cover" loading="lazy" />
          </Link>
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">SALE</div>
        </div>
        <CardHeader className="flex flex-col flex-grow mt-2">
          <CardTitle className="text-sm font-light">{formatText(name,62)}</CardTitle>
          <CardTitle className="text-md font-bold text-black mt-1 space-x-2">
            <span className="text-gray-500 line-through">
              {formatCurrency(priceInCents)}
            </span>
            <span className="text-black">
              {formatCurrency(priceInCents)}
            </span>
          </CardTitle>
        </CardHeader>
        <CardFooter className={`absolute bottom-0 left-0 w-full transition-transform duration-300 ${isHovered ? 'translate-y-0' : 'translate-y-full'} opacity-${isHovered ? '100' : '0'}`}>
          <Button onClick={handleAddToBasket} size={"sm"} className="w-full bg-orange-500 text-white rounded-t-lg flex justify-center items-center space-x-2">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Sepete Ekle
          </Button>
        </CardFooter>
      </Card>
    );
  }

export function ProductCardSkeleton() {
    return (
      <Card className="overflow-hidden flex flex-col animate-pulse min-h-[400px] max-h-[400px]">
        <div className="w-full aspect-video bg-gray-300" />
        <CardHeader>
          <CardTitle>
            <div className="w-3/4 h-6 rounded-full bg-gray-300" />
          </CardTitle>
          <CardDescription>
            <div className="w-1/2 h-4 rounded-full bg-gray-300" />
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="w-full h-4 rounded-full bg-gray-300" />
          <div className="w-full h-4 rounded-full bg-gray-300" />
          <div className="w-3/4 h-4 rounded-full bg-gray-300" />
        </CardContent>
        <CardFooter>
          <Button className="w-full" disabled size="lg"></Button>
        </CardFooter>
      </Card>
    )
  }
