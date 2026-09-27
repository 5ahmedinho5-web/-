import React, { useState } from 'react';
import {
  HelpCircle,
  Plus,
  Edit2,
  Trash2,
  Save,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { FAQItem } from '../../types';

export const AdminFaqsTab: React.FC = () => {
  const { faqs, addFAQ, updateFAQ, deleteFAQ } = useStore();

  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const [formQuestion, setFormQuestion] = useState('');
  const [formAnswer, setFormAnswer] = useState('');
  const [formCategory, setFormCategory] = useState('عام');

  const openEditModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setFormCategory(faq.category || 'عام');
    setIsNewModalOpen(false);
  };

  const openNewModal = () => {
    setEditingFaq(null);
    setFormQuestion('');
    setFormAnswer('');
    setFormCategory('الخدمات');
    setIsNewModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion || !formAnswer) return;

    if (editingFaq) {
      updateFAQ({
        ...editingFaq,
        question: formQuestion,
        answer: formAnswer,
        category: formCategory,
      });
      setEditingFaq(null);
    } else if (isNewModalOpen) {
      addFAQ({
        question: formQuestion,
        answer: formAnswer,
        category: formCategory,
      });
      setIsNewModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">إدارة الأسئلة الشائعة</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            إضافة وإلغاء وتعديل الأسئلة الشائعة والإجابات المعروضة للعملاء
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="px-4 py-2 rounded-xl bg-[#006644] hover:bg-[#005538] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة سؤال جديد</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2 flex items-start justify-between gap-4"
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold">
                  {faq.category || 'عام'}
                </span>
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{faq.question}</h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pr-2">{faq.answer}</p>
            </div>

            <div className="flex items-center gap-1 shrink-0 pt-1">
              <button
                type="button"
                onClick={() => openEditModal(faq)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                title="تعديل"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
                    deleteFAQ(faq.id);
                  }
                }}
                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Modal */}
      {(editingFaq || isNewModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto" dir="rtl">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-right animate-in fade-in my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base text-slate-900">
                {editingFaq ? 'تعديل السؤال الشائع' : 'إضافة سؤال شائع جديد'}
              </h4>
              <button
                type="button"
                onClick={() => {
                  setEditingFaq(null);
                  setIsNewModalOpen(false);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">التصنيف:</label>
                <input
                  type="text"
                  required
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  placeholder="مثال: الأسعار، الأمان، التنفيذ"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">نص السؤال:</label>
                <input
                  type="text"
                  required
                  value={formQuestion}
                  onChange={(e) => setFormQuestion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الإجابة المفصلة:</label>
                <textarea
                  rows={4}
                  required
                  value={formAnswer}
                  onChange={(e) => setFormAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingFaq(null);
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
                  حفظ السؤال
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
