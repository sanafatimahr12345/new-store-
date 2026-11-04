import React from 'react';
import { Truck, ShieldCheck, HeartHandshake } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#10392E] text-white text-[11px] md:text-xs tracking-wider uppercase py-2 px-4 border-b border-[#174B3B]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-4 font-medium">
        <div className="flex items-center gap-1.5 opacity-90">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C99A43]" />
          <span>100% Pure & Natural Products</span>
        </div>
        
        <div className="flex items-center gap-1.5 font-semibold text-[#DCA83F]">
          <Truck className="w-3.5 h-3.5 text-[#DCA83F]" />
          <span>Free Delivery On Orders Above Rs. 3,000</span>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 opacity-90">
          <HeartHandshake className="w-3.5 h-3.5 text-[#C99A43]" />
          <span>Shop Authentic · Eat Healthy</span>
        </div>
      </div>
    </div>
  );
};
