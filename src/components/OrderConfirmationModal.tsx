import React from 'react';
import { PlacedOrder } from '../types';
import { CheckCircle2, PackageCheck, Printer, ShoppingBag, Truck, Calendar, Phone, MapPin, X, MessageSquare } from 'lucide-react';

interface OrderConfirmationModalProps {
  order: PlacedOrder | null;
  onClose: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  onClose,
  onContinueShopping
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#E8DED0] animate-in zoom-in-95">
        
        {/* Header with Success Banner */}
        <div className="bg-[#10392E] text-white p-6 sm:p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-full bg-[#174B3B] border-2 border-[#DCA83F] flex items-center justify-center mx-auto mb-3 text-[#DCA83F]">
            <CheckCircle2 className="w-9 h-9 text-[#DCA83F]" />
          </div>

          <span className="text-[11px] font-bold tracking-[0.25em] text-[#DCA83F] uppercase block mb-1">
            Order Successfully Placed
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold">
            Thank You, {order.customer.fullName}!
          </h2>
          <p className="text-white/80 text-xs sm:text-sm mt-1 max-w-md mx-auto">
            Your pure culinary order is confirmed. A receipt and shipment tracking SMS will be sent to <strong className="text-white">{order.customer.phone}</strong>.
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Order Details Bar */}
          <div className="bg-[#FBF7EF] p-4 rounded-xl border border-[#E8DED0] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div>
              <span className="text-[10px] text-[#777168] uppercase font-semibold block">Order Reference</span>
              <span className="font-bold text-xs sm:text-sm text-[#174B3B] font-mono">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#777168] uppercase font-semibold block">Order Date</span>
              <span className="font-bold text-xs sm:text-sm text-[#25231F]">{order.date}</span>
            </div>
            <div>
              <span className="text-[10px] text-[#777168] uppercase font-semibold block">Payment Mode</span>
              <span className="font-bold text-xs sm:text-sm text-[#174B3B] uppercase">
                {order.customer.paymentMethod === 'cod' 
                  ? 'Cash On Delivery' 
                  : order.customer.paymentMethod === 'jazzcash'
                  ? 'JazzCash'
                  : 'Meezan Bank'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-[#777168] uppercase font-semibold block">Total Amount</span>
              <span className="font-bold text-xs sm:text-sm text-[#174B3B] tabular-nums">
                Rs. {order.total.toLocaleString()}
              </span>
            </div>
          </div>

          {/* JAZZCASH Payment Details */}
          {order.customer.paymentMethod === 'jazzcash' && (
            <div className="p-4 bg-rose-50/70 border border-rose-300 rounded-xl text-xs space-y-3">
              <div className="font-bold text-rose-800 flex items-center justify-between">
                <span>JazzCash Payment Instructions</span>
                <span className="text-[10px] bg-rose-600 text-white font-bold px-2 py-0.5 rounded">03007257010</span>
              </div>
              <p className="text-[#25231F]">
                Please send <strong>Rs. {order.total.toLocaleString()}</strong> to our JazzCash account and send the transaction screenshot to our WhatsApp at <strong>03477014297</strong> with your Order No: <strong>{order.orderNumber}</strong>.
              </p>
              <div className="bg-white p-3 rounded-lg border border-rose-200 space-y-1 font-mono text-[11px] text-[#25231F]">
                <div>JazzCash Account: <strong className="text-rose-700">03007257010</strong></div>
                <div>Account Title: <strong>Aqib Sohail</strong></div>
                {order.customer.transactionRef && (
                  <div>Provided TID / Reference: <strong>{order.customer.transactionRef}</strong></div>
                )}
              </div>
              <a
                href={`https://wa.me/923477014297?text=Assalam-o-Alaikum%2C%20I%20have%20sent%20Rs.%20${order.total}%20via%20JazzCash%20for%20Order%20${order.orderNumber}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Send Screenshot on WhatsApp (03477014297)</span>
              </a>
            </div>
          )}

          {/* MEEZAN BANK Payment Details */}
          {(order.customer.paymentMethod === 'meezan' || order.customer.paymentMethod === 'bank_transfer') && (
            <div className="p-4 bg-emerald-50/80 border border-[#174B3B]/40 rounded-xl text-xs space-y-3">
              <div className="font-bold text-[#174B3B] flex items-center justify-between">
                <span>Meezan Bank Transfer Details</span>
                <span className="text-[10px] bg-[#10392E] text-[#DCA83F] font-bold px-2 py-0.5 rounded">Meezan Bank</span>
              </div>
              <p className="text-[#25231F]">
                Please transfer <strong>Rs. {order.total.toLocaleString()}</strong> to our Meezan Bank account and send the transfer receipt screenshot to our WhatsApp at <strong>03477014297</strong> with your Order No: <strong>{order.orderNumber}</strong>.
              </p>
              <div className="bg-white p-3 rounded-lg border border-[#E8DED0] space-y-1 font-mono text-[11px] text-[#25231F]">
                <div>Bank: <strong>Meezan Bank Ltd</strong></div>
                <div>Account Title: <strong>MAQBOOL HUSSAIN</strong></div>
                <div>Account No: <strong>77010111173735</strong></div>
                <div>IBAN: <strong>PK76MEZN0077010111173735</strong></div>
                <div>Branch: <strong>Khanewal BRANCH</strong></div>
                {order.customer.transactionRef && (
                  <div>Reference / Sender: <strong>{order.customer.transactionRef}</strong></div>
                )}
              </div>
              <a
                href={`https://wa.me/923477014297?text=Assalam-o-Alaikum%2C%20I%20have%20transferred%20Rs.%20${order.total}%20via%20Meezan%20Bank%20for%20Order%20${order.orderNumber}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Send Screenshot on WhatsApp (03477014297)</span>
              </a>
            </div>
          )}

          {/* Shipping Address & Status */}
          <div className="border border-[#E8DED0] rounded-xl p-4 bg-white space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#174B3B]">
              <Truck className="w-4 h-4 text-[#C99A43]" />
              <span>Delivery Details</span>
            </div>
            <div className="text-[#25231F] space-y-1">
              <div><strong>Recipient:</strong> {order.customer.fullName} ({order.customer.phone})</div>
              <div><strong>Address:</strong> {order.customer.address}, {order.customer.city}</div>
              {order.customer.notes && <div><strong>Instructions:</strong> {order.customer.notes}</div>}
              <div className="text-[#777168] pt-1">
                Estimated arrival: <strong>2–3 working days</strong> via TCS / Leopards Courier.
              </div>
            </div>
          </div>

          {/* Itemized Purchased List */}
          <div>
            <h4 className="font-serif text-sm font-bold text-[#174B3B] mb-3">
              Ordered Products
            </h4>
            <div className="space-y-2 border border-[#E8DED0] rounded-xl p-3 bg-[#FBF7EF]/30">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-[#E8DED0]/60 last:border-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-10 h-10 object-cover rounded border border-[#E8DED0]"
                    />
                    <div>
                      <div className="font-bold text-[#25231F]">{item.product.name}</div>
                      <div className="text-[11px] text-[#777168]">{item.size} × {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-bold text-[#174B3B] tabular-nums">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-2">
            {/* WhatsApp Store Notification Button */}
            {(() => {
              const itemsList = order.items.map((i) => `${i.product.name} (${i.size}) x ${i.quantity}`).join(', ');
              const waStoreMsg = encodeURIComponent(
                `Assalam-o-Alaikum! Maine Desi Rassoi se naya order place kiya hai:\n\nOrder No: ${order.orderNumber}\nCustomer: ${order.customer.fullName} (${order.customer.phone})\nCity & Address: ${order.customer.address}, ${order.customer.city}\nItems: ${itemsList}\nTotal: Rs. ${order.total.toLocaleString()}\nPayment Method: ${order.customer.paymentMethod.toUpperCase()}`
              );

              return (
                <a
                  href={`https://wa.me/923477014297?text=${waStoreMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Order Details to Admin WhatsApp (03477014297)</span>
                </a>
              );
            })()}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-[#FBF7EF] hover:bg-[#F3EBDD] text-[#174B3B] border border-[#174B3B] rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={onContinueShopping}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 active:scale-95 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Continue Shopping</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
