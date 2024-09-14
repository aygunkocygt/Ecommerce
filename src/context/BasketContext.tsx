"use client";

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { BasketItem} from '@/lib/types'

// Sepet durumu tipi


type BasketState = BasketItem[];

type BasketAction = 
  | { type: 'ADD_TO_BASKET'; payload: BasketItem }
  | { type: 'REMOVE_FROM_BASKET'; payload: { id: string } }
  | { type: 'CLEAR_BASKET' }
  | { type: 'INIT_BASKET'; payload: BasketItem[] }
  | { type: 'INCREMENT_ITEM_COUNT'; payload: { id: string } }
  | { type: 'DECREMENT_ITEM_COUNT'; payload: { id: string } };

const BasketContext = createContext<{ basket: BasketState; dispatch: React.Dispatch<BasketAction> } | undefined>(undefined);

const basketReducer = (state: BasketState, action: BasketAction): BasketState => {
  switch (action.type) {
    case 'ADD_TO_BASKET':
      const existingItem = state.find(item => item.id === action.payload.id);
      if (existingItem) {
        return state.map(item =>
          item.id === action.payload.id
            ? { ...item, count: item.count + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, count: 1 }];
    case 'REMOVE_FROM_BASKET':
      return state.filter(item => item.id !== action.payload.id);
    case 'CLEAR_BASKET':
      return [];
    case 'INIT_BASKET':
      return action.payload;
    case 'INCREMENT_ITEM_COUNT':
      return state.map(item =>
        item.id === action.payload.id ? { ...item, count: item.count + 1 } : item
      );
    case 'DECREMENT_ITEM_COUNT':
      return state.map(item =>
        item.id === action.payload.id ? { ...item, count: Math.max(item.count - 1, 0) } : item
      ).filter(item => item.count > 0);
    default:
      return state;
  }
};

export const BasketProvider = ({ children }: { children: ReactNode }) => {
  const [basket, dispatch] = useReducer(basketReducer, []);

  useEffect(() => {
    const storedBasket = localStorage.getItem('basket');
    if (storedBasket) {
      dispatch({ type: 'INIT_BASKET', payload: JSON.parse(storedBasket) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('basket', JSON.stringify(basket));
  }, [basket]);

  return (
    <BasketContext.Provider value={{ basket, dispatch }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};


