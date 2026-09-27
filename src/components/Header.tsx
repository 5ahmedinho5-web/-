import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  ChevronDown,
  MessageCircle,
  Home,
  Layers,
  ShieldCheck,
  Sparkles,
  Trophy,
  Star,
  HelpCircle,
  PhoneCall,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { GCCCurrencyCode, NavSection, PlatformCategory } from '../types';
import { NajmaLogo } from './NajmaLogo';
import { PlatformIcon } from './PlatformIcon';

export const Header: React.FC = () => {
  const {
    currentSection,
    setCurrentSection,
    selectedPlatform,
    navigateToPlatformPackages,
    isHeaderHidden,
    setIsHeaderHidden,
    currentCurrency,
    setCurrentCurrency,
    storeSettings,
    setIsAdminModalOpen,
  } = useStore();

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMenuBtnBurst, setIsMenuBtnBurst] = useState(false);
  const [isPackagesSubmenuOpen, setIsPackagesSubmenuOpen] = useState(true);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [clickedItemId, setClickedItemId] = useState<NavSection | null>(null);

  const toggleSideMenu = () => {
    setIsMenuBtnBurst(true);
    setTimeout(() => setIsMenuBtnBurst(false), 450);
    setIsSideMenuOpen((prev) => !prev);
  };

  // If menu or dropdown is open, force header to be visible
  useEffect(() => {
    if (isSideMenuOpen || isCurrencyDropdownOpen) {
      setIsHeaderHidden(false);
    }
  }, [isSideMenuOpen, isCurrencyDropdownOpen, setIsHeaderHidden]);

  // Reliable 3-clicks handler on "نجمة" for Admin Dashboard
  const clickTimesRef = useRef<number[]>([]);
  const [showAdminIndicator, setShowAdminIndicator] = useState(false);

  const handleNajmaTripleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const now = Date.now();
    // Keep clicks occurring within the last 1500ms
    clickTimesRef.current = [...clickTimesRef.current.filter((t) => now - t < 1500), now];

    if (clickTimesRef.current.length >= 3) {
      clickTimesRef.current = [];
      setShowAdminIndicator(true);
      setTimeout(() => setShowAdminIndicator(false), 800);
      setIsAdminModalOpen(true);
    }
  };

  const platformOptions: { id: PlatformCategory; label: string }[] = [
    { id: 'google-maps', label: 'حزم خرائط جوجل' },
    { id: 'snapchat', label: 'حزم سناب شات' },
    { id: 'facebook', label: 'حزم فيس بوك' },
    { id: 'instagram', label: 'حزم انستقرام' },
    { id: 'tiktok', label: 'حزم تيك توك' },
  ];

  const navItems: { id: NavSection; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'الرئيسية', icon: Home },
    { id: 'packages', label: 'الحزم وباقات المنصات', icon: Layers },
    { id: 'features', label: 'مميزات الخدمة', icon: ShieldCheck },
    { id: 'about', label: 'من نحن', icon: Sparkles },
    { id: 'why-us', label: 'لماذا نجمة؟', icon: Trophy },
    { id: 'reviews', label: 'آراء العملاء', icon: Star },
    { id: 'faq', label: 'الأسئلة الشائعة', icon: HelpCircle },
    { id: 'contact', label: 'طرق الطلب والتواصل', icon: PhoneCall },
  ];

  const handleNavClick = (sectionId: NavSection) => {
    if (sectionId === 'packages') {
      setIsPackagesSubmenuOpen((prev) => !prev);
      return;
    }
    setClickedItemId(sectionId);
    setTimeout(() => {
      setCurrentSection(sectionId);
      setIsSideMenuOpen(false);
      setClickedItemId(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 180);
  };

  const currentCurrencyData = storeSettings.currencies[currentCurrency];

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xs transition-transform duration-300 ease-in-out ${
          isHeaderHidden ? '-translate-y-full' : 'translate-y-0'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 sm:h-20 relative">
            
            {/* 1. Right (أقصى اليمين في RTL): Hamburger Menu Button with 3 Green Stripes & Click Burst Effect */}
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleSideMenu}
                className={`relative w-11 h-11 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer active:scale-90 shadow-2xs group overflow-hidden select-none ${
                  isSideMenuOpen
                    ? 'border-emerald-500 bg-emerald-50 text-[#006644] shadow-[0_0_18px_rgba(16,185,129,0.4)]'
                    : 'border-slate-200/90 hover:border-emerald-300 hover:bg-[#edf8f3] text-[#006644] hover:shadow-md'
                }`}
                aria-label="القائمة"
                title="القائمة الرئيسية"
              >
                {/* Tactile Click Burst Effect */}
                {isMenuBtnBurst && (
                  <span className="absolute inset-0 rounded-2xl bg-emerald-400/40 animate-menu-ripple pointer-events-none" />
                )}
                {/* Animated 3 Stripes with morphing and wave effect */}
                <span
                  className={`h-[2.5px] bg-[#006644] rounded-full transition-all duration-300 ${
                    isSideMenuOpen ? 'w-5 rotate-45 translate-y-[5.5px] bg-emerald-700' : 'w-5 group-hover:w-6 group-hover:bg-emerald-600'
                  }`}
                />
                <span
                  className={`h-[2.5px] bg-[#006644] rounded-full transition-all duration-200 ${
                    isSideMenuOpen ? 'w-0 opacity-0' : 'w-5 group-hover:bg-emerald-600'
                  }`}
                />
                <span
                  className={`h-[2.5px] bg-[#006644] rounded-full transition-all duration-300 ${
                    isSideMenuOpen ? 'w-5 -rotate-45 -translate-y-[5.5px] bg-emerald-700' : 'w-5 group-hover:w-4 group-hover:bg-emerald-600'
                  }`}
                />
              </button>
            </div>

            {/* 2. Center (المنتصف): Wide Horizontal Calligraphy Logo "نجمة" with 3-Clicks Secret Admin Handler */}
            <div className="absolute left-1/2 -translate-x-1/2 text-center flex items-center justify-center">
              <button
                type="button"
                onClick={handleNajmaTripleClick}
                className="select-none focus:outline-none cursor-pointer group relative py-1"
                aria-label="نجمة"
              >
                <div
                  className={`transition-transform duration-200 ${
                    showAdminIndicator ? 'scale-105' : 'group-active:scale-95'
                  }`}
                >
                  <NajmaLogo size="md" color="#006644" />
                </div>
              </button>
            </div>

            {/* 3. Left (أقصى اليسار في RTL): Currency Pill Button: [ v  SAR  🇸🇦 ] */}
            <div className="flex items-center pr-1 sm:pr-0">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs active:scale-95"
                  aria-haspopup="true"
                  aria-expanded={isCurrencyDropdownOpen}
                  title="تغيير العملة"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                      isCurrencyDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                  <span className="font-mono text-xs font-bold text-slate-900">{currentCurrencyData?.code}</span>
                  <span className="text-sm leading-none">{currentCurrencyData?.flag}</span>
                </button>

                {/* Dropdown Menu */}
                {isCurrencyDropdownOpen && (
                  <div
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-right"
                    role="menu"
                  >
                    <div className="px-3 py-2 text-[11px] font-bold text-slate-400 border-b border-slate-100">
                      عملات دول الخليج العربي
                    </div>
                    <div className="py-1 space-y-0.5">
                      {(Object.keys(storeSettings.currencies) as GCCCurrencyCode[]).map((code) => {
                        const c = storeSettings.currencies[code];
                        const isSelected = code === currentCurrency;
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => {
                              setCurrentCurrency(code);
                              setIsCurrencyDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer active:scale-95 ${
                              isSelected ? 'bg-emerald-50 text-[#006644] font-bold' : 'text-slate-700 hover:bg-slate-50'
                            }`}
                            role="menuitem"
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{c.flag}</span>
                              <span className="font-medium">{c.nameAr}</span>
                            </div>
                            <span className="font-mono font-bold text-xs">{c.code}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Side Navigation Drawer with Tactile Animations & Luxury Micro-interactions */}
      {isSideMenuOpen && (
        <div className="fixed inset-0 z-50 flex" dir="rtl">
          {/* Backdrop overlay with smooth fade */}
          <div
            className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-250 cursor-pointer"
            onClick={() => setIsSideMenuOpen(false)}
          />

          {/* Side Drawer Panel */}
          <div className="relative w-88 max-w-[88vw] bg-white h-full shadow-[0_0_50px_rgba(0,0,0,0.35)] z-10 flex flex-col justify-between p-5 sm:p-6 animate-in slide-in-from-right duration-300 ease-out overflow-y-auto no-scrollbar border-l border-emerald-100/80">
            
            {/* Top of Drawer: Logo + Badge + Animated Close Button */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <NajmaLogo size="sm" color="#006644" />
                  <div className="flex items-center gap-1 text-[11px] font-black text-[#006644] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-[#006644]" />
                    <span>القائمة الرئيسية</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSideMenuOpen(false)}
                  className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 border border-slate-100 hover:border-slate-200 transition-all cursor-pointer active:scale-90 hover:rotate-90 shadow-2xs"
                  aria-label="إغلاق القائمة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links with Tactile Feedback, Shimmer & Staggered Animation */}
              <nav className="space-y-2">
                {navItems.map((item, idx) => {
                  const isActive = currentSection === item.id;
                  const isPressed = clickedItemId === item.id;
                  const Icon = item.icon;
                  const isPackages = item.id === 'packages';

                  return (
                    <div
                      key={item.id}
                      className="space-y-1.5 animate-menu-item-in"
                      style={{ animationDelay: `${idx * 35 + 20}ms` }}
                    >
                      <button
                        type="button"
                        onClick={() => handleNavClick(item.id)}
                        className={`relative w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-black transition-all duration-200 text-right cursor-pointer group active:scale-98 overflow-hidden select-none border ${
                          isPressed
                            ? 'scale-98 bg-[#004d32] text-white ring-1 ring-emerald-400 shadow-inner'
                            : isActive
                            ? 'bg-gradient-to-l from-[#005236] via-[#006644] to-[#007a52] text-white shadow-sm border-emerald-400/40 ring-1 ring-emerald-300/20'
                            : 'bg-white hover:bg-emerald-50/70 text-slate-800 hover:text-[#006644] border-slate-100/90 hover:border-emerald-200/80 shadow-2xs hover:shadow-xs'
                        }`}
                      >
                        {/* Moving subtle shimmer on hover */}
                        <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 group-hover:animate-cta-shimmer" />

                        {/* Click burst ripple */}
                        {isPressed && (
                          <span className="absolute inset-0 bg-emerald-400/20 rounded-2xl animate-menu-ripple pointer-events-none" />
                        )}

                        <div className="flex items-center gap-3 relative z-10">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 ${
                              isActive || isPressed
                                ? 'bg-white/20 text-white shadow-inner backdrop-blur-xs ring-1 ring-white/30'
                                : 'bg-slate-100 text-slate-600 group-hover:bg-[#006644] group-hover:text-white group-hover:scale-105 group-hover:shadow-xs'
                            }`}
                          >
                            <Icon className="w-4.5 h-4.5" />
                          </div>
                          <span className="font-black text-sm tracking-tight">{item.label}</span>
                        </div>

                        <div className="flex items-center gap-1.5 relative z-10">
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-white/20 text-emerald-100 px-2 py-0.5 rounded-full font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                              <span>النشطة</span>
                            </span>
                          )}

                          {isPackages ? (
                            <ChevronDown
                              className={`w-4 h-4 transition-transform duration-200 ${
                                isPackagesSubmenuOpen ? 'rotate-180 text-emerald-400' : ''
                              } ${isActive || isPressed ? 'text-white' : 'text-slate-400 group-hover:text-[#006644]'}`}
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center transition-colors">
                              <ArrowLeft
                                className={`w-3.5 h-3.5 transition-all duration-200 group-hover:-translate-x-1 ${
                                  isActive || isPressed ? 'text-white' : 'text-slate-400 group-hover:text-[#006644]'
                                }`}
                              />
                            </div>
                          )}
                        </div>
                      </button>

                      {/* Sub-options for Packages */}
                      {isPackages && isPackagesSubmenuOpen && (
                        <div className="pr-3 pl-1 py-1.5 space-y-1.5 border-r-2 border-emerald-400/40 mr-4 animate-in fade-in slide-in-from-top-2 duration-200">
                          {platformOptions.map((p, pIdx) => {
                            const isPlatformActive = currentSection === 'packages' && selectedPlatform === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => {
                                  navigateToPlatformPackages(p.id);
                                  setIsSideMenuOpen(false);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                style={{ animationDelay: `${pIdx * 30}ms` }}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-right cursor-pointer group active:scale-95 border ${
                                  isPlatformActive
                                    ? 'bg-gradient-to-l from-[#005a3c] to-[#006644] text-white border-emerald-400 shadow-xs'
                                    : 'text-slate-700 bg-slate-50/90 hover:bg-emerald-50 hover:text-[#006644] border-slate-100 hover:border-emerald-200/80 hover:translate-x-[-2px]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <PlatformIcon platform={p.id} size="sm" />
                                  <span className="font-bold">{p.label}</span>
                                </div>
                                <ArrowLeft
                                  className={`w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 ${
                                    isPlatformActive ? 'text-white' : 'text-slate-400 group-hover:text-[#006644]'
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom of Drawer: Prominent WhatsApp Button with Soft Elegant Glow */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5">
              <div className="relative group/wabtn">
                <div className="absolute -inset-0.5 rounded-2xl bg-emerald-500/20 opacity-30 blur-sm group-hover/wabtn:opacity-60 transition-opacity animate-cta-glow pointer-events-none" />
                <a
                  href={`https://wa.me/${storeSettings.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent('السلام عليكم ورحمة الله، أرغب بالاستفسار عن حزم تقييمات Google Maps في متجر نجمة 🌟')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full py-3.5 px-4 rounded-2xl bg-gradient-to-l from-[#005a3c] via-[#006644] to-[#007850] hover:from-[#006644] hover:to-[#008f5f] text-white text-sm font-black shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 overflow-hidden"
                >
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none animate-cta-shimmer" />
                  <MessageCircle className="w-4.5 h-4.5 shrink-0 relative z-10 text-emerald-200" />
                  <span className="relative z-10 font-black">تواصل عبر واتساب الآن</span>
                </a>
              </div>
              <p className="text-[11px] text-center text-slate-500 font-medium">
                رد فوري ومباشر على مدار الساعة
              </p>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
