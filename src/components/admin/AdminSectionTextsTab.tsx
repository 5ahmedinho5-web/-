import React, { useState } from 'react';
import {
  Type,
  Save,
  CheckCircle2,
  Package,
  Sparkles,
  ShieldCheck,
  Star,
  HelpCircle,
  Phone,
  Layout,
  Info,
  Clock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SectionContentSettings, PackagesSectionTexts } from '../../types';
import { CardCountdownTimer } from '../CardCountdownTimer';

export const AdminSectionTextsTab: React.FC = () => {
  const { storeSettings, updateStoreSettings } = useStore();

  const [activeSubTab, setActiveSubTab] = useState<
    'packages' | 'hero' | 'reviews' | 'features' | 'whyUs' | 'about' | 'faq' | 'contact'
  >('packages');

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local state for all sections
  const [packagesTexts, setPackagesTexts] = useState<PackagesSectionTexts>({
    badgeText: storeSettings.packagesSectionTexts?.badgeText || 'باقات وحزم التقييمات المعتمدة',
    sectionTitle: storeSettings.packagesSectionTexts?.sectionTitle || 'اختر باقة التقييمات الأنسب لنشاطك التجاري',
    sectionDescription: storeSettings.packagesSectionTexts?.sectionDescription || 'حزم مرنة ومدروسة بعناية لتعزيز ترتيبك وتصدر نتائج البحث الجغرافي على خرائط Google وباقي المنصات.',
    gestureHintText: storeSettings.packagesSectionTexts?.gestureHintText || 'مرر أفقياً لتصفح جميع الباقات، أو اضغط على أي باقة للاطلاع على تفاصيلها وطلبها مباشرة',
    guaranteeBoxTitle: storeSettings.packagesSectionTexts?.guaranteeBoxTitle || 'ضمان ذهبي وأمان تام 100% لنشاطك التجاري',
    guaranteeBoxDescription: storeSettings.packagesSectionTexts?.guaranteeBoxDescription || 'جميع التقييمات صادرة من حسابات خليجية وسعودية حقيقية 100% (مرشدين محليين نشطين Local Guides)، مع صياغة مخصصة ومثرية تعكس جودة نشاطك وتجذب زوارك. نعتمد على جدولة زمنية ذكية وتوزيع طبيعي متوافق تماماً مع خوارزميات خرائط Google، مع ضمان تعويض مجاني مدى الحياة.',
    guaranteePoint1: storeSettings.packagesSectionTexts?.guaranteePoint1 || 'حسابات خليجية موثقة 100%',
    guaranteePoint2: storeSettings.packagesSectionTexts?.guaranteePoint2 || 'بدون أي برامج آلية أو روبوتات',
    guaranteePoint3: storeSettings.packagesSectionTexts?.guaranteePoint3 || 'ضمان وتعويض مجاني مدى الحياة',
    countdownEnabled: storeSettings.packagesSectionTexts?.countdownEnabled !== false,
    countdownDays: storeSettings.packagesSectionTexts?.countdownDays ?? 1,
    countdownHours: storeSettings.packagesSectionTexts?.countdownHours ?? 12,
    countdownMinutes: storeSettings.packagesSectionTexts?.countdownMinutes ?? 30,
    countdownLabel: storeSettings.packagesSectionTexts?.countdownLabel || 'لفترة محدودة',
  });

  const [heroTexts, setHeroTexts] = useState({
    badge: storeSettings.sectionContents?.hero?.badge || 'الخيار الأول للأنشطة التجارية في السعودية والخليج',
    titlePart1: storeSettings.sectionContents?.hero?.titlePart1 || 'خلّ حضور نشاطك على',
    titlePart2: storeSettings.sectionContents?.hero?.titlePart2 || 'خرائط Google أقوى مع نجمة',
    description: storeSettings.sectionContents?.hero?.description || 'التقييمات والحضور القوي على خرائط جوجل هما المفتاح الحقيقي لبناء الثقة الفورية وتصدر نتائج البحث وزيادة اتصالات وزيارات العملاء لنشاطك التجاري يومياً.',
    ctaButtonText: storeSettings.sectionContents?.hero?.ctaButtonText || 'تصفح الباقات والأسعار',
    secondaryButtonText: storeSettings.sectionContents?.hero?.secondaryButtonText || 'شاهد آراء عملائنا',
    bullet1: storeSettings.sectionContents?.hero?.bullet1 || 'حسابات مرشدين محليين موثوقة 100%',
    bullet2: storeSettings.sectionContents?.hero?.bullet2 || 'ضمان تعويض مجاني مدى الحياة',
    bullet3: storeSettings.sectionContents?.hero?.bullet3 || 'جدولة طبيعية وآمنة ترفع ترتيبك',
  });

  const [reviewsTexts, setReviewsTexts] = useState({
    badge: storeSettings.sectionContents?.reviews?.badge || 'أحدث آراء عملائنا',
    title: storeSettings.sectionContents?.reviews?.title || 'ماذا يقول أصحاب الأنشطة عن نجمة؟',
    description: storeSettings.sectionContents?.reviews?.description || 'تجارب حقيقية لشركاء النجاح الذين عززوا ظهورهم على خرائط قوقل ونالوا ثقة زبائنهم.',
    addReviewButtonText: storeSettings.sectionContents?.reviews?.addReviewButtonText || 'أضف تقييمك',
  });

  const [featuresTexts, setFeaturesTexts] = useState({
    badge: storeSettings.sectionContents?.features?.badge || 'لماذا خرائط Google هي الأهم؟',
    title: storeSettings.sectionContents?.features?.title || 'فوائد تعزيز حضور نشاطك التجاري على Google Maps',
    description: storeSettings.sectionContents?.features?.description || 'أكثر من 80% من قرارات الشراء والزيارة في السعودية والخليج تبدأ من بحث سريع على الخريطة.',
  });

  const [whyUsTexts, setWhyUsTexts] = useState({
    badge: storeSettings.sectionContents?.whyUs?.badge || 'ميزتنا التنافسية',
    title: storeSettings.sectionContents?.whyUs?.title || 'لماذا يختار أصحاب الأنشطة التجارية متجر نجمة؟',
    description: storeSettings.sectionContents?.whyUs?.description || 'نجمع بين الاحترافية العالية، الأمان التقني الصارم، والخدمة المباشرة التي تريح بالك.',
  });

  const [aboutTexts, setAboutTexts] = useState({
    badge: storeSettings.sectionContents?.about?.badge || 'من نحن',
    title: storeSettings.sectionContents?.about?.title || 'نجمة.. شريكك الاستراتيجي في بناء هيبة حضورك على Google Maps',
    paragraph1: storeSettings.sectionContents?.about?.paragraph1 || 'نجمة هي خدمة متخصصة تأسست لتلبي حاجة رواد وأصحاب الأنشطة التجارية في المملكة العربية السعودية ودول الخليج العربي لبناء سمعة رقمية فائقة المصداقية على خرائط Google.',
    paragraph2: storeSettings.sectionContents?.about?.paragraph2 || 'نؤمن بأن أول انطباع للعميل يتشكل في ثوانٍ معدودة عند رؤية التقييم والتعليقات. لذلك نوفر لك حلولاً ذكية وآمنة 100% تجمع بين دقة التوزيع الزمني واستخدام حسابات نشطة ذات موثوقية عالية، لتتحول صفحتك على الخريطة إلى نقطة جذب يومية مستمرة لمئات الزوار والزبائن.',
    visionTitle: storeSettings.sectionContents?.about?.visionTitle || 'رؤيتنا',
    visionDesc: storeSettings.sectionContents?.about?.visionDesc || 'تمكين الأنشطة من صدارة نتائج البحث الجغرافي.',
    standardsTitle: storeSettings.sectionContents?.about?.standardsTitle || 'معاييرنا',
    standardsDesc: storeSettings.sectionContents?.about?.standardsDesc || 'أمان كامل 100% بدون أي مخالفات لخوارزميات قوقل مع ضمان مدى الحياة.',
    teamTitle: storeSettings.sectionContents?.about?.teamTitle || 'فريقنا',
    teamDesc: storeSettings.sectionContents?.about?.teamDesc || 'مستشارون تسويقيون متاحون لخدمتك ومتابعة طلبك.',
  });

  const [faqTexts, setFaqTexts] = useState({
    badge: storeSettings.sectionContents?.faq?.badge || 'إجابات واضحة ومباشرة',
    title: storeSettings.sectionContents?.faq?.title || 'الأسئلة الشائعة',
    description: storeSettings.sectionContents?.faq?.description || 'كل ما يهمك معرفته حول طريقة الطلب، الجدولة، الأسعار، وسياسات الخدمة في نجمة.',
  });

  const [contactTexts, setContactTexts] = useState({
    badge: storeSettings.sectionContents?.contact?.badge || 'طرق الطلب والتواصل المباشر',
    title: storeSettings.sectionContents?.contact?.title || 'إتمام الطلب والتواصل الفوري عبر WhatsApp',
    description: storeSettings.sectionContents?.contact?.description || 'لأننا نقدر وقتك ونحرص على التخصيص الكامل لطلبك، يتم تأكيد ومتابعة كافة الطلبات بشكل مباشر عبر واتساب مع مستشارين متخصصين جاهزين للرد عليك فوراً.',
    guaranteeNote: storeSettings.sectionContents?.contact?.guaranteeNote || 'جميع طرق الدفع متاحة وآمنة 100% مع ضمان مدى الحياة لكافة الباقات.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSectionContents: SectionContentSettings = {
      ...storeSettings.sectionContents,
      packages: packagesTexts,
      hero: heroTexts,
      reviews: reviewsTexts,
      features: featuresTexts,
      whyUs: whyUsTexts,
      about: aboutTexts,
      faq: faqTexts,
      contact: contactTexts,
    };

    updateStoreSettings({
      ...storeSettings,
      packagesSectionTexts: packagesTexts,
      sectionContents: updatedSectionContents,
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const navButtons: {
    id: typeof activeSubTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'packages', label: 'قسم الباقات (أعلى وأسفل الكروت)', icon: Package },
    { id: 'hero', label: 'القسم الرئيسي (Hero)', icon: Layout },
    { id: 'reviews', label: 'قسم آراء العملاء', icon: Star },
    { id: 'whyUs', label: 'لماذا تختار نجمة؟', icon: ShieldCheck },
    { id: 'features', label: 'المزايا والفوائد', icon: Sparkles },
    { id: 'about', label: 'من نحن والرؤية', icon: Info },
    { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
    { id: 'contact', label: 'التواصل والضمان', icon: Phone },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h3 className="font-black text-base sm:text-lg text-slate-900 flex items-center gap-2">
            <Type className="w-5 h-5 text-emerald-600" />
            <span>تعديل نصوص أقسام وصفحات المتجر</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            تحكم كامل في جميع العناوين والنصوص والشارات التي تظهر فوق وتحت كروت الباقات وفي جميع أقسام المتجر
          </p>
        </div>

        {savedSuccess && (
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5 shrink-0 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ التعديلات بنجاح!</span>
          </span>
        )}
      </div>

      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {navButtons.map((btn) => {
          const Icon = btn.icon;
          const isActive = activeSubTab === btn.id;
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => setActiveSubTab(btn.id)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-[#006644] text-white border-[#006644] shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{btn.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Form */}
      <form onSubmit={handleSave} className="space-y-5 text-xs">
        
        {/* ================= 1. PACKAGES SECTION TEXTS (Above & Below Cards) ================= */}
        {activeSubTab === 'packages' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Texts Above Cards */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>النصوص الموجودة فوق كروت الباقات</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  الشارة العلوية، العنوان الرئيسي لقسم الباقات، والوصف التوضيحي
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">نص الشارة العلوية (Badge):</label>
                  <input
                    type="text"
                    value={packagesTexts.badgeText}
                    onChange={(e) =>
                      setPackagesTexts({ ...packagesTexts, badgeText: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">عنوان قسم الباقات الرئيسي:</label>
                  <input
                    type="text"
                    value={packagesTexts.sectionTitle}
                    onChange={(e) =>
                      setPackagesTexts({ ...packagesTexts, sectionTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">الوصف التوضيحي تحت العنوان:</label>
                  <textarea
                    rows={2}
                    value={packagesTexts.sectionDescription}
                    onChange={(e) =>
                      setPackagesTexts({ ...packagesTexts, sectionDescription: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">نص التلميحة الحركية (مرر أفقياً):</label>
                  <input
                    type="text"
                    value={packagesTexts.gestureHintText}
                    onChange={(e) =>
                      setPackagesTexts({ ...packagesTexts, gestureHintText: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Countdown Timer Settings Card */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>العداد التنازلي المصغر تحت السعر في الكروت</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    التحكم في ظهور العداد التنازلي المصغر تحت السعر في كل كروت الباقات وتحديد الأيام والوقت
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    checked={packagesTexts.countdownEnabled !== false}
                    onChange={(e) =>
                      setPackagesTexts({ ...packagesTexts, countdownEnabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>تفعيل العداد في كل الكروت</span>
                </label>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 text-xs block">النص بجانب العداد:</label>
                    <input
                      type="text"
                      value={packagesTexts.countdownLabel || ''}
                      onChange={(e) =>
                        setPackagesTexts({ ...packagesTexts, countdownLabel: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-xs"
                      placeholder="لفترة محدودة"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 text-xs block">الأيام (Days):</label>
                    <input
                      type="number"
                      min="0"
                      max="30"
                      value={packagesTexts.countdownDays ?? 1}
                      onChange={(e) =>
                        setPackagesTexts({
                          ...packagesTexts,
                          countdownDays: Math.max(0, parseInt(e.target.value, 10) || 0),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 text-xs block">الساعات (Hours):</label>
                    <input
                      type="number"
                      min="0"
                      max="23"
                      value={packagesTexts.countdownHours ?? 12}
                      onChange={(e) =>
                        setPackagesTexts({
                          ...packagesTexts,
                          countdownHours: Math.max(0, Math.min(23, parseInt(e.target.value, 10) || 0)),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 text-xs block">الدقائق (Minutes):</label>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={packagesTexts.countdownMinutes ?? 30}
                      onChange={(e) =>
                        setPackagesTexts({
                          ...packagesTexts,
                          countdownMinutes: Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)),
                        })
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold text-xs"
                    />
                  </div>
                </div>

                {/* Live Preview of small in-card badge */}
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">معاينة شكل العداد أسفل السعر في الكرت:</span>
                  <div className="max-w-md">
                    <CardCountdownTimer
                      enabled={packagesTexts.countdownEnabled !== false}
                      days={packagesTexts.countdownDays}
                      hours={packagesTexts.countdownHours}
                      minutes={packagesTexts.countdownMinutes}
                      label={packagesTexts.countdownLabel}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Texts Below Cards (Guarantee Box) */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4">
              <div className="border-b border-slate-100 pb-2">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>النصوص الموجودة تحت كروت الباقات (صندوق الضمان الذهبي)</span>
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  عنوان صندوق الضمان، الشرح المفصل، ونقاط الثقة الثلاث
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">عنوان صندوق الضمان:</label>
                  <input
                    type="text"
                    value={packagesTexts.guaranteeBoxTitle}
                    onChange={(e) =>
                      setPackagesTexts({ ...packagesTexts, guaranteeBoxTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">نص الشرح داخل صندوق الضمان:</label>
                  <textarea
                    rows={3}
                    value={packagesTexts.guaranteeBoxDescription}
                    onChange={(e) =>
                      setPackagesTexts({ ...packagesTexts, guaranteeBoxDescription: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">نقطة الضمان 1:</label>
                    <input
                      type="text"
                      value={packagesTexts.guaranteePoint1}
                      onChange={(e) =>
                        setPackagesTexts({ ...packagesTexts, guaranteePoint1: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">نقطة الضمان 2:</label>
                    <input
                      type="text"
                      value={packagesTexts.guaranteePoint2}
                      onChange={(e) =>
                        setPackagesTexts({ ...packagesTexts, guaranteePoint2: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">نقطة الضمان 3 (مدى الحياة):</label>
                    <input
                      type="text"
                      value={packagesTexts.guaranteePoint3}
                      onChange={(e) =>
                        setPackagesTexts({ ...packagesTexts, guaranteePoint3: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. HERO SECTION TEXTS ================= */}
        {activeSubTab === 'hero' && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Layout className="w-4 h-4 text-emerald-600" />
                <span>نصوص الواجهة الرئيسية (Hero Section)</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">شارة الثقة العلوية (Trust Badge):</label>
                <input
                  type="text"
                  value={heroTexts.badge}
                  onChange={(e) => setHeroTexts({ ...heroTexts, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الوصف التسويقي أسفل الشعار:</label>
                <textarea
                  rows={3}
                  value={heroTexts.description}
                  onChange={(e) => setHeroTexts({ ...heroTexts, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">ميزة الهيرو 1:</label>
                  <input
                    type="text"
                    value={heroTexts.bullet1}
                    onChange={(e) => setHeroTexts({ ...heroTexts, bullet1: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">ميزة الهيرو 2:</label>
                  <input
                    type="text"
                    value={heroTexts.bullet2}
                    onChange={(e) => setHeroTexts({ ...heroTexts, bullet2: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">ميزة الهيرو 3:</label>
                  <input
                    type="text"
                    value={heroTexts.bullet3}
                    onChange={(e) => setHeroTexts({ ...heroTexts, bullet3: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. REVIEWS SECTION TEXTS ================= */}
        {activeSubTab === 'reviews' && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Star className="w-4 h-4 text-emerald-600" />
                <span>نصوص قسم آراء وتقييمات العملاء</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الشارة (Badge):</label>
                <input
                  type="text"
                  value={reviewsTexts.badge}
                  onChange={(e) => setReviewsTexts({ ...reviewsTexts, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان القسم:</label>
                <input
                  type="text"
                  value={reviewsTexts.title}
                  onChange={(e) => setReviewsTexts({ ...reviewsTexts, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الوصف:</label>
                <textarea
                  rows={2}
                  value={reviewsTexts.description}
                  onChange={(e) => setReviewsTexts({ ...reviewsTexts, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">نص زر إضافة التقييم:</label>
                <input
                  type="text"
                  value={reviewsTexts.addReviewButtonText}
                  onChange={(e) =>
                    setReviewsTexts({ ...reviewsTexts, addReviewButtonText: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. WHY US SECTION TEXTS ================= */}
        {activeSubTab === 'whyUs' && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>نصوص قسم «لماذا تختار متجر نجمة؟»</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الشارة (Badge):</label>
                <input
                  type="text"
                  value={whyUsTexts.badge}
                  onChange={(e) => setWhyUsTexts({ ...whyUsTexts, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان القسم:</label>
                <input
                  type="text"
                  value={whyUsTexts.title}
                  onChange={(e) => setWhyUsTexts({ ...whyUsTexts, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الوصف:</label>
                <textarea
                  rows={2}
                  value={whyUsTexts.description}
                  onChange={(e) => setWhyUsTexts({ ...whyUsTexts, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. FEATURES SECTION TEXTS ================= */}
        {activeSubTab === 'features' && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>نصوص قسم «فوائد تعزيز الحضور على الخرائط»</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الشارة (Badge):</label>
                <input
                  type="text"
                  value={featuresTexts.badge}
                  onChange={(e) => setFeaturesTexts({ ...featuresTexts, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان القسم:</label>
                <input
                  type="text"
                  value={featuresTexts.title}
                  onChange={(e) => setFeaturesTexts({ ...featuresTexts, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الوصف:</label>
                <textarea
                  rows={2}
                  value={featuresTexts.description}
                  onChange={(e) => setFeaturesTexts({ ...featuresTexts, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. ABOUT SECTION TEXTS ================= */}
        {activeSubTab === 'about' && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>نصوص قسم «من نحن والرؤية»</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الشارة (Badge):</label>
                <input
                  type="text"
                  value={aboutTexts.badge}
                  onChange={(e) => setAboutTexts({ ...aboutTexts, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان القسم الرئيسي:</label>
                <input
                  type="text"
                  value={aboutTexts.title}
                  onChange={(e) => setAboutTexts({ ...aboutTexts, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الفقرة التعريفية الأولى:</label>
                <textarea
                  rows={2}
                  value={aboutTexts.paragraph1}
                  onChange={(e) => setAboutTexts({ ...aboutTexts, paragraph1: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الفقرة التعريفية الثانية:</label>
                <textarea
                  rows={2}
                  value={aboutTexts.paragraph2}
                  onChange={(e) => setAboutTexts({ ...aboutTexts, paragraph2: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">عنوان الرؤية:</label>
                  <input
                    type="text"
                    value={aboutTexts.visionTitle}
                    onChange={(e) => setAboutTexts({ ...aboutTexts, visionTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                  <input
                    type="text"
                    value={aboutTexts.visionDesc}
                    onChange={(e) => setAboutTexts({ ...aboutTexts, visionDesc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-600"
                    placeholder="وصف الرؤية"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">عنوان المعايير:</label>
                  <input
                    type="text"
                    value={aboutTexts.standardsTitle}
                    onChange={(e) => setAboutTexts({ ...aboutTexts, standardsTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                  <input
                    type="text"
                    value={aboutTexts.standardsDesc}
                    onChange={(e) => setAboutTexts({ ...aboutTexts, standardsDesc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-600"
                    placeholder="وصف المعايير"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">عنوان الفريق:</label>
                  <input
                    type="text"
                    value={aboutTexts.teamTitle}
                    onChange={(e) => setAboutTexts({ ...aboutTexts, teamTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                  />
                  <input
                    type="text"
                    value={aboutTexts.teamDesc}
                    onChange={(e) => setAboutTexts({ ...aboutTexts, teamDesc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs text-slate-600"
                    placeholder="وصف الفريق"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 7. FAQ SECTION TEXTS ================= */}
        {activeSubTab === 'faq' && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                <span>نصوص قسم الأسئلة الشائعة</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الشارة (Badge):</label>
                <input
                  type="text"
                  value={faqTexts.badge}
                  onChange={(e) => setFaqTexts({ ...faqTexts, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان القسم:</label>
                <input
                  type="text"
                  value={faqTexts.title}
                  onChange={(e) => setFaqTexts({ ...faqTexts, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الوصف:</label>
                <textarea
                  rows={2}
                  value={faqTexts.description}
                  onChange={(e) => setFaqTexts({ ...faqTexts, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= 8. CONTACT & FOOTER TEXTS ================= */}
        {activeSubTab === 'contact' && (
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs space-y-4 animate-in fade-in duration-200">
            <div className="border-b border-slate-100 pb-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>نصوص قسم التواصل والدفع والضمان</span>
              </h4>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الشارة (Badge):</label>
                <input
                  type="text"
                  value={contactTexts.badge}
                  onChange={(e) => setContactTexts({ ...contactTexts, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان القسم:</label>
                <input
                  type="text"
                  value={contactTexts.title}
                  onChange={(e) => setContactTexts({ ...contactTexts, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الوصف:</label>
                <textarea
                  rows={2}
                  value={contactTexts.description}
                  onChange={(e) => setContactTexts({ ...contactTexts, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 leading-relaxed resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">ملاحظة الدفع والضمان (مدى الحياة):</label>
                <input
                  type="text"
                  value={contactTexts.guaranteeNote}
                  onChange={(e) => setContactTexts({ ...contactTexts, guaranteeNote: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-colors cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>حفظ جميع نصوص الأقسام والتغييرات</span>
          </button>
        </div>

      </form>
    </div>
  );
};
