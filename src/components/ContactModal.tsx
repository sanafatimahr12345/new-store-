import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 md:p-6">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#E8DED0] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#FBF7EF] px-6 py-4 border-b border-[#E8DED0] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#174B3B]">
              Contact DESSIS RASSIO
            </h2>
            <p className="text-xs text-[#777168]">
              We are here to assist with your pure culinary orders and inquiries
            </p>
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
          
          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#FBF7EF] rounded-xl border border-[#E8DED0] flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#C99A43] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#777168] block">Email Us</span>
                <a href="mailto:maqbool4090092@gmail.com" className="text-xs font-semibold text-[#174B3B] truncate block hover:underline">
                  maqbool4090092@gmail.com
                </a>
              </div>
            </div>

            <div className="p-3.5 bg-[#FBF7EF] rounded-xl border border-[#E8DED0] flex items-center gap-3">
              <Phone className="w-5 h-5 text-[#C99A43] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#777168] block">WhatsApp / Call</span>
                <a href="https://wa.me/923477014297" target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#174B3B] block hover:underline">
                  03477014297
                </a>
              </div>
            </div>

            <div className="p-3.5 bg-[#FBF7EF] rounded-xl border border-[#E8DED0] flex items-center gap-3">
              <MapPin className="w-5 h-5 text-[#C99A43] shrink-0" />
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-[#777168] block">Location</span>
                <span className="text-xs font-semibold text-[#174B3B] block">Khanewal, Punjab</span>
              </div>
            </div>
          </div>

          {/* Form */}
          {submitted ? (
            <div className="bg-[#FBF7EF] border border-[#C99A43]/50 p-6 rounded-xl text-center">
              <CheckCircle2 className="w-10 h-10 text-[#174B3B] mx-auto mb-2" />
              <h4 className="font-serif text-lg font-bold text-[#174B3B] mb-1">Message Sent Successfully!</h4>
              <p className="text-xs text-[#777168] max-w-sm mx-auto mb-4">
                Thank you for reaching out, {formData.name}. Our customer care team will respond within 24 business hours.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', phone: '', message: '' });
                }}
                className="text-xs text-[#174B3B] font-semibold underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#25231F] mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tariq Mehmood"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8DED0] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#25231F] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8DED0] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#25231F] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0300 0000000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8DED0] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#25231F] mb-1">Your Message or Inquiry *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Ask about batch harvest dates, bulk orders, or custom packaging..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#E8DED0] text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-[#174B3B]"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-[#174B3B] hover:bg-[#10392E] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors active:scale-95 shadow-md"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
