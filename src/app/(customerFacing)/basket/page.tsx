"use client";

import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/formatters'; // Ensure this function is correctly implemented
import { useBasket } from '@/context/BasketContext'; // Custom hook for basket
import Image from 'next/image';

export default function BasketPage() {
  const { basket, dispatch } = useBasket();

  const handleQuantityChange = (id: string, change: number) => {
    if (change > 0) {
      dispatch({ type: 'INCREMENT_ITEM_COUNT', payload: { id } });
    } else {
      dispatch({ type: 'DECREMENT_ITEM_COUNT', payload: { id } });
    }
  };

  const total = basket.reduce((acc, product) => acc + (product.priceInCents * product.count), 0);

  return (
    <div style={{backgroundColor:"#FFFAF6"}} className="min-h-screen p-6">
      <header className="mb-8">
        <h1 className="text-xl font-bold">Sepetim {basket.length} Ürün</h1>
      </header>
      <div className="flex">
        {/* Left Side: Cart Products */}
        <div className="w-2/3 pr-6">
          {basket.length === 0 ? (
            <p className="text-gray-500">Sepetinizde ürün bulunmamaktadır.</p>
          ) : (
            basket.map((product) => (
              <div key={product.id} className="flex items-center bg-white p-4 rounded-lg shadow-md mb-4">
                <Image src={product.imagePath} alt={product.name} width={160} height={160} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1 ml-4">
                  <h2 className="text-sm font-semibold">{product.name}</h2>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    style={{width:"24px", height:"24px"}}
                    className="bg-gray-200 text-orange-500 border border-gray-300"
                    onClick={() => handleQuantityChange(product.id, -1)}
                  >
                    -
                  </Button>
                  <span className="text-sm font-semibold">{product.count}</span>
                  <Button
                    style={{width:"24px", height:"24px"}}
                    className="bg-gray-200 text-orange-500 border border-gray-300"
                    onClick={() => handleQuantityChange(product.id, 1)}
                  >
                    +
                  </Button>
                </div>
                <p className="ml-4 text-sm font-bold">{formatCurrency(product.priceInCents * product.count)}</p>
              </div>
            ))
          )}
        </div>

        {/* Right Side: Order Summary */}
        <div className="w-1/3 bg-white p-4 rounded-lg shadow-md h-[calc(100vh-24rem)] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Sipariş Özeti</h2>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center border-t border-gray-300 pt-2">
              <p className="text-sm font-bold">Ara Toplam:</p>
              <p className="text-sm font-bold">{formatCurrency(total)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-sm font-bold">Toplam:</p>
              <p className="text-sm font-bold">{formatCurrency(total)} <span className='text-xs'> (KDV dahil)</span></p>
            </div>
          </div>
          <Button size="lg" className="w-full bg-blue-600 text-white mt-8">
            Ödemeye Geç
          </Button>
        </div>
      </div>
    </div>
  );
}
