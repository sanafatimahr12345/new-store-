import React from 'react';
import { CartItem } from '../types';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 3000;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || items.length === 0 ? 0 : 250;
  const total = subtotal + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E8DED0] animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-[#E8DED0] flex items-center justify-between bg-[#FBF7EF]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#174B3B]" />
              <h2 className="font-serif text-lg font-bold text-[#174B3B]">
                Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white text-[#25231F] hover:text-[#174B3B] transition-colors"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="px-5 py-3 bg-[#FBF7EF]/50 border-b border-[#E8DED0]">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="flex items-center gap-1.5 text-[#174B3B]">
                <Truck className="w-3.5 h-3.5 text-[#C99A43]" />
                {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-700 font-bold">You qualify for FREE Delivery!</span>
                ) : (
                  <span>
                    Add <strong className="text-[#174B3B]">Rs. {remainingForFreeShipping.toLocaleString()}</strong> more for FREE shipping
                  </span>
                )}
              </span>
              <span className="text-[#777168] tabular-nums">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#E8DED0] rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#174B3B] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FBF7EF] border border-[#E8DED0] flex items-center justify-center text-[#777168] mb-4">
                  <ShoppingBag className="w-7 h-7 text-[#777168]" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#25231F] mb-1">Your cart is empty</h3>
                <p className="text-xs text-[#777168] max-w-xs mb-6">
                  Experience pure taste from our traditional desi ghee, raw honey, and homemade pickles.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#174B3B] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#10392E] transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-xl border border-[#E8DED0] bg-[#FBF7EF]/30 hover:bg-[#FBF7EF] transition-colors"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-lg border border-[#E8DED0] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-sm font-bold text-[#25231F] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#777168] hover:text-rose-600 transition-colors p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      <div className="text-[11px] text-[#777168] mt-0.5">
                        Size: <span className="font-semibold text-[#25231F]">{item.size}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-[#E8DED0] bg-white rounded-md overflow-hidden">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-xs text-[#777168] hover:bg-[#FBF7EF] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#25231F] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs text-[#777168] hover:bg-[#FBF7EF] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-bold text-[#174B3B] tabular-nums">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#777168] tabular-nums">
                          Rs. {item.price.toLocaleString()} each
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E8DED0] bg-[#FBF7EF] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#777168]">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#25231F] tabular-nums">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[#777168]">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-[#25231F] tabular-nums">
                    {shippingFee === 0 ? <span className="text-emerald-700 uppercase font-bold text-[11px]">Free</span> : `Rs. ${shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#E8DED0] flex justify-between text-sm sm:text-base font-bold text-[#174B3B]">
                  <span>Total Amount</span>
                  <span className="tabular-nums">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-[#777168] bg-white p-2 rounded border border-[#E8DED0]">
                <ShieldCheck className="w-4 h-4 text-[#174B3B] shrink-0" />
                <span>Cash on Delivery & Bank Transfer available. 100% Purity Guaranteed.</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
