import React from 'react';
import { DollarSign, Clock, CalendarDays, Headphones, MousePointerClick, Layers } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhyUsSection: React.FC = () => {
  const { storeSettings } = useStore();
  const customTexts = storeSettings.sectionContents?.whyUs;

  const points = [
    {
      icon: DollarSign,
      title: 'أسعار مناسبة ومنافسة',
      desc: 'حزم مدروسة التكلفة لتقديم أعلى عائد استثماري لنشاطك، مع خيارات دفع متعددة تناسب ميزانيتك.',
    },
    {
      icon: Clock,
      title: 'تنفيذ سريع وموثوق',
      desc: 'نبدأ تجهيز وبدء الجدولة فور تأكيد الطلب، مع الالتزام التام بالخطط الزمنية المتفق عليها.',
    },
    {
      icon: CalendarDays,
      title: 'إمكانية جدولة الطلبات',
      desc: 'مرونة كاملة في تحديد وتيرة نشر التقييمات وتوزيعها على مدار الأيام والأسابيع لتظهر بشكل طبيعي 100%.',
    },
    {
      icon: Headphones,
      title: 'خدمة عملاء مباشرة على مدار الساعة',
      desc: 'فريق دعم خليجي متخصص يتواصل معك عبر واتساب لمتابعة كل خطوة والإجابة عن أي استفسار فوراً.',
    },
    {
      icon: MousePointerClick,
      title: 'سهولة الطلب في خطوات معدودة',
      desc: 'بدون تسجيل معقد أو اشتراكات طويلة؛ اختر باقتك، ضع رابط نشاطك، وأكمل طلبك مباشرة في واتساب.',
    },
    {
      icon: Layers,
      title: 'حزم متعددة تناسب جميع الأنشطة',
      desc: 'من الباقات التجريبية الخفيفة وحتى الحزم الكبرى للفروع والشركات، تجد دائماً الباقة التي تلبي احتياجك بدقة.',
    },
  ];

  return (
    <section id="why-us" className="py-16 md:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold">
            <span>{customTexts?.badge || 'ميزتنا التنافسية'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-950">
            {customTexts?.title || 'لماذا يختار أصحاب الأنشطة التجارية متجر نجمة؟'}
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            {customTexts?.description || 'نجمع بين الاحترافية العالية، الأمان التقني الصارم، والخدمة المباشرة التي تريح بالك.'}
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 space-y-3 text-right"
              >
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-900 shadow-2xs">
                  <Icon className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-950">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
