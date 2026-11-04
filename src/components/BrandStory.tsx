import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface BrandStoryProps {
  onOpenStoryModal: () => void;
  onExploreProducts: () => void;
}

export const BrandStory: React.FC<BrandStoryProps> = ({ onOpenStoryModal, onExploreProducts }) => {
  return (
    <section id="story-section" className="bg-[#FBF7EF] py-16 sm:py-24 border-y border-[#E8DED0]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        
        <span className="text-xs font-bold tracking-[0.25em] text-[#C99A43] uppercase mb-2">
          Our Ancestral Heritage
        </span>
        
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#174B3B] mb-6 leading-[1.15] max-w-2xl">
          ROOTED IN TRADITION, MADE WITH LOVE
        </h2>

        <p className="text-sm sm:text-base text-[#25231F]/90 leading-relaxed mb-6 font-normal max-w-2xl">
          At Pure Harvest, we believe that real food begins with pure ingredients and traditional care. Our mission is to bring authentic flavors, natural goodness, and trusted quality to every home.
        </p>

        <p className="text-xs sm:text-sm text-[#777168] leading-relaxed mb-8 max-w-2xl">
          In a modern market flooded with industrial hydrogenated fats, sweetened syrups, and chemical preservatives, Pure Harvest revives timeless recipes from Punjab, Sindh, and the pristine mountain valleys of Pakistan. From small-batch curd-churned desi ghee to sun-ripened mix achar preserved in cold-pressed mustard oil, every jar honors our rich culinary roots.
        </p>

        {/* Quality Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-8 w-full max-w-3xl text-left">
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#25231F] bg-white p-3 rounded-xl border border-[#E8DED0]">
            <CheckCircle2 className="w-4 h-4 text-[#174B3B] shrink-0" />
            <span>Zero palm oil or adulterants</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#25231F] bg-white p-3 rounded-xl border border-[#E8DED0]">
            <CheckCircle2 className="w-4 h-4 text-[#174B3B] shrink-0" />
            <span>Small batch slow cooking</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#25231F] bg-white p-3 rounded-xl border border-[#E8DED0]">
            <CheckCircle2 className="w-4 h-4 text-[#174B3B] shrink-0" />
            <span>Ethically sourced locally</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs font-semibold text-[#25231F] bg-white p-3 rounded-xl border border-[#E8DED0]">
            <CheckCircle2 className="w-4 h-4 text-[#174B3B] shrink-0" />
            <span>Sterilized glass jars</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenStoryModal}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#174B3B] hover:bg-[#10392E] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 active:scale-95"
          >
            <span>OUR STORY</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onExploreProducts}
            className="inline-flex items-center px-6 py-3 bg-white hover:bg-[#F3EBDD] text-[#174B3B] border border-[#174B3B] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
          >
            Explore Products
          </button>
        </div>

      </div>
    </section>
  );
};
