"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from 'next/image';
import { formatCurrency } from "@/lib/formatters";
import { Card, CardContent } from "@/components/ui/card";

type CheckoutFormProps = {
  product: {
    id: string;
    imagePath: string;
    filePath: string;
    name: string;
    priceInCents: number;
    description: string;
  };
};

export default function DetailPage({ product }: CheckoutFormProps) {
  const images = [
    { imagePath: product.imagePath.startsWith('/') ? product.imagePath : `/${product.imagePath}` },
    ...(product.filePath ? [{ imagePath: product.filePath.startsWith('/') ? product.filePath : `/${product.filePath}` }] : [])
  ];

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handlePreviousImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  console.log("text:",product.description)

  return (
    <div className="container">
      <div className="p-10 flex flex-wrap">
        {/* Image section */}
        <div className="relative w-full md:w-1/2 flex flex-col items-center md:items-start md:justify-center md:pr-4">
          <div
            className="relative overflow-hidden rounded-lg shadow-md"
            style={{ width: '450px', height: '400px' }} // Set width and height here
          >
            <Image
              src={images[selectedImageIndex].imagePath}
              alt={`Product Image ${selectedImageIndex + 1}`}
              layout="fill"
              quality={100} // Set image quality
              className="rounded-lg"
            />
            <button
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              onClick={handlePreviousImage}
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              onClick={handleNextImage}
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <div className="flex space-x-2 justify-center w-full" style={{ width: '450px', marginTop: "-25px", zIndex: "3" }}>
            {images.map((image, index) => (
              <div
                key={index}
                className={`w-12 h-12 border rounded overflow-hidden cursor-pointer ${
                  selectedImageIndex === index ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
              >
                <Image
                  src={image.imagePath}
                  alt={`Thumbnail ${index + 1}`}
                  width={48}
                  height={48}
                  quality={100} // Set thumbnail quality
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product description section */}
        <div className="w-full md:w-1/2 flex flex-col p-3">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex column space-x-2 mt-5">
            <span className="text-xl text-gray-500 line-through">{formatCurrency(product.priceInCents)}</span>
            <span className="text-xl font-semibold">{formatCurrency(product.priceInCents)}</span>
            <span className="text-sm mt-1.5">KDV DAHİL & ÜCRETSİZ KARGO</span>
          </div>

          <Card className="flex items-center bg-[#F5F5F5] p-2 justify-between mt-5">
            <div className="flex flex-col">
              <span className="text-xs font-semibold">Adet Seçimi</span>
              <span className="text-xs">Sipariş Limiti 10 Adet</span>
            </div>
            <div className="flex flex-row items-center justify-center">
              <Button variant={"outline"} className="h-5 w-5 rounded-full">-</Button>
              <div className="mx-4 w-20 h-6 border bg-white rounded flex items-center justify-center">1</div>
              <Button variant={"outline"} className="h-5 w-5 rounded-full">+</Button>
            </div>
          </Card>
          <Button variant={"default"} className="mt-4 bg-[#F27A1A]">Sepete Ekle</Button>

          {/* Güvenli Alışveriş İmkanı */}
          <div className="flex flex-col items-center border border-gray-300 rounded p-4 mt-4">
            <span className="font-semibold text-sm mr-4">%100 GÜVENLİ ALIŞVERİŞ İMKÂNI</span>
            <div className="flex space-x-4">
              <Image src="/visa.svg" alt="Visa" width={40} height={20} />
              <Image src="/mastercard.svg" alt="MasterCard" width={40} height={20} />
              <Image src="/iyzigo.svg" alt="Iyzico ile Öde" width={40} height={20} />
            </div>
          </div>
        </div>
      </div>
    <div className="p-10">
    <h1 className="text-xl mb-2">Ürün Bilgileri</h1>
    <Card >
       <CardContent className="flex items-center justify-center text-center">
       <div
      dangerouslySetInnerHTML={{ __html: product.description }}
      className="prose p-5" // You can use TailwindCSS's prose class for styling if you like
    />
       </CardContent>
      </Card>
    </div>
     
    </div>
  );
}
