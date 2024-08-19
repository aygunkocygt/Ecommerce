"use client";
import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { CheckoutForm } from './_components/CheckoutForm';
import { useBasket } from '@/context/BasketContext';

export default function PurchasePage() {
  const { basket } = useBasket();  // Get basket items
  const [clientSecret, setClientSecret] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (basket.length > 0) {
      // Toplam tutarı hesapla
      const totalAmount = basket.reduce((total, item) => total + (item.priceInCents * item.count), 0);

      // Sunucuya istek yaparak client secret al
      fetch('/purchase/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount, currency: 'usd' }),  // Örnek olarak USD kullanılıyor
      })
        .then(res => res.json())
        .then(data => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            console.error('Error creating payment intent:', data.error);
            router.push('/error');  // Hata sayfasına yönlendirme
          }
        })
        .catch(err => {
          console.error('Error:', err);
          router.push('/error');  // Hata sayfasına yönlendirme
        });
    }
  }, [basket, router]);

  if (!clientSecret) {
    return <div>Loading...</div>;  // Client secret alınana kadar yükleniyor göstergesi
  }

  return <CheckoutForm basket={basket} clientSecret={clientSecret} />;
}
