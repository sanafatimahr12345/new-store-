import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { Search, X, Star, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const results = products.filter((p) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return false;
    return (
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.categoryLabel.toLowerCase().includes(term) ||
      p.origin.toLowerCase().includes(term) ||
      p.ingredients.some(ing => ing.toLowerCase().includes(term))
    );
  });

  const popularSearches = ['Pure Desi Ghee', 'Raw Sidr Honey', 'Mix Achar', 'Mustard Oil', 'Garam Masala'];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl border border-[#E8DED0] overflow-hidden animate-in zoom-in-95">
        
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E8DED0] flex items-center gap-3 bg-[#FBF7EF]">
          <Search className="w-5 h-5 text-[#174B3B] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search desi ghee, organic honey, pickles, or ingredients..."
            className="flex-1 bg-transparent text-sm sm:text-base text-[#25231F] placeholder:text-[#777168] focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[#777168] hover:text-[#25231F] p-1 text-xs"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#25231F] hover:text-[#174B3B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {!searchTerm ? (
            <div>
              <span className="text-[11px] font-bold tracking-wider text-[#C99A43] uppercase block mb-2.5">
                Popular Searches
              </span>
              <div className="flex flex-wrap gap-2 mb-6">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => setSearchTerm(term)}
                    className="px-3 py-1.5 rounded-full bg-[#FBF7EF] hover:bg-[#F3EBDD] text-xs font-semibold text-[#25231F] border border-[#E8DED0] transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>

              <div className="text-xs text-[#777168] leading-relaxed bg-[#FBF7EF] p-4 rounded-xl border border-[#E8DED0]">
                <strong className="text-[#174B3B] block mb-1">Authentic Traditional Standards:</strong>
                All Pure Harvest foods are guaranteed free of artificial colors, emulsifiers, refined palm oil, and synthetic fragrances.
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-3">
              <span className="text-xs font-semibold text-[#777168] block mb-2">
                Found {results.length} matching products:
              </span>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onClose();
                    onSelectProduct(product);
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#E8DED0] hover:border-[#174B3B] hover:bg-[#FBF7EF]/50 cursor-pointer transition-all"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg border border-[#E8DED0] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C99A43]">
                        {product.categoryLabel}
                      </span>
                      {product.badge && (
                        <span className="text-[9px] bg-[#174B3B] text-white px-1.5 py-0.5 rounded font-bold">
                          {product.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="font-serif text-sm font-bold text-[#25231F] truncate">
                      {product.name}
                    </h4>
                    <p className="text-xs text-[#777168] truncate">
                      {product.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-[#174B3B] tabular-nums">
                      Rs. {product.price.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#777168]">
                      {product.defaultSize}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-sm text-[#777168] mb-2">
                No pure products found matching "{searchTerm}".
              </p>
              <p className="text-xs text-[#777168]">
                Try searching for "ghee", "honey", "achar", or "mustard oil".
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
