import { useState, useMemo } from 'react';
import { products } from '@/data/products';
import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { Badge } from '@/components/ui/badge';
import { Package, Camera, Upload } from 'lucide-react';

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const {
    cartItems,
    isOpen: isCartOpen,
    setIsOpen: setCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    getTotalItems,
  } = useCart();

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleQuickAddToCart = (product: Product) => {
    // Add with default selections
    const defaultMaterial = product.materials[0];
    const defaultColor = product.colors.find(c => c.materialId === defaultMaterial.id) || product.colors[0];
    addToCart(product, defaultMaterial, defaultColor);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleAddToCartFromModal = (product: Product, material: any, color: any) => {
    addToCart(product, material, color);
    toast({
      title: "Added to cart!",
      description: `${product.name} in ${material.name} (${color.name}) has been added to your cart.`,
    });
  };

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality would be implemented with Supabase backend integration.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        cartItems={cartItems}
        isCartOpen={isCartOpen}
        onCartOpenChange={setCartOpen}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        totalPrice={getTotalPrice()}
        totalItems={getTotalItems()}
        onSearch={setSearchQuery}
      />
      
      <main>
        <Hero />
        
        {/* Products section */}
        <section id="products" className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
                Our Collection
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Each piece is carefully crafted with premium materials and attention to detail
              </p>
            </div>
            
            {/* Category filter */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm font-medium capitalize hover:bg-forest-green hover:text-warm-cream transition-colors"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
            
            {/* Search results info */}
            {(searchQuery || selectedCategory !== 'all') && (
              <div className="text-center mb-8">
                <p className="text-muted-foreground">
                  Showing {filteredProducts.length} products
                  {searchQuery && ` for "${searchQuery}"`}
                  {selectedCategory !== 'all' && ` in ${selectedCategory}`}
                </p>
              </div>
            )}
            
            {/* Products grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetails={handleViewDetails}
                  onAddToCart={handleQuickAddToCart}
                />
              ))}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium text-charcoal mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </section>
        
        {/* Features section */}
        <section className="py-16 bg-warm-cream/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">
                Experience Furniture Like Never Before
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Revolutionary AR technology lets you see exactly how furniture fits in your space
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8 text-forest-green" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal">3D Preview</h3>
                <p className="text-muted-foreground">
                  Rotate, zoom, and explore every detail in stunning 3D before making your purchase
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-terracotta" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal">AR Camera View</h3>
                <p className="text-muted-foreground">
                  Use your phone camera to place furniture in your real space with augmented reality
                </p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-soft-beige rounded-full flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-charcoal" />
                </div>
                <h3 className="text-xl font-semibold text-charcoal">Photo Upload</h3>
                <p className="text-muted-foreground">
                  Upload photos of your room and virtually place furniture to see the perfect fit
                </p>
              </div>
            </div>
            
            {/* AR Instructions */}
            <div className="mt-16 bg-background rounded-2xl p-8 shadow-soft">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-charcoal mb-2">How to Use AR</h3>
                <p className="text-muted-foreground">Get started with AR furniture preview in 3 simple steps</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-forest-green text-warm-cream rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-2">Choose Your Furniture</h4>
                    <p className="text-sm text-muted-foreground">Select any furniture piece and click "View in AR" to start the experience</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-terracotta text-warm-cream rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-2">Capture or Upload</h4>
                    <p className="text-sm text-muted-foreground">Use your camera for live AR or upload a photo of your room</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-charcoal text-warm-cream rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-charcoal mb-2">Position & Preview</h4>
                    <p className="text-sm text-muted-foreground">Move, scale, and rotate the furniture to find the perfect placement</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCartFromModal}
      />
    </div>
  );
};

export default Index;
