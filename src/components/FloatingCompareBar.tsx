import React from 'react';
import { Product } from '../types';
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react';

interface FloatingCompareBarProps {
  comparedProducts: Product[];
  onOpenCompare: () => void;
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
}

export const FloatingCompareBar: React.FC<FloatingCompareBarProps> = ({
  comparedProducts,
  onOpenCompare,
  onRemoveProduct,
  onClearAll
}) => {
  if (comparedProducts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-2xl animate-in slide-in-from-bottom duration-300">
      <div className="bg-[#10392E] text-white p-3 sm:p-3.5 rounded-2xl shadow-2xl border border-[#C99A43]/50 backdrop-blur-md flex items-center justify-between gap-3">
        
        {/* Left: Indicator & Thumbnails */}
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="w-7 h-7 rounded-full bg-[#174B3B] text-[#DCA83F] flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-xs font-bold uppercase tracking-wider block leading-none">
                Compare
              </span>
              <span className="text-[10px] text-[#DCA83F] font-semibold">
                {comparedProducts.length} of 3 selected
              </span>
            </div>
          </div>

          {/* Product Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            {comparedProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-1.5 bg-[#174B3B] px-2 py-1 rounded-lg border border-[#C99A43]/30 shrink-0"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-6 h-6 object-cover rounded border border-[#E8DED0]/40 shrink-0"
                />
                <span className="text-[11px] font-semibold text-white max-w-[90px] sm:max-w-[120px] truncate">
                  {p.name}
                </span>
                <button
                  onClick={() => onRemoveProduct(p.id)}
                  className="text-white/70 hover:text-rose-400 p-0.5"
                  title="Remove from comparison"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClearAll}
            className="p-1.5 text-white/70 hover:text-white rounded-lg text-xs"
            title="Clear all comparison"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onOpenCompare}
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-[#C99A43] hover:bg-[#DCA83F] text-[#10392E] font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <span>Compare Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
