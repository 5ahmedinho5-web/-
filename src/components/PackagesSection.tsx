import React, { useState, useRef } from 'react';
import {
  Check,
  Star,
  Users,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Zap,
  Tag,
  MessageCircle,
  MoveHorizontal,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PackageItem, PlatformCategory } from '../types';
import { PlatformIcon } from './PlatformIcon';
import { CardCountdownTimer } from './CardCountdownTimer';

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

const getCapsuleLabel = (pkg: PackageItem, platform: PlatformCategory = 'google-maps') => {
  if (pkg.countLabel && pkg.countLabel.trim()) {
    const hasNumbers = /\d|[\u0660-\u0669]/.test(pkg.countLabel);
    if (hasNumbers) {
      return pkg.countLabel.trim();
    }
    const num = pkg.reviewsCount >= 1000 ? pkg.reviewsCount.toLocaleString('en-US') : pkg.reviewsCount;
    return `${num} ${pkg.countLabel.trim()}`;
  }
  const formattedCount = pkg.reviewsCount >= 1000 ? pkg.reviewsCount.toLocaleString('en-US') : pkg.reviewsCount;
  const unit = platform === 'google-maps' ? 'تقييم خليجي' : 'متابع خليجي';
  return `${formattedCount} ${unit}`;
};

const getPackageRoiPercent = (pkg: PackageItem): number => {
  if (pkg.expectedRoiPercent && pkg.expectedRoiPercent > 0) {
    return pkg.expectedRoiPercent;
  }
  const isMaps = !pkg.platform || pkg.platform === 'google-maps';
  const count = pkg.reviewsCount || 10;
  if (isMaps) {
    if (count <= 10) return 45;
    if (count <= 25) return 95;
    if (count <= 50) return 160;
    if (count <= 100) return 280;
    if (count <= 200) return 420;
    if (count <= 500) return 650;
    return 950;
  } else {
    if (count <= 1000) return 65;
    if (count <= 2500) return 130;
    if (count <= 5000) return 220;
    if (count <= 10000) return 390;
    return 580;
  }
};

