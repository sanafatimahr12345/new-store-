import React, { useState, useEffect } from 'react';
import { Search, User, Heart, ShoppingBag, Menu, X, Leaf, Scale, Settings } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  compareCount?: number;
  ordersCount?: number;
  unreadOrdersCount?: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare?: () => void;
  onOpenSearch: () => void;
  onOpenAccount: () => void;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenAdmin?: () => void;
  onSelectCategory: (category: 'all' | 'ghee' | 'honey' | 'pickles' | 'oils' | 'spices') => void;
  onScrollToSection: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  compareCount = 0,
  ordersCount = 0,
  unreadOrdersCount = 0,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onOpenSearch,
  onOpenAccount,
  onOpenAbout,
  onOpenContact,
  onOpenAdmin,
  onSelectCategory,
  onScrollToSection
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (action: () => void) => {
    action();
    setMobileMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-40 bg-white transition-all duration-200 border-b ${
      isScrolled ? 'shadow-md border-[#E8DED0]/80 py-2.5' : 'border-[#E8DED0] py-3.5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#25231F] hover:text-[#174B3B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#174B3B] rounded-md"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Brand Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 text-decoration-none select-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#FBF7EF] border border-[#C99A43]/40 flex items-center justify-center text-[#174B3B] group-hover:scale-105 transition-transform duration-200">
                <Leaf className="w-4 h-4 text-[#174B3B]" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#174B3B] leading-none">
                  DESSIS RASSIO
                </span>
                <span className="text-[9px] tracking-[0.25em] text-[#C99A43] font-semibold uppercase mt-0.5">
                  Organic & Desi Foods
                </span>
              </div>
            </a>
          </div>

          {/* Desktop Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] font-semibold tracking-wider uppercase text-[#25231F]">
            <button
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative py-1 text-[#174B3B] hover:text-[#174B3B] transition-colors after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#C99A43]"
            >
              Home
            </button>
            <button
              onClick={() => {
                onSelectCategory('all');
                onScrollToSection('all-products-section');
              }}
              className="py-1 hover:text-[#174B3B] transition-colors hover:underline hover:decoration-[#C99A43] hover:underline-offset-4"
            >
              All Products
            </button>
            <button
              onClick={() => {
                onSelectCategory('ghee');
                onScrollToSection('all-products-section');
              }}
              className="py-1 hover:text-[#174B3B] transition-colors hover:underline hover:decoration-[#C99A43] hover:underline-offset-4"
            >
              Ghee
            </button>
            <button
              onClick={() => {
                onSelectCategory('honey');
                onScrollToSection('all-products-section');
              }}
              className="py-1 hover:text-[#174B3B] transition-colors hover:underline hover:decoration-[#C99A43] hover:underline-offset-4"
            >
              Honey
            </button>
            <button
              onClick={() => {
                onSelectCategory('pickles');
                onScrollToSection('all-products-section');
              }}
              className="py-1 hover:text-[#174B3B] transition-colors hover:underline hover:decoration-[#C99A43] hover:underline-offset-4"
            >
              Pickles
            </button>
            <button
              onClick={onOpenAbout}
              className="py-1 hover:text-[#174B3B] transition-colors hover:underline hover:decoration-[#C99A43] hover:underline-offset-4"
            >
              About Us
            </button>
            <button
              onClick={() => onScrollToSection('story-section')}
              className="py-1 hover:text-[#174B3B] transition-colors hover:underline hover:decoration-[#C99A43] hover:underline-offset-4"
            >
              Our Story
            </button>
            <button
              onClick={onOpenContact}
              className="py-1 hover:text-[#174B3B] transition-colors hover:underline hover:decoration-[#C99A43] hover:underline-offset-4"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Icons & SHOP NOW Button */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-[#25231F] hover:text-[#174B3B] hover:bg-[#FBF7EF] rounded-full transition-colors"
              aria-label="Search products"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account / Order Tracking */}
            <button
              onClick={onOpenAccount}
              className="p-2 text-[#25231F] hover:text-[#174B3B] hover:bg-[#FBF7EF] rounded-full transition-colors"
              aria-label="My Account & Order Tracking"
              title="Track Orders & Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Compare with count badge */}
            {onOpenCompare && (
              <button
                onClick={onOpenCompare}
                className="relative p-2 text-[#25231F] hover:text-[#174B3B] hover:bg-[#FBF7EF] rounded-full transition-colors"
                aria-label="Product Comparison"
                title="Compare Products (up to 3)"
              >
                <Scale className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-[#C99A43] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {compareCount}
                  </span>
                )}
              </button>
            )}

            {/* Wishlist with count badge */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-[#25231F] hover:text-[#174B3B] hover:bg-[#FBF7EF] rounded-full transition-colors"
              aria-label="Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#C99A43] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag with live cart count */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-[#25231F] hover:text-[#174B3B] hover:bg-[#FBF7EF] rounded-full transition-colors"
              aria-label="Shopping Cart"
              title="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-[#174B3B]" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-[#174B3B] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Portal quick link with live order alert badge */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="relative p-2 text-[#25231F] hover:text-[#174B3B] hover:bg-[#FBF7EF] rounded-full transition-colors"
                aria-label="Admin Portal"
                title="Admin Portal (Products & Orders)"
              >
                <Settings className="w-5 h-5 text-[#C99A43]" />
                {unreadOrdersCount > 0 ? (
                  <span className="absolute top-0.5 right-0.5 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse shadow-sm">
                    {unreadOrdersCount}
                  </span>
                ) : ordersCount > 0 ? (
                  <span className="absolute top-0.5 right-0.5 bg-[#174B3B] text-[#DCA83F] border border-[#C99A43] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {ordersCount}
                  </span>
                ) : null}
              </button>
            )}

            {/* Dark green rounded SHOP NOW button */}
            <button
              onClick={() => {
                onSelectCategory('all');
                onScrollToSection('all-products-section');
              }}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-[#174B3B] hover:bg-[#10392E] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm transition-transform active:scale-95"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-[#E8DED0] pb-3 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col space-y-2 text-sm font-semibold tracking-wider uppercase text-[#25231F]">
              <button
                onClick={() => handleNavClick(() => window.scrollTo({ top: 0, behavior: 'smooth' }))}
                className="text-left px-3 py-2 rounded-md hover:bg-[#FBF7EF] text-[#174B3B]"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick(() => {
                  onSelectCategory('all');
                  onScrollToSection('all-products-section');
                })}
                className="text-left px-3 py-2 rounded-md hover:bg-[#FBF7EF]"
              >
                All Products
              </button>
              <button
                onClick={() => handleNavClick(() => {
                  onSelectCategory('ghee');
                  onScrollToSection('all-products-section');
                })}
                className="text-left px-3 py-2 rounded-md hover:bg-[#FBF7EF]"
              >
                Pure Desi Ghee
              </button>
              <button
                onClick={() => handleNavClick(() => {
                  onSelectCategory('honey');
                  onScrollToSection('all-products-section');
                })}
                className="text-left px-3 py-2 rounded-md hover:bg-[#FBF7EF]"
              >
                Organic Honey
              </button>
              <button
                onClick={() => handleNavClick(() => {
                  onSelectCategory('pickles');
                  onScrollToSection('all-products-section');
                })}
                className="text-left px-3 py-2 rounded-md hover:bg-[#FBF7EF]"
              >
                Traditional Pickles (Achar)
              </button>
              <button
                onClick={() => handleNavClick(onOpenAbout)}
                className="text-left px-3 py-2 rounded-md hover:bg-[#FBF7EF]"
              >
                About Us
              </button>
              <button
                onClick={() => handleNavClick(() => onScrollToSection('story-section'))}
                className="text-left px-3 py-2 rounded-md hover:bg-[#FBF7EF]"
              >
                Our Heritage Story
              </button>
              <button
                onClick={() => handleNavClick(onOpenContact)}
                className="text-left px-3 py-2 rounded-md hover:bg-[#FBF7EF]"
              >
                Contact & Support
              </button>
              <div className="pt-2 space-y-2">
                {onOpenAdmin && (
                  <button
                    onClick={() => handleNavClick(onOpenAdmin)}
                    className="w-full py-2.5 px-3 bg-[#FBF7EF] border border-[#C99A43] text-[#174B3B] text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Settings className="w-4 h-4 text-[#C99A43]" />
                      <span>Admin Portal (Products & Orders)</span>
                    </span>
                    {unreadOrdersCount > 0 ? (
                      <span className="bg-rose-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                        {unreadOrdersCount} New
                      </span>
                    ) : ordersCount > 0 ? (
                      <span className="bg-[#174B3B] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {ordersCount} Orders
                      </span>
                    ) : null}
                  </button>
                )}
                <button
                  onClick={() => handleNavClick(() => {
                    onSelectCategory('all');
                    onScrollToSection('all-products-section');
                  })}
                  className="w-full py-2.5 bg-[#174B3B] text-white text-xs font-bold uppercase tracking-wider rounded-lg text-center"
                >
                  Shop Pure Harvest Catalog
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
