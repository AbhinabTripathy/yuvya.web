import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { Input } from '@/components/ui/input';
import { Search, Menu, X } from 'lucide-react';
import { Cart } from '@/components/Cart';
import { CartItem } from '@/types/product';
import { cn } from '@/lib/utils';

interface HeaderProps {
  cartItems: CartItem[];
  isCartOpen: boolean;
  onCartOpenChange: (open: boolean) => void;
  onUpdateQuantity: (itemIndex: number, quantity: number) => void;
  onRemoveItem: (itemIndex: number) => void;
  onCheckout: () => void;
  totalPrice: number;
  totalItems: number;
  onSearch: (query: string) => void;
}

export const Header = ({
  cartItems,
  isCartOpen,
  onCartOpenChange,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totalPrice,
  totalItems,
  onSearch
}: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold text-forest-green">
              Furnish
            </h1>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-foreground hover:text-forest-green transition-colors">
                Seating
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover:text-forest-green transition-colors">
                Tables
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover:text-forest-green transition-colors">
                Storage
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover:text-forest-green transition-colors">
                New Arrivals
              </a>
            </nav>
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <Input
                type="search"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button 
                type="submit"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-l-none border-l-0")}
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Button className={buttonVariants({ variant: "ghost" })}>
                Login
              </Button>
              <Button className={buttonVariants({ variant: "terracotta" })}>
                Sign Up
              </Button>
            </div>

            <Cart
              cartItems={cartItems}
              isOpen={isCartOpen}
              onOpenChange={onCartOpenChange}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              onCheckout={onCheckout}
              totalPrice={totalPrice}
              totalItems={totalItems}
            />

            {/* Mobile menu button */}
            <Button
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-4">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="flex">
              <Input
                type="search"
                placeholder="Search furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-r-none"
              />
              <Button 
                type="submit"
                className={cn(buttonVariants({ variant: "outline" }), "rounded-l-none border-l-0")}
              >
                <Search className="w-4 h-4" />
              </Button>
            </form>

            {/* Mobile navigation */}
            <nav className="flex flex-col gap-3">
              <a href="#" className="text-sm font-medium text-foreground hover:text-forest-green transition-colors">
                Seating
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover:text-forest-green transition-colors">
                Tables
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover:text-forest-green transition-colors">
                Storage
              </a>
              <a href="#" className="text-sm font-medium text-foreground hover:text-forest-green transition-colors">
                New Arrivals
              </a>
            </nav>

            <div className="flex gap-2 pt-4 border-t border-border">
              <Button className={cn(buttonVariants({ variant: "ghost" }), "flex-1")}>
                Login
              </Button>
              <Button className={cn(buttonVariants({ variant: "terracotta" }), "flex-1")}>
                Sign Up
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};