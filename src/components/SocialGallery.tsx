import React, { useState } from 'react';
import { INSTAGRAM_POSTS } from '../data/products';
import { Instagram, Heart, MessageCircle, ExternalLink, X } from 'lucide-react';

export const SocialGallery: React.FC = () => {
  const [activePost, setActivePost] = useState<typeof INSTAGRAM_POSTS[0] | null>(null);

  return (
    <section className="bg-white py-16 sm:py-20 border-t border-[#E8DED0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.2em] text-[#C99A43] uppercase mb-2">
            <Instagram className="w-4 h-4 text-[#C99A43]" />
            <span>@pureharvest.pk</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174B3B] mb-2">
            FOLLOW OUR FOOD JOURNEY
          </h2>
          <p className="text-sm text-[#777168]">
            Behind the scenes: slow simmering, raw harvests, and traditional kitchen heritage.
          </p>
        </div>

        {/* 6 Square Images Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              onClick={() => setActivePost(post)}
              className="group relative aspect-square overflow-hidden rounded-xl bg-[#FBF7EF] border border-[#E8DED0] cursor-pointer shadow-2xs"
            >
              <img
                src={post.image}
                alt={post.caption}
                className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              {/* Dark Hover Scrim with Likes & Icon */}
              <div className="absolute inset-0 bg-[#10392E]/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-3 text-center">
                <Instagram className="w-6 h-6 mb-2 text-[#DCA83F]" />
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <Heart className="w-3.5 h-3.5 fill-[#DCA83F] text-[#DCA83F]" />
                  <span>{post.likes}</span>
                </div>
                <span className="text-[10px] text-white/80 mt-1 line-clamp-2">
                  {post.caption}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Post Modal */}
        {activePost && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 border border-[#E8DED0]">
              <div className="relative aspect-square bg-black">
                <img
                  src={activePost.image}
                  alt={activePost.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setActivePost(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#174B3B] text-white flex items-center justify-center font-bold text-xs">
                      PH
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#174B3B]">pureharvest.pk</div>
                      <div className="text-[10px] text-[#777168]">Traditional Pakistani Heritage</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-rose-600 font-semibold">
                    <Heart className="w-4 h-4 fill-rose-600" />
                    <span>{activePost.likes} likes</span>
                  </div>
                </div>

                <p className="text-xs text-[#25231F] leading-relaxed mb-3">
                  {activePost.caption}
                </p>
                <div className="text-[11px] font-semibold text-[#C99A43]">
                  {activePost.tag}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
