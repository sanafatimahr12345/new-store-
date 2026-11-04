import React, { useState } from 'react';
import { Product } from '../types';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Check, Sparkles, Truck, ArrowRight, Scale } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  isWishlisted: boolean;
  isCompared?: boolean;
  onToggleWishlist: (productId: string) => void;
  onToggleCompare?: (productId: string) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onBuyNow: (product: Product, size: string, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  isWishlisted,
  isCompared = false,
  onToggleWishlist,
  onToggleCompare,
  onAddToCart,
  onBuyNow
}) => {
  if (!isOpen || !product) return null;

  const [selectedSize, setSelectedSize] = useState<string>(product.defaultSize || product.sizes[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'nutrition'>('details');

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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DED0] animate-in zoom-in-95">
        
        {/* Modal Top Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs px-6 py-4 border-b border-[#E8DED0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#C99A43] uppercase tracking-wider">
              {product.categoryLabel}
            </span>
            <span className="text-[#E8DED0]">·</span>
            <span className="text-xs text-[#777168]">{product.origin}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#FBF7EF] text-[#25231F] hover:text-[#174B3B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Grid */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left: Product Image */}
          <div className="relative rounded-2xl overflow-hidden bg-[#FBF7EF] border border-[#E8DED0] aspect-[4/3] md:aspect-square">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
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
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#174B3B] text-white text-[11px] font-bold px-3 py-1 rounded-sm uppercase tracking-wider shadow-sm">
                {product.badge}
              </span>
            )}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              {onToggleCompare && (
                <button
                  onClick={() => onToggleCompare(product.id)}
                  title={isCompared ? "In comparison (click to remove)" : "Compare with other products (up to 3)"}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isCompared
                      ? 'bg-[#C99A43] text-[#10392E] ring-2 ring-[#174B3B]'
                      : 'bg-white text-[#25231F] hover:text-[#174B3B]'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => onToggleWishlist(product.id)}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isWishlisted ? 'bg-[#174B3B] text-white' : 'bg-white text-[#25231F] hover:text-[#174B3B]'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Right: Product Details & Purchase Form */}
          <div className="flex flex-col">
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center text-[#C99A43]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C99A43] text-[#C99A43]" />
                ))}
              </div>
              <span className="text-xs font-bold text-[#25231F]">{product.rating.toFixed(1)}</span>
              <span className="text-xs text-[#777168]">({product.reviewsCount} customer reviews)</span>
            </div>

            {/* Title */}
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#174B3B] mb-2">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-2xl font-bold text-[#174B3B] tabular-nums">
                Rs. {currentPrice.toLocaleString()}
              </span>
              {oldPrice > currentPrice && (
                <span className="text-base text-[#777168] line-through tabular-nums">
                  Rs. {oldPrice.toLocaleString()}
                </span>
              )}
              <span className="text-xs font-semibold text-[#C99A43] bg-[#FBF7EF] px-2 py-0.5 rounded border border-[#E8DED0]">
                Save Rs. {(oldPrice - currentPrice).toLocaleString()}
              </span>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-[#25231F]/90 leading-relaxed mb-6">
              {product.description}
            </p>

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-[#25231F] uppercase tracking-wider mb-2">
                  Select Quantity / Size:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                        selectedSize === s
                          ? 'bg-[#174B3B] text-white shadow-sm'
                          : 'bg-[#FBF7EF] text-[#25231F] border border-[#E8DED0] hover:border-[#174B3B]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Buttons */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-[#25231F] uppercase tracking-wider">
                  Units:
                </span>
                <div className="flex items-center border border-[#E8DED0] bg-[#FBF7EF] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-[#25231F] hover:bg-white transition-colors"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-bold text-[#25231F] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm font-bold text-[#25231F] hover:bg-white transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-[#777168] tabular-nums">
                  Total: <strong>Rs. {(currentPrice * quantity).toLocaleString()}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    onAddToCart(product, selectedSize, quantity);
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-white hover:bg-[#FBF7EF] text-[#174B3B] border border-[#174B3B] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, selectedSize, quantity);
                    onClose();
                  }}
                  className="w-full inline-flex items-center justify-center py-3 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md"
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Info Tabs */}
            <div className="border-t border-[#E8DED0] pt-4">
              <div className="flex gap-4 border-b border-[#E8DED0] text-xs font-semibold uppercase tracking-wider mb-3">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'details' ? 'border-[#174B3B] text-[#174B3B]' : 'border-transparent text-[#777168]'
                  }`}
                >
                  Heritage Story
                </button>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'ingredients' ? 'border-[#174B3B] text-[#174B3B]' : 'border-transparent text-[#777168]'
                  }`}
                >
                  Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('nutrition')}
                  className={`pb-2 border-b-2 transition-colors ${
                    activeTab === 'nutrition' ? 'border-[#174B3B] text-[#174B3B]' : 'border-transparent text-[#777168]'
                  }`}
                >
                  Health Benefits
                </button>
              </div>

              {activeTab === 'details' && (
                <p className="text-xs text-[#777168] leading-relaxed">
                  {product.longDescription}
                </p>
              )}

              {activeTab === 'ingredients' && (
                <ul className="text-xs text-[#777168] space-y-1 list-disc list-inside">
                  {product.ingredients.map((ing, i) => (
                    <li key={i}>{ing}</li>
                  ))}
                </ul>
              )}

              {activeTab === 'nutrition' && (
                <ul className="text-xs text-[#777168] space-y-1 list-disc list-inside">
                  {product.nutritionalHighlights.map((n, i) => (
                    <li key={i}>{n}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Purity Guarantee badge */}
            <div className="mt-5 p-3 rounded-lg bg-[#FBF7EF] border border-[#E8DED0] flex items-center gap-2.5 text-xs text-[#174B3B]">
              <ShieldCheck className="w-4 h-4 text-[#C99A43] shrink-0" />
              <span>100% Adulteration-Free Guarantee · Lab Verified Purity</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
