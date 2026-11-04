import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FeaturedProductsProps {
  products: Product[];
  wishlist: string[];
  compareList?: string[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  products,
  wishlist,
  compareList = [],
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onBuyNow,
  onQuickView
}) => {
  // Specifically the 3 core hero products described in Section 5
  const heroProducts = products.filter(p => 
    p.id === 'desi-ghee-pure' || p.id === 'organic-honey-pure' || p.id === 'traditional-mix-achar'
  );

  return (
    <section id="featured-products-section" className="bg-white py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold tracking-[0.2em] text-[#C99A43] uppercase mb-2 block">
            Handcrafted Heritage
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174B3B] mb-3">
            OUR PURE PRODUCTS
          </h2>
          <p className="text-sm sm:text-base text-[#777168] leading-relaxed">
            Nature's finest ingredients, carefully prepared for your family.
          </p>

          {/* Subtle Decorative Golden Separator */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="h-[1px] w-12 bg-[#E8DED0]" />
            <span className="w-2 h-2 rounded-full bg-[#C99A43]" />
            <span className="h-[1px] w-12 bg-[#E8DED0]" />
          </div>
        </div>

        {/* 3 Premium Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {heroProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isWishlisted={wishlist.includes(product.id)}
              isCompared={compareList.includes(product.id)}
              onToggleWishlist={onToggleWishlist}
              onToggleCompare={onToggleCompare}
              onAddToCart={onAddToCart}
              onBuyNow={onBuyNow}
              onQuickView={onQuickView}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
