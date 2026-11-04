import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface CustomerFavoritesProps {
  products: Product[];
  wishlist: string[];
  compareList?: string[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const CustomerFavorites: React.FC<CustomerFavoritesProps> = ({
  products,
  wishlist,
  compareList = [],
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onBuyNow,
  onQuickView
}) => {
  // 4 top customer favorites / best sellers
  const favoriteProducts = products
    .filter(p => p.isBestSeller || p.badge === 'BEST SELLER' || p.badge === 'ORGANIC')
    .slice(0, 4);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-[0.25em] text-[#C99A43] uppercase mb-2 block">
            Most Loved By Pakistani Households
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174B3B] mb-3">
            OUR CUSTOMER FAVORITES
          </h2>
          <p className="text-sm sm:text-base text-[#777168] leading-relaxed">
            Proven staples celebrated for their rich taste, authentic texture, and purity.
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="h-[1px] w-12 bg-[#E8DED0]" />
            <span className="w-2 h-2 rounded-full bg-[#C99A43]" />
            <span className="h-[1px] w-12 bg-[#E8DED0]" />
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {favoriteProducts.map((product) => (
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
