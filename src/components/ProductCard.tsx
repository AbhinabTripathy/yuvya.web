import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { cn } from '@/lib/utils';
import { Eye, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard = ({ product, onViewDetails, onAddToCart }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-card rounded-lg shadow-soft hover:shadow-product transition-all duration-300 overflow-hidden group animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className={cn(
          "absolute inset-0 bg-charcoal/0 transition-all duration-300",
          isHovered && "bg-charcoal/20"
        )}>
          <div className={cn(
            "absolute inset-0 flex items-center justify-center gap-3 opacity-0 transition-opacity duration-300",
            isHovered && "opacity-100"
          )}>
            <Button
              className={buttonVariants({ variant: "hero", size: "sm" })}
              onClick={() => onViewDetails(product)}
            >
              <Eye className="w-4 h-4 mr-2" />
              View
            </Button>
            <Button
              className={buttonVariants({ variant: "terracotta", size: "sm" })}
              onClick={() => onAddToCart(product)}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </div>
        {!product.inStock && (
          <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-2">
          <span className="text-sm text-muted-foreground font-medium tracking-wide uppercase">
            {product.category}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-forest-green transition-colors">
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-forest-green">
            ${product.price.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground">
            {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
          </div>
        </div>
        
        <div className="mt-4 flex gap-2">
          {product.colors.slice(0, 4).map((color) => (
            <div
              key={color.id}
              className="w-6 h-6 rounded-full border-2 border-soft-beige shadow-sm"
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
          {product.colors.length > 4 && (
            <div className="w-6 h-6 rounded-full border-2 border-soft-beige bg-muted flex items-center justify-center text-xs font-medium">
              +{product.colors.length - 4}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};