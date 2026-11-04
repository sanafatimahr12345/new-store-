import React from 'react';
import { Leaf, Phone, Mail, MapPin, ShieldCheck, Heart, ExternalLink, Settings } from 'lucide-react';
import { ProductCategory } from '../types';

interface FooterProps {
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenAccount: () => void;
  onOpenCart: () => void;
  onSelectCategory: (cat: ProductCategory) => void;
  onScrollToSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
  ordersCount?: number;
  unreadOrdersCount?: number;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAbout,
  onOpenContact,
  onOpenAccount,
  onOpenCart,
  onSelectCategory,
  onScrollToSection,
  onOpenAdmin,
  ordersCount = 0,
  unreadOrdersCount = 0
}) => {
  return (
    <footer className="bg-[#10392E] text-white border-t border-[#174B3B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 4 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Column 1 — Brand */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-[#174B3B] border border-[#C99A43]/50 flex items-center justify-center text-[#DCA83F]">
                <Leaf className="w-4 h-4 text-[#DCA83F]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                DESSIS RASSIO
              </span>
            </div>

            <p className="text-white/80 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              Bringing authentic traditional flavors and natural goodness to your home. Handcrafted pure desi ghee, raw mountain honey, and traditional pickles.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {['Facebook', 'Instagram', 'YouTube', 'TikTok'].map((platform) => (
                <a
                  key={platform}
                  href={`#${platform.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    alert(`Pure Harvest ${platform} channel preview.`);
                  }}
                  className="w-8 h-8 rounded-full bg-[#174B3B] hover:bg-[#C99A43] hover:text-[#10392E] text-white/90 flex items-center justify-center text-xs font-bold transition-colors"
                  aria-label={platform}
                  title={platform}
                >
                  {platform.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 — QUICK LINKS */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#DCA83F] uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              <li>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onSelectCategory('all');
                    onScrollToSection('all-products-section');
                  }}
                  className="hover:text-white transition-colors"
                >
                  All Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('all-products-section')}
                  className="hover:text-white transition-colors"
                >
                  Best Sellers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onScrollToSection('story-section')}
                  className="hover:text-white transition-colors"
                >
                  Heritage Story
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 — CUSTOMER SERVICE */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#DCA83F] uppercase tracking-widest mb-4">
              Customer Service
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              <li>
                <button onClick={onOpenAccount} className="hover:text-white transition-colors">
                  My Account & Orders
                </button>
              </li>
              <li>
                <button onClick={onOpenCart} className="hover:text-white transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("Free delivery on all Pakistan orders over Rs. 3,000. Flat rate Rs. 250 for orders below. Shipped within 2-3 business days via TCS/Trax.")}
                  className="hover:text-white transition-colors"
                >
                  Shipping Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("100% Purity Guarantee: If you detect any chemical adulteration, we offer a 100% money-back refund within 7 days.")}
                  className="hover:text-white transition-colors"
                >
                  Return & Purity Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("Your privacy is strictly protected. We never sell customer phone numbers or addresses.")}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => alert("Standard commercial terms for Pure Harvest organic food products delivery across Pakistan.")}
                  className="hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4 — CONTACT INFORMATION */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#DCA83F] uppercase tracking-widest mb-4">
              Contact Information
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#C99A43] shrink-0 mt-0.5" />
                <a href="mailto:maqbool4090092@gmail.com" className="hover:text-white transition-colors">
                  maqbool4090092@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#C99A43] shrink-0 mt-0.5" />
                <a href="https://wa.me/923477014297" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
                  WhatsApp: 03477014297
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#C99A43] shrink-0 mt-0.5" />
                <span>Khanewal, Punjab</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Footer Row */}
        <div className="pt-8 border-t border-[#174B3B] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/70">
          <div>
            Copyright © 2026 <span className="font-serif text-white font-bold">DESSIS RASSIO</span>. All Rights Reserved.
          </div>

          {/* Payment Method Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-[#174B3B] rounded text-[11px] text-[#DCA83F] font-semibold border border-[#C99A43]/30">
              COD
            </span>
            <span className="px-2.5 py-1 bg-[#174B3B] rounded text-[11px] text-white font-semibold border border-rose-500/50">
              JAZZCASH 03007257010
            </span>
            <span className="px-2.5 py-1 bg-[#174B3B] rounded text-[11px] text-[#DCA83F] font-semibold border border-[#C99A43]/40">
              MEEZAN 77010111173735
            </span>
          </div>

          {/* Admin trigger */}
          <button
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-xs text-[#DCA83F] hover:text-white transition-colors underline decoration-dotted font-medium"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin Portal & Orders</span>
            {unreadOrdersCount > 0 ? (
              <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse shadow-sm">
                {unreadOrdersCount} New Orders
              </span>
            ) : ordersCount > 0 ? (
              <span className="bg-[#174B3B] text-[#DCA83F] border border-[#C99A43] text-[10px] px-1.5 py-0.2 rounded font-bold">
                {ordersCount}
              </span>
            ) : null}
          </button>
        </div>

      </div>
    </footer>
  );
};
