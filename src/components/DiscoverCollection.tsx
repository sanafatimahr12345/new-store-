import React from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { CATEGORIES } from '../data/products';

interface DiscoverCollectionProps {
  products: Product[];
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  wishlist: string[];
  compareList?: string[];
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const DiscoverCollection: React.FC<DiscoverCollectionProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  wishlist,
  compareList = [],
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onBuyNow,
  onQuickView
}) => {
  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const categoryDefinitions: { id: ProductCategory; name: string }[] = [
    { id: 'all', name: 'All Products' },
    { id: 'ghee', name: 'Desi Ghee' },
    { id: 'honey', name: 'Organic Honey' },
    { id: 'pickles', name: 'Traditional Pickles' },
    { id: 'spices', name: 'Organic Spices' },
    { id: 'oils', name: 'Natural Oils' },
  ];

  // Show All and categories that have items or are main staples
  const activeCategories = categoryDefinitions.filter(
    (c) => c.id === 'all' || products.some((p) => p.category === c.id) || ['ghee', 'honey', 'pickles'].includes(c.id)
  );

  return (
    <section id="all-products-section" className="bg-white py-16 sm:py-20 border-t border-[#E8DED0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-[0.25em] text-[#C99A43] uppercase mb-2 block">
            Pure & Natural Catalog ({products.length} Items)
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174B3B] mb-3">
            DISCOVER OUR COLLECTION
          </h2>
          <p className="text-sm sm:text-base text-[#777168] leading-relaxed">
            Explore authentic Pakistani traditional staples prepared in small artisanal batches.
          </p>
        </div>

        {/* Interactive Category Filter Tabs with Live Item Counts */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-10">
          {activeCategories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = cat.id === 'all' 
              ? products.length 
              : products.filter(p => p.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#174B3B] text-white shadow-md'
                    : 'bg-[#FBF7EF] text-[#25231F] hover:bg-[#F3EBDD] border border-[#E8DED0]'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? 'bg-[#DCA83F] text-[#10392E]' : 'bg-[#E8DED0] text-[#777168]'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {filteredProducts.map((product) => (
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 bg-[#FBF7EF] rounded-xl border border-dashed border-[#E8DED0]">
            <p className="text-sm text-[#777168]">No items found in this category right now.</p>
            <button
              onClick={() => onSelectCategory('all')}
              className="mt-3 text-xs font-bold uppercase tracking-wider text-[#174B3B] underline"
            >
              View all products
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
