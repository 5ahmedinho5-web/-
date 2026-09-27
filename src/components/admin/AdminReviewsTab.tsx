import React, { useState } from 'react';
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Save,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerReview } from '../../types';

export const AdminReviewsTab: React.FC = () => {
  const { reviews, reviewsStats, updateReviewsStats, addReview, updateReview, deleteReview } =
    useStore();

  // Stats state
  const [statsRating, setStatsRating] = useState(reviewsStats.averageRating);
  const [statsTotal, setStatsTotal] = useState(reviewsStats.totalRatingsCount);
  const [statsSatisfaction, setStatsSatisfaction] = useState(reviewsStats.satisfiedPercentage);
  const [statsSaved, setStatsSaved] = useState(false);

  // Edit / Add review state
  const [editingRev, setEditingRev] = useState<CustomerReview | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formBusinessType, setFormBusinessType] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formContent, setFormContent] = useState('');
  const [formCity, setFormCity] = useState('الرياض');

  const handleSaveStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateReviewsStats({
      ...reviewsStats,
      averageRating: Number(statsRating),
      totalRatingsCount: Number(statsTotal),
      satisfiedPercentage: Number(statsSatisfaction),
    });
    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 2500);
  };

  const openEditModal = (rev: CustomerReview) => {
    setEditingRev(rev);
    setFormName(rev.reviewerName);
    setFormBusinessType(rev.businessType);
    setFormRating(rev.rating);
    setFormContent(rev.content);
    setFormCity(rev.city || 'الرياض');
    setIsNewModalOpen(false);
  };

  const openNewModal = () => {
    setEditingRev(null);
    setFormName('');
    setFormBusinessType('مقهى / كافيه');
    setFormRating(5);
    setFormContent('خدمة احترافية جداً ونتائج ملموسة في زيادة الزيارات على خرائط جوجل.');
    setFormCity('الرياض');
    setIsNewModalOpen(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formContent) return;

    if (editingRev) {
      updateReview({
        ...editingRev,
        reviewerName: formName,
        businessType: formBusinessType,
        rating: formRating,
        content: formContent,
        city: formCity,
      });
      setEditingRev(null);
    } else if (isNewModalOpen) {
      addReview({
        reviewerName: formName,
        businessType: formBusinessType,
        rating: formRating,
        content: formContent,
        city: formCity,
        date: new Date().toISOString().split('T')[0],
      });
      setIsNewModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Global Reviews Stats Editor */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">إحصائيات التقييمات العامة</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              الأرقام المعروضة في الصفحة الرئيسية وتحت البنر (مثل تقييم 4.9 وبناء على 14850 عميل)
            </p>
          </div>

          {statsSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ الإحصائيات بنجاح!</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveStats} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">متوسط التقييم العام (من 5):</label>
            <input
              type="number"
              step="0.1"
              max="5"
              min="1"
              value={statsRating}
              onChange={(e) => setStatsRating(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">إجمالي التقييمات الموثقة:</label>
            <input
              type="number"
              value={statsTotal}
              onChange={(e) => setStatsTotal(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">نسبة رضا العملاء (%):</label>
            <input
              type="number"
              step="0.1"
              max="100"
              value={statsSatisfaction}
              onChange={(e) => setStatsSatisfaction(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="sm:col-span-3 flex justify-end pt-1">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>تحديث الإحصائيات المعروضة</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Customer Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900">آراء العملاء وتجاربهم</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              التقييمات الظاهرة في قسم "شاهد آراء عملائنا"
            </p>
          </div>

          <button
            type="button"
            onClick={openNewModal}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة رأي عميل جديد</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                      {rev.reviewerName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900 flex items-center gap-1">
                        <span>{rev.reviewerName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {rev.businessType} {rev.city ? `• ${rev.city}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                  "{rev.content}"
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-2.5">
                <span className="text-[10px] text-slate-400 font-mono">{rev.date}</span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => openEditModal(rev)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="تعديل"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف تقييم ${rev.reviewerName}؟`)) {
                        deleteReview(rev.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="حذف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit / Add Modal */}
      {(editingRev || isNewModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-right animate-in fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base text-slate-900">
                {editingRev ? 'تعديل رأي العميل' : 'إضافة رأي جديد'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingRev(null);
                  setIsNewModalOpen(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReview} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">اسم العميل:</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">نوع النشاط:</label>
                  <input
                    type="text"
                    required
                    value={formBusinessType}
                    onChange={(e) => setFormBusinessType(e.target.value)}
                    placeholder="مثال: مطعم سحابي"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">المدينة:</label>
                <input
                  type="text"
                  value={formCity}
                  onChange={(e) => setFormCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">التقييم (نجوم):</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormRating(star)}
                      className="p-1 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">نص التجربة أو الرأي:</label>
                <textarea
                  rows={3}
                  required
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingRev(null);
                    setIsNewModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold"
                >
                  حفظ الرأي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
