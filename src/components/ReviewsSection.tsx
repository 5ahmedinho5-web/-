import React from 'react';
import { Star, MessageSquarePlus, Building2, Calendar, MapPin } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ReviewsSection: React.FC = () => {
  const { reviews, reviewsStats, setIsReviewModalOpen, storeSettings } = useStore();
  const customTexts = storeSettings.sectionContents?.reviews;

  return (
    <section id="reviews" className="py-16 md:py-24 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header & Stats Overview */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="space-y-3 text-right">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{customTexts?.badge || 'أحدث آراء عملائنا'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950">
              {customTexts?.title || 'أحدث آراء عملائنا'}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl">
              {customTexts?.description || 'تجارب حقيقية لشركاء النجاح الذين عززوا ظهورهم على خرائط قوقل ونالوا ثقة زبائنهم.'}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <div className="text-xl sm:text-2xl font-black text-slate-950 flex items-center justify-center gap-1">
                <span>{reviewsStats.averageRating}</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <div className="text-[11px] font-semibold text-slate-500">التقييم العام</div>
            </div>

            <div className="px-4 py-3 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-center">
              <div className="text-xl sm:text-2xl font-black text-indigo-600">
                +{reviewsStats.totalRatingsCount.toLocaleString()}
              </div>
              <div className="text-[11px] font-semibold text-slate-500">إجمالي التقييمات</div>
            </div>

            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-98 active:translate-y-0 transition-all flex items-center gap-2 cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{customTexts?.addReviewButtonText || 'أضف تقييمك'}</span>
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4 text-right"
            >
              <div className="space-y-3">
                {/* Rating & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                  </span>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                  "{item.content}"
                </p>
              </div>

              {/* Reviewer Details */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-950">{item.reviewerName}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3 h-3 text-indigo-600" />
                    <span>{item.businessType}</span>
                  </div>
                </div>

                {item.city && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[11px]">
                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                    <span>{item.city}</span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
