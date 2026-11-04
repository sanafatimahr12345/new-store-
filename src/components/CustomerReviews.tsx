import React from 'react';
import { SAMPLE_TESTIMONIALS } from '../data/products';
import { Star, Quote, CheckCircle } from 'lucide-react';

export const CustomerReviews: React.FC = () => {
  return (
    <section className="bg-[#FBF7EF] py-16 sm:py-24 border-t border-[#E8DED0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold tracking-[0.25em] text-[#C99A43] uppercase mb-2 block">
            Real Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174B3B] mb-3">
            WHAT OUR CUSTOMERS SAY
          </h2>
          <p className="text-sm sm:text-base text-[#777168] leading-relaxed">
            Stories from kitchens and dining tables brought to life with Pure Harvest.
          </p>

          <div className="flex items-center justify-center gap-3 mt-4">
            <span className="h-[1px] w-12 bg-[#E8DED0]" />
            <span className="w-2 h-2 rounded-full bg-[#C99A43]" />
            <span className="h-[1px] w-12 bg-[#E8DED0]" />
          </div>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SAMPLE_TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="bg-white p-7 sm:p-8 rounded-2xl border border-[#E8DED0] flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow duration-200"
            >
              <div>
                {/* Quote Icon & Stars */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#C99A43]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#C99A43] text-[#C99A43]" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-[#E8DED0] rotate-180" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-[#25231F]/90 leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              {/* Author & City */}
              <div className="pt-4 border-t border-[#E8DED0]/70 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#174B3B] font-serif">
                    {t.name}
                  </div>
                  <div className="text-[11px] text-[#777168]">
                    {t.city}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-[#174B3B] font-medium bg-[#FBF7EF] px-2 py-1 rounded-sm border border-[#E8DED0]">
                  <CheckCircle className="w-3 h-3 text-[#174B3B]" />
                  <span>Verified Buyer</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transparent Demo Identification Note */}
        <div className="mt-8 text-center text-[11px] text-[#777168]">
          Demo preview: Representative customer reviews collected from recent product tasting batches.
        </div>

      </div>
    </section>
  );
};
