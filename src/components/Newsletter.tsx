import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address (e.g. name@example.com).');
      return;
    }

    setStatus('loading');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 600);
  };

  return (
    <section className="bg-[#10392E] text-white py-14 sm:py-16 relative overflow-hidden border-t border-[#174B3B]">
      
      {/* Decorative background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C99A43]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="w-12 h-12 rounded-full bg-[#174B3B] border border-[#C99A43]/40 flex items-center justify-center text-[#DCA83F] mx-auto mb-4">
          <Mail className="w-6 h-6 text-[#DCA83F]" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold mb-3 tracking-wide">
          STAY CONNECTED WITH PURE HARVEST
        </h2>

        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
          Subscribe to receive special offers, new seasonal arrivals, and pure food heritage updates.
        </p>

        {status === 'success' ? (
          <div className="bg-[#174B3B] border border-[#C99A43]/50 p-6 rounded-xl max-w-md mx-auto text-center animate-in zoom-in-95">
            <CheckCircle2 className="w-8 h-8 text-[#DCA83F] mx-auto mb-2" />
            <h4 className="font-serif text-lg font-bold text-white mb-1">Welcome to Pure Harvest!</h4>
            <p className="text-xs text-white/80">
              Thank you for subscribing. You will be the first to know about fresh seasonal harvests and special offers.
            </p>
            <button
              onClick={() => setStatus('idle')}
              className="mt-4 text-xs text-[#DCA83F] underline font-medium hover:text-white"
            >
              Subscribe another email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-white text-[#25231F] rounded-lg text-sm placeholder:text-[#777168] focus:outline-none focus:ring-2 focus:ring-[#C99A43] border border-[#E8DED0]"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C99A43] hover:bg-[#DCA83F] text-[#10392E] font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shrink-0 disabled:opacity-70 active:scale-95"
              >
                <span>{status === 'loading' ? 'Joining...' : 'Subscribe'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {status === 'error' && (
              <div className="flex items-center justify-center gap-1.5 mt-2.5 text-xs text-rose-300">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <p className="text-[11px] text-white/60 mt-3">
              We respect your privacy. No spam, only natural goodness. Unsubscribe anytime.
            </p>
          </form>
        )}

      </div>
    </section>
  );
};
