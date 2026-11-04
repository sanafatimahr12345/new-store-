import React from 'react';
import { Product } from '../types';
import { X, Scale, Star, ShoppingBag, ArrowRight, Check, Trash2, Plus } from 'lucide-react';

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  allProducts: Product[];
  onRemoveFromCompare: (productId: string) => void;
  onAddToCompare: (productId: string) => void;
  onClearCompare: () => void;
  onAddToCart: (product: Product, size: string) => void;
  onBuyNow: (product: Product, size: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  allProducts,
  onRemoveFromCompare,
  onAddToCompare,
  onClearCompare,
  onAddToCart,
  onBuyNow
}) => {
  if (!isOpen) return null;

  const emptySlotsCount = Math.max(0, 3 - comparedProducts.length);
  const remainingProducts = allProducts.filter(
    (p) => !comparedProducts.some((cp) => cp.id === p.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DED0] animate-in zoom-in-95 flex flex-col">
        
        {/* Modal Sticky Header */}
        <div className="sticky top-0 z-20 bg-[#FBF7EF] px-5 sm:px-6 py-4 border-b border-[#E8DED0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#174B3B] text-[#DCA83F] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-[#174B3B]">
                Product Comparison ({comparedProducts.length}/3)
              </h2>
              <p className="text-xs text-[#777168]">
                Compare pure ingredients, heritage source, pricing, and nutritional benefits side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedProducts.length > 0 && (
              <button
                onClick={onClearCompare}
                className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#777168] hover:text-rose-600 hover:bg-white border border-[#E8DED0] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white text-[#25231F] hover:text-[#174B3B] transition-colors"
              aria-label="Close comparison modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 md:p-8 flex-1">
          {comparedProducts.length === 0 ? (
            <div className="text-center py-16">
              <Scale className="w-12 h-12 text-[#E8DED0] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#25231F] mb-1">
                No products selected for comparison
              </h3>
              <p className="text-xs text-[#777168] max-w-sm mx-auto mb-6">
                Select up to three items from our organic desi foods collection to analyze their features and purity side-by-side.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#174B3B] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#10392E] transition-colors"
              >
                Explore Products
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-[680px]">
                
                {/* 3 Columns Grid for Products */}
                <div className="grid grid-cols-3 gap-4 sm:gap-6 items-start">
                  
                  {comparedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl border border-[#E8DED0] p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:border-[#174B3B]/40 transition-colors"
                    >
                      {/* Top Remove Action */}
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C99A43] bg-[#FBF7EF] px-2 py-0.5 rounded border border-[#E8DED0]">
                          {product.categoryLabel}
                        </span>
                        <button
                          onClick={() => onRemoveFromCompare(product.id)}
                          className="text-[#777168] hover:text-rose-600 transition-colors p-1"
                          title="Remove from comparison"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Image */}
                      <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#FBF7EF] border border-[#E8DED0] mb-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Title & Badge */}
                      <div className="min-h-[58px] mb-2">
                        <h4 className="font-serif text-base font-bold text-[#174B3B] line-clamp-2">
                          {product.name}
                        </h4>
                        {product.badge && (
                          <span className="inline-block text-[9px] font-bold text-white bg-[#174B3B] px-1.5 py-0.5 rounded mt-1">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-1 text-[#C99A43] text-xs mb-3">
                        <Star className="w-3.5 h-3.5 fill-[#C99A43] text-[#C99A43]" />
                        <span className="font-bold text-[#25231F] tabular-nums">{product.rating.toFixed(1)}</span>
                        <span className="text-[#777168] text-[11px]">({product.reviewsCount} reviews)</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline gap-2 mb-4 pb-3 border-b border-[#E8DED0]">
                        <span className="text-lg font-bold text-[#174B3B] tabular-nums">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        {product.oldPrice > product.price && (
                          <span className="text-xs text-[#777168] line-through tabular-nums">
                            Rs. {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Feature Comparison Rows */}
                      <div className="space-y-4 text-xs mb-6">
                        
                        {/* Description */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#777168] block mb-1">
                            Description
                          </span>
                          <p className="text-[11px] sm:text-xs text-[#25231F]/90 leading-relaxed min-h-[48px]">
                            {product.description}
                          </p>
                        </div>

                        {/* Origin */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#777168] block mb-1">
                            Origin / Region
                          </span>
                          <div className="text-[11px] font-semibold text-[#174B3B] bg-[#FBF7EF] p-2 rounded border border-[#E8DED0]">
                            {product.origin}
                          </div>
                        </div>

                        {/* Available Sizes */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#777168] block mb-1">
                            Available Sizes
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {product.sizes.map((s) => (
                              <span
                                key={s}
                                className="px-2 py-0.5 bg-[#FBF7EF] border border-[#E8DED0] rounded text-[10px] font-medium text-[#25231F]"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Key Ingredients */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#777168] block mb-1">
                            Pure Ingredients
                          </span>
                          <ul className="text-[11px] text-[#777168] space-y-1 list-disc list-inside bg-[#FBF7EF]/50 p-2.5 rounded-lg border border-[#E8DED0]">
                            {product.ingredients.slice(0, 3).map((ing, i) => (
                              <li key={i} className="line-clamp-1">{ing}</li>
                            ))}
                            {product.ingredients.length > 3 && (
                              <li className="text-[10px] text-[#C99A43] font-semibold list-none pl-1">
                                + {product.ingredients.length - 3} more natural ingredients
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Nutritional Highlights */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#777168] block mb-1">
                            Key Benefits
                          </span>
                          <div className="space-y-1">
                            {product.nutritionalHighlights.map((nh, i) => (
                              <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#25231F]">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="line-clamp-1">{nh}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* In-Stock Status */}
                        <div>
                          <span className="text-[10px] uppercase font-bold text-[#777168] block mb-1">
                            Availability
                          </span>
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            product.inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {product.inStock ? 'In Stock (Fresh Batch)' : 'Temporarily Out of Stock'}
                          </span>
                        </div>

                      </div>

                      {/* Primary Actions for this Product */}
                      <div className="space-y-2 pt-3 border-t border-[#E8DED0]">
                        <button
                          onClick={() => {
                            onAddToCart(product, product.defaultSize);
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 bg-white hover:bg-[#FBF7EF] text-[#174B3B] border border-[#174B3B] rounded-lg text-xs font-bold uppercase tracking-wider transition-colors active:scale-95"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => {
                            onClose();
                            onBuyNow(product, product.defaultSize);
                          }}
                          className="w-full inline-flex items-center justify-center py-2 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors active:scale-95 shadow-sm"
                        >
                          Buy Now
                        </button>
                      </div>

                    </div>
                  ))}

                  {/* Empty slots placeholders with quick-add selector */}
                  {Array.from({ length: emptySlotsCount }).map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="bg-[#FBF7EF]/40 border-2 border-dashed border-[#E8DED0] rounded-xl p-6 text-center flex flex-col items-center justify-center min-h-[460px]"
                    >
                      <div className="w-12 h-12 rounded-full bg-white border border-[#E8DED0] flex items-center justify-center text-[#777168] mb-3">
                        <Plus className="w-6 h-6 text-[#777168]" />
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#25231F] mb-1">
                        Add Product to Compare
                      </h4>
                      <p className="text-[11px] text-[#777168] max-w-xs mb-4">
                        Select another traditional staple to evaluate side-by-side.
                      </p>

                      {remainingProducts.length > 0 && (
                        <div className="w-full max-w-xs space-y-2">
                          <label className="text-[10px] uppercase font-bold text-[#777168] block">
                            Quick Select:
                          </label>
                          <div className="space-y-1.5 max-h-48 overflow-y-auto text-left">
                            {remainingProducts.map((remProd) => (
                              <button
                                key={remProd.id}
                                onClick={() => onAddToCompare(remProd.id)}
                                className="w-full flex items-center gap-2 p-2 rounded-lg bg-white hover:bg-[#FBF7EF] border border-[#E8DED0] text-xs font-medium text-[#25231F] transition-colors"
                              >
                                <img
                                  src={remProd.image}
                                  alt={remProd.name}
                                  className="w-8 h-8 object-cover rounded border border-[#E8DED0]"
                                />
                                <div className="flex-1 truncate text-left">
                                  <div className="font-bold truncate">{remProd.name}</div>
                                  <div className="text-[10px] text-[#174B3B] font-semibold tabular-nums">
                                    Rs. {remProd.price.toLocaleString()}
                                  </div>
                                </div>
                                <Plus className="w-3.5 h-3.5 text-[#174B3B]" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                </div>

              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
