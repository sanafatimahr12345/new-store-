import React from 'react';
import { X, Sparkles, Heart, Award, ShieldCheck, Leaf } from 'lucide-react';
import { BRAND_STORY_IMAGE } from '../data/products';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExploreProducts: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose, onExploreProducts }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DED0] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FBF7EF] px-6 py-4 border-b border-[#E8DED0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-[#174B3B]" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#174B3B]">
              About Pure Harvest
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#25231F] hover:text-[#174B3B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="rounded-xl overflow-hidden aspect-[16/9] border border-[#E8DED0] shadow-sm">
            <img
              src={BRAND_STORY_IMAGE}
              alt="Traditional food craftsmanship"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#C99A43] uppercase block mb-1">
              Reviving Pakistani Culinary Heritage
            </span>
            <h3 className="font-serif text-2xl font-bold text-[#174B3B] mb-3">
              Pure Ingredients, Timeless Care
            </h3>
            <p className="text-xs sm:text-sm text-[#25231F]/90 leading-relaxed mb-4">
              Pure Harvest was founded with a single mission: to bring honest, authentic, and completely unadulterated desi food products back to the dining tables of Pakistani homes.
            </p>
            <p className="text-xs sm:text-sm text-[#777168] leading-relaxed mb-6">
              Industrialization brought mass production, but stripped foods of their natural nutrition and aromas. We partner directly with multigenerational dairy farmers in the Punjab heartland, tribal beekeepers in the Karak mountains, and master pickle artisans in Multan. Every batch of our Pure Desi Ghee is churned from hand-cultured curd (makhan) and slowly simmered until crystal golden clarity is achieved.
            </p>
          </div>

          {/* Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8DED0]">
            <div className="p-4 bg-[#FBF7EF] rounded-xl border border-[#E8DED0] text-center">
              <ShieldCheck className="w-6 h-6 text-[#174B3B] mx-auto mb-2" />
              <div className="font-serif font-bold text-sm text-[#174B3B] mb-1">Zero Adulteration</div>
              <p className="text-[11px] text-[#777168]">No palm oil, artificial colors, or preservatives.</p>
            </div>

            <div className="p-4 bg-[#FBF7EF] rounded-xl border border-[#E8DED0] text-center">
              <Award className="w-6 h-6 text-[#174B3B] mx-auto mb-2" />
              <div className="font-serif font-bold text-sm text-[#174B3B] mb-1">Ancestral Methods</div>
              <p className="text-[11px] text-[#777168]">Bilona churning, sun curing, and cold pressing.</p>
            </div>

            <div className="p-4 bg-[#FBF7EF] rounded-xl border border-[#E8DED0] text-center">
              <Heart className="w-6 h-6 text-[#174B3B] mx-auto mb-2" />
              <div className="font-serif font-bold text-sm text-[#174B3B] mb-1">Fair Trade Sourcing</div>
              <p className="text-[11px] text-[#777168]">Honoring small Pakistani farmers & beekeepers.</p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => {
                onClose();
                onExploreProducts();
              }}
              className="px-6 py-2.5 bg-[#174B3B] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#10392E] transition-colors"
            >
              Shop Our Pure Products
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
