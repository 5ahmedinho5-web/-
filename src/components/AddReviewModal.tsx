import React, { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquarePlus } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AddReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, addReview } = useStore();

  const [reviewerName, setReviewerName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName || !businessType || !content) return;

    addReview({
      reviewerName,
      businessType,
      city: city || 'الرياض',
      rating,
      content,
      date: 'اليوم',
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsReviewModalOpen(false);
      setReviewerName('');
      setBusinessType('');
      setCity('');
      setContent('');
      setRating(5);
    }, 1800);
  };

  const handleClose = () => {
    setIsReviewModalOpen(false);
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8 space-y-5 text-right my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-right">
            <h3 className="text-lg font-bold text-slate-950">شاركنا رأيك وتجربتك</h3>
            <span className="text-xs text-slate-500 font-medium">رأيك يهمنا ويفيد أصحاب الأعمال الآخرين</span>
          </div>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3 animate-in fade-in">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-lg font-bold text-slate-950">شكراً جزيلاً لتقييمك!</h4>
            <p className="text-xs text-slate-600">
              تم إضافة تقييمك بنجاح وسيظهر ضمن تجارب العملاء في المتجر.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rating Stars Picker */}
            <div className="space-y-1.5 text-center p-3 rounded-xl bg-slate-50 border border-slate-100">
              <label className="text-xs font-bold text-slate-700 block">
                اختر عدد النجوم
              </label>
              <div className="flex items-center justify-center gap-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Reviewer Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                اسمك الكريم <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                placeholder="مثال: م. فهد السبيعي"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Business Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                نوع أو اسم النشاط <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="مثال: مالك مطعم في الرياض أو عيادة تجميل"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                المدينة (اختياري)
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="مثال: الرياض، جدة، دبي، الكويت..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>

            {/* Review Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                تفاصيل تجربتك مع نجمة <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="اكتب تجربتك وكيف أثرت التقييمات في حضور نشاطك..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>نشر التقييم</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