export const PackagesSection: React.FC = () => {
  const {
    packages,
    selectedPlatform,
    setSelectedPlatform,
    trackPlatformVisit,
    formatPrice,
    setSelectedPackageForOrder,
    setIsOrderModalOpen,
    setCurrentSection,
    storeSettings,
  } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Drag state for desktop mouse drag support
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const customTexts = storeSettings.packagesSectionTexts;

  const platformTabs: { id: PlatformCategory; label: string }[] = [
    { id: 'google-maps', label: 'خرائط جوجل' },
    { id: 'snapchat', label: 'سناب شات' },
    { id: 'facebook', label: 'فيس بوك' },
    { id: 'instagram', label: 'انستقرام' },
    { id: 'tiktok', label: 'تيك توك' },
  ];

  const platformHeadings: Record<PlatformCategory, { badge: string; title: string; desc: string }> = {
    'google-maps': {
      badge: customTexts?.badgeText || 'خدمة رفع وتصدر تقييمات خرائط Google',
      title: customTexts?.sectionTitle || 'باقات تقييمات خرائط Google لتعزيز حضور مشروعك',
      desc: customTexts?.sectionDescription || 'نمنح نشاطك التجاري الأفضلية للتصدر وجذب المزيد من العملاء والاتصالات، عبر تقييمات خليجية موثوقة 100% تدعم ثقة الزائر بنشاطك فوراً.',
    },
    snapchat: {
      badge: 'خدمة زيادة ونمو متابعي وحسابات سناب شات',
      title: 'باقات سناب شات لتعزيز التفاعل والحضور الخليجي',
      desc: 'متابعون خليجيون حقيقيون 100% يعززون ظهور يومياتك وحسابك في سناب شات بأسلوب طبيعي وآمن تماماً.',
    },
    facebook: {
      badge: 'خدمة متابعي وتفاعل صفحات فيس بوك',
      title: 'باقات فيس بوك لرفع مصداقية وانتشار صفحتك التجارية',
      desc: 'متابعون وتفاعل حقيقي من الخليج والوطن العربي لبناء مجتمع قوي متفاعل يدعم مبيعاتك ونشاطك.',
    },
    instagram: {
      badge: 'خدمة زيادة متابعي انستقرام الحقيقيين',
      title: 'باقات انستقرام لتكبير حسابك وزيادة التفاعل والمبيعات',
      desc: 'حسابات خليجية حقيقية 100% بدون أي انخفاض مع ضمان التعويض الفوري، تمنح بروفايلك الثقة الفورية.',
    },
    tiktok: {
      badge: 'خدمة زيادة متابعي تيك توك والحضور الرقمي',
      title: 'باقات تيك توك لفتح البث المباشر وتصدر صفحة For You',
      desc: 'متابعون حقيقيون سريعو التفعيل يفتحون لك ميزات البث وتوثيق الحساب والتصدر في إكسبلور تيك توك.',
    },
  };

  const currentHeading = platformHeadings[selectedPlatform] || platformHeadings['google-maps'];

  // Filter packages by currently selected platform
  const filtered = packages.filter(
    (pkg) => (!pkg.platform || pkg.platform === selectedPlatform) && !pkg.isHidden
  );
  const visiblePackages = (filtered.length > 0 ? filtered : packages.filter((pkg) => !pkg.isHidden))
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const handleTabClick = (platformId: PlatformCategory) => {
    setSelectedPlatform(platformId);
    trackPlatformVisit(platformId);
    setActiveIndex(0);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  // Scroll to specific card by index
  const scrollToIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(index, visiblePackages.length - 1));
    setActiveIndex(clampedIndex);
    const targetCard = cardRefs.current[clampedIndex];
    const container = scrollContainerRef.current;
    if (targetCard && container) {
      if (clampedIndex === 0) {
        container.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        targetCard.scrollIntoView({
          behavior: 'smooth',
          inline: 'nearest',
          block: 'nearest',
        });
      }
    }
  };

  const handlePrev = () => {
    // In RTL, moving to previous item goes to the right (index - 1)
    if (activeIndex > 0) {
      scrollToIndex(activeIndex - 1);
    } else {
      scrollToIndex(visiblePackages.length - 1);
    }
  };

  const handleNext = () => {
    // In RTL, moving to next item goes to the left (index + 1)
    if (activeIndex < visiblePackages.length - 1) {
      scrollToIndex(activeIndex + 1);
    } else {
      scrollToIndex(0);
    }
  };

  // Sync activeIndex on scroll based on highest visibility ratio
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const containerRect = container.getBoundingClientRect();

    let closestIdx = 0;
    let maxVisibleRatio = -1;

    cardRefs.current.forEach((card, idx) => {
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const visibleLeft = Math.max(containerRect.left, cardRect.left);
      const visibleRight = Math.min(containerRect.right, cardRect.right);
      const visibleWidth = Math.max(0, visibleRight - visibleLeft);
      const visibilityRatio = cardRect.width > 0 ? visibleWidth / cardRect.width : 0;

      if (visibilityRatio > maxVisibleRatio) {
        maxVisibleRatio = visibilityRatio;
        closestIdx = idx;
      }
    });

    if (closestIdx !== activeIndex) {
      setActiveIndex(closestIdx);
    }
  };

  // Mouse Drag handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - scrollContainerRef.current.offsetLeft;
    scrollLeftRef.current = scrollContainerRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5; // multiplier for smoothness
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    scrollContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCardClick = (pkg: PackageItem, idx: number) => {
    if (hasMovedRef.current) {
      // Prevent opening modal if it was a drag operation
      return;
    }
    if (idx !== activeIndex) {
      scrollToIndex(idx);
    }
  };

  const handleOrderClick = (e: React.MouseEvent, pkg: PackageItem) => {
    e.stopPropagation();
    setSelectedPackageForOrder(pkg);
    setIsOrderModalOpen(true);
  };

  if (visiblePackages.length === 0) return null;

  return (
    <section id="packages" className="py-8 md:py-14 bg-[#f8faf9] border-t border-slate-100 overflow-hidden" dir="rtl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Platform Selector Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
          {platformTabs.map((tab) => {
            const isSelected = tab.id === selectedPlatform;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-black transition-all duration-200 cursor-pointer active:scale-95 select-none ${
                  isSelected
                    ? 'bg-gradient-to-l from-[#005a3c] via-[#006644] to-[#007850] text-white shadow-md ring-2 ring-emerald-400/50 scale-[1.03] animate-option-selected'
                    : 'bg-white text-slate-700 hover:text-[#006644] hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <PlatformIcon platform={tab.id} size="sm" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Header: Service Intro & Dynamic Heading */}
        <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#edf8f3] border border-[#a3d7c4] text-[#006644] text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 fill-[#006644]" />
            <span>{currentHeading.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            {currentHeading.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto">
            {currentHeading.desc}
          </p>

          {/* Dynamic Gesture Hint */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/80 text-emerald-800 text-[11px] sm:text-xs font-bold mt-2 shadow-2xs">
            <MoveHorizontal className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>{customTexts?.gestureHintText || 'اسحب أفقياً لتصفح جميع الباقات، أو اضغط على أي باقة لاختيارها'}</span>
          </div>
        </div>

        {/* 2. Carousel Wrapper with Navigation Arrows & Edge Peek */}
        <div className="relative group -mx-4 sm:mx-0">
          
          {/* Left Arrow Button for Tablet & Desktop (Floats on left, moves to next card in RTL) */}
          <button
            type="button"
            onClick={handleNext}
            className="hidden sm:flex absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 shadow-xl text-slate-700 hover:text-[#006644] hover:bg-emerald-50 items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 hover:scale-105"
            aria-label="الباقة التالية"
            title="الباقة التالية"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* Right Arrow Button for Tablet & Desktop (Floats on right, moves to previous card in RTL) */}
          <button
            type="button"
            onClick={handlePrev}
            className="hidden sm:flex absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/95 backdrop-blur-xs border border-slate-200 shadow-xl text-slate-700 hover:text-[#006644] hover:bg-emerald-50 items-center justify-center transition-all duration-200 cursor-pointer active:scale-90 hover:scale-105"
            aria-label="الباقة السابقة"
            title="الباقة السابقة"
          >
            <ChevronRight className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="flex items-stretch gap-3.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-4 px-4 sm:px-6 scroll-px-4 sm:scroll-px-6 cursor-grab active:cursor-grabbing select-none"
          >
            {visiblePackages.map((pkg, idx) => {
              const isActive = idx === activeIndex;
              const priceInfo = formatPrice(pkg.priceSAR);
              const originalPriceInfo = pkg.originalPriceSAR ? formatPrice(pkg.originalPriceSAR) : null;
              const cardPlatform = pkg.platform || selectedPlatform;

              return (
                <div
                  key={pkg.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  onClick={() => handleCardClick(pkg, idx)}
                  className={`shrink-0 snap-start transition-all duration-200 w-[calc(100vw-76px)] max-w-[340px] sm:w-[305px] sm:max-w-[305px] md:w-[315px] md:max-w-[315px] flex flex-col justify-between rounded-[28px] bg-white border p-4 sm:p-5 relative cursor-pointer active:scale-[0.985] ${
                    isActive
                      ? 'border-emerald-500 ring-2 ring-[#006644]/25 shadow-xl opacity-100 z-10'
                      : 'border-slate-200/90 shadow-md opacity-85 hover:opacity-100 hover:border-emerald-300'
                  }`}
                >
                  {/* Most Popular Ribbon if applicable */}
                  {pkg.isMostPopular && (
                    <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] sm:text-[11px] font-black px-3 py-0.5 sm:py-1 rounded-full shadow-md flex items-center gap-1 z-20">
                      <Flame className="w-3 h-3 fill-white" />
                      <span>{pkg.popularBadgeText || 'الأكثر طلباً'}</span>
                    </div>
                  )}

                  <div>
                    {/* Top Row: Left Badge (Orders Count) & Right Badge (Reviews Count + Stars) */}
                    <div className="flex items-start justify-between gap-2">
                      
                      {/* Orders count badge */}
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#edf8f3] text-[#006644] text-[11px] sm:text-xs font-bold shrink-0">
                        <Zap className="w-3 h-3 text-[#006644] fill-[#006644]" />
                        <span>{pkg.badgeText || `طلبها +${pkg.ordersCount} عميل`}</span>
                      </div>

                      {/* Review count capsule & 5 stars with platform theme */}
                      {(() => {
                        const theme = getPlatformTheme(cardPlatform);
                        const labelText = getCapsuleLabel(pkg, cardPlatform);
                        return (
                          <div className="flex flex-col items-center max-w-[55%]">
                            <div className="relative w-full flex flex-col items-center">
                              {/* Radiating sun-rays over the capsule */}
                              <div className="flex items-center justify-center gap-0.5 mb-0.5">
                                <span className={`w-0.5 h-1.5 ${theme.rayBg1} rounded-full transform -rotate-25 origin-bottom`} />
                                <span className={`w-0.5 h-2 ${theme.rayBg2} rounded-full`} />
                                <span className={`w-0.5 h-1.5 ${theme.rayBg1} rounded-full transform rotate-25 origin-bottom`} />
                              </div>
                              
                              {/* Single-line unified capsule box - scaled down & proportional */}
                              <div className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1 leading-tight tracking-tight ${theme.capsuleClass}`}>
                                <span>{labelText}</span>
                              </div>
                            </div>

                            {/* Stars ONLY for Google Maps. Social Media displays followers */}
                            {cardPlatform === 'google-maps' ? (
                              <div className="flex items-center gap-0.5 text-amber-400 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400" />
                                ))}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 text-emerald-800 bg-emerald-50/90 border border-emerald-200/80 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold mt-1 shadow-2xs">
                                <Users className="w-3 h-3 text-emerald-600" />
                                <span>متابعون حقيقيون</span>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                    </div>

                    {/* Pricing & Visual Illustration Row */}
                    <div className="flex items-center justify-between mt-3 pt-0.5">
                      
                      {/* Pricing block */}
                      <div className="text-right space-y-0.5">
                        {originalPriceInfo && (
                          <div className="text-[11px] sm:text-xs text-slate-400 line-through font-mono">
                            {originalPriceInfo.amount} {originalPriceInfo.symbol}
                          </div>
                        )}

                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black text-slate-950 font-sans tracking-tight">
                            {priceInfo.amount}
                          </span>
                          <span className="text-xs font-bold text-slate-700">
                            {priceInfo.symbol}
                          </span>
                        </div>

                        {(pkg.discountBadgeText || pkg.discountPercent) && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e8f6ee] text-[#006644] text-[10px] font-bold">
                            <Tag className="w-2.5 h-2.5" />
                            <span>{pkg.discountBadgeText || `وفر ${pkg.discountPercent}%`}</span>
                          </div>
                        )}
                      </div>

                      {/* Visual Official Platform Badge */}
                      <div className="relative w-14 h-14 sm:w-15 sm:h-15 flex items-center justify-center shrink-0">
                        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center p-2 shadow-2xs">
                          <PlatformIcon platform={cardPlatform} size="lg" className="w-9 h-9" />
                        </div>
                      </div>

                    </div>

                    {/* In-Card Countdown Timer: Sleek Banner directly below Price with crystal clear Days, Hours, Minutes */}
                    {customTexts?.countdownEnabled !== false && (
                      <div className="mt-2.5">
                        <CardCountdownTimer
                          enabled={true}
                          days={customTexts?.countdownDays}
                          hours={customTexts?.countdownHours}
                          minutes={customTexts?.countdownMinutes}
                          label={customTexts?.countdownLabel}
                        />
                      </div>
                    )}

                    {/* Subtle Divider */}
                    <div className="my-3 border-t border-slate-100" />

                    {/* Features checklist with "ماذا ستحصل بعد اختيار هذه الحزمة؟" */}
                    <div className="space-y-3">
                      {/* ماذا ستحصل بعد اختيار هذه الحزمة؟ */}
                      {(() => {
                        const roiPercent = getPackageRoiPercent(pkg);
                        return (
                          <div className="p-3 rounded-2xl bg-gradient-to-l from-emerald-50 via-teal-50/50 to-emerald-50/80 border border-emerald-200/90 shadow-2xs space-y-1.5 text-right">
                            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                              <Sparkles className="w-3.5 h-3.5 text-[#006644] shrink-0" />
                              <span>{pkg.expectedBenefitTitle || 'ماذا ستحصل بعد اختيار هذه الحزمة؟'}</span>
                            </div>
                            <div className="flex items-center gap-2 pr-1 text-xs font-bold text-[#006644]">
                              <div className="w-2 h-2 rounded-full bg-[#006644] shrink-0" />
                              <span className="leading-relaxed">
                                {pkg.expectedBenefitAnswer || `زيادة في عدد الطلبات المتوقعة على نشاطك: +${roiPercent}%`}
                              </span>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Features list */}
                      <ul className="space-y-2 text-xs text-slate-700">
                        {pkg.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2">
                            <div className="w-4.5 h-4.5 rounded-full bg-[#dcf2e6] text-[#006644] flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className="font-semibold text-slate-800 text-[11px] sm:text-xs">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Persuasive Note on Each Card: 100% Real Arab / Gulf followers */}
                    <div className="mt-3 px-2.5 py-1.5 rounded-xl bg-emerald-50/80 border border-emerald-100 text-[11px] text-[#006644] font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-[#006644]" />
                      <span>
                        {pkg.guaranteeText ||
                          (cardPlatform === 'google-maps'
                            ? 'حسابات خليجية ومحلية حقيقية 100% مع ضمان التعويض'
                            : 'متابعين خليجيين حقيقيين 100% مع ضمان التعويض الفوري')}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Action Button: Order Package */}
                  <div className="mt-3.5 pt-1 relative group/btnbox">
                    {/* Subtle Ambient Glow around the box */}
                    <div className="absolute -inset-1 rounded-full bg-emerald-500/20 opacity-40 blur-md animate-cta-glow pointer-events-none group-hover/btnbox:opacity-75 transition-opacity duration-300" />

                    {/* Clean & Sleek Gradient Border Ring */}
                    <div className="relative p-[1.5px] rounded-full bg-gradient-to-r from-emerald-500/40 via-teal-400/50 to-emerald-500/40 animate-cta-flow shadow-xs group-hover/btnbox:shadow-md transition-all duration-300">
                      <button
                        type="button"
                        onClick={(e) => handleOrderClick(e, pkg)}
                        className="relative w-full py-2.5 sm:py-3 px-4 rounded-full bg-gradient-to-l from-[#005a3c] via-[#006644] to-[#007850] hover:from-[#006644] hover:via-[#007850] hover:to-[#008f5f] text-white font-black text-xs sm:text-sm transition-all duration-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_3px_10px_rgba(0,102,68,0.22)] flex items-center justify-center gap-2 cursor-pointer group/btn active:scale-98 overflow-hidden"
                      >
                        {/* Soft Subtle Shimmer Light Sweep */}
                        <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-cta-shimmer" />

                        {/* Sparkle Icon */}
                        <Sparkles className="w-3.5 h-3.5 text-emerald-200/90 fill-emerald-200/40 group-hover/btn:rotate-12 transition-transform duration-200 shrink-0 relative z-10" />

                        <span className="relative z-10 font-black tracking-wide">
                          {pkg.orderButtonText || 'اطلب هذه الحزمة'}
                        </span>

                        {/* Arrow Icon */}
                        <ArrowLeft className="w-3.5 h-3.5 text-white/90 group-hover/btn:-translate-x-1 transition-all duration-200 shrink-0 relative z-10" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>

        {/* 3. Carousel Navigation Controls (Arrows + Dots + Counter) */}
        <div className="flex flex-col items-center justify-center gap-3 mt-6">
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* Right Arrow (Previous in RTL) */}
            <button
              type="button"
              onClick={handlePrev}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-700 hover:text-[#006644] hover:bg-emerald-50 flex items-center justify-center transition-all cursor-pointer active:scale-90"
              aria-label="الباقة السابقة"
              title="الباقة السابقة"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-1.5 px-1.5">
              {visiblePackages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? 'w-7 bg-[#006644]'
                      : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`الانتقال للباقة ${idx + 1}`}
                />
              ))}
            </div>

            {/* Left Arrow (Next in RTL) */}
            <button
              type="button"
              onClick={handleNext}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border border-slate-200 shadow-2xs text-slate-700 hover:text-[#006644] hover:bg-emerald-50 flex items-center justify-center transition-all cursor-pointer active:scale-90"
              aria-label="الباقة التالية"
              title="الباقة التالية"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Active Card Counter & Swipe Hint */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>
              الباقة <strong className="text-[#006644] font-black">{activeIndex + 1}</strong> من <strong className="text-slate-800 font-bold">{visiblePackages.length}</strong>
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-emerald-700 font-bold">اسحب لتصفح باقي الباقات</span>
          </div>
        </div>

        {/* 4. Persuasive Conversion Description & 100% Gulf Accounts Guarantee */}
        <div className="mt-8 max-w-4xl mx-auto bg-white border border-[#a3d7c4]/80 rounded-2xl p-5 sm:p-6 shadow-sm text-right space-y-3.5">
          <div className="flex items-center gap-2 text-[#006644]">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <h3 className="text-sm sm:text-base font-bold text-slate-950">
              {customTexts?.guaranteeBoxTitle || 'ضمان ذهبي وأمان تام 100% لنشاطك التجاري'}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
            {customTexts?.guaranteeBoxDescription ||
              'جميع التقييمات صادرة من حسابات خليجية وسعودية حقيقية 100% (مرشدين محليين نشطين Local Guides)، مع صياغة مخصصة ومثرية تعكس جودة نشاطك وتجذب زوارك. نعتمد على جدولة زمنية ذكية وتوزيع طبيعي متوافق تماماً مع خوارزميات خرائط Google، مع ضمان تعويض مجاني مدى الحياة.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006644] shrink-0" />
              <span>{customTexts?.guaranteePoint1 || 'حسابات خليجية موثقة 100%'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006644] shrink-0" />
              <span>{customTexts?.guaranteePoint2 || 'بدون أي برامج آلية أو روبوتات'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#006644] shrink-0" />
              <span>{customTexts?.guaranteePoint3 || 'ضمان وتعويض مجاني مدى الحياة'}</span>
            </div>
          </div>
        </div>

        {/* 5. Reviews Button */}
        <div className="mt-6 max-w-sm mx-auto">
          <button
            type="button"
            onClick={() => {
              setCurrentSection('reviews');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#edf8f3] hover:bg-[#dcf2e6] border border-[#bce7d1] text-[#006644] font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-98 group"
          >
            <Star className="w-4 h-4 fill-[#006644] text-[#006644]" />
            <span>شاهد آراء عملائنا وتجاربهم</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};
