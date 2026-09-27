import React from 'react';
import { ShieldCheck, Eye, Search, Globe, Trophy, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FeaturesSection: React.FC = () => {
  const { storeSettings } = useStore();
  const customTexts = storeSettings.sectionContents?.features;

  const features = [
    {
      icon: ShieldCheck,
      title: 'تعزيز ثقة العملاء الفورية',
      desc: 'العميل الخليجي قبل ما يدخل أو يطلب، يشوف تقييمك في قوقل ماب. التقييم العالي والتعليقات الإيجابية تحسم قراره بالشراء فوراً وبدون تردد.',
      color: 'bg-emerald-50 text-emerald-700',
    },
    {
      icon: Eye,
      title: 'تحسين الانطباع الأول عن نشاطك',
      desc: 'ملف نشاط تجاري مليء بالنجوم الخمسة وتجارب الناس الممتنة يعكس صورة فخمة وراقية تثبت احترافيتك وجودة منتجاتك أو خدماتك.',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      icon: Search,
      title: 'زيادة فرص الظهور وتصدر نتائج البحث',
      desc: 'خوارزميات خرائط Google تفضل الأنشطة الأكثر تفاعلاً وتقييماً، وترشحك في قائمة أول 3 نتائج (Local 3-Pack) لأي باحث قريب منك.',
      color: 'bg-indigo-50 text-indigo-700',
    },
    {
      icon: Globe,
      title: 'بناء حضور رقمي قوي ومستدام',
      desc: 'التقييمات رصيد استثماري دائم، كل تقييم يضاف لصفحتك يظل يعمل لصالحك طوال اليوم ويجلب لك عملاء وزوار باستمرار.',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      icon: Trophy,
      title: 'التفوق على المنافسين في منطقتك',
      desc: 'مهما كان عدد منافسيك في الحي أو المدينة، ارتقاء تقييمك فوقهم يجعل العميل يتجاوزهم جميعاً ويتجه لك مباشرة.',
      color: 'bg-amber-50 text-amber-700',
    },
    {
      icon: Zap,
      title: 'تجربة طلب ومتابعة سهلة وسريعة',
      desc: 'في نجمة نسهّلها عليك، اطلب باقتك بخطوة واحدة وتواصل معنا عبر واتساب، وفريقنا يتولى الجدولة والتنفيذ باحترافية وأمان.',
      color: 'bg-rose-50 text-rose-700',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold">
            <span>{customTexts?.badge || 'لماذا خرائط Google هي الأهم؟'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950">
            {customTexts?.title || 'فوائد تعزيز حضور نشاطك التجاري على Google Maps'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {customTexts?.description || 'أكثر من 80% من قرارات الشراء والزيارة في السعودية والخليج تبدأ من بحث سريع على الخريطة.'}
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  <span>تأثير ملموس على مبيعاتك اليومية</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
