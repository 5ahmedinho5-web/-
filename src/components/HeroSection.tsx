import React, { useState, useEffect, useRef } from 'react';
import {
  Star,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ArrowLeft,
  ChevronLeft,
  MessageCircle,
  Zap,
  Headphones,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PlatformCategory } from '../types';
import { NajmaLogo } from './NajmaLogo';
import { PlatformIcon } from './PlatformIcon';
import heroMapsMockup from '../assets/images/riyadh_skyline_maps_1789930422182.jpg';

// Helper hook for smooth animated count-up numbers
function useAnimatedCount(target: number, duration: number = 1800, decimals: number = 0) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setVal(easeOut * target);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return val;
}

export const HeroSection: React.FC = () => {
  const { setCurrentSection, navigateToPlatformPackages, setIsAdminModalOpen, storeSettings } = useStore();
  const heroClickTimesRef = useRef<number[]>([]);
  const heroTexts = storeSettings.sectionContents?.hero;

  // Secret 3-clicks handler on "نجمة" in Hero for Admin Dashboard
  const handleHeroLogoTripleClick = () => {
    const now = Date.now();
    heroClickTimesRef.current = [
      ...heroClickTimesRef.current.filter((t) => now - t < 1500),
      now,
    ];

    if (heroClickTimesRef.current.length >= 3) {
      heroClickTimesRef.current = [];
      setIsAdminModalOpen(true);
    }
  };

  // Animated numbers
  const countGrowth = useAnimatedCount(90, 1600);
  const countSatisfaction = useAnimatedCount(99.4, 1800);
  const countTotalReviews = useAnimatedCount(14850, 2000);
  const countRating = useAnimatedCount(4.9, 1600);

  const platformButtons: {
    id: PlatformCategory;
    title: string;
    bgClass: string;
  }[] = [
    {
      id: 'google-maps',
      title: 'تصفح حزم خرائط جوجل',
      bgClass: 'bg-[#0e6f4d] hover:bg-[#0a583c] text-white shadow-sm hover:shadow-md',
    },
    {
      id: 'snapchat',
      title: 'تصفح حزم سناب شات',
      bgClass: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs hover:shadow-xs',
    },
    {
      id: 'facebook',
      title: 'تصفح حزم فيس بوك',
      bgClass: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs hover:shadow-xs',
    },
    {
      id: 'instagram',
      title: 'تصفح حزم انستقرام',
      bgClass: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs hover:shadow-xs',
    },
    {
      id: 'tiktok',
      title: 'تصفح حزم تيك توك',
      bgClass: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 shadow-2xs hover:shadow-xs',
    },
  ];

  const handlePlatformClick = (platformId: PlatformCategory) => {
    navigateToPlatformPackages(platformId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewReviews = () => {
    setCurrentSection('reviews');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative pt-2 pb-16 overflow-hidden bg-white" dir="rtl">
      
      {/* 
        Clear & Vibrant Riyadh Towers Skyline Background Layer
        Prominently displays Kingdom Tower and Riyadh skyline as shown in the screenshot
      */}
      <div className="absolute inset-x-0 top-0 h-[720px] sm:h-[800px] md:h-[860px] pointer-events-none overflow-hidden z-0 select-none">
        <img
          src={heroMapsMockup}
          alt="أبراج الرياض وبرج المملكة"
          className="w-full h-full object-cover object-[15%_top] sm:object-top opacity-80 sm:opacity-85 transition-all duration-700"
        />
        {/* Soft atmospheric gradients ensuring crystal clear visibility while maintaining pristine text contrast */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white via-white/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/15 to-white/90" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-white via-white/95 to-transparent" />
      </div>

      {/* 1. Trust Pill Badge with Horizontal Green Lines */}
      <div className="relative z-10 flex items-center justify-center gap-3 max-w-xl mx-auto px-4 pt-3 pb-6">
        <div className="flex-1 h-[1px] bg-[#006644]/30" />
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#edf7f3] border border-[#a3d7c4] text-[#006644] text-xs sm:text-sm font-bold shadow-2xs whitespace-nowrap">
          <ShieldCheck className="w-4 h-4 text-[#006644] shrink-0" />
          <span>{heroTexts?.badge || 'المنصة الخليجية الأولى لتعزيز حضور الأنشطة التجارية'}</span>
        </div>
        <div className="flex-1 h-[1px] bg-[#006644]/30" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* 2. Main Headline Exactly as Screen: Line 1, Line 2 with Google, Line 3 Najma Calligraphy */}
        <div className="text-center space-y-2 sm:space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-snug drop-shadow-xs">
            خلّ حضور نشاطك على
          </h1>
          
          <div className="flex items-center justify-center gap-2 text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight leading-snug drop-shadow-xs">
            <span>خرائط</span>
            
            {/* Authentic Official Google Vector SVG Logo */}
            <span className="inline-flex items-center mx-1.5 align-middle select-none">
              <svg
                className="h-8 sm:h-10 md:h-11 w-auto"
                viewBox="0 0 272 92"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Google"
              >
                <path fill="#EA4335" d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path fill="#FBBC05" d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"/>
                <path fill="#4285F4" d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"/>
                <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z"/>
                <path fill="#EA4335" d="M262.02 54.48l7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-13.27-8.23l19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"/>
                <path fill="#4285F4" d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.15 69.35 0 53.78 0 34.68 0 15.57 16.15 0 35.29 0c9.83 0 17.14 3.86 22.43 8.91l-6.3 6.3c-3.86-3.61-9.07-6.47-16.13-6.47-13.1 0-23.44 10.59-23.44 23.69 0 13.1 10.33 23.69 23.44 23.69 8.48 0 13.36-3.44 16.46-6.55 2.52-2.52 4.2-6.13 4.87-11.17H35.29z"/>
              </svg>
            </span>
            
            <span>أقوى مع</span>
          </div>

          {/* Najma Calligraphy Brand Logo - Centered Prominently on its Own Line */}
          <div className="pt-1 pb-1 flex items-center justify-center">
            <span
              onClick={handleHeroLogoTripleClick}
              className="inline-flex items-center cursor-pointer transform hover:scale-105 transition-transform duration-200"
            >
              <NajmaLogo size="xl" color="#006644" />
            </span>
          </div>
        </div>

        {/* 3. Short Marketing Description - Exactly as Screen */}
        <p className="text-center text-sm sm:text-base text-slate-700 font-medium leading-relaxed max-w-xl mx-auto mt-4 px-2">
          {heroTexts?.description ||
            'نساعدك على تصدر قائمة الـ 3 الأوائل على خرائط جوجل وحصد ثقة آلاف العملاء شهرياً عبر تقييمات إيجابية حقيقية بحسابات محلية نشطة وضمان مدى الحياة.'}
        </p>

        {/* 4. Action Buttons: 5 Platform Buttons Stacked Under Each Other, Followed by Reviews Button */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2.5 max-w-sm mx-auto w-full px-3">
          
          {/* Stacked Platform Buttons */}
          {platformButtons.map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => handlePlatformClick(btn.id)}
              className={`w-full flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-150 active:scale-98 group cursor-pointer ${btn.bgClass}`}
            >
              <div className="flex items-center gap-3">
                <PlatformIcon platform={btn.id} size="sm" />
                <span className="font-bold text-sm sm:text-base">{btn.title}</span>
              </div>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform opacity-75 group-hover:opacity-100" />
            </button>
          ))}

          {/* Secondary CTA: شاهد آراء عملائنا (Navigates to reviews page) */}
          <button
            type="button"
            onClick={handleViewReviews}
            className="w-full flex items-center justify-center gap-2.5 px-6 py-2.5 mt-1 rounded-full bg-white/95 backdrop-blur-xs hover:bg-slate-50 text-slate-800 text-sm sm:text-base font-bold border border-slate-200 shadow-sm hover:shadow-md transition-all duration-150 active:scale-98 group cursor-pointer"
          >
            {/* Google Multicolored "G" */}
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>

            <span className="font-bold text-slate-900 text-sm">4.9</span>
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span className="text-slate-800 font-bold">شاهد آراء عملائنا</span>
            <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-0.5 transition-transform" />
          </button>

        </div>

        {/* 5. Handwritten Accent & Melted Flow */}
        <div className="relative mt-4 mb-2 max-w-xl mx-auto flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-xs border border-emerald-200/80 shadow-2xs">
            <span
              className="font-bold text-xs sm:text-sm text-[#006644] leading-tight"
              style={{ fontFamily: "'Marhey', cursive, sans-serif" }}
            >
              ظهور أقوى وتصدر فوري على الخرائط
            </span>
            {/* Hand-drawn curved arrow */}
            <svg
              className="w-5 h-5 text-[#006644] transform -rotate-12"
              viewBox="0 0 50 50"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M 38 6 Q 42 26 14 36" />
              <path d="M 22 36 L 14 36 L 17 28" />
            </svg>
          </div>
        </div>

        {/* 6. Four Statistics Cards with Smooth Animated Numbers */}
        <div className="mt-6 bg-white/95 backdrop-blur-xs rounded-3xl border border-slate-200/80 shadow-md p-4 sm:p-6 max-w-3xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 text-center items-center">
            
            {/* Stat 1 (Right): +90% */}
            <div className="space-y-1 px-2">
              <div className="w-11 h-11 rounded-full bg-[#eaf6f0] text-[#006644] flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-sans tracking-tight">
                +{Math.round(countGrowth)}%
              </div>
              <div className="text-xs text-slate-600 font-medium leading-snug">
                زيادة في جولاتك على الخريطة
              </div>
            </div>

            {/* Stat 2: 99.4%+ */}
            <div className="space-y-1 px-2 border-r border-slate-100 sm:border-r-0">
              <div className="w-11 h-11 rounded-full bg-[#eaf6f0] text-[#006644] flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-sans tracking-tight">
                {countSatisfaction.toFixed(1)}%+
              </div>
              <div className="text-xs text-slate-600 font-medium leading-snug">
                نسبة رضا العملاء
              </div>
            </div>

            {/* Stat 3: +14,850 */}
            <div className="space-y-1 px-2 border-t border-slate-100 sm:border-t-0 pt-3 sm:pt-0">
              <div className="w-11 h-11 rounded-full bg-[#eaf6f0] text-[#006644] flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-sans tracking-tight">
                +{Math.round(countTotalReviews).toLocaleString('en-US')}
              </div>
              <div className="text-xs text-slate-600 font-medium leading-snug">
                تقييم موثق في خرائط جوجل
              </div>
            </div>

            {/* Stat 4 (Left): 4.9/5 with "بناء علي تقييم عملاء 14850" */}
            <div className="space-y-1 px-2 border-t border-r border-slate-100 sm:border-t-0 sm:border-r-0 pt-3 sm:pt-0">
              <div className="w-11 h-11 rounded-full bg-[#eaf6f0] text-[#006644] flex items-center justify-center mx-auto mb-2">
                <Star className="w-5 h-5 fill-[#006644] text-[#006644]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-950 font-sans tracking-tight">
                {countRating.toFixed(1)}/5
              </div>
              <div className="text-xs text-slate-600 font-medium leading-snug">
                بناء علي تقييم عملاء 14850
              </div>
            </div>

          </div>
        </div>

        {/* 7. "لماذا تختار نجمة؟" Section */}
        <div className="mt-10 max-w-3xl mx-auto">
          
          {/* Divider Title */}
          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto mb-6">
            <div className="flex-1 h-[1.5px] bg-[#006644]" />
            <h2 className="text-base sm:text-lg font-bold text-[#006644] whitespace-nowrap">
              لماذا تختار نجمة؟
            </h2>
            <div className="flex-1 h-[1.5px] bg-[#006644]" />
          </div>

          {/* 4 Feature Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            
            {/* Feature 1 (Right): تنفيذ سريع */}
            <div className="space-y-1 p-2">
              <div className="w-11 h-11 rounded-full bg-[#eaf6f0] text-[#006644] flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 fill-[#006644]" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                تنفيذ سريع
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                من ساعة ل 48 ساعة
              </div>
            </div>

            {/* Feature 2: حضور أقوى */}
            <div className="space-y-1 p-2">
              <div className="w-11 h-11 rounded-full bg-[#eaf6f0] text-[#006644] flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                حضور أقوى
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                على خرائط جوجل
              </div>
            </div>

            {/* Feature 3: مراجعات حقيقية */}
            <div className="space-y-1 p-2">
              <div className="w-11 h-11 rounded-full bg-[#eaf6f0] text-[#006644] flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                مراجعات حقيقية
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                وموثوقة
              </div>
            </div>

            {/* Feature 4 (Left): دعم سريع */}
            <div className="space-y-1 p-2">
              <div className="w-11 h-11 rounded-full bg-[#eaf6f0] text-[#006644] flex items-center justify-center mx-auto mb-2">
                <Headphones className="w-5 h-5" />
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900">
                دعم سريع
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 font-medium">
                عبر واتساب
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
