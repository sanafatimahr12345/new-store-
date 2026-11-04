import React from 'react';
import { Product } from '../types';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  products: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product, size: string) => void;
  onQuickView: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistIds,
  products,
  onRemoveFromWishlist,
  onAddToCart,
  onQuickView
}) => {
  if (!isOpen) return null;

  const favoritedProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E8DED0] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DED0] flex items-center justify-between bg-[#FBF7EF]">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#174B3B] fill-[#174B3B]" />
              <h2 className="font-serif text-lg font-bold text-[#174B3B]">
                Your Saved Favorites ({favoritedProducts.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white text-[#25231F] hover:text-[#174B3B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {favoritedProducts.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FBF7EF] border border-[#E8DED0] flex items-center justify-center text-[#777168] mb-4">
                  <Heart className="w-7 h-7 text-[#777168]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#25231F] mb-1">
                  Your wishlist is empty
                </h3>
                <p className="text-xs text-[#777168] max-w-xs mb-6">
                  Save your favorite pure desi ghee, organic honey, and pickles for easy access.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#174B3B] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#10392E] transition-colors"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              favoritedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-3.5 p-3 rounded-xl border border-[#E8DED0] bg-[#FBF7EF]/40 hover:bg-[#FBF7EF] transition-colors"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg border border-[#E8DED0] shrink-0 cursor-pointer"
                    onClick={() => {
                      onClose();
                      onQuickView(product);
                    }}
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <h4
                          onClick={() => {
                            onClose();
                            onQuickView(product);
                          }}
                          className="font-serif text-sm font-bold text-[#25231F] hover:text-[#174B3B] cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveFromWishlist(product.id)}
                          className="text-[#777168] hover:text-rose-600 transition-colors p-0.5"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-bold text-[#174B3B] mt-1 tabular-nums">
                        Rs. {product.price.toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onAddToCart(product, product.defaultSize);
                      }}
                      className="mt-2 w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors active:scale-95"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Cart</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {favoritedProducts.length > 0 && (
            <div className="p-4 border-t border-[#E8DED0] bg-[#FBF7EF]">
              <button
                onClick={() => {
                  favoritedProducts.forEach(p => onAddToCart(p, p.defaultSize));
                  onClose();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <span>Add All Saved to Cart</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
