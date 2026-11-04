import React from 'react';
import { Leaf, Award, ShieldCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: Leaf,
      title: '100% PURE',
      description: 'No unnecessary additives. Just carefully selected natural ingredients from trusted local farmers.'
    },
    {
      icon: Award,
      title: 'TRADITIONAL QUALITY',
      description: 'Prepared with time-honored traditional methods and meticulous attention to every single detail.'
    },
    {
      icon: ShieldCheck,
      title: 'AUTHENTIC TASTE',
      description: 'Bringing the original, uncompromised taste of traditional Pakistani food heritage to your home.'
    }
  ];

  return (
    <section className="bg-[#FBF7EF] py-16 sm:py-20 border-y border-[#E8DED0]/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold tracking-[0.25em] text-[#C99A43] uppercase mb-2 block">
            Our Promise of Purity
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174B3B] mb-3">
            WHY CHOOSE US?
          </h2>
          <p className="text-sm sm:text-base text-[#777168] leading-relaxed">
            Quality you can trust, tradition you can taste.
          </p>
        </div>

        {/* 3 Feature Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-xs p-8 rounded-2xl border border-[#E8DED0] text-center flex flex-col items-center hover:bg-white hover:shadow-md transition-all duration-300"
              >
                {/* Circular Icon Container */}
                <div className="w-16 h-16 rounded-full bg-[#FBF7EF] border border-[#C99A43]/40 flex items-center justify-center text-[#174B3B] mb-5 shadow-xs">
                  <Icon className="w-7 h-7 text-[#174B3B]" />
                </div>

                {/* Heading */}
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#174B3B] tracking-wider uppercase mb-2.5">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#777168] leading-relaxed max-w-xs">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
