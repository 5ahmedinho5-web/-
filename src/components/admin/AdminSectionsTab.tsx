import React, { useState } from 'react';
import {
  Layers,
  Save,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { StoreSectionsVisibility } from '../../types';

export const AdminSectionsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useStore();
  const [visibility, setVisibility] = useState<StoreSectionsVisibility>(
    storeSettings.sectionsVisibility
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  const sectionsList: { key: keyof StoreSectionsVisibility; label: string; desc: string }[] = [
    { key: 'hero', label: 'القسم الرئيسي (Hero)', desc: 'البنر والشعار والأرقام المتحركة وأزرار البداية' },
    { key: 'packages', label: 'حزم وباقات التقييمات', desc: 'بطاقات التقييمات التفاعلية وأزرار الطلب' },
    { key: 'reviews', label: 'قسم آراء العملاء', desc: 'تجارب العملاء الموثقة وتقييمات 5 نجوم' },
    { key: 'whyUs', label: 'قسم لماذا تختار نجمة؟', desc: 'مزايا الضمان والحسابات الموثقة' },
    { key: 'features', label: 'قسم المزايا والخصائص', desc: 'شرح مفصل لطريقة العمل والسرية' },
    { key: 'about', label: 'قسم عن متجر نجمة', desc: 'نبذة عن المنصة ورؤيتنا في تعزيز الأنشطة' },
    { key: 'faq', label: 'قسم الأسئلة الشائعة', desc: 'إجابات الأسئلة المتكررة حول التقييمات والضمان' },
    { key: 'contact', label: 'قسم التواصل والفوتير', desc: 'روابط التواصل السريع وحقوق المتجر' },
  ];

  const handleToggle = (key: keyof StoreSectionsVisibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      ...storeSettings,
      sectionsVisibility: visibility,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base text-slate-900">التحكم في ظهور أقسام المتجر</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            إظهار أو إخفاء أي قسم من واجهة المتجر الرئيسية بضغطة زر
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>تم حفظ خيارات الظهور بنجاح!</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionsList.map((sec) => {
            const isVisible = visibility[sec.key];
            return (
              <div
                key={sec.key}
                onClick={() => handleToggle(sec.key)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                  isVisible
                    ? 'bg-white border-emerald-300 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="space-y-0.5">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{sec.label}</h4>
                  <p className="text-[11px] text-slate-500">{sec.desc}</p>
                </div>

                <div
                  className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center shrink-0 ${
                    isVisible ? 'bg-[#006644] justify-end' : 'bg-slate-300 justify-start'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full bg-white shadow-md" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>حفظ إعدادات ظهور الأقسام</span>
          </button>
        </div>
      </form>
    </div>
  );
};
