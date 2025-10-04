import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { buttonVariants } from '@/components/ui/button-variants';
import { ArrowDown, Sparkles, Camera } from 'lucide-react';
import { ARViewer } from '@/components/ARViewer';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

export const Hero = () => {
  const [isAROpen, setIsAROpen] = useState(false);
  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[80vh] bg-gradient-hero flex items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(245,230,211,0.3),transparent_50%)]" />
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-warm-cream/80 text-forest-green px-4 py-2 rounded-full text-sm font-medium shadow-soft">
            <Sparkles className="w-4 h-4" />
            Premium Furniture Collection
          </div>
          
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-charcoal leading-tight">
            Furnish Your Space with
            <span className="text-forest-green block">Timeless Elegance</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover handcrafted furniture that transforms your house into a home. 
            Experience every piece in stunning 3D before you buy.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              className={buttonVariants({ variant: "hero", size: "xl" })}
              onClick={scrollToProducts}
            >
              Explore Collection
              <ArrowDown className="w-5 h-5 ml-2 animate-float" />
            </Button>
            <Button 
              className={buttonVariants({ variant: "outline", size: "xl" })}
              onClick={() => setIsAROpen(true)}
            >
              <Camera className="w-5 h-5 mr-2" />
              Try AR Now
            </Button>
          </div>
          
          {/* Stats */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center pt-12 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-forest-green">500+</div>
              <div className="text-sm text-muted-foreground">Premium Products</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div className="space-y-1">
              <div className="text-2xl font-bold text-forest-green">10k+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-border" />
            <div className="space-y-1">
              <div className="text-2xl font-bold text-forest-green">3D+AR</div>
              <div className="text-sm text-muted-foreground">Preview Technology</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-terracotta/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-forest-green/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 right-20 w-8 h-8 bg-soft-beige rounded-full animate-float" style={{ animationDelay: '2s' }} />
      
      {/* AR Demo Modal */}
      <ARViewer
        product={products[0]} // Default to first product for demo
        selectedColor={products[0].colors[0]}
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
      />
    </section>
  );
};