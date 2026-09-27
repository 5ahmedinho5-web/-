import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PackagesSection } from './components/PackagesSection';
import { FeaturesSection } from './components/FeaturesSection';
import { AboutSection } from './components/AboutSection';
import { WhyUsSection } from './components/WhyUsSection';
import { ReviewsSection } from './components/ReviewsSection';
import { FAQSection } from './components/FAQSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { SmartBot } from './components/SmartBot';
import { OrderModal } from './components/OrderModal';
import { AddReviewModal } from './components/AddReviewModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ArrowRight, Sparkles } from 'lucide-react';
import { NavSection } from './types';

const SECTION_TITLES: Record<NavSection, string> = {
  home: 'الرئيسية',
  packages: 'باقات وحزم التقييمات',
  features: 'مميزات الخدمة',
  about: 'من نحن',
  'why-us': 'لماذا نجمة؟',
  reviews: 'آراء وتقييمات العملاء',
  faq: 'الأسئلة الشائعة',
  contact: 'طرق الطلب والتواصل',
};

const MainContent: React.FC = () => {
  const { currentSection, setCurrentSection, isHeaderHidden, isPageLoading, storeSettings } = useStore();

  return (
    <main className="min-h-[75vh]">
      {/* Simulated Browser Page Progress Bar on Navigation */}
      {isPageLoading && (
        <div className="fixed top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-400 via-[#006644] to-emerald-600 z-50 animate-pulse shadow-sm" />
      )}

      {/* Navigation Subheader for Standalone Pages: Only ONE return button on top right, hides completely on scroll down */}
      {currentSection !== 'home' && (
        <div
          className={`fixed top-18 sm:top-20 inset-x-0 z-30 bg-slate-50/95 backdrop-blur-md border-b border-slate-200/80 py-2.5 transition-all duration-300 ease-in-out ${
            isHeaderHidden
              ? '-translate-y-[280%] opacity-0 pointer-events-none shadow-none'
              : 'translate-y-0 opacity-100 shadow-xs'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Top-Right Return Button ONLY (أقصى اليمين في RTL) */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setCurrentSection('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:border-[#006644] text-slate-800 hover:text-[#006644] text-xs sm:text-sm font-bold shadow-2xs hover:bg-[#edf8f3] transition-all cursor-pointer active:scale-95 group"
                title="الرجوع إلى الصفحة الرئيسية"
              >
                <ArrowRight className="w-4 h-4 text-[#006644] group-hover:translate-x-0.5 transition-transform" />
                <span>العودة للرئيسية</span>
              </button>

              {/* Breadcrumb indicator */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <span>/</span>
                <span className="text-[#006644] font-bold">{SECTION_TITLES[currentSection]}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standalone Pages Container with Top Padding Offset for Subheader */}
      <div
        key={currentSection}
        className={`animate-in fade-in duration-200 ${
          currentSection !== 'home' ? 'pt-12 sm:pt-14' : ''
        }`}
      >
        {currentSection === 'home' && <HeroSection />}
        {currentSection === 'packages' && <PackagesSection />}
        {currentSection === 'features' && <FeaturesSection />}
        {currentSection === 'about' && <AboutSection />}
        {currentSection === 'why-us' && <WhyUsSection />}
        {currentSection === 'reviews' && <ReviewsSection />}
        {currentSection === 'faq' && <FAQSection />}
        {currentSection === 'contact' && <ContactSection />}
      </div>
    </main>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#006644] selection:text-white" dir="rtl">
        {/* Main Header with Auto-hide on scroll */}
        <Header />

        {/* Content Wrapper offset for fixed header */}
        <div className="pt-18 sm:pt-20">
          <MainContent />
        </div>

        {/* Public Footer */}
        <Footer />

        {/* Floating Cute Smart Bot */}
        <SmartBot />

        {/* Modals & Dialogs */}
        <OrderModal />
        <AddReviewModal />
        <AdminDashboard />
      </div>
    </StoreProvider>
  );
}
