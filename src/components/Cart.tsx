import { CartItem } from '@/types/product';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Minus, Plus, Trash2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CartProps {
  cartItems: CartItem[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateQuantity: (itemIndex: number, quantity: number) => void;
  onRemoveItem: (itemIndex: number) => void;
  onCheckout: () => void;
  totalPrice: number;
  totalItems: number;
}

export const Cart = ({ 
  cartItems, 
  isOpen, 
  onOpenChange, 
  onUpdateQuantity, 
  onRemoveItem, 
  onCheckout,
  totalPrice,
  totalItems 
}: CartProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className={cn(buttonVariants({ variant: "outline" }), "relative")}>
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-terracotta text-warm-cream min-w-[20px] h-5 flex items-center justify-center text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-forest-green">
            <ShoppingCart className="w-5 h-5" />
            Shopping Cart ({totalItems} items)
          </SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4 flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const itemPrice = Math.round(item.product.price * (1 + item.selectedMaterial.priceModifier / 100));
              const totalItemPrice = itemPrice * item.quantity;
              
              return (
                <div key={index} className="bg-warm-cream rounded-lg p-4 space-y-3">
                  <div className="flex gap-3">
                    <img 
                      src={item.product.image} 
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg shadow-soft"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-charcoal">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedMaterial.name} • {item.selectedColor.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-4 h-4 rounded-full border border-soft-beige"
                          style={{ backgroundColor: item.selectedColor.hex }}
                        />
                        <span className="text-sm font-medium text-forest-green">
                          ${itemPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-forest-green">
                        ${totalItemPrice.toLocaleString()}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onRemoveItem(index)}
                        className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="border-t border-soft-beige pt-4 mt-6 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-charcoal">Total:</span>
              <span className="text-forest-green">${totalPrice.toLocaleString()}</span>
            </div>
            
            <Button
              className={cn(buttonVariants({ variant: "hero", size: "lg" }), "w-full")}
              onClick={onCheckout}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};