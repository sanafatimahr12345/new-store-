import React, { useState } from 'react';
import { CartItem, PlacedOrder, CustomerInfo } from '../types';
import { X, ShieldCheck, CheckCircle2, AlertCircle, Truck, Building, Banknote, ArrowRight, Copy, Check, Phone, QrCode } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderPlaced: (order: PlacedOrder) => void;
}

const PAKISTAN_CITIES = [
  'Khanewal', 'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Multan', 'Faisalabad', 
  'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 
  'Hyderabad', 'Abbottabad', 'Bahawalpur', 'Sargodha', 'Other City'
];

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderPlaced
}) => {
  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 3000;
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 250;
  const total = subtotal + shippingFee;

  const [formData, setFormData] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    email: '',
    city: 'Lahore',
    address: '',
    notes: '',
    paymentMethod: 'cod'
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, fieldId: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerInfo, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Please enter your full name';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+92|0)?3[0-9]{9}$/.test(formData.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Enter valid Pakistani phone (e.g. 03001234567)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Complete delivery street address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide full house/street/colony address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const orderNumber = `PH-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: PlacedOrder = {
        id: `ord_${Date.now()}`,
        orderNumber,
        customer: { ...formData },
        items: [...items],
        subtotal,
        shippingFee,
        total,
        date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Confirmed'
      };

      setIsSubmitting(false);
      onOrderPlaced(newOrder);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DED0] animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-[#FBF7EF] px-5 sm:px-6 py-4 border-b border-[#E8DED0] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#174B3B]">
              Complete Your Order
            </h2>
            <p className="text-xs text-[#777168] mt-0.5">
              Secure Checkout · Express Delivery Across Pakistan
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#25231F] hover:text-[#174B3B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 md:p-8">
          
          {/* Simulated Mode Callout as requested */}
          <div className="mb-6 p-3.5 bg-[#FBF7EF] border border-[#C99A43]/50 rounded-xl text-xs text-[#25231F] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#C99A43] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#174B3B]">Demonstration Order Processing:</strong> Real money is not charged in this interactive preview. You can place test orders with Cash on Delivery or Bank Transfer to experience our customer notification and order summary system.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Customer Information & Delivery Details */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="font-serif text-base font-bold text-[#174B3B] border-b border-[#E8DED0] pb-2 flex items-center gap-2">
                <span>1. Delivery Information</span>
              </h3>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#25231F] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Fatima Zahra"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#174B3B] ${
                    errors.fullName ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8DED0] bg-white'
                  }`}
                />
                {errors.fullName && <p className="text-[11px] text-rose-500 mt-1">{errors.fullName}</p>}
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#25231F] mb-1">
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0300 1234567"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#174B3B] ${
                      errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8DED0] bg-white'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-rose-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#25231F] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#174B3B] ${
                      errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8DED0] bg-white'
                    }`}
                  />
                  {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-[#25231F] mb-1">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8DED0] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                >
                  {PAKISTAN_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="block text-xs font-semibold text-[#25231F] mb-1">
                  Complete Delivery Address *
                </label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="House / Flat No., Street, Sector/Colony, Landmark..."
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#174B3B] ${
                    errors.address ? 'border-rose-400 bg-rose-50/20' : 'border-[#E8DED0] bg-white'
                  }`}
                />
                {errors.address && <p className="text-[11px] text-rose-500 mt-1">{errors.address}</p>}
              </div>

              {/* Order Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#25231F] mb-1">
                  Special Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Call before delivery, leave with guard"
                  className="w-full px-3.5 py-2 rounded-lg border border-[#E8DED0] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                >
                </input>
              </div>

              {/* Payment Method Selection */}
              <div className="pt-2">
                <h3 className="font-serif text-base font-bold text-[#174B3B] border-b border-[#E8DED0] pb-2 mb-3">
                  2. Select Payment Method
                </h3>

                <div className="space-y-3">
                  {/* Option 1: Cash on Delivery (COD) */}
                  <label className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-[#174B3B] bg-[#FBF7EF] ring-1 ring-[#174B3B]'
                      : 'border-[#E8DED0] hover:bg-[#FBF7EF]/40'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                      className="mt-1 text-[#174B3B] focus:ring-[#174B3B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#174B3B]">
                        <Banknote className="w-4 h-4 text-[#C99A43]" />
                        <span>Cash on Delivery (COD)</span>
                      </div>
                      <p className="text-[11px] text-[#777168] mt-0.5">
                        Pay cash directly to courier rider upon inspection and delivery of package at your doorstep.
                      </p>
                    </div>
                  </label>

                  {/* Option 2: JAZZCASH */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    formData.paymentMethod === 'jazzcash'
                      ? 'border-rose-600 bg-rose-50/30 ring-1 ring-rose-600'
                      : 'border-[#E8DED0] hover:bg-[#FBF7EF]/40'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="jazzcash"
                        checked={formData.paymentMethod === 'jazzcash'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'jazzcash' })}
                        className="mt-1 text-rose-600 focus:ring-rose-600"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-rose-700">
                            <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] font-black shadow-xs">J</span>
                            <span className="font-bold text-[#25231F]">JazzCash:</span>
                            <span className="font-mono font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-xs sm:text-sm tracking-wider border border-rose-300">
                              03007257010
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCopy('03007257010', 'jazzcash_header');
                              }}
                              className="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Copy JazzCash Number"
                            >
                              {copiedField === 'jazzcash_header' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-rose-700" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Instant
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#777168] mt-1">
                          Account Title: <strong className="text-[#25231F] font-bold">Aqib Sohail</strong> &bull; JazzCash Number: <strong className="font-mono text-rose-700 font-bold">03007257010</strong> &bull; Screenshot WhatsApp: <strong className="text-[#174B3B] font-bold">03477014297</strong>
                        </p>
                      </div>
                    </label>

                    {formData.paymentMethod === 'jazzcash' && (
                      <div className="mt-3 pt-3 border-t border-rose-200 space-y-2.5 text-xs text-[#25231F] animate-in fade-in duration-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-white p-3 rounded-lg border border-rose-200">
                          <div>
                            <span className="text-[10px] text-[#777168] uppercase font-semibold block">JazzCash Number</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="font-mono font-bold text-sm sm:text-base text-rose-700">03007257010</span>
                              <button
                                type="button"
                                onClick={() => handleCopy('03007257010', 'jazzcash')}
                                className="p-1 hover:bg-rose-50 rounded text-rose-700 transition-colors"
                                title="Copy JazzCash Number"
                              >
                                {copiedField === 'jazzcash' ? (
                                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold">
                                    <Check className="w-3 h-3" /> Copied
                                  </span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <span className="text-[10px] text-[#777168] uppercase font-semibold block">Account Title</span>
                            <span className="font-bold text-sm text-[#25231F] mt-0.5 block">Aqib Sohail</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                          <div className="text-[11px] text-[#174B3B]">
                            <span>Send screenshot on WhatsApp: </span>
                            <strong className="font-bold">03477014297</strong>
                          </div>
                          <a
                            href={`https://wa.me/923477014297?text=Assalam-o-Alaikum%2C%20I%20have%20sent%20Rs.%20${total}%20via%20JazzCash%20(Title%3A%20Aqib%20Sohail%2C%20Number%3A%2003007257010)%20for%20my%20order.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md shadow-xs transition-colors shrink-0"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp Screenshot</span>
                          </a>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Enter JazzCash Transaction ID (TID) / Sender Name (Optional)"
                            value={formData.transactionRef || ''}
                            onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-rose-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 3: MEEZAN BANK */}
                  <div className={`p-3.5 rounded-xl border transition-all ${
                    formData.paymentMethod === 'meezan' || formData.paymentMethod === 'bank_transfer'
                      ? 'border-[#174B3B] bg-[#FBF7EF] ring-1 ring-[#174B3B]'
                      : 'border-[#E8DED0] hover:bg-[#FBF7EF]/40'
                  }`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="meezan"
                        checked={formData.paymentMethod === 'meezan' || formData.paymentMethod === 'bank_transfer'}
                        onChange={() => setFormData({ ...formData, paymentMethod: 'meezan' })}
                        className="mt-1 text-[#174B3B] focus:ring-[#174B3B]"
                      />
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-[#174B3B]">
                            <Building className="w-4 h-4 text-[#C99A43]" />
                            <span className="font-bold text-[#25231F]">Meezan Bank:</span>
                            <span className="font-mono font-black text-[#174B3B] bg-[#174B3B]/10 px-2 py-0.5 rounded text-xs sm:text-sm tracking-wider border border-[#174B3B]/30">
                              77010111173735
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCopy('77010111173735', 'meezan_header');
                              }}
                              className="px-2 py-0.5 bg-[#174B3B]/10 hover:bg-[#174B3B]/20 text-[#174B3B] rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Copy Meezan Account Number"
                            >
                              {copiedField === 'meezan_header' ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-[#174B3B]" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                            <span className="text-[10px] bg-[#174B3B] text-[#DCA83F] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                              Bank
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-[#777168] mt-1">
                          Account Title: <strong className="text-[#25231F] font-bold">MAQBOOL HUSSAIN</strong> &bull; Account No: <strong className="font-mono text-[#174B3B] font-bold">77010111173735</strong> &bull; Khanewal Branch
                        </p>
                      </div>
                    </label>

                    {(formData.paymentMethod === 'meezan' || formData.paymentMethod === 'bank_transfer') && (
                      <div className="mt-3 pt-3 border-t border-[#E8DED0] space-y-2.5 text-xs text-[#25231F] animate-in fade-in duration-200">
                        <div className="bg-white p-3.5 rounded-lg border border-[#E8DED0] space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[#777168] text-[11px]">Bank:</span>
                            <span className="font-bold text-[#174B3B]">Meezan Bank</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#777168] text-[11px]">Account Title:</span>
                            <span className="font-bold text-[#25231F]">MAQBOOL HUSSAIN</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#777168] text-[11px]">Account No:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#174B3B] text-xs sm:text-sm">77010111173735</span>
                              <button
                                type="button"
                                onClick={() => handleCopy('77010111173735', 'meezan_acc')}
                                className="p-1 hover:bg-[#FBF7EF] rounded text-[#C99A43] transition-colors"
                                title="Copy Account Number"
                              >
                                {copiedField === 'meezan_acc' ? (
                                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold">
                                    <Check className="w-3 h-3" /> Copied
                                  </span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#777168] text-[11px]">IBAN:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-[#174B3B] text-[10px] sm:text-xs">PK76MEZN0077010111173735</span>
                              <button
                                type="button"
                                onClick={() => handleCopy('PK76MEZN0077010111173735', 'meezan_iban')}
                                className="p-1 hover:bg-[#FBF7EF] rounded text-[#C99A43] transition-colors"
                                title="Copy IBAN"
                              >
                                {copiedField === 'meezan_iban' ? (
                                  <span className="flex items-center gap-0.5 text-[10px] text-emerald-600 font-bold">
                                    <Check className="w-3 h-3" /> Copied
                                  </span>
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#777168] text-[11px]">Branch:</span>
                            <span className="font-semibold text-[#25231F]">Khanewal BRANCH</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-200">
                          <div className="text-[11px] text-[#174B3B]">
                            <span>Send screenshot on WhatsApp: </span>
                            <strong className="font-bold">03477014297</strong>
                          </div>
                          <a
                            href={`https://wa.me/923477014297?text=Assalam-o-Alaikum%2C%20I%20have%20transferred%20Rs.%20${total}%20via%20Meezan%20Bank%20(Account%3A%2077010111173735%20-%20MAQBOOL%20HUSSAIN)%20for%20my%20order.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-md shadow-xs transition-colors shrink-0"
                          >
                            <Phone className="w-3 h-3" />
                            <span>WhatsApp Screenshot</span>
                          </a>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Enter Transaction Reference / Sender Account Title (Optional)"
                            value={formData.transactionRef || ''}
                            onChange={(e) => setFormData({ ...formData, transactionRef: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg border border-[#E8DED0] text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 bg-[#FBF7EF] p-5 sm:p-6 rounded-2xl border border-[#E8DED0] flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#174B3B] border-b border-[#E8DED0] pb-2 mb-4">
                  Order Summary ({items.length} items)
                </h3>

                {/* Items preview */}
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-xs bg-white p-2.5 rounded-lg border border-[#E8DED0]">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded border border-[#E8DED0] shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[#25231F] truncate">{item.product.name}</div>
                        <div className="text-[11px] text-[#777168]">
                          {item.size} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-bold text-[#174B3B] tabular-nums shrink-0">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial calculations */}
                <div className="space-y-2 text-xs border-t border-[#E8DED0] pt-3">
                  <div className="flex justify-between text-[#777168]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#25231F] tabular-nums">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#777168]">
                    <span>Shipping Fee</span>
                    <span className="font-semibold text-[#25231F] tabular-nums">
                      {shippingFee === 0 ? <span className="text-emerald-700 font-bold uppercase">Free</span> : `Rs. ${shippingFee}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-[#E8DED0] flex justify-between text-base font-bold text-[#174B3B]">
                    <span>Grand Total</span>
                    <span className="tabular-nums">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-white rounded-lg border border-[#E8DED0] text-[11px] text-[#777168] space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-[#174B3B]">
                    <Truck className="w-3.5 h-3.5 text-[#C99A43]" />
                    <span>Estimated Delivery: 2 to 3 Business Days</span>
                  </div>
                  <p>Packed securely in thermal-protected glass packaging.</p>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-[#174B3B] hover:bg-[#10392E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-150 active:scale-95 shadow-lg disabled:opacity-70"
                >
                  <span>{isSubmitting ? 'Processing Order...' : `Confirm Order · Rs. ${total.toLocaleString()}`}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </form>

        </div>

      </div>
    </div>
  );
};
