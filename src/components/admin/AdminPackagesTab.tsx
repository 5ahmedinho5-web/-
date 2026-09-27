import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Flame,
  Star,
  Check,
  Zap,
  Tag,
  ShieldCheck,
  MessageCircle,
  ArrowLeft,
  Sparkles,
  Info,
  FileEdit,
  Save,
  CheckCircle2,
  Users,
  Clock,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { PackageItem, PlatformCategory, PackagesSectionTexts } from '../../types';
import { PlatformIcon } from '../PlatformIcon';
import { CardCountdownTimer } from '../CardCountdownTimer';

const getPlatformTheme = (platform: PlatformCategory = 'google-maps') => {
  switch (platform) {
    case 'snapchat':
      return {
        capsuleClass: 'bg-[#FFFC00] text-slate-950 font-black border border-amber-300 shadow-xs',
        raysColor: 'text-amber-500',
        rayBg1: 'bg-amber-400',
        rayBg2: 'bg-amber-500',
        defaultUnit: 'متابع خليجي',
      };
    case 'facebook':
      return {
        capsuleClass: 'bg-[#1877F2] text-white font-black shadow-xs',
        raysColor: 'text-blue-500',
        rayBg1: 'bg-blue-400',
        rayBg2: 'bg-blue-500',
        defaultUnit: 'متابع خليجي',
      };
    case 'instagram':
      return {
        capsuleClass: 'bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-black shadow-xs',
        raysColor: 'text-[#e1306c]',
        rayBg1: 'bg-rose-400',
        rayBg2: 'bg-orange-500',
        defaultUnit: 'متابع خليجي',
      };
    case 'tiktok':
      return {
        capsuleClass: 'bg-slate-950 text-white font-black border border-slate-800 shadow-xs',
        raysColor: 'text-[#fe2c55]',
        rayBg1: 'bg-[#00f2fe]',
        rayBg2: 'bg-[#fe2c55]',
        defaultUnit: 'متابع خليجي',
      };
    case 'google-maps':
    default:
      return {
        capsuleClass: 'bg-[#006644] text-white font-black shadow-xs',
        raysColor: 'text-emerald-600',
        rayBg1: 'bg-emerald-500',
        rayBg2: 'bg-emerald-600',
        defaultUnit: 'تقييم خليجي',
      };
  }
};

