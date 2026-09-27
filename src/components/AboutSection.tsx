import React from 'react';
import { Sparkles, CheckCircle2, Target, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutSection: React.FC = () => {
  const { storeSettings } = useStore();
  const customTexts = storeSettings.sectionContents?.about;

  return (
    <section id="about" className="py-16 md:py-24 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{customTexts?.badge || 'من نحن'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950 leading-tight">
              {customTexts?.title || 'نجمة.. شريكك الاستراتيجي في بناء هيبة حضورك على Google Maps'}
            </h2>

            <p className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-normal">
              {customTexts?.paragraph1 ||
                'نجمة هي خدمة متخصصة تأسست لتلبي حاجة رواد وأصحاب الأنشطة التجارية في المملكة العربية السعودية ودول الخليج العربي لبناء سمعة رقمية فائقة المصداقية على خرائط Google.'}
            </p>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              {customTexts?.paragraph2 ||
                'نؤمن بأن أول انطباع للعميل يتشكل في ثوانٍ معدودة عند رؤية التقييم والتعليقات. لذلك نوفر لك حلولاً ذكية وآمنة 100% تجمع بين دقة التوزيع الزمني واستخدام حسابات نشطة ذات موثوقية عالية، لتتحول صفحتك على الخريطة إلى نقطة جذب يومية مستمرة لمئات الزوار والزبائن.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                  <Target className="w-4 h-4" />
                  <span>{customTexts?.visionTitle || 'رؤيتنا'}</span>
                </div>
                <p className="text-xs text-slate-600">{customTexts?.visionDesc || 'تمكين الأنشطة من صدارة نتائج البحث الجغرافي.'}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{customTexts?.standardsTitle || 'معاييرنا'}</span>
                </div>
                <p className="text-xs text-slate-600">{customTexts?.standardsDesc || 'أمان كامل 100% بدون أي مخالفات لخوارزميات قوقل.'}</p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Users className="w-4 h-4" />
                  <span>{customTexts?.teamTitle || 'فريقنا'}</span>
                </div>
                <p className="text-xs text-slate-600">{customTexts?.teamDesc || 'مستشارون تسويقيون متاحون لخدمتك ومتابعة طلبك.'}</p>
              </div>
            </div>

          </div>

          {/* Left Column: Visual Highlight Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-white border border-slate-200/90 p-8 shadow-xl space-y-6 text-center">
              
              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
                <Sparkles className="w-8 h-8 text-amber-300" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-950">ثقة تتحدث عن نتائجها</h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  خدمنا مئات المطاعم، المقاهي، العيادات، والمتاجر في مختلف مدن المملكة والخليج، وحققنا لهم نمواً ملموساً في الزيارات والمبيعات.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-3 text-right">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xl font-black text-slate-900 font-mono">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">حسابات حقيقية ونشطة</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xl font-black text-slate-900 font-mono">24/7</div>
                  <div className="text-[11px] text-slate-500 font-medium">متابعة ودعم مستمر</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
