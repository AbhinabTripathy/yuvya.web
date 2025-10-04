import { useState, useCallback } from 'react';
import { CartItem, Product, Material, Color } from '@/types/product';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((
    product: Product, 
    selectedMaterial: Material, 
    selectedColor: Color, 
    quantity: number = 1
  ) => {
    setCartItems(prev => {
      const existingItemIndex = prev.findIndex(
        item => 
          item.product.id === product.id && 
          item.selectedMaterial.id === selectedMaterial.id &&
          item.selectedColor.id === selectedColor.id
      );

      if (existingItemIndex > -1) {
        const updated = [...prev];
        updated[existingItemIndex].quantity += quantity;
        return updated;
      }

      return [...prev, { product, selectedMaterial, selectedColor, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((itemIndex: number) => {
    setCartItems(prev => prev.filter((_, index) => index !== itemIndex));
  }, []);

  const updateQuantity = useCallback((itemIndex: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemIndex);
      return;
    }
    
    setCartItems(prev => {
      const updated = [...prev];
      updated[itemIndex].quantity = quantity;
      return updated;
    });
  }, [removeFromCart]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => {
      const basePrice = item.product.price;
      const materialMultiplier = 1 + (item.selectedMaterial.priceModifier / 100);
      const finalPrice = basePrice * materialMultiplier;
      return total + (finalPrice * item.quantity);
    }, 0);
  }, [cartItems]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  return {
    cartItems,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
    clearCart,
  };
};