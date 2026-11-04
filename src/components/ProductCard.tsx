import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, Star, ShoppingBag, Eye, Scale } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isWishlisted: boolean;
  isCompared?: boolean;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isWishlisted,
  isCompared = false,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onBuyNow,
  onQuickView
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(product.defaultSize || product.sizes[0]);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Price adjustment if size differs from default
  const sizeMultiplier = selectedSize.includes('2kg') || selectedSize.includes('2 Litre')
    ? 1.9
    : selectedSize.includes('1kg') && product.defaultSize === '500g'
    ? 1.85
    : selectedSize.includes('900g')
    ? 1.9
    : 1.0;

  const currentPrice = Math.round(product.price * (product.defaultSize === selectedSize ? 1 : sizeMultiplier));
  const oldPrice = Math.round(product.oldPrice * (product.defaultSize === selectedSize ? 1 : sizeMultiplier));

  return (
    <div className={`group bg-white border rounded-xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
      isCompared ? 'border-[#174B3B] ring-1 ring-[#174B3B]' : 'border-[#E8DED0] hover:border-[#C99A43]/50'
    }`}>
      
      {/* Product Image Container */}
      <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-[#FBF7EF] flex items-center justify-center">
        
        {/* Fallback pattern while loading */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#FBF7EF] animate-pulse flex items-center justify-center text-[#777168]/40">
            <span className="text-xs uppercase tracking-widest font-medium">Pure Harvest</span>
          </div>
        )}

        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
            if (product.id === 'khalis-cow-ghee') {
              e.currentTarget.src = '/images/khalis_cow_ghee.jpg';
            } else if (product.id.includes('ghee')) {
              e.currentTarget.src = '/images/pure_desi_ghee.jpg';
            } else if (product.id.includes('honey')) {
              e.currentTarget.src = '/images/organic_honey.jpg';
            } else if (product.id.includes('achar')) {
              e.currentTarget.src = '/images/traditional_mix_achar.jpg';
            } else {
              e.currentTarget.src = '/images/hero_banner.jpg';
            }
          }}
          className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
        />

        {/* Badge on Top-Left */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-block bg-[#174B3B] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-sm shadow-sm">
              {product.badge}
            </span>
          </div>
        )}

        {/* Top-Right Quick View, Compare & Wishlist Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          {/* Wishlist */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(product.id);
            }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            title="Wishlist"
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
              isWishlisted
                ? 'bg-[#174B3B] text-white'
                : 'bg-white/95 text-[#25231F] hover:text-[#174B3B] hover:scale-110'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
          </button>

          {/* Quick View */}
          <button
            onClick={() => onQuickView(product)}
            aria-label="Quick preview product"
            title="Quick view"
            className="w-8 h-8 rounded-full bg-white/95 text-[#25231F] hover:text-[#174B3B] hover:scale-110 flex items-center justify-center transition-all duration-200 shadow-sm opacity-90 group-hover:opacity-100"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Compare Toggle Button */}
          {onToggleCompare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product.id);
              }}
              aria-label={isCompared ? "Remove from comparison" : "Add to comparison (up to 3)"}
              title={isCompared ? "In comparison (click to remove)" : "Compare with other products"}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm ${
                isCompared
                  ? 'bg-[#C99A43] text-[#10392E] ring-2 ring-[#174B3B]'
                  : 'bg-white/95 text-[#25231F] hover:text-[#174B3B] hover:scale-110'
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between">
        <div>
          {/* Category kicker */}
          <div className="flex items-center justify-between text-xs text-[#777168] mb-1">
            <span className="uppercase tracking-wider font-medium text-[11px] text-[#C99A43]">
              {product.categoryLabel}
            </span>
            <div className="flex items-center gap-1 text-[#C99A43]">
              <Star className="w-3.5 h-3.5 fill-[#C99A43] text-[#C99A43]" />
              <span className="text-xs font-semibold text-[#25231F] tabular-nums">{product.rating.toFixed(1)}</span>
              <span className="text-[11px] text-[#777168]">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onQuickView(product)}
            className="font-serif text-lg sm:text-xl font-bold text-[#25231F] group-hover:text-[#174B3B] transition-colors cursor-pointer line-clamp-1 mb-1.5"
          >
            {product.name}
          </h3>

          {/* Short Description */}
          <p className="text-xs sm:text-[13px] text-[#777168] line-clamp-2 leading-relaxed mb-3.5">
            {product.description}
          </p>

          {/* Size / Weight Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-4">
              <div className="text-[11px] font-medium text-[#777168] mb-1.5 flex items-center justify-between">
                <span>Select Size:</span>
                {onToggleCompare && (
                  <button
                    type="button"
                    onClick={() => onToggleCompare(product.id)}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                      isCompared ? 'text-[#174B3B]' : 'text-[#777168] hover:text-[#174B3B]'
                    }`}
                  >
                    <Scale className="w-3 h-3" />
                    <span>{isCompared ? '✓ Compared' : '+ Compare'}</span>
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`text-xs px-2.5 py-1 rounded transition-colors font-medium ${
                      selectedSize === size
                        ? 'bg-[#174B3B] text-white shadow-xs'
                        : 'bg-[#FBF7EF] text-[#25231F] border border-[#E8DED0] hover:border-[#174B3B]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pricing and Action Buttons (Aligned to bottom) */}
        <div className="pt-3 border-t border-[#E8DED0]/60">
          <div className="flex items-baseline gap-2 mb-3.5">
            <span className="text-lg sm:text-xl font-bold text-[#174B3B] tabular-nums">
              Rs. {currentPrice.toLocaleString()}
            </span>
            {oldPrice > currentPrice && (
              <span className="text-xs sm:text-sm text-[#777168] line-through tabular-nums">
                Rs. {oldPrice.toLocaleString()}
              </span>
            )}
            <span className="text-[11px] font-semibold text-[#C99A43] ml-auto">
              Save {Math.round(((oldPrice - currentPrice) / oldPrice) * 100)}%
            </span>
          </div>

          {/* Dual Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product, selectedSize)}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-[#FBF7EF] text-[#174B3B] border border-[#174B3B] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={() => onBuyNow(product, selectedSize)}
              className="w-full inline-flex items-center justify-center py-2.5 px-3 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-sm"
            >
              Buy Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