export const AdminPackagesTab: React.FC = () => {
  const {
    packages,
    addPackage,
    updatePackage,
    deletePackage,
    setMostPopularPackage,
    togglePackageVisibility,
    formatPrice,
    storeSettings,
    updateStoreSettings,
  } = useStore();

  // Above & Below Packages Texts Editor State
  const [showSectionTextsEditor, setShowSectionTextsEditor] = useState(false);
  const [sectionTextsSaved, setSectionTextsSaved] = useState(false);
  const [pkgSectionTexts, setPkgSectionTexts] = useState<PackagesSectionTexts>({
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

  const handleSaveSectionTexts = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreSettings({
      ...storeSettings,
      packagesSectionTexts: pkgSectionTexts,
      sectionContents: {
        ...storeSettings.sectionContents,
        packages: pkgSectionTexts,
      },
    });
    setSectionTextsSaved(true);
    setTimeout(() => setSectionTextsSaved(false), 2500);
  };

  // Active platform filter for the dashboard
  const [activePlatformFilter, setActivePlatformFilter] = useState<PlatformCategory>('google-maps');

  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Form states for full text customization
  const [formPlatform, setFormPlatform] = useState<PlatformCategory>('google-maps');
  const [formReviewsCount, setFormReviewsCount] = useState<number>(10);
  const [formCountLabel, setFormCountLabel] = useState<string>('');
  const [formBadgeText, setFormBadgeText] = useState<string>('');
  const [formPopularBadgeText, setFormPopularBadgeText] = useState<string>('الأكثر طلباً');
  const [formDiscountBadgeText, setFormDiscountBadgeText] = useState<string>('');
  const [formGuaranteeText, setFormGuaranteeText] = useState<string>('');
  const [formOrderButtonText, setFormOrderButtonText] = useState<string>('');
  const [formPriceSAR, setFormPriceSAR] = useState<number>(79.99);
  const [formOriginalPriceSAR, setFormOriginalPriceSAR] = useState<number>(119.99);
  const [formDiscountPercent, setFormDiscountPercent] = useState<number>(33);
  const [formOrdersCount, setFormOrdersCount] = useState<number>(142);
  const [formIsMostPopular, setFormIsMostPopular] = useState<boolean>(false);
  const [formDescription, setFormDescription] = useState<string>('');
  const [formFeaturesText, setFormFeaturesText] = useState<string>('');
  const [formExpectedRoiPercent, setFormExpectedRoiPercent] = useState<number>(40);
  const [formExpectedBenefitTitle, setFormExpectedBenefitTitle] = useState<string>('ماذا ستحصل بعد اختيار هذه الحزمة؟');
  const [formExpectedBenefitAnswer, setFormExpectedBenefitAnswer] = useState<string>('زيادة في عدد الطلبات المتوقعة على نشاطك: +40%');

  const platformsList: { id: PlatformCategory; name: string }[] = [
    { id: 'google-maps', name: 'خرائط جوجل' },
    { id: 'snapchat', name: 'سناب شات' },
    { id: 'facebook', name: 'فيسبوك' },
    { id: 'instagram', name: 'انستقرام' },
    { id: 'tiktok', name: 'تيك توك' },
  ];

  const filteredPackages = packages.filter(
    (pkg) => (pkg.platform || 'google-maps') === activePlatformFilter
  );

  const openEditModal = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setFormPlatform(pkg.platform || 'google-maps');
    setFormReviewsCount(pkg.reviewsCount);
    setFormCountLabel(pkg.countLabel || '');
    setFormBadgeText(pkg.badgeText || '');
    setFormPopularBadgeText(pkg.popularBadgeText || 'الأكثر طلباً');
    setFormDiscountBadgeText(pkg.discountBadgeText || (pkg.discountPercent ? `وفر ${pkg.discountPercent}%` : ''));
    setFormGuaranteeText(pkg.guaranteeText || '');
    setFormOrderButtonText(pkg.orderButtonText || 'اطلب هذه الحزمة');
    setFormPriceSAR(pkg.priceSAR);
    setFormOriginalPriceSAR(pkg.originalPriceSAR || 0);
    setFormDiscountPercent(pkg.discountPercent || 0);
    setFormOrdersCount(pkg.ordersCount);
    setFormIsMostPopular(Boolean(pkg.isMostPopular));
    setFormDescription(pkg.description || '');
    setFormFeaturesText(pkg.features.join('\n'));
    setFormExpectedRoiPercent(pkg.expectedRoiPercent || 40);
    setFormExpectedBenefitTitle(pkg.expectedBenefitTitle || 'ماذا ستحصل بعد اختيار هذه الحزمة؟');
    setFormExpectedBenefitAnswer(
      pkg.expectedBenefitAnswer ||
        `زيادة في عدد الطلبات المتوقعة على نشاطك: +${pkg.expectedRoiPercent || 40}%`
    );
    setIsNewModalOpen(false);
  };

  const openNewModal = () => {
    setEditingPkg(null);
    setFormPlatform(activePlatformFilter);
    const isMap = activePlatformFilter === 'google-maps';
    setFormReviewsCount(isMap ? 30 : 1000);
    setFormCountLabel(isMap ? '30 تقييم خليجي 5 نجوم' : '1,000 متابع خليجي حقيقي');
    setFormBadgeText('طلبها +95 عميل');
    setFormPopularBadgeText('الأكثر طلباً');
    setFormDiscountBadgeText('وفر 28%');
    setFormGuaranteeText(
      isMap
        ? 'حسابات خليجية ومحلية حقيقية 100% مع ضمان التعويض'
        : 'متابعين خليجيين حقيقيين 100% مع ضمان التعويض الفوري'
    );
    setFormOrderButtonText('اطلب هذه الحزمة');
    setFormPriceSAR(isMap ? 180 : 59.99);
    setFormOriginalPriceSAR(isMap ? 250 : 89.99);
    setFormDiscountPercent(28);
    setFormOrdersCount(95);
    setFormIsMostPopular(false);
    setFormExpectedRoiPercent(40);
    setFormExpectedBenefitTitle('ماذا ستحصل بعد اختيار هذه الحزمة؟');
    setFormExpectedBenefitAnswer('زيادة في عدد الطلبات المتوقعة على نشاطك: +40%');
    setFormDescription('باقة خليجية مميزة لتعزيز الظهور والثقة.');
    setFormFeaturesText(
      isMap
        ? '30 تقييم خليجي 5 نجوم\nحسابات محلية خليجية موثوقة 100%\nتوزيع تدريجي طبيعي وآمن\nدعم فني ومتابعة عبر واتساب'
        : 'متابعين خليجيين حقيقيين 100%\nبدون طلب كلمة المرور\nتغذية تدريجية آمنة\nضمان تعويض فوري مدى الحياة'
    );
    setIsNewModalOpen(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const featuresList = formFeaturesText
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    if (editingPkg) {
      updatePackage({
        ...editingPkg,
        platform: formPlatform,
        reviewsCount: Number(formReviewsCount),
        countLabel: formCountLabel || undefined,
        badgeText: formBadgeText || undefined,
        popularBadgeText: formPopularBadgeText || undefined,
        discountBadgeText: formDiscountBadgeText || undefined,
        guaranteeText: formGuaranteeText || undefined,
        orderButtonText: formOrderButtonText || undefined,
        priceSAR: Number(formPriceSAR),
        originalPriceSAR: formOriginalPriceSAR ? Number(formOriginalPriceSAR) : undefined,
        discountPercent: formDiscountPercent ? Number(formDiscountPercent) : undefined,
        ordersCount: Number(formOrdersCount),
        isMostPopular: formIsMostPopular,
        expectedRoiPercent: formExpectedRoiPercent ? Number(formExpectedRoiPercent) : undefined,
        expectedBenefitTitle: formExpectedBenefitTitle || undefined,
        expectedBenefitAnswer: formExpectedBenefitAnswer || undefined,
        description: formDescription,
        features: featuresList,
      });
      setEditingPkg(null);
    } else if (isNewModalOpen) {
      addPackage({
        platform: formPlatform,
        reviewsCount: Number(formReviewsCount),
        countLabel: formCountLabel || undefined,
        badgeText: formBadgeText || undefined,
        popularBadgeText: formPopularBadgeText || undefined,
        discountBadgeText: formDiscountBadgeText || undefined,
        guaranteeText: formGuaranteeText || undefined,
        orderButtonText: formOrderButtonText || undefined,
        priceSAR: Number(formPriceSAR),
        originalPriceSAR: formOriginalPriceSAR ? Number(formOriginalPriceSAR) : undefined,
        discountPercent: formDiscountPercent ? Number(formDiscountPercent) : undefined,
        ordersCount: Number(formOrdersCount),
        isMostPopular: formIsMostPopular,
        expectedRoiPercent: formExpectedRoiPercent ? Number(formExpectedRoiPercent) : undefined,
        expectedBenefitTitle: formExpectedBenefitTitle || undefined,
        expectedBenefitAnswer: formExpectedBenefitAnswer || undefined,
        description: formDescription,
        features: featuresList,
        isHidden: false,
        orderIndex: packages.length + 1,
      });
      setIsNewModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
        <div>
          <h3 className="font-black text-base sm:text-lg text-slate-900">
            إدارة الحزم والمنصات وتخصيص الكروت
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            حدد المنصة للتحكم في باقاتها، ويمكنك تعديل جميع نصوص الكرت (العنوان، الشارة، الضمان، المزايا، وزر الطلب).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSectionTextsEditor(!showSectionTextsEditor)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 border transition-all cursor-pointer shrink-0 ${
              showSectionTextsEditor
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <FileEdit className="w-4 h-4 text-emerald-600" />
            <span>نصوص ما فوق وتحت الكروت</span>
          </button>

          <button
            type="button"
            onClick={openNewModal}
            className="px-4 py-2.5 rounded-2xl bg-[#006644] hover:bg-[#005538] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة باقة جديدة</span>
          </button>
        </div>
      </div>

      {/* Expandable Above & Below Cards Text Editor */}
      {showSectionTextsEditor && (
        <form
          onSubmit={handleSaveSectionTexts}
          className="p-5 sm:p-6 rounded-3xl bg-white border border-emerald-200 shadow-sm space-y-4 animate-in fade-in"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileEdit className="w-4 h-4 text-emerald-600" />
                <span>تعديل النصوص أعلى وأسفل كروت الباقات مباشرة</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                يمكنك تخصيص العناوين، الوصف، التلميحة الحركية، وصندوق الضمان الذهبي
              </p>
            </div>

            {sectionTextsSaved && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم الحفظ بنجاح!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Above Cards */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1.5">
                نصوص أعلى الكروت:
              </span>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الشارة العلوية:</label>
                <input
                  type="text"
                  value={pkgSectionTexts.badgeText}
                  onChange={(e) =>
                    setPkgSectionTexts({ ...pkgSectionTexts, badgeText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">العنوان الرئيسي للقسم:</label>
                <input
                  type="text"
                  value={pkgSectionTexts.sectionTitle}
                  onChange={(e) =>
                    setPkgSectionTexts({ ...pkgSectionTexts, sectionTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">الوصف التوضيحي:</label>
                <textarea
                  rows={2}
                  value={pkgSectionTexts.sectionDescription}
                  onChange={(e) =>
                    setPkgSectionTexts({ ...pkgSectionTexts, sectionDescription: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">نص التلميحة الحركية:</label>
                <input
                  type="text"
                  value={pkgSectionTexts.gestureHintText}
                  onChange={(e) =>
                    setPkgSectionTexts({ ...pkgSectionTexts, gestureHintText: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs"
                />
              </div>
            </div>

            {/* Below Cards */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <span className="font-bold text-slate-800 block text-xs border-b border-slate-200 pb-1.5">
                نصوص أسفل الكروت (صندوق الضمان):
              </span>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">عنوان صندوق الضمان:</label>
                <input
                  type="text"
                  value={pkgSectionTexts.guaranteeBoxTitle}
                  onChange={(e) =>
                    setPkgSectionTexts({ ...pkgSectionTexts, guaranteeBoxTitle: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">نص الشرح داخل الضمان:</label>
                <textarea
                  rows={3}
                  value={pkgSectionTexts.guaranteeBoxDescription}
                  onChange={(e) =>
                    setPkgSectionTexts({
                      ...pkgSectionTexts,
                      guaranteeBoxDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={pkgSectionTexts.guaranteePoint1}
                  onChange={(e) =>
                    setPkgSectionTexts({ ...pkgSectionTexts, guaranteePoint1: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                  placeholder="نقطة 1"
                />
                <input
                  type="text"
                  value={pkgSectionTexts.guaranteePoint2}
                  onChange={(e) =>
                    setPkgSectionTexts({ ...pkgSectionTexts, guaranteePoint2: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                  placeholder="نقطة 2"
                />
                <input
                  type="text"
                  value={pkgSectionTexts.guaranteePoint3}
                  onChange={(e) =>
                    setPkgSectionTexts({ ...pkgSectionTexts, guaranteePoint3: e.target.value })
                  }
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px]"
                  placeholder="نقطة 3"
                />
              </div>
            </div>

            {/* Countdown Timer Settings */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>العداد التنازلي المصغر تحت السعر في الكروت</span>
                </div>
                <label className="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-amber-200">
                  <input
                    type="checkbox"
                    checked={pkgSectionTexts.countdownEnabled !== false}
                    onChange={(e) =>
                      setPkgSectionTexts({ ...pkgSectionTexts, countdownEnabled: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-600 accent-emerald-600"
                  />
                  <span>تفعيل العداد في كل الكروت</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-right">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">العبارة بجانب العداد</label>
                  <input
                    type="text"
                    value={pkgSectionTexts.countdownLabel || ''}
                    onChange={(e) =>
                      setPkgSectionTexts({ ...pkgSectionTexts, countdownLabel: e.target.value })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold"
                    placeholder="لفترة محدودة"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">الأيام (Days)</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={pkgSectionTexts.countdownDays ?? 1}
                    onChange={(e) =>
                      setPkgSectionTexts({
                        ...pkgSectionTexts,
                        countdownDays: Math.max(0, parseInt(e.target.value, 10) || 0),
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">الساعات (Hours)</label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={pkgSectionTexts.countdownHours ?? 12}
                    onChange={(e) =>
                      setPkgSectionTexts({
                        ...pkgSectionTexts,
                        countdownHours: Math.max(0, Math.min(23, parseInt(e.target.value, 10) || 0)),
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">الدقائق (Minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={pkgSectionTexts.countdownMinutes ?? 30}
                    onChange={(e) =>
                      setPkgSectionTexts({
                        ...pkgSectionTexts,
                        countdownMinutes: Math.max(0, Math.min(59, parseInt(e.target.value, 10) || 0)),
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-[11px] font-bold"
                  />
                </div>
              </div>

              {/* Live Preview of small in-card badge */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-amber-200/60 text-[11px]">
                <span className="text-slate-600 font-bold shrink-0">معاينة شكل العداد أسفل السعر في الكرت:</span>
                <div className="max-w-md w-full">
                  <CardCountdownTimer
                    enabled={pkgSectionTexts.countdownEnabled !== false}
                    days={pkgSectionTexts.countdownDays}
                    hours={pkgSectionTexts.countdownHours}
                    minutes={pkgSectionTexts.countdownMinutes}
                    label={pkgSectionTexts.countdownLabel}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowSectionTextsEditor(false)}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs"
            >
              إغلاق
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              <span>حفظ نصوص ما فوق وتحت الكروت</span>
            </button>
          </div>
        </form>
      )}

      {/* Platform Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {platformsList.map((item) => {
          const count = packages.filter((p) => (p.platform || 'google-maps') === item.id).length;
          const isActive = activePlatformFilter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActivePlatformFilter(item.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2.5 transition-all whitespace-nowrap cursor-pointer border ${
                isActive
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <PlatformIcon platform={item.id} size="sm" />
              <span>{item.name}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Notice Banner */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            منصة: {platformsList.find((p) => p.id === activePlatformFilter)?.name} — جميع الحسابات تظهر
            للعميل كحسابات عربية وخليجية حقيقية 100% مع ضمان التعويض الفوري.
          </span>
        </div>
        <span className="text-[11px] font-mono font-bold text-emerald-700">
          {filteredPackages.length} باقة مفعلة
        </span>
      </div>

      {/* Packages Grid for the selected platform */}
      {filteredPackages.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 text-slate-400 text-xs">
          لا توجد باقات مضافة لهذه المنصة حتى الآن. اضغط على «إضافة باقة جديدة» بالأعلى.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPackages.map((pkg) => {
            const price = formatPrice(pkg.priceSAR);
            const origPrice = pkg.originalPriceSAR ? formatPrice(pkg.originalPriceSAR) : null;
            const currentPlatform = pkg.platform || 'google-maps';

            return (
              <div
                key={pkg.id}
                className={`p-5 rounded-3xl bg-white border transition-all flex flex-col justify-between relative shadow-2xs ${
                  pkg.isHidden
                    ? 'border-slate-200 opacity-60 bg-slate-50/70'
                    : pkg.isMostPopular
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Badges Top */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white font-bold text-xs">
                      {pkg.countLabel || `${pkg.reviewsCount} ${currentPlatform === 'google-maps' ? 'تقييم' : 'متابع'}`}
                    </span>

                    {pkg.isMostPopular && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                        <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>الأكثر طلباً</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={() => togglePackageVisibility(pkg.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                      title={pkg.isHidden ? 'إظهار في المتجر' : 'إخفاء من المتجر'}
                    >
                      {pkg.isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>

                    {/* Most Popular Toggle */}
                    <button
                      type="button"
                      onClick={() => setMostPopularPackage(pkg.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        pkg.isMostPopular
                          ? 'text-amber-500 bg-amber-50'
                          : 'text-slate-400 hover:text-amber-500'
                      }`}
                      title="تعيين كأكثر طلباً"
                    >
                      <Flame className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price & Badge */}
                <div className="space-y-1 mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-sans text-slate-950">
                      {price.amount}
                    </span>
                    <span className="text-xs font-bold text-slate-600">{price.symbol}</span>

                    {origPrice && (
                      <span className="text-xs text-slate-400 line-through">
                        {origPrice.amount} {origPrice.symbol}
                      </span>
                    )}
                  </div>

                  {/* Badge text */}
                  <div className="text-[11px] text-slate-500 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-emerald-600" />
                    <span>{pkg.badgeText || `طلبها +${pkg.ordersCount} عميل`}</span>
                    {pkg.discountPercent && <span>• وفر {pkg.discountPercent}%</span>}
                  </div>

                </div>

                {/* Expected Benefit Feature in Card Preview */}
                <div className="mb-2.5 p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-right space-y-1">
                  <div className="flex items-center gap-1 text-[11px] font-black text-slate-800">
                    <Sparkles className="w-3 h-3 text-[#006644] shrink-0" />
                    <span className="truncate">{pkg.expectedBenefitTitle || 'ماذا ستحصل بعد اختيار هذه الحزمة؟'}</span>
                  </div>
                  <div className="text-[11px] font-bold text-[#006644] pr-1 truncate">
                    {pkg.expectedBenefitAnswer || `زيادة في عدد الطلبات المتوقعة على نشاطك: +${pkg.expectedRoiPercent || 40}%`}
                  </div>
                </div>

                {/* Guarantee Note preview */}
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-emerald-800 font-bold mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">
                    {pkg.guaranteeText ||
                      (currentPlatform === 'google-maps'
                        ? 'حسابات خليجية ومحلية حقيقية 100%'
                        : 'متابعين عرب حقيقيين 100% مع ضمان')}
                  </span>
                </div>

                {/* Features snippet */}
                <div className="border-t border-slate-100 pt-3 mb-3 space-y-1 text-xs text-slate-600">
                  {pkg.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                  {pkg.features.length > 3 && (
                    <span className="text-[10px] text-slate-400 font-bold block pt-1">
                      +{pkg.features.length - 3} مزايا إضافية
                    </span>
                  )}
                </div>

                {/* Actions Bottom */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={() => openEditModal(pkg)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>تعديل نصوص الكرت</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`هل أنت متأكد من حذف هذه الباقة؟`)) {
                        deletePackage(pkg.id);
                      }
                    }}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="حذف الباقة"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Add Modal with Full Text Customization & Live Card Preview */}
      {(editingPkg || isNewModalOpen) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
          dir="rtl"
        >
          <div className="bg-white rounded-3xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 text-right animate-in fade-in my-6 max-h-[92vh] overflow-y-auto flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-50 text-[#006644]">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <h4 className="font-black text-base sm:text-lg text-slate-900">
                    {editingPkg ? 'تخصيص وتعديل جميع نصوص الكرت' : 'إضافة وتنسيق باقة جديدة'}
                  </h4>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  يمكنك تعديل أي نص يظهر على الكرت (الكبسولة العلوية، الشارات، المزايا، الضمان، السعر، وزر الطلب) مع معاينة حية فورية.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingPkg(null);
                  setIsNewModalOpen(false);
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Grid: Form on Left/Center + Live Card Preview on the Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
              
              {/* Form Controls Column (7 Cols) */}
              <form onSubmit={handleSaveForm} className="lg:col-span-7 space-y-4 text-xs">
                
                {/* 1. Platform Selector */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <label className="font-black text-slate-900 block flex items-center justify-between">
                    <span>1. المنصة التابعة لها الباقة:</span>
                    <span className="text-[11px] text-slate-400 font-normal">تحدد ألوان ونمط الكرت والطلب</span>
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {platformsList.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setFormPlatform(p.id)}
                        className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 border transition-all cursor-pointer ${
                          formPlatform === p.id
                            ? 'border-[#006644] bg-[#edf8f3] text-[#006644] ring-2 ring-[#006644]/20 shadow-xs'
                            : 'border-slate-200 bg-white hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <PlatformIcon platform={p.id} size="sm" />
                        <span className="text-[11px]">{p.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Top Capsule Text & Count */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-900 font-black">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>2. المربع الملون العلوي (الكبسولة الرئيسية)</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      نص الكبسولة العلوية (يظهر في المربع الملون مباشرة):
                    </label>
                    <input
                      type="text"
                      value={formCountLabel}
                      onChange={(e) => setFormCountLabel(e.target.value)}
                      placeholder="مثال: 1,000 متابع خليجي حقيقي"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      اكتب النص بالشكل الذي تحبه (يظهر في المربع الملون المخصص للمنصة في سطر واحد).
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">العدد الرقمي (للحساب والترتيب):</label>
                      <input
                        type="number"
                        required
                        value={formReviewsCount}
                        onChange={(e) => setFormReviewsCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">نص شارة الطلبات (أعلى اليمين):</label>
                      <input
                        type="text"
                        value={formBadgeText}
                        onChange={(e) => setFormBadgeText(e.target.value)}
                        placeholder="مثال: طلبها +560 عميل خليجي"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644]"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Popular Ribbon & Discount Badge */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-900 font-black">
                      <Flame className="w-4 h-4 text-amber-500" />
                      <span>3. شريط التمييز وشارة الخصم</span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formIsMostPopular}
                        onChange={(e) => setFormIsMostPopular(e.target.checked)}
                        className="w-4 h-4 accent-[#006644] rounded cursor-pointer"
                      />
                      <span className="font-bold text-amber-800 text-[11px]">تمييز كباقة مفضلة / أكثر طلباً</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">نص شريط التمييز العلوي:</label>
                      <input
                        type="text"
                        value={formPopularBadgeText}
                        onChange={(e) => setFormPopularBadgeText(e.target.value)}
                        placeholder="مثال: الأكثر طلباً / عرض خاص"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">نص شارة الخصم والتوفير:</label>
                      <input
                        type="text"
                        value={formDiscountBadgeText}
                        onChange={(e) => setFormDiscountBadgeText(e.target.value)}
                        placeholder="مثال: وفر 33% / تخفيض موسمي"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Pricing */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-900 font-black">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <span>4. الأسعار</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">السعر الحالي (SAR):</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={formPriceSAR}
                        onChange={(e) => setFormPriceSAR(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">قبل الخصم (SAR - اختياري):</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formOriginalPriceSAR}
                        onChange={(e) => setFormOriginalPriceSAR(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 block">نسبة الخصم الرقمية %:</label>
                      <input
                        type="number"
                        value={formDiscountPercent}
                        onChange={(e) => setFormDiscountPercent(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono"
                      />
                    </div>

                    <div className="space-y-3 sm:col-span-3 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                      <div className="flex items-center justify-between">
                        <label className="font-black text-slate-800 flex items-center gap-1.5 text-xs">
                          <Sparkles className="w-4 h-4 text-[#006644]" />
                          <span>ميزة داخل الكرت: "ماذا ستحصل بعد اختيار هذة الحزمة؟"</span>
                        </label>
                        <span className="text-[11px] text-emerald-800 font-mono font-black">
                          +{formExpectedRoiPercent}% زيادة متوقعة
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 block">
                            عنوان السؤال / الميزة:
                          </label>
                          <input
                            type="text"
                            value={formExpectedBenefitTitle}
                            onChange={(e) => setFormExpectedBenefitTitle(e.target.value)}
                            placeholder="ماذا ستحصل بعد اختيار هذه الحزمة؟"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 block">
                            النسبة المئوية لزيادة الطلبات (%):
                          </label>
                          <input
                            type="number"
                            value={formExpectedRoiPercent}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              setFormExpectedRoiPercent(val);
                              setFormExpectedBenefitAnswer(`زيادة في عدد الطلبات المتوقعة على نشاطك: +${val}%`);
                            }}
                            placeholder="مثال: 40"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-mono font-bold text-emerald-800 text-xs"
                          />
                        </div>

                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[11px] font-bold text-slate-600 block">
                            الرد الظاهر داخل مميزات الباقة:
                          </label>
                          <input
                            type="text"
                            value={formExpectedBenefitAnswer}
                            onChange={(e) => setFormExpectedBenefitAnswer(e.target.value)}
                            placeholder="زيادة في عدد الطلبات المتوقعة على نشاطك: +40%"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-bold text-[#006644] text-xs"
                          />
                          <span className="text-[10px] text-slate-500 block">
                            يظهر هذا المستطيل الأخضر المميز داخل قائمة مميزات الباقة بالكرت كما طلبت تماماً.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Guarantee Note & Button Customization */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-1.5 text-slate-900 font-black">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>5. نص الضمان وزر الطلب بالكرت</span>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      نص ضمان الجودة والمتابعين (المستطيل الأخضر أسفل المزايا):
                    </label>
                    <input
                      type="text"
                      value={formGuaranteeText}
                      onChange={(e) => setFormGuaranteeText(e.target.value)}
                      placeholder="مثال: حسابات خليجية حقيقية 100% مع ضمان التعويض الفوري"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-bold text-emerald-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      نص زر الطلب في أسفل الكرت:
                    </label>
                    <input
                      type="text"
                      value={formOrderButtonText}
                      onChange={(e) => setFormOrderButtonText(e.target.value)}
                      placeholder="مثال: اطلب هذه الحزمة"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* 6. Features & Description */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">
                      مزايا الحزمة (كل ميزة في سطر منفصل):
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formFeaturesText}
                      onChange={(e) => setFormFeaturesText(e.target.value)}
                      placeholder="متابعين خليجيين حقيقيين 100%&#10;بدون طلب كلمة المرور&#10;تغذية تدريجية آمنة&#10;ضمان تعويض فوري"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644] leading-relaxed resize-none font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 block">وصف تسويقي إضافي للباقة:</label>
                    <input
                      type="text"
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="وصف محفز يوضح فائدة الباقة..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#006644]"
                    />
                  </div>
                </div>

                {/* Submit / Cancel Buttons */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPkg(null);
                      setIsNewModalOpen(false);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#006644] hover:bg-[#005538] text-white font-bold cursor-pointer shadow-sm transition-colors"
                  >
                    حفظ التعديلات في الكرت
                  </button>
                </div>
              </form>

              {/* Live Preview Column (5 Cols) */}
              <div className="lg:col-span-5 bg-slate-100/80 p-4 sm:p-5 rounded-3xl border border-slate-200 flex flex-col items-center justify-start sticky top-0">
                <div className="w-full flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>معاينة حية لشكل الكرت</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    مباشر
                  </span>
                </div>

                {/* The Live Rendered Card Component */}
                {(() => {
                  const theme = getPlatformTheme(formPlatform);
                  const displayLabel = formCountLabel.trim() || `${formReviewsCount.toLocaleString()} ${theme.defaultUnit}`;
                  const featuresList = formFeaturesText.split('\n').map((f) => f.trim()).filter((f) => f.length > 0);
                  const priceInfo = formatPrice(formPriceSAR);
                  const origPriceInfo = formOriginalPriceSAR ? formatPrice(formOriginalPriceSAR) : null;
                  const discountText = formDiscountBadgeText.trim() || (formDiscountPercent ? `وفر ${formDiscountPercent}%` : null);

                  return (
                    <div className="w-full max-w-[340px] rounded-[28px] bg-white border border-slate-200/90 shadow-xl p-4 sm:p-5 relative transition-all duration-200 select-none">
                      
                      {/* Most Popular Ribbon */}
                      {formIsMostPopular && (
                        <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1 z-20">
                          <Flame className="w-3 h-3 fill-white" />
                          <span>{formPopularBadgeText.trim() || 'الأكثر طلباً'}</span>
                        </div>
                      )}

                      {/* Top Row: Orders Count Badge & Capsule */}
                      <div className="flex items-start justify-between gap-2">
                        {/* Orders badge */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#edf8f3] text-[#006644] text-[11px] font-bold shrink-0">
                          <Zap className="w-3 h-3 text-[#006644] fill-[#006644]" />
                          <span>{formBadgeText.trim() || `طلبها +${formOrdersCount} عميل`}</span>
                        </div>

                        {/* Review count capsule & 5 stars */}
                        <div className="flex flex-col items-center max-w-[55%]">
                          <div className="relative w-full flex flex-col items-center">
                            {/* Radiating sun-rays */}
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                              <span className={`w-0.5 h-1.5 ${theme.rayBg1} rounded-full transform -rotate-25 origin-bottom`} />
                              <span className={`w-0.5 h-2 ${theme.rayBg2} rounded-full`} />
                              <span className={`w-0.5 h-1.5 ${theme.rayBg1} rounded-full transform rotate-25 origin-bottom`} />
                            </div>

                            {/* Capsule box */}
                            <div className={`px-3 py-1 rounded-full text-xs font-black whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1 leading-normal ${theme.capsuleClass}`}>
                              <span>{displayLabel}</span>
                            </div>
                          </div>

                          {/* 5 Golden Stars for Google Maps ONLY, followers for Social Media */}
                          {formPlatform === 'google-maps' ? (
                            <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-amber-400" />
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1">
                              <Users className="w-3 h-3 text-emerald-600" />
                              <span>متابعون حقيقيون</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Pricing Row */}
                      <div className="flex items-center justify-between mt-3 pt-0.5">
                        <div className="text-right space-y-0.5">
                          {origPriceInfo && (
                            <div className="text-[11px] text-slate-400 line-through font-mono">
                              {origPriceInfo.amount} {origPriceInfo.symbol}
                            </div>
                          )}

                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-slate-950 font-sans tracking-tight">
                              {priceInfo.amount}
                            </span>
                            <span className="text-xs font-bold text-slate-700">
                              {priceInfo.symbol}
                            </span>
                          </div>

                          {discountText && (
                            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8f6ee] text-[#006644] text-[10px] font-bold">
                              <Tag className="w-2.5 h-2.5" />
                              <span>{discountText}</span>
                            </div>
                          )}
                        </div>

                        {/* Platform Icon Badge */}
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner">
                          <PlatformIcon platform={formPlatform} size="md" />
                        </div>
                      </div>

                      {/* In-Card Countdown Timer */}
                      {storeSettings.packagesSectionTexts?.countdownEnabled !== false && (
                        <div className="mt-2.5">
                          <CardCountdownTimer
                            enabled={true}
                            days={storeSettings.packagesSectionTexts?.countdownDays}
                            hours={storeSettings.packagesSectionTexts?.countdownHours}
                            minutes={storeSettings.packagesSectionTexts?.countdownMinutes}
                            label={storeSettings.packagesSectionTexts?.countdownLabel}
                          />
                        </div>
                      )}

                      {/* Features List */}
                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <ul className="space-y-1.5 text-right">
                          {featuresList.slice(0, 4).map((feat, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-[#dcf2e6] text-[#006644] flex items-center justify-center shrink-0">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                              <span className="font-semibold text-slate-800 text-[11px] truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Guarantee note */}
                        <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-emerald-50/90 border border-emerald-100 text-[11px] text-[#006644] font-bold flex items-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#006644]" />
                          <span className="truncate">
                            {formGuaranteeText.trim() || 'حسابات خليجية حقيقية 100% مع ضمان التعويض الفوري'}
                          </span>
                        </div>
                      </div>

                      {/* Order Button */}
                      <div className="mt-3.5 pt-1">
                        <div className="w-full py-2.5 px-3 rounded-full bg-[#006644] text-white font-bold text-xs flex items-center justify-between shadow-sm">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                            <MessageCircle className="w-3.5 h-3.5 text-white fill-white" />
                          </div>
                          <div className="flex-1 flex items-center justify-center gap-1.5">
                            <span>{formOrderButtonText.trim() || 'اطلب هذه الحزمة'}</span>
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                    </div>
                  );
                })()}

                <div className="mt-3 text-center text-[11px] text-slate-400">
                  أي تعديل تدخله في الحقول ينعكس فوراً على شكل الكرت أعلاه
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
