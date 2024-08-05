"use client"
import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { useSwipeable } from 'react-swipeable';
import { ChevronLeft, ChevronRight } from "lucide-react";

type ProductGridScrollerProps = {
  products: any[];
};

export default function ProductGridScroller({ products }: ProductGridScrollerProps) {
  const [scrollIndex, setScrollIndex] = useState(0);

  const handleSwipeLeft = () => {
    if (scrollIndex < Math.ceil(products.length / 5) - 1) {
      setScrollIndex(prev => prev + 1);
    }
  };

  const handleSwipeRight = () => {
    if (scrollIndex > 0) {
      setScrollIndex(prev => prev - 1);
    }
  };

  const handlers = useSwipeable({
    onSwipedLeft: handleSwipeLeft,
    onSwipedRight: handleSwipeRight,
  });

  const itemWidth = 200; // Adjust this width as needed
  const itemsPerPage = 5;
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Calculate the total width for the container
  const containerWidth = itemsPerPage * itemWidth * totalPages;

  return (
    <div className="relative overflow-hidden">
      {/* Pagination Buttons */}
      <button
        className={`absolute top-1/2 transform -translate-y-1/2 p-1 bg-white border border-gray-300 rounded-full z-10 shadow-lg text-xs transition-colors duration-800 ${scrollIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'} hover:bg-[#F27A1A] hover:text-white`}
        style={{ left: '0px' }}
        onClick={handleSwipeRight}
        disabled={scrollIndex === 0}
      >
        <ChevronLeft />
      </button>
      <button
        className={`absolute top-1/2 transform -translate-y-1/2 p-1 bg-white border border-gray-300 rounded-full z-50 shadow-lg text-xs transition-colors duration-800 ${scrollIndex >= totalPages - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'} hover:bg-[#F27A1A] hover:text-white`}
        style={{ right: '0px' }}
        onClick={handleSwipeLeft}
        disabled={scrollIndex >= totalPages - 1}
      >
        <ChevronRight />
      </button>

      {/* Product Grid */}
      <div
        id="product-grid-container"
        {...handlers}
        className="flex gap-5 items-center transition-transform duration-800 ease-in-out"
        style={{ 
          display: 'flex',
          flexDirection: 'row',
          width: `${containerWidth}px`,
          transform: `translateX(-${scrollIndex * itemsPerPage * itemWidth}px)`,
        }}
      >
        {products.map((product, index) => (
          <div
            key={product.id}
            className="flex-shrink-0"
            style={{ width: `${itemWidth}px` }} // Adjust the width as needed
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </div>
  );
}
