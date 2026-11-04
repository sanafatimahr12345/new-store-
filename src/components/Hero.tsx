import React from 'react';
import { HERO_IMAGE } from '../data/products';
import { Sparkles, ArrowRight } from 'lucide-react';

interface HeroProps {
  onShopNow: () => void;
  onExplore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onShopNow, onExplore }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-10">
      <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-[#E8DED0]/60 bg-[#10392E] min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[620px] flex items-end">
        
        {/* Background Image with gentle hover scale */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={HERO_IMAGE}
            alt="Pure Harvest Desi Ghee in rustic glass jar with wooden spoon"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient scrim overlay for impeccable readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
        </div>

        {/* Top-Right Premium Badge */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10">
          <div className="backdrop-blur-md bg-white/90 text-[#174B3B] border border-[#C99A43]/50 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full shadow-lg flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C99A43]" />
            <span>100% PURE & NATURAL</span>
          </div>
        </div>

        {/* Hero Content positioned toward Lower-Left */}
        <div className="relative z-10 p-6 sm:p-10 md:p-12 lg:p-14 max-w-2xl text-white">
          
          {/* Small Uppercase Label */}
          <div className="inline-flex items-center gap-2 mb-2 sm:mb-3">
            <span className="text-[#DCA83F] font-semibold text-xs sm:text-sm tracking-[0.25em] uppercase drop-shadow-sm">
              PURE • NATURAL • TRADITIONAL
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-3 sm:mb-4 drop-shadow-md leading-[1.1]">
            PURE DESI GHEE
          </h1>

          {/* Supporting Text */}
          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-normal leading-relaxed drop-shadow max-w-xl">
            Experience the authentic taste of tradition, crafted with purity and love.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              onClick={onShopNow}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 bg-[#174B3B] hover:bg-[#10392E] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 border border-[#174B3B]"
            >
              <span>SHOP NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onExplore}
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-transparent hover:bg-white/15 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-xl backdrop-blur-sm border border-white/80 transition-all duration-200 hover:border-white"
            >
              EXPLORE PRODUCTS
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
