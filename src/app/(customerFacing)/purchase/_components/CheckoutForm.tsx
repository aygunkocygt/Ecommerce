"use client";

import React, { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Elements, useElements, useStripe, CardNumberElement, CardExpiryElement, CardCvcElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import BillingInfoForm from "./BillingInfoForm";
import { handlePaymentSuccess } from '@/app/(customerFacing)/_actions/payment';

// Stripe'i yükle
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

type CheckoutFormProps = {
  basket: {
    id: string;
    imagePath: string;
    name: string;
    priceInCents: number;
    description: string;
    count: number;
  }[];
  clientSecret: string; // `clientSecret` prop olarak eklendi
};

export function CheckoutForm({ basket, clientSecret }: CheckoutFormProps) {
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    companyName: "",
    taxOrIdNumber: "",
    billingAddress: "",
    apartment: "",
    city: "",
    district: "",
    shippingAddress: "",
    phone: "",
    email: "",
    termsAccepted: false, // Bu alan burada olabilir, ancak servera gönderilmeyecek
  });

  const [isPaymentFormEnabled, setIsPaymentFormEnabled] = useState(false);
  const totalAmount = basket.reduce((total, item) => total + (item.priceInCents * item.count), 0);

  function handleBillingInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, checked, type } = e.target;
    setBillingInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleBillingInfoSave(data: any) {
    setBillingInfo(data);
    setIsPaymentFormEnabled(true); // İlgili formu etkinleştir
  }

  return (
    <div className="max-w-5xl w-full mx-auto flex space-x-8">
      <div className="w-1/2 space-y-4">
        {/* Billing Info Form */}
        <BillingInfoForm
          isEditable={isPaymentFormEnabled}
          formData={billingInfo}
          onChange={handleBillingInfoChange}
          onSave={handleBillingInfoSave}
        />
      </div>

      <div className="w-1/2 space-y-4">
        {/* Basket Items Card */}
        <Card>
          <CardHeader>
            <CardTitle>Siparişiniz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between pt-1 border-b border-gray-300">
              <div className="text-sm font-semibold">Ürün</div>
              <div className="text-sm font-semibold">Ara Toplam</div>
            </div>
            {basket.map((item, index) => (
              <div key={item.id} className={`flex justify-between py-2 ${index < basket.length - 1 ? "border-b border-gray-300" : ""}`}>
                <div>
                  <div className="text-sm">{item.name} <span className="text-sm font-semibold">x {item.count}</span></div>
                </div>
                <div className="text-sm font-semibold ml-7">{formatCurrency(item.priceInCents)}</div>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-1 border-t border-gray-300">
              <div className="text-sm font-semibold">Toplam</div>
              <div className="text-sm font-semibold">{formatCurrency(totalAmount)}</div>
            </div>
          </CardContent>
        </Card>

        <div className={`${!isPaymentFormEnabled ? 'pointer-events-none opacity-50' : ''}`}>
          <Elements stripe={stripePromise}>
            <PaymentForm clientSecret={clientSecret} priceInCents={totalAmount} basket={basket} billingInfo={billingInfo} />
          </Elements>
        </div>
      </div>
    </div>
  );
}

function PaymentForm({ clientSecret, priceInCents, basket, billingInfo }: { clientSecret: string; priceInCents: number; basket: any; billingInfo: any }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Ödeme amacı oluşturmak ve ödemeyi doğrulamak
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
        },
      });

      if (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Handle successful payment
        const data = {
          email: billingInfo.email,
          basket: basket,
          billingInfo: billingInfo,
        };
        await handlePaymentSuccess(data);
        window.location.href = '/'; // Redirect to home or success page
      } else {
        setErrorMessage('Payment not successful');
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <label className="block">
              <span className="text-xs text-gray-700">Card Number</span>
              <CardNumberElement
                className="text-xs mt-1 block w-full p-2 bg-gray-100 border border-gray-100 rounded-lg"
                options={{
                  style: {
                    base: {
                      fontSize:"0.75rem",
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                          fontSize:"0.75rem"
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-700">Expiry Date</span>
              <CardExpiryElement
                className="text-xs mt-1 block w-full p-2 bg-gray-100 border border-gray-100 rounded-lg"
                options={{
                  style: {
                    base: {
                      fontSize:"0.75rem",
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                          fontSize:"0.75rem"
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-700">CVC</span>
              <CardCvcElement
                className="text-xs mt-1 block w-full p-2 bg-gray-100 border border-gray-100 rounded-lg"
                options={{
                  style: {
                    base: {
                      fontSize:"0.75rem",
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                        fontSize:"0.75rem"
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? "Purchasing..." : `Purchase - ${formatCurrency(priceInCents)}`}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
