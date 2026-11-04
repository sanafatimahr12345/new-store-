import React, { useState } from 'react';
import { PlacedOrder } from '../types';
import { X, User, Package, Truck, Calendar, MapPin, Phone, CheckCircle2, Search } from 'lucide-react';

interface AccountOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PlacedOrder[];
  onSelectOrder: (order: PlacedOrder) => void;
}

export const AccountOrdersModal: React.FC<AccountOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onSelectOrder
}) => {
  if (!isOpen) return null;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter((o) => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customer.phone.includes(searchQuery) ||
    o.customer.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-[#E8DED0] animate-in zoom-in-95 flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8DED0] bg-[#FBF7EF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#174B3B] text-[#DCA83F] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#174B3B]">
                Account & Order Tracking
              </h3>
              <p className="text-xs text-[#777168]">
                Track current dispatches and view past orders
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white text-[#25231F] hover:text-[#174B3B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar for Orders */}
        <div className="p-4 border-b border-[#E8DED0] bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-[#777168] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by order number (e.g. PH-123456) or phone..."
              className="w-full pl-9 pr-4 py-2 bg-[#FBF7EF] border border-[#E8DED0] rounded-lg text-xs text-[#25231F] placeholder:text-[#777168] focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-[#E8DED0] mx-auto mb-3" />
              <h4 className="font-serif text-base font-bold text-[#25231F] mb-1">
                No orders found
              </h4>
              <p className="text-xs text-[#777168] max-w-sm mx-auto">
                {orders.length === 0 
                  ? "You haven't placed an order yet in this session. Add your favorite desi foods to cart and check out!"
                  : "No order matched your search query."}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FBF7EF]/50 border border-[#E8DED0] rounded-xl p-4 hover:border-[#174B3B] transition-all"
              >
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#E8DED0]">
                  <div>
                    <span className="text-[10px] text-[#777168] uppercase font-bold tracking-wider">Order No.</span>
                    <div className="font-mono text-sm font-bold text-[#174B3B]">{order.orderNumber}</div>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{order.status}</span>
                    </span>
                    <div className="text-[10px] text-[#777168] mt-0.5">{order.date}</div>
                  </div>
                </div>

                <div className="text-xs text-[#25231F] space-y-1 mb-3">
                  <div><strong>Customer:</strong> {order.customer.fullName} ({order.customer.phone})</div>
                  <div><strong>Delivery Address:</strong> {order.customer.address}, {order.customer.city}</div>
                  <div><strong>Payment Mode:</strong> {order.customer.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Bank Transfer'}</div>
                </div>

                <div className="bg-white p-2.5 rounded-lg border border-[#E8DED0] mb-3 text-xs space-y-1">
                  {order.items.map((i) => (
                    <div key={i.id} className="flex justify-between text-[#777168]">
                      <span>{i.product.name} ({i.size}) × {i.quantity}</span>
                      <span className="font-semibold text-[#25231F] tabular-nums">
                        Rs. {(i.price * i.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="pt-1.5 border-t border-[#E8DED0] flex justify-between font-bold text-[#174B3B]">
                    <span>Total Paid/Payable:</span>
                    <span className="tabular-nums">Rs. {order.total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectOrder(order);
                  }}
                  className="w-full py-2 bg-[#174B3B] hover:bg-[#10392E] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  View Full Receipt & Tracking Details
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
