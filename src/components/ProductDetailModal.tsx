import { useState } from 'react';
import { Product, Material, Color } from '@/types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { Badge } from '@/components/ui/badge';
import { Simple3DPreview } from '@/components/3D/Simple3DPreview';
import { ARViewer } from '@/components/ARViewer';
import { ShoppingCart, Palette, Package, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, material: Material, color: Color) => void;
}

export const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }: ProductDetailModalProps) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedColor, setSelectedColor] = useState<Color | null>(null);
  const [isAROpen, setIsAROpen] = useState(false);

  if (!product) return null;

  // Set defaults when product changes
  if (selectedMaterial === null && product.materials.length > 0) {
    setSelectedMaterial(product.materials[0]);
  }
  
  if (selectedColor === null && product.colors.length > 0) {
    const defaultColor = product.colors.find(c => c.materialId === selectedMaterial?.id) || product.colors[0];
    setSelectedColor(defaultColor);
  }

  // Filter colors based on selected material
  const availableColors = selectedMaterial 
    ? product.colors.filter(color => color.materialId === selectedMaterial.id)
    : product.colors;

  const calculatePrice = () => {
    if (!selectedMaterial) return product.price;
    return Math.round(product.price * (1 + selectedMaterial.priceModifier / 100));
  };

  const handleAddToCart = () => {
    if (selectedMaterial && selectedColor) {
      onAddToCart(product, selectedMaterial, selectedColor);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-forest-green">
            {product.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-8 mt-6">
          {/* Product Image and 3D Preview */}
          <div className="space-y-4">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-80 object-cover rounded-lg shadow-product"
              />
              <Badge className="absolute top-4 left-4 bg-forest-green text-warm-cream">
                {product.category}
              </Badge>
            </div>
            
            {selectedColor && (
              <div className="animate-scale-in space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  3D Preview
                </h4>
                <Simple3DPreview 
                  product={product} 
                  selectedColor={selectedColor}
                  className="shadow-product"
                />
                <Button
                  className={cn(buttonVariants({ variant: "terracotta", size: "sm" }), "w-full")}
                  onClick={() => setIsAROpen(true)}
                >
                  <Camera className="w-4 h-4 mr-2" />
                  View in AR
                </Button>
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="text-3xl font-bold text-forest-green mb-2">
                ${calculatePrice().toLocaleString()}
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>
            
            {/* Dimensions */}
            <div className="bg-warm-cream p-4 rounded-lg">
              <h4 className="font-medium text-charcoal mb-2">Dimensions</h4>
              <div className="text-sm text-muted-foreground">
                {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
              </div>
            </div>
            
            {/* Material Selection */}
            <div>
              <h4 className="font-medium text-charcoal mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Material
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {product.materials.map((material) => (
                  <Button
                    key={material.id}
                    className={cn(
                      buttonVariants({ variant: "material" }),
                      selectedMaterial?.id === material.id && "border-forest-green bg-forest-green/10"
                    )}
                    onClick={() => {
                      setSelectedMaterial(material);
                      // Reset color selection when material changes
                      const firstColorForMaterial = product.colors.find(c => c.materialId === material.id);
                      if (firstColorForMaterial) {
                        setSelectedColor(firstColorForMaterial);
                      }
                    }}
                  >
                    <div className="text-left">
                      <div className="font-medium">{material.name}</div>
                      {material.priceModifier !== 0 && (
                        <div className="text-xs text-muted-foreground">
                          {material.priceModifier > 0 ? '+' : ''}{material.priceModifier}%
                        </div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Color Selection */}
            <div>
              <h4 className="font-medium text-charcoal mb-3">Colors</h4>
              <div className="flex flex-wrap gap-3">
                {availableColors.map((color) => (
                  <button
                    key={color.id}
                    className={cn(
                      "w-12 h-12 rounded-full border-4 transition-all hover:scale-110",
                      selectedColor?.id === color.id 
                        ? "border-forest-green shadow-elevated" 
                        : "border-soft-beige shadow-soft hover:border-terracotta"
                    )}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => setSelectedColor(color)}
                    title={color.name}
                  />
                ))}
              </div>
              {selectedColor && (
                <div className="mt-2 text-sm text-muted-foreground">
                  Selected: {selectedColor.name}
                </div>
              )}
            </div>
            
            {/* Add to Cart */}
            <Button
              className={cn(buttonVariants({ variant: "cart", size: "lg" }), "w-full")}
              onClick={handleAddToCart}
              disabled={!selectedMaterial || !selectedColor || !product.inStock}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
        
        <ARViewer
          product={product}
          selectedColor={selectedColor}
          isOpen={isAROpen}
          onClose={() => setIsAROpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};